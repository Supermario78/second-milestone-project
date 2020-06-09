const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let firstCard, secondCard;

function flipcard() {
    this.classList.toggle("flip");

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        hasFlippedCard = false;
        secondCard = this;

        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.caracters ===
        secondCard.dataset.caracters) {
        disableCards();
        }
    
}


cards.forEach(card => card.addEventListener("click" , flipCard));
