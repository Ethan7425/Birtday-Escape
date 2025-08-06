
// Main JavaScript for 16-Day Escape Game
// Handles puzzle validation and win modal (no local unlock tracking)

const GAME_CONFIG = {
    DISABLE_WIN_MODAL: false,
    CASE_SENSITIVE: false
};

let currentPageConfig = {};
let isAnswerCorrect = false;

function initializePage(config) {
    currentPageConfig = config;
    showPuzzleContent();
    setupEventListeners();

    console.log(`🎮 Initialized Day ${config.dayNumber}`);
    console.log(`🔑 Answer: "${config.correctAnswer}"`);
    console.log('• revealAnswer() - Shows the correct answer');
    console.log('• hideModalAndGoBack() - Hides win modal and goes to calendar');
    console.log('• clearCompletedDays() - Reset all completed progress');
}

function showPuzzleContent() {
    document.querySelector('.puzzle-content')?.style.setProperty('display', 'block');
    document.querySelector('.not-available')?.style.setProperty('display', 'none');
}

function setupEventListeners() {
    const answerInput = document.getElementById('answer');
    const continueBtn = document.getElementById('continueBtn');

    if (answerInput) {
        answerInput.addEventListener('input', handleAnswerInput);
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && isAnswerCorrect) handleContinueClick();
        });
        answerInput.focus();
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', handleContinueClick);
    }
}

function handleAnswerInput(event) {
    const input = event.target;
    const userAnswer = input.value.trim();
    const correctAnswer = currentPageConfig.correctAnswer;

    isAnswerCorrect = GAME_CONFIG.CASE_SENSITIVE
        ? userAnswer === correctAnswer
        : userAnswer.toLowerCase() === correctAnswer.toLowerCase();

    updateContinueButton();

    if (userAnswer.length > 0) {
        input.style.borderColor = isAnswerCorrect ? 'var(--success-green)' : 'var(--error-red)';
        input.style.boxShadow = isAnswerCorrect
            ? '0 0 0 3px rgba(16, 185, 129, 0.1)'
            : '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
        input.style.borderColor = 'var(--border-color)';
        input.style.boxShadow = 'none';
    }
}

function updateContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    if (!continueBtn) return;

    continueBtn.disabled = !isAnswerCorrect;
    continueBtn.textContent = isAnswerCorrect ? 'Continue ✓' : 'Continue';
    continueBtn.style.background = isAnswerCorrect ? 'var(--gradient-success)' : 'var(--bg-tertiary)';
    continueBtn.style.color = isAnswerCorrect ? 'white' : 'var(--text-light)';
    continueBtn.style.cursor = isAnswerCorrect ? 'pointer' : 'not-allowed';
}

function handleContinueClick() {
    if (!isAnswerCorrect) return;

    markDayCompleted(currentPageConfig.dayNumber);

    GAME_CONFIG.DISABLE_WIN_MODAL ? proceedToNextPage() : showWinModal();
}

function proceedToNextPage() {
    window.location.href = currentPageConfig.nextPageUrl;
}

function showWinModal() {
    const modal = document.getElementById('winModal');
    const container = document.querySelector('.container');
    if (modal) {
        modal.classList.add('show');
        if (container) {
            container.style.pointerEvents = 'none';
            container.style.opacity = '0.3';
        }
    }
}

function hideWinModal() {
    const modal = document.getElementById('winModal');
    const container = document.querySelector('.container');
    if (modal) modal.classList.remove('show');
    if (container) {
        container.style.pointerEvents = '';
        container.style.opacity = '';
    }
}

/**
 * Close a modal by its ID
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function goBackToCalendar() {
    window.location.href = '../index.html';
}

function hideModalAndGoBack() {
    hideWinModal();
    setTimeout(goBackToCalendar, 500);
}

function revealAnswer() {
    console.log(`🔑 The answer for Day ${currentPageConfig.dayNumber} is: "${currentPageConfig.correctAnswer}"`);
    const answerInput = document.getElementById('answer');
    if (answerInput) {
        answerInput.value = currentPageConfig.correctAnswer;
        answerInput.dispatchEvent(new Event('input'));
    }
}

function getCompletedDays() {
    const stored = localStorage.getItem('escapegame_completed');
    return stored ? JSON.parse(stored) : [];
}

function markDayCompleted(dayNumber) {
    const completedDays = getCompletedDays();
    if (!completedDays.includes(dayNumber)) {
        completedDays.push(dayNumber);
        localStorage.setItem('escapegame_completed', JSON.stringify(completedDays));
    }
}

/**
 * Developer command to clear completed progress from localStorage
 * Usage: clearCompletedDays()
 */
function clearCompletedDays() {
    localStorage.removeItem('escapegame_completed');
    console.log('🧹 Completed days cleared from localStorage');
}

window.hideModalAndGoBack = hideModalAndGoBack;
window.revealAnswer = revealAnswer;
