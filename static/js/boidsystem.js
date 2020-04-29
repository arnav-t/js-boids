import Boid from './boid.js';
import Vector from './vector.js';

export default class BoidSystem {
    constructor(docroot) {
        this.boids = [];
        this.docroot = docroot;
        this.docroot.addEventListener('click', this.append.bind(this));
    }
    append(event) {
        let pos = new Vector(event.clientX, event.clientY);
        let boid = new Boid(pos, this.docroot);
        this.boids.push(boid);
    }
}