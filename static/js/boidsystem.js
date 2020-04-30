import Boid from './boid.js';
import Vector from './vector.js';

export default class BoidSystem {
    constructor(docroot) {
        this.flock_time_ratio = 0.95;
        this.tickrate = 20;
        this.flock_radius = 200;
        this.boid_radius = 30;
        this.boids = [];
        this.mouse = new Vector();
        this._mouse_el = docroot.getElementById('mouse');
        this.docroot = docroot;
        this.docroot.addEventListener('click', this.append.bind(this));
        this.docroot.addEventListener('mousemove', this.update_mouse.bind(this));
        this.tick();
    }
    update_mouse(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
        this._mouse_el.style.left = event.clientX + 'px';
        this._mouse_el.style.top = event.clientY + 'px';
    }
    append(event) {
        let pos = new Vector(event.clientX, event.clientY);
        let boid = new Boid(pos, this.docroot);
        this.boids.push(boid);
    }
    tick() {
        for (let boid of this.boids) {
            // Chase the mouse
            let mf = this.chase_mouse(boid);
            mf.mul(1/800.0);
            boid.update_vel = mf;

            // Move towards percieved center
            let pc = this.percieved_center(boid);
            pc.mul(1/400.0);
            boid.update_vel = pc;

            // Avoid collisions
            let av = this.avoid(boid);
            av.mul(1/(40.0*(boid.lifetime > 1000*this.flock_time_ratio ? 8 : 1)));
            boid.update_vel = av;

            // Move with flock
            let fv = this.flock(boid);
            fv.mul(1/40.0);
            boid.update_vel = fv;

            // Cap velocity
            let v = boid.vel.magnitude();
            if (v > 5) boid.vel.mul(5/v);

            // Bound the boid to screen
            this.bound(boid);
        }
        for (let boid of this.boids) {
            boid.lifetime += 1;
            boid.lifetime %= 1000;
            // Update positions and redraw
            boid.add_vel();
            boid.draw();
        }
        setTimeout(this.tick.bind(this), this.tickrate);
    }
    chase_mouse(boid) {
        let mf = new Vector();
        if (Vector.distance(boid.pos, this.mouse) < this.flock_radius) {
            mf = Vector.subtract(this.mouse, boid.pos);
        }
        return mf;
    }
    percieved_center(boid) {
        let pc = new Vector();
        if (this.boids.length < 2 || boid.lifetime > 1000*this.flock_time_ratio) return pc;
        let n = 0;
        for (let b of this.boids) {
            if (b !== boid) {
                if (Vector.distance(boid.pos, b.pos) < this.flock_radius) {
                    pc = Vector.add(pc, b.pos);
                    n += 1;
                }
            } 
        }
        if (n <= 0) return pc;
        pc.mul(1.0/n);
        pc = Vector.subtract(pc, boid.pos);
        return pc;
    }
    avoid(boid) {
        let av = new Vector();
        if (this.boids.length < 2) return av;
        for (let b of this.boids) {
            if (b !== boid) {
                if (Vector.distance(boid.pos, b.pos) < this.boid_radius*(boid.lifetime > 1000*this.flock_time_ratio ? 4 : 1)) {
                    av = Vector.subtract(av, Vector.subtract(b.pos, boid.pos));
                }
            } 
        }
        return av;
    }
    flock(boid) {
        let fv = new Vector();
        if (this.boids.length < 2) return fv;
        let n = 0;
        for (let b of this.boids) {
            if (b !== boid) {
                if (Vector.distance(boid.pos, b.pos) < this.flock_radius) {
                    fv = Vector.add(fv, b.vel);
                    n += 1;
                }
            } 
        }
        if (n <= 0) return fv;
        fv.mul(1.0/n);
        return fv;
    }
    bound(boid) {
        if (boid.pos.x > window.innerWidth) {
            boid.vel.x = -2.0;
        }
        else if (boid.pos.x < 0) {
            boid.vel.x = +2.0;
        }
        if (boid.pos.y > window.innerHeight) {
            boid.vel.y = -2.0;
        }
        else if (boid.pos.y < 0) {
            boid.vel.y = +2.0;
        }
    }
}