// Question answers for scoring
const answers = {
    "q1-answer": "q1-b",
    "q2-answer": "q2-b",
    "q3-answer": "q3-b",
    "q4-answer": "q4-c",
    "q5-answer": "q5-a",
    "q6-answer": "q6-b"
};

// Variables
let score = 0;
let timeLeft = parseInt(localStorage.getItem("timeLeft")) || 3600;  // Retrieve from localStorage or default to 3600 seconds
let timer;
let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || []; // Load history from localStorage

// DOM elements
const scoreDisplay = document.getElementById("score");
const timeLeftDisplay = document.getElementById("time-left");
const submitButtons = document.querySelectorAll("#submit-button");
const resetButtons = document.querySelectorAll("#reset-button");
const getScoreButton = document.getElementById("get-score");
const retakeButton = document.getElementById("retake");
const historyButton = document.getElementById("history");
const resetHistoryButton = document.getElementById("reset-history"); // Reset history button

function startTimer() {
    const initialTime = timeLeft;  // initialTime is in seconds

    // Clear existing interval (if any) to ensure only one timer runs at a time
    if (timer) {
        clearInterval(timer);
    }

    timer = setInterval(() => {
        timeLeft--;
        localStorage.setItem("timeLeft", timeLeft); // Store the updated timeLeft in localStorage
        
        // Calculate hours, minutes, and seconds
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        // Format the time in HH:MM:SS format
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeftDisplay.textContent = formattedTime;

        // Update timer color
        const timeUsed = initialTime - timeLeft;
        if (timeUsed >= initialTime * 0.75) {
            timeLeftDisplay.style.color = "red";
        } else if (timeUsed >= initialTime * 0.5) {
            timeLeftDisplay.style.color = "orange";
        } else if (timeUsed >= initialTime * 0.25) {
            timeLeftDisplay.style.color = "yellow";
        } else {
            timeLeftDisplay.style.color = "green"; // Reset to default
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! Quiz over.");
            disableInputs();
        }
    }, 1000);
}

// Disable all inputs when time is up or quiz ends
function disableInputs() {
    document.querySelectorAll("input[type='radio']").forEach(input => {
        input.disabled = true;
    });
    submitButtons.forEach(button => button.disabled = true);
}

// Handle Submit Button Click
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
    // Disable all inputs for this question
    document.querySelectorAll(`.${questionClass} input[type='radio']`).forEach(input => {
        input.disabled = true;
    });

    // Disable the submit button for this question
    document.querySelector(`.${questionClass} #submit-button`).disabled = true;
}

// Handle Reset Button Click for individual questions
function handleReset(questionClass) {
    document.querySelectorAll(`.${questionClass} input[type='radio']`).forEach(input => {
        input.checked = false;
        input.disabled = false;
    });

    document.querySelector(`.${questionClass} #submit-button`).disabled = false;
}

// Handle Retake Functionality
function handleRetake() {
    // Reset score
    score = 0;
    scoreDisplay.textContent = score;

    // Reset timer
    timeLeft = 60; // Reset to 60 seconds for retake
    localStorage.setItem("timeLeft", timeLeft);  // Store the new time in localStorage
    timeLeftDisplay.textContent = timeLeft;
    timeLeftDisplay.style.color = ""; // Reset timer color
    clearInterval(timer);
    startTimer();

    // Reset all inputs
    document.querySelectorAll("input[type='radio']").forEach(input => {
        input.checked = false;
        input.disabled = false;
    });

    // Enable all submit buttons
    submitButtons.forEach(button => button.disabled = false);

    alert("Quiz has been reset. You can retake it now!");
}

// Store score history
function storeScore() {
    const timestamp = new Date().toLocaleString();
    scoreHistory.push({ score, time: timestamp });
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
    alert(`Your score of ${score} has been saved to history.`);
}

// Display score history
function displayHistory() {
    if (scoreHistory.length === 0) {
        alert("No history found.");
    } else {
        const historyMessages = scoreHistory.map(
            (entry, index) => `${index + 1}. Score: ${entry.score}/6, Time: ${entry.time}`
        );
        alert("Score History:\n" + historyMessages.join("\n"));
    }
}

// Reset score history
function resetHistory() {
    localStorage.removeItem("scoreHistory"); // Remove score history from localStorage
    scoreHistory = []; // Clear the current score history
    alert("Your score history has been reset.");
}

// Initialize Quiz
function initQuiz() {
    // Attach submit button handlers
    submitButtons.forEach((button, index) => {
        const questionClass = `q-${index + 1}`;
        button.addEventListener("click", () => handleSubmit(questionClass));
    });

    // Attach reset button handlers for individual questions
    resetButtons.forEach((button, index) => {
        const questionClass = `q-${index + 1}`;
        button.addEventListener("click", () => handleReset(questionClass));
    });

    // Attach retake button handler
    retakeButton.addEventListener("click", handleRetake);

    // Handle Get Score Button
    getScoreButton.addEventListener("click", () => {
        clearInterval(timer);
        storeScore();  // Store the score in history
        alert(`Your total score is ${score}/6.`);
        disableInputs();
    });

    // Handle History Button
    historyButton.addEventListener("click", displayHistory);

    // Handle Reset History Button
    resetHistoryButton.addEventListener("click", resetHistory);

    // Start Timer
    startTimer();
}

// Start the quiz
initQuiz();
