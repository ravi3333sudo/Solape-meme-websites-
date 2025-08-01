// SolApe Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initCounters();
    initTokenomicsChart();
    initVideoModals();
    initSmoothScrolling();
    initFloatingIcons();
    initButtonHandlers();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(19, 52, 59, 0.98)';
        } else {
            header.style.background = 'rgba(19, 52, 59, 0.95)';
        }
    });
}

// Button handlers - Fixed to properly handle different button types
function initButtonHandlers() {
    document.addEventListener('click', function(e) {
        const target = e.target;
        const text = target.textContent.toLowerCase();
        
        // Handle Buy Now buttons specifically
        if (text.includes('buy now') || text.includes('buy solape') || target.classList.contains('nav__cta')) {
            e.preventDefault();
            showBuyModal();
            return;
        }
        
        // Handle Telegram buttons specifically
        if (text.includes('join telegram') || text.includes('telegram') && !text.includes('members')) {
            e.preventDefault();
            window.open('https://t.me/solape', '_blank');
            return;
        }
        
        // Handle Twitter links
        if (text.includes('twitter')) {
            e.preventDefault();
            window.open('https://twitter.com/solape', '_blank');
            return;
        }
        
        // Handle Discord links
        if (text.includes('discord')) {
            e.preventDefault();
            window.open('https://discord.gg/solape', '_blank');
            return;
        }
    });
}

// Animated counters
function initCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    // Observe all counter elements
    const counters = document.querySelectorAll('.stat__number, .community-stat__number');
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(function() {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number based on size
        let displayValue;
        if (target >= 1000000000) {
            displayValue = (current / 1000000000).toFixed(1) + 'B';
        } else if (target >= 1000000) {
            displayValue = '$' + (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            displayValue = Math.floor(current).toLocaleString();
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue;
    }, 20);
}

// Tokenomics Chart
function initTokenomicsChart() {
    const ctx = document.getElementById('tokenomics-chart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Liquidity Pool (90%)', 'Marketing (5%)', 'Development (5%)'],
            datasets: [{
                data: [90, 5, 5],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(19, 52, 59, 0.9)',
                    titleColor: '#32B4C5',
                    bodyColor: '#ffffff',
                    borderColor: '#32B4C5',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    // Animate chart on scroll into view
    const chartObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chart.update('active');
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    chartObserver.observe(ctx.parentElement);
}

// Video Modal functionality - Fixed to work with all video triggers
function initVideoModals() {
    const videoTriggers = document.querySelectorAll('[data-video], .video-card, .video-play-btn');
    const modal = document.getElementById('video-modal');
    const modalOverlay = document.querySelector('.modal__overlay');
    const modalClose = document.querySelector('.modal__close');
    const modalTitle = document.getElementById('modal-title');
    
    const videoTitles = {
        'intro': 'Character Introduction Video',
        'meet': 'Meet SolApe',
        'tokenomics': 'Tokenomics Explained',
        'community': 'Community Highlights'
    };
    
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            let videoType = this.getAttribute('data-video');
            
            // Handle different trigger types
            if (!videoType) {
                if (this.classList.contains('video-card')) {
                    videoType = this.getAttribute('data-video') || 'meet';
                } else if (this.classList.contains('video-play-btn')) {
                    videoType = this.getAttribute('data-video') || 'intro';
                }
            }
            
            // Get title from card if available
            let title = videoTitles[videoType] || 'SolApe Video';
            const cardTitle = this.querySelector('h3');
            if (cardTitle) {
                title = cardTitle.textContent;
            }
            
            modalTitle.textContent = title;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.transition = 'opacity 0.3s ease';
            }, 10);
        });
    });
    
    // Close modal functionality
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced floating icons animation
function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            
            icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 10 - 5}deg)`;
        }, 3000 + index * 500);
    });
}

function showBuyModal() {
    // Create a simple buy instructions modal
    const buyModal = document.createElement('div');
    buyModal.className = 'modal';
    buyModal.innerHTML = `
        <div class="modal__overlay"></div>
        <div class="modal__content">
            <button class="modal__close">&times;</button>
            <h3 style="color: var(--color-primary); margin-bottom: var(--space-16);">How to Buy SolApe</h3>
            <div class="buy-instructions">
                <div class="buy-step-detailed">
                    <h4>Step 1: Get a Solana Wallet</h4>
                    <p>Download Phantom, Solflare, or another Solana wallet</p>
                </div>
                <div class="buy-step-detailed">
                    <h4>Step 2: Buy SOL</h4>
                    <p>Purchase SOL from any major exchange (Coinbase, Binance, etc.)</p>
                </div>
                <div class="buy-step-detailed">
                    <h4>Step 3: Connect to DEX</h4>
                    <p>Go to Jupiter Exchange or Raydium and connect your wallet</p>
                </div>
                <div class="buy-step-detailed">
                    <h4>Step 4: Swap for $SOLAPE</h4>
                    <p>Enter the SolApe contract address and swap your SOL</p>
                </div>
                <div style="background: var(--color-bg-1); padding: var(--space-16); border-radius: var(--radius-base); margin-top: var(--space-20);">
                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                        <strong>Contract Address:</strong><br>
                        <code style="font-size: var(--font-size-xs); word-break: break-all;">
                            SoLAPE123...exampleAddress (Coming Soon)
                        </code>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(buyModal);
    document.body.style.overflow = 'hidden';
    
    // Close functionality for buy modal
    const closeBtn = buyModal.querySelector('.modal__close');
    const overlay = buyModal.querySelector('.modal__overlay');
    
    function closeBuyModal() {
        document.body.removeChild(buyModal);
        document.body.style.overflow = 'auto';
    }
    
    closeBtn.addEventListener('click', closeBuyModal);
    overlay.addEventListener('click', closeBuyModal);
}

// Intersection Observer for animations
const animateOnScroll = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.roadmap__item, .video-card, .feature, .social-link');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        animateOnScroll.observe(el);
    });
});

// Add some extra interactivity
document.addEventListener('mousemove', function(e) {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const rect = hero.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            hero.style.backgroundPosition = `${x}% ${y}%`;
        }
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation and other styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .buy-step-detailed {
        background: var(--color-surface);
        padding: var(--space-16);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-16);
        border: 1px solid var(--color-card-border);
    }
    
    .buy-step-detailed h4 {
        color: var(--color-primary);
        margin-bottom: var(--space-8);
        font-size: var(--font-size-lg);
    }
    
    .buy-step-detailed p {
        color: var(--color-text-secondary);
        margin: 0;
    }
    
    .nav__menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--color-surface);
        flex-direction: column;
        padding: var(--space-16);
        box-shadow: var(--shadow-lg);
        border-top: 1px solid var(--color-border);
    }
    
    @media (max-width: 768px) {
        .nav__menu {
            display: none;
        }
    }
`;

document.head.appendChild(style);

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        triggerEasterEgg();
        konamiCode = [];
    }
});

function triggerEasterEgg() {
    // Add rainbow animation to SolApe title
    const title = document.querySelector('.hero__title');
    if (title) {
        title.style.animation = 'rainbow 2s infinite';
        
        // Add rainbow keyframes
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        // Show easter egg message
        const message = document.createElement('div');
        message.innerHTML = '🎉 You found the SolApe secret! 🦍✨';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: var(--space-16) var(--space-24);
            border-radius: var(--radius-lg);
            font-size: var(--font-size-lg);
            font-weight: var(--font-weight-bold);
            z-index: 3000;
            animation: bounce 1s ease-in-out 3;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
            title.style.animation = '';
        }, 3000);
    }
}