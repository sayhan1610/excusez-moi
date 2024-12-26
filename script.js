document.getElementById("generateBtn").addEventListener("click", generateExcuse);
document.getElementById("excuseOutput").addEventListener("click", copyExcuse);

async function fetchJson(file) {
    const response = await fetch(file);
    return response.json();
}

let generatedExcuse = ''; // Store the generated excuse text

async function generateExcuse() {
    try {
        const outputElement = document.getElementById("excuseOutput");
        outputElement.innerHTML = "";

        const [verbs, nouns] = await Promise.all([
            fetchJson("verbs.json"),
            fetchJson("nouns.json")
        ]);

        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const randomNoun1 = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNoun2 = nouns[Math.floor(Math.random() * nouns.length)];

        generatedExcuse = `My ${randomNoun1} ${randomVerb} my ${randomNoun2}.`; // Save the generated excuse

        typeWriter(generatedExcuse, outputElement, 0);
    } catch (error) {
        console.error("Error generating excuse:", error);
        document.getElementById("excuseOutput").innerText = "Something went wrong!";
    }
}

function typeWriter(text, element, i) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(text, element, i + 1), 100); // Adjust typing speed here (100ms)
    }
}

function copyExcuse() {
    if (generatedExcuse) {
        navigator.clipboard.writeText(generatedExcuse).then(() => {
            alert('Excuse copied to clipboard!');
        }).catch(err => {
            console.error('Error copying to clipboard: ', err);
        });
    } else {
        alert('No excuse to copy!');
    }
}

const canvas = document.createElement("canvas");
canvas.id = "nodeCanvas";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const maxParticles = 120;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      const distance =
        (particles[i].x - particles[j].x) ** 2 +
        (particles[i].y - particles[j].y) ** 2;

      if (distance < 20000) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 20000})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

function init() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}

init();
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

