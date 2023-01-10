function Bird() {
    this.y = height/2 - 30;
    this.x = 100;
    this.gravity = 0.5;
    this.velocity = 0;
    this.turn = 0;
    this.turnup = false;
    this.birds = new Sprite(animation, 0, 0, 0.4);
    this.dead = false;
    this.start = true;
    

    this.show = function (){
        imageMode(CENTER);
        translate(this.x, this.y);
        if (this.start) {
            this.birds.move(0, 0);
            this.birds.show();
            if (!this.dead) this.birds.animate();
        }
        else {
            rotate(this.turn);
            this.birds.move(0, 0);
            this.birds.show();
            if (!this.dead) this.birds.animate();
            if (this.turnup) {
                this.turn -= PI/180 * 12;
                if (this.turn < -PI/180 * 40) {
                    this.turnup = false;
                }
                
            }
            else {
                if(bird.dead) {
                    this.turn += PI/30;
                }
                else this.turn += PI/90;
                if (this.turn > PI/2) {
                    this.turn = PI/2;
                }

            }
        }
        imageMode(CORNER);
    }


    this.up = function() {
        if (!this.dead){
            this.velocity = -8;
            this.turnup = true;
        }
    }

    this.update = function () {
        if (!this.start) this.velocity += this.gravity;
        this.y = constrain(this.y + this.velocity, -100, height - 113);
        if (this.y == height - 113){
            this.dead = true;
        }
    }

}
