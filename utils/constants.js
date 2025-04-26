export const minWidth = 1500, minHeight = 850

export const mainPage = "main", battlePage = "battlePage", starterPage = "starterPage"

export const pages = {
    [mainPage] : "../main/world.html",
    [battlePage] : "../battle/battle.html",
    [starterPage] : "../starters/starter.html",
}

export const moveSFX = "move", clickSFX = "click", evolvedSFX = "evolved"
export const lossMusic = "lossMusic",  battleMusic = "battleMusic", starterMusic = "starterMusic", victoryMusic = "victoryMusic", evolutionMusic = "evolutionMusic"

export const audio = {
    [moveSFX]: "../../assets/audio/move.mp3",
    [clickSFX]:  "../../assets/audio/click.ogg",
    [evolvedSFX]:  "../../assets/audio/evolved.ogg",

    [lossMusic]: "../../assets/audio/loss.ogg",
    [battleMusic] : "../../assets/audio/battle.ogg",
    [starterMusic]: "../../assets/audio/starter.ogg",
    [victoryMusic]: "../../assets/audio/victory.ogg",
    [evolutionMusic]: "../../assets/audio/evolution.ogg",
}

export const myPokemonKey = "myPokemon", allPokemonKey = "allPokemon", selectedPokemonKey = "selectedPokemon"

export const starters = [
    "bulbasaur", "eevee", "cyndaquil", "treecko",
    "chimchar", "tepig", "fennekin", "charmander",
    "pikachu", "chikorita", "mudkip", "turtwig",
    "oshawott", "chespin", "squirtle", "totodile",
    "torchic", "piplup", "snivy", "froakie"
]

export const loadTypes = 1, loadStats = 2, loadMoves = 4, loadSprites = 8, loadEvolutions = 16, loadAll = loadTypes | loadStats | loadMoves | loadSprites | loadEvolutions

export const showdownBack = "back", showdownFront = "front", gif = "gif", avatar = "avatar"

export const active = "active", inactive = "inactive"

export const battleKey = "battle", battlePokemon = "battlePokemon"

export const minTrainerPokemon = 3, maxTrainerPokemon = 6
export const pokemonCount = 500

export const worldIndexKey = "worldIndex"

export const sea = 0, wtr = 1, rck = 2, mtn = 3, grs = 4, fst = 5, urb = 6, nan = -1

export const terrainIndexes = [sea, wtr, rck, mtn, grs, fst, urb]

export const worldRequests = [
    "https://pokeapi.co/api/v2/pokemon-habitat/sea/",
    "https://pokeapi.co/api/v2/pokemon-habitat/waters-edge/",
    "https://pokeapi.co/api/v2/pokemon-habitat/rough-terrain/",
    "https://pokeapi.co/api/v2/pokemon-habitat/mountain/",
    "https://pokeapi.co/api/v2/pokemon-habitat/grassland/",
    "https://pokeapi.co/api/v2/pokemon-habitat/forest/",
    "https://pokeapi.co/api/v2/pokemon-habitat/urban/",
]

export const attackTypeTable = {
    normal: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
        fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
        bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1
    },
    fire: {
        normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2,
        fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
        bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1
    },
    water: {
        normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1,
        fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1,
        bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1
    },
    electric: {
        normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1,
        fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1,
        bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1
    },
    grass: {
        normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1,
        fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1,
        bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1
    },
    ice: {
        normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5,
        fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1,
        bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1
    },
    fighting: {
        normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2,
        fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5,
        bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5
    },
    poison: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1,
        fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1,
        bug: 1, rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2
    },
    ground: {
        normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1,
        fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1,
        bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1
    },
    flying: {
        normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1,
        fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1,
        bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1
    },
    psychic: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
        fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5,
        bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1
    },
    bug: {
        normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1,
        fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2,
        bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5
    },
    rock: {
        normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2,
        fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1,
        bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1
    },
    ghost: {
        normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
        fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2,
        bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1
    },
    dragon: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
        fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
        bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0
    },
    dark: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
        fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2,
        bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5
    },
    steel: {
        normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2,
        fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
        bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2
    },
    fairy: {
        normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1,
        fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1,
        bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1
    }
}