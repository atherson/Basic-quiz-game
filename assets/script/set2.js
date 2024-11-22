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
let timer;
let timeLeft = 3600; // Total time in seconds (e.g., 1 hour)
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

// Timer Functionality
document.addEventListener('DOMContentLoaded', () => {
    const timeLeftDisplay = document.getElementById("time-left");

    // Function to format seconds into hours, minutes, and seconds
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600); // Get the hours
        const minutes = Math.floor((seconds % 3600) / 60); // Get the minutes
        const remainingSeconds = seconds % 60; // Get the remaining seconds

        // Return the time formatted as HH:MM:SS
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // Start the timer
    function startTimer() {
        if (timer) {
            clearInterval(timer); // Clear any existing timer
        }

        timer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = formatTime(timeLeft);

            // Change the color based on how much time is left
            const timeUsed = 3600 - timeLeft;
            if (timeUsed >= 2700) { // 75% of the time
                timeLeftDisplay.style.color = "red";
            } else if (timeUsed >= 1800) { // 50% of the time
                timeLeftDisplay.style.color = "orange";
            } else if (timeUsed >= 900) { // 25% of the time
                timeLeftDisplay.style.color = "yellow";
            } else {
                timeLeftDisplay.style.color = "green";
            }

            // Stop the timer when it reaches 0
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time's up! Quiz over.");
                disableInputs();
            }
        }, 1000);
    }

    // Function to disable inputs when the timer is done
    function disableInputs() {
        document.querySelectorAll("input[type='radio']").forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll("button").forEach(button => button.disabled = true);
    }

    startTimer(); // Start the timer as soon as the page loads
});

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

// Handle Retake Functionality
function handleRetake() {
    // Reset score
    score = 0;
    scoreDisplay.textContent = score;

    // Reset timer
    timeLeft = 3600; // Reset time to 1 hour (3600 seconds)
    timeLeftDisplay.textContent = formatTime(timeLeft);
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
