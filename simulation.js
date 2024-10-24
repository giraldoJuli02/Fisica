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
const spoonHeadRadiusX = spoonWidth * 1.5;  // Radio X de la cabeza de la cuchara (elipse)
const spoonHeadRadiusY = spoonWidth / 2;   // Radio Y de la cabeza de la cuchara (elipse)

// Create particles
function createParticles() {
    particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * 300 + 50,  // In the cup
            y: Math.random() * 300 + 150,  // In the cup
            vx: (Math.random() - 0.5) * 2,  // Velocidad al azar
            vy: (Math.random() - 0.5) * 2,
            speed: Math.random() * 1 // Baja velocidad inicial
        });
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

// Function to check if a particle is inside the elliptical head of the spoon
function isInSpoonHead(particleX, particleY) {
    let dx = particleX - (spoonStartX + spoonWidth / 2);
    let dy = particleY - (spoonY + spoonHeight + spoonHeadRadiusY);
    return (dx * dx) / (spoonHeadRadiusX * spoonHeadRadiusX) + (dy * dy) / (spoonHeadRadiusY * spoonHeadRadiusY) <= 1;
}

// Update particles' speed based on conductivity and temperature
// Update particles' speed based on conductivity and temperature
function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Las partículas cercanas al mango de la cuchara suben por ella
        if (p.x > spoonStartX && p.x < spoonStartX + spoonWidth && p.y > spoonY && p.y < spoonY + spoonHeight) {
            p.y -= p.speed * conductivity;  // Suben más rápido alrededor del mango de la cuchara

            // Limitar el movimiento horizontal dentro del mango
            if (p.x <= spoonStartX) {
                p.x = spoonStartX;  // Limitar a la izquierda del mango
                p.vx = Math.abs(p.vx);  // Rebote hacia la derecha
            } else if (p.x >= spoonStartX + spoonWidth) {
                p.x = spoonStartX + spoonWidth;  // Limitar a la derecha del mango
                p.vx = -Math.abs(p.vx);  // Rebote hacia la izquierda
            }

            // Limitar el movimiento vertical para evitar que las partículas salgan por la parte superior
            if (p.y <= spoonY) {
                p.y = spoonY;  // Limitar al borde superior
                p.vy = Math.abs(p.vy);  // Rebote hacia abajo
            }
        }
        // Las partículas en la cabeza elíptica de la cuchara
        else if (isInSpoonHead(p.x, p.y)) {
            // Rebote dentro de la cabeza de la cuchara (zona elíptica)
            let dx = p.x - (spoonStartX + spoonWidth / 2);
            let dy = p.y - (spoonY + spoonHeight + spoonHeadRadiusY);

            // Rebote en los bordes de la elipse
            if ((dx * dx) / (spoonHeadRadiusX * spoonHeadRadiusX) + (dy * dy) / (spoonHeadRadiusY * spoonHeadRadiusY) > 0.9) {
                if (dx * dx > dy * dy) {
                    p.vx = -p.vx;  // Rebote horizontal
                } else {
                    p.vy = -p.vy;  // Rebote vertical
                }
            }
        }
        // Movimiento aleatorio en el resto del vaso
        else {
            p.x += p.vx * (temperature / 50);  // Movimiento horizontal ajustado por la temperatura
            p.y += p.vy * (temperature / 50);  // Movimiento vertical ajustado por la temperatura
        }

        // Limitar las partículas dentro del vaso, evitando que se acumulen en los bordes
        if (p.x <= 60) {
            p.vx = Math.abs(p.vx);  // Rebote hacia la derecha al tocar el borde izquierdo
        } else if (p.x >= 340) {
            p.vx = -Math.abs(p.vx);  // Rebote hacia la izquierda al tocar el borde derecho
        }

        if (p.y <= 160) {
            p.vy = Math.abs(p.vy);  // Rebote hacia abajo al tocar el borde superior
        } else if (p.y >= 440) {
            p.vy = -Math.abs(p.vy);  // Rebote hacia arriba al tocar el borde inferior
        }
    }
}


// Draw scene (cup and spoon)
function drawScene() {
    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cup
    ctx.fillStyle = '#ddd';  // Light gray for the cup
    ctx.fillRect(50, 150, 300, 300);

    // Draw cup border
    ctx.strokeStyle = '#000';  // Black border
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 150, 300, 300); 

    // Dibujar la cuchara
    ctx.fillStyle = '#999';  // Gris para la cuchara

    // Cuchara: Cabeza elíptica
    ctx.beginPath();
    ctx.ellipse(spoonStartX + spoonWidth / 2, spoonY + spoonHeight + spoonHeadRadiusY, spoonHeadRadiusX, spoonHeadRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuchara: Mango recto
    ctx.fillRect(spoonStartX, spoonY, spoonWidth, spoonHeight);  // Mango de la cuchara
}

// Animation function
function animate() {
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
