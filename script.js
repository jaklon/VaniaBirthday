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
  "",
  "I love you to the moon and back",
  "'tuh ternyata kamu begitu, coba pas masih di mokopi'",
  "",
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

// GANTI URL GAMBAR DI BAWAH INI DENGAN FOTO-FOTO KALIAN (6 foto berbeda)
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
  cardsArray.forEach((imageUrl, index) => {
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

// Initial game setup
createBoard();

// JAVASCRIPT UNTUK KUIS KENANGAN
const quizData = [
  {
    question: "Di mana kita pertama kali resmi jadian?",
    options: ["Mokopi", "Salon De Fiestas", "Lot 9", "Pinggir Danau"],
    answer: "Lot 9",
  },
  {
    question: "Apa judul film pertama yang kita tonton bareng di bioskop?",
    options: [
      "Avengers: Endgame",
      "Spider-Man: No Way Home",
      "Agak Laen",
      "Dilan 1990",
    ],
    answer: "Agak Laen",
  },
  {
    question: "Apa makanan favoritku yang sering kamu masakin?",
    options: [
      "Nasi Goreng Spesial",
      "Spaghetti Carbonara",
      "Ayam Geprek",
      "Sate Padang",
    ],
    answer: "Sate Padang",
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
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  quizContainer.style.display = "block";
  quizResult.style.display = "none";
  loadQuiz();
}
loadQuiz();

// Fungsi untuk menambahkan item baru ke bucket list
const addButton = document.getElementById("add-item-btn");
const inputField = document.getElementById("new-item-input");
const futureList = document.getElementById("future-list");
function addNewItem() {
  const newItemText = inputField.value.trim();
  if (newItemText !== "") {
    const newLi = document.createElement("li");
    newLi.innerHTML = `<span><i class="bi bi-check-circle-fill"></i> ${newItemText}</span><i class="bi bi-trash-fill delete-btn"></i>`;
    newLi.setAttribute("data-aos", "fade-right");
    futureList.appendChild(newLi);
    inputField.value = "";
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }
}
addButton.addEventListener("click", addNewItem);
inputField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addNewItem();
});
futureList.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("delete-btn")) {
    const listItem = e.target.closest("li");
    if (listItem) {
      listItem.style.transition = "opacity 0.3s ease";
      listItem.style.opacity = "0";
      setTimeout(() => {
        listItem.remove();
      }, 300);
    }
  }
});
