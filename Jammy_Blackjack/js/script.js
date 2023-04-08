
let suits = ["h", "c", "d", "s"];
let values = ["Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

let dealerCards = document.getElementById("dealer-cards");
let dealerScore = document.getElementById("dealer-score");
let playerCards = document.getElementById("player-cards");
let playerScore = document.getElementById("player-score");
let dealButton = document.getElementById("deal-button");
let hitButton = document.getElementById("hit-button");
let standButton = document.getElementById("stand-button");

let deck = [];
let dealerHand = [];
let playerHand = [];
let dealerPoints = 0;
let playerPoints = 0;

let playerW = 0;
let dealerW = 0;

let outcome = "";

function createDeck() {
    for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
        for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
            let card = {
                suit: suits[suitIndex],
                value: values[valueIndex]
            }
            deck.push(card);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}

function getCardImageUrl(card) {
    return `cards/${card.suit.toLowerCase()[0]}${card.value}.png`;
}

function dealCards() {
    shuffleDeck();

    playerHand.push(deck.pop());
    playerHand.push(deck.pop());

    dealerHand.push(deck.pop());
    dealerHand.push(deck.pop());

    renderCards();
    renderScores();

    dealButton.disabled = true;

    document.getElementById("deal-button").style.display = "none";
    document.getElementById("hit-button").style.display = "block";
    document.getElementById("stand-button").style.display = "block";
}

function renderCards() {
    dealerCards.innerHTML = "";
    playerCards.innerHTML = "";

    for (let i = 0; i < dealerHand.length; i++) {
        let card = dealerHand[i];
        let imageUrl = getCardImageUrl(card);
        let cardElement = createCardElement(imageUrl);
        if (i === 0) {
            cardElement.classList.add("back");
        }
        dealerCards.appendChild(cardElement);
    }

    for (let i = 0; i < playerHand.length; i++) {
        let card = playerHand[i];
        let imageUrl = getCardImageUrl(card);
        let cardElement = createCardElement(imageUrl);
        playerCards.appendChild(cardElement);
    }
}

function createCardElement(imageUrl) {
    let cardElement = document.createElement("div");
    cardElement.classList.add("card");
    let imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    cardElement.appendChild(imageElement);
    return cardElement;
}

function calculatePoints(hand) {
    let points = 0;
    let aces = 0;
    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];
        let value = card.value;

        if (value === "Ace") {
            aces++;
            points += 11;
        } else if (value === "King" || value === "Queen" || value === "Jack") {
            points += 10;
        } else {
            points += parseInt(value);
        }
    }

    while (points > 21 && aces > 0) {
        points -= 10;
        aces--;
    }

    return points;
}

function renderScores() {
    dealerPoints = calculatePoints(dealerHand);
    playerPoints = calculatePoints(playerHand);

    dealerScore.innerHTML = `Score: ${dealerPoints}`;
    playerScore.innerHTML = `Score: ${playerPoints}`;
}



function hit() {
    playerHand.push(deck.pop());
    renderCards();
    renderScores();

    if (playerPoints > 21) {
        endGame("bust");
    }

}

function stand() {
    dealerCards.firstChild.classList.remove("back");
    while (dealerPoints < 17) {
        dealerHand.push(deck.pop());
        renderCards();
        renderScores();
        dealerPoints = calculatePoints(dealerHand);
    }

    if ((dealerPoints > 21 || playerPoints > dealerPoints) && playerPoints <= 21) {
        endGame(true);
    } else {
        endGame(false);
    }
}

function endGame(playerWins) {
    if (playerWins == "bust"){
        outcome = "BUST!"
        dealerW ++;
    }
    else{
        if (playerWins) {
            outcome = "Player Wins!";
            playerW ++;
        } else {
            outcome = "Dealer Wins!";
            dealerW ++;
        }
    }
    document.getElementById("out").innerHTML = outcome;

    document.getElementById("countP").innerHTML = "Player Wins: " + playerW;
    document.getElementById("countD").innerHTML = "Dealer Wins: " + dealerW;
    deck = [];
    createDeck();
    playerHand = [];
    dealerHand = [];
    dealerPoints = 0;
    playerPoints = 0;
    dealButton.disabled = false;

    document.getElementById("deal-button").style.display = "block";
    document.getElementById("hit-button").style.display = "none";
    document.getElementById("stand-button").style.display = "none";
}

dealButton.addEventListener("click", dealCards);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);

createDeck();
renderCards();
renderScores();