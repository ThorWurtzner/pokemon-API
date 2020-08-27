
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
            console.log(dataSpecifics)

            let clonedPokemonTemplate = document.querySelector('#pokemon-specifics').content.cloneNode(true);
            clonedPokemonTemplate.querySelector('.pokemonImg').src = dataSpecifics.sprites.front_default;
            clonedPokemonTemplate.querySelector('.abilityName1').innerText = dataSpecifics.abilities[0].ability.name;
            if (dataSpecifics.abilities[1]) {
                clonedPokemonTemplate.querySelector('.abilityName2').innerText = dataSpecifics.abilities[1].ability.name;
            }
            clonedPokemonTemplate.querySelector('.abilityTitle1').innerText = 'Main ability:'
            if (!dataSpecifics.abilities[1]) {
                clonedPokemonTemplate.querySelector('.abilityTitle2').innerText = ''
            } else {
                clonedPokemonTemplate.querySelector('.abilityTitle2').innerText = 'Secondary ability:'
            }
            
            fetch(dataSpecifics.location_area_encounters)
                .then(response => response.json())
                .then(function(dataLocation){
                    console.log(dataLocation);

                    if (dataLocation[0]) {
                        clonedPokemonTemplate.querySelector('.location-wrapper').classList.add('location-wrapper-style');
                        clonedPokemonTemplate.querySelector('.locationTitle').innerText = 'Found in:';
                        clonedPokemonTemplate.querySelector('.location1').innerText = dataLocation[0].location_area.name
                        clonedPokemonTemplate.querySelector('.location1').classList.add('location-style');
                    }
                    if (dataLocation[1]) {
                        clonedPokemonTemplate.querySelector('.location2').innerText = dataLocation[1].location_area.name
                        clonedPokemonTemplate.querySelector('.location2').classList.add('location-style');
                    }
                    if (dataLocation[2]) {
                        clonedPokemonTemplate.querySelector('.location3').innerText = dataLocation[2].location_area.name
                        clonedPokemonTemplate.querySelector('.location3').classList.add('location-style');
                    }
                    event.target.classList.remove('expand-away');
                    event.target.classList.add('expand')
                    setTimeout(() => {
                        event.target.appendChild(clonedPokemonTemplate);
                    }, 400);
                });

        });
})

document.querySelector('.pokemonContainer').addEventListener('click', function(event){
    let pokemonWrappers = document.querySelectorAll('.pokemon-wrapper');
    let pokemonSpecifics = document.querySelector('.pokemonSpecifics');
    pokemonWrappers.forEach(pokemonWrapper => {
        if (pokemonWrapper.contains(pokemonSpecifics)) {
            console.log(event.target);
            event.target.classList.remove('expand');
            // pokemonSpecifics.classList.add('slide-away')
            event.target.classList.add('expand-away');
            pokemonWrapper.removeChild(pokemonSpecifics);
            // setTimeout(() => {

            // }, 400);
        }
    });
})
