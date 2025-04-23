import { loadPage } from "./utilities.js";

import { mainPage, myPokemonKey, starterPage } from "./constants.js";

setTimeout(() => {
    loadPage(localStorage.getItem(myPokemonKey) === null ? starterPage : mainPage).then()
}, 2000)
