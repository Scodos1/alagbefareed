// ================================
// Premium Portfolio - Main Script
// Smooth Animations & Premium UX
// ================================

// ================================
// Project Data
// ================================
const projectData = {
    fashion: {
        title: 'StylesByTiwa',
        category: 'Web Application',
        description: 'A modern fashion website showcasing clothing collections with a clean and responsive UI. Features an elegant design with seamless navigation, responsive product displays, and an immersive browsing experience.',
        features: [
            'Clean, modern UI design',
            'Responsive product grid layout',
            'Smooth animations & transitions',
            'Intuitive navigation flow',
            'Mobile-first approach'
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        image: 'stylesbytiwa-preview.png',
        liveUrl: 'https://scodos1.github.io/stylesbytiwa/',
        githubUrl: 'https://github.com/Scodos1/stylesbytiwa'
    },
    portfolio: {
        title: 'Portfolio Website',
        category: 'Web Application',
        description: 'My personal portfolio featuring glassmorphism effects, smooth animations, and a modern dark theme. Showcases skills and projects with an immersive user experience.',
        features: [
            'Glassmorphism design system',
            'Smooth scroll animations',
            'Dark theme with gradients',
            'Fully responsive layout',
            'Performance optimized'
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        image: 'portfolio-preview.png',
        liveUrl: '#',
        githubUrl: 'https://github.com/Scodos1'
    },
    cgpa: {
        title: 'CGPA Calculator',
        category: 'Educational Tool',
        description: 'A student-focused web application for calculating Cumulative Grade Point Average with an intuitive interface and real-time calculations.',
        features: [
            'Real-time CGPA calculation',
            'Add multiple courses easily',
            'Clear & intuitive interface',
            'Mobile-responsive design',
            'Instant results display'
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        image: 'cgpa-preview.png',
        liveUrl: 'https://scodos1.github.io/CGPA.calculator/',
        githubUrl: 'https://github.com/Scodos1/CGPA.calculator'
    }
};

// ================================
// GitHub Integration
// ================================
const GITHUB_USERNAME = 'Scodos1';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// Language colour map (most common)
const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    Python:     '#3572A5',
    Java:       '#b07219',
    'C++':      '#f34b7d',
    C:          '#555555',
    Ruby:       '#701516',
    Go:         '#00ADD8',
    Rust:       '#dea584',
    PHP:        '#4F5D95',
    Swift:      '#F05138',
    Kotlin:     '#A97BFF',
    Shell:      '#89e051',
    Vue:        '#41b883',
    Svelte:     '#ff3e00',
    Dart:       '#00B4AB',
};

function getLanguageColor(lang) {
    return LANGUAGE_COLORS[lang] || '#8b949e';
}

function formatRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60)          return 'just now';
    if (diff < 3600)        return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)       return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000)     return `${Math.floor(diff / 86400)}d ago`;
    if (diff < 31536000)    return `${Math.floor(diff / 2592000)}mo ago`;
    return `${Math.floor(diff / 31536000)}y ago`;
}

