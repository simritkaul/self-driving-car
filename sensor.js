class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 3;
        this.rayLength = 100;
        this.raySpead = Math.PI / 4; // 45 deg
        this.rays = [];
    }
}
