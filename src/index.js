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
const destroyer = new Ship('destroyer', 2)

const ships = [carrier, battleship, cruiser, submarine, destroyer]
let notDropped

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
    let validStart = isHorizontal ? startIndex <= 100 - ship.length ? startIndex :
        100 - ship.length : 
        startIndex <= 100 - 10 * ship.length ? startIndex : 
        startIndex - ship.length * 10 + 10

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

    return {shipBlocks, valid, notTaken}


}

function addShipPiece(user, ship, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`)
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = user === 'player' ? degree === 0 : randomBoolean
    let randomStartIndex = Math.floor(Math.random() * 100)

    let startIndex = startId ? startId : randomStartIndex

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name)
            shipBlock.classList.add('taken')
        })
    } else {
        if (user === 'computer') addShipPiece(user, ship, startId)
        if (user === 'player') notDropped = true
    }
}

ships.forEach(ship => addShipPiece('computer', ship))

let draggedShip
const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

const allPlayerBlocks = document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver)
    playerBlock.addEventListener('drop', dropShip)
})

function dragStart(event) {
    notDropped = false
    draggedShip = event.target
}

function dragOver(event) {
    event.preventDefault()
}

function dropShip(event) {
    const startId = event.target.id
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if (!notDropped) {
        draggedShip.remove()
    }
}