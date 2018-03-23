
var nrockets = 800;
var lifeTime;
var forceLimit = 0.15;
var crossRate = 0.7;
var mutRate = 0.01;
var anomRate = 0.1;

var targetSize = 15;
var boundIntersection = 30;

var rockets = [];
var genetics;
var bestRocket = 0;

var boundaries = [];
var from;

function setup() {
    createCanvas(window.innerWidth - 20, window.innerHeight - 20);
    lifeTime = window.innerHeight;
    genetics = new Genetics(nrockets, lifeTime, -forceLimit, forceLimit, crossRate, mutRate, anomRate);
    newRockets();

    boundaries[0] = new Target(width / 2 - 5, height * 0.1, targetSize, targetSize);
}

function draw() {
    background(0);

    for(var i = 0; i < rockets.length; ++i) {
        rockets[i].update();

        for(var j = 0; j < boundaries.length; ++j) {
            rockets[i].collides(boundaries[j]);
        }

        rockets[i].show(rockets[bestRocket].fitness);
    }

    for(var i = 0; i < boundaries.length; ++i) {
        boundaries[i].show();
    }

    if(mouseIsPressed) {
        stroke(255);
        line(from.x, from.y, mouseX, mouseY);
    }

    calcFitnesses();
    displayStatus();

    if(frameCount % lifeTime == 0) {
        genetics.repopulate();
        newRockets();
    }
}

function displayStatus() {
    fill(255);
    textFont("Monospace");
    text(" Generation: " + genetics.generation, 10, 20);
    text("  Anomalies: " + genetics.anomsRate.toFixed(2) + "%", 10, 35);
    text(" Crossovers: " + genetics.crossesRate.toFixed(2) + "%", 10, 50);
    text("  Mutations: " + genetics.mutsRate.toFixed(2) + "%", 10, 65);
    text("Frames Left: " + (lifeTime - (frameCount % lifeTime)), 10, 80);
}   

function newRockets() {
    rockets = []
    for(var i = 0; i < nrockets; ++i)
        rockets.push(new Rocket(width / 2, height - 50, genetics.population[i]))
}

function calcFitnesses() {
    genetics.fitnesses = [];
    var maxFit = 0;
    for(var i = 0; i < rockets.length; ++i) {
        if(!rockets[i].crashed && !rockets[i].finished) {
            var distance = rockets[i].pos.dist(boundaries[0].v);
            rockets[i].fitness = 1 / distance;
            if(rockets[i].fitness > maxFit) {
                maxFit = rockets[i].fitness;
                bestRocket = i;
            }
        }
    }

    rockets.map(function(e) {
        if(!e.crashed && !e.finished) {
            e.fitness /= maxFit;
        }
    });

    for(var i = 0; i < rockets.length; ++i) {
        genetics.fitnesses.push(rockets[i].fitness);
    }
}

function keyTyped() { 
    if(key == ' ') {
        genetics = new Genetics(nrockets, lifeTime, -forceLimit, forceLimit, crossRate, mutRate, anomRate);
        newRockets();
    }
}

function mousePressed() {
    from = createVector(mouseX, mouseY);
}

function mouseReleased() {
    fromTo = createVector(mouseX - from.x, mouseY - from.y);
    d = fromTo.mag();
    var x = (mouseX < from.x) ? mouseX : from.x;
    var y = (mouseX < from.x) ? mouseY : from.y;
    boundaries.push(new Boundary(x, y, d, 10));
}
