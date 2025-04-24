import {active, gif, inactive, mainPage} from "../../../constants.js";

import { pushAction } from "../battle.js";
import { loadPage } from "../../../utilities.js";
import { playButtonClick } from "../../../music.js";

function getAttackButtons() {
    const attackStr = "attack"

    let buttons = []
    for(let i = 0; i < 4; i++)
    {
        const button = document.getElementById(attackStr + (i + 1))
        button.dataset.status = active

        button.onclick = async () => {
            if(button.dataset.status === active)
            {
                await playButtonClick()
                pushAction(i)
            }
        }

        buttons.push(button)
    }

    return buttons
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
        titleContainer.children[1].children[0].innerText = move.description

        button.dataset.status = active
        button.children[1].children[0].innerText = move.power
    }

    for(let i = moves.length; i < buttons.length; i++)
        buttons[i].dataset.status = inactive
}

export function toggleAttacks(moveCount, disabled) {
    const state = disabled ? inactive : active

    for(let i = 0; i < moveCount; i++) {
        const current = buttons[i]

        current.dataset.status = state
    }

    for(let i = moveCount; i < buttons.length; i++)
    {
        const current = buttons[i]

        current.dataset.status = "inactive"
    }
}

const log = document.getElementById('log')
const logParent = log.parentElement
const logIndexes = ["good_for_player", "bad_for_player", "knock_out"]

export function pushLog(message, index) {
    const node = document.createElement("li");
    node.innerText = message
    node.classList.add(logIndexes[index])

    logParent.scrollTop = logParent.scrollHeight

    log.appendChild(node);
}

const buttons = getAttackButtons()

const selection_options = []
const selection_parent = document.getElementById('pokemon_select')

export async function initSelection(pokemonList) {
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
            {
                await playButtonClick()
                pushAction(i + 4)
            }
        }

        selection_parent.appendChild(node)
        selection_options.push(node)
    }
}

export async function manageSelection(pokemonList, currentIndex) {
    for(let i = 0; i < pokemonList.length; i++) {
        const current = selection_options[i]

        if(pokemonList[i].health <= 0  || i === currentIndex)
            current.dataset.status = inactive
        else
            current.dataset.status = active
    }
}

export function disableSelection() {
    for(let i = 0; i < selection_options.length; i++)
        selection_options[i].dataset.status = inactive
}

const back_to_home = document.getElementById('back_to_home')
back_to_home.onclick = async () => {
    await loadPage(mainPage)
}


const pokeBalls = []
const player2PokeBalls = document.getElementById('player_poke_balls')
export async function pokeBallsInit(count) {
    for(let i = 0; i < count; i++) {
        const pokeBall = document.createElement("img")
        pokeBall.src = "ui/pokeball.png"

        player2PokeBalls.appendChild(pokeBall)
        pokeBalls.push(pokeBall)
    }
}

export async function managePokeBalls(pokemon) {
    for(let i = 0; i < pokemon.length; i++) {
        if(pokemon[i].health <= 0)
            pokeBalls[i].src = "ui/pokeball-disabled.png"
    }
}