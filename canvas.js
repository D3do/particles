(function init() {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let x, y, radius;
  let particles = [];
  let mouse = {
    x: undefined,
    y: undefined
  }
  const numberOfParticles = 20;
  const minRadius = 2;
  const maxRadius = 8;
  const color = '#000';
  const borderColor = '#b87692';
  const lineWidth = 4;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  class Particle {
    constructor(x, y, radius, color, borderColor, lineWidth) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.borderColor = borderColor;
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

        if (distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 - lineWidth <= 0) {
          resolveCollision(this, particles[i]);
        }
      }

      if(this.x - this.radius <= 0
         || this.x + this.radius >= canvas.width) {
        this.velocity.x = -this.velocity.x;
      }

      if(this.y - this.radius <= 0
         || this.y + this.radius >= canvas.height) {
        this.velocity.y = -this.velocity.y;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.draw();
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.strokeStyle = this.borderColor;
      context.fillStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
      context.fill();
      context.closePath();
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
          if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 - lineWidth <= 0) {
            x = randomIntFromRange(radius, canvas.width - radius);
            y = randomIntFromRange(radius, canvas.height - radius);
            j = -1;
          }
        }
      }
      
      particles.push(new Particle(x, y, radius, color, borderColor, lineWidth))
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