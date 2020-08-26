
fetch('https://pokeapi.co/api/v2/pokemon')
    .then(response => response.json())
    .then(data => pokemonList(data))


function pokemonList(data) {
    for (let i = 0; i < data.results.length; i++) {
        let pokemon = data.results[i];

        let clonedPokemonTemplate = document.querySelector('#pokemon-template').content.cloneNode(true);
        clonedPokemonTemplate.querySelector('.name').innerText = pokemon.name;

        document.querySelector('.pokemonContainer').appendChild(clonedPokemonTemplate);
    }
}

document.querySelector('.pokemonContainer').addEventListener('click', function(event){
    let pokeName = event.target.innerText
    console.log(event.target.innerText)

    fetch("https://pokeapi.co/api/v2/pokemon/" + pokeName)
        .then(response => response.json())
        .then(function(dataSpecifics){
            // if (!document.querySelector('.pokemon-wrapper').contains('pokemonspecifics')) {
            //      if pokemon has not been clicked, open
            // } else {
            //      if pokemon specifics are already open, remove
            // }

            console.log(dataSpecifics)

            let clonedPokemonTemplate = document.querySelector('#pokemon-specifics').content.cloneNode(true);
            clonedPokemonTemplate.querySelector('.pokemonImg').src = dataSpecifics.sprites.front_default;
            clonedPokemonTemplate.querySelector('.abilityName1').innerText = dataSpecifics.abilities[0].ability.name;
            clonedPokemonTemplate.querySelector('.abilityName2').innerText = dataSpecifics.abilities[1].ability.name;

            event.target.appendChild(clonedPokemonTemplate);
        });
})
