const MIN_SIZE = 3,
    MAX_SIZE = 10,
    MIN_OPACITY = 80,
    MAX_OPACITY = 100,
    MIN_SPEED = 0.3,
    MAX_SPEED = 0.8,
    MIN_RECT_COUNT = 2,
    MAX_RECT_COUNT = 5,
    MIN_RAYS_COUNT = 5,
    MAX_RAYS_COUNT = 7,
    SNOWFLAKE_PER_PIXEL = 15000;

let canvas, ctx;

let w, h, vmin;

let snow;

let noise;

function setup() {
    canvas = document.querySelector('#snow');
    ctx = canvas.getContext('2d');

    resetSize();
    window.onresize = resetSize;

    resetSnowflakes();

    draw();
}

function resetSize() {
    w = 0;
    h = 0;
    vmin = 0;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    vmin = w > h ? h : w;
}

function resetSnowflakes() {
    noise = new Perlin();
    snow = [];
    for (let i = 0; i < Math.floor((w * h) / SNOWFLAKE_PER_PIXEL); i++) {
        snow.push(new Snowflake());
    }
}

function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);
    ctx.closePath();

    while (snow.length > Math.floor((w * h) / SNOWFLAKE_PER_PIXEL)) {
        snow.pop();
    }

    if (snow.length < Math.floor((w * h) / SNOWFLAKE_PER_PIXEL)) {
        snow.push(new Snowflake());
    }

    for (let i = 0; i < snow.length; i++) {
        snow[i].update();
        snow[i].render(ctx);
    }

    window.requestAnimationFrame(draw);
}

window.onload = setup;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function Snowflake() {
    this.posX = rand(0, w);
    this.posY = rand(0, h);
    this.rotation = rand(0, Math.PI / 3);
    this.speed = rand(MIN_SPEED, MAX_SPEED);
    this.rotateSpeed = ((Math.random() - 0.5) * this.speed) / 20;
    this.opacity = rand(MIN_OPACITY, MAX_OPACITY);
    this.size = rand(MIN_SIZE, MAX_SIZE);
    this.off = rand(0, 100);
    this.rectCount = Math.round(rand(MIN_RECT_COUNT, MAX_RECT_COUNT));
    this.raysCount = Math.round(rand(MIN_RAYS_COUNT, MAX_RAYS_COUNT));

    this.update = function () {
        this.posY += this.speed;
        this.posX += noise.getValue(this.off);
        this.rotation += this.rotateSpeed;
        this.off += 0.007;

        if (this.posY > h + this.size * 2) {
            this.posY = -this.size * 2;
            this.posX = Math.random() * w;
        }
    };

    this.render = function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.rotation);
        let theta = Math.PI / (this.raysCount / 2);
        while (theta < Math.PI * 2 + Math.PI / this.raysCount) {
            ctx.save();
            ctx.beginPath();
            ctx.rotate(theta);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity / 255})`;
            let rectWidth = this.size;
            for (i = 0; i < this.rectCount; i++) {
                ctx.save();
                ctx.beginPath();
                rectWidth *= 0.9;
                ctx.translate(rectWidth * 0.7 * (i + 0.8), 0);
                ctx.rotate(Math.PI / 4);
                ctx.fillRect(
                    -rectWidth / 2,
                    -rectWidth / 2,
                    rectWidth,
                    rectWidth
                );
                ctx.closePath();
                ctx.restore();
            }
            ctx.closePath();
            ctx.restore();
            theta += Math.PI / (this.raysCount / 2);
        }
        ctx.closePath();
        ctx.restore();
    };
}
class Perlin {
    constructor() {
        this.perm = (() => {
            const tmp = Array.from({ length: 256 }, () =>
                Math.floor(Math.random() * 256)
            );
            return tmp.concat(tmp);
        })();
    }

    grad(i, x) {
        const h = i & 0xf;
        const grad = 1 + (h & 7);
        if ((h & 8) !== 0) {
            return -grad * x;
        }
        return grad * x;
    }

    getValue(x) {
        const i0 = Math.floor(x);
        const i1 = i0 + 1;
        const x0 = x - i0;
        const x1 = x0 - 1;
        let t0 = 1 - x0 * x0;
        t0 *= t0;
        let t1 = 1 - x1 * x1;
        t1 *= t1;
        const n0 = t0 * t0 * this.grad(this.perm[i0 & 0xff], x0);
        const n1 = t1 * t1 * this.grad(this.perm[i1 & 0xff], x1);
        return 0.395 * (n0 + n1);
    }
}