function buildRepoCard(repo) {
    const lang       = repo.language || null;
    const langColor  = lang ? getLanguageColor(lang) : null;
    const desc       = repo.description
        ? repo.description
        : '<span class="empty">No description provided.</span>';
    const hasPages   = repo.has_pages;
    const liveUrl    = hasPages
        ? `https://${GITHUB_USERNAME.toLowerCase()}.github.io/${repo.name}/`
        : null;

    return `
    <div class="repo-card animate-on-scroll">
        <div class="repo-card-header">
            <div class="repo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M3 3h18v18H3zM9 3v18M3 9h18M3 15h18"/>
                </svg>
            </div>
            <div class="repo-links">
                ${liveUrl ? `
                <a href="${liveUrl}" target="_blank" rel="noopener" class="repo-link-btn" title="Live Demo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </a>` : ''}
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-link-btn" title="View on GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
            </div>
        </div>

        <div>
            <div class="repo-name">${repo.name}</div>
        </div>

        <p class="repo-description">${desc}</p>

        <div class="repo-meta">
            ${lang ? `
            <span class="repo-language">
                <span class="language-dot" style="background:${langColor};"></span>
                ${lang}
            </span>` : ''}

            ${repo.stargazers_count > 0 ? `
            <span class="repo-stat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                ${repo.stargazers_count}
            </span>` : ''}

            ${repo.forks_count > 0 ? `
            <span class="repo-stat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/>
                    <circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
                    <path d="M18 9a9 9 0 0 1-9 9"/>
                </svg>
                ${repo.forks_count}
            </span>` : ''}

            <span class="repo-updated">${formatRelativeDate(repo.updated_at)}</span>
        </div>
    </div>`;
}

async function loadGitHubRepos() {
    const grid  = document.getElementById('reposGrid');
    const error = document.getElementById('githubError');
    const badge = document.getElementById('reposCount');

    if (!grid) return;

    try {
        const res = await fetch(GITHUB_API, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!res.ok) throw new Error(`GitHub API ${res.status}`);

        const repos = await res.json();

        // Filter out forks, sort by last pushed
        const ownRepos = repos
            .filter(r => !r.fork)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        if (ownRepos.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 3rem 0; grid-column:1/-1;">No public repositories found.</p>';
            badge.textContent = '0';
            return;
        }

        // Update count badge
        badge.textContent = ownRepos.length;

        // Render cards
        grid.innerHTML = ownRepos.map(buildRepoCard).join('');

        // Re-observe newly added cards for scroll animations
        grid.querySelectorAll('.animate-on-scroll').forEach(el => {
            animateOnScrollObserver.observe(el);
        });

        // Update footer repo links with the 3 most recently updated
        updateFooterRepos(ownRepos.slice(0, 3));

    } catch (err) {
        console.warn('GitHub fetch failed:', err);
        grid.innerHTML = '';
        if (error) {
            error.style.display = 'flex';
        }
        badge.textContent = '—';
    }
}

function updateFooterRepos(repos) {
    const footerLinks = document.getElementById('footerRepoLinks');
    if (!footerLinks || !repos.length) return;

    const arrowSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    footerLinks.innerHTML = repos.map(repo => `
        <li>
            <a href="${repo.html_url}" target="_blank" rel="noopener">
                ${repo.name} ${arrowSVG}
            </a>
        </li>
    `).join('');
}

// ================================
// Utility Functions
// ================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function raf(callback) {
    return requestAnimationFrame(callback);
}

function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight - offset) &&
        rect.bottom >= offset
    );
}

// ================================
// Modal Functions
// ================================
function openModal(projectId) {
    const modal = document.getElementById('projectModal');
    const project = projectData[projectId];
    if (!modal || !project) return;

    document.getElementById('modalImage').innerHTML = `<img src="${project.image}" alt="${project.title}">`;
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;

    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = project.features.map(f => `<li>${f}</li>`).join('');

    const techTags = document.getElementById('modalTech');
    techTags.innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    const modalActions = document.querySelector('.modal-actions');
    modalActions.innerHTML = `
        <a href="${project.liveUrl}" target="_blank" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live Demo
        </a>
        <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View Code
        </a>`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ================================
// Background Slider
// ================================
function initBackgroundSlider() {
    const slides = document.querySelectorAll('.bg-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;

    slides.forEach(slide => {
        const imgUrl = slide.style.backgroundImage.match(/url\(['"']?([^'"]+)['"']?\)/)?.[1];
        if (imgUrl) {
            const img = new Image();
            img.src = imgUrl;
        }
    });

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// ================================
// Navigation
// ================================
const navbar    = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');
const navLinks  = document.querySelectorAll('.nav-link');

let navOverlay = document.querySelector('.nav-toggle-overlay');
if (!navOverlay && navToggle) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-toggle-overlay';
    document.body.appendChild(navOverlay);
}

function toggleMobileMenu() {
    navToggle?.classList.toggle('active');
    navMenu?.classList.toggle('active');
    navOverlay?.classList.toggle('active');
    document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
}

navToggle?.addEventListener('click', toggleMobileMenu);
navOverlay?.addEventListener('click', toggleMobileMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        navOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle?.contains(e.target) &&
        !navOverlay?.contains(e.target)) {
        toggleMobileMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        toggleMobileMenu();
    }
});

const handleNavScroll = throttle(() => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ================================
// Scroll Animations
// ================================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: [0, 0.1, 0.2, 0.3]
};

const animateOnScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            const skillProgress = entry.target.querySelector('.skill-progress, .progress-fill');
            if (skillProgress) {
                const progress = skillProgress.dataset.progress;
                raf(() => { skillProgress.style.width = `${progress}%`; });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animateOnScrollObserver.observe(el);
});

// ================================
// Projects Filter
// ================================
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-page-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card, index) => {
            const shouldShow = filter === 'all' || card.dataset.category === filter;

            if (shouldShow) {
                card.style.display = 'grid';
                card.style.transitionDelay = `${index * 50}ms`;
                raf(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => { card.style.display = 'none'; }, 400);
            }
        });
    });
});

// ================================
// Contact Form
// ================================
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const resetFormBtn = document.getElementById('resetForm');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
        contactForm.classList.add('hidden');
        formSuccess?.classList.add('show');
        contactForm.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }, 1500);
});

resetFormBtn?.addEventListener('click', () => {
    formSuccess?.classList.remove('show');
    contactForm?.classList.remove('hidden');
});

// ================================
// Smooth Scroll
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ================================
// Parallax Background
// ================================
const codeBackground  = document.querySelector('.code-background');
let parallaxEnabled   = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const handleParallax = throttle(() => {
    if (!codeBackground || !parallaxEnabled) return;
    codeBackground.style.transform = `translateY(${window.scrollY * 0.08}px)`;
}, 16);

window.addEventListener('scroll', handleParallax, { passive: true });

// ================================
// Scroll Progress
// ================================
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.insertBefore(progressBar, document.body.firstChild);

    const scrollBar = progressBar.querySelector('.scroll-progress-bar');

    const updateProgress = throttle(() => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const percent    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        raf(() => { scrollBar.style.width = `${percent}%`; });
    }, 50);

    window.addEventListener('scroll', updateProgress, { passive: true });
}

// ================================
// Cursor Glow
// ================================
function createCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed; width: 500px; height: 500px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 60%);
        border-radius: 50%; pointer-events: none;
        transform: translate(-50%, -50%); z-index: -1;
        opacity: 0; transition: opacity 0.4s ease; mix-blend-mode: screen;`;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = `${glowX}px`;
        glow.style.top  = `${glowY}px`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// ================================
// Active Nav Link
// ================================
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'Index.html';
    navLinks.forEach(link => {
        const href     = link.getAttribute('href');
        const isActive = href === currentPage ||
                         (currentPage === '' && href === 'Index.html') ||
                         (currentPage === 'Index.html' && href === 'Index.html');
        link.classList.toggle('active', isActive);
    });
}

