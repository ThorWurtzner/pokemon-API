
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
            let clonedPokemonTemplate = document.querySelector('#pokemon-specifics').content.cloneNode(true);
            clonedPokemonTemplate.querySelector('.pokemonImg').src = dataSpecifics.sprites.front_default;
            clonedPokemonTemplate.querySelector('.abilityName1').innerText = dataSpecifics.abilities[0].ability.name;
            clonedPokemonTemplate.querySelector('.abilityName2').innerText = dataSpecifics.abilities[1].ability.name;
            
            event.target.appendChild(clonedPokemonTemplate);

            console.log(dataSpecifics)
        });
})

document.querySelector('.pokemonContainer').addEventListener('click', function(event){
    let pokemonWrappers = document.querySelectorAll('.pokemon-wrapper');
    let pokemonSpecifics = document.querySelector('.pokemonSpecifics');
    pokemonWrappers.forEach(pokemonWrapper => {
        if (pokemonWrapper.contains(pokemonSpecifics)) {
            console.log(event.target);
            pokemonSpecifics.classList.add('slide-away')
            setTimeout(() => {
                pokemonWrapper.removeChild(pokemonSpecifics);
            }, 400);
        }
    });
})
