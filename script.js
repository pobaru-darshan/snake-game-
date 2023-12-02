const playboard = document.querySelector('.play-board');
const scorelement = document.querySelector(".score");
const highscoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let gameover = false;
let foodx, foody;
let snakex = 5,
    snakey = 5;
let velocitiex = 0,
    velocitiey = 0;
let snakebody = [];
let setintervalid;
let score = 0;

// high score store in localstorage

let highscore = localStorage.getItem('high-score') || 0;
highscoreElement.innerText = `High Score: ${highscore}`;


//passing random food values
const updatefoodposition = () => {
    foodx = Math.floor(Math.random() * 30) + 1;
    foody = Math.floor(Math.random() * 30) + 1;
}

const handlegameover = () => {
    //clear the timer and reloading the game

    clearInterval(setintervalid)
    alert("game over!");
    location.reload();
}

const changedirection = e => {
    //change value of direction by pressing errow key

    if (e.key === "ArrowUp" && velocitiey != 1) {
        velocitiex = 0;
        velocitiey = -1;
    } else if (e.key === "ArrowDown" && velocitiey != -1) {
        velocitiex = 0;
        velocitiey = 1;
    } else if (e.key === "ArrowLeft" && velocitiex != 1) {
        velocitiex = -1;
        velocitiey = 0;
    } else if (e.key === "ArrowRight" && velocitiex != -1) {
        velocitiex = 1;
        velocitiey = 0;
    }
}

//changeDirection on each key click and passing key

controls.forEach(button => button.addEventListener("click", () => changedirection({ key: button.dataset.key })));

const initgame = () => {
    if (gameover) return handlegameover();
    let html = `<div class="food" style="grid-area: ${foody} / ${foodx}"></div>`;


    //check snake hit food or not

    if (snakex === foodx && snakey === foody) {
        updatefoodposition();
        snakebody.push([foody, foodx]); // push food snake body
        score++; //update score 
        highscore = score >= highscore ? score : highscore;
        localStorage.setItem("high-score", highscore);
        scorelement.innerText = `score: ${score}`;
        highscoreElement.innerText = `high-score: ${highscore}`;
    }
    // Updating the snake 's head position based on the current velocity

    snakex += velocitiex; // increment
    snakey += velocitiey; // increment

    // Shifting forward the values of the elements in the snake body by one

    for (let i = snakebody.length - 1; i > 0; i--) {
        snakebody[i] = snakebody[i - 1];
    }
    snakebody[0] = [snakex, snakey];

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if (snakex <= 0 || snakex > 30 || snakey <= 0 || snakey > 30) {
        return gameover = true;
    }


    for (let i = 0; i < snakebody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<i class="fa-solid fa-handshake-angle head" style="grid-area: ${snakebody[i][1]} / ${snakebody[i][0]}"></i>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakebody[0][1] === snakebody[i][1] && snakebody[0][0] === snakebody[i][0]) {
            gameover = true;
        }

    }
    playboard.innerHTML = html;
}

updatefoodposition();
setintervalid = setInterval(initgame, 100);
document.addEventListener("keyup", changedirection);