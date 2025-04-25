import { active, gif, inactive } from "../../../utils/constants.js";
import { loadImage, capitalise } from "../../../utils/utilities.js";

const buttons = []
export function attackButtonsInit(onAttackButtonClick) {
    const attackStr = "attack"

    for(let i = 0; i < 4; i++)
    {
        const button = document.getElementById(attackStr + (i + 1))
        button.dataset.status = active

        button.onclick = async () => {
            if(button.dataset.status === active)
                await onAttackButtonClick(i)
        }

        buttons.push(button)
    }
}

export function initAttacks(pokemon) {
    const moves = pokemon.moves

    for(let i = 0; i < moves.length; i++)
    {
        const move = moves[i]
        const button = buttons[i]

        const background = button.children[0]
        background.style.backgroundColor = `var(--color-${move.type})`

        const titleContainer = background.children[0]
        titleContainer.children[0].innerText = move.name
        titleContainer.children[1].children[0].innerText = `${move.type} type attack`

        button.children[1].children[0].innerText = move.power

        button.dataset.status = active
    }

    for(let i = moves.length; i < buttons.length; i++)
    {
        const button = buttons[i]

        const titleContainer = button.children[0].children[0]
        titleContainer.children[0].innerText = ""
        titleContainer.children[1].children[0].innerText = ""

        button.children[1].children[0].innerText = ""

        buttons[i].dataset.status = inactive
    }
}

export function toggleAttacks(moveCount, disabled) {
    const state = disabled ? inactive : active

    for(let i = 0; i < moveCount; i++)
        buttons[i].dataset.status = state

    for(let i = moveCount; i < buttons.length; i++)
        buttons[i].dataset.status = inactive
}

const selection_options = []
const selection_parent = document.getElementById('pokemon_select')

export async function initSelection(pokemonList, onPokemonSelect) {
    for(let i = 0; i < pokemonList.length; i++) {
        const node = document.createElement("div")
        node.classList.add("pokemon_card")
        node.dataset.status = active

        const image = document.createElement("img")
        image.src = pokemonList[i].sprites[gif]
        node.appendChild(image)

        const heading = document.createElement("h3")
        heading.innerText = pokemonList[i].name
        node.appendChild(heading)

        node.onclick = async () => {
            if(node.dataset.status === active)
                await onPokemonSelect(i + 4)
        }

        selection_parent.appendChild(node)
        selection_options.push(node)
    }
}

const knockOut = "knock"

export async function manageSelection(pokemonList, currentIndex) {
    for(let i = 0; i < pokemonList.length; i++) {
        const current = selection_options[i]

        if(pokemonList[i].health <= 0)
            current.dataset.status = knockOut
        else if(i === currentIndex)
            current.dataset.status = inactive
        else
            current.dataset.status = active
    }
}

export function disableSelection() {
    for(let i = 0; i < selection_options.length; i++)
        selection_options[i].dataset.status = inactive
}

const pokeBalls = []
const player2PokeBalls = document.getElementById('player_poke_balls')
export async function pokeBallsInit(count) {
    for(let i = 0; i < count; i++) {
        const pokeBall = document.createElement("img")
        pokeBall.src = "ui/poke_ball.png"

        player2PokeBalls.appendChild(pokeBall)
        pokeBalls.push(pokeBall)
    }
}

export async function managePokeBalls(pokemon) {
    for(let i = 0; i < pokemon.length; i++) {
        if(pokemon[i].health <= 0)
            pokeBalls[i].src = "ui/poke_ball-disabled.png"
    }
}

const back_to_home = document.getElementById('back_to_home')
export function backToHomeInit(onGoHomeClick) {
    back_to_home.onclick = async () => {
        await onGoHomeClick()
    }
}

const log = document.getElementById('log')
const logParent = log.parentElement
const logIndexes = [ "good_for_player", "bad_for_player", "knock_out" ]

export function pushLog(message, index) {
    const node = document.createElement("li");
    node.innerText = message
    node.classList.add(logIndexes[index])

    log.appendChild(node)
    logParent.scrollTop = logParent.scrollHeight
}

const evolutionTab = document.getElementById("pokemon_evolve")
evolutionTab.style.display = "none"

const evolve = document.getElementById("evolve")
const dontEvolve = document.getElementById("dont_evolve")

export async function showEvolutionInit(pokemon, evolution, onSelectEvolve, onDeselectEvolve) {
    evolutionTab.style.backgroundColor = `var(--color-${pokemon.types[0]})`

    const heading = evolutionTab.children[0].children[0]
    heading.innerHTML = `${capitalise(pokemon.name)} is ready to evolve into ${capitalise(evolution.name)}!`

    const img = evolutionTab.children[0].children[1]

    await loadImage(img, evolution.sprites[gif])
    await loadImage(img, pokemon.sprites[gif])

    img.dataset.status = inactive

    evolve.onclick = async () => {
        evolve.disabled = true
        dontEvolve.disabled = true

        img.dataset.status = active
        await new Promise(r => setTimeout(r, 2000))

        img.style.display = "none"
        img.dataset.status = inactive
        await loadImage(img, evolution.sprites[gif])

        evolutionTab.style.backgroundColor = `var(--color-${evolution.types[0]})`
        img.style.display = "block"

        heading.innerHTML = `${capitalise(pokemon.name)} has evolved into ${capitalise(evolution.name)}!`

        await onSelectEvolve()

        setTimeout(() => {
            evolutionTab.style.display = "none"

            img.src = ""
            heading.innerHTML = ""
        }, 3000)
    }

    dontEvolve.onclick = async () => {
        evolutionTab.style.display = "none"

        img.src = ""
        heading.innerHTML = ""

        await onDeselectEvolve()
    }

    evolutionTab.style.display = "block"
}