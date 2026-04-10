document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // If it's a simple top scroll
            if (href === '#') {
                e.preventDefault();
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('active');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                navLinks.classList.remove('active'); // Close menu on click
                mobileBtn.classList.remove('active'); // Reset burger icon

                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Accordion Interaction
    const accordions = document.querySelectorAll('.accordion-trigger');
    accordions.forEach(acc => {
        acc.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ============================================================
    // Lead Capture Form Handler (Google Sheets via Apps Script)
    // Replace YOUR_GOOGLE_SCRIPT_URL_HERE with your deployment URL
    // ============================================================
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

    const form = document.getElementById('analysis-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerHTML = 'Submitting...';
            btn.disabled = true;

            // Detect which page the form is on
            const source = document.title.includes('Discovery') ? 'Book Discovery' : 
                           document.title.includes('Strategy') ? 'Book Strategy' : 'Free Analysis';

            // Collect form data dynamically
            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            payload.source = source;
            payload.submittedAt = new Date().toISOString();

            // Send to Formspark via AJAX
            fetch(form.action, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(() => {
                btn.innerHTML = '✓ Sent!';
                btn.style.backgroundColor = '#10b981';
                btn.style.color = '#fff';
                form.reset();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            })
            .catch((err) => {
                console.error('Submission error:', err);
                btn.innerHTML = 'Error — Try Again';
                btn.style.backgroundColor = '#ef4444';
                btn.style.color = '#fff';
                btn.disabled = false;
            });
        });
    }


    // Scroll Indicator Logic
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const footer = document.querySelector('footer');

    if (scrollIndicator && footer) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        });

        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrollIndicator.classList.add('hidden');
                } else {
                    scrollIndicator.classList.remove('hidden');
                }
            });
        }, { threshold: 0.1 });

        footerObserver.observe(footer);
    }

    // Heatmap Toggle Logic
    const heatmapContainer = document.querySelector('.heatmap-container');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const metricValues = document.querySelectorAll('.metric-value');

    if (heatmapContainer && toggleBtns.length > 0) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetState = btn.getAttribute('data-target');
                
                // Update active button
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update container state
                heatmapContainer.setAttribute('data-state', targetState);

                // Update metric values
                metricValues.forEach(val => {
                    const newValue = targetState === 'before' ? val.getAttribute('data-before') : val.getAttribute('data-after');
                    val.innerText = newValue;
                });
            });
        });
    }
});

// Dynamic Location Detection
const locationPill = document.getElementById('location-pill');
if (locationPill) {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            if (data.city && data.country_name) {
                locationPill.innerHTML = `<span class="dot"></span> ${data.city}, ${data.country_name}`;
                locationPill.style.display = 'inline-flex';
            }
        })
        .catch(() => {
            locationPill.style.display = 'none';
        });
}