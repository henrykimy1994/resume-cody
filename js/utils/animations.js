// Utility functions for animations and effects

export class AnimationUtils {
    constructor() {
        this.easingFunctions = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInQuart: t => t * t * t * t,
            easeOutQuart: t => 1 - (--t) * t * t * t,
            easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
            easeInQuint: t => t * t * t * t * t,
            easeOutQuint: t => 1 + (--t) * t * t * t * t,
            easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
            easeInElastic: t => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
            },
            easeOutElastic: t => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
            },
            easeOutBounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) {
                    return n1 * t * t;
                } else if (t < 2 / d1) {
                    return n1 * (t -= 1.5 / d1) * t + 0.75;
                } else if (t < 2.5 / d1) {
                    return n1 * (t -= 2.25 / d1) * t + 0.9375;
                } else {
                    return n1 * (t -= 2.625 / d1) * t + 0.984375;
                }
            }
        };
    }

    // Animate a value from start to end
    animate(from, to, duration, easing = 'easeOutQuad', onUpdate, onComplete) {
        const startTime = performance.now();
        const easingFn = this.easingFunctions[easing] || this.easingFunctions.linear;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFn(progress);
            const currentValue = from + (to - from) * easedProgress;

            if (onUpdate) {
                onUpdate(currentValue, progress);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else if (onComplete) {
                onComplete();
            }
        };

        requestAnimationFrame(update);
    }

    // Animate multiple properties
    animateProperties(element, properties, duration, easing = 'easeOutQuad', onComplete) {
        const startValues = {};
        const endValues = {};

        // Parse start and end values
        for (const prop in properties) {
            const computed = window.getComputedStyle(element);
            startValues[prop] = parseFloat(computed[prop]) || 0;
            endValues[prop] = properties[prop];
        }

        this.animate(0, 1, duration, easing, (progress) => {
            for (const prop in properties) {
                const current = startValues[prop] + (endValues[prop] - startValues[prop]) * progress;
                element.style[prop] = current + (prop === 'opacity' ? '' : 'px');
            }
        }, onComplete);
    }

    // Stagger animation for multiple elements
    staggerAnimation(elements, properties, duration, stagger = 100, easing = 'easeOutQuad') {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateProperties(element, properties, duration, easing);
            }, index * stagger);
        });
    }

    // Parallax scrolling effect
    createParallaxEffect(element, speed = 0.5) {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }

    // Typewriter effect
    typeWriter(element, text, speed = 50, onComplete) {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (onComplete) {
                onComplete();
            }
        };

        type();
    }

    // Scramble text effect
    scrambleText(element, finalText, duration = 2000) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        const originalText = element.textContent;
        let iteration = 0;
        const maxIterations = duration / 30;

        const interval = setInterval(() => {
            element.textContent = finalText
                .split('')
                .map((letter, index) => {
                    if (index < iteration) {
                        return finalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= finalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);
    }

    // Fade in on scroll
    fadeInOnScroll(elements, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px',
            fadeDistance: 30
        };

        const config = { ...defaultOptions, ...options };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = `translateY(${config.fadeDistance}px)`;
                    
                    this.animateProperties(entry.target, {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }, 1000, 'easeOutQuad');

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });

        elements.forEach(element => observer.observe(element));
        return observer;
    }

    // Ripple effect on click
    createRipple(event, container, color = 'rgba(255, 255, 255, 0.5)') {
        const ripple = document.createElement('span');
        const rect = container.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: ${color};
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
        `;

        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Smooth scroll to element
    smoothScroll(target, duration = 1000, offset = 0) {
        const targetElement = typeof target === 'string' ? 
            document.querySelector(target) : target;
        
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;

        this.animate(0, 1, duration, 'easeInOutCubic', (progress) => {
            window.scrollTo(0, startPosition + distance * progress);
        });
    }

    // Magnetic cursor effect
    magneticCursor(element, strength = 30) {
        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance < 150) {
                const translateX = (deltaX / distance) * Math.min(strength, distance / 5);
                const translateY = (deltaY / distance) * Math.min(strength, distance / 5);
                
                element.style.transform = `translate(${translateX}px, ${translateY}px)`;
            }
        };

        const handleMouseLeave = () => {
            element.style.transform = 'translate(0, 0)';
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }

    // Particle explosion effect
    createParticles(x, y, count = 20, container = document.body) {
        const particles = [];
        const colors = ['#00ff88', '#0088ff', '#ff0088'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 2 + Math.random() * 3;
            const size = 4 + Math.random() * 4;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 9999;
            `;

            container.appendChild(particle);
            particles.push({
                element: particle,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                gravity: 0.1,
                opacity: 1
            });
        }

        const animate = () => {
            let allDead = true;

            particles.forEach(p => {
                if (p.opacity > 0) {
                    allDead = false;
                    p.vy += p.gravity;
                    p.opacity -= 0.02;

                    const currentX = parseFloat(p.element.style.left);
                    const currentY = parseFloat(p.element.style.top);

                    p.element.style.left = (currentX + p.vx) + 'px';
                    p.element.style.top = (currentY + p.vy) + 'px';
                    p.element.style.opacity = p.opacity;
                } else {
                    p.element.remove();
                }
            });

            if (!allDead) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Glitch effect
    glitchEffect(element, duration = 200) {
        const originalText = element.textContent;
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        
        element.style.position = 'relative';
        
        const glitch = () => {
            element.textContent = originalText
                .split('')
                .map(char => Math.random() > 0.8 ? 
                    glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
                .join('');
        };

        const interval = setInterval(glitch, 50);
        
        setTimeout(() => {
            clearInterval(interval);
            element.textContent = originalText;
        }, duration);
    }
}

// Export singleton instance
export default new AnimationUtils();

// Also export the class for custom instances
export { AnimationUtils as AnimationUtilsClass };