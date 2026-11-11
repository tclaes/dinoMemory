const EXIT_TIMEOUT_MS = 2000;

let displayTransitionSupported: boolean | undefined;

/**
 * Whether a discrete `display` transition really runs. Firefox parses `allow-discrete` but does not
 * transition `display`, so probe with a throwaway element instead of trusting `CSS.supports`.
 */
export function canTransitionDisplay(): boolean {
  if (displayTransitionSupported !== undefined) {
    return displayTransitionSupported;
  }
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  displayTransitionSupported = getComputedStyle(probe).display === 'block';
  probe.remove();
  return displayTransitionSupported;
}

/** Whether the browser can animate an element out of the top layer with CSS alone. */
export function supportsTopLayerExit(): boolean {
  return !!window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
}

/**
 * Closes a dialog with its exit animation. Without native support, `data-closing` triggers the exit
 * transition while the dialog is still in the top layer, and the dialog closes once it has settled.
 */
export async function closeTopLayer(dialog: HTMLDialogElement): Promise<void> {
  if (!dialog.open) {
    return;
  }
  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations?.({subtree: true}) ?? [];
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map(animation => animation.finished)),
        new Promise(resolve => setTimeout(resolve, EXIT_TIMEOUT_MS))
      ]);
    }
    if (!dialog.hasAttribute('data-closing')) {
      return;
    }
    dialog.removeAttribute('data-closing');
  }
  dialog.close();
}

/** Browsers without `closedby` need light dismiss by hand. */
export function lacksClosedBy(): boolean {
  return !('closedBy' in HTMLDialogElement.prototype);
}

/**
 * Whether a pointer event lies outside the dialog box. Tests the position, not `event.target`:
 * the dialog is also the target for its own padding and the gaps between its children.
 */
export function isOutsideDialog(event: PointerEvent, dialog: HTMLDialogElement): boolean {
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right
    || event.clientY < rect.top || event.clientY > rect.bottom;
}
