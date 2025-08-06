
// Calendar functionality for the 16-Day Escape Game (global unlock version)

function initializeCalendar() {
    generateCalendarDays();
    updateProgress();

    console.log('📅 Calendar initialized');
    console.log('• getCalendarState() - Check unlocked and completed days');
}

function generateCalendarDays() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    const completedDays = getCompletedDays();

    calendarGrid.innerHTML = '';

    for (let day = 1; day <= 16; day++) {
        const isUnlocked = typeof window.unlockedDays !== "undefined" && window.unlockedDays.includes(day);
        const isCompleted = completedDays.includes(day);
        const dayElement = createDayElement(day, isUnlocked, isCompleted);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(dayNumber, isUnlocked, isCompleted) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.dataset.day = dayNumber;
    dayElement.dataset.url = `pages/day${dayNumber}.html`;

    let dayClass = 'locked';
    let statusIcon = '🔒';

    if (isCompleted) {
        dayClass = 'completed';
        statusIcon = '✅';
    } else if (isUnlocked) {
        dayClass = 'unlocked';
        statusIcon = '🔓';
    }

    dayElement.classList.add(dayClass);
    dayElement.innerHTML = `
        <div class="day-number">${dayNumber}</div>
        <div class="day-status">${statusIcon}</div>
    `;

    dayElement.addEventListener('click', () => {
        if (dayClass === 'unlocked' || dayClass === 'completed') {
            window.location.href = dayElement.dataset.url;
        } else {
            showLockedMessage(dayNumber);
        }
    });

    if (dayClass !== 'locked') {
        dayElement.addEventListener('mouseenter', handleDayHover);
        dayElement.addEventListener('mouseleave', handleDayLeave);
    }

    return dayElement;
}

function handleDayHover(e) {
    const el = e.currentTarget;
    if (!el.classList.contains('locked')) {
        el.style.transform = 'translateY(-8px) scale(1.05)';
    }
}

function handleDayLeave(e) {
    e.currentTarget.style.transform = '';
}

function showLockedMessage(dayNumber) {
    const modal = document.getElementById('lockedModal');
    const message = document.getElementById('lockedMessage');
    if (modal && message) {
        message.textContent = `Day ${dayNumber} is locked!`;
        modal.classList.add('show');
    }
}

function updateProgress() {
    const completedDays = getCompletedDays();
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const completedCount = completedDays.length;
    const totalDays = 16;
    const percentage = (completedCount / totalDays) * 100;

    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${completedCount} / ${totalDays} days completed`;
}

function getCompletedDays() {
    const stored = localStorage.getItem('escapegame_completed');
    return stored ? JSON.parse(stored) : [];
}

function getCalendarState() {
    const unlocked = typeof window.unlockedDays !== "undefined" ? window.unlockedDays : [];
    const completed = getCompletedDays();
    const locked = [];
    for (let i = 1; i <= 16; i++) {
        if (!unlocked.includes(i)) locked.push(i);
    }

    const state = { unlocked, completed, locked };
    console.log('📊 Calendar State:', state);
    return state;
}

window.getCalendarState = getCalendarState;

document.addEventListener('DOMContentLoaded', initializeCalendar);
