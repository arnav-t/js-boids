export default class Vector { 
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static add(a, b) {
        return this(a.x + b.x, a.y + b.y);
    }
    static subtract(a, b) {
        return this(a.x + b.x, a.y + b.y);
    }
    static distance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
}