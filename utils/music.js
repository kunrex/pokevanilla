import { audio } from "./constants.js";

const sfx = { }
const music = { }

let soundOff = false
let currentMusic = null

function loadAudio(music) {
    const file = new Audio(audio[music])
    file.currentTime = 0

    return file
}

const volume = document.getElementById("volume")
volume.onclick = async () => {
    soundOff = !soundOff

    if(currentMusic !== null)
    {
        if(soundOff)
            currentMusic.pause()
        else
            await currentMusic.play()
    }
}

export async function preLoadSFX(effectIds) {
    for(let i = 0; i < effectIds.length; i++) {
        const id = effectIds[i];
        const audio = loadAudio(id)
        audio.loop = false

        sfx[id] = audio
    }
}

export async function playSFX(effectId) {
    if(soundOff)
        return

    const effect = sfx[effectId]
    if(!effect.paused)
    {
        effect.pause()
        effect.currentTime = 0
    }

    await effect.play()
}

export async function preLoadMusic(musicIds) {
    for(let i = 0; i < musicIds.length; i++) {
        const id = musicIds[i]
        const audio = loadAudio(id)
        audio.loop = true

        music[id] = audio
    }
}

export async function playMusic(musicId) {
    if(currentMusic !== null && !soundOff)
        currentMusic.pause()

    currentMusic = music[musicId]

    try {
        if(!soundOff)
            await currentMusic.play()
    }
    catch (e) { }
}

export async function stopMusic() {
    if(currentMusic !== null)
        currentMusic.pause()

    currentMusic = null
}