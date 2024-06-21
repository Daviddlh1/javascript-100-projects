const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 448;
canvas.height = 400;

/* BALL VARIABLES BEGINS */
const ballRadius = 4;

// ball position
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;

// ball speed
let dx = 2;
let dy = -2;
/* BALL VARIABLES END */

/* PADDLE VARIABLES BEGIN */
const paddleWidth = 60;
const paddleHeight = 10;

// paddle position
let paddleX = (canvas.width / 2) - 30;
let paddleY = canvas.height - 10;

// paddle speed
let paddleDx = 7;

// paddle keys
let rightPressed = false;
let leftPressed = false;
/* PADDLE VARIABLES END */


function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {}

function collisionDetection() {}

function ballMovement() {
    // bounce on the side walls
    if(
        ballX + dx > canvas.width - ballRadius || 
        ballX + dx < ballRadius
    ) {
        dx = -dx;
    }

    // bounce on the top wall
    if(ballY + dy < ballRadius) {
        dy = -dy;
    }

    //bounce on the paddle

    // game over
    if(ballY + dy > canvas.height - ballRadius) {
        console.log('GAME OVER');
        document.location.reload();
    }

    // move the ball
    ballX += dx;
    ballY += dy;
}

function paddleMovement() {}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    function handleKeyDown(event) {

    }

    function handleKeyUp(event) {

    }
}

function draw() {
    // draw the elements
    cleanCanvas();
    drawBall();
    drawPaddle();
    drawBricks();

    // collision detection and movements
    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}

draw();