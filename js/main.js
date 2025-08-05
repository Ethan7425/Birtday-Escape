// Main JavaScript for 16-Day Escape Game
// This file contains all the logic for puzzle validation, date checking, and modal handling

// Global configuration - modify these settings as needed
const GAME_CONFIG = {
    // Set to true to disable win modal and allow immediate progression (for testing)
    DISABLE_WIN_MODAL: false,
    
    // Set to true to disable date checking (allows access to all puzzles) - NOW ALWAYS TRUE
    DISABLE_DATE_CHECK: true,
    
    // Case sensitive answer checking
    CASE_SENSITIVE: false,
    
    // Auto-unlock next day after solving - NOW DISABLED
    AUTO_UNLOCK_NEXT: false
};

// Page state
let currentPageConfig = {};
let isAnswerCorrect = false;

/**
 * Initialize the page with the given configuration
 * @param {Object} config - Page configuration object
 * @param {number} config.dayNumber - Day number (1-16)
 * @param {string} config.correctAnswer - The correct answer for this puzzle
 * @param {string} config.nextPageUrl - URL of the next page
 */
function initializePage(config) {
    currentPageConfig = config;
    
    // Show puzzle content
    showPuzzleContent();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log(`🎮 Initialized Day ${config.dayNumber}`);
    console.log(`🔑 Answer: "${config.correctAnswer}"`);
    console.log('🔧 Developer Commands:');
    console.log('• revealAnswer() - Shows the correct answer');
    console.log('• hideModalAndProceed() - Hides win modal and goes to next page');
    console.log('• unlockDay(dayNumber) - Unlock a specific day (e.g., unlockDay(5))');
}

/**
 * Show the puzzle content and hide the "not available" message
 */
function showPuzzleContent() {
    const puzzleContent = document.querySelector('.puzzle-content');
    const notAvailable = document.querySelector('.not-available');
    
    if (puzzleContent) puzzleContent.style.display = 'block';
    if (notAvailable) notAvailable.style.display = 'none';
}

/**
 * Hide the puzzle content and show the "not available" message
 */
function showNotAvailable() {
    const puzzleContent = document.querySelector('.puzzle-content');
    const notAvailable = document.querySelector('.not-available');
    
    if (puzzleContent) puzzleContent.style.display = 'none';
    if (notAvailable) notAvailable.style.display = 'block';
}

/**
 * Set up event listeners for the page
 */
function setupEventListeners() {
    const answerInput = document.getElementById('answer');
    const continueBtn = document.getElementById('continueBtn');
    
    if (answerInput) {
        // Check answer on every input change
        answerInput.addEventListener('input', handleAnswerInput);
        
        // Allow Enter key to trigger continue if answer is correct
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && isAnswerCorrect) {
                handleContinueClick();
            }
        });
        
        // Focus the input field
        answerInput.focus();
    }
    
    if (continueBtn) {
        continueBtn.addEventListener('click', handleContinueClick);
    }
}

/**
 * Handle input changes in the answer field
 * @param {Event} event - Input event
 */
function handleAnswerInput(event) {
    const userAnswer = event.target.value.trim();
    const correctAnswer = currentPageConfig.correctAnswer;
    
    // Check if answer is correct (case insensitive by default)
    if (GAME_CONFIG.CASE_SENSITIVE) {
        isAnswerCorrect = userAnswer === correctAnswer;
    } else {
        isAnswerCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    }
    
    updateContinueButton();
    
    // Add visual feedback to input
    const input = event.target;
    if (userAnswer.length > 0) {
        if (isAnswerCorrect) {
            input.style.borderColor = 'var(--success-green)';
            input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        } else {
            input.style.borderColor = 'var(--error-red)';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
    } else {
        input.style.borderColor = 'var(--border-color)';
        input.style.boxShadow = 'none';
    }
}

/**
 * Update the continue button state based on answer correctness
 */
function updateContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    
    if (continueBtn) {
        continueBtn.disabled = !isAnswerCorrect;
        
        if (isAnswerCorrect) {
            continueBtn.style.background = 'var(--gradient-success)';
            continueBtn.style.color = 'white';
            continueBtn.textContent = 'Continue ✓';
            continueBtn.style.cursor = 'pointer';
        } else {
            continueBtn.style.background = 'var(--bg-tertiary)';
            continueBtn.style.color = 'var(--text-light)';
            continueBtn.textContent = 'Continue';
            continueBtn.style.cursor = 'not-allowed';
        }
    }
}

/**
 * Handle continue button click
 */
