window.onload = () => {

  const myObstacles = [];
  const myImages = ["./images/clock.png","./images/computer.png","./images/diaper.png","./images/dishes.png","./images/dog.png","./images/money.png","./images/whatsapp.png"]
  let start = false



const myGameArea = {
  canvas: document.getElementById("canvas"),
  
  drawRoom: function () {
    this.context = this.canvas.getContext("2d");
  },
  
  frames: 0,
  start: function() {
    // call updateGameArea() every 20 milliseconds
    this.interval = setInterval(updateGameArea, 20);
  },

  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  stop: function() {
    clearInterval(this.interval);
  },
  score: function() {
    const points = 300 - Math.floor(this.frames / 5);
    this.context.font = "20px Arial";
    this.context.fillStyle = "red";
    this.context.fillText(`SCORE: ${points}`, 333, 42);
    return points
  }

  // ***************** COMPONENT CONSTRUCTOR *****************
};
class Component {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
  }
  
  update() {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
  }
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

const player = new Component(30, 30, "red", 0, 450);

function updateGameArea() {
  myGameArea.clear();
  // update the player's position before drawing
  player.newPos();
  player.update();
  // update the obstacles array
  updateObstacles();
  // check if the game should stop
  checkGameOver();
  //drawGameBG()
  myGameArea.score();
}

// ************ GAME SOUNDS ********************

// BG Music
const myBGMusic = new Audio()
myBGMusic.src = "./images/GameSound.mp3"

//Game Over Music
const myGameOverMusic = new Audio()
myGameOverMusic.src = "./images/GameOverSound.mp3"
// Winner Music
const myWinnerMusic = new Audio()
myWinnerMusic.src = "./images/WinnerSound.mp3"

// **************** GAME IMAGES *****************

// Opening image
const roomImg = new Image();
roomImg.src = './images/preGameBG.png';   
roomImg.onload = function () { 
myGameArea.context.drawImage(roomImg, 0, 0, 801, 500);
}

function gameOverImg(){
  const roomImg = new Image();
  roomImg.src = './images/looserBG.png';   
  roomImg.onload = function () {
  myGameArea.context.drawImage(roomImg, 0, 0, 801, 500);
  m
  }
}

function winnerImg(){
  const roomImg = new Image();
  roomImg.src = './images/winnerBG.png';   
  roomImg.onload = function () {
  myGameArea.context.drawImage(roomImg, 0, 0, 801, 500);
  myGameArea.score()
  }
}


myGameArea.drawRoom()



// BOTÃO START

document.getElementById('start-button').onclick = () => {
  if (!start){
    myGameArea.start();
    myBGMusic.play()
    start = true;
    document.getElementById('start-button').innerText = "RESET GAME"
    } else {
    window.location.reload()
  }
}

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY -= 3;
      break;
    case 40: // down arrow
      player.speedY += 3;
      break;
    case 37: // left arrow
      player.speedX -= 3;
      break;
    case 39: // right arrow
      player.speedX += 3;
      break;
  }
};

document.onkeyup = function(e) {
  player.speedX = 0;
  player.speedY = 0;
};

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].y += +5;
    myObstacles[i].update();
  }

  myGameArea.frames += 1;

  if (myGameArea.frames % 8 === 0) {
  
    let minWidth = 80;
    let maxWidth = 870;
    let x = Math.floor(
      Math.random() * (maxWidth - minWidth + 1) + minWidth)
    
    // const componentImg = new Image();
    // componentImg.src = './images/dog.png';   
    
    myObstacles.push(new Component(30, 30, "black", x, 10));
  }
}

// **************** GAME OVER / WIN **********************

function checkGameOver() {
  const crashed = myObstacles.some(function(obstacle) {
  return player.crashWith(obstacle); 
  });
  // Game Over
    if (crashed || myGameArea.score() === 0)  {
      myGameArea.stop();
      myBGMusic.pause();
      setInterval(myGameOverMusic.play(), 1000);
      setInterval(gameOverImg, 500);
  // Game Win
    } else if (player.x >= 640 && player.y <= 270) {
      myGameArea.stop();
      myBGMusic.pause();
      setInterval(winnerImg, 500);
      setInterval(myWinnerMusic.play(),1000);
    }
  }
}