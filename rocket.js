
class Rocket {
    constructor(x, y, forces) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.setMag(0.1);
        this.acc = createVector();
        this.forces = forces;
        this.forceCounter = 0;

        this.width = 2.5;
        this.height = 15;

        this.fitness = 0;
        this.timeAlive = 0;
        
        this.finished = false;
        this.crashed = false;
    }

    update() {
        if(!this.finished && !this.crashed) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);

            if(this.forceCounter < this.forces.length) {
                this.applyForce(this.forces[this.forceCounter++]);
            }

            if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height ||
                    this.pos.y < 0) {
                this.crashed = true;
                this.fitness *= 0.1;
            }

            this.timeAlive++;
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    collides(boundary) {
        if(this.crashed) return;
        if(boundary.collidesWith(this.pos.x, this.pos.y)) {
            this.finised = true;
            this.crashed = true;
            this.fitness *= boundary.reward + boundary.reward * (1 / this.timeAlive);
        }
    }

    show(maxFit) {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        rectMode(CENTER);
        fill(color(map(this.fitness, 0, maxFit, 0, 255), 50, 100, 150), 150);
        noStroke();
        rect(0, 0, this.height, this.width);
        pop();
    }
}
