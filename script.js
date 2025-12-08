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
  updateDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Tambahan Import Storage untuk Upload Foto
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
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
// BAGIAN 2: HALAMAN JURNAL & ALBUM
// ==========================================

if (document.getElementById("journey-list")) {

  const journeyCollectionRef = collection(db, "journeyLogs");
  const albumsCollectionRef = collection(db, "albums");
  
  const journeyListEl = document.getElementById("journey-list");
  const journeyForm = document.getElementById("journey-form");
  const albumsListEl = document.getElementById("albums-list");
  const createAlbumForm = document.getElementById("create-album-form");

  // --- HELPER: Mengambil Nama Album ---
  // Kita simpan nama album di cache sederhana biar gak query terus
  let albumsCache = {}; 

  const fetchAlbumsForDropdown = async () => {
    const q = query(albumsCollectionRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const selectAdd = document.getElementById("trip-album-select");
    const selectEdit = document.getElementById("edit-trip-album-select");
    
    // Reset options
    const defaultOpt = '<option value="">-- Tidak masuk album --</option>';
    if(selectAdd) selectAdd.innerHTML = defaultOpt;
    if(selectEdit) selectEdit.innerHTML = defaultOpt;

    albumsCache = {}; // Reset cache

    snapshot.forEach((doc) => {
        const data = doc.data();
        albumsCache[doc.id] = data.title; // Simpan ke cache
        const option = `<option value="${doc.id}">${data.title}</option>`;
        if(selectAdd) selectAdd.innerHTML += option;
        if(selectEdit) selectEdit.innerHTML += option;
    });
  };

  // --- RENDER ITEM JURNAL ---
  const renderJourneyItem = (doc) => {
    const data = doc.data();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = "";
    try { formattedDate = new Date(data.date).toLocaleDateString('id-ID', dateOptions); } catch (e) { formattedDate = data.date; }

    // Cek nama album dari cache
    const albumName = data.albumId && albumsCache[data.albumId] ? albumsCache[data.albumId] : null;
    const albumBadge = albumName ? `<span class="badge bg-pink mb-2"><i class="bi bi-journal-album"></i> ${albumName}</span>` : '';

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4"; 
    col.setAttribute("data-aos", "fade-up");
    
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 journey-card clickable-card" 
           style="border-radius: 12px; overflow: hidden; cursor: pointer;"
           data-bs-toggle="modal" 
           data-bs-target="#detailModal"
           data-id="${doc.id}" 
           data-title="${data.title}"
           data-date="${data.date}" 
           data-desc="${data.description}"
           data-img="${data.imageUrl}"
           data-album-id="${data.albumId || ''}"
           data-album-name="${albumName || ''}">
        <div class="card-img-wrapper" style="height: 250px; overflow:hidden; position:relative;">
          <img src="${data.imageUrl}" class="card-img-top" style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;" alt="${data.title}">
          <div style="position: absolute; top: 10px; right: 10px;">
            ${albumBadge}
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title text-pink" style="font-family: 'Pacifico', cursive; color: #ff8fab;">${data.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted small"><i class="bi bi-calendar-heart"></i> ${formattedDate}</h6>
          <p class="card-text mt-3 line-clamp-3">${data.description}</p>
        </div>
      </div>
    `;
    journeyListEl.prepend(col);
  };

  // --- RENDER ITEM ALBUM ---
  const renderAlbumItem = (doc) => {
      const data = doc.data();
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.setAttribute("data-aos", "zoom-in");

      col.innerHTML = `
        <div class="card album-card border-0 text-white shadow overflow-hidden" 
             style="border-radius: 15px; height: 200px;"
             onclick="window.filterByAlbum('${doc.id}', '${data.title}')">
            <img src="${data.coverUrl}" class="card-img" style="height: 100%; object-fit: cover;" alt="${data.title}">
            <div class="card-img-overlay album-overlay d-flex flex-column justify-content-end p-4">
                <h3 class="card-title" style="font-family: 'Pacifico', cursive;">${data.title}</h3>
                <p class="card-text small opacity-75">${data.description || 'Kumpulan kenangan indah'}</p>
            </div>
        </div>
      `;
      albumsListEl.prepend(col);
  };

  // --- LISTENER JURNAL UTAMA ---
  let unsubscribeJourney = null;
  window.setupJourneyListener = (startDate = null, endDate = null, albumId = null) => {
    if (unsubscribeJourney) unsubscribeJourney();

    let queryConstraints = [orderBy("date", "asc")];
    
    // Filter Logic
    if (startDate) queryConstraints.push(where("date", ">=", startDate));
    if (endDate) queryConstraints.push(where("date", "<=", endDate));
    if (albumId) queryConstraints.push(where("albumId", "==", albumId));

    const q = query(journeyCollectionRef, ...queryConstraints);

    unsubscribeJourney = onSnapshot(q, (snapshot) => {
        journeyListEl.innerHTML = "";
        if(snapshot.empty) {
            journeyListEl.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>Tidak ada kenangan yang ditemukan.</p></div>';
        }
        snapshot.docs.forEach((doc) => renderJourneyItem(doc));
        setTimeout(() => AOS.refresh(), 100);
    });
  };

  // --- LISTENER ALBUM ---
  window.setupAlbumsListener = () => {
      const q = query(albumsCollectionRef, orderBy("createdAt", "asc"));
      onSnapshot(q, (snapshot) => {
          albumsListEl.innerHTML = "";
          if(snapshot.empty) {
              albumsListEl.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>Belum ada album. Buat yuk!</p></div>';
          }
          snapshot.docs.forEach((doc) => renderAlbumItem(doc));
      });
  };

  // --- FUNGSI GLOBAL: FILTER BY ALBUM (Dipanggil dari HTML onclick) ---
  window.filterByAlbum = (albumId, albumTitle) => {
      // 1. Pindah Tab ke Timeline
      const triggerEl = document.querySelector('#pills-timeline-tab');
      const tabInstance = new bootstrap.Tab(triggerEl);
      tabInstance.show();

      // 2. Set Banner Filter
      const banner = document.getElementById("active-filter-banner");
      const filterText = document.getElementById("filter-text");
      banner.classList.remove("d-none");
      filterText.innerHTML = `Menampilkan Album: <strong>${albumTitle}</strong>`;

      // 3. Jalankan Query Filter
      window.setupJourneyListener(null, null, albumId);

      // 4. Setup Tombol Clear
      document.getElementById("btn-clear-album-filter").onclick = () => {
          banner.classList.add("d-none");
          window.setupJourneyListener(); // Reset ke semua
      };
  };

  // --- TAMBAH CERITA (DENGAN ALBUM) ---
  const btnOpenAdd = document.getElementById("btn-open-add-trip");
  if(btnOpenAdd) {
      btnOpenAdd.addEventListener("click", () => {
          fetchAlbumsForDropdown(); // Refresh list album sebelum buka modal
          const modal = new bootstrap.Modal(document.getElementById('addTripModal'));
          modal.show();
      });
  }

  if (journeyForm) {
    journeyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("trip-title").value;
      const date = document.getElementById("trip-date").value;
      const desc = document.getElementById("trip-desc").value;
      const albumId = document.getElementById("trip-album-select").value;
      const imageFile = document.getElementById("trip-image").files[0];

      if (!imageFile) return alert("Pilih foto dulu ya!");

      const btnSave = document.getElementById("btn-save-trip");
      btnSave.disabled = true;
      btnSave.innerHTML = "Sedang Mengupload...";
      document.getElementById("upload-progress-container").classList.remove("d-none");
      document.querySelector("#upload-progress-container .progress-bar").style.width = "50%";

      try {
        const storageRef = ref(storage, 'trip-images/' + Date.now() + '-' + imageFile.name);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await addDoc(journeyCollectionRef, {
          title, date, description: desc, imageUrl: downloadURL, albumId: albumId, createdAt: serverTimestamp()
        });

        journeyForm.reset();
        bootstrap.Modal.getInstance(document.getElementById('addTripModal')).hide();
        alert("Berhasil disimpan! ❤️");

      } catch (error) {
        console.error("Error:", error);
        alert("Gagal: " + error.message);
      } finally {
        btnSave.disabled = false;
        btnSave.innerHTML = '<i class="bi bi-cloud-upload-fill"></i> Simpan Sekarang';
        document.getElementById("upload-progress-container").classList.add("d-none");
      }
    });
  }

  // --- BUAT ALBUM BARU ---
  if (createAlbumForm) {
      createAlbumForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const title = document.getElementById("album-title").value;
          const desc = document.getElementById("album-desc").value;
          const imageFile = document.getElementById("album-cover").files[0];

          if (!imageFile) return alert("Pilih cover album dulu!");

          const btnSave = document.getElementById("btn-save-album");
          btnSave.disabled = true;
          btnSave.innerHTML = "Membuat Album...";
          document.getElementById("album-progress-container").classList.remove("d-none");
          document.querySelector("#album-progress-container .progress-bar").style.width = "50%";

          try {
              const storageRef = ref(storage, 'album-covers/' + Date.now() + '-' + imageFile.name);
              const snapshot = await uploadBytes(storageRef, imageFile);
              const downloadURL = await getDownloadURL(snapshot.ref);

              await addDoc(albumsCollectionRef, {
                  title, description: desc, coverUrl: downloadURL, createdAt: serverTimestamp()
              });

              createAlbumForm.reset();
              bootstrap.Modal.getInstance(document.getElementById('createAlbumModal')).hide();
              fetchAlbumsForDropdown(); // Refresh dropdown
              alert("Album berhasil dibuat! 📁");

          } catch (error) {
              console.error("Error create album:", error);
              alert("Gagal membuat album.");
          } finally {
              btnSave.disabled = false;
              btnSave.innerHTML = '<i class="bi bi-folder-plus"></i> Buat Album';
              document.getElementById("album-progress-container").classList.add("d-none");
          }
      });
  }

  // --- LOGIC DETAIL MODAL (EDIT & DELETE) ---
  const detailModalEl = document.getElementById('detailModal');
  let currentDocId = null;
  let currentImgUrl = null;

  if (detailModalEl) {
    detailModalEl.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        currentDocId = button.getAttribute('data-id');
        currentImgUrl = button.getAttribute('data-img');
        const albumName = button.getAttribute('data-album-name');

        // Isi Modal
        this.querySelector('#detailModalTitle').textContent = button.getAttribute('data-title');
        this.querySelector('#detailModalDate').textContent = button.getAttribute('data-date'); // Raw date or formatted is ok
        this.querySelector('#detailModalDescription').textContent = button.getAttribute('data-desc');
        this.querySelector('#detailModalImage').src = currentImgUrl;
        
        const badgeEl = this.querySelector('#detailModalAlbumBadge');
        badgeEl.innerHTML = albumName ? `<span class="badge bg-pink"><i class="bi bi-journal-album"></i> ${albumName}</span>` : '';
    });

    // Delete
    document.getElementById('btn-delete-entry').addEventListener('click', async () => {
        if(confirm("Yakin hapus?")) {
            try {
                await deleteDoc(doc(db, "journeyLogs", currentDocId));
                try { await deleteObject(ref(storage, currentImgUrl)); } catch(e){}
                bootstrap.Modal.getInstance(detailModalEl).hide();
            } catch (e) { alert("Gagal hapus."); }
        }
    });

    // Edit (Open Modal)
    document.getElementById('btn-edit-entry').addEventListener('click', async () => {
        bootstrap.Modal.getInstance(detailModalEl).hide();
        // Fetch albums first
        await fetchAlbumsForDropdown();
        
        // Populate Form
        const originalCard = document.querySelector(`.journey-card[data-id="${currentDocId}"]`);
        if(originalCard) {
            document.getElementById('edit-doc-id').value = currentDocId;
            document.getElementById('edit-old-image-url').value = currentImgUrl;
            document.getElementById('edit-trip-title').value = detailModalEl.querySelector('#detailModalTitle').textContent;
            // Note: retrieving raw data from attributes is safer
            document.getElementById('edit-trip-date').value = originalCard.getAttribute('data-date'); // Must be YYYY-MM-DD
            document.getElementById('edit-trip-desc').value = originalCard.getAttribute('data-desc');
            document.getElementById('edit-trip-album-select').value = originalCard.getAttribute('data-album-id');
        }
        new bootstrap.Modal(document.getElementById('editTripModal')).show();
    });
  }

  // --- SUBMIT EDIT FORM ---
  const editForm = document.getElementById('edit-journey-form');
  if(editForm) {
      editForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const docId = document.getElementById('edit-doc-id').value;
          const oldImageUrl = document.getElementById('edit-old-image-url').value;
          const title = document.getElementById('edit-trip-title').value;
          const date = document.getElementById('edit-trip-date').value;
          const desc = document.getElementById('edit-trip-desc').value;
          const albumId = document.getElementById('edit-trip-album-select').value;
          const imageFile = document.getElementById('edit-trip-image').files[0];

          const btnUpdate = document.getElementById('btn-update-trip');
          btnUpdate.disabled = true;
          btnUpdate.innerText = "Mengupdate...";

          try {
              let finalImageUrl = oldImageUrl;
              if (imageFile) {
                  const newStorageRef = ref(storage, 'trip-images/' + Date.now() + '-' + imageFile.name);
                  const snapshot = await uploadBytes(newStorageRef, imageFile);
                  finalImageUrl = await getDownloadURL(snapshot.ref);
                  try { await deleteObject(ref(storage, oldImageUrl)); } catch(e){}
              }

              await updateDoc(doc(db, "journeyLogs", docId), {
                  title, date, description: desc, imageUrl: finalImageUrl, albumId
              });

              bootstrap.Modal.getInstance(document.getElementById('editTripModal')).hide();
              alert("Data terupdate!");
          } catch (error) {
              console.error(error);
              alert("Gagal update.");
          } finally {
              btnUpdate.disabled = false;
              btnUpdate.innerHTML = '<i class="bi bi-save-fill"></i> Update Kenangan';
          }
      });
  }
}

// --- OTENTIKASI & START ---
const authenticateAndListen = async () => {
  try {
    await signInAnonymously(auth);
    console.log("Signed in anonymously!");
    
    // Fetch data awal
    if (typeof window.setupBucketListListener === 'function') window.setupBucketListListener();
    if (typeof window.setupJourneyListener === 'function') {
        // Ambil data albums dulu untuk cache nama album
        const albumsCollectionRef = collection(db, "albums");
        const q = query(albumsCollectionRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        // Pre-fill cache album nama (Manual simple cache)
        // Di aplikasi besar sebaiknya pakai state management, tapi ini cukup.
        // Kita panggil setupJourneyListener setelah fetch albums biar render namanya bener.
        window.setupJourneyListener(); 
        window.setupAlbumsListener();
    }

  } catch (error) {
    console.error("Auth failed:", error);
  }
};

authenticateAndListen();