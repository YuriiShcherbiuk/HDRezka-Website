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

class Snowflake {
    constructor() {
        this.posX = rand(0, w);
        this.posY = rand(0, h);
        this.rotation = rand(0, Math.PI / 3);
        this.speed = rand(MIN_SPEED, MAX_SPEED);
        this.rotateSpeed = ((Math.random() - 0.5) * this.speed) / 20;
        this.size = rand(MIN_SIZE, MAX_SIZE);
        this.off = rand(0, 1000);
        this.opacity = 0;
    }

    update() {
        this.posY += this.speed;
        this.posX += noise.getValue(this.off);
        this.rotation += this.rotateSpeed;
        this.off += 0.007;

        if (this.posY > h + this.size) {
            this.posY = -this.size;
            this.posX = Math.random() * w;
        }

        if (this.posX > w + this.size) {
            this.posX = -this.size;
        }

        if (this.posX < 0 - this.size) {
            this.posX = w + this.size;
        }

        if (this.opacity < 1) {
            this.opacity += 0.05;
        }
    }
}

const MIN_SIZE = 10,
    MAX_SIZE = 30,
    MIN_SPEED = 0.3,
    MAX_SPEED = 0.8,
    SNOWFLAKE_PER_PIXEL = 5000;

let noise;

let snowflake, snowTheme;

let w = 0,
    h = 0;

const snow = [];

function setup() {
    w = window.innerWidth;
    h = window.innerHeight;
    createCanvas(w, h);

    snowTheme = theme;
    snowflake = createSnowflake(snowTheme);

    noise = new Perlin();
}

function draw() {
    if (snowTheme !== theme) {
        snowTheme = theme;

        snowflake.remove();
        snowflake = createSnowflake(snowTheme);
    }

    while (snow.length > Math.floor((w * h) / SNOWFLAKE_PER_PIXEL)) {
        snow.pop();
    }

    if (
        frameCount % 10 === 0 &&
        snow.length < Math.floor((w * h) / SNOWFLAKE_PER_PIXEL)
    ) {
        snow.push(new Snowflake());
    }

    theme === 'dark' ? background(26) : background(252, 248, 248);

    for (let i = 0; i < snow.length; i++) {
        snow[i].update();

        push();

        translate(snow[i].posX, snow[i].posY);
        rotate(snow[i].rotation);

        if (snow[i].opacity < 1) {
            tint(255, 255 * snow[i].opacity);
        }

        image(snowflake, 0, 0, snow[i].size, snow[i].size);

        pop();
    }
}

function createSnowflake(theme) {
    let snowflake = createGraphics(100, 100);

    theme === 'dark'
        ? snowflake.stroke(255, 255, 255, 255 * 0.4)
        : snowflake.stroke(0, 191, 255, 255 * 0.4);
    snowflake.strokeWeight(6);
    snowflake.strokeCap(ROUND);
    snowflake.noFill();

    snowflake.translate(50, 50);

    snowflake.push();
    let theta = Math.PI / 3;

    while (theta < Math.PI * 2 + Math.PI / 6) {
        snowflake.push();
        snowflake.rotate(theta);

        snowflake.push();
        snowflake.line(0, 0, 47, 0);

        snowflake.push();
        snowflake.translate(47 * 0.6, 0);
        snowflake.rotate(-Math.PI / 4);
        snowflake.line(0, 0, 15, 0);
        snowflake.pop();

        snowflake.push();
        snowflake.translate(47 * 0.6, 0);
        snowflake.rotate(Math.PI / 4);
        snowflake.line(0, 0, 15, 0);
        snowflake.pop();
        snowflake.pop();

        theta += Math.PI / 3;
        snowflake.pop();
    }

    snowflake.pop();

    return snowflake;
}

window.onresize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w, h);
};

function rand(min, max) {
    return Math.random() * (max - min) + min;
}
