import { loadPage, loadPokemonList } from "../../utilities.js";
import { playButtonClick, playMainMusic } from "../../music.js";
import { starters, gif, mainPage, myPokemonKey, allPokemon, selectedPokemon, starterMusic } from "../../constants.js";

const body = document.getElementById("body");
const loading = document.getElementById("loading")

body.style.display = "none"

const pokemon = await loadPokemonList(starters)

const starterParent = document.getElementById("starters")

let count = 1
function checkAllLoaded() {
    count++

    if(count === starters.length) {
        body.style.display = "block"
        loading.style.display = "none"
    }
}

for(let i = 0; i < 5; i++) {
    const row = document.createElement("div")
    row.classList.add("row")
    row.classList.add("start_card_container")

    for(let j = 0; j < 4; j++) {
        const current = pokemon[4 * i + j]

        const card = document.createElement("div")
        card.classList.add("starter_card")
        card.classList.add("column")

        const image = document.createElement("img")
        image.src = current.sprites[gif]
        image.onload = () => checkAllLoaded()

        const heading = document.createElement("h2")
        heading.innerText = current.name

        card.appendChild(image)
        card.appendChild(heading)

        row.appendChild(card)

        card.style.backgroundColor = `var(--color-${current.types[0]})`
        card.dataset.status = "inactive"
        card.onclick = async () => {
            await toggleStarter(4 * i + j, card)
        }
    }

    starterParent.appendChild(row)
}

body.style.display = "none"

const selected = []
const backButton = document.getElementById("home")

async function toggleStarter(index, htmlElement) {
    if(selected.indexOf(index) !== -1) {
        selected.splice(selected.indexOf(index), 1)
        htmlElement.dataset.status = "inactive"

        await playButtonClick()
    }
    else {
        if (selected.length === 6)
            return

        selected.push(index)
        htmlElement.dataset.status = "active"

        await playButtonClick()
    }

    backButton.disabled = selected.length !== 6
}

backButton.disabled = true
backButton.onclick = async () => {
    await playButtonClick()

    const names = []
    for (let i = 0; i < selected.length; i++)
        names.push(starters[selected[i]].toLowerCase())

    localStorage.setItem(myPokemonKey, JSON.stringify({
        [allPokemon] : names,
        [selectedPokemon] : names
    }))

    await loadPage(mainPage)
}

playMainMusic(starterMusic).then()