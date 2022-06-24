// Import the functions you need from the SDKs you need
import firebase from 'firebase';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIKhVtNGbx5DCwoZhJSLlkyZHxiV3fMFQ",
  authDomain: "simplywork-7ec14.firebaseapp.com",
  projectId: "simplywork-7ec14",
  storageBucket: "simplywork-7ec14.appspot.com",
  messagingSenderId: "870604558562",
  appId: "1:870604558562:web:5889f40bc8bfcb2ba84ebb"
};

// Initialize Firebase


 var app = firebase.initializeApp(firebaseConfig)
 
                                                                 
export default firebase.firestore(app);