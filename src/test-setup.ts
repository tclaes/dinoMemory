// zone.js/testing (loaded by the unit-test builder) only patches Jasmine/Mocha/Jest.
// This wraps Vitest's global describe/it/beforeEach in zones so fakeAsync() and tick() work.
import 'zone.js/plugins/vitest-patch';

// jsdom does not implement the modal methods of <dialog>; this stands in for the browser.
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  if (!this.hasAttribute('open')) {
    return;
  }
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};
