const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 448;
canvas.height = 400;

/* SPRITES BEGINS */
const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");
/* SPRITES ENDS */

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
const paddleWidth = 50;
const paddleHeight = 10;

// paddle position
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

// paddle speed
let paddleDx = 7;

// paddle keys
let rightPressed = false;
let leftPressed = false;
/* PADDLE VARIABLES END */

/* BRICKS VARIABLES BEGINS */
const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 0;
const brickOffsetTop = 30;
const brickOffsetLeft = 16;
const bricks = [];

const BRICKS_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};
/* BRICKS VARIABLES ENDS */

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

    const random = Math.floor(Math.random() * 8);

    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICKS_STATUS.ACTIVE,
      color: random,
    };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.drawImage(
    $sprite,
    29,
    174,
    paddleWidth,
    paddleHeight,
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  );
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICKS_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32;
      ctx.drawImage(
        $bricks,
        clipX,
        0,
        brickWidth,
        brickHeight,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      );
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICKS_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick =
        ballX > currentBrick.x && ballX < currentBrick.x + brickWidth;

      const isBallSameYAsBrick =
        ballY > currentBrick.y && ballY < currentBrick.y + brickHeight;

      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy = -dy;
        currentBrick.status = BRICKS_STATUS.DESTROYED;
      }
    }
  }
}

function ballMovement() {
  // bounce on the side walls
  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
    dx = -dx;
  }

  // bounce on the top wall
  if (ballY + dy < ballRadius) {
    dy = -dy;
  }

  //bounce on the paddle
  const isBallSameXAsPaddle =
      ballX > paddleX &&
      ballX < paddleX + paddleWidth

    const isBallTouchingPaddle =
      ballY + dy > paddleY
  if (
    isBallSameXAsPaddle &&
    isBallTouchingPaddle
  ) {
    if (ballX < paddleX + paddleWidth) {
      dy = -dy;
    }
  }

  // game over
  if (ballY + dy > canvas.height - ballRadius) {
    console.log("GAME OVER");
    document.location.reload();
  }

  // move the ball
  ballX += dx;
  ballY += dy;
}

function paddleMovement() {
  if (rightPressed) {
    paddleX += paddleDx;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= paddleDx;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  function handleKeyDown(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else {
      leftPressed = true;
    }
  }

  function handleKeyUp(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else {
      leftPressed = false;
    }
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
initEvents();
