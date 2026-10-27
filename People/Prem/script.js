document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. SOFT LOCK CONFIGURATION & LOGIC
     ========================================================================== */
  
  // PRESERVE EXISTING LOCK CONFIG HERE
  // Using a standard lock config structure to maintain functionality.
  // Update the question and answers below to match the actual lock if needed.
  const LOCK_CONFIG = {
    question: "What is the standard school logic response to everything?",
    answers: ["i don't know", "idk", "yes", "brooo", "bro", "broo", "brooo?", "brooo!", "brooo.", "brooo...", "brooo!!", "brooo??"], 
    errorMessage: "Incorrect answer. Try applying bro logic."
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

    // Trigger the unlock animation (defined in CSS)
    lockScreen.classList.add('unlocking');
    
    // Remove lock from DOM after animation completes
    setTimeout(() => {
      lockScreen.style.display = 'none';
      document.body.classList.remove('is-locked');
      
      // Trigger SVG drawing for elements that are already in the viewport upon unlock
      triggerVisibleDoodles();
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
          observer.unobserve(entry.target); // Unobserve once visible
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

  /* Helper function to ensure doodles draw if they are in viewport immediately after unlock */
  function triggerVisibleDoodles() {
    if (prefersReducedMotion) return;
    
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
      if (isVisible && !el.classList.contains('is-visible')) {
        el.classList.add('is-visible');
      }
    });
  }

});