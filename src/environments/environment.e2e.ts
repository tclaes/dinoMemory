// Used by `ng serve --configuration e2e`: points Firebase Auth and Firestore at the local emulators.
export const environment = {
  production: false,
  authEmulatorUrl: 'http://127.0.0.1:9099',
  firestoreEmulator: {host: '127.0.0.1', port: 8080},
  firebaseConfig: {
    apiKey: 'AIzaSyAFkSuqDHHr0pNtXm2oJnY1WBNDwJNjwiQ',
    authDomain: 'dinomemory-10d97.firebaseapp.com',
    databaseURL: 'https://dinomemory-10d97.firebaseio.com',
    storageBucket: 'dinomemory-10d97.appspot.com',
    projectId: 'dinomemory-10d97'
  }
};
