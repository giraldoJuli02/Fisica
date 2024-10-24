const canvas = document.getElementById("heatCanvas");
const ctx = canvas.getContext("2d");

const materialSelect = document.getElementById("materialSelect");
const tempSlider = document.getElementById("tempSlider");
const tempValue = document.getElementById("tempValue");

let temperature = 20;
let conductivity = 0.5;  // Default for wood
let particles = [];
const spoonStartX = 200;
const spoonWidth = 20;
const spoonHeight = 100;
const spoonY = 100;

// Create particles
function createParticles() {
    particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * 300 + 50,  // In the cup
            y: Math.random() * 300 + 150,  // In the cup
            speed: Math.random() * 1  // Low initial speed
        });
    }
}

// Update particles' speed based on conductivity and temperature
function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Particles near the spoon rise faster
        if (p.x > spoonStartX && p.x < spoonStartX + spoonWidth) {
            p.y -= p.speed * conductivity;  // Rise faster around spoon
        } else {
            p.y = (Math.random() * 300 + 150);  // Slowly settle away from the spoon
        }

        // Limit particles within the canvas
        if (p.y > 450) p.y = 450;
        if (p.y < 100) p.y = 100;
    }
}

// Draw particles
function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.fillStyle = 'red';
        ctx.fillRect(p.x, p.y, 2, 2);
    }
}

// Draw scene (cup and spoon)
function drawScene() {
    // Draw cup
    ctx.fillStyle = '#ddd';  // Light gray for the cup
    ctx.fillRect(50, 150, 300, 300);

    // Draw cup border
    ctx.strokeStyle = '#000';  // Black border
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 150, 300, 300); 

    // Draw spoon
    ctx.fillStyle = '#999';  // Gray for the spoon
    ctx.fillRect(spoonStartX, spoonY, spoonWidth, spoonHeight);
}

// Animation function
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
    drawScene();  // Draw cup and spoon
    updateParticles();  // Update particles
    drawParticles();  // Draw particles
    requestAnimationFrame(animate);  // Continue animation
}

// Change conductivity based on selected material
materialSelect.addEventListener('change', function() {
    const material = materialSelect.value;
    if (material === 'bueno') {
        conductivity = 2.0;  // Faster for good conductor (aluminum)
    } else {
        conductivity = 0.5;  // Slower for bad conductor (wood)
    }
});

// Change temperature based on slider
tempSlider.addEventListener('input', function() {
    temperature = parseInt(tempSlider.value);
    tempValue.textContent = temperature + '°C';
});

// Initialization
createParticles();
animate();
