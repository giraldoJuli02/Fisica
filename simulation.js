const canvas = document.getElementById("heatCanvas");
const ctx = canvas.getContext("2d");

        let temperature = 20;
        let conductivity = 0.5;  // Velocidad base para la madera
        let particles = [];
        const spoonStartX = 280;
        const spoonWidth = 20;
        const spoonHeight = 100;
        const spoonY = 250;

        // Función para crear partículas
        function createParticles() {
            particles = [];
            for (let i = 0; i < 200; i++) {
                particles.push({
                    x: Math.random() * 300 + 50,  // Dentro del vaso
                    y: Math.random() * 300 + 150,  // Dentro del vaso
                    speed: Math.random() * 1  // Velocidad inicial baja
                });
            }
        }

        // Actualizar velocidad de las partículas en base a la conductividad y temperatura
        function updateParticles() {
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];

                // Partículas en la región de la cuchara
                if (p.x > spoonStartX && p.x < spoonStartX + spoonWidth) {
                    p.y -= p.speed * conductivity;  // Suben más rápido en la cuchara
                } else {
                    p.y += Math.random() * 0.5;  // Baja lentamente fuera de la cuchara
                }

                // Limitar las partículas al canvas
                if (p.y > 450) p.y = 450;
                if (p.y < 150) p.y = 150;
            }
        }

        // Dibujar las partículas
        function drawParticles() {
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                ctx.fillStyle = 'red';
                ctx.fillRect(p.x, p.y, 2, 2);
            }
        }

        // Dibujar la escena (vaso y cuchara)
        function drawScene() {
            // Dibujar el vaso
            ctx.fillStyle = '#ddd';  // Color gris claro para el vaso
            ctx.fillRect(50, 150, 300, 300);

            // Dibujar el borde del vaso (opcional)
            ctx.strokeStyle = '#000';  // Borde negro
            ctx.lineWidth = 5;
            ctx.strokeRect(50, 150, 300, 300); 

            // Dibujar la cuchara
            ctx.fillStyle = '#999';  // Color gris para la cuchara
            ctx.fillRect(spoonStartX, spoonY, spoonWidth, spoonHeight);
        }

        // Función de animación
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
            drawScene();  // Dibujar vaso y cuchara
            updateParticles();  // Actualizar partículas
            drawParticles();  // Dibujar partículas
            requestAnimationFrame(animate);  // Continuar animación
        }

        // Cambiar conductividad según el material seleccionado
        materialSelect.addEventListener('change', function() {
            const material = materialSelect.value;
            if (material === 'aluminio') {
                conductivity = 2.0;  // Más rápido para buen conductor
            } else {
                conductivity = 0.5;  // Más lento para mal conductor
            }
        });

        // Cambiar la temperatura según el slider
        tempSlider.addEventListener('input', function() {
            temperature = parseInt(tempSlider.value);
            tempDisplay.textContent = temperature + '°C';
        });

        // Inicialización
        createParticles();
        animate();
