const items = [
    'angular', 
    'aurelia', 
    'backbone', 
    'ember', 
    'react', 
    'vue'
];

const memoryBoard = document.getElementById('memory-board');

(function build(){

    memoryBoard.innerHTML = '';

    items.forEach(card => {
        memoryBoard.innerHTML += `
        <div class="memory-card" data-framework="${card}">
            <img src="img/${card}.svg" alt="${card}" class="front-face">
            <img src="img/js-badge.svg" alt="Memory Card" class="back-face">
        </div>
        <div class="memory-card" data-framework="${card}">
            <img src="img/${card}.svg" alt="${card}" class="front-face">
            <img src="img/js-badge.svg" alt="Memory Card" class="back-face">
        </div>
        `;
    });

})();