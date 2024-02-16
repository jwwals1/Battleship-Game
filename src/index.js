import createBoard from "./createboard"
import ships from "./ships"

const optionContainer = document.querySelector('.option-container')
const flipbutton = document.querySelector('#flip-button')
const startButton = document.querySelector('#start-button')
const infoDisplay = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')
 

createBoard('yellow', 'player')
createBoard('pink', 'computer')


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
        if (user === 'computer') addShipPiece('computer', ship, startId)
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

function dragStart(e) {
    notDropped = false
    draggedShip = e.target
}

function dragOver(e) {
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highlightArea(e.target.id, ship)
}

function dropShip(e) {
    const startId = e.target.id
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if (!notDropped) {
        draggedShip.remove()
    }
}

function highlightArea(startIndex, ship) {
    const allBoardBlocks = document.querySelectorAll('#player div')
    let isHorizontal = degree === 0  

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover')
            setTimeout(() => shipBlock.classList.remove('hover'), 500)
        })
    }
}

let gameOver = false
let playerTurn

function startGame() {
    if (playerTurn === undefined) {
        if (optionContainer.children.length != 0) {
            infoDisplay.textContent = 'Please place all your pieces first'
        } else {
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', playerMove))
            playerTurn = true
            turnDisplay.textContent = 'Your turn'
            infoDisplay.textContent = 'The game has started'
        }
    }
}

startButton.addEventListener('click', startGame)

let playerHits = []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = []

function playerMove(e) {
    if (!gameOver) {
        if (e.target.classList.contains('taken')) {
            e.target.classList.add('boom')
            infoDisplay.textContent = "You hit the computers ship"
            let classes = Array.from(e.target.classList)
            classes = classes.filter(className => className !== 'block')
            classes = classes.filter(className => className !== 'boom')
            classes = classes.filter(className => className !== 'taken')
            playerHits.push(...classes)
            checkScore('player', playerHits, playerSunkShips)
        }
        if (!e.target.classList.contains('taken')) {
            infoDisplay.textContent = 'Nothing hit this time'
            e.target.classList.add('empty')
        }
        playerTurn = false
        const allBoardBlocks = document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
        setTimeout(computerMove, 2000)
    }
}

function computerMove() {
    if (!gameOver) {
        turnDisplay.textContent = "Computer Go!"
        infoDisplay.textContent = 'The computer is thinking...'

        setTimeout(() =>{
            let randomGo = Math.floor(Math.random() * 100)
            const allBoardBlocks = document.querySelectorAll('#player div')
            
            if (allBoardBlocks[randomGo].classList.contains('taken') && 
                allBoardBlocks[randomGo].classList.contains('boom')
            ) {
                computerMove()
                return
            } else if (
                allBoardBlocks[randomGo].classList.contains('taken') &&
                !allBoardBlocks[randomGo].classList.contains('boom')
            ) {
                allBoardBlocks[randomGo].classList.add('boom')
                infoDisplay.textContent = 'The computer hit your ship!'
                let classes = Array.from(allBoardBlocks[randomGo].classList)
                classes = classes.filter(className => className !== 'block')
                classes = classes.filter(className => className !== 'boom')
                classes = classes.filter(className => className !== 'taken')
                computerHits.push(...classes)
                checkScore('computer', computerHits, computerSunkShips)
            } else {
                infoDisplay.textContent = 'Nothing hit this time'
                allBoardBlocks[randomGo].classList.add('empty')
            }
        }, 2000)

        setTimeout(() => {
            playerTurn = true
            turnDisplay.textContent = 'Your Turn'
            infoDisplay.textContent = 'Please take your turn'
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', playerMove))
        }, 4000)
    }
}

function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if (user === 'player') {
                infoDisplay.textContent = `you sunk computer's ${shipName}`
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if (user === 'computer') {
                infoDisplay.textContent = `The computer sunk your ${shipName}`
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName)
        }
    } 
    
    checkShip('destroyer', 2)
    checkShip('submarine', 3)
    checkShip('cruiser', 3)
    checkShip('battleship', 4)
    checkShip('carrier', 5)

    if (playerSunkShips.length === 5) {
    infoDisplay.textContent = 'you sunk all the computers ships. You won'
    gameOver = true
    }
    if (computerSunkShips.length === 5) {
        infoDisplay.textContent = 'The computer sunk all your ships. You lose'
        gameOver = true
    }
} 