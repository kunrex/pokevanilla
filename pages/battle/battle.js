import { playMusic, playSFX, preLoadMusic, preLoadSFX, stopMusic } from "../../utils/music.js";
import { getRandom, getRandomInt, loadPage, loadPokemon, loadPokemonList, onWindowResize } from "../../utils/utilities.js";
import {
    battlePokemon,
    battleKey,
    myPokemonKey,
    selectedPokemonKey,
    allPokemonKey,
    victoryMusic,
    mainPage,
    battleMusic,
    starterPage,
    attackTypeTable,
    clickSFX,
    evolvedSFX,
    evolutionMusic,
    lossMusic,
    loadAll,
    loadTypes, loadSprites
} from "../../utils/constants.js";

import { clearRect,  drawPlayer1Pokemon, drawPlayer2Pokemon, drawPokemonHealth, drawPokemonUI, loadPokemonImages, loadPokemonUI, waitLoadFonts } from "./scripts/draw.js";
import { manageSelection, pushLog, initAttacks, initSelection, toggleAttacks, disableSelection, pokeBallsInit, managePokeBalls, showEvolutionInit, attackButtonsInit, backToHomeInit } from "./scripts/controls.js";

const body = document.getElementById("body")
const loading = document.getElementById("loading")
const warning = document.getElementById("pc_warning")

body.style.display = "none"
warning.style.display = "none"

function calcBaseDamage(move, attacker, defender) {
    return ((2.4 * move.power * attacker.attack / (defender.defense + 1e-6)) / 50 + 2) * getRandom(0.85, 1)
}

let standby = false

let actions = []
export function pushAction(index) {
    if(!standby)
        actions.push(index)
}

async function onActionButtonClick(index) {
    pushAction(index)
    await playSFX(clickSFX)
}

async function loadHome() {
    localStorage.setItem(battleKey, null)
    await loadPage(mainPage)
}

async function setup() {
    await preLoadSFX([clickSFX, evolvedSFX])
    await preLoadMusic([lossMusic, battleMusic, victoryMusic, evolutionMusic])

    const battleSettingsData = localStorage.getItem(battleKey)
    const localPokemonData = localStorage.getItem(myPokemonKey)

    if(localPokemonData === "null")
        await loadPage(starterPage)
    if(battleSettingsData === "null")
        await loadPage(mainPage)

    await playMusic(battleMusic)

    const battleSettings = JSON.parse(battleSettingsData)
    const parsedPokemonData = JSON.parse(localPokemonData)

    const player1Pokemon = await loadPokemonList(parsedPokemonData[selectedPokemonKey], loadAll)
    const player2Pokemon = await loadPokemonList(battleSettings[battlePokemon], loadAll)

    await waitLoadFonts()

    await loadPokemonUI()

    await loadPokemonImages(player1Pokemon)
    await loadPokemonImages(player2Pokemon)

    await drawPlayer1Pokemon(player1Pokemon[0])
    await drawPlayer2Pokemon(player2Pokemon[0])

    await drawPokemonHealth(player1Pokemon[0], player2Pokemon[0])
    await drawPokemonUI(player1Pokemon[0], player2Pokemon[0])

    await attackButtonsInit(onActionButtonClick)
    initAttacks(player1Pokemon[0])

    await initSelection(player1Pokemon, onActionButtonClick)
    await manageSelection(player1Pokemon, 0)

    await pokeBallsInit(player2Pokemon.length)

    await backToHomeInit(loadHome)

    body.style.display = "block"
    loading.style.display = "none"

    onWindowResize(loading, body, warning)

    await gameLoop(0, 0, player1Pokemon, player2Pokemon)
}

const timeout = 30

async function checkPokemonKnockOut(pokemonList, pokemonIndex) {
    const currentPokemon = pokemonList[pokemonIndex]
    if(currentPokemon.health < 0)
    {
        for(let i = 0; i < pokemonList.length; i++)
            if(pokemonList[i].health > 0)
            {
                pushLog(`${pokemonList[pokemonIndex].name} was knocked out! ${pokemonList[i].name} enters the arena!`, 2)
                return i
            }

        return -1
    }
    else
        return pokemonIndex
}

async function attackAnimation(pokemon1, pokemon2, index) {
    if(index === 0) {
        for(let i = 0; i < 5; i++)
        {
            await clearRect()

            await drawPlayer1Pokemon(pokemon1)

            if(i % 2 === 0)
                await drawPlayer2Pokemon(pokemon2)

            await new Promise(r => setTimeout(r, 250))
        }
    }
    else {
        for(let i = 0; i < 5; i++)
        {
            await clearRect()

            if(i % 2 === 0)
                await drawPlayer1Pokemon(pokemon1)

            await drawPlayer2Pokemon(pokemon2)

            await new Promise(r => setTimeout(r, 250))
        }
    }
}

async function manageAttack(attacker, defender, actionIndex, logIndex) {
    const attack = attacker.moves[actionIndex]
    const probability = getRandomInt(0, 100)
    if(probability < 10) {
        pushLog(`${attacker.name} used ${attack.name} but it missed!`, logIndex ? 0 : 1)
        return
    }

    const isCritical = getRandomInt(0, 4) === 1

    let typeModifier = 1
    for(let i = 0 ;i < defender.types; i++)
        typeModifier *= attackTypeTable[attack.type][defender.types[i]]

    const damage = calcBaseDamage(attack, attacker, defender) * (isCritical ? 1.5 : 1) * typeModifier

    defender.health -= damage
    pushLog(`${attacker.name} used ${attack.name}${isCritical ? ", it was super effective! It did " : " and it did "}${Math.floor(damage)} damage!`, logIndex)
}

