// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Inisialisasi AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Smooth Scroll untuk link dengan class .scroll-link
document.querySelectorAll(".scroll-link").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// JAVASCRIPT UNTUK MESIN KUTIPAN ACAK
const insideJokes = [
  "PMS = Pose Malone Stress",
  "Pengen Nyari Ayam",
  "dasar boti",
  "I love you to the moon and back",
  "'tuh ternyata kamu begitu, coba pas masih di mokopi'",
  "Ga Mood",
];
const quoteDisplay = document.getElementById("quote-display");
const newQuoteBtn = document.getElementById("new-quote-btn");
newQuoteBtn.addEventListener("click", function () {
  const randomIndex = Math.floor(Math.random() * insideJokes.length);
  quoteDisplay.style.opacity = 0;
  setTimeout(() => {
    quoteDisplay.innerText = insideJokes[randomIndex];
    quoteDisplay.style.opacity = 1;
  }, 300);
});

// JAVASCRIPT UNTUK GAME PASANGKAN KENANGAN
const memoryGrid = document.getElementById("memory-grid");
const moveCounter = document.getElementById("move-counter");
const winMessage = document.getElementById("win-message");
const resetGameBtn = document.getElementById("reset-game-btn");

const imageUrls = [
  "/asset/drive-download-20251014T185017Z-1-001/teka.HEIC",
  "/asset/drive-download-20251014T185017Z-1-001/teka 1.HEIC",
  "/asset/drive-download-20251014T185017Z-1-001/teka 3.HEIC",
  "/asset/drive-download-20251014T185017Z-1-001/teka 4.HEIC",
  "/asset/drive-download-20251014T185017Z-1-001/teka 5.JPG",
  "/asset/drive-download-20251014T185017Z-1-001/teka 6.HEIC",
];

let cardsArray = [...imageUrls, ...imageUrls];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

function shuffle(array) {
  array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  memoryGrid.innerHTML = "";
  winMessage.style.display = "none";
  shuffle(cardsArray);
  cardsArray.forEach((imageUrl) => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.imageUrl = imageUrl;
    card.innerHTML = `
            <div class="card-face card-front"><i class="bi bi-question-lg"></i></div>
            <div class="card-face card-back" style="background-image: url('${imageUrl}')"></div>
        `;
    memoryGrid.appendChild(card);
  });
}

function flipCard(e) {
  if (lockBoard) return;
  const clickedCard = e.target.closest(".memory-card");
  if (clickedCard && !clickedCard.classList.contains("is-flipped")) {
    clickedCard.classList.add("is-flipped");
    flippedCards.push(clickedCard);
    if (flippedCards.length === 2) {
      moves++;
      moveCounter.textContent = moves;
      lockBoard = true;
      checkForMatch();
    }
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.imageUrl === card2.dataset.imageUrl) {
    card1.classList.add("is-matched");
    card2.classList.add("is-matched");
    matchedPairs++;
    resetFlippedCards();
    if (matchedPairs === imageUrls.length) {
      setTimeout(() => {
        winMessage.style.display = "block";
      }, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("is-flipped");
      card2.classList.remove("is-flipped");
      resetFlippedCards();
    }, 1000);
  }
}

function resetFlippedCards() {
  flippedCards = [];
  lockBoard = false;
}

function resetGame() {
  matchedPairs = 0;
  moves = 0;
  moveCounter.textContent = moves;
  resetFlippedCards();
  createBoard();
}

memoryGrid.addEventListener("click", flipCard);
resetGameBtn.addEventListener("click", resetGame);
createBoard();

// JAVASCRIPT UNTUK KUIS KENANGAN
const quizData = [
  {
    question: "Di mana kita pertama kali resmi jadian?",
    options: ["Mokopi", "Salon De Fiestas", "Lot 9", "Pinggir Danau"],
    answer: "Lot 9",
  },
  {
    question: "Apa Warna Favorite Kita Berdua?",
    options: ["Biru", "Ungu", "Merah", "Pink"],
    answer: "Pink",
  },
  {
    question: "Tanggal Berapa Kita Bertemu Pertama Kali?",
    options: [
      "16 Agustus 2025",
      "17 Agustus 2025",
      "18 Agustus 2025",
      "19 Agustus 2025",
    ],
    answer: "17 Agustus 2025",
  },
];
let currentQuestionIndex = 0;
let score = 0;
const quizContainer = document.getElementById("quiz-container");
const quizResult = document.getElementById("quiz-result");
const resultText = document.getElementById("result-text");

function loadQuiz() {
  if (currentQuestionIndex < quizData.length) {
    const currentQuestion = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `<div class="card-body"><h5 class="card-title mb-4">${
      currentQuestionIndex + 1
    }. ${
      currentQuestion.question
    }</h5><div class="list-group">${currentQuestion.options
      .map(
        (option) =>
          `<button type="button" class="list-group-item list-group-item-action" onclick="selectAnswer('${option}')">${option}</button>`
      )
      .join("")}</div></div>`;
  } else {
    showResults();
  }
}

