// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6ZLEesPrFgphOyf70xlGbye8MzoJXCck",
  authDomain: "lastchance-75c9f.firebaseapp.com",
  databaseURL: "https://lastchance-75c9f-default-rtdb.firebaseio.com",
  projectId: "lastchance-75c9f",
  storageBucket: "lastchance-75c9f.firebasestorage.app",
  messagingSenderId: "136971329354",
  appId: "1:136971329354:web:52d6f570a517628f956bb3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const counterRef = db.ref('countdown/value'); // path in database

const counterEl = document.getElementById('counter');
const circle = document.getElementById('circle');

// Listen for realtime updates
counterRef.on('value', snapshot => {
  const value = snapshot.val();
  if (value !== null) counterEl.textContent = value;
});

// Reset counter when clicked
circle.addEventListener('click', () => {
  counterRef.set(60);
});

// Countdown tick every second
setInterval(() => {
  counterRef.transaction(current => {
    if (current === null) return 60;
    if (current > 0) return current - 1;
    return 0;
  });
}, 1000);
