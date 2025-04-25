import { playMusic, playSFX, preLoadMusic, preLoadSFX } from "../../utils/music.js";
import { loadImage, loadPage, loadPokemonList, onWindowResize } from "../../utils/utilities.js";
import { starters, gif, mainPage, myPokemonKey, allPokemonKey, selectedPokemonKey, starterMusic, clickSFX, loadSprites, loadTypes } from "../../utils/constants.js";

const body = document.getElementById("body");
const loading = document.getElementById("loading")
const warning = document.getElementById("pc_warning")

body.style.display = "none"
warning.style.display = "none"

loading.style.display = "block"

const starterParent = document.getElementById("starters")

const selected = []
const backButton = document.getElementById("home")

async function toggleStarter(index, htmlElement) {
    if(selected.indexOf(index) !== -1) {
        selected.splice(selected.indexOf(index), 1)
        htmlElement.dataset.status = "inactive"

        await playSFX(clickSFX)
    }
    else {
        if (selected.length === 6)
            return

        selected.push(index)
        htmlElement.dataset.status = "active"

        await playSFX(clickSFX)
    }

    backButton.disabled = selected.length !== 6
}

async function starterCardsInit(pokemon) {
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
            await loadImage(image, current.sprites[gif])

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
}

async function setUp() {
    onWindowResize()

    await preLoadSFX([clickSFX])
    await preLoadMusic([starterMusic])

    await playMusic(starterMusic)

    const pokemon = await loadPokemonList(starters, loadSprites | loadTypes)

    await starterCardsInit(pokemon)

    backButton.disabled = true
    backButton.onclick = async () => {
        await playSFX(clickSFX)

        const names = []
        for (let i = 0; i < selected.length; i++)
            names.push(starters[selected[i]].toLowerCase())

        localStorage.setItem(myPokemonKey, JSON.stringify({
            [allPokemonKey] : names,
            [selectedPokemonKey] : names
        }))

        await loadPage(mainPage)
    }

    body.style.display = "block"

    warning.style.display = "none"
    loading.style.display = "none"
}

window.onresize = () => {
    onWindowResize(loading, body, warning)
}

setUp().then()