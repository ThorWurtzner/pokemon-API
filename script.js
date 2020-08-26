
fetch('https://pokeapi.co/api/v2/pokemon')
    .then(response => response.json())
    .then(function(data) {
        console.log(data);
    });