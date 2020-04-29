import Vector from './vector.js';

export default class Boid {
    constructor (init_pos, docroot) {
        this.pos = init_pos;
        this.vel = new Vector();
        this._element = docroot.createElement('div');
        this._element.classList.add('boid');
        let random_col = `hsl(${Math.floor(Math.random()*360)},100%,50%)`;
        let filter = `drop-shadow(0px 0px 10px ${random_col})`;
        this._element.style.borderBottomColor = random_col;
        this._element.style.filter = filter;
        docroot.body.appendChild(this._element);
        this.draw();
    }
    update_pos() {
        this.pos = Vector.add(this.vel, this.pos);
    }
    set update_vel(v) {
        this.vel = Vector.add(this.vel, v);
    }
    draw() {
        this._element.style.left = this.pos.x + 'px';
        this._element.style.top = this.pos.y + 'px';
    }
}