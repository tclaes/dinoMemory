// zone.js/testing (loaded by the unit-test builder) only patches Jasmine/Mocha/Jest.
// This wraps Vitest's global describe/it/beforeEach in zones so fakeAsync() and tick() work.
import 'zone.js/plugins/vitest-patch';
