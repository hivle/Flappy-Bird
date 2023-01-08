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
var ground_speed = 2;
var cont = true;


function setup() {
  createCanvas(400,600);
    ground = loadImage("images/ground.png");
    bg  = loadImage("images/bg.png");
    bird1 = loadImage("images/tile000.png");
    bird2 = loadImage("images/tile001.png");
    bird3 = loadImage("images/tile002.png");
    tube1 = loadImage("images/tube1.png");
    tube2 = loadImage("images/tube2.png");
  bird = new Bird();
  pipes.push(new Pipe());
}


function draw() {
  background(100);
  image(bg,0,0);


  for (let i = pipes.length-1; i > 0; i -= 1){
    pipes[i].show();
    pipes[i].update();

    if(pipes[i].hits(bird)) {
      console.log("HIT");
      cont = false;
    }
    if (pipes[i].offscreen()) {
      pipes.splice(i,1);
    }
  }
    image(ground,ground_movement,500);
    image(ground,ground_movement + width,500);
    ground_movement -= ground_speed;
    if (ground_movement === -width) {
        ground_movement = 0;
    }
  bird.update();
  bird.show();
 
  if (frameCount % 150 === 0) {
    pipes.push(new Pipe());
  }


}

function keyPressed() {
  if (key === ' ' && cont){
    bird.up();
  }
}

function mousePressed() {
    if (cont) {
        bird.up();
    }
}