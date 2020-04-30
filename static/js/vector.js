export default class Vector { 
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    magnitude() {
        // Euclidean distance
        //return Math.sqrt(this.x*this.x + this.y*this.y);

        // Manhattan distance
        return Math.abs(this.x) + Math.abs(this.y);
    }
    static add(a, b) {
        return new this(a.x + b.x, a.y + b.y);
    }
    static subtract(a, b) {
        return new this(a.x - b.x, a.y - b.y);
    }
    static distance(a, b) {
        // Euclidiean distance
        //return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        
        // Manhattan distance
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
}