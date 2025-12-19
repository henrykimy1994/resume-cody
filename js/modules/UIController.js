export default class UIController {
    constructor(data) {
        this.data = data;
        this.currentSection = 'hero';
        this.navOpen = false;
    }

    init() {
        this.populateContent();
        this.setupEventListeners();
        this.setupAnimations();
        this.initCounters();
    }

    populateContent() {
        // Populate About Section
        document.querySelector('.about-text').textContent = this.data.about.description;
        document.querySelector('.education-info').textContent = this.data.about.education;
        document.querySelector('.location-info').textContent = this.data.about.location;
        document.querySelector('.specialization-info').textContent = this.data.about.specialization;

        // Populate Experience Timeline
        const timeline = document.getElementById('experience-timeline');
        this.data.experience.forEach((exp, index) => {
            const item = this.createTimelineItem(exp, index);
            timeline.appendChild(item);
        });

        // Populate Projects
        const projectsGrid = document.getElementById('projects-grid');
        this.data.projects.forEach(project => {
            const card = this.createProjectCard(project);
            projectsGrid.appendChild(card);
        });

        // Populate Skills
        this.populateSkills('technical', this.data.skills.technical);
        this.populateSkills('software', this.data.skills.software);
        this.populateSkills('research', this.data.skills.research);

        // Populate Contact
        document.querySelector('.contact-email').textContent = this.data.contact.email;
        document.querySelector('.contact-email').href = `mailto:${this.data.contact.email}`;
        document.querySelector('.contact-linkedin').textContent = 'LinkedIn';
        document.querySelector('.contact-linkedin').href = this.data.contact.linkedin;
        document.querySelector('.contact-github').textContent = 'GitHub';
        document.querySelector('.contact-github').href = this.data.contact.github;
    }

    createTimelineItem(exp, index) {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-date">${exp.period}</div>
                <h3 class="timeline-title">${exp.position}</h3>
                <div class="timeline-company">${exp.company}</div>
                <p class="timeline-description">${exp.description}</p>
            </div>
            <div class="timeline-dot"></div>
        `;
        return div;
    }

    createProjectCard(project) {
        const div = document.createElement('div');
        div.className = 'project-card';
        div.innerHTML = `
            <div class="project-image">
                <i class="fas fa-${project.icon}"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        return div;
    }

    populateSkills(category, skills) {
        const container = document.querySelector(`#skills-${category} .skills-list`);
        skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <span class="skill-name">${skill.name}</span>
                <div class="skill-level">
                    ${this.createSkillDots(skill.level)}
                </div>
            `;
            container.appendChild(skillItem);
        });
    }

    createSkillDots(level) {
        let dots = '';
        for (let i = 1; i <= 5; i++) {
            dots += `<span class="skill-dot ${i <= level ? 'filled' : ''}"></span>`;
        }
        return dots;
    }

    setupEventListeners() {
        // Navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        navToggle.addEventListener('click', () => {
            this.navOpen = !this.navOpen;
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                    this.navOpen = false;
                }
            });
        });

        // Form submission
        const contactForm = document.getElementById('contact-form');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });

        // Button actions
        document.querySelector('[data-action="download-cv"]').addEventListener('click', () => {
            this.downloadCV();
        });

        document.querySelector('[data-action="view-projects"]').addEventListener('click', () => {
            document.querySelector('#projects').scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Scroll spy for active navigation
        window.addEventListener('scroll', () => this.updateActiveNav());
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('hero-stats')) {
                        this.animateCounters();
                    }
                }
            });
        }, observerOptions);

        // Observe all sections and elements
        document.querySelectorAll('.section, .timeline-item, .project-card, .skill-item').forEach(el => {
            observer.observe(el);
        });
    }

    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            counter.textContent = '0';
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const start = 0;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuad = progress * (2 - progress);
                const current = Math.floor(start + (target - start) * easeOutQuad);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleFormSubmission(form) {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Here you would normally send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        this.showNotification('Message sent successfully!', 'success');
        
        // Reset form
        form.reset();
    }

    downloadCV() {
        // Simulate CV download
        console.log('Downloading CV...');
        this.showNotification('CV download started!', 'info');
        
        // In a real implementation, you would trigger a download
        // window.open('/path-to-cv.pdf', '_blank');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}