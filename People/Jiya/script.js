// script.js
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. SOFT LOCK CONFIGURATION & LOGIC
     ========================================================================== */
  
  // Jiya's specific Lock Config
  const LOCK_CONFIG = {
    question: "What is my contact name saved as in your phone?",
    answers: ["modak"], 
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
      // Scroll to top immediately after unlock to ensure cover is visible
      window.scrollTo(0, 0);
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
     2. MAGAZINE INTERACTIONS (Jiya specific)
     ========================================================================== */

  // 2a. Cover Reveal
  const btnOpenIssue = document.getElementById('btnOpenIssue');
  const magazineCover = document.getElementById('magazineCover');
  const mainIssue = document.getElementById('mainIssue');

  if (btnOpenIssue && magazineCover && mainIssue) {
    btnOpenIssue.addEventListener('click', () => {
      magazineCover.classList.add('is-hidden');
      // Delay scrolling to main content slightly for visual smoothness
      setTimeout(() => {
        mainIssue.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }, 300);
    });
  }

  // 2b. Modak Easter Egg
  const modakStamp = document.getElementById('modakStamp');
  const hiddenStampNote = document.getElementById('hiddenStampNote');

  if (modakStamp && hiddenStampNote) {
    modakStamp.addEventListener('click', () => {
      const isHidden = hiddenStampNote.hasAttribute('hidden');
      if (isHidden) {
        hiddenStampNote.removeAttribute('hidden');
      } else {
        hiddenStampNote.setAttribute('hidden', '');
      }
    });

    // Support keyboard activation for accessibility
    modakStamp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        modakStamp.click();
      }
    });
  }

  // 2c. Chaos Plot Twist
  const btnPlotTwist = document.getElementById('btnPlotTwist');
  const twistContent = document.getElementById('twistContent');

  if (btnPlotTwist && twistContent) {
    btnPlotTwist.addEventListener('click', () => {
      twistContent.removeAttribute('hidden');
      btnPlotTwist.style.display = 'none'; // hide button after reveal
    });
  }

  // 2d. Mystery Gift Box Interaction
  const mysteryGiftBox = document.getElementById('mysteryGiftBox');

  if (mysteryGiftBox) {
    mysteryGiftBox.addEventListener('click', () => {
      mysteryGiftBox.classList.toggle('is-open');
    });

    // Support keyboard activation for accessibility
    mysteryGiftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mysteryGiftBox.click();
      }
    });
  }

});