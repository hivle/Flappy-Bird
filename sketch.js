var bird;
var pipes = [];
var bg;
var tube1;
var tube2;
var ground;
var ground_movement = 0;
var score = 0;
var back = 0
let spritesheet;
let spritedata;
let animation = [];


let myFont;
function preload() {
  myFont = loadFont('fonts/04b_19/04B_19__.TTF');
  ground = loadImage("images/ground.png");
  bg  = loadImage("images/bg.png");
  spritedata = loadJSON('bird.json');
  spritesheet = loadImage('images/bird.png');
  tube1 = loadImage("images/tube1.png");
  tube2 = loadImage("images/tube2.png");
  pipe.push(new Pipe());
}

function restart() {
  bird = new Bird();
  pipes = [];
  pipe.push(new Pipe());
  score = 0;
}

function setup() {
  createCanvas(400,600);
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }
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
  image(bg,back+width,0);
  image(bg,back,0);
  image(bg,back+width,60);
  image(bg,back,60);
  if (!bird.dead) {
    ground_movement -= 2;
    back -=0.25;
  }

  // Draw pipes
  for (let pipe of pipes){
    if (pipe.offscreen()) pipes.slice(1);
    if (pipe.hits(bird)) {
      bird.dead = true;
    }
    else if (pipe.pass(bird)) score++;
    pipe.show();
    if (!bird.dead) pipe.update();
  }


  // Draw Ground
  fill(0);
  text(score, 203-score.toString().length * 10, 103);
  fill(255);
  text(score, 200-score.toString().length * 10, 100);
  image(ground,ground_movement+width,500);
  image(ground,ground_movement,500);

  // Draw Bird
  bird.update();
  bird.show();

  // New Pipe every 120 frames
  if (frameCount % 120 === 0 && !bird.dead && !bird.start) {
    pipes.push(new Pipe());
  }
}

function keyPressed() {
  bird.start = false;
  if (key === ' '){
    if (!bird.dead) bird.up();
    else restart();
  }
}

function mousePressed() {
  bird.start = false;
  if (!bird.dead) bird.up();
  else restart();
}
