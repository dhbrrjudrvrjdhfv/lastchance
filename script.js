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

const counterRef = db.ref('countdown/value'); // KEEP (display value)
const endsAtRef = db.ref('countdown/endsAt'); // NEW (authoritative time)

const counterEl = document.getElementById('counter');
const circle = document.getElementById('circle');

const DURATION = 60 * 1000;
let localInterval = null;

// Listen for realtime updates (KEEP)
counterRef.on('value', snapshot => {
  const value = snapshot.val();
  if (value !== null) counterEl.textContent = value;
});

// Reset counter when clicked (slightly extended, not changed in intent)
circle.addEventListener('click', () => {
  const endsAt = Date.now() + DURATION;
  endsAtRef.set(endsAt);
});

// NEW: unified countdown based on timestamp
endsAtRef.on('value', snapshot => {
  const endsAt = snapshot.val();
  if (!endsAt) return;

  if (localInterval) clearInterval(localInterval);

  localInterval = setInterval(() => {
    const remainingMs = endsAt - Date.now();
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    // Update shared display value (safe single write per second)
    counterRef.set(remainingSec);

    if (remainingMs <= 0) clearInterval(localInterval);
  }, 1000);
});
