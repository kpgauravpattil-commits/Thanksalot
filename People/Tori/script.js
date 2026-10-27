document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. SOFT LOCK CONFIGURATION & LOGIC
     ========================================================================== */
  
  // Tori's Lock Config
  const LOCK_CONFIG = {
    question: "Who are you basically the female version of?",
    answers: ["You", "me", "Me", "MY TWIN", "My Twin", "my twin", "Twin", "twin", "Twin"], 
    errorMessage: "System rejected. Try again."
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
    }, 600);
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
     1. SCROLL REVEAL ANIMATIONS
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
     2. SYNC BRAIN CELLS (Split Screen Interaction)
     ========================================================================== */
  const syncBtn = document.getElementById('syncBrainBtn');
  const twinContainer = document.getElementById('twinContainer');
  const syncNote = document.querySelector('.note-sync');

  if (syncBtn && twinContainer) {
    syncBtn.addEventListener('click', () => {
      twinContainer.classList.toggle('synced');
      
      const isSynced = twinContainer.classList.contains('synced');
      syncBtn.querySelector('.btn-text').textContent = isSynced ? 'Connection Synced' : 'Sync Connection';
      
      if (syncNote) {
        syncNote.style.opacity = '0';
      }
    });
  }

  /* ==========================================================================
     3. HIDDEN NOTE INTERACTION
     ========================================================================== */
  const secretTrigger = document.getElementById('secretTrigger');
  const hiddenNote = document.getElementById('hiddenNote');
  const closeHidden = document.getElementById('closeHidden');

  if (secretTrigger && hiddenNote && closeHidden) {
    secretTrigger.addEventListener('click', () => {
      hiddenNote.classList.add('is-open');
    });
    
    secretTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hiddenNote.classList.add('is-open');
      }
    });

    closeHidden.addEventListener('click', () => {
      hiddenNote.classList.remove('is-open');
    });
  }

});