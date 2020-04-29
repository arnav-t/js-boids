import Vector from './vector.js';

export default class Boid {
    constructor (init_pos) {
        this.pos = init_pos;
        this.vel = Vector();
    }
    set update_vel(v) {
        this.vel = Vector.add(this.vel, v);
    }
}