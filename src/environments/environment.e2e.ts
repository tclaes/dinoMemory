// Used by `ng serve --configuration e2e`: points Firebase Auth at the local emulator.
export const environment = {
  production: false,
  authEmulatorUrl: 'http://127.0.0.1:9099',
  firebaseConfig: {
    apiKey: 'AIzaSyAFkSuqDHHr0pNtXm2oJnY1WBNDwJNjwiQ',
    authDomain: 'dinomemory-10d97.firebaseapp.com',
    databaseURL: 'https://dinomemory-10d97.firebaseio.com',
    storageBucket: 'dinomemory-10d97.appspot.com',
    projectId: 'dinomemory-10d97'
  }
};
