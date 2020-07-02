/* Sound Control */
class AudioController {
  constructor() {
    this.bgMusic = new Audio("assets/Audio/theme-Song.mp3");
    this.introSound = new Audio("assets/Audio/here we go.wav");
    this.flipSound = new Audio("assets/Audio/flip.wav");
    this.matchSound = new Audio("assets/Audio/Hoo-hoo!.wav");
    this.victorySound = new Audio("assets/Audio/victory.wav");
    this.gameOverSound = new Audio("assets/Audio/mariodie.wav");
    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;
    this.mute = false;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  toggleMusic() {
    if (this.mute == false) {
        this.stopMusic();
        this.mute = true;
        $("#muteId").removeClass("fa-volume-up");
        $("#muteId").addClass("fa-volume-mute");
        
    } else {
      this.startMusic();
        this.mute = false;
        $("#muteId").removeClass("fa-volume-mute");
        $("#muteId").addClass("fa-volume-up");
        
    }
  }
  startIntro() {
    this.introSound.play();
  }
  flip() {
    if (this.mute == false) {
      this.flipSound.play();
    }
  }
  match() {
    if (this.mute == false) {
      this.matchSound.play();
    }
  }
  victory() {
    if (this.mute == false) {
      this.stopMusic();
      this.victorySound.play();
    }
  }
  gameOver() {
    if (this.mute == false) {
      this.stopMusic();
      this.gameOverSound.play();
    }
  }
}

/* Playing Matching Cards */
class BeatTheClock {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById("time-remaining");
    this.ticker = document.getElementById("flips");
    this.audioController = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.audioController.startIntro();
      this.audioController.startMusic();
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }
  hideCards() {
    this.cardsArray.forEach((card) => {
      card.classList.remove("visible");
      card.classList.remove("matched");
    });
  }
  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add("visible");

      if (this.cardToCheck) this.checkForCardMatch(card);
      else this.cardToCheck = card;
    }
  }
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    else this.cardMisMatch(card, this.cardToCheck);
    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.audioController.match();
    if (this.matchedCards.length === this.cardsArray.length) this.victory();
  }
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 1000);
  }
  getCardType(card) {
    return card.getElementsByClassName("card-value")[0].src;
  }

  /* Timer */
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) this.gameOver();
    }, 1000);
  }

  /* Overlays */
  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById("game-over-text").classList.add("visible");
  }
  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    document.getElementById("victory-text").classList.add("visible");
  }

  /* Fisher-Yates Shuffle Algorithm */

  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }
  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }
}

/*  Start The Game */
let overlays = Array.from(document.getElementsByClassName("overlay-text"));
let muteButton = document.getElementById("muteId");
let cards = Array.from(document.getElementsByClassName("card"));
let game = new BeatTheClock(100, cards);

/* On Clicks for Overlays */
overlays.forEach((overlay) => {
  overlay.addEventListener("click", () => {
    overlay.classList.remove("visible");
    game.startGame();
  });
});
cards.forEach((card) => {
  card.addEventListener("click", () => {
    game.flipCard(card);
  });
});

/* On and Off Audio Button */
muteButton.addEventListener("click", () => {
    game.audioController.toggleMusic();
});
