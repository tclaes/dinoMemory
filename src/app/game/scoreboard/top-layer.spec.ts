import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {closeTopLayer} from './top-layer';

describe('closeTopLayer', () => {
  let dialog: HTMLDialogElement;

  beforeEach(() => {
    dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    dialog.close = vi.fn(() => dialog.removeAttribute('open'));
    document.body.appendChild(dialog);
  });

  afterEach(() => {
    dialog.remove();
    vi.useRealTimers();
  });

  it('closes at once when there is nothing to animate', async () => {
    await closeTopLayer(dialog);

    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.hasAttribute('data-closing')).toBe(false);
  });

  it('marks the dialog as closing and closes it once its animations have finished', async () => {
    let finish: () => void;
    const finished = new Promise<void>(resolve => finish = resolve);
    dialog.getAnimations = () => [{finished}] as unknown as Animation[];

    const closing = closeTopLayer(dialog);
    expect(dialog.hasAttribute('data-closing')).toBe(true);
    expect(dialog.close).not.toHaveBeenCalled();

    finish();
    await closing;

    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.hasAttribute('data-closing')).toBe(false);
  });

  it('closes anyway when an animation never finishes', async () => {
    vi.useFakeTimers();
    dialog.getAnimations = () => [{finished: new Promise(() => undefined)}] as unknown as Animation[];

    const closing = closeTopLayer(dialog);
    await vi.advanceTimersByTimeAsync(2000);
    await closing;

    expect(dialog.close).toHaveBeenCalledTimes(1);
  });

  it('does nothing for a dialog that is already closed', async () => {
    dialog.removeAttribute('open');

    await closeTopLayer(dialog);

    expect(dialog.close).not.toHaveBeenCalled();
  });
});
