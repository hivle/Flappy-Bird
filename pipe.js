class Pipe {
    constructor(game) {
        this.game = game;
        this.top = 30 + Math.random() * (game.height - 330);
        this.bottom = game.height - this.top - 150;
        this.x = game.width;
        this.w = game.tube1.width;
        this.speed = 2;
        this.passed = false;
    }

    hits(bird) {
        if (bird.y < this.top + 13 || bird.y > this.game.height - this.bottom - 13) {
            if (bird.x > this.x - 13 && bird.x < this.x + this.w) return true;
        }
        return false;
    }

    pass(bird) {
        if (!this.passed && bird.x >= this.x + this.w) {
            this.passed = true;
            return true;
        }
        return false;
    }

    show(ctx) {
        ctx.drawImage(this.game.tube1, this.x, this.top - 320);
        ctx.drawImage(this.game.tube2, this.x, this.game.height - this.bottom);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x < -this.w;
    }
}
