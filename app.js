const state = {
    currentDate: new Date(2026, 0, 1),
    events: [],
    courses: []
};

// Selectors
const calendarDays = document.getElementById('calendar-days');
const currentMonthYear = document.getElementById('current-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const todayBtn = document.getElementById('today-btn');
const eventModal = document.getElementById('event-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const addEventMainBtn = document.getElementById('add-event-main-btn');

// State Methods
// --- ENGT 2000 Data ---
const engt2000Data = [
    { date: '2026-01-13', title: 'Course Information' },
    { date: '2026-01-15', title: 'Units, Fundamental Constants' },
    { date: '2026-01-20', title: 'Algebra' },
    { date: '2026-01-22', title: 'Vectors, Complex Quantities' },
    { date: '2026-01-27', title: 'Complex Arithmetic' },
    { date: '2026-01-29', title: 'Trigonometry' },
    { date: '2026-02-03', title: 'Mid-Term Exam 1', type: 'exam' },
    { date: '2026-02-05', title: 'Sinusoids and the Complex Plane' },
    { date: '2026-02-10', title: 'Analytic Geometry' },
    { date: '2026-02-12', title: 'Linear Systems, Linear Algebra' },
    { date: '2026-02-17', title: 'Differential Calculus (1)' },
    { date: '2026-02-19', title: 'Differential Calculus (2)' },
    { date: '2026-02-24', title: 'Integral Calculus (1)' },
    { date: '2026-02-26', title: 'Integral Calculus (2)' },
    { date: '2026-03-03', title: 'Mid-Term Exam 2', type: 'exam' },
    { date: '2026-03-05', title: 'Convolution Theory and Transforms' },
    { date: '2026-03-17', title: 'Laplace Transform (1)' },
    { date: '2026-03-19', title: 'Laplace Transform (2)' },
    { date: '2026-03-24', title: 'Fourier Transform (1)' },
    { date: '2026-03-26', title: 'Fourier Transform (2)' },
    { date: '2026-03-31', title: 'Discrete Mathematics' },
    { date: '2026-04-02', title: 'Mid-Term Exam 3', type: 'exam' },
    { date: '2026-04-07', title: 'Numerical Methods' },
    { date: '2026-04-09', title: 'Numerical Integration' },
    { date: '2026-04-14', title: 'Numerical Solutions of Diff Eq' },
    { date: '2026-04-16', title: 'Sets and Operations, Counting' },
    { date: '2026-04-21', title: 'Prob Density Functions (Discrete)' },
    { date: '2026-04-23', title: 'Prob Dist Functions (Continuous)' },
    { date: '2026-04-28', title: 'Mid-Term Exam 4', type: 'exam' },
    { date: '2026-04-30', title: 'Review' },
    { date: '2026-05-07', title: 'Final Exam (8-10 AM)', type: 'exam' }
];

// --- MET 3401 Data (Mondays) ---
const met3401Data = [
    { date: '2026-01-12', title: 'Intro / Basic Concepts' },
    { date: '2026-01-19', title: 'Properties of Pure Substance' },
    { date: '2026-01-26', title: 'Work and Heat' },
    { date: '2026-02-02', title: 'Work and Heat (Cont)' },
    { date: '2026-02-09', title: 'Test 1: First Law', type: 'exam' },
    { date: '2026-02-16', title: 'First Law of Thermodynamics' },
    { date: '2026-02-23', title: 'First Law (Cont)' },
    { date: '2026-03-02', title: 'First Law (Cont)' },
    // Week 9 Break - Skipped
    { date: '2026-03-16', title: 'First Law (Cont)' },
    { date: '2026-03-23', title: 'Test 2: Second Law', type: 'exam' },
    { date: '2026-03-30', title: 'Second Law of Thermodynamics' },
    { date: '2026-04-06', title: 'Second Law (Cont)' },
    { date: '2026-04-13', title: 'Reversible & Irreversible Processes' },
    { date: '2026-04-20', title: 'Test 3: Carnot/Entropy', type: 'exam' },
    { date: '2026-04-27', title: 'Entropy / Thermodynamic Cycles' },
    { date: '2026-05-04', title: 'Final Exam', type: 'exam' }
];

function loadData() {
    const savedEvents = localStorage.getItem('syllabus_events');
    const savedCourses = localStorage.getItem('syllabus_courses');

    let loadedEvents = savedEvents ? JSON.parse(savedEvents) : [];
    let loadedCourses = savedCourses ? JSON.parse(savedCourses) : [];

    // 1. Ensure ENGT 2000 exists
    const engtCourseId = 'c_engt2000';
    const engtExists = loadedCourses.some(c => c.name.includes('ENGT 2000'));

    if (!engtExists) {
        loadedCourses.push({ id: engtCourseId, name: 'ENGT 2000', color: '#0ea5e9' });

        const newEvents = engt2000Data.map((item, index) => ({
            id: 'evt_engt_' + index,
            title: item.title,
            date: item.date,
            courseId: engtCourseId,
            type: item.type || 'reading'
        }));
        loadedEvents = [...loadedEvents, ...newEvents];
    }

    // 2. Ensure MET 3401 exists
    const metCourseId = 'c_met3401';
    const metExists = loadedCourses.some(c => c.name.includes('MET 3401'));

    if (!metExists) {
        loadedCourses.push({ id: metCourseId, name: 'MET 3401', color: '#f97316' }); // Orange

        const newMetEvents = met3401Data.map((item, index) => ({
            id: 'evt_met_' + index,
            title: item.title,
            date: item.date,
            courseId: metCourseId,
            type: item.type || 'reading'
        }));
        loadedEvents = [...loadedEvents, ...newMetEvents];
    }

    // 3. CLEANUP: Filter out old defaults if they exist.
    loadedCourses = loadedCourses.filter(c => !['Calculus I', 'History 101', 'Physics'].includes(c.name));

    // 4. Fallback ensuring we have content if somehow empty
    if (loadedCourses.length === 0) {
        loadedCourses.push({ id: engtCourseId, name: 'ENGT 2000', color: '#0ea5e9' });
    }

    state.events = loadedEvents;
    state.courses = loadedCourses;
    saveData();
}

function saveData() {
    localStorage.setItem('syllabus_events', JSON.stringify(state.events));
    localStorage.setItem('syllabus_courses', JSON.stringify(state.courses));
    renderSidebar();
}

// Calendar Logic
function renderCalendar() {
    const date = state.currentDate;
    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay(); // 0 = Sun

    let daysHtml = '';

    // Prev Month Days
    for (let i = startDayIndex; i > 0; i--) {
        daysHtml += `<div class="day-cell other-month"><span class="day-number">${prevLastDay.getDate() - i + 1}</span></div>`;
    }

    // Current Month Days
    for (let i = 1; i <= daysInMonth; i++) {
        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

        let eventsHtml = '';
        const dayEvents = state.events.filter(e => e.date === currentDateStr);

        dayEvents.forEach(evt => {
            const course = state.courses.find(c => c.id === evt.courseId);
            const color = course ? course.color : '#6366f1';

            // Check if past
            const eventDateObj = new Date(evt.date + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isPast = eventDateObj < today;
            const pastClass = isPast ? 'past' : '';

            eventsHtml += `<div class="event-pill ${pastClass}" style="background-color: ${color};" title="${evt.title}" onclick="event.stopPropagation(); openDateModal(null, '${evt.id}')">${evt.title}</div>`;
        });

        daysHtml += `
            <div class="day-cell ${isToday ? 'today' : ''}" onclick="openDateModal('${currentDateStr}')">
                <span class="day-number">${i}</span>
                ${eventsHtml}
            </div>
        `;
    }

    // Next Month Days
    const remainingCells = 42 - (startDayIndex + daysInMonth); // 6 rows * 7 cols
    for (let i = 1; i <= remainingCells; i++) {
        daysHtml += `<div class="day-cell other-month"><span class="day-number">${i}</span></div>`;
    }

    calendarDays.innerHTML = daysHtml;
}

function renderSidebar() {
    // Render Courses
    const courseList = document.getElementById('course-list');
    const courseSelect = document.getElementById('event-course');

    courseList.innerHTML = '';

    // Reset Select
    courseSelect.innerHTML = '<option value="">General / No Course</option>';

    state.courses.forEach(course => {
        // Sidebar list
        const li = document.createElement('li');
        li.className = 'course-item';
        li.innerHTML = `<div class="course-dot" style="background-color: ${course.color}"></div><span>${course.name}</span>`;
        // Add click listener for editing
        li.addEventListener('click', () => openCourseModal(course.id));
        courseList.appendChild(li);

        // Modal Select
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    // Render Upcoming (Next 7 days)
    const upcomingList = document.getElementById('upcoming-list');
    upcomingList.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = state.events
        .map(e => ({ ...e, dateObj: new Date(e.date + 'T00:00:00') }))
        .filter(e => e.dateObj >= today)
        .sort((a, b) => a.dateObj - b.dateObj);
    // .slice(0, 5); // Removed limit per user request - show all

    if (upcomingEvents.length === 0) {
        upcomingList.innerHTML = '<div class="empty-state">No upcoming deadlines</div>';
    } else {
        upcomingEvents.forEach(evt => {
            const course = state.courses.find(c => c.id === evt.courseId);
            const color = course ? course.color : '#6366f1';

            const div = document.createElement('div');
            div.className = 'deadline-card';
            div.style.borderLeftColor = color;
            div.innerHTML = `
                <h4>${evt.title}</h4>
                <p>${evt.dateObj.toLocaleDateString()} &bull; ${course ? course.name : 'General'}</p>
            `;
            upcomingList.appendChild(div);
        });
    }

    // Sync Mobile Dashboard
    if (typeof renderMobileDashboard === 'function') {
        renderMobileDashboard();
    }
}

// Modal Handlers
let editingEventId = null;

function openDateModal(dateStr, eventId = null) {
    const modalTitle = document.getElementById('modal-title');
    const deleteBtn = document.getElementById('delete-event-btn');
    const formBtn = eventForm.querySelector('button[type="submit"]');

    if (eventId) {
        // Edit Mode
        editingEventId = eventId;
        const eventToEdit = state.events.find(e => e.id === eventId);

        if (eventToEdit) {
            modalTitle.textContent = 'Edit Event';
            document.getElementById('event-title').value = eventToEdit.title;
            eventDateInput.value = eventToEdit.date;
            document.getElementById('event-course').value = eventToEdit.courseId;

            // Set Radio
            const radio = document.querySelector(`input[name="eventType"][value="${eventToEdit.type}"]`);
            if (radio) radio.checked = true;

            deleteBtn.classList.remove('hidden');
            formBtn.textContent = 'Update Event';
        }
    } else {
        // Add Mode
        editingEventId = null;
        modalTitle.textContent = 'Add Event';
        eventForm.reset();
        if (dateStr) eventDateInput.value = dateStr;

        // Default to first course if available
        if (state.courses.length > 0) {
            document.getElementById('event-course').value = state.courses[0].id;
        } else {
            document.getElementById('event-course').value = "";
        }

        deleteBtn.classList.add('hidden');
        formBtn.textContent = 'Save Event';
    }

    eventModal.classList.add('visible');
    eventModal.classList.remove('hidden');
}

function closeModals() {
    eventModal.classList.remove('visible');
    eventModal.classList.add('hidden');

    // Also close course modal if exists
    const courseModal = document.getElementById('course-modal');
    if (courseModal) {
        courseModal.classList.remove('visible');
        courseModal.classList.add('hidden');
    }
    editingEventId = null;
}

// Event Listeners
prevMonthBtn.addEventListener('click', () => {
    state.currentDate.setMonth(state.currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    state.currentDate.setMonth(state.currentDate.getMonth() + 1);
    renderCalendar();
});

todayBtn.addEventListener('click', () => {
    state.currentDate = new Date();
    renderCalendar();
});

addEventMainBtn.addEventListener('click', () => {
    openDateModal(new Date().toISOString().split('T')[0]);
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
});

// Close click outside
window.addEventListener('click', (e) => {
    if (e.target === eventModal) closeModals();
    if (e.target === document.getElementById('course-modal')) closeModals();
});

// Add Event Form
// Delete Event
document.getElementById('delete-event-btn').addEventListener('click', () => {
    if (editingEventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            state.events = state.events.filter(e => e.id !== editingEventId);
            saveData();
            renderCalendar();
            renderSidebar();
            closeModals();
        }
    }
});

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('event-title').value;
    const date = eventDateInput.value;
    const courseId = document.getElementById('event-course').value;
    const type = document.querySelector('input[name="eventType"]:checked').value;

    if (editingEventId) {
        // Update existing
        const eventIndex = state.events.findIndex(e => e.id === editingEventId);
        if (eventIndex !== -1) {
            state.events[eventIndex] = {
                ...state.events[eventIndex],
                title,
                date,
                courseId,
                type
            };
        }
    } else {
        // Create new
        const newEvent = {
            id: Date.now().toString(),
            title,
            date,
            courseId,
            type
        };
        state.events.push(newEvent);
    }

    saveData();
    renderCalendar();
    renderSidebar();
    closeModals();
    eventForm.reset();
});

// Add Course Button
document.getElementById('add-course-btn').addEventListener('click', () => {
    openCourseModal();
});

let editingCourseId = null;

function openCourseModal(courseId = null) {
    const modalTitle = document.getElementById('course-modal-title');
    const deleteBtn = document.getElementById('delete-course-btn');
    const formBtn = courseForm.querySelector('button[type="submit"]');

    if (courseId) {
        // Edit Mode
        editingCourseId = courseId;
        const course = state.courses.find(c => c.id === courseId);
        if (course) {
            modalTitle.textContent = 'Edit Course';
            document.getElementById('course-name').value = course.name;
            document.getElementById('course-color').value = course.color;
            deleteBtn.classList.remove('hidden');
            formBtn.textContent = 'Update Course';
        }
    } else {
        // Add Mode
        editingCourseId = null;
        modalTitle.textContent = 'Add Course';
        courseForm.reset();
        deleteBtn.classList.add('hidden');
        formBtn.textContent = 'Add Course';
    }

    const courseModal = document.getElementById('course-modal');
    courseModal.classList.remove('hidden');
    courseModal.classList.add('visible');
}

// Delete Course
document.getElementById('delete-course-btn').addEventListener('click', () => {
    if (editingCourseId) {
        if (confirm(`Delete this course and all its events?`)) {
            // Delete Course
            state.courses = state.courses.filter(c => c.id !== editingCourseId);
            // Delete associated events
            state.events = state.events.filter(e => e.courseId !== editingCourseId);

            saveData();
            renderCalendar();
            renderSidebar();

            const courseModal = document.getElementById('course-modal');
            courseModal.classList.remove('visible');
            courseModal.classList.add('hidden');
        }
    }
});

const courseForm = document.getElementById('course-form');
courseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('course-name').value;
    const color = document.getElementById('course-color').value;

    if (editingCourseId) {
        // Update
        const idx = state.courses.findIndex(c => c.id === editingCourseId);
        if (idx !== -1) {
            state.courses[idx] = { ...state.courses[idx], name, color };
        }
    } else {
        // Create
        const newCourse = {
            id: 'c' + Date.now(),
            name,
            color
        };
        state.courses.push(newCourse);
    }

    saveData();
    renderSidebar();
    renderCalendar();

    courseForm.reset();
    document.getElementById('course-modal').classList.remove('visible');
    document.getElementById('course-modal').classList.add('hidden');
});

// Initialize
loadData();
renderCalendar();
renderSidebar();

// --- Mobile Navigation Logic ---
const navItems = document.querySelectorAll('.bottom-nav .nav-item[data-target]');
const viewSections = document.querySelectorAll('.view-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active from all
        navItems.forEach(nav => nav.classList.remove('active'));
        viewSections.forEach(view => view.classList.remove('active'));

        // Add active to current
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// Mobile FAB
document.getElementById('mobile-fab-add').addEventListener('click', () => {
    openDateModal(new Date().toISOString().split('T')[0]);
});

// Mobile Dashboard Sync (Extend renderSidebar)
// We'll wrap the original renderSidebar or just append this logic
function renderMobileDashboard() {
    const mobileCourseList = document.getElementById('mobile-course-list');
    const mobileUpcomingList = document.getElementById('mobile-upcoming-list');

    // Safety check if elements exist
    if (!mobileCourseList || !mobileUpcomingList) return;

    // 1. Rebuild Course List with Listeners
    mobileCourseList.innerHTML = '';
    state.courses.forEach(course => {
        const li = document.createElement('li');
        li.className = 'course-item';
        li.innerHTML = `<div class="course-dot" style="background-color: ${course.color}"></div><span>${course.name}</span>`;
        // Critical: Add listener again for mobile elements
        li.addEventListener('click', () => openCourseModal(course.id));
        mobileCourseList.appendChild(li);
    });

    // 2. Copy Upcoming List (No listeners needed here, simple display)
    const upcomingSource = document.getElementById('upcoming-list');
    if (upcomingSource) {
        mobileUpcomingList.innerHTML = upcomingSource.innerHTML;
    }
}

// Hook into the original renderSidebar by overriding or calling it
// A cleaner way is to just call renderMobileDashboard at the end of renderSidebar
// Since I can't easily append to the function without parsing, I will just call it periodically or modify the original function.
// Let's modify the original function in a separate edit step for cleanliness, 
// OR I can just listen for a custom event. For now, I'll manually call it here and add it to listeners.
renderMobileDashboard();

document.getElementById('mobile-add-course-btn').addEventListener('click', () => {
    const courseModal = document.getElementById('course-modal');
    courseModal.classList.remove('hidden');
    courseModal.classList.add('visible');
});