// ================================
// Page Load
// ================================
function initPageLoad() {
    document.body.classList.add('loaded');

    const heroElements = document.querySelectorAll('.hero-content > *, .hero-image');
    heroElements.forEach((el, index) => {
        setTimeout(() => { el.style.opacity = ''; }, index * 100);
    });

    setTimeout(() => {
        document.querySelectorAll('.skill-progress, .progress-fill').forEach(bar => {
            if (bar.closest('.visible') || isInViewport(bar, 100)) {
                bar.style.width = `${bar.dataset.progress}%`;
            }
        });
    }, 600);
}

// ================================
// Magnetic Buttons
// ================================
function initMagneticButtons() {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translateY(-2px) translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// ================================
// Initialize Everything
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundSlider();
    createScrollProgress();
    setActiveNavLink();
    initPageLoad();
    loadGitHubRepos();

    if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        createCursorGlow();
        initMagneticButtons();
    }
});

// ================================
// Console Easter Egg
// ================================
console.log('%c🚀 Premium Portfolio', 'font-size: 28px; font-weight: bold; color: #6366f1;');
console.log('%c✨ Built with passion & precision', 'font-size: 14px; color: #94a3b8;');
console.log('%c💼 Open to opportunities', 'font-size: 12px; color: #8b5cf6;');
console.log('%c📧 alagbefareed@gmail.com', 'font-size: 12px; color: #a855f7;');
