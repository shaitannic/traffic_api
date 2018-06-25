const MIN = 1;
const MAX = 100;

class RandomHelper {
    static canBeSelected(value) {
        let randomInt = this.getRandomInt();
        return randomInt < value;
    }

    getRandomInt() {
        return Math.floor(Math.random() * (MAX - MIN)) + MIN;
    }
}

module.exports = RandomHelper;
