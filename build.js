const frameworks = {
    imgURL: 'frameworks',
    frontfase: 'js-badge',
    cards: [
        'angular',
        'aurelia',
        'backbone',
        'ember',
        'react',
        'vue'
    ]};

const dinos = {
    imgURL: 'dinos',
    frontfase: 'velociraptor',
    cards: [
        'allosaurus',
        'ankylosaurus',
        'brachiosaurus',
        'brontosaurus',
        'ceratosaurus',
        'guanlong',
        'stegosaurus',
        'lambeosaurus',
        'iguanodon'
    ]};

const memoryBoard = document.getElementById('memory-board');
let cards = document.querySelectorAll('.memory-card');

const controls = ['dinos', 'frameworks'];

(function onInit() {
    loadControls();
    loadGame(dinos);
})();

function loadControls() {
    const memoryContols = document.getElementById('memory-controls');
    controls.forEach(button => {
        memoryContols.innerHTML += `
            <button id="${button}" class="controls button is-primary">${button}</button>
        `;
    });
}

document.querySelectorAll('.controls').forEach(button => {
    return button.addEventListener('click', setDeck);
});

function setDeck() {
    switch(this.id) {
    case 'dinos':
        loadGame(dinos);
        break;
    case 'frameworks':
        loadGame(frameworks);
        break;
    }
}

function loadGame(items) {

    memoryBoard.innerHTML = '';

    items.cards.forEach(card => {
        memoryBoard.innerHTML += `
        <div class="memory-card" data-framework="${card}">
            <img src="img/${items.imgURL}/${card}.svg" alt="${card}" class="front-face">
            <img src="img/${items.imgURL}/${items.frontfase}.svg" alt="Memory Card" class="back-face">
        </div>
        <div class="memory-card" data-framework="${card}">
            <img src="img/${items.imgURL}/${card}.svg" alt="${card}" class="front-face">
            <img src="img/${items.imgURL}/${items.frontfase}.svg" alt="Memory Card" class="back-face">
        </div>
        `;
    });

    cards = document.querySelectorAll('.memory-card');

    cards.forEach(card => {
        return card.addEventListener('click', flipCard);
    });
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) {
        return;
    }
    if (this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {

    const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();

}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        lockBoard = false;
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

