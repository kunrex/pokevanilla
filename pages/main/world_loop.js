import { playMainMusic, playMoveSound } from "../../music.js";
import { getRandomInt, loadPage, loadPokemonList } from "../../utilities.js";
import { battleBackground, battlePage, battlePokemon, battle, starterMusic } from "../../constants.js";

import { canMove, maskIndex } from "./worlds/collision.js";
import {clearCatch, setUpPokemonSelect, setUpCatch, generateRandomTrainer} from "./scripts/controls.js";
import { gridWidth, gridHeight, conversionRatio, clearRect, drawWorld, drawPlayer, loadAllWorlds } from "./scripts/draw.js";

export async function loadBattle(pokemonNames) {
    actions.push(pokemonNames)
}

const body = document.getElementById("body")
const loading = document.getElementById("loading")

body.style.display = "none"

const grassLandPokemon = []
const watersEdgePokemon = []

async function loadPokemonFromHabitat(url, collection) {
    const response = await fetch(url)
    if (!response.ok)
        return

    const json = await response.json()
    const allPokemon = json["pokemon_species"]

    const names = []
    for(let i = 0; i < allPokemon.length; i++)
        names.push(allPokemon[i].name)

    const pokemon = await loadPokemonList(names)
    for(let i = 0; i < pokemon.length; i++)
        collection.push(pokemon[i])
}

async function generateRandomPokemon(x, y) {
    const index = maskIndex(x, y)

    if (index > 0)
        await setUpCatch(grassLandPokemon[getRandomInt(0, grassLandPokemon.length)])
    else
        await setUpCatch(watersEdgePokemon[getRandomInt(0, watersEdgePokemon.length)])
}

async function generateRandomOpponent(x, y) {
    const random = getRandomInt(0, 100)
    if(random > 25)
        await clearCatch()
    else if(random > 10)
        await generateRandomPokemon(x, y)
    else
        await generateRandomTrainer()
}

const timeOut = 60
const actions = []

let standby = false
async function setup() {
    const audio = await playMainMusic(starterMusic)
    try {
        await audio.play()
    }
    catch (e) { }

    await loadAllWorlds()

    await drawWorld(0)
    await drawPlayer(0, gridWidth / 2 * conversionRatio - 4, gridHeight / 2 * conversionRatio - 4)

    await setUpPokemonSelect()

    await loadPokemonFromHabitat("https://pokeapi.co/api/v2/pokemon-habitat/grassland/", grassLandPokemon)
    await loadPokemonFromHabitat("https://pokeapi.co/api/v2/pokemon-habitat/waters-edge/", watersEdgePokemon)

    body.style.display = "block"
    loading.style.display = "none"

    document.addEventListener('keydown', async function(event) {
        if(standby)
            return

        if(event.key === 'a') {
            actions.push(0)
        }
        else if(event.key === 'd') {
            actions.push(1)
        }
        else if(event.key === 'w') {
            actions.push(2)
        }
        else if(event.key === 's') {
            actions.push(3)
        }
    });

    await gameLoop(gridWidth / 2, gridHeight / 2, 0, 0)
}

async function draw(worldIndex, spriteIndex, x, y) {
    standby = true
    clearRect()

    await drawWorld(worldIndex)
    await drawPlayer(spriteIndex, x * conversionRatio - 4, y * conversionRatio - 4)

    await generateRandomOpponent(x, y)
    standby = false
}

async function gameLoop(x, y, spriteIndex, worldIndex) {
    if(actions.length > 0) {
        const action = actions.shift()

        switch (action)
        {
            case 0:
                if(canMove(x - 1, y))
                {
                    x--
                    spriteIndex = 1
                    await playMoveSound()
                    await draw(worldIndex, spriteIndex, x, y)
                }
                break
            case 1:
                if(canMove(x + 1, y))
                {
                    x++
                    spriteIndex = 2
                    await playMoveSound()
                    await draw(worldIndex, spriteIndex, x, y)
                }
                break
            case 2:
                if(canMove(x, y - 1))
                {
                    y--
                    spriteIndex = 3
                    await playMoveSound()
                    await draw(worldIndex, spriteIndex, x, y)
                }
                break
            case 3:
                if(canMove(x, y + 1))
                {
                    y++
                    spriteIndex = 0
                    await playMoveSound()
                    await draw(worldIndex, spriteIndex, x, y)
                }
                break
            default:
                localStorage.setItem(battle, JSON.stringify({
                    [battleBackground] : maskIndex(x, y),
                    [battlePokemon]: action
                }))

                await loadPage(battlePage)
        }
    }

    setTimeout(() => { gameLoop(x, y, spriteIndex, worldIndex).then() }, timeOut)
}

setup().then()