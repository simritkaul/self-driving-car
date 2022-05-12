class Car {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // To make the motion more realistic
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 5;
        this.friction = 0.05;

        // When moving diagonally we don't want to have maxSpeed same as straightline
        this.angle = 0;

        this.controls = new Controls();
    }

    // update() {
    //     if (this.controls.forward) {
    //         this.y -= 2;
    //     }

    //     if (this.controls.reverse) {
    //         this.y += 2;
    //     }

    //     if (this.controls.left) {
    //         this.x -= 2;
    //     }

    //     if (this.controls.right) {
    //         this.x += 2;
    //     }
    // }

    update() {
        this.#move();
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // To solve the problem of reverse opposite directions
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.05 * flip;
            }

            if (this.controls.right) {
                this.angle -= 0.05 * flip;
            }
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        // We'll represent car as a simple rectangle
        ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.fill();
        ctx.restore();
    }
}
