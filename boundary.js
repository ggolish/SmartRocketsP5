
class Boundary {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.reward = 0.1;
    }

    show() {
        fill(255);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }
}

class Target extends Boundary {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.reward = 10;
        this.v = createVector(x + this.width / 2, y + this.height / 2);
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this.v.x = x;
        this.v.y = y;
    }
}
