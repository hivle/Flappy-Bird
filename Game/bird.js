function Bird() {
    this.y = height/2 - 30;
    this.x = 100;
    this.gravity = 0.8;
    this.velocity = 0;
    this.turn = 0;
    this.turnup = false;
    this.ani = 0;

    this.show = function (){
        fill(255);
        rectMode(CENTER);
        imageMode(CENTER);
        translate(this.x, this.y);
        this.ani += 1;
        rotate(this.turn);
        //rect(0,0,36,26);
        if(cont === false){
            this.ani = -1;
        }
        if (this.ani <= 5){
            image(bird1,0,0);
            this.ani += 1;
        }
        else if (this.ani  <= 10){
            image(bird2,0,0);
            this.ani += 1;
        }
        else if (this.ani <= 15){
            image(bird3,0,0);
            if (this.ani === 15){
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
            this.turn += PI/45;
            if (this.turn > PI/2) {
                this.turn = PI/2;
            }
        }
        rectMode(CORNER);
        imageMode(CORNER);
    }


    this.up = function() {
        if(cont){
            this.velocity = -12;
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