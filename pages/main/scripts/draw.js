import { loadImage } from "../../../utilities.js";

const worlds = ["worlds/world1.png", "worlds/world2.png", "worlds/world3.png", "worlds/world4.png"];

export const canvasWidth = 512, canvasHeight = 512

export const conversionRatio = 32
export const gridWidth = canvasWidth / conversionRatio, gridHeight = canvasHeight / conversionRatio

const canvas = document.getElementById("world")
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const ctx = canvas.getContext("2d");

const playerWidth = canvasWidth / 12, playerHeight = canvasHeight / 12

const player = document.getElementById("player")
const background = document.getElementById("background")

export async function loadAllWorlds() {
    for(let i = 0; i < worlds.length; i++) {
        await loadImage(background, worlds[i])
    }
}

export function clearRect() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

let currentWorldIndex = -1
export async function drawWorld(worldIndex) {
    if(worldIndex !== currentWorldIndex)
    {
        currentWorldIndex = worldIndex
        await loadImage(background, worlds[worldIndex])
    }

    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvasWidth, canvasHeight)
}

const playerSprites = [
    "sprites/tile0.png",
    "sprites/tile4.png",
    "sprites/tile8.png",
    "sprites/tile12.png",
]

let currentPlayerSpriteIndex = -1
export async function drawPlayer(spriteIndex, x, y) {
    if(spriteIndex !== currentPlayerSpriteIndex)
    {
        currentPlayerSpriteIndex = spriteIndex
        await loadImage(player, playerSprites[currentPlayerSpriteIndex])
    }

    ctx.drawImage(player, 0, 0, player.width, player.height, x, y, playerWidth, playerHeight)
}