const position = 1000;

class TrafficLight {
    constructor() {
    }

    static getCurrentDistanceFor(car) {
        return position - car.position;
    }
}

module.exports = TrafficLight;
