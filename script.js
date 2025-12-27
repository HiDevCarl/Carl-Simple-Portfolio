import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyAoJEo8Q8yPltkFOAIFYcAm_AzhUcS-YPI",
    authDomain: "carl-portfolio-cc35a.firebaseapp.com",
    databaseURL: "https://carl-portfolio-cc35a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "carl-portfolio-cc35a",
    storageBucket: "carl-portfolio-cc35a.firebasestorage.app",
    messagingSenderId: "764708600330",
    appId: "1:764708600330:web:7569ce02e22c221012fdf3",
    measurementId: "G-FHCHDMW8EM"
};

let app, database;

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
} catch (error) {
    console.error('Firebase initialization error:', error);
}

const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');

function toggleMenu() {
    navLinks.classList.toggle('active');
    mobileMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
}

mobileMenu.addEventListener('click', toggleMenu);

mobileMenu.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.setAttribute('aria-expanded', false);
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
        navLinks.classList.remove('active');
        mobileMenu.setAttribute('aria-expanded', false);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    const now = new Date();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        message: document.getElementById('message').value.trim(),
        date: now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        time: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true
        }),
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        month: now.toLocaleDateString('en-US', { month: 'long' }),
        year: now.getFullYear(),
        timestamp: serverTimestamp()
    };

    try {
        const messagesRef = ref(database, 'messages');
        await push(messagesRef, formData);
        
        formMessage.className = 'form-message success';
        formMessage.textContent = '✓ Thank you for reaching out! Your message has been successfully sent.';
        formMessage.style.display = 'block';
        form.reset();
        
    } catch (error) {
        console.error('Submission error:', error);
        formMessage.className = 'form-message error';
        formMessage.textContent = '✗ Something went wrong. Please try again later.';
        formMessage.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

window.addEventListener('scroll', () => {
    header.style.borderBottomColor = window.pageYOffset > 20 
        ? 'var(--accent-primary)' 
        : 'var(--border-color)';
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = entry.target.classList.contains('project-card') 
                ? 'scale(1)' 
                : 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
});

document.querySelectorAll('.project-card, .about-text, .skills, .contact-info, .contact-form').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.project-card').forEach(c => c.classList.remove('zoom-active'));
        card.classList.add('zoom-active');
    });
});

document.addEventListener('click', (e) => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection && !projectsSection.contains(e.target)) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.remove('zoom-active');
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.remove('zoom-active');
        });
    }
});