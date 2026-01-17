// ----------------- Firebase config -----------------
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

const counterRef = db.ref('countdown/value'); // KEEP for optional history
const endsAtRef = db.ref('countdown/endsAt'); // NEW for local timer sync

const counterEl = document.getElementById('counter');
const circle = document.getElementById('circle');

const DURATION = 60 * 1000;
let localInterval = null;

// ----------------- Firebase listener (for history or optional sync) -----------------
counterRef.on('value', snapshot => {
  const value = snapshot.val();
  // Optional: update display if desired, but SSE will be authoritative
  // counterEl.textContent = value;
});

// ----------------- Reset counter (Firebase + SSE) -----------------
circle.addEventListener('click', () => {
  const endsAt = Date.now() + DURATION;
  endsAtRef.set(endsAt);

  // Immediately show 60 visually
  counterEl.textContent = 60;

  // Reset the SSE server timer
  fetch('http://localhost:3000/reset', { method: 'POST' });
});

// ----------------- Unified countdown based on endsAt (local only, no Firebase writes) -----------------
endsAtRef.on('value', snapshot => {
  const endsAt = snapshot.val();
  if (!endsAt) return;

  if (localInterval) clearInterval(localInterval);

  localInterval = setInterval(() => {
    const remainingMs = endsAt - Date.now();
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    // Only update the display locally — no Firebase write here
    counterEl.textContent = remainingSec;

    if (remainingMs <= 0) clearInterval(localInterval);
  }, 1000);
});

// ----------------- SSE authoritative timer -----------------
const es = new EventSource('http://localhost:3000/countdown');
es.onmessage = e => {
  const serverValue = parseInt(e.data, 10);
  if (!isNaN(serverValue)) {
    counterEl.textContent = serverValue;
    // Optional: keep Firebase in sync once per reset only if desired
    // counterRef.set(serverValue);
  }
};
