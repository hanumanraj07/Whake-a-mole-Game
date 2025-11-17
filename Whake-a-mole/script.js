const scoreDisplay = document.querySelector('#score');
const hitCounterDisplay = document.querySelector('#hitCounter'); // New element
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const resumeBtn = document.querySelector('#resumeBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const whackMsgDisplay = document.querySelector('#whackMessage'); // New element
const lastGameScoreDisplay = document.querySelector('#lastGameScore'); // New element
const fastestHitTimeDisplay = document.querySelector('#fastestHitTime'); // New element


// Required variable
var score = 0;
var hits = 0; // 5. Hit Counter (Separate from Score)
var time = 30;
var bestScore = 0;
var playGame = false;
var gameId = null;
var moleStartTime = 0; // 8. "Fastest Hit" Timer
var fastestHit = Infinity; // 8. "Fastest Hit" Timer (in ms)


function saveMaxScore() {
    // 6. "New Record!" Glow on Best Score
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('highScoreGame', bestScore);
        maxScoreDisplay.classList.add('new-record-glow');
        setTimeout(() => {
            maxScoreDisplay.classList.remove('new-record-glow');
        }, 1000); // Remove glow after 1 second
        return true;
    }
    return false;
}

function displaySessionScores() {
    // 7 & 8. Display session scores on load
    const lastScore = sessionStorage.getItem('lastScore');
    const fHit = sessionStorage.getItem('fastestHit');

    if (lastScore) {
        lastGameScoreDisplay.textContent = `Last game: ${lastScore}`;
    } else {
        lastGameScoreDisplay.textContent = `Last game: --`;
    }

    if (fHit && fHit !== "Infinity") {
        fastestHit = parseInt(fHit);
        fastestHitTimeDisplay.textContent = `Fastest: ${fHit}ms`;
    } else {
        fastestHitTimeDisplay.textContent = `Fastest: --`;
    }
}

function webLoad() {
    onLoad();
    displayContent();
    displaySessionScores(); // Show session data on load
}

function onLoad() {
    var temp = localStorage.getItem('highScoreGame');
    if (temp != null) {
        bestScore = parseInt(temp);
    } else {
        bestScore = 0;
    }
};

function displayContent() {
    scoreDisplay.textContent = score;
    hitCounterDisplay.textContent = hits; // 5. Display Hit Counter
    timeLeftDisplay.textContent = time;
    maxScoreDisplay.textContent = bestScore;
};

webLoad();

function randomTimeGenerator(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomIndex() {
    var index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function popImageGame() {
    if (!playGame) return; // Stop if game over/paused

    let minTime = 500;
    let maxTime = 1500;

    // 4. Mole Speed Increases (Time Left < 10)
    if (time <= 10) {
        minTime = 300; 
        maxTime = 900; 
    }

    var randomTime = randomTimeGenerator(minTime, maxTime);
    var hole = randomIndex();
    var mole = hole.querySelector('.mole');
    
    // Ensure the mole is not already 'up' to prevent visual issues
    if (mole.classList.contains('up')) {
        // Recurse quickly if the hole is occupied, or skip this pop
        setTimeout(popImageGame, 100); 
        return;
    }

    mole.classList.add('up');
    moleStartTime = Date.now(); // 8. Record mole appearance time

    setTimeout(function () {
        mole.classList.remove('up');
        popImageGame();
    }, randomTime);
}

function endGame() {
    clearInterval(gameId);
    playGame = false;

    // 7. "Last Game Score" Using sessionStorage
    sessionStorage.setItem('lastScore', score);

    const isNewRecord = saveMaxScore(); // 6. Save max score

    displayContent(); // Update all displays one last time
    scoreDisplay.style.color='white';

    // 3. Start Button Says "Play Again"
    startBtn.innerText = "Play Again";
    startBtn.disabled = false;
    
    // Optional alert updated to be less intrusive
    if (isNewRecord) {
        alert(`🎉 New High Score: ${score}! 🎉`);
    } else {
        alert(`Game Over! Your score is: ${score}`);
    }
    
    displaySessionScores(); // Update displayed session data
}


function startGame() {
    // 7. Clear last score on start
    sessionStorage.removeItem('lastScore');

    score = 0;
    hits = 0; // Reset hits
    time = 30;
    fastestHit = Infinity; // Reset fastest hit for the new game

    startBtn.disabled = true;
    startBtn.innerText = "Whack!"; // Reset button text

    playGame = true;
    displayContent(); // Reset all displays
    displaySessionScores(); // Clear "Last game" display

    popImageGame();

    gameId = setInterval(function () {
        time--;
        displayContent();

        if (time === 0) {
            clearInterval(gameId);
            endGame();
        }
    }, 1000);
}

function bonk(event) {
    if (!playGame) return;

    const targetMole = event.target;

    if (targetMole.classList.contains('up')) {
        hits++; // 5. Update Hit Counter
        score++;

        // 8. "Fastest Hit" Timer calculation
        const timeTaken = Date.now() - moleStartTime;
        if (timeTaken < fastestHit) {
            fastestHit = timeTaken;
            sessionStorage.setItem('fastestHit', fastestHit.toString());
            displaySessionScores();
        }
        
        // 1. Score Turns Gold When > 50
        if(score > 50){
            scoreDisplay.style.color = 'gold';
        }
        
        // 2. "Whack!" Message on Hit
        whackMsgDisplay.textContent = `"😵‍💫Whack!"`;
        setTimeout(() => {
            whackMsgDisplay.textContent = "";
        }, 500); // Show for 500ms

        targetMole.classList.remove('up');
        targetMole.classList.add('bonked');
        
        setTimeout(function () {
            targetMole.classList.remove('bonked');
        }, 300); // 300ms transition time
        
    } else {
        // You missed logic (optional: penalty score, etc.)
    }
    
    displayContent();
}

function resetGame() {
    localStorage.clear();
    sessionStorage.clear(); // Clear session storage as well
    bestScore = 0;
    score = 0;
    hits = 0;
    time = 30;
    fastestHit = Infinity;
    
    // Ensure game is stopped
    if (gameId) {
        clearInterval(gameId);
    }
    playGame = false;

    displayContent();
    displaySessionScores();
    scoreDisplay.style.color='white';
    startBtn.innerText = "Start Game";
    startBtn.disabled = false;
}

function pauseGame() {
    if (!playGame) return;

    playGame = false;
    clearInterval(gameId);

    // hide any currently visible moles and "disable" interaction
    moles.forEach(m => {
        m.classList.remove('up');
        m.style.pointerEvents = 'none';
    });
    holes.forEach(h => (h.style.pointerEvents = 'none'));

    pauseBtn.style.display = "none";
    resumeBtn.style.display = "block";
}

function resumeGame() {
    if (playGame) return;      // already running
    if (time <= 0) return;     // game over; nothing to resume

    playGame = true;

    // re-enable interaction
    moles.forEach(m => (m.style.pointerEvents = 'auto'));
    holes.forEach(h => (h.style.pointerEvents = 'auto'));

    // show/hide the correct buttons
    resumeBtn.style.display = "none";
    pauseBtn.style.display = "block";

    // resume mole popping
    popImageGame();

    // resume countdown from remaining time
    gameId = setInterval(function () {
        time--;
        displayContent();

        if (time === 0) {
            clearInterval(gameId);
            endGame();
        }
    }, 1000);
}

// Event listeners
resumeBtn.addEventListener('click', resumeGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
startBtn.addEventListener('click', startGame);

moles.forEach((box) => {
    box.addEventListener('click', bonk);
});