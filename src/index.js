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