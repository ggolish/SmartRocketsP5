function rotatePointX(x, y, point, a) {
    return (x - point.x) * cos(a) - (y - point.y) * sin(a);
}

function rotatePointY(x, y, point, a) {
    return (x - point.x) * sin(a) + (y - point.y) * cos(a);
}

class Boundary {
    constructor(x, y, w, h, a) {
        //a *= -(PI / 180);
        this.center = createVector(x, y);
        this.vertices = [];
        this.vertices.push(createVector(rotatePointX(x, y, this.center, a), rotatePointY(x, y, this.center, a)));
        this.vertices.push(createVector(rotatePointX(x + w, y, this.center, a), rotatePointY(x + w, y, this.center, a)))
        this.vertices.push(createVector(rotatePointX(x + w, y + h, this.center, a), rotatePointY(x + w, y + h, this.center, a)));
        this.vertices.push(createVector(rotatePointX(x, y + h, this.center, a), rotatePointY(x, y + h, this.center, a)));

        this.vertices.map(v => v.add(this.center));

        this.reward = 0.1;
    }

    show() {
        fill(255);
        noStroke();

        beginShape(QUADS);
        for(var i = 0; i < this.vertices.length; ++i) {
            vertex(this.vertices[i].x, this.vertices[i].y);
        }
        endShape(CLOSE);
    }

    collidesWith(x, y) {
        return collidePointPoly(x, y, this.vertices);
    }
}

class Target extends Boundary {
    constructor(x, y, w, h) {
        super(x, y, w, h, 0);
        this.reward = 10;
    }
}
