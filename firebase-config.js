// Remplace ces valeurs par celles de TON projet Firebase
// (Firebase Console > Paramètres du projet > Général > Tes applications > SDK setup)
const firebaseConfig = {
  apiKey: "AIzaSyBEFl0rWhsVrCkvWBBCUfxK9b2KqekDrzc",
  authDomain: "enchere-affaires-chine.firebaseapp.com",
  databaseURL: "https://enchere-affaires-chine-default-rtdb.asia-southeast1.firebasedatabase.app", // important: c'est l'URL Realtime Database
  projectId: "enchere-affaires-chine",
  storageBucket: "enchere-affaires-chine.firebasestorage.app",
  messagingSenderId: "774035890813",
  appId: "1:774035890813:web:1dc1778bae47a46a6f4714"
};

const BUDGET_PAR_PERSONNE = 800; // en Yuans
const ADMIN_PASSWORD = "2303"; // mot de passe pour accéder à admin.html (protection basique, pas une vraie sécurité)