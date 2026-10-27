document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. SOFT LOCK CONFIGURATION & LOGIC (Preserved from existing framework)
     ========================================================================== */
  
  // Paras's specific Lock Config
  const LOCK_CONFIG = {
    question: "What did you say to me when we first met on Instagram?",
    answers: ["hello", "hi", "hey"], 
    errorMessage: "Incorrect answer."
  };

  const lockScreen = document.getElementById('lockScreen');
  const lockInput = document.getElementById('lockInput');
  const lockSubmit = document.getElementById('lockSubmit');
  const lockError = document.getElementById('lockError');
  const lockQuestionText = document.getElementById('lockQuestionText');

  let isUnlocking = false;

  if (lockQuestionText) {
    lockQuestionText.textContent = LOCK_CONFIG.question;
  }

  function unlockPage() {
    if (isUnlocking) return;
    isUnlocking = true;
    
    if (lockInput) lockInput.disabled = true;
    if (lockSubmit) lockSubmit.disabled = true;

    lockScreen.classList.add('unlocking');
    
    setTimeout(() => {
      lockScreen.style.display = 'none';
      document.body.classList.remove('is-locked');
    }, 500); 
  }

  function verifyAnswer() {
    if (isUnlocking) return;
    const userAnswer = lockInput.value.trim().toLowerCase();
    
    if (LOCK_CONFIG.answers.includes(userAnswer)) {
      lockError.setAttribute('hidden', '');
      unlockPage();
    } else {
      lockError.textContent = LOCK_CONFIG.errorMessage;
      lockError.removeAttribute('hidden');
      lockInput.value = '';
      lockInput.focus();
    }
  }

  if (lockSubmit) {
    lockSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      verifyAnswer();
    });
  }

  if (lockInput) {
    lockInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyAnswer();
      }
    });
  }

  /* ==========================================================================
     1. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.fade-in-up');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if reduced motion is preferred or observer isn't supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     2. AMBIENT SNOW EFFECT
     ========================================================================== */
  function createSnowflakes() {
    if (prefersReducedMotion) return;
    
    const container = document.getElementById('snow-container');
    if (!container) return;
    
    const snowflakeCount = 35; // Minimal count so it's subtle, not a blizzard
    
    for (let i = 0; i < snowflakeCount; i++) {
      const flake = document.createElement('div');
      flake.classList.add('snow-flake');
      
      // Randomize properties for natural drift
      const size = Math.random() * 3 + 1; // 1px to 4px
      const leftPos = Math.random() * 100; // 0vw to 100vw
      const animationDuration = Math.random() * 8 + 7; // 7s to 15s fall duration
      const animationDelay = Math.random() * 10; // Staggered starts
      const opacity = Math.random() * 0.4 + 0.1; // 0.1 to 0.5 opacity
      
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.left = `${leftPos}vw`;
      flake.style.opacity = opacity;
      flake.style.animationDuration = `${animationDuration}s`;
      flake.style.animationDelay = `-${animationDelay}s`; // Negative delay so they are on screen immediately
      
      container.appendChild(flake);
    }
  }

  createSnowflakes();
});