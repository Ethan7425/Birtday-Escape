// Calendar functionality for the 16-Day Escape Game
// This file handles the calendar menu interactions and day generation

/**
 * Initialize the calendar functionality
 */
function initializeCalendar() {
    generateCalendarDays();
    updateProgress();
    
    console.log('📅 Calendar initialized');
    console.log('🔧 Developer Commands:');
    console.log('• unlockDay(dayNumber) - Unlock a specific day');
    console.log('• lockDay(dayNumber) - Lock a specific day');
    console.log('• unlockAllDays() - Unlock all days (for testing)');
    console.log('• resetCalendar() - Reset to initial state');
    console.log('• getCalendarState() - Get current calendar state');
    console.log('');
    console.log('💡 Quick Examples:');
    console.log('• unlockDay(5) - Unlocks day 5');
    console.log('• unlockAllDays() - Unlocks all 16 days');
    console.log('• resetCalendar() - Resets everything back to day 1 only');
}

/**
 * Generate calendar days dynamically
 */
function generateCalendarDays() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    const unlockedDays = getUnlockedDays();
    const completedDays = getCompletedDays();
    
    // Clear existing content
    calendarGrid.innerHTML = '';
    
    // Generate 16 days
    for (let day = 1; day <= 16; day++) {
        const dayElement = createDayElement(day, unlockedDays, completedDays);
        calendarGrid.appendChild(dayElement);
    }
}

/**
 * Create a single day element
 * @param {number} dayNumber - Day number (1-16)
 * @param {Array} unlockedDays - Array of unlocked day numbers
 * @param {Array} completedDays - Array of completed day numbers
 * @returns {HTMLElement} Day element
 */
function createDayElement(dayNumber, unlockedDays, completedDays) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.dataset.day = dayNumber;
    dayElement.dataset.url = `pages/day${dayNumber}.html`;
    
    // Determine day state
    let dayClass = 'locked';
    let statusIcon = '🔒';
    
    if (completedDays.includes(dayNumber)) {
        dayClass = 'completed';
        statusIcon = '✅';
    } else if (unlockedDays.includes(dayNumber)) {
        dayClass = 'unlocked';
        statusIcon = '🔓';
    }
    
    dayElement.classList.add(dayClass);
    
    // Create day content
    dayElement.innerHTML = `
        <div class="day-number">${dayNumber}</div>
        <div class="day-status">${statusIcon}</div>
    `;
    
    // Add event listeners
    dayElement.addEventListener('click', handleDayClick);
    
    // Add hover effects for unlocked/completed days
    if (dayClass !== 'locked') {
        dayElement.addEventListener('mouseenter', handleDayHover);
        dayElement.addEventListener('mouseleave', handleDayLeave);
    }
    
    return dayElement;
}

/**
 * Handle day click events
 * @param {Event} event - Click event
 */
function handleDayClick(event) {
    const dayElement = event.currentTarget;
    const dayNumber = parseInt(dayElement.dataset.day);
    const dayUrl = dayElement.dataset.url;
    
    if (dayElement.classList.contains('unlocked') || dayElement.classList.contains('completed')) {
        // Navigate to the puzzle page
        window.location.href = dayUrl;
    } else {
        // Show locked message
        showLockedMessage(dayNumber);
    }
}

/**
 * Handle hover effects for unlocked days
 * @param {Event} event - Mouse enter event
 */
function handleDayHover(event) {
    const dayElement = event.currentTarget;
    if (!dayElement.classList.contains('locked')) {
        dayElement.style.transform = 'translateY(-8px) scale(1.05)';
    }
}

/**
 * Handle hover leave effects
 * @param {Event} event - Mouse leave event
 */
function handleDayLeave(event) {
    const dayElement = event.currentTarget;
    dayElement.style.transform = '';
}

/**
 * Show a message when trying to access a locked day
 * @param {number} dayNumber - The day number that was clicked
 */
