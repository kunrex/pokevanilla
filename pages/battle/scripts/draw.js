import { loadImage } from "../../../utilities.js";
import { showdownBack , showdownFront, gif } from "../../../constants.js";

const backgrounds = ["backgrounds/battle.jpg", "backgrounds/water-battle.jpg"];

const background = document.getElementById("background");
export async function setBackground(index) {
    console.log(index)
    await loadImage(background, backgrounds[index])
}

const canvasWidth = 1280, canvasHeight = 720

const canvas = document.getElementById('world')
canvas.width = canvasWidth
canvas.height = canvasHeight

const ctx = canvas.getContext('2d')

const player1Coords = [50, 575], player2Coords = [1000, 575]
const player1UICoords = [450, 580] , player2UICoords = [700, 275]
const player1TextCoords = [525, 640], player2TextCoords = [780, 335]
const player1HealthCoords = [665, 650], player2HealthCoords = [910, 340]

const player1Image = document.getElementById('player1')
const player2Image = document.getElementById('player2')

export function clearRect() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

export async function loadPokemonImages(pokemonList) {
    for(let i = 0; i < pokemonList.length; i++)
    {
        await loadImage(player1Image, pokemonList[i].sprites[showdownFront])
        await loadImage(player1Image, pokemonList[i].sprites[showdownBack])
        await loadImage(player1Image, pokemonList[i].sprites[gif])
    }
}

let player1Sprite = null
export async function drawPlayer1Pokemon(pokemon) {
    if (pokemon.health < 0)
        return

    const sprite = pokemon.sprites[showdownBack]
    if(player1Sprite !== sprite)
        await loadImage(player1Image, sprite)

    ctx.drawImage(player1Image, 0, 0, player1Image.width, player1Image.height, player1Coords[0], player1Coords[1] - (player1Image.height * 2), player1Image.width * 4, player1Image.height * 4)
}

let player2Sprite = null
export async function drawPlayer2Pokemon(pokemon) {
    if (pokemon.health < 0)
        return

    const sprite = pokemon.sprites[showdownBack]
    if(player2Sprite !== sprite)
        await loadImage(player2Image, pokemon.sprites[showdownFront])

    ctx.drawImage(player2Image, 0, 0, player2Image.width, player2Image.height, player2Coords[0], player2Coords[1] - (player2Image.height * 2), player2Image.width * 3, player2Image.height * 3)
}

const player1Bar = document.getElementById('player1Bar')
const player2Bar = document.getElementById('player2Bar')

export async function loadPokemonUI() {
    await loadImage(player1Bar, "ui/player_health_bar.png")
    await loadImage(player2Bar, "ui/opponent_health_bar.png")
}

async function drawUI(pokemon, healthUI, UICoordinates, textCoordinates) {
    ctx.drawImage(player1Bar, 0, 0, healthUI.width, healthUI.height, UICoordinates[0], UICoordinates[1], healthUI.width * 2 / 3, healthUI.height * 2 / 3)

    ctx.fillStyle = "#000000"
    ctx.fillText(pokemon.name, textCoordinates[0], textCoordinates[1])
}

export async function drawPokemonUI(pokemon1, pokemon2) {
    ctx.font = "24px RetroFont";

    await drawUI(pokemon1, player1Bar, player1UICoords, player1TextCoords)
    await drawUI(pokemon2, player2Bar, player2UICoords, player2TextCoords)
}

const green = [0, 255, 110], red = [175, 50, 50]

const healthBarHeight = 20, maxHealthBarWidth = 140

async function drawHealthBar(value, maxHealth, x, y) {
    const color = []
    for (let i = 0; i < 3; i++)
        color[i] = red[i] + (green[i] - red[i]) * value / maxHealth

    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
    ctx.fillRect(x, y, (value / maxHealth) * maxHealthBarWidth, healthBarHeight);
}

export async function drawPokemonHealth(pokemon1, pokemon2) {
    await drawHealthBar(pokemon1.health, pokemon1.maxHealth, player1HealthCoords[0], player1HealthCoords[1])
    await drawHealthBar(pokemon2.health, pokemon2.maxHealth, player2HealthCoords[0], player2HealthCoords[1])
}

export async function waitLoadFonts() {
    await document.fonts.load("24px RetroFont");
    ctx.font = "24px RetroFont";
}

waitLoadFonts().then()