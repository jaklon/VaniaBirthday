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
// Tambahan Import Storage untuk Upload Foto
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// --- Konfigurasi Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyBOsDhRSsXzBvPFHrx-vOMmzOxKE20Wjp4",
  authDomain: "birthdayvania.firebaseapp.com",
  projectId: "birthdayvania",
  storageBucket: "birthdayvania.firebasestorage.app",
  messagingSenderId: "693336676503",
  appId: "1:693336676503:web:8f5823164a37633f4671d2",
  measurementId: "G-D40CGYLLMR",
};

// --- Inisialisasi Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Inisialisasi Storage

// Inisialisasi AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Smooth Scroll (Berjalan di semua halaman)
document.querySelectorAll(".scroll-link").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // Jika target tidak ada (misal diklik dari journey.html), pindah ke index
      window.location.href = "index.html" + targetId;
    }
  });
});

// ==========================================
// BAGIAN 1: FITUR HALAMAN UTAMA (Index.html)
// ==========================================

// Cek apakah elemen quote ada? Jika ada, jalankan fitur index
if (document.getElementById("quote-display")) {
  
  // --- A. MESIN KUTIPAN ACAK ---
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

  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", function () {
      const randomIndex = Math.floor(Math.random() * insideJokes.length);
      quoteDisplay.style.opacity = 0;
      setTimeout(() => {
        quoteDisplay.innerText = insideJokes[randomIndex];
        quoteDisplay.style.opacity = 1;
      }, 300);
    });
  }

  // --- B. GAME PASANGKAN KENANGAN ---
  const memoryGrid = document.getElementById("memory-grid");
  const moveCounter = document.getElementById("move-counter");
  const winMessage = document.getElementById("win-message");
  const resetGameBtn = document.getElementById("reset-game-btn");

  if (memoryGrid) {
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
  }

  // --- C. KUIS KENANGAN ---
  const quizContainer = document.getElementById("quiz-container");
  
  if (quizContainer) {
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

    window.selectAnswer = function(selectedOption) {
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
    loadQuiz();
  }

  // --- D. BUCKET LIST (Firebase) ---
  const bucketListCollectionRef = collection(db, "bucketListItems");
  const addButton = document.getElementById("add-item-btn");
  const inputField = document.getElementById("new-item-input");
  const futureList = document.getElementById("future-list");

  if (futureList) {
    const renderListItem = (doc) => {
      const li = document.createElement("li");
      li.setAttribute("data-id", doc.id);
      li.setAttribute("data-aos", "fade-right");
      li.innerHTML = `<span><i class="bi bi-check-circle-fill"></i> ${
        doc.data().text
      }</span><i class="bi bi-trash-fill delete-btn"></i>`;
      futureList.appendChild(li);
    };

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
        }
      }
    };

    const deleteItem = async (id) => {
      try {
        await deleteDoc(doc(db, "bucketListItems", id));
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    };

    // Kita simpan fungsi listener di variabel global window agar bisa dipanggil setelah Auth
    window.setupBucketListListener = () => {
      const q = query(bucketListCollectionRef, orderBy("createdAt", "asc"));
      onSnapshot(q, (snapshot) => {
        futureList.innerHTML = "";
        snapshot.docs.forEach((doc) => {
          renderListItem(doc);
        });
        setTimeout(() => { AOS.refresh(); }, 100);
      });
    };

    if (addButton) addButton.addEventListener("click", addNewItem);
    if (inputField) inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addNewItem();
    });
    if (futureList) futureList.addEventListener("click", (e) => {
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
  }
}

// ==========================================
// BAGIAN 2: FITUR JURNAL (Journey.html)
// ==========================================

