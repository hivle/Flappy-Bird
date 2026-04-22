class Bird {
    constructor(game) {
        this.game = game;
        this.y = game.height / 2 - 30;
        this.x = 100;
        this.gravity = 0.5;
        this.velocity = 0;
        this.turn = 0;
        this.turnup = false;
        this.sprite = new Sprite(game.birdFrames, 0, 0, 0.4);
        this.dead = false;
        this.start = true;
    }

    show(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.start) {
            this.sprite.show(ctx);
            if (!this.dead) this.sprite.animate();
        } else {
            ctx.rotate(this.turn);
            this.sprite.show(ctx);
            if (!this.dead) this.sprite.animate();
            if (this.turnup) {
                this.turn -= Math.PI / 180 * 12;
                if (this.turn < -Math.PI / 180 * 40) this.turnup = false;
            } else {
                this.turn += this.dead ? Math.PI / 30 : Math.PI / 90;
                if (this.turn > Math.PI / 2) this.turn = Math.PI / 2;
            }
        }
        ctx.restore();
    }

    up() {
        if (!this.dead) {
            this.velocity = -8;
            this.turnup = true;
        }
    }

    update() {
        if (!this.start) this.velocity += this.gravity;
        const maxY = this.game.height - 113;
        this.y = Math.max(-100, Math.min(maxY, this.y + this.velocity));
        if (this.y === maxY) this.dead = true;
    }
}
