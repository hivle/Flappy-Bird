class Sprite {
    constructor(frames, x, y, speed) {
        this.x = x;
        this.y = y;
        this.frames = frames;
        this.len = frames.length;
        this.speed = speed;
        this.index = 0;
    }

    show(ctx) {
        const f = this.frames[Math.floor(this.index) % this.len];
        ctx.drawImage(
            f.img, f.sx, f.sy, f.sw, f.sh,
            this.x - f.sw / 2, this.y - f.sh / 2, f.sw, f.sh
        );
    }

    animate() {
        this.index += this.speed;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}