function showLockedMessage(dayNumber) {
    const modal = document.getElementById('lockedModal');
    const message = document.getElementById('lockedMessage');
    
    if (modal && message) {
        message.textContent = `Day ${dayNumber} is locked! Complete previous days to unlock.`;
        modal.classList.add('show');
    }
}

/**
 * Update the progress display
 */
function updateProgress() {
    const completedDays = getCompletedDays();
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const completedCount = completedDays.length;
    const totalDays = 16;
    const progressPercentage = (completedCount / totalDays) * 100;
    
    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${completedCount} / ${totalDays} days completed`;
    }
}

/**
 * Unlock a specific day
 * @param {number} dayNumber - Day number to unlock (1-16)
 */
function unlockDay(dayNumber) {
    if (dayNumber < 1 || dayNumber > 16) {
        console.error(`❌ Invalid day number: ${dayNumber}`);
        return;
    }
    
    const unlockedDays = getUnlockedDays();
    if (!unlockedDays.includes(dayNumber)) {
        unlockedDays.push(dayNumber);
        localStorage.setItem('escapegame_unlocked', JSON.stringify(unlockedDays));
        
        // Refresh calendar display
        generateCalendarDays();
        
        console.log(`✅ Day ${dayNumber} unlocked`);
    } else {
        console.log(`ℹ️ Day ${dayNumber} is already unlocked`);
    }
}

/**
 * Lock a specific day
 * @param {number} dayNumber - Day number to lock (1-16)
 */
function lockDay(dayNumber) {
    if (dayNumber === 1) {
        console.log('ℹ️ Day 1 cannot be locked');
        return;
    }
    
    const unlockedDays = getUnlockedDays();
    const index = unlockedDays.indexOf(dayNumber);
    
    if (index > -1) {
        unlockedDays.splice(index, 1);
        localStorage.setItem('escapegame_unlocked', JSON.stringify(unlockedDays));
        
        // Also remove from completed days if it was completed
        const completedDays = getCompletedDays();
        const completedIndex = completedDays.indexOf(dayNumber);
        if (completedIndex > -1) {
            completedDays.splice(completedIndex, 1);
            localStorage.setItem('escapegame_completed', JSON.stringify(completedDays));
        }
        
        // Refresh calendar display
        generateCalendarDays();
        updateProgress();
        
        console.log(`🔒 Day ${dayNumber} locked`);
    } else {
        console.log(`ℹ️ Day ${dayNumber} is already locked`);
    }
}

/**
 * Unlock all days (useful for testing)
 */
function unlockAllDays() {
    const allDays = Array.from({length: 16}, (_, i) => i + 1);
    localStorage.setItem('escapegame_unlocked', JSON.stringify(allDays));
    
    // Refresh calendar display
    generateCalendarDays();
    
    console.log('🔓 All days unlocked');
}

/**
 * Reset calendar to initial state (only day 1 unlocked)
 */
function resetCalendar() {
    localStorage.setItem('escapegame_unlocked', JSON.stringify([1]));
    localStorage.setItem('escapegame_completed', JSON.stringify([]));
    
    // Refresh calendar display
    generateCalendarDays();
    updateProgress();
    
    console.log('🔄 Calendar reset to initial state');
}

/**
 * Get the current calendar state
 * @returns {Object} Object with unlocked days array and completed days array
 */
function getCalendarState() {
    const unlockedDays = getUnlockedDays();
    const completedDays = getCompletedDays();
    const lockedDays = [];
    
    for (let i = 1; i <= 16; i++) {
        if (!unlockedDays.includes(i)) {
            lockedDays.push(i);
        }
    }
    
    const state = {
        unlocked: unlockedDays.sort((a, b) => a - b),
        completed: completedDays.sort((a, b) => a - b),
        locked: lockedDays.sort((a, b) => a - b)
    };
    
    console.log('📊 Calendar State:', state);
    return state;
}

// Make functions globally available for developer use
window.unlockDay = unlockDay;
window.lockDay = lockDay;
window.unlockAllDays = unlockAllDays;
window.resetCalendar = resetCalendar;
window.getCalendarState = getCalendarState;

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCalendar);