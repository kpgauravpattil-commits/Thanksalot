document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const href = card.getAttribute('href');
            
            if (href === 'thank-you.html' || href === 'quiz.html' || href === 'People/index.html') {
                return;
            }

            e.preventDefault();
            
            const targetName = card.querySelector('h2').innerText;
            
            if (targetName === "The quiz") {
                alert("File locked. Destination page not yet constructed. Save your ammo.");
            } else {
                alert(`The "${targetName}" page is still being written. Thanks for stopping by!`);
            }
        });
    });
});