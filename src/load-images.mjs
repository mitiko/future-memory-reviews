import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let $ = (selector) => document.querySelector(selector);
let fm = (userId) => 'FM' + userId.substring(userId.length - 6).toUpperCase();
const url = new URLSearchParams(new URL(window.location.href).search);

console.log('DBG: Loaded imports');

const firebaseConfig = {
  apiKey: "AIzaSyAas9R4-9q4Tyrv4LDQx1falWjmco_P4LE",
  authDomain: "patr-3a75e.firebaseapp.com",
  projectId: "patr-3a75e",
  storageBucket: "patr-3a75e.appspot.com",
  messagingSenderId: "1067533396497",
  appId: "1:1067533396497:web:6570ade6f7fda6df8f1fb0",
  measurementId: "G-Y2ZJ3SMS32"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const volume = 500;

console.log('DBG: Initialized firestore');

let q;
if (url.has('userId')) {
  let userId = url.get('userId');
  // let userId = '71nxIAj6SKeYBBTv7wiKYh03ap62';
  q = query(collection(db, 'memory'), where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(volume));
} else {
  q = query(collection(db, 'memory'), orderBy('timestamp', 'desc'), limit(volume));
}

let allDocuments = [];
(await getDocs(q)).forEach((doc) => {
  allDocuments.push(doc.data());
});
console.log('DBG: Queried documents');
console.log(allDocuments[0]);
window.memoryData = allDocuments;

let memoryElements = [];
allDocuments.forEach(data => {
  let memory = document.createElement('div');
  memory.className = 'memory';

  let img = document.createElement('img');
  img.src = `https://xiw.io/cdn-cgi/image/width=400,quality=95/${data.imageUrl}`;
  memory.appendChild(img);

  let text = document.createElement('p');
  let type;
  switch (data.type) {
    case 'Uploaded': type = 'U'; break;
    case 'Saved': type = 'S'; break;
    default: type = '?'; console.warn('Unrecognized memory type', data); break;
  }
  text.innerHTML = `
  <span class="userId float-l">${fm(data.userId)}</span>
  <span class="type float-r">${type}</span>
  <br>
  <span class="country">${data.country}</span>
  `;
  memory.appendChild(text);

  memoryElements.push(memory);
});

let main = $('#memory-container');
memoryElements.forEach(element => {
  main.appendChild(element);
});
window.memoryElements = memoryElements;
console.log('DBG: Displayed memories');
document.dispatchEvent(new Event('x-memories-ready'));
