/* ================================
   VALENDU ACADEMY - Main Script
   Modern Football Training Platform
   ================================ */

// ================================
// 1. INITIALIZATION & DOM ELEMENTS
// ================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeToggleNav = document.getElementById('darkModeToggleNav');

// ================================
// 2. DARK MODE TOGGLE
// ================================

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.apply();
    }

    apply() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            if (darkModeToggleNav) darkModeToggleNav.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            if (darkModeToggleNav) darkModeToggleNav.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.apply();
    }
}

const themeManager = new ThemeManager();

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => themeManager.toggle());
}

if (darkModeToggleNav) {
    darkModeToggleNav.addEventListener('click', () => themeManager.toggle());
}

// ================================
// 3. HAMBURGER MENU TOGGLE
// ================================

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ================================
// 4. SMOOTH SCROLLING
// ================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ================================
// 5. AUTHENTICATION SYSTEM
// ================================

class AuthManager {
    constructor() {
        this.storageKey = 'valendu_users';
        this.currentUserKey = 'valendu_current_user';
        this.initializeDemo();
    }

    initializeDemo() {
        const users = this.getAllUsers();
        if (users.length === 0) {
            this.register('demo@valendu.com', 'demo123', 'Demo User', 'Beginner', 'Midfielder');
        }
    }

    register(email, password, fullName, level, position) {
        const users = this.getAllUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = {
            id: Date.now(),
            email,
            password,
            fullName,
            level,
            position,
            createdAt: new Date().toISOString(),
            drills: [],
            bookings: [],
            stats: {
                speed: 8.5,
                stamina: 78,
                strength: 85,
                sessions: 12,
                history: []
            }
        };

        users.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return { success: true, message: 'Registration successful' };
    }

    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            return { success: true, user };
        }

        return { success: false, message: 'Invalid credentials' };
    }

    logout() {
        localStorage.removeItem(this.currentUserKey);
    }

    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    getAllUsers() {
        const users = localStorage.getItem(this.storageKey);
        return users ? JSON.parse(users) : [];
    }

    updateUser(user) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem(this.storageKey, JSON.stringify(users));
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        }
    }
}

const authManager = new AuthManager();

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = authManager.login(email, password);
        const messageDiv = document.getElementById('authMessage');

        if (result.success) {
            messageDiv.textContent = 'Login successful! Redirecting...';
            messageDiv.style.backgroundColor = 'rgba(29, 185, 84, 0.2)';
            messageDiv.style.borderColor = '#1db954';
            messageDiv.style.color = '#1db954';
            messageDiv.classList.add('show');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.backgroundColor = 'rgba(255, 77, 77, 0.2)';
            messageDiv.style.borderColor = '#ff4d4d';
            messageDiv.style.color = '#ff4d4d';
            messageDiv.classList.add('show');

            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 3000);
        }
    });
}

// Handle signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('signupEmail').value;
        const position = document.getElementById('position').value;
        const level = document.getElementById('level').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const messageDiv = document.getElementById('authMessage');

        if (password !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match';
            messageDiv.style.backgroundColor = 'rgba(255, 77, 77, 0.2)';
            messageDiv.style.borderColor = '#ff4d4d';
            messageDiv.style.color = '#ff4d4d';
            messageDiv.classList.add('show');
            return;
        }

        const result = authManager.register(email, password, fullName, level, position);

        if (result.success) {
            messageDiv.textContent = 'Registration successful! Redirecting to login...';
            messageDiv.style.backgroundColor = 'rgba(29, 185, 84, 0.2)';
            messageDiv.style.borderColor = '#1db954';
            messageDiv.style.color = '#1db954';
            messageDiv.classList.add('show');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.backgroundColor = 'rgba(255, 77, 77, 0.2)';
            messageDiv.style.borderColor = '#ff4d4d';
            messageDiv.style.color = '#ff4d4d';
            messageDiv.classList.add('show');

            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 3000);
        }
    });
}

// ================================
// 6. DRILL LIBRARY SYSTEM
// ================================

