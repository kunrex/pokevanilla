import { pages, gif, showdownBack, showdownFront, avatar, audio, minWidth, minHeight } from "./constants.js";

export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export async function loadPage(page) {
    if(page in pages)
        window.location.href = pages[page];
}

export function loadImage(img, src) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function pushTypes(pokemon, types) {
    const final = []
    for(let i = 0; i < types.length; i++)
        final.push(types[i]["type"]["name"])

    pokemon.types = final
}

function pushStats(pokemon, stats) {
    pokemon.health = stats[0]['base_stat']
    pokemon.attack = stats[1]['base_stat']
    pokemon.defense = stats[2]['base_stat']

    pokemon.maxHealth = pokemon.health
}


function pushSprites(pokemon, sprites) {
    pokemon.sprites = {
        [showdownBack]: sprites["back_default"],
        [showdownFront]: sprites["front_default"],
        [gif]: sprites["other"]["showdown"]["front_default"],
        [avatar]: sprites["other"]["official-artwork"]["front_default"]
    }
}

async function pushMoves(pokemon, moves) {
    let actualMoves = []
    for(let i = 0; i < moves.length && actualMoves.length !== 4; i++)
    {
        let move = moves[i].move
        const url = move.url

        try
        {
            const response = await fetch(url)
            if (!response.ok) {
                continue
            }

            const json = await response.json()
            const power = json.power

            if(power === null)
                continue

            actualMoves.push({
                name: move.name.replace('-', ' '),
                type: json.type.name,
                power: power,
            })
        }
        catch (error)
        { }
    }

    pokemon.moves = actualMoves
}

async function pushEvolution(pokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`

    try
    {
        const response = await fetch(url)
        if (!response.ok)
            return null

        const evolutionChainURL = (await response.json())["evolution_chain"]["url"]

        const evolutionResponse = await fetch(evolutionChainURL)
        if(!evolutionResponse.ok)
            return null

        const json = await evolutionResponse.json()

        let current = json["chain"]
        while(true) {
            let flag = false

            const species = current["species"]["name"].toLowerCase()
            if(species === pokemon)
                flag = true

            const evolutionDetails = current["evolves_to"]
            if(evolutionDetails === null)
                break

            if(flag)
            {
                const evolutions = []
                for(let i = 0; i < evolutionDetails.length; i++)
                    evolutions.push(evolutionDetails[i]["species"]["name"].toLowerCase())

                return evolutions
            }

            current = evolutionDetails
        }

        return null
    }
    catch (error) {
        return null
    }
}

export async function loadPokemon(identifier) {

    const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`

    try
    {
        const response = await fetch(url)
        if (!response.ok) {
            return null
        }

        const json = await response.json()

        const pokemon = {
            name: json["name"].replace('-', ' ').toLowerCase(),
        }

        pokemon.evolution = await pushEvolution(pokemon.name)

        pushTypes(pokemon, json["types"])
        pushStats(pokemon, json["stats"])
        pushSprites(pokemon, json["sprites"])
        await pushMoves(pokemon, json["moves"])

        return pokemon
    }
    catch (error) {
        return null
    }
}

const apiDelay = new Promise(r => setTimeout(r, 100))
export async function loadPokemonList(list) {
    let final = []

    for (let i = 0; i < list.length; i++)
    {
        final.push(await loadPokemon(list[i]))
        await apiDelay
    }

    return final
}

export function loadMusic(music) {
    const file = new Audio(audio[music])

    file.currentTime = 0
    file.loop = true

    return file
}

export function onWindowResize(loading, body, warning) {
    const width = window.innerWidth
    const height = window.innerHeight

    if(width < minWidth || height < minHeight) {
        body.style.display = "none"

        loading.style.display = "block"
        warning.style.display = "block"
    }
    else {
        body.style.display = "block"

        loading.style.display = "none"
        warning.style.display = "none"
    }
}