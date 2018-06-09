import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBVMk-Y4arvGHTnQeAxiQJDHvVdsC0zdpA',
  authDomain: 'catscrop.firebaseapp.com',
  databaseURL: 'https://catscrop.firebaseio.com',
  projectId: 'catscrop',
  storageBucket: 'gs://catscrop.appspot.com',
  messagingSenderId: '921766858589',
};
firebase.initializeApp(config);
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  debugger;
  e.preventDefault();
  // Stash the event so it can be triggered later.
});

const database = firebase.database();
const storage = firebase.storage();

export default {
  database,
  storage,
  addNewCat: (url, comment, info) => {
    const cat = {
      url,
      comment,
      info,
      created_at: -1 * new Date().getTime(),
    };

    return firebase.database().ref('cats').push(cat);
  },
};
