function Pipe(){
    this.top = random(30,height-300);
    this.bottom = height - this.top - 125;
    this.x = width;
    this.w = tube1.width;
    this.speed = 2;

    this.hits = function(bird) {
        if (bird.y < this.top + 13 || bird.y > height - this.bottom - 13) {
            if (bird.x > this.x - 13 && bird.x < this.x + this.w) {
                return true;
            }
        }
        return false;
    }

    this.pass = function(bird) {
        return (bird.x == this.x + this.w);
    }

    this.show = function() {
       image(tube1,this.x,this.top - 320);
       image(tube2,this.x,height - this.bottom);
    }
    this.update = function() {
        this.x -= this.speed;
    }

    this.offscreen = function() {
        return (this.x < -this.w);
    }
}
