/* ================================
   DASHBOARD - Interactive Features
   ================================ */

// ================================
// 1. DASHBOARD INITIALIZATION
// ================================

class DashboardManager {
    constructor() {
        this.currentUser = authManager.getCurrentUser();
        
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.init();
    }

    init() {
        this.setupUserInfo();
        this.setupSidebarNavigation();
        this.setupBookingSystem();
        this.setupProgressTracker();
        this.setupBMICalculator();
        this.setupLogout();
        this.initializeCharts();
        this.renderLeaderboard();
        this.renderDrillsTab();
        this.loadBookedSessions();
    }

    setupUserInfo() {
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userLevelDisplay = document.getElementById('userLevelDisplay');
        const welcomeName = document.getElementById('welcomeName');

        if (userNameDisplay) userNameDisplay.textContent = this.currentUser.fullName;
        if (userLevelDisplay) userLevelDisplay.textContent = this.currentUser.level;
        if (welcomeName) welcomeName.textContent = this.currentUser.fullName.split(' ')[0];

        // Update stats
        document.getElementById('speedStat').textContent = this.currentUser.stats.speed;
        document.getElementById('staminaStat').textContent = this.currentUser.stats.stamina;
        document.getElementById('strengthStat').textContent = this.currentUser.stats.strength;
        document.getElementById('sessionsStat').textContent = this.currentUser.stats.sessions;

        // Load saved drills
        this.loadSavedDrills();
    }

    setupSidebarNavigation() {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);

                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    switchSection(section) {
        document.querySelectorAll('.dashboard-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    loadSavedDrills() {
        const container = document.getElementById('savedDrills');
        if (!container) return;

        if (this.currentUser.drills.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No drills saved yet. Visit the Training Drills section to add drills!</p>';
            return;
        }

        container.innerHTML = this.currentUser.drills.map(drill => `
            <div class="drill-item">
                <strong>${drill.name}</strong>
                <p style="font-size: 0.85rem;">${drill.category} - ${drill.level}</p>
            </div>
        `).join('');
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authManager.logout();
                window.location.href = 'login.html';
            });
        }
    }
}

// ================================
// 2. BOOKING SYSTEM
// ================================

class BookingSystem {
    static setupBookingSystem() {
        const bookBtn = document.getElementById('bookBtn');
        const bookingDate = document.getElementById('bookingDate');
        const bookingConfirm = document.getElementById('bookingConfirmation');

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        if (bookingDate) bookingDate.setAttribute('min', today);

        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                const date = document.getElementById('bookingDate').value;
                const time = document.getElementById('bookingTime').value;
                const coachType = document.getElementById('coachType').value;

                if (!date || !time || !coachType) {
                    alert('Please select all fields');
                    return;
                }

                const currentUser = authManager.getCurrentUser();
                const booking = { date, time, coachType, bookedAt: new Date().toISOString() };

                currentUser.bookings.push(booking);
                authManager.updateUser(currentUser);

                // Show confirmation
                bookingConfirm.innerHTML = `
                    <h3 style="color: var(--primary-color); margin-bottom: 10px;">✓ Booking Confirmed!</h3>
                    <p>Date: ${date}</p>
                    <p>Time: ${time}</p>
                    <p>Coach Type: ${coachType}</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">A confirmation email will be sent shortly.</p>
                `;
                bookingConfirm.classList.add('show');

                // Reset form
                document.getElementById('bookingDate').value = '';
                document.getElementById('bookingTime').value = '';
                document.getElementById('coachType').value = '';

                // Reload bookings
                BookingSystem.loadBookedSessions();

                setTimeout(() => {
                    bookingConfirm.classList.remove('show');
                }, 5000);
            });
        }
    }

    static loadBookedSessions() {
        const container = document.getElementById('bookedSessionsList');
        if (!container) return;

        const currentUser = authManager.getCurrentUser();

        if (currentUser.bookings.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No sessions booked yet.</p>';
            return;
        }

        container.innerHTML = currentUser.bookings.map((booking, index) => `
            <div class="session-item">
                <div class="session-date"><i class="fas fa-calendar"></i> ${booking.date}</div>
                <p><i class="fas fa-clock"></i> ${booking.time}</p>
                <p><i class="fas fa-user-tie"></i> ${booking.coachType}</p>
                <button class="btn btn-secondary btn-sm" onclick="BookingSystem.cancelBooking(${index})" style="margin-top: 10px; width: 100%;">Cancel</button>
            </div>
        `).join('');
    }

    static cancelBooking(index) {
        const currentUser = authManager.getCurrentUser();
        currentUser.bookings.splice(index, 1);
        authManager.updateUser(currentUser);
        BookingSystem.loadBookedSessions();
    }
}

// ================================
// 3. PROGRESS TRACKER WITH CHARTS
// ================================

class ProgressTracker {
    constructor() {
        this.charts = {};
        this.setupCharts();
        this.setupStatsUpdate();
    }

