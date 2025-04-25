import { playMusic, playSFX, preLoadMusic, preLoadSFX } from "../../utils/music.js";
import { getRandomInt, loadPage, loadPokemon, loadPokemonList, onWindowResize } from "../../utils/utilities.js";
import { battlePage, battlePokemon, battleKey, starterMusic, myPokemonKey, starterPage, worldIndexKey, terrainIndexes, worldRequests, wtr, sea, clickSFX, minTrainerPokemon, maxTrainerPokemon, pokemonCount, loadTypes, loadSprites, moveSFX, allPokemonKey, selectedPokemonKey } from "../../utils/constants.js";

import { canMove, maskIndex } from "./worlds/collision.js";
import { clearBattle, pokemonSelectInit, catchSetup, trainerSetup } from "./scripts/controls.js";
import { gridWidth, gridHeight, conversionRatio, clearRect, drawWorld, drawPlayer, loadAllWorlds } from "./scripts/draw.js";

const body = document.getElementById("body")
const loading = document.getElementById("loading")
const warning = document.getElementById("pc_warning")

body.style.display = "none"
warning.style.display = "none"

const terrainBasedPokemon = []
async function loadPokemonFromHabitat(url) {
    const response = await fetch(url)
    if (!response.ok)
        return

    const collection = []

    const json = await response.json()
    const allPokemon = json["pokemon_species"]

    for(let i = 0; i < allPokemon.length; i++)
        collection.push(allPokemon[i].name)

    return collection
}

async function generateRandomPokemon(x, y) {
    const terrainPokemon = terrainBasedPokemon[maskIndex(x, y)]
    const pokemon = await loadPokemon(terrainPokemon[getRandomInt(0, terrainPokemon.length)], loadTypes | loadSprites)

    await catchSetup(pokemon, async () => {
        await playSFX(clickSFX)
        actions.push([pokemon.name])
    })
}

async function generateRandomTrainer() {
    const count = getRandomInt(minTrainerPokemon, maxTrainerPokemon + 1)

    const pokemon = []
    for(let i = 0; i < count; i++)
        pokemon.push(getRandomInt(0, pokemonCount))

    await trainerSetup(pokemon, async () => {
        await playSFX(clickSFX)
        actions.push(pokemon)
    })
}

async function generateRandomOpponent(x, y) {
    const random = getRandomInt(0, 100)

    if(random > 25)
        await clearBattle()
    else if(random > 10)
        await generateRandomPokemon(x, y)
    else
        await generateRandomTrainer()
}

const localPokemonData = JSON.parse(localStorage.getItem(myPokemonKey))

const all = localPokemonData[allPokemonKey]
const selected = localPokemonData[selectedPokemonKey]

const allPokemon = await loadPokemonList(all, loadTypes | loadSprites)

async function onPokemonSelect(name) {
    let value = false
    if(selected.indexOf(name) < 0) {
        if(selected.length === 6)
            return false

        selected.push(name)
        await playSFX(clickSFX)

        value = true
    }
    else {
        if(selected.length === 1)
            return true

        selected.splice(selected.indexOf(name), 1)
        await playSFX(clickSFX)
    }

    localStorage.setItem(myPokemonKey, JSON.stringify({
        [allPokemonKey] : all,
        [selectedPokemonKey]: selected
    }))

    return value
}

function calculateWorldIndex(x, y) {
    return 2 * (y >= gridHeight ? 1 : 0) +  (x >= gridWidth ? 1 : 0)
}

const timeOut = 60
const actions = []

let standby = false
async function setup() {
    await preLoadSFX([clickSFX, moveSFX])
    await preLoadMusic([starterMusic])

    const pokemonData = localStorage.getItem(myPokemonKey);
    if(pokemonData === "null")
        await loadPage(starterPage)

    await playMusic(starterMusic)

    const worldIndexData = JSON.parse(localStorage.getItem(worldIndexKey))
    const xInit = worldIndexData === null ? gridWidth / 2 : worldIndexData["x"], yInit = worldIndexData === null ? gridHeight / 2 : worldIndexData["y"]

    await loadAllWorlds()

    await draw(0, xInit, yInit)

    await pokemonSelectInit(allPokemon, selected, onPokemonSelect)

    for(let i = 0; i < terrainIndexes.length; i++)
        terrainBasedPokemon.push(await loadPokemonFromHabitat(worldRequests[i]))

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

    onWindowResize(loading, body, warning)

    await gameLoop(xInit, yInit, 0)
}

async function draw(spriteIndex, x, y) {
    clearRect()
    const worldIndex = calculateWorldIndex(x, y)

    const quotient = Math.floor(worldIndex / 2), remainder = worldIndex % 2
    const xCanvas = (remainder === 0 ? x : x - gridWidth), yCanvas = (quotient === 0 ? y : y - gridHeight)

    await drawWorld(worldIndex)

    const mask = maskIndex(x, y)
    await drawPlayer(spriteIndex, xCanvas * conversionRatio - 4, yCanvas * conversionRatio - 8, mask === wtr || mask === sea)
}

async function gameLoop(x, y, spriteIndex) {
    if(actions.length > 0) {
        const action = actions.shift()

        standby = true
        let move = false
        switch (action)
        {
            case 0:
                if(canMove(x - 1, y))
                {
                    x--
                    spriteIndex = 1

                    move = true
                }
                break
            case 1:
                if(canMove(x + 1, y))
                {
                    x++
                    spriteIndex = 2

                    move = true
                }
                break
            case 2:
                if(canMove(x, y - 1))
                {
                    y--
                    spriteIndex = 3

                    move = true
                }
                break
            case 3:
                if(canMove(x, y + 1))
                {
                    y++
                    spriteIndex = 0

                    move = true
                }
                break
            default:
                localStorage.setItem(battleKey, JSON.stringify({
                    [battlePokemon]: action
                }))

                localStorage.setItem(worldIndexKey, JSON.stringify({
                    "x": x,
                    "y": y
                }))

                await loadPage(battlePage)
        }

        if(move)
        {
            await playSFX(moveSFX)
            await draw(spriteIndex, x, y)

            await generateRandomOpponent(x, y)
        }

        standby = false
    }

    setTimeout(() => { gameLoop(x, y, spriteIndex).then() }, timeOut)
}

window.onresize = () => {
    onWindowResize(loading, body, warning)
    standby = loading.style.display === "block";
}

setup().then()