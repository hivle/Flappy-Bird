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

class Bird {
    constructor(game) {
        this.game = game;
        this.y = game.height / 2 - 30;
        this.x = 100;
        this.gravity = 0.5;
        this.velocity = 0;
        this.turn = 0;
        this.turnup = false;
        this.sprite = new Sprite(game.birdFrames, 0, 0, 0.15);
        this.dead = false;
        this.start = true;
    }

    show(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (!this.start) ctx.rotate(this.turn);
        this.sprite.show(ctx);
        ctx.restore();
    }

    up() {
        if (!this.dead) {
            this.velocity = -8;
            this.turnup = true;
        }
    }

    update() {
        if (!this.dead) this.sprite.animate();
        if (this.start) return;
        this.velocity += this.gravity;
        const maxY = this.game.height - 113;
        this.y = Math.max(-100, Math.min(maxY, this.y + this.velocity));
        if (this.y === maxY) this.dead = true;
        if (this.turnup) {
            this.turn -= Math.PI / 180 * 6;
            if (this.turn < -Math.PI / 180 * 40) this.turnup = false;
        } else {
            this.turn += this.dead ? Math.PI / 60 : Math.PI / 180;
            if (this.turn > Math.PI / 2) this.turn = Math.PI / 2;
        }
    }
}

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

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const STATE = { MENU: 'menu', PLAYING: 'playing', PAUSED: 'paused', GAMEOVER: 'gameover' };

const game = {
    width: canvas.width,
    height: canvas.height,
    bird: null,
    pipes: [],
    score: 0,
    groundMovement: 0,
    frames: 0,
    state: STATE.MENU,
};

const ui = {
    overlay: document.getElementById('overlay'),
    title: document.getElementById('overlayTitle'),
    subtitle: document.getElementById('overlaySubtitle'),
    action: document.getElementById('actionBtn'),
    pause: document.getElementById('pauseBtn'),
    restart: document.getElementById('restartBtn'),
};

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
    });
}

function loadJSON(src) {
    return fetch(src).then(r => r.json());
}

async function loadFont(family, src) {
    try {
        const font = new FontFace(family, `url(${src})`);
        await font.load();
        document.fonts.add(font);
    } catch (e) {
        console.warn('Font failed to load, falling back to sans-serif', e);
    }
}

async function preload() {
    await loadFont('flappy', 'fonts/04b_19/04B_19__.TTF');
    const [ground, bg, spritesheet, tube1, tube2, spritedata] = await Promise.all([
        loadImage('images/ground.png'),
        loadImage('images/bg.png'),
        loadImage('images/bird.png'),
        loadImage('images/tube1.png'),
        loadImage('images/tube2.png'),
        loadJSON('bird.json'),
    ]);
    game.ground = ground;
    game.bg = bg;
    game.tube1 = tube1;
    game.tube2 = tube2;
    game.birdFrames = spritedata.frames.map(f => ({
        img: spritesheet,
        sx: f.position.x,
        sy: f.position.y,
        sw: f.position.w,
        sh: f.position.h,
    }));
}

function resetGame() {
    game.bird = new Bird(game);
    game.pipes = [];
    game.score = 0;
    game.frames = 0;
    game.groundMovement = 0;
}

function setState(next) {
    game.state = next;
    if (next === STATE.MENU) {
        showOverlay('Flappy Bird', 'Space / click / tap to flap', 'Play');
        ui.pause.disabled = true;
        ui.pause.textContent = 'Pause';
    } else if (next === STATE.PLAYING) {
        hideOverlay();
        ui.pause.disabled = false;
        ui.pause.textContent = 'Pause';
    } else if (next === STATE.PAUSED) {
        showOverlay('Paused', '', 'Resume');
        ui.pause.textContent = 'Resume';
    } else if (next === STATE.GAMEOVER) {
        showOverlay('Game Over', `Score: ${game.score}`, 'Play Again');
        ui.pause.disabled = true;
        ui.pause.textContent = 'Pause';
    }
}

function showOverlay(title, subtitle, action) {
    ui.title.textContent = title;
    ui.subtitle.textContent = subtitle;
    ui.subtitle.style.display = subtitle ? '' : 'none';
    ui.action.textContent = action;
    ui.overlay.classList.remove('hidden');
}

function hideOverlay() {
    ui.overlay.classList.add('hidden');
}

