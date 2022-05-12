const canvas = document.getElementById("myCanvas");

canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50); // (x, y, w, h)

const animate = () => {
    car.update();
    canvas.height = window.innerHeight;
    car.draw(ctx);
    // This calls the animate function many times every second
    // Gives the illusion of movement
    requestAnimationFrame(animate);
};

animate();