// Cek apakah elemen journey-list ada? Jika ada, jalankan fitur Jurnal
if (document.getElementById("journey-list")) {

  const journeyCollectionRef = collection(db, "journeyLogs");
  const journeyListEl = document.getElementById("journey-list");
  const journeyForm = document.getElementById("journey-form");
  const progressBarContainer = document.getElementById("upload-progress-container");
  const progressBar = document.querySelector(".progress-bar");

  // Render Item Jurnal
  const renderJourneyItem = (doc) => {
    const data = doc.data();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = "";
    try {
      formattedDate = new Date(data.date).toLocaleDateString('id-ID', dateOptions);
    } catch (e) { formattedDate = data.date; }

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4"; // Grid Responsive
    col.setAttribute("data-aos", "fade-up");
    
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 journey-card" style="border-radius: 12px; overflow: hidden;">
        <div class="card-img-wrapper" style="height: 250px; overflow:hidden; position:relative;">
          <img src="${data.imageUrl}" class="card-img-top" style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;" alt="${data.title}">
        </div>
        <div class="card-body">
          <h5 class="card-title text-pink" style="font-family: 'Pacifico', cursive; color: #ff8fab;">${data.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted small"><i class="bi bi-calendar-heart"></i> ${formattedDate}</h6>
          <p class="card-text mt-3">${data.description}</p>
        </div>
      </div>
    `;
    journeyListEl.prepend(col); // Taruh item baru di paling awal
  };

  // Simpan listener di window agar bisa dipanggil setelah Auth
  window.setupJourneyListener = () => {
    const q = query(journeyCollectionRef, orderBy("date", "asc"));
    onSnapshot(q, (snapshot) => {
      journeyListEl.innerHTML = "";
      if(snapshot.empty) {
        journeyListEl.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>Belum ada cerita nih. Tambahin yuk!</p></div>';
      }
      snapshot.docs.forEach((doc) => {
        renderJourneyItem(doc);
      });
      setTimeout(() => AOS.refresh(), 100);
    });
  };

  // Handle Submit Form
  if (journeyForm) {
    journeyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const title = document.getElementById("trip-title").value;
      const date = document.getElementById("trip-date").value;
      const desc = document.getElementById("trip-desc").value;
      const imageFile = document.getElementById("trip-image").files[0];

      if (!imageFile) return alert("Pilih foto dulu ya!");

      // UI Loading
      const btnSave = document.getElementById("btn-save-trip");
      const originalBtnText = btnSave.innerHTML;
      btnSave.disabled = true;
      btnSave.innerHTML = "Sedang Mengupload...";
      progressBarContainer.classList.remove("d-none");
      progressBar.style.width = "30%";

      try {
        // 1. Upload ke Storage
        const storageRef = ref(storage, 'trip-images/' + Date.now() + '-' + imageFile.name);
        const snapshot = await uploadBytes(storageRef, imageFile);
        progressBar.style.width = "80%";
        
        // 2. Ambil URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // 3. Simpan ke Firestore
        await addDoc(journeyCollectionRef, {
          title: title,
          date: date,
          description: desc,
          imageUrl: downloadURL,
          createdAt: serverTimestamp()
        });

        // Tutup Modal & Reset
        journeyForm.reset();
        
        // Menutup Modal Bootstrap dengan aman
        const modalEl = document.getElementById('addTripModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
            modal.hide();
        } else {
            // Fallback jika instance belum ada
            new bootstrap.Modal(modalEl).hide();
        }
        
        alert("Berhasil disimpan! ❤️");

      } catch (error) {
        console.error("Error:", error);
        alert("Gagal menyimpan: " + error.message);
      } finally {
        btnSave.disabled = false;
        btnSave.innerHTML = originalBtnText;
        progressBarContainer.classList.add("d-none");
        progressBar.style.width = "0%";
      }
    });
  }
}

// ==========================================
// BAGIAN 3: OTENTIKASI & START UP
// ==========================================

const authenticateAndListen = async () => {
  try {
    await signInAnonymously(auth);
    console.log("Signed in anonymously!");
    
    // Jalankan listener sesuai halaman yang sedang dibuka
    if (typeof window.setupBucketListListener === 'function') {
        window.setupBucketListListener();
    }
    if (typeof window.setupJourneyListener === 'function') {
        window.setupJourneyListener();
    }

  } catch (error) {
    console.error("Auth failed:", error);
    alert("Koneksi Database Gagal. Pastikan internet lancar ya.");
  }
};

authenticateAndListen();