import { playMainMusic } from "../../music.js";
import { getRandomInt, loadPage, loadPokemonList, onWindowResize } from "../../utilities.js";
import { battlePokemon, battle, myPokemonKey, selectedPokemon, allPokemon, victoryMusic, mainPage, battleMusic, battleBackground, starterPage } from "../../constants.js";

import { manageSelection, pushLog, initAttacks, initSelection, toggleAttacks, disableSelection, pokeBallsInit, managePokeBalls } from "./scripts/controls.js";
import { clearRect,  drawPlayer1Pokemon, drawPlayer2Pokemon, drawPokemonHealth, drawPokemonUI, loadPokemonImages, loadPokemonUI, setBackground, waitLoadFonts } from "./scripts/draw.js";

const body = document.getElementById("body")
const loading = document.getElementById("loading")

body.style.display = "none"

function calcDamage(power, attacker, defender) {
    return (2.4 * power * attacker.attack / (defender.defense + 1e-6)) / 50 + 2
}

let backgroundMusic
async function setup() {
    const battleSettingsData = localStorage.getItem(battle)
    const localPokemonData = localStorage.getItem(myPokemonKey)

    if(localPokemonData === null) {
        await loadPage(starterPage)
    }
    if(battleSettingsData === null) {
        await loadPage(mainPage)
    }

    backgroundMusic = await playMainMusic(battleMusic)
    await backgroundMusic.play()

    const battleSettings = JSON.parse(battleSettingsData)
    const parsedPokemonData = JSON.parse(localPokemonData)

    const player1Pokemon = await loadPokemonList(parsedPokemonData[selectedPokemon])
    const player2Pokemon = await loadPokemonList(battleSettings[battlePokemon])

    await setBackground(battleSettings[battleBackground])

    await waitLoadFonts()

    await loadPokemonUI()

    await loadPokemonImages(player1Pokemon)
    await loadPokemonImages(player2Pokemon)

    await drawPlayer1Pokemon(player1Pokemon[0])
    await drawPlayer2Pokemon(player2Pokemon[0])

    await drawPokemonHealth(player1Pokemon[0], player2Pokemon[0])
    await drawPokemonUI(player1Pokemon[0], player2Pokemon[0])

    await pokeBallsInit(player2Pokemon.length)

    initAttacks(player1Pokemon[0])

    await initSelection(player1Pokemon)
    await manageSelection(player1Pokemon, 0)

    body.style.display = "block"
    loading.style.display = "none"

    await gameLoop(0, 0, player1Pokemon, player2Pokemon)
}

const timeout = 30

let actions = []
export function pushAction(index) {
    if(!standby)
        actions.push(index)
}

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

    const damage = calcDamage(attack.power, attacker, defender)

    defender.health -= damage
    pushLog(`${attacker.name} used ${attack.name} and it did ${Math.floor(damage)} damage!`, logIndex)
}

async function draw(pokemon1, pokemon2) {
    await clearRect()

    await drawPlayer1Pokemon(pokemon1)
    await drawPlayer2Pokemon(pokemon2)

    await drawPokemonHealth(pokemon1, pokemon2)
    await drawPokemonUI(pokemon1, pokemon2)
}

async function manageBattleWin() {
    backgroundMusic.pause()

    backgroundMusic = await playMainMusic(victoryMusic)
    await backgroundMusic.play()

    const pokemonData = JSON.parse(localStorage.getItem(myPokemonKey));
    const pokemon = JSON.parse(localStorage.getItem(battle))[battlePokemon];

    if(pokemon.length === 1) {
        const names = pokemonData[allPokemon]
        const name = pokemon[0].toLowerCase()

        if(names.indexOf(name) < 0)
        {
            names.push(name)

            localStorage.setItem(myPokemonKey, JSON.stringify({
                [allPokemon] : names,
                [selectedPokemon] : pokemonData[selectedPokemon]
            }))

            await pushLog(`You've successfully caught ${pokemon[0]}!`, 0)
        }
    }

    localStorage.setItem(battle, null)
}

let standby = false
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
                    await toggleAttacks(player1Pokemon[player1Index].moves.length)

                if(prevPlayer2Index !== player2Index)
                    await managePokeBalls(player2Pokemon)
            }
            else
            {
                await draw(player1Pokemon[prevPlayer1Index], player2Pokemon[prevPlayer2Index])

                if(player2Index < 0)
                {
                    await pushLog("You Win!", 0)
                    await manageBattleWin()
                }
                else
                    await pushLog("You Lose", 1)

                await new Promise(r => setTimeout(r, 8000))
                await loadPage(mainPage)
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
    onWindowResize(loading, body)
}

setup().then()