async function draw(pokemon1, pokemon2) {
    await clearRect()

    await drawPlayer1Pokemon(pokemon1)
    await drawPlayer2Pokemon(pokemon2)

    await drawPokemonHealth(pokemon1, pokemon2)
    await drawPokemonUI(pokemon1, pokemon2)
}

async function tryEvolvePokemon(pokemonList) {
    if(getRandomInt(0, 100) > 10)
        return

    await stopMusic()
    await playMusic(evolutionMusic)

    let minimum = null
    for(let i = 0; i < pokemonList.length; i++)
        if(pokemonList[i].evolution !== null && pokemonList[i].evolution !== undefined)
            if(minimum === null || pokemonList[i].health < pokemonList[minimum].health)
                minimum = i

    if(minimum === null)
        return

    const pokemon = pokemonList[minimum]
    const evolution = await loadPokemon(pokemon.evolution[getRandomInt(0, pokemon.evolution.length)], loadTypes | loadSprites)

    let flag = false
    await showEvolutionInit(pokemon, evolution, async () => {
        const pokemonData = JSON.parse(localStorage.getItem(myPokemonKey));

        const all = pokemonData[allPokemonKey]
        const selected = pokemonData[selectedPokemonKey]

        all.splice(all.indexOf(pokemon.name), 1)
        selected.splice(selected.indexOf(pokemon.name), 1)

        all.push(evolution.name)
        selected.push(evolution.name)

        localStorage.setItem(myPokemonKey, JSON.stringify({
            [allPokemonKey] : all,
            [selectedPokemonKey] : selected
        }))

        await stopMusic()
        await playSFX(evolvedSFX)

        flag = true
    }, async () => {
        await stopMusic()
        flag = true
    })

    const timeOut = () =>
        new Promise(r => {
            const check = () => {
                if (flag)
                    r()
                else
                    setTimeout(check, 100)
            };

            check()
        })

    await timeOut();
}

async function manageBattleWin(pokemonList) {
    await pushLog("You Win!", 0)

    await stopMusic()

    await tryEvolvePokemon(pokemonList)

    await playMusic(victoryMusic)

    const pokemonData = JSON.parse(localStorage.getItem(myPokemonKey));
    const pokemon = JSON.parse(localStorage.getItem(battleKey))[battlePokemon];

    if(pokemon.length === 1) {
        const names = pokemonData[allPokemonKey]
        const name = pokemon[0].toLowerCase()

        if(names.indexOf(name) < 0)
        {
            names.push(name)

            localStorage.setItem(myPokemonKey, JSON.stringify({
                [allPokemonKey] : names,
                [selectedPokemonKey] : pokemonData[selectedPokemonKey]
            }))

            await pushLog(`You've successfully caught ${pokemon[0]}!`, 0)
        }
    }
}

async function manageBattleLoss() {
    await pushLog("You Lose", 1)

    await stopMusic()
    await playMusic(lossMusic)
}

async function gameLoop(player1Index, player2Index, player1Pokemon, player2Pokemon) {
    if(actions.length > 0) {
        standby = true

        disableSelection()
        toggleAttacks(4, true)

        const action = actions.shift()

        if(action < 4) {
            const pokemon1 = player1Pokemon[player1Index]
            const pokemon2 = player2Pokemon[player2Index]

            await attackAnimation(pokemon1, pokemon2, 0)
            await manageAttack(pokemon1, pokemon2, action, 0)

            await attackAnimation(pokemon1, pokemon2, 1)
            await manageAttack(pokemon2, pokemon1, getRandomInt(0, 4), 1)
        }
        else {
            const index = action - 4

            if(player1Index !== index) {
                const previous = player1Pokemon[player1Index]
                player1Index = index

                const pokemon1 = player1Pokemon[player1Index]
                const pokemon2 = player2Pokemon[player2Index]

                initAttacks(pokemon1)
                await manageSelection(player1Pokemon, player1Index)
                pushLog(`${previous.name} swapped out for ${pokemon1.name}!`, 0)

                await attackAnimation(pokemon1, pokemon2, 1)
                await manageAttack(pokemon2, pokemon1, getRandomInt(0, 4), 1)
            }
        }

        {
            const prevPlayer1Index = player1Index, prevPlayer2Index = player2Index

            player1Index = await checkPokemonKnockOut(player1Pokemon, player1Index)
            player2Index = await checkPokemonKnockOut(player2Pokemon, player2Index)

            await manageSelection(player1Pokemon, player1Index)

            if (player1Index >= 0 && player2Index >= 0)
            {
                if(prevPlayer1Index !== player1Index)
                    await initAttacks(player1Pokemon[player1Index])
                else
                    await toggleAttacks(player1Pokemon[player1Index].moves.length, false)

                if(prevPlayer2Index !== player2Index)
                    await managePokeBalls(player2Pokemon)
            }
            else
            {
                await draw(player1Pokemon[prevPlayer1Index], player2Pokemon[prevPlayer2Index])

                if(player2Index < 0)
                    await manageBattleWin(player1Pokemon)
                else
                    await manageBattleLoss()

                await new Promise(r => setTimeout(r, 8000))
                await loadHome()
            }
        }

        standby = false

        await draw(player1Pokemon[player1Index], player2Pokemon[player2Index])
        setTimeout(() => { gameLoop(player1Index, player2Index, player1Pokemon, player2Pokemon).then()  }, timeout)
    }
    else
        setTimeout(() => { gameLoop(player1Index, player2Index, player1Pokemon, player2Pokemon).then()  }, timeout)
}

window.onresize = () => {
    onWindowResize(loading, body, warning)
}

setup().then()