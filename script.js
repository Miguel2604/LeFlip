    
class AudioController {
    constructor() {
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('');
        this.gameOverSound = new Audio('Assets/Audio/gameover.wav');
    }
    
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
   
}

class MixOrMatch {
    constructor(totalTime, cards, difficulty) {
        this.totalTime = totalTime;
        this.difficulty = parseInt(difficulty); 
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
        this.cardsArray = this.adjustCardsBasedOnDifficulty(cards, this.difficulty);
        this.timeRemaining = totalTime;
    }


    adjustCardsBasedOnDifficulty(cards, difficulty) {
        let activeCardsCount = 24 - difficulty; 
        cards.forEach((card, index) => {
            if (index >= activeCardsCount) {
                card.classList.add('hidden'); 
            } else {
                card.classList.remove('hidden'); 
            }
        });
        return cards.filter((_, index) => index < activeCardsCount);
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length){
            clearInterval(this.countDown);
            victory();
        }
            
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        
        document.getElementById('game-over-text').classList.add('visible');
    }

    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let difficulty = localStorage.getItem("difficulty") || '0'; 
    console.log("Value = " + difficulty);
    
    let game = new MixOrMatch(100, cards, difficulty); 
    console.log("Difficulty = " + (cards.length - parseInt(difficulty)));

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
    
}

function victory(){

    let victory = document.getElementById("victory-text");
    var bgm = document.getElementById("bgm")
    var victorySound = document.getElementById("victorysound")
    let flips = document.getElementById("flips").innerText;
    victory.classList.add('visible');
    bgm.pause();
    victorySound.play();
    
}



if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}


