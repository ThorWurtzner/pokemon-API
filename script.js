
// let offset = url.get('offset') ? url.get('offset') : 0;
// let url = new URLSearchParams(window.location.search);
// let nextLink = document.querySelector('.more').href;
// nextLink.href = '?offset=' + parseInt(offset) + 20;
// let maxOffset = data.count - (data.count % 20);
// if (offset >= maxOffset) {
//     offset = maxOffset
// } else {
//     offset = parseInt(offset) + 20;
// }


/* #region  GLOBAL VARIABLE DECLARATIONS */
let offset = 0;
let pageNr = 1;
let spinner = document.querySelector('.spinner');
/* #endregion */

/* #region  PAGE LOAD CONTENT PRODUCER */
fetch('https://pokeapi.co/api/v2/pokemon?offset=' + offset)
    .then(response => response.json())
    .then(function(data){
        let count = data.count;
        spinner.remove();
        for (let i = 0; i < data.results.length; i++) {
            let pokemon = data.results[i];

            let clonedPokemonTemplate = document.querySelector('#pokemon-template').content.cloneNode(true);
            clonedPokemonTemplate.querySelector('.name').innerText = pokemon.name;

            document.querySelector('.pokemonContainer').appendChild(clonedPokemonTemplate);
        }
        document.querySelector('.search-wrapper').addEventListener('submit', function(event){
            event.preventDefault();
            search(count);
        })
    })
/* #endregion */

/* #region  CONTENT CHANGE BUTTONS */
document.querySelector('.next').addEventListener('click', function(){
    if (pageNr > 1048 / 20) {
        return;
    } else {
        document.querySelector('.progressText').classList.remove('hidden');
        pageNr = pageNr + 1;
    }
    document.querySelector('.progressText').innerText = pageNr + '/53'

    offset = offset + 20;
    // hardcoded, try and change it
    if (offset > 1040) {
        offset = 1040;
    }
    fetch('https://pokeapi.co/api/v2/pokemon?offset=' + offset)
        .then(response => response.json())
        .then(function(data){
            let pokemonWrappers = document.querySelectorAll('.pokemon-wrapper');
            pokemonWrappers.forEach(element => {
                element.remove();
            });
            data.results.forEach(element => {
                let clonedPokemonTemplate = document.querySelector('#pokemon-template').content.cloneNode(true);
                clonedPokemonTemplate.querySelector('.name').innerText = element.name;

                document.querySelector('.pokemonContainer').appendChild(clonedPokemonTemplate);
            });
        })
})

document.querySelector('.prev').addEventListener('click', function(){
    if (pageNr <= 1) {
        return;
    } else {
        document.querySelector('.progressText').classList.remove('hidden');
        pageNr = pageNr - 1;
    }
    document.querySelector('.progressText').innerText = pageNr + '/53'

    offset = offset - 20;
    if (offset < 0) {
        offset = 0;
    }
    fetch('https://pokeapi.co/api/v2/pokemon?offset=' + offset)
        .then(response => response.json())
        .then(function(data){
            let pokemonWrappers = document.querySelectorAll('.pokemon-wrapper');
            pokemonWrappers.forEach(element => {
                element.remove();
            });
            data.results.forEach(element => {
                let clonedPokemonTemplate = document.querySelector('#pokemon-template').content.cloneNode(true);
                clonedPokemonTemplate.querySelector('.name').innerText = element.name;

                document.querySelector('.pokemonContainer').appendChild(clonedPokemonTemplate);
            });
        })
})
/* #endregion */

/* #region  CONTENT DETAILS SHOW */
document.querySelector('.pokemonContainer').addEventListener('click', function(event){
    let pokeName = event.target.innerText

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
/* #endregion */

/* #region  CONTENT DETAILS CLOSE */
document.querySelector('.pokemonContainer').addEventListener('click', function(event){
    let pokemonWrappers = document.querySelectorAll('.pokemon-wrapper');
    let pokemonSpecifics = document.querySelector('.pokemonSpecifics');
    pokemonWrappers.forEach(pokemonWrapper => {
        if (pokemonWrapper.contains(pokemonSpecifics)) {
            event.target.classList.remove('expand');
            // pokemonSpecifics.classList.add('slide-away')
            event.target.classList.add('expand-away');
            pokemonWrapper.removeChild(pokemonSpecifics);
        }
    });
})
/* #endregion */

/* #region  SEARCH FUNCTION & CONTENT PRODUCER */
function search(count) {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=' + count + '&offset=0')
        .then(response => response.json())
        .then(function(data){

            // NEW MULTIPLE RESULTS
            let userInput = document.querySelector('#search').value;
            if (userInput == '') {
                return;
            }

            let matches = data.results.filter(function(result){
                return result.name.includes(userInput.toLowerCase());
            });

            spinner.remove();
            document.querySelector('.progressText').classList.add('hidden');
            let pokemonWrappers = document.querySelectorAll('.pokemon-wrapper');
            pokemonWrappers.forEach(element => {
                element.remove();
            });

            // TESTING RESULT DIVIDING PAGES
            // let matchesFinal = matches.length / 20;
            // console.log(matchesF)

            matches.forEach(element => {
                let clonedPokemonTemplate = document.querySelector('#pokemon-template').content.cloneNode(true);
                clonedPokemonTemplate.querySelector('.name').innerText = element.name;
                document.querySelector('.pokemonContainer').appendChild(clonedPokemonTemplate);
            });

            // OLD SINGLE RESULT
            // data.results.forEach(element => {
            //     console.log(element.name)
            // });
            // let userInput = document.querySelector('#search').value;
            // if (userInput == '') {
            //     return;
            // }
            // fetch('https://pokeapi.co/api/v2/pokemon/' + userInput)
            //     .then(response => response.json())
            //     .then(function(data){
            //         console.log(data)
            //         searchList(data);
            //     })
        })
}

// OLD SINGLE RESULT
// function searchList(data) {
//     spinner.remove();
//     document.querySelector('.progressText').classList.add('hidden');
//     let pokemonWrappers = document.querySelectorAll('.pokemon-wrapper');
//     pokemonWrappers.forEach(element => {
//         element.remove();
//     });

//     let clonedPokemonTemplate = document.querySelector('#pokemon-template').content.cloneNode(true);
//     clonedPokemonTemplate.querySelector('.name').innerText = data.name;

//     document.querySelector('.pokemonContainer').appendChild(clonedPokemonTemplate);
// }
/* #endregion */

