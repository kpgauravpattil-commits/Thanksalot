// script.js
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. SOFT LOCK CONFIGURATION & LOGIC
     ========================================================================== */
  
  // Nidhi's specific Lock Config
  // Configurable secret question and a hidden answer string. 
  const LOCK_CONFIG = {
    question: "What's the one word you use to call me",
    answers: ["gauri", "gauriii", "jiya"], // Note: Add the secret word here in lowercase.
    errorMessage: "Nope, try again."
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
    // Normalization: trim whitespace and convert to lowercase for robust checking
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
      e.key === 'Enter' && (e.preventDefault(), verifyAnswer());
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
    revealElements.forEach(el => el.classList.add('is-visible'));
  }


  /* ==========================================================================
     2. SECRET INTERACTION (EASTER EGG)
     ========================================================================== */
  const secretTrigger = document.getElementById('secretTrigger');
  const secretMessage = document.getElementById('secretMessage');

  if (secretTrigger && secretMessage) {
    secretTrigger.addEventListener('click', () => {
      const isHidden = secretMessage.hasAttribute('hidden');
      if (isHidden) {
        secretMessage.removeAttribute('hidden');
      } else {
        secretMessage.setAttribute('hidden', '');
      }
    });
    
    // Allow keyboard activation (Enter or Space) for a11y
    secretTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        secretTrigger.click();
      }
    });
  }

});