function startPlaying() {
    if (game.state === STATE.GAMEOVER) resetGame();
    game.bird.start = false;
    game.bird.up();
    setState(STATE.PLAYING);
}

function flap() {
    if (game.state === STATE.MENU) startPlaying();
    else if (game.state === STATE.PLAYING) game.bird.up();
    else if (game.state === STATE.GAMEOVER) {
        resetGame();
        setState(STATE.MENU);
    }
}

function togglePause() {
    if (game.state === STATE.PLAYING) setState(STATE.PAUSED);
    else if (game.state === STATE.PAUSED) setState(STATE.PLAYING);
}

function restart() {
    resetGame();
    setState(STATE.MENU);
}

const SIM_STEP = 1000 / 60;
let lastTime = 0;
let accumulator = 0;

function updatePipes() {
    const active = game.state === STATE.PLAYING;
    for (let i = game.pipes.length - 1; i >= 0; i--) {
        const pipe = game.pipes[i];
        if (active) {
            if (pipe.hits(game.bird)) {
                game.bird.dead = true;
                setState(STATE.GAMEOVER);
            } else if (pipe.pass(game.bird)) {
                game.score++;
            }
            pipe.update();
        }
        if (pipe.offscreen()) game.pipes.splice(i, 1);
    }
}

function updateGround() {
    if (game.state !== STATE.PLAYING) return;
    game.groundMovement -= 2;
    if (game.groundMovement <= -game.width) game.groundMovement = 0;
}

function updateBird() {
    if (game.state === STATE.PAUSED) return;
    game.bird.update();
    if (game.bird.dead && game.state !== STATE.GAMEOVER) {
        setState(STATE.GAMEOVER);
    }
}

function maybeSpawnPipe() {
    if (game.state !== STATE.PLAYING) return;
    game.frames++;
    if (game.frames % 120 === 0) game.pipes.push(new Pipe(game));
}

function step() {
    updatePipes();
    updateGround();
    updateBird();
    maybeSpawnPipe();
}

function drawBackground() {
    ctx.drawImage(game.bg, 0, 0);
}

function drawPipes() {
    for (let i = 0; i < game.pipes.length; i++) {
        game.pipes[i].show(ctx);
    }
}

function drawGround() {
    ctx.drawImage(game.ground, game.groundMovement + game.width, 500);
    ctx.drawImage(game.ground, game.groundMovement, 500);
}

function drawScore() {
    ctx.font = '40px "flappy", sans-serif';
    ctx.textBaseline = 'alphabetic';
    const text = game.score.toString();
    const width = ctx.measureText(text).width;
    const x = (game.width - width) / 2;
    ctx.fillStyle = 'black';
    ctx.fillText(text, x + 3, 103);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, 100);
}

function drawBird() {
    game.bird.show(ctx);
}

function render() {
    drawBackground();
    drawPipes();
    drawScore();
    drawGround();
    drawBird();
}

function loop(now) {
    if (!lastTime) lastTime = now;
    let delta = now - lastTime;
    lastTime = now;
    if (delta > 250) delta = 250;
    accumulator += delta;
    while (accumulator >= SIM_STEP) {
        step();
        accumulator -= SIM_STEP;
    }
    render();
    requestAnimationFrame(loop);
}

function bindInput() {
    window.addEventListener('keydown', e => {
        if (e.code === 'Space') {
            e.preventDefault();
            flap();
        } else if (e.code === 'KeyP') {
            e.preventDefault();
            togglePause();
        }
    });

    canvas.addEventListener('mousedown', e => {
        e.preventDefault();
        flap();
    });

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        flap();
    }, { passive: false });

    ui.action.addEventListener('click', () => {
        if (game.state === STATE.MENU) startPlaying();
        else if (game.state === STATE.PAUSED) setState(STATE.PLAYING);
        else if (game.state === STATE.GAMEOVER) {
            resetGame();
            startPlaying();
        }
    });

    ui.pause.addEventListener('click', togglePause);
    ui.restart.addEventListener('click', restart);
}

preload().then(() => {
    resetGame();
    bindInput();
    setState(STATE.MENU);
    requestAnimationFrame(loop);
}).catch(err => {
    console.error('Failed to load assets', err);
    ui.title.textContent = 'Error';
    ui.subtitle.textContent = 'Failed to load assets. Serve via http://, not file://.';
    ui.action.style.display = 'none';
});
