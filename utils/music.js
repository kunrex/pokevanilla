import { loadMusic } from "./utilities.js";
import { click, moveSound } from "./constants.js";

const move = loadMusic(moveSound)
move.loop = false

export async function playMoveSound() {
    if(!move.paused)
    {
        move.pause()
        move.currentTime = 0
    }

    await move.play()
}

const buttonClick = loadMusic(click)
buttonClick.loop = false

export async function playButtonClick() {
    if(!buttonClick.paused)
    {
        buttonClick.pause()
        buttonClick.currentTime = 0
    }

    await buttonClick.play()
}

export async function playMainMusic(music) {
    const volume = document.getElementById("volume")
    const audio = loadMusic(music)

    let playing = false
    volume.onclick = async () => {
        if(playing)
            audio.pause()
        else
            await audio.play()

        playing = !playing
    }

    return audio
}