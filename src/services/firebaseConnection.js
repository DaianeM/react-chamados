import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyAlTl-SFbbvclhSQhqGql4Zi18UrCL-x7k",
    authDomain: "sistema-chamados-c9e59.firebaseapp.com",
    projectId: "sistema-chamados-c9e59",
    storageBucket: "sistema-chamados-c9e59.appspot.com",
    messagingSenderId: "78275284077",
    appId: "1:78275284077:web:f05dc9613cf2a569d1c364",
    measurementId: "G-VR9SPSDPGK"
};
  // Initialize Firebase
  //se não há uma conexão estabelecida, abra
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
