import { allPokemon, avatar, maxTrainerPokemon, minTrainerPokemon, myPokemonKey, pokemonCount, selectedPokemon } from "../../../utils/constants.js";

import { loadBattle } from "../world_loop.js";
import { playButtonClick } from "../../../utils/music.js";
import { getRandomInt, loadImage, loadPokemonList } from "../../../utils/utilities.js";

const catchButton = document.getElementById("catch")
catchButton.disabled = true

const catchAlert = document.getElementById("pokemon_alert")

export async function setUpCatch(pokemon) {
    const color =  `var(--color-${pokemon.types[0]})`

    catchAlert.style.backgroundColor = color
    catchButton.style.backgroundColor = color

    await loadImage(catchAlert.children[0], pokemon.sprites[avatar])
    catchAlert.children[1].innerText = pokemon.name

    catchButton.disabled = false
    catchButton.innerText = "Catch This Pokemon!"

    catchButton.onclick = async () => {
        await playButtonClick()
        await loadBattle([pokemon.name])
    }
}

const trainerImages = ["trainers/1.png", "trainers/2.png", "trainers/3.png", "trainers/4.png", "trainers/5.png", "trainers/6.png", "trainers/7.png", "trainers/8.png", "trainers/9.png", "trainers/10.png"];

export async function generateRandomTrainer() {
    const count = getRandomInt(minTrainerPokemon, maxTrainerPokemon + 1)

    const pokemon = []
    for(let i = 0; i < count; i++)
        pokemon.push(getRandomInt(0, pokemonCount))

    await loadImage(catchAlert.children[0], trainerImages[getRandomInt(0, 10)])
    catchAlert.children[1].innerText = ""

    catchButton.disabled = false
    catchButton.innerText = "Fight This Trainer!"

    catchButton.onclick = async () => {
        await playButtonClick()
        await loadBattle(pokemon)
    }
}

export function clearCatch() {
    catchButton.disabled = true

    catchAlert.children[0].src = ""
    catchAlert.children[1].innerText = ""
}

const localPokemonData = JSON.parse(localStorage.getItem(myPokemonKey))

const allNames = localPokemonData[allPokemon]
const selected = localPokemonData[selectedPokemon]

const all = await loadPokemonList(allNames)

async function toggleSelectPokemon(name, avatar) {
    if(selected.indexOf(name) < 0) {
        if(selected.length === 6)
            return

        selected.push(name)
        avatar.style.borderColor = "black"

        await playButtonClick()
    }
    else {
        if(selected.length === 1)
            return

        selected.splice(selected.indexOf(name), 1)
        avatar.style.borderColor = "transparent"

        await playButtonClick()
    }

    localStorage.setItem(myPokemonKey, JSON.stringify({
        [allPokemon] : allNames,
        [selectedPokemon]: selected
    }))
}

const pokemonSelect = document.getElementById("pokemon_select")
export async function setUpPokemonSelect() {
    const rows = all.length % 3 > 0 ? Math.floor(all.length / 3) + 1 : Math.floor(all.length / 3)

    for(let i = 0; i < rows; i++) {
        const row = document.createElement("div")

        row.classList.add("row")
        row.classList.add("pokemon_avatar_container")

        for(let k = 0; k < 3 && (i * 3 + k) < all.length; k++) {
            const pokemon = all[i * 3 + k]

            const pokemonAvatar = document.createElement("div")
            pokemonAvatar.classList.add("row")
            pokemonAvatar.classList.add("pokemon_avatar")

            pokemonAvatar.onclick = () => {
                toggleSelectPokemon(pokemon.name, pokemonAvatar).then()
            }

            pokemonAvatar.style.backgroundColor = `var(--color-${pokemon.types[0]})`

            const image = document.createElement("img")
            image.src = pokemon.sprites[avatar]

            if (selected.indexOf(pokemon.name) >= 0)
                pokemonAvatar.style.borderColor = "black"

            pokemonAvatar.appendChild(image)
            row.appendChild(pokemonAvatar)
        }

        pokemonSelect.appendChild(row)
    }
}