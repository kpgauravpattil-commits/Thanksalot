document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. SOFT LOCK CONFIGURATION & LOGIC
     ========================================================================== */
  
  const LOCK_CONFIG = {
    question: "What is my 5-letter word for you?",
    answers: ["piggu"], 
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
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     2. LIGHTBOX FOR EVIDENCE SECTION
     ========================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const photoCards = document.querySelectorAll('.photo-card');
  let previouslyFocusedElement = null;

  const openLightbox = (card) => {
    previouslyFocusedElement = document.activeElement;
    const captionText = card.getAttribute('data-caption') || 'No caption provided';
    
    lightboxCaption.textContent = captionText;
    
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  if (lightbox && lightboxClose) {
    photoCards.forEach(card => {
      card.addEventListener('click', () => openLightbox(card));
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
        closeLightbox();
      }
    });
  }
});