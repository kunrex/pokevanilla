import { avatar } from "../../../utils/constants.js";
import { getRandomInt, loadImage } from "../../../utils/utilities.js";

const pokemonSelect = document.getElementById("pokemon_select")

export async function pokemonSelectInit(allPokemon, selectedPokemon, onPokemonSelect) {
    const rows = allPokemon.length % 3 > 0 ? Math.floor(allPokemon.length / 3) + 1 : Math.floor(allPokemon.length / 3)

    for(let i = 0; i < rows; i++) {
        const row = document.createElement("div")

        row.classList.add("row")
        row.classList.add("pokemon_avatar_container")

        for(let k = 0; k < 3 && (i * 3 + k) < allPokemon.length; k++) {
            const pokemon = allPokemon[i * 3 + k]

            const pokemonAvatar = document.createElement("div")
            pokemonAvatar.classList.add("row")
            pokemonAvatar.classList.add("pokemon_avatar")

            pokemonAvatar.onclick = async () => {
                pokemonAvatar.style.borderColor = await onPokemonSelect(pokemon.name) ? "black" : "transparent"
            }

            pokemonAvatar.style.backgroundColor = `var(--color-${pokemon.types[0]})`

            const image = document.createElement("img")
            image.src = pokemon.sprites[avatar]

            if (selectedPokemon.indexOf(pokemon.name) >= 0)
                pokemonAvatar.style.borderColor = "black"

            pokemonAvatar.appendChild(image)
            row.appendChild(pokemonAvatar)
        }

        pokemonSelect.appendChild(row)
    }
}

const battleButton = document.getElementById("battle")
const catchAlert = document.getElementById("pokemon_alert")

battleButton.disabled = true

export function clearBattle() {
    battleButton.disabled = true

    catchAlert.children[0].src = ""
    catchAlert.children[1].innerText = ""
}

export async function catchSetup(pokemon, onTryCatch) {
    const color =  `var(--color-${pokemon.types[0]})`

    catchAlert.style.backgroundColor = color
    battleButton.style.backgroundColor = color

    await loadImage(catchAlert.children[0], pokemon.sprites[avatar])
    catchAlert.children[1].innerText = pokemon.name

    battleButton.disabled = false
    battleButton.innerText = "Catch This Pokemon!"

    battleButton.onclick = async () => {
        await onTryCatch()
    }
}

const trainerImages = [ "trainers/1.png", "trainers/2.png", "trainers/3.png", "trainers/4.png", "trainers/5.png", "trainers/6.png", "trainers/7.png", "trainers/8.png", "trainers/9.png", "trainers/10.png" ]

export async function trainerSetup(pokemon, onTryFight) {
    await loadImage(catchAlert.children[0], trainerImages[getRandomInt(0, 10)])
    catchAlert.children[1].innerText = ""

    battleButton.disabled = false
    battleButton.innerText = "Fight This Trainer!"

    battleButton.onclick = async () => {
        await onTryFight()
    }
}