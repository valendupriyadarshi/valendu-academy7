// ================================
// Initialize DOM Elements
// ================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const heroBtn = document.getElementById('heroBtn');
const roadmapBtn = document.getElementById('roadmapBtn');
const roadmapBtns = document.querySelectorAll('.roadmap-btn');
const viewDrillsBtns = document.querySelectorAll('.view-drills-btn');
const modal = document.getElementById('drillsModal');
const modalClose = document.querySelector('.modal-close');
const achievementBtns = document.querySelectorAll('.achievement-btn');
const downloadBtn = document.getElementById('downloadBtn');
const contactForm = document.getElementById('contactForm');
const backToTop = document.getElementById('backToTop');

// ================================
// Hamburger Menu Toggle
// ================================

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ================================
// Smooth Scrolling for Navigation Links
// ================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ================================
// Hero Button - Scroll to Training Section
// ================================

heroBtn.addEventListener('click', () => {
    const trainingSection = document.getElementById('training');
    trainingSection.scrollIntoView({ behavior: 'smooth' });
});

// ================================
// Roadmap Button - Scroll to Training Section
// ================================

roadmapBtn.addEventListener('click', () => {
    const trainingSection = document.getElementById('training');
    trainingSection.scrollIntoView({ behavior: 'smooth' });
});

// ================================
// Training Roadmap - Accordion Functionality
// ================================

roadmapBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.getAttribute('data-level');
        const detailsElement = document.getElementById(`details-${level}`);
        
        // Close all other details
        document.querySelectorAll('.roadmap-details').forEach(details => {
            if (details !== detailsElement) {
                details.classList.remove('show');
            }
        });
        
        // Toggle current details
        detailsElement.classList.toggle('show');
        
        // Change button text
        if (detailsElement.classList.contains('show')) {
            btn.textContent = 'Show Less';
        } else {
            btn.textContent = 'Learn More';
        }
    });
});

// ================================
// Position Drills - Modal Popup
// ================================

const positionDrills = {
    'Goalkeeper': [
        'Shot-stopping and reflex training',
        'Penalty kick practice and saves',
        'Distribution and passing accuracy',
        'Communication and positioning',
        'One-on-one situations',
        'Set piece handling'
    ],
    'Defender': [
        'Positioning and marking techniques',
        'Tackling and sliding drills',
        'Header practice and aerial awareness',
        'Defensive shape and coverage',
        'Recovery runs and tracking',
        'Building from the back'
    ],
    'Midfielder': [
        'Passing accuracy and vision drills',
        'Ball control in tight spaces',
        'Transition play and pressing',
        'Set piece delivery',
        'Stamina and positioning',
        'Linking defense and attack'
    ],
    'Striker': [
        'Finishing and shooting accuracy',
        'Movement in the box',
        'Header practice and positioning',
        'One-touch finishes',
        'Physical fitness and strength',
        'Decision-making in front of goal'
    ]
};

viewDrillsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const position = btn.getAttribute('data-position');
        const drills = positionDrills[position];
        
        // Set modal title
        document.getElementById('modalTitle').textContent = `${position} Training Drills`;
        
        // Build modal body with drills list
        const drillsList = drills.map(drill => `<li>${drill}</li>`).join('');
        document.getElementById('modalBody').innerHTML = `<ul>${drillsList}</ul>`;
        
        // Show modal
        modal.classList.add('show');
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// ================================
// Football Legends - Expand Achievements
// ================================

achievementBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const player = btn.getAttribute('data-player');
        const achievementsElement = document.getElementById(`achievements-${player}`);
        
        // Toggle achievements
        achievementsElement.classList.toggle('show');
        
        // Change button text
        if (achievementsElement.classList.contains('show')) {
            btn.textContent = 'Hide Achievements';
        } else {
            btn.textContent = 'View Achievements';
        }
    });
});

// ================================
// Download Plan Button
// ================================

downloadBtn.addEventListener('click', () => {
    // Show alert indicating download start
    alert('Download Started! Your weekly training plan is being generated as a PDF.');
    
    // In a real application, this would trigger an actual PDF download
    // For now, we'll simulate with an alert
    console.log('Download Plan triggered');
});

// ================================
// Contact Form Validation and Submission
// ================================

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate fields
    if (!name) {
        showValidationError('Please enter your name');
        return;
    }
    
    if (!email) {
        showValidationError('Please enter your email');
        return;
    }
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showValidationError('Please enter a valid email address');
        return;
    }
    
    if (!message) {
        showValidationError('Please enter a message');
        return;
    }
    
    // Show success message
    showSuccessMessage('Thank you for reaching out! We\'ll get back to you soon.');
    
    // Reset form
    contactForm.reset();
    
    // Log form data (in a real app, send to server)
    console.log('Form submitted:', { name, email, message });
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show validation error
function showValidationError(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.backgroundColor = 'rgba(255, 77, 77, 0.2)';
    successMessage.style.borderColor = '#ff4d4d';
    successMessage.style.color = '#ff4d4d';
    successMessage.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Helper function to show success message
function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.backgroundColor = 'rgba(29, 185, 84, 0.2)';
    successMessage.style.borderColor = 'var(--primary-color)';
    successMessage.style.color = 'var(--primary-color)';
    successMessage.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 4000);
}

// ================================
// Back to Top Button
// ================================

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

// Initially hide back to top button
backToTop.style.display = 'none';

// ================================
// Page Load Animation
// ================================

window.addEventListener('load', () => {
    console.log('ProFootball Academy website loaded successfully!');
    // Add any additional load animations here if needed
});

// ================================
// Keyboard Navigation
// ================================

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('show');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
