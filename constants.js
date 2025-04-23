export const myPokemonKey = "collection"

export const allPokemon = "all"
export const selectedPokemon = "selected"

export const mainPage = "main", battlePage = "battlePage", starterPage = "starterPage"

export const pages = {
    [mainPage] : "../main/world.html",
    [battlePage] : "../battle/battle.html",
    [starterPage] : "../starters/starter.html",
}

export const starters = [
    "bulbasaur", "eevee", "cyndaquil", "treecko",
    "chimchar", "tepig", "fennekin", "charmander",
    "pikachu", "chikorita", "mudkip", "turtwig",
    "oshawott", "chespin", "squirtle", "totodile",
    "torchic", "piplup", "snivy", "froakie"
]

export const showdownBack = "back", showdownFront = "front", gif = "gif", avatar = "avatar"

export const battle = "battle", battleBackground = "battleBackground", battlePokemon = "battlePokemon"

export const starterMusic = "starter", battleMusic = "battleMusic", victoryMusic = "victoryMusic", click = "click", moveSound = "move"

export const audio = {
    [starterMusic] : "../../../audio/starter.ogg",
    [battleMusic] : "../../../audio/battle.ogg",
    [victoryMusic]: "../../../audio/victory.ogg",
    [click]:  "../../../audio/click.mp3",
    [moveSound]: "../../../audio/move.mp3",
}

export const active = "active", inactive = "inactive"

export const minTrainerPokemon = 3, maxTrainerPokemon = 6
export const pokemonCount = 500