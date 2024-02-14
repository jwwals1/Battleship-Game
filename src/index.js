const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipbutton = document.querySelector('#flip-button')




let degree = 0
function flip() {
    const optionShips = Array.from(optionContainer.children)
    if (degree === 0) {
        degree = 90
    } else {
        degree = 0
    }
    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${degree}deg)`)
}

flipbutton.addEventListener('click', flip)


function createBoard(color, user) {
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game-board')
    gameBoardContainer.style.backgroundColor = color
    gameBoardContainer.id = user

    for (let i = 0; i < 100; i++) {
        const block = document.createElement('div');
        block.classList.add('block')
        block.id = i
        gameBoardContainer.append(block)
    }

    gamesBoardContainer.append(gameBoardContainer)
}

createBoard('yellow', 'player')
createBoard('pink', 'computer')


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
const destroyer = new Ship('destroyer', 5)

const ships = [carrier, battleship, cruiser, submarine, destroyer]

function addShipPiece(ship) {
    const allBoardBlocks = document.querySelectorAll('#computer div')
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = randomBoolean
    let randomStartIndex = Math.floor(Math.random() * 100)
    console.log(randomStartIndex)

    let validStart = isHorizontal ? randomStartIndex <= 100 - ship.length ? randomStartIndex :
        100 - ship.length : 
        randomStartIndex <= 100 - 10 * ship.length ? randomStartIndex : 
        randomStartIndex - ship.length * 10 + 10

    let shipBlocks = []

    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i])
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * 10])
        }
    }

    let valid

    if (isHorizontal) {
        shipBlocks.every((_shipBlock, index) => 
            valid = shipBlocks[0].id % 10 !== 10 - (shipBlocks.length - (index + 1)))
    } else {
        shipBlocks.every((_shipBlock, index) => 
            valid = shipBlocks[0].id < 90 + (10 * index + 1))
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name)
            shipBlock.classList.add('taken')
        })
    } else {
        addShipPiece(ship)
    }
}

ships.forEach(ship => addShipPiece(ship))