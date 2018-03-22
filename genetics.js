
class Genetics {
    constructor(popSz, chromoSz, minGene, maxGene, crossRate, mutRate, anomRate) {
        this.popSz = popSz;
        this.chromoSz = chromoSz;
        this.minGene = minGene;
        this.maxGene = maxGene;
        this.crossRate = crossRate;
        this.mutRate = mutRate;
        this.anomRate = anomRate;

        this.fitnesses = [];
        this.population = this.newPopulation();
        this.maxFit = 0;

        this.generation = 1;
        this.muts = 0;
        this.crosses = 0;
        this.anoms = 0;

        this.mutsTotal = 0;
        this.crossesTotal = 0;
        this.anomsTotal = 0;

        this.mutsRate = 0.0;
        this.crossesRate = 0.0;
        this.anomsRate = 0.0;
    }

    newPopulation() {
        var pop = [];
        for(var i = 0; i < this.popSz; ++i) {
            pop[i] = this.newChromosome();
        }
	return pop;
    }

    newChromosome() {
        var chromo = [];
        for(var i = 0; i < this.chromoSz; ++i) {
            chromo[i] = this.newGene();
        }
        return chromo;
    }

    newGene() {
        var x = random(this.minGene, this.maxGene);
        var y = random(this.minGene, this.maxGene);
        var force = createVector(x, y);
        return force;
    }

    repopulate() {
        var newPop = [];
        this.muts = 0;
        this.crosses = 0;
        this.anoms = 0;
        this.mutsTotal = 0;
        this.crossesTotal = 0;
        this.anomsTotal = 0;

        // Calculate max fitness
        this.maxFit = 0;
        for(var i = 0; i < this.fitnesses.length; ++i) {
            if(this.fitnesses[i] > this.maxFit)
                this.maxFit = this.fitnesses[i];
        }

        if(this.maxFit <= 0) return;

        while(newPop.length < this.population.length) {
            var prob = random(0, 1);
            this.anomsTotal++;
            if(prob < this.anomRate) {
                this.anoms++;
                var c1 = this.newChromosome();
                var c2 = this.newChromosome();
            } else {
                var c1 = this.choose();
                var c2 = this.choose();
                this.crossover(c1, c2);
                this.mutate(c1);
                this.mutate(c2);
            }
            newPop.push(c1);
            newPop.push(c2);
        }

        this.population = newPop;
        this.generation++;
        this.mutsRate = (this.muts / this.mutsTotal) * 100;
        this.crossesRate = (this.crosses / this.crossesTotal) * 100;
        this.anomsRate = (this.anoms / this.anomsTotal) * 100;
    }

    choose() {
        while(true) {
            var index = round(random(0, this.popSz - 1));
            var prob = random(0, this.maxFit);
            if(prob < this.fitnesses[index])
                return this.population[index].slice();
        }
    }

    crossover(c1, c2) {
        var prob = random(0, 1);
        this.crossesTotal++;
        if(prob < this.crossRate) {
            this.crosses++;
            var crossPoint = round(random(0, this.chromoSz - 1));
            for(var i = 0; i < this.chromoSz; ++i) {
                if(i < crossPoint)
                    c2[i] = c1[i];
                else
                    c1[i] = c2[i];
            }
        }
    }

    mutate(c) {
        for(var i = 0; i < this.chromoSz; ++i) {
            var prob = random(0, 1);
            this.mutsTotal++;
            if(prob < this.mutRate) {
                this.muts++;
                c[i] = this.newGene();
            }
        }
    }
}
