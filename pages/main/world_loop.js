import { playMainMusic, playMoveSound } from "../../music.js";
import { getRandomInt, loadPage, loadPokemon, onWindowResize } from "../../utilities.js";
import { battleBackground, battlePage, battlePokemon, battle, starterMusic, myPokemonKey, starterPage, worldIndexKey } from "../../constants.js";

import { canMove, maskIndex } from "./worlds/collision.js";
import { clearCatch, setUpPokemonSelect, setUpCatch, generateRandomTrainer } from "./scripts/controls.js";
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

    for(let i = 0; i < allPokemon.length; i++)
        collection.push(allPokemon[i].name)
}

async function generateRandomPokemon(x, y) {
    const index = maskIndex(x, y)

    if (index > 0)
        await setUpCatch(await loadPokemon(grassLandPokemon[getRandomInt(0, grassLandPokemon.length)]))
    else
        await setUpCatch(await loadPokemon(watersEdgePokemon[getRandomInt(0, watersEdgePokemon.length)]))
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

function calculateWorldIndex(x, y) {
    return 2 * (y >= gridHeight ? 1 : 0) +  (x >= gridWidth ? 1 : 0)
}

const timeOut = 60
const actions = []

let standby = false
async function setup() {
    const pokemonData = localStorage.getItem(myPokemonKey);
    if(pokemonData === null) {
        await loadPage(starterPage)
    }

    const audio = await playMainMusic(starterMusic)
    try {
        await audio.play()
    }
    catch (e) { }

    const worldIndexData = JSON.parse(localStorage.getItem(worldIndexKey))
    const xInit = worldIndexData === null ? gridWidth / 2 : worldIndexData["x"], yInit = worldIndexData === null ? gridHeight / 2 : worldIndexData["y"]

    await loadAllWorlds()

    await draw( 0, xInit, yInit)

    await setUpPokemonSelect()

    await loadPokemonFromHabitat("https://pokeapi.co/api/v2/pokemon-habitat/grassland/", grassLandPokemon)
    await loadPokemonFromHabitat("https://pokeapi.co/api/v2/pokemon-habitat/waters-edge/", watersEdgePokemon)

    body.style.display = "block"
    loading.style.display = "none"

    document.addEventListener('keydown', async function(event) {
        if(standby)
            return

        switch (event.key) {
            case "a":
            case "ArrowLeft":
                actions.push(0)
                break
            case "d":
            case "ArrowRight":
                actions.push(1)
                break
            case "w":
            case "ArrowUp":
                actions.push(2)
                break
            case "s":
            case "ArrowDown":
                actions.push(3)
                break
        }
    })

    await gameLoop(xInit, yInit, 0, calculateWorldIndex(xInit, yInit))
}

async function draw(spriteIndex, x, y) {
    clearRect()
    const worldIndex = calculateWorldIndex(x, y)

    const quotient = Math.floor(worldIndex / 2), remainder = worldIndex % 2
    const xCanvas = (remainder === 0 ? x : x - gridWidth), yCanvas = (quotient === 0 ? y : y - gridHeight)

    await drawWorld(worldIndex)
    await drawPlayer(spriteIndex, xCanvas * conversionRatio - 4, yCanvas * conversionRatio - 4)
}

async function gameLoop(x, y, spriteIndex, worldIndex) {
    if(actions.length > 0) {
        const action = actions.shift()

        standby = true
        switch (action)
        {
            case 0:
                if(canMove(x - 1, y))
                {
                    x--
                    spriteIndex = 1
                    worldIndex = calculateWorldIndex(x, y)
                }
                break
            case 1:
                if(canMove(x + 1, y))
                {
                    x++
                    spriteIndex = 2
                    worldIndex = calculateWorldIndex(x, y)
                }
                break
            case 2:
                if(canMove(x, y - 1))
                {
                    y--
                    spriteIndex = 3
                    worldIndex = calculateWorldIndex(x, y)
                }
                break
            case 3:
                if(canMove(x, y + 1))
                {
                    y++
                    spriteIndex = 0
                    worldIndex = calculateWorldIndex(x, y)
                }
                break
            default:
                localStorage.setItem(battle, JSON.stringify({
                    [battleBackground] : maskIndex(x, y),
                    [battlePokemon]: action
                }))

                localStorage.setItem(worldIndexKey, JSON.stringify({
                    "x": x,
                    "y": y
                }))

                await loadPage(battlePage)
                break
        }

        await playMoveSound()
        await draw(spriteIndex, x, y)

        await generateRandomOpponent(x, y)

        standby = false
    }

    setTimeout(() => { gameLoop(x, y, spriteIndex, worldIndex).then() }, timeOut)
}

window.onresize = () => {
    onWindowResize(loading, body)
}

setup().then()