    setupCharts() {
        const chartConfig = {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#b3b3b3' },
                        grid: { color: '#282828' }
                    },
                    x: {
                        ticks: { color: '#b3b3b3' },
                        grid: { color: '#282828' }
                    }
                }
            }
        };

        // Speed Chart
        const speedCtx = document.getElementById('speedChart');
        if (speedCtx) {
            this.charts.speed = new Chart(speedCtx, {
                ...chartConfig,
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'This Week'],
                    datasets: [{
                        label: 'Speed (km/h)',
                        data: [8.2, 8.4, 8.5, 8.7, 8.6, 8.5],
                        borderColor: '#1db954',
                        backgroundColor: 'rgba(29, 185, 84, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                }
            });
        }

        // Stamina Chart
        const staminaCtx = document.getElementById('staminaChart');
        if (staminaCtx) {
            this.charts.stamina = new Chart(staminaCtx, {
                ...chartConfig,
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'This Week'],
                    datasets: [{
                        label: 'Stamina (%)',
                        data: [70, 72, 75, 76, 77, 78],
                        borderColor: '#ff7043',
                        backgroundColor: 'rgba(255, 112, 67, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                }
            });
        }

        // Strength Chart
        const strengthCtx = document.getElementById('strengthChart');
        if (strengthCtx) {
            this.charts.strength = new Chart(strengthCtx, {
                ...chartConfig,
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'This Week'],
                    datasets: [{
                        label: 'Strength (%)',
                        data: [78, 80, 82, 83, 84, 85],
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                }
            });
        }
    }

    setupStatsUpdate() {
        const updateBtn = document.getElementById('updateStatsBtn');
        if (!updateBtn) return;

        updateBtn.addEventListener('click', () => {
            const speed = parseFloat(document.getElementById('inputSpeed').value) || 0;
            const stamina = parseInt(document.getElementById('inputStamina').value) || 0;
            const strength = parseInt(document.getElementById('inputStrength').value) || 0;

            const currentUser = authManager.getCurrentUser();
            currentUser.stats.speed = speed;
            currentUser.stats.stamina = stamina;
            currentUser.stats.strength = strength;
            currentUser.stats.history.push({
                date: new Date().toISOString(),
                speed, stamina, strength
            });

            authManager.updateUser(currentUser);

            // Update display
            document.getElementById('speedStat').textContent = speed;
            document.getElementById('staminaStat').textContent = stamina;
            document.getElementById('strengthStat').textContent = strength;

            alert('Stats updated successfully!');
        });
    }
}

// ================================
// 4. BMI CALCULATOR
// ================================

class BMICalculator {
    static setup() {
        const calculateBtn = document.getElementById('calculateBmiBtn');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', () => {
            const height = parseFloat(document.getElementById('height').value) / 100; // Convert to meters
            const weight = parseFloat(document.getElementById('weight').value);

            if (!height || !weight) {
                alert('Please enter both height and weight');
                return;
            }

            const bmi = (weight / (height * height)).toFixed(2);
            let category = '';

            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal Weight';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';

            const resultDiv = document.getElementById('bmiResult');
            resultDiv.innerHTML = `
                <h3>Your BMI: ${bmi}</h3>
                <p style="font-size: 1.1rem; margin: 15px 0;">Category: <strong>${category}</strong></p>
                <p style="font-size: 0.9rem;">
                    ${category === 'Normal Weight' ? '✓ Great! You are in a healthy BMI range.' : 'Consider consulting a nutritionist for personalized advice.'}
                </p>
            `;
            resultDiv.classList.add('show');
        });
    }
}

// ================================
// 5. DRILLS TAB RENDERING
// ================================

class DashboardDrills {
    static renderDrills() {
        const container = document.getElementById('drillsContainer');
        if (!container) return;

        // Render all drills with filters
        const drillsData = [
            { id: 1, name: 'Sprint Training', level: 'Beginner', category: 'Speed', description: 'Explosive sprint drills' },
            { id: 2, name: 'Cone Weaving', level: 'Beginner', category: 'Speed', description: 'Agility with cones' },
            { id: 3, name: 'Pass and Move', level: 'Beginner', category: 'Passing', description: 'Passing accuracy' },
            { id: 4, name: 'One-Touch Passing', level: 'Intermediate', category: 'Passing', description: 'Advanced passing' },
            { id: 5, name: 'Target Practice', level: 'Beginner', category: 'Shooting', description: 'Shooting targets' },
            { id: 6, name: 'Finisher Drill', level: 'Intermediate', category: 'Shooting', description: 'Professional finishing' },
            { id: 7, name: 'Overhead Shots', level: 'Advanced', category: 'Shooting', description: 'Aerial shooting' },
            { id: 8, name: 'Marking Drills', level: 'Intermediate', category: 'Defense', description: 'Player marking' },
            { id: 9, name: 'Tactical Defense', level: 'Advanced', category: 'Defense', description: 'Advanced defense' }
        ];

        container.innerHTML = drillsData.map(drill => `
            <div class="drill-card" data-level="${drill.level}" data-category="${drill.category}">
                <div class="drill-header">
                    <span class="drill-level">${drill.level}</span>
                </div>
                <div class="drill-content">
                    <h3>${drill.name}</h3>
                    <span class="drill-category">${drill.category}</span>
                    <p class="drill-description">${drill.description}</p>
                    <button class="drill-btn" onclick="DashboardDrills.saveDrill(${drill.id}, '${drill.name}')">Save Drill</button>
                </div>
            </div>
        `).join('');

        this.setupFilters();
    }