const drillsData = [
    { id: 1, name: 'Sprint Training', level: 'Beginner', category: 'Speed', description: 'Explosive sprint drills to increase running speed' },
    { id: 2, name: 'Cone Weaving', level: 'Beginner', category: 'Speed', description: 'Agility training with cone obstacles' },
    { id: 3, name: 'Pass and Move', level: 'Beginner', category: 'Passing', description: 'Basic passing accuracy and positioning' },
    { id: 4, name: 'One-Touch Passing', level: 'Intermediate', category: 'Passing', description: 'Advanced first-touch and passing combinations' },
    { id: 5, name: 'Target Practice', level: 'Beginner', category: 'Shooting', description: 'Shooting accuracy with targets' },
    { id: 6, name: 'Finisher Drill', level: 'Intermediate', category: 'Shooting', description: 'Professional finishing techniques' },
    { id: 7, name: 'Overhead Shots', level: 'Advanced', category: 'Shooting', description: 'Advanced aerial shooting skills' },
    { id: 8, name: 'Marking Drills', level: 'Intermediate', category: 'Defense', description: 'Defensive positioning and player marking' },
    { id: 9, name: 'Tactical Defense', level: 'Advanced', category: 'Defense', description: 'Advanced defensive formations and tactics' }
];

class DrillManager {
    static renderDrills(filter = 'all', category = 'all', containerId = 'drillsContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        let filteredDrills = drillsData;

        if (filter !== 'all') {
            filteredDrills = filteredDrills.filter(d => d.level === filter);
        }

        if (category !== 'all') {
            filteredDrills = filteredDrills.filter(d => d.category === category);
        }

        container.innerHTML = filteredDrills.map(drill => `
            <div class="drill-card" data-id="${drill.id}">
                <div class="drill-header">
                    <span class="drill-level">${drill.level}</span>
                </div>
                <div class="drill-content">
                    <h3>${drill.name}</h3>
                    <span class="drill-category">${drill.category}</span>
                    <p class="drill-description">${drill.description}</p>
                    <button class="drill-btn" onclick="drillManager.saveDrill(${drill.id})">Save Drill</button>
                </div>
            </div>
        `).join('');
    }

    static saveDrill(drillId) {
        const currentUser = authManager.getCurrentUser();
        if (!currentUser) {
            alert('Please login to save drills');
            return;
        }

        const drill = drillsData.find(d => d.id === drillId);
        if (drill && !currentUser.drills.find(d => d.id === drill.id)) {
            currentUser.drills.push(drill);
            authManager.updateUser(currentUser);
            alert('Drill saved successfully!');
        }
    }
}

// Initialize drill rendering on home page
if (document.getElementById('drillsContainer')) {
    DrillManager.renderDrills();

    // Filter buttons
    const levelFilters = document.querySelectorAll('[data-filter]');
    const categoryFilters = document.querySelectorAll('[data-category]');

    levelFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            levelFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const level = btn.getAttribute('data-filter');
            const category = document.querySelector('[data-category].active')?.getAttribute('data-category') || 'all';
            DrillManager.renderDrills(level, category);
        });
    });

    categoryFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            const level = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'all';
            DrillManager.renderDrills(level, category);
        });
    });
}

// ================================
// 7. TESTIMONIALS SLIDER
// ================================

class TestimonialSlider {
    constructor() {
        this.track = document.querySelector('.testimonials-track');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        this.indicatorsContainer = document.getElementById('sliderIndicators');
        this.currentIndex = 0;

        if (this.track) {
            this.init();
        }
    }

    init() {
        this.createIndicators();
        this.autoSlide();

        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.slide(-1));
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.slide(1));
    }

    createIndicators() {
        const cards = this.track.querySelectorAll('.testimonial-card');
        for (let i = 0; i < cards.length; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator' + (i === 0 ? ' active' : '');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    slide(direction) {
        const cards = this.track.querySelectorAll('.testimonial-card');
        const cardWidth = cards[0].offsetWidth + 30;
        this.currentIndex += direction;

        if (this.currentIndex >= cards.length) this.currentIndex = 0;
        if (this.currentIndex < 0) this.currentIndex = cards.length - 1;

        this.updateSlider();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    updateSlider() {
        const cards = this.track.querySelectorAll('.testimonial-card');
        const cardWidth = cards[0].offsetWidth + 30;
        this.track.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;

        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((ind, index) => {
            ind.classList.toggle('active', index === this.currentIndex);
        });
    }

    autoSlide() {
        setInterval(() => {
            this.slide(1);
        }, 4000);
    }
}

const testimonialSlider = new TestimonialSlider();

// ================================
// 8. ANIMATED COUNTER
// ================================

class CounterAnimation {
    static init() {
        const counters = document.querySelectorAll('.counter-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            this.animateCounter(counter, target);
        });
    }

    static animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 50);
    }
}

// Trigger counter animation on scroll
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('counter-number')) {
            CounterAnimation.init();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.counter-number').forEach(counter => {
    observer.observe(counter);
});

