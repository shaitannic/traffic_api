function Auto(name) {
    this.name = name;
}

Auto.prototype = {
    get nextAuto() {
        // return автомобиль, движущийся спереди на текущем перегоне
    },

    get distanceToNextAuto() {
        // return дистанцию до впереди идущего автомобиля на текущем перегоне
    },

    get safeDistanceForCurrentSpeed() {
        // return безопасное расстояние для текущей скорости
    },

    stop: function() {
        // остановить автомобиль
    },

    toBrake: function() {
        // тормозить
    },

    toAccelerate: function() {
        // ускоряться
    }
}

module.exports = Auto;