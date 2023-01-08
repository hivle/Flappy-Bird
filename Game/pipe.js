function Pipe(){
    this.top = random(30,height-300);
    this.bottom = height - this.top - 150;
    this.x = width;
    this.w = 52;
    this.speed = 2;

    this.dead = false;

    bot = this.bottom;

    this.hits = function(bird) {
        if (bird.y < this.top + 13 || bird.y > height - this.bottom - 13) {
            if (bird.x > this.x - 13 && bird.x < this.x + this.w) {
                this.dead = true;
                return true;
            }
        }
        this.dead = false;
        return false;
    }

    this.show = function() {
       fill(255);
       if (this.dead) {
           this.speed = 0;
           ground_speed = 0;
       }
       //rect(this.x,0,this.w, this.top);
       image(tube1,this.x,this.top - 320);
       //rect(this.x,height-this.bottom,this.w,this.bottom - 100);
       image(tube2,this.x,height - this.bottom);
    }
    this.update = function() {
        if (cont) {
            this.x -= this.speed;
        }
    }

    this.offscreen = function() {
        return (this.x < -this.w);
    }
}