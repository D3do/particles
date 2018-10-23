(function init() {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let x, y, radius, distanceBetweenParticles;
  let particles = [];
  let mouse = {
    x: undefined,
    y: undefined
  }
  let lineOpacity = 0;
  const numberOfParticles = 40;
  const minRadius = 4;
  const maxRadius = 8;
  const color = '#000';
  const borderColor = '#b87692';
  const borderWidth = 4;
  const lineWidth = 2;
  const distanceToDrawLine = 100;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  class Particle {
    constructor(x, y, radius, color, borderColor, borderWidth, lineWidth) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.borderColor = borderColor;
      this.borderWidth = borderWidth;
      this.lineWidth = lineWidth;
      this.velocity = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5
      };
      this.mass = 1;
    }

    update(particles) {
      for (let i = 0; i < particles.length; i++) {
        if (this === particles[i]) continue;

        distanceBetweenParticles = distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius - particles[i].radius - this.borderWidth;

        if (distanceBetweenParticles <= 0) {
          resolveCollision(this, particles[i]);
        }

        if (distanceBetweenParticles <= distanceToDrawLine) {
          this.drawLine(this.x, this.y, particles[i].x, particles[i].y);
        }
      }

      if(this.x - this.radius <= 0
        || this.x + this.radius >= canvas.width) {
        this.velocity.x = -this.velocity.x;
      }

      if (this.y - this.radius <= 0
        || this.y + this.radius >= canvas.height) {
        this.velocity.y = -this.velocity.y;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.drawParticle();
    }

    drawParticle() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = this.borderColor;
      context.fillStyle = this.color;
      context.lineWidth = this.borderWidth;
      context.stroke();
      context.fill();
      context.closePath();
    }

    drawLine(x1, y1, x2, y2) {
      let alpha = (distanceToDrawLine - distanceBetweenParticles) / distanceToDrawLine;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.globalCompositeOperation = 'destination-over';
      context.lineWidth = this.lineWidth;
      context.strokeStyle = `rgba(156, 98, 123, ${alpha})`;
      context.stroke();
    }
  }

  function render() {
    particles = [];
    for (let i = 0; i < numberOfParticles; i++) {
      radius = randomIntFromRange(maxRadius, minRadius);
      x = randomIntFromRange(radius, canvas.width - radius);
      y = randomIntFromRange(radius, canvas.height - radius);

      if (i !== 0) {
        for (let j = 0; j < particles.length; j++) {
          if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 - borderWidth <= 0) {
            x = randomIntFromRange(radius, canvas.width - radius);
            y = randomIntFromRange(radius, canvas.height - radius);
            j = -1;
          }
        }
      }

      particles.push(new Particle(x, y, radius, color, borderColor, borderWidth,lineWidth))
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.map(particle => particle.update(particles));
  }

  render();
  animate();
})();