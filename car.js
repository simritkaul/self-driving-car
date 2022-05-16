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

        this.damaged = false;

        this.sensor = new Sensor(this);
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

    update(roadBorders) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders);
        }
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polyIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        return false;
    }

    // We create this function to help us find the corners of the car for collision detection
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.w, this.h) / 2;
        const alpha = Math.atan2(this.w, this.h);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });

        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        return points;
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
        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-this.angle);

        // ctx.beginPath();
        // // We'll represent car as a simple rectangle
        // ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
        // ctx.fill();
        // ctx.restore();

        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = "black";
        }

        ctx.beginPath();

        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        this.sensor.draw(ctx);
    }
}