function handleContinueClick() {
    if (!isAnswerCorrect) return;
    
    // Mark day as completed in localStorage
    markDayCompleted(currentPageConfig.dayNumber);
    
    if (GAME_CONFIG.DISABLE_WIN_MODAL) {
        // Skip modal and go directly to next page
        proceedToNextPage();
    } else {
        // Show win modal
        showWinModal();
    }
}

/**
 * Mark a day as completed in localStorage
 * @param {number} dayNumber - Day number to mark as completed
 */
function markDayCompleted(dayNumber) {
    const completedDays = getCompletedDays();
    if (!completedDays.includes(dayNumber)) {
        completedDays.push(dayNumber);
        localStorage.setItem('escapegame_completed', JSON.stringify(completedDays));
    }
}

/**
 * Get completed days from localStorage
 * @returns {Array} Array of completed day numbers
 */
function getCompletedDays() {
    const stored = localStorage.getItem('escapegame_completed');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Show the win modal
 */
function showWinModal() {
    const modal = document.getElementById('winModal');
    const container = document.querySelector('.container');
    
    if (modal) {
        modal.classList.add('show');
        
        // Disable interaction with background content
        if (container) {
            container.style.pointerEvents = 'none';
            container.style.opacity = '0.3';
        }
    }
}

/**
 * Hide the win modal
 */
function hideWinModal() {
    const modal = document.getElementById('winModal');
    const container = document.querySelector('.container');
    
    if (modal) {
        modal.classList.remove('show');
        
        // Re-enable interaction with background content
        if (container) {
            container.style.pointerEvents = '';
            container.style.opacity = '';
        }
    }
}

/**
 * Go back to calendar
 */
function goBackToCalendar() {
    window.location.href = '../index.html';
}

/**
 * Close any modal
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Developer function to manually hide the win modal and go back to calendar
 * Call this in the browser console: hideModalAndGoBack()
 */
function hideModalAndGoBack() {
    hideWinModal();
    setTimeout(() => {
        goBackToCalendar();
    }, 500);
}

/**
 * Developer function to reveal the answer (for testing)
 * Call this in the browser console: revealAnswer()
 */
function revealAnswer() {
    console.log(`🔑 The answer for Day ${currentPageConfig.dayNumber} is: "${currentPageConfig.correctAnswer}"`);
    
    const answerInput = document.getElementById('answer');
    if (answerInput) {
        answerInput.value = currentPageConfig.correctAnswer;
        answerInput.dispatchEvent(new Event('input'));
    }
}

/**
 * Developer function to unlock a day manually
 * Call this in the browser console: unlockDay(5) to unlock day 5
 * @param {number} dayNumber - Day number to unlock (1-16)
 */
function unlockDayManual(dayNumber) {
    if (dayNumber < 1 || dayNumber > 16) {
        console.error(`❌ Invalid day number: ${dayNumber}. Must be between 1 and 16.`);
        return;
    }
    
    const unlockedDays = getUnlockedDays();
    if (!unlockedDays.includes(dayNumber)) {
        unlockedDays.push(dayNumber);
        localStorage.setItem('escapegame_unlocked', JSON.stringify(unlockedDays));
        console.log(`✅ Day ${dayNumber} has been unlocked!`);
        console.log('🔄 Refresh the calendar page to see the changes.');
    } else {
        console.log(`ℹ️ Day ${dayNumber} is already unlocked.`);
    }
}

/**
 * Unlock a specific day (used by calendar.js)
 * @param {number} dayNumber - Day number to unlock
 */
function unlockDay(dayNumber) {
    const unlockedDays = getUnlockedDays();
    if (!unlockedDays.includes(dayNumber)) {
        unlockedDays.push(dayNumber);
        localStorage.setItem('escapegame_unlocked', JSON.stringify(unlockedDays));
    }
}

/**
 * Get unlocked days from localStorage
 * @returns {Array} Array of unlocked day numbers
 */
function getUnlockedDays() {
    const stored = localStorage.getItem('escapegame_unlocked');
    const unlocked = stored ? JSON.parse(stored) : [1]; // Day 1 is always unlocked
    
    // Ensure day 1 is always included
    if (!unlocked.includes(1)) {
        unlocked.push(1);
    }
    
    return unlocked;
}

// Make developer functions globally available
window.hideModalAndGoBack = hideModalAndGoBack;
window.revealAnswer = revealAnswer;
window.unlockDay = unlockDayManual;
window.closeModal = closeModal;
window.getCompletedDays = getCompletedDays;