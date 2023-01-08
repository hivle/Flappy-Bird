var bird;
var pipes = [];
var bg;
var bird1;
var bird2;
var bird3;
var tube1;
var tube2;
var ground;
var ground_movement = 0;
var score = 0;
var cont = true;
var back = 0
var start = true;

let myFont;
function preload() {
  myFont = loadFont('fonts/04b_19/04B_19__.TTF');
  ground = loadImage("images/ground.png");
  bg  = loadImage("images/bg.png");
  bird1 = loadImage("images/tile000.png");
  bird2 = loadImage("images/tile001.png");
  bird3 = loadImage("images/tile002.png");
  tube1 = loadImage("images/tube1.png");
  tube2 = loadImage("images/tube2.png");
}

function restart() {
  bird = new Bird();
  pipes = [];
  score = 0;
  cont = true;
  start = true;
}

function setup() {
  createCanvas(400,600);
  bird = new Bird();
  frameRate(60);
  textFont(myFont);
  textSize(40);
}

function draw() {
  if (back == -width) {
    back = 0;
  }
  if (ground_movement == -width) {
    ground_movement = 0;
  }
  image(bg,back,0);
  image(bg,back+width/*-17*/,0);
  image(bg,back,60);
  image(bg,back+width/*-17*/,60);
  if (cont) {
    ground_movement -= 2;
    back -=0.25;
  }

  // Draw pipes
  if (!start){
    for (let pipe of pipes){
      if (pipe.offscreen()) pipes.slice(1);
      else if (pipe.hits(bird)) cont = false;
      else if (pipe.pass(bird)) score++;
      pipe.show();
      pipe.update();
    }
  }

  // Draw Ground
  fill(0);
  text(score, 203-score.toString().length * 10, 103);
  fill(255);
  text(score, 200-score.toString().length * 10, 100);
  image(ground,ground_movement+width,500);
  image(ground,ground_movement,500);

  // Draw Bird
  if (!start) bird.update();
  bird.show();

  // New Pipe every 120 frames
  if (frameCount % 120 === 0 && !start) {
    pipes.push(new Pipe());
  }

}

function keyPressed() {
  if (key === ' '){
    start = false;
    if (cont) bird.up();
    else restart();
  }
}

function mousePressed() {
  start = false;
  if (cont) bird.up();
  else restart();
}
