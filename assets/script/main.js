// Question answers for scoring
const answers = {
    "q1-answer": "q1-b",
    "q2-answer": "q2-a",
    "q3-answer": "q3-b",
    "q4-answer": "q4-b",
    "q5-answer": "q5-a",
    "q6-answer": "q6-b"
};

// Variables
let score = 0;
let timer;
let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || []; // Load history from localStorage

// DOM elements
const scoreDisplay = document.getElementById("score");
const timeLeftDisplay = document.getElementById("time-left");
const submitButtons = document.querySelectorAll("#submit-button");
const resetButtons = document.querySelectorAll("#reset-button");
const getScoreButton = document.getElementById("get-score");
const historyButton = document.getElementById("history");
const resetHistoryButton = document.getElementById("reset-history");
const retakeButton = document.getElementById("retake");

// Timer functionality
document.addEventListener("DOMContentLoaded", () => {
    let timeLeft = localStorage.getItem("timeLeft") ? parseInt(localStorage.getItem("timeLeft")) : 3600; // Get saved time from localStorage or start from 3600 seconds (1 hour)

    const timeLeftDisplay = document.getElementById("time-left");

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = formatTime(timeLeft);

            // Save the remaining time to localStorage on every tick
            localStorage.setItem("timeLeft", timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time's up! Quiz over.");
                disableInputs();
            }
        }, 1000);
    }

    function disableInputs() {
        document.querySelectorAll("input[type='radio']").forEach(input => input.disabled = true);
        document.querySelectorAll("button").forEach(button => button.disabled = true);
    }

    startTimer();
});

// Save score history and update localStorage
function storeScore() {
    const timestamp = new Date().toLocaleString();
    scoreHistory.push({ score, time: timestamp });
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));

    // Save the total score in localStorage for use in the second website
    localStorage.setItem("quiz1Score", score);
    alert(`Your score of ${score} has been saved.`);
}

function handleSubmit(questionClass) {
    const selectedAnswer = document.querySelector(
        `.${questionClass} input[type='radio']:checked`
    );

    if (!selectedAnswer) {
        alert("Please select an answer before submitting.");
        return;
    }

    const answerGroup = selectedAnswer.name;
    if (selectedAnswer.id === answers[answerGroup]) {
        score++;
    }

    scoreDisplay.textContent = score;
    document.querySelectorAll(`.${questionClass} input[type='radio']`).forEach(input => input.disabled = true);
    document.querySelector(`.${questionClass} #submit-button`).disabled = true;

    // Auto-save score to localStorage after each submission
    const timestamp = new Date().toLocaleString();
    scoreHistory.push({ score, time: timestamp });
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));

    // Save the total score in localStorage for use in the second website
    localStorage.setItem("quiz1Score", score);
    alert(`Your score of ${score} has been saved.`);
}


// Handle reset button click
function handleReset(questionClass) {
    document.querySelectorAll("input[type='radio']").forEach(input => {
        input.checked = false;
        input.disabled = false;
    });
    document.querySelectorAll("button").forEach(button => button.disabled = false);
}
// Handle retake functionality
function handleRetake() {
    score = 0;
    scoreDisplay.textContent = score;

    document.querySelectorAll("input[type='radio']").forEach(input => {
        input.checked = false;
        input.disabled = false;
    });

    submitButtons.forEach(button => button.disabled = false);
    alert("Quiz reset. You can retake it now!");
}

// Save score history
function storeScore() {
    const timestamp = new Date().toLocaleString();
    scoreHistory.push({ score, time: timestamp });
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
    alert(`Your score of ${score} has been saved.`);
}

// Display score history
function displayHistory() {
    if (scoreHistory.length === 0) {
        alert("No history found.");
        return;
    }
    const historyList = scoreHistory
        .map((entry, index) => `${index + 1}. Score: ${entry.score}/6, Time: ${entry.time}`)
        .join("\n");
    alert(`Score History:\n${historyList}`);
}

// Reset score history
function resetHistory() {
    localStorage.removeItem("scoreHistory");
    scoreHistory = [];
    alert("Score history has been reset.");
}

// Initialize quiz
function initQuiz() {
    submitButtons.forEach((button, index) => {
        const questionClass = `q-${index + 1}`;
        button.addEventListener("click", () => handleSubmit(questionClass));
    });

    resetButtons.forEach((button, index) => {
        const questionClass = `q-${index + 1}`;
        button.addEventListener("click", () => handleReset(questionClass));
    });

    retakeButton.addEventListener("click", handleRetake);
    getScoreButton.addEventListener("click", storeScore);
    historyButton.addEventListener("click", displayHistory);
    resetHistoryButton.addEventListener("click", resetHistory);
}

// Start the quiz
initQuiz();
