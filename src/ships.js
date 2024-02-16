class Ship {
    constructor(name, length) {
        this.name = name
        this.length = length
    }
}

const carrier = new Ship('carrier', 5)
const battleship = new Ship('battleship', 4)
const cruiser = new Ship('cruiser', 3)
const submarine = new Ship('submarine', 3)
const destroyer = new Ship('destroyer', 2)

const ships = [carrier, battleship, cruiser, submarine, destroyer]

export default ships