function selectAnswer(selectedOption) {
  if (selectedOption === quizData[currentQuestionIndex].answer) score++;
  currentQuestionIndex++;
  loadQuiz();
}

function showResults() {
  quizContainer.style.display = "none";
  quizResult.style.display = "block";
  resultText.innerText = `Kamu berhasil menjawab ${score} dari ${quizData.length} pertanyaan dengan benar! Hebat! Terima kasih sudah mengingat semua detail kecil tentang kita. ❤️`;
}

window.restartQuiz = function () {
  currentQuestionIndex = 0;
  score = 0;
  quizContainer.style.display = "block";
  quizResult.style.display = "none";
  loadQuiz();
};
window.selectAnswer = selectAnswer; // Make it globally accessible for inline onclick
loadQuiz();

// --- JAVASCRIPT UNTUK BUCKET LIST DENGAN FIREBASE ---

// --- Konfigurasi Firebase Anda ---
// Konfigurasi ini diambil dari proyek Anda. Pastikan semua nilainya benar.
const firebaseConfig = {
  apiKey: "AIzaSyBOsDhRSsXzBvPFHrx-vOMmzOxKE20Wjp4",
  authDomain: "birthdayvania.firebaseapp.com",
  projectId: "birthdayvania",
  storageBucket: "birthdayvania.appspot.com", // PERBAIKAN: Menggunakan domain .appspot.com yang umum
  messagingSenderId: "693336676503",
  appId: "1:693336676503:web:8f5823164a37633f4671d2",
  measurementId: "G-D40CGYLLMR",
};

// --- Inisialisasi Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Referensi Koleksi ---
// Nama koleksi disarankan menggunakan format camelCase
const bucketListCollectionRef = collection(db, "bucketListItems");

// --- Elemen DOM ---
const addButton = document.getElementById("add-item-btn");
const inputField = document.getElementById("new-item-input");
const futureList = document.getElementById("future-list");

// --- Fungsi untuk Merender Item ---
const renderListItem = (doc) => {
  const li = document.createElement("li");
  li.setAttribute("data-id", doc.id);
  li.setAttribute("data-aos", "fade-right");
  li.innerHTML = `<span><i class="bi bi-check-circle-fill"></i> ${
    doc.data().text
  }</span><i class="bi bi-trash-fill delete-btn"></i>`;
  futureList.appendChild(li);
};

// --- Fungsi untuk Menambah Item ---
const addNewItem = async () => {
  const newItemText = inputField.value.trim();
  if (newItemText !== "") {
    try {
      await addDoc(bucketListCollectionRef, {
        text: newItemText,
        createdAt: serverTimestamp(),
      });
      inputField.value = "";
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Gagal menambahkan item. Cek konsol untuk detailnya.");
    }
  }
};

// --- Fungsi untuk Menghapus Item ---
const deleteItem = async (id) => {
  try {
    await deleteDoc(doc(db, "bucketListItems", id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    alert("Gagal menghapus item. Cek konsol untuk detailnya.");
  }
};

// --- Otentikasi dan Listener Real-time ---
const setupRealtimeListener = () => {
  const q = query(bucketListCollectionRef, orderBy("createdAt", "asc"));
  onSnapshot(
    q,
    (snapshot) => {
      futureList.innerHTML = ""; // Kosongkan daftar sebelum render ulang
      snapshot.docs.forEach((doc) => {
        renderListItem(doc);
      });
      // Refresh AOS untuk item baru setelah transisi selesai
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    },
    (error) => {
      console.error("Error mendapatkan update real-time: ", error);
    }
  );
};

const authenticateAndListen = async () => {
  try {
    await signInAnonymously(auth);
    console.log("Signed in anonymously successfully!");
    setupRealtimeListener();
  } catch (error) {
    console.error("Authentication failed:", error);
    // Pesan error yang lebih spesifik
    alert(
      "Tidak bisa terhubung ke database. Penyebab paling umum: Metode 'Anonymous' sign-in belum diaktifkan di Firebase Console. Silakan cek file 'firebase-setup.md' lagi."
    );
  }
};

// --- Event Listeners ---
addButton.addEventListener("click", addNewItem);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addNewItem();
});
futureList.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("delete-btn")) {
    const listItem = e.target.closest("li");
    const id = listItem.getAttribute("data-id");
    if (id) {
      listItem.style.transition = "opacity 0.3s ease";
      listItem.style.opacity = "0";
      setTimeout(() => deleteItem(id), 300);
    }
  }
});

// --- Memulai Proses ---
authenticateAndListen();
