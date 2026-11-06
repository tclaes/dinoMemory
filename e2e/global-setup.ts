import { connect } from 'node:net';

const EMULATORS = [
  { name: 'Auth', port: 9099 },
  { name: 'Firestore', port: 8080 },
];
const TIMEOUT_MS = 30_000;

const accepts = (port: number) =>
  new Promise<boolean>((resolve) => {
    const socket = connect({ host: '127.0.0.1', port });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });

/**
 * Playwright's webServer can only wait for one URL, and the emulators do not come up together
 * (Firestore is reachable seconds before Auth). Wait for every emulator the tests use.
 */
export default async function globalSetup() {
  const deadline = Date.now() + TIMEOUT_MS;
  for (const { name, port } of EMULATORS) {
    while (!(await accepts(port))) {
      if (Date.now() > deadline) {
        throw new Error(`The ${name} emulator did not accept connections on port ${port} within ${TIMEOUT_MS / 1000}s.`);
      }
      await new Promise((r) => setTimeout(r, 200));
    }
  }
}