// ================================
// 9. LEADERBOARD DATA
// ================================

const leaderboardData = [
    { rank: 1, name: 'Cristiano Silva', position: 'Striker', speed: 9.8, goals: 45 },
    { rank: 2, name: 'Lionel Santos', position: 'Midfielder', speed: 9.5, assists: 32 },
    { rank: 3, name: 'Neymar Costa', position: 'Winger', speed: 9.7, goals: 38 },
    { rank: 4, name: 'Sergio Ramos', position: 'Defender', speed: 8.9, tackles: 125 },
    { rank: 5, name: 'Manuel Neuer', position: 'Goalkeeper', speed: 8.2, saves: 89 }
];

class LeaderboardManager {
    static renderLeaderboard(containerId = 'leaderboardDisplay') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = leaderboardData.map(player => `
            <div class="leaderboard-card">
                <div class="rank-badge">#${player.rank}</div>
                <div class="player-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h3>${player.name}</h3>
                <p class="student-position">${player.position}</p>
                <div class="player-stats">
                    <div class="stat-item">
                        <div class="stat-label">Speed</div>
                        <div class="stat-number">${player.speed}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">${player.goals ? 'Goals' : player.assists ? 'Assists' : player.tackles ? 'Tackles' : 'Saves'}</div>
                        <div class="stat-number">${player.goals || player.assists || player.tackles || player.saves}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize leaderboard
if (document.getElementById('leaderboardDisplay')) {
    LeaderboardManager.renderLeaderboard();
}

// ================================
// 10. CONTACT FORM
// ================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showMessage('Please fill all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email', 'error');
            return;
        }

        showMessage('Message received! We will contact you soon.', 'success');
        contactForm.reset();

        setTimeout(() => {
            document.getElementById('successMessage').classList.remove('show');
        }, 4000);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('successMessage');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.style.backgroundColor = type === 'success' ? 'rgba(29, 185, 84, 0.2)' : 'rgba(255, 77, 77, 0.2)';
        messageDiv.style.borderColor = type === 'success' ? '#1db954' : '#ff4d4d';
        messageDiv.style.color = type === 'success' ? '#1db954' : '#ff4d4d';
        messageDiv.classList.add('show');
    }
}

// ================================
// 10. PLAYER STAT COUNTERS
// ================================

class StatCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target);
        this.duration = duration;
        this.current = 0;
        this.startTime = null;
        this.isAnimating = false;
    }

    animate() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const start = Date.now();
        const startValue = 0;
        const difference = this.target - startValue;

        const animateCounter = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / this.duration, 1);
            
            this.current = Math.floor(startValue + difference * this.easeOutQuad(progress));
            this.element.textContent = this.current;

            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            } else {
                this.element.textContent = this.target;
                this.isAnimating = false;
            }
        };

        animateCounter();
    }

    easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }
}

class ProgressBar {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target);
        this.duration = duration;
        this.isAnimating = false;
    }

    animate() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const start = Date.now();
        const maxWidth = 100;

        const animateProgress = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / this.duration, 1);
            
            const width = maxWidth * this.easeOutQuad(progress) * (this.target / 100);
            this.element.style.width = width + '%';

            if (progress < 1) {
                requestAnimationFrame(animateProgress);
            } else {
                this.element.style.width = (maxWidth * (this.target / 100)) + '%';
                this.isAnimating = false;
            }
        };

        animateProgress();
    }

    easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }
}

// Initialize stat counters and progress bars on page load
function initializeStatAnimations() {
    // Hall of Fame counters
    const statCounters = document.querySelectorAll('.stat-counter[data-target]');
    statCounters.forEach(counter => {
        const target = counter.getAttribute('data-target');
        const statCounter = new StatCounter(counter, target, 2000);
        
        // Animate when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statCounter.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });

    // Elite Performer progress bars
    const progressFills = document.querySelectorAll('.progress-fill[data-target]');
    progressFills.forEach(fill => {
        const target = fill.getAttribute('data-target');
        const progressBar = new ProgressBar(fill, target, 2000);
        
        // Animate when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(fill);
    });
}

// ================================
// 11. PAGE LOAD ANIMATIONS
// ================================

window.addEventListener('load', () => {
    console.log('✓ Valendu Academy loaded successfully');
    initializeStatAnimations();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        const modal = document.getElementById('drillsModal');
        if (modal) modal.classList.remove('show');
    }
});

// ================================
// END OF MAIN SCRIPT
// ================================
