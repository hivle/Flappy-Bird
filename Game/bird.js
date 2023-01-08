function Bird() {
    this.y = height/2 - 30;
    this.x = 100;
    this.gravity = 0.5;
    this.velocity = 0;
    this.turn = 0;
    this.turnup = false;
    this.ani = 0;

    this.show = function (){
        rectMode(CENTER);
        imageMode(CENTER);
        translate(this.x, this.y);
        this.ani += 1;
        if (start) this.turn = 0; 
        rotate(this.turn);
        if(cont === false){
            this.ani = -1;
        }
        if (this.ani <= 4){
            image(bird1,0,0);
            this.ani += 1;
        }
        else if (this.ani  <= 8){
            image(bird2,0,0);
            this.ani += 1;
        }
        else if (this.ani <= 12){
            image(bird3,0,0);
            if (this.ani === 12){
                this.ani = 0;
            }
        }

        if (this.turnup) {
            this.turn -= PI/180 * 12;
            if (this.turn < -PI/180 * 40) {
                this.turnup = false;
            }
            
        }
        else {
            this.turn += PI/90;
            if (this.turn > PI/2) {
                this.turn = PI/2;
            }
        }
        rectMode(CORNER);
        imageMode(CORNER);
    }


    this.up = function() {
        if(cont){
            this.velocity = -8;
            this.turnup = true;
        }
    }

    this.update = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (bird.y > height - 113) {
            this.y = height - 113;
            this.velocity = 0;
        }
        if (this.y === height - 113){
            cont = false;
            ground_speed = 0;
        }
        if (bird.y < -100) {
            this.y = -100;
            this.velocity = 0;
        }
    }

}