    static setupFilters() {
        const filterBtns = document.querySelectorAll('[data-filter], [data-category]');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update button styles
                if (btn.getAttribute('data-filter') !== null) {
                    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                } else {
                    document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }

                this.applyFilters();
            });
        });
    }

    static applyFilters() {
        const selectedLevel = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'all';
        const selectedCategory = document.querySelector('[data-category].active')?.getAttribute('data-category') || 'all';

        document.querySelectorAll('.drill-card').forEach(card => {
            const cardLevel = card.getAttribute('data-level');
            const cardCategory = card.getAttribute('data-category');

            const levelMatch = selectedLevel === 'all' || cardLevel === selectedLevel;
            const categoryMatch = selectedCategory === 'all' || cardCategory === selectedCategory;

            card.style.display = levelMatch && categoryMatch ? 'flex' : 'none';
        });
    }

    static saveDrill(id, name) {
        const currentUser = authManager.getCurrentUser();
        if (!currentUser.drills.find(d => d.id === id)) {
            currentUser.drills.push({ id, name });
            authManager.updateUser(currentUser);
            alert(`"${name}" saved successfully!`);
        } else {
            alert('Drill already saved!');
        }
    }
}

// ================================
// 6. LEADERBOARD RENDERING
// ================================

class DashboardLeaderboard {
    static render() {
        const container = document.getElementById('leaderboardContainer');
        if (!container) return;

        const leaderboardData = [
            { rank: 1, name: 'Cristiano Silva', position: 'Striker', speed: 9.8, goals: 45 },
            { rank: 2, name: 'Lionel Santos', position: 'Midfielder', speed: 9.5, assists: 32 },
            { rank: 3, name: 'Neymar Costa', position: 'Winger', speed: 9.7, goals: 38 },
            { rank: 4, name: 'Sergio Ramos', position: 'Defender', speed: 8.9, tackles: 125 },
            { rank: 5, name: 'Manuel Neuer', position: 'Goalkeeper', speed: 8.2, saves: 89 }
        ];

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

// ================================
// 7. INITIALIZATION
// ================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const dashboardManager = new DashboardManager();
    const progressTracker = new ProgressTracker();
    
    BookingSystem.setupBookingSystem();
    BookingSystem.loadBookedSessions();
    BMICalculator.setup();
    DashboardDrills.renderDrills();
    DashboardLeaderboard.render();
});

// ================================
// 8. CERTIFICATE GENERATOR (jsPDF alternative)
// ================================

class CertificateGenerator {
    static generate() {
        const currentUser = authManager.getCurrentUser();
        if (!currentUser) return;

        // Create simple HTML certificate
        const certificateHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certificate - ${currentUser.fullName}</title>
                <style>
                    body { margin: 0; padding: 40px; font-family: Arial, sans-serif; background: white; }
                    .certificate { border: 3px solid #1db954; padding: 60px; text-align: center; max-width: 800px; margin: 0 auto; background: linear-gradient(135deg, rgba(29, 185, 84, 0.05), transparent); }
                    .header { color: #1db954; font-size: 48px; font-weight: bold; margin-bottom: 10px; }
                    .subtitle { color: #666; font-size: 20px; margin-bottom: 40px; }
                    .content { margin: 40px 0; line-height: 1.8; }
                    .name { color: #1db954; font-size: 32px; font-weight: bold; margin: 20px 0; }
                    .course { color: #333; font-size: 18px; margin: 20px 0; }
                    .date { color: #666; font-size: 14px; margin-top: 40px; }
                    .signature { margin-top: 60px; }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="header">Certificate of Excellence</div>
                    <div class="subtitle">Valendu Academy</div>
                    <div class="content">
                        <p>This is to certify that</p>
                        <div class="name">${currentUser.fullName}</div>
                        <p>has successfully completed the training program at</p>
                        <div class="course">${currentUser.level} Football Training Course</div>
                        <p>in recognition of dedicated effort and outstanding performance</p>
                        <div class="signature">
                            <p style="margin-top: 60px;">_________________________</p>
                            <p style="margin-top: 0;">Authorized Signature</p>
                        </div>
                        <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const win = window.open();
        win.document.write(certificateHTML);
        win.document.close();
        win.print();
    }
}

// ================================
// END OF DASHBOARD SCRIPT
// ================================
