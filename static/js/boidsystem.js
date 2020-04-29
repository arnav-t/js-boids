import Boid from './boid.js';
import Vector from './vector.js';

export default class BoidSystem {
    constructor(docroot) {
        this.tickrate = 20;
        this.boids = [];
        this.docroot = docroot;
        this.docroot.addEventListener('click', this.append.bind(this));
        this.tick();
    }
    append(event) {
        let pos = new Vector(event.clientX, event.clientY);
        let boid = new Boid(pos, this.docroot);
        this.boids.push(boid);
    }
    tick() {
        for (let boid of this.boids) {
            // Move towards percieved center
            let pc = this.percieved_center(boid);
            pc.mul(1/400.0);
            boid.update_vel = pc;

            // Avoid collisions
            let av = this.avoid(boid);
            av.mul(1/10.0);
            boid.update_pos = av;

            // Move with flock
            let fv = this.flock(boid);
            fv.mul(1/40.0);
            boid.update_vel = fv;

            // Cap velocity
            let v = boid.vel.magnitude();
            if (v > 5) boid.vel.mul(5/v);
        }
        for (let boid of this.boids) {
            boid.add_vel();
            boid.draw();
        }
        setTimeout(this.tick.bind(this), this.tickrate);
    }
    percieved_center(boid) {
        let pc = new Vector();
        if (this.boids.length < 2) return pc;
        for (let b of this.boids) {
            if (b !== boid) {
                pc = Vector.add(pc, b.pos);
            } 
        }
        pc.mul(1.0/(this.boids.length - 1));
        pc = Vector.subtract(pc, boid.pos);
        return pc;
    }
    avoid(boid) {
        let av = new Vector();
        if (this.boids.length < 2) return av;
        for (let b of this.boids) {
            if (b !== boid) {
                if (Vector.distance(boid.pos, b.pos) < 20) {
                    av = Vector.subtract(av, Vector.subtract(b.pos, boid.pos));
                }
            } 
        }
        return av;
    }
    flock(boid) {
        let fv = new Vector();
        if (this.boids.length < 2) return fv;
        for (let b of this.boids) {
            if (b !== boid) {
                fv = Vector.add(fv, b.vel);
            } 
        }
        fv.mul(1.0/(this.boids.length - 1));
        return fv;
    }
}