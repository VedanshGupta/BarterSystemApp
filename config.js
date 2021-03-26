import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBdPVlNpDGfivW8zK0o-Roi9C1Pr6Cqq7k",
    authDomain: "bartersystemapp-97338.firebaseapp.com",
    projectId: "bartersystemapp-97338",
    storageBucket: "bartersystemapp-97338.appspot.com",
    messagingSenderId: "749247156923",
    appId: "1:749247156923:web:4cef5eeadd59baf7cc0f9e"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
