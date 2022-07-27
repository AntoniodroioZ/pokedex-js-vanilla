// // service worker
// if('serviceWorker'in navigator){
//     navigator.serviceWorker.register('./sw.js')
//     .then(reg=>console.log('Registro de Service Worker existoso', reg))
//     .then(err=>console.warn('Error al registrar el SW',err));
// }

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type=text]').forEach( node => node.addEventListener('keypress', e => {
      if(e.keyCode == 13) {
        e.preventDefault();
      }
    }))
});

var pokemonListContent ;
let pokemonListFinal;
document.addEventListener("keyup", e=>{
    if(e.target.matches("#search-pokemon")){
        searchPokeResults = pokemonListFinal.filter(pokemon => pokemon.name.includes(e.target.value.toLowerCase()));
        document.getElementById("pokemon-list").innerHTML = searchPokeResults.map(pokemon => innerPoke(pokemon)).join("");
    }
});

class Pokemon {
    constructor(image,name,types,weight,height,abilities,stats){
        this.image = image;
        this.name = name;
        this.types = types;
        this.weight = weight;
        this.height = height;
        this.abilities = abilities;
        this.stats = stats;
    }
}

const functionPokeList = () =>{
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1154')
    .then(data => data.json())
    .then(response => savePokeList(response));

}
const innerPoke = (pokemon) =>{
    
    const { id, name, image } = pokemon;
    return(
        '<div class="col pokemon" id="pokeList'+ id +'">'+
            '<div class="content-center card text-white space-card-top poke-card-list bg-card "onclick="dataPoke('+ id +')">'+
                '<img class="" src="'+ image +'" alt="qwe" style="width: 75px;">'+
                '<p>'+ name +'</p>'+
            '</div>'+
        '</div>'
    );
}
const savePokeList = (data) =>{
    // console.log(data.results);
    pokemonListFinal = data.results.map((pokemon) => {
        return {
            id: pokemon.url.split('/')[6],
            name: pokemon.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.url.split('/')[6]}.png`,
        }
    });

    document.getElementById("pokemon-list").innerHTML = pokemonListFinal.map(pokemon => innerPoke(pokemon)).join("");
    // console.log(data.results);

    pokemonListContent = document.getElementById("pokemon-list")
    return pokemonListFinal;
}

const dataPoke = (id) =>{
    fetch('https://pokeapi.co/api/v2/pokemon/'+id)
    .then(data => data.json())
    .then(response => savedataPoke(response,id));
    // console.log(pokemon.types[0])
    
}


const savedataPoke = (data,id) =>{
    pokemon = new Pokemon(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/'+id+'.png',
        data.forms[0].name,
        getPokeTypes(data),
        data.weight,
        data.height,
        getPokeAbilities(data),
        [data.stats[0].base_stat,data.stats[1].base_stat,data.stats[2].base_stat,data.stats[3].base_stat,data.stats[4].base_stat,data.stats[5].base_stat]
    );
    // console.log(pokemon);
    // console.log(data);
    var elemento = document.getElementById("favorite");
    elemento.setAttribute("data-pokeID",id);
    elemento.setAttribute("data-pokeName",pokemon.name);
    if(localStorage.getItem(pokemon.name)==null){
        document.getElementById("star-favorite-status").classList.remove("star-favorite-on");
    }else{
        document.getElementById("star-favorite-status").classList.add("star-favorite-on");
    }
    document.getElementById("poke-image-card").src = pokemon.image;
    document.getElementById("poke-name-card").innerHTML = pokemon.name;
    document.getElementById("poke-type-card").innerHTML = generatePokeTypes();
    document.getElementById("poke-weight-card").innerHTML = calculateAbout(1);
    document.getElementById("poke-height-card").innerHTML = calculateAbout(2);
    document.getElementById("poke-abilities-card").innerHTML = generatePokeAbilities();
    document.getElementById("poke-stats-card").innerHTML = generatePokeCharts();
    document.body.className = pokemon.types[0];
    // document.getElementById("left-division").className = "invisible";
    document.getElementById("pokeDataCardInitial").classList.add("invisible-card");
    document.getElementById("pokeDataCard").classList.remove("invisible-card");
    document.getElementById("scape").classList.remove("invisible-card");
    document.getElementById("favorite").classList.remove("invisible-card");
    document.getElementById("right-division").classList.remove("card-data-pokemon");
    document.getElementById("left-division").classList.add("card-data-pokemon");
}

const getPokeTypes = (data) =>{
    pokeType = [];
    // console.log(data.types[1].type.name);
    for(let i = 0; i < data.types.length; i++) {
        pokeType.push(data.types[i].type.name);
    }
    return pokeType;
};

const generatePokeTypes = () =>{
    var pokeTypeCard = '';
    pokemon.types.forEach(types => pokeTypeCard = pokeTypeCard + 
    '<div class="col ">'+
        '<div class="poke-type '+ types +' row ">'+
            '<img class=" poke-type-icon" src="./img/types/Icon_'+ types +'.webp" alt="">'+
            '<p class="col content-center poke-type-text">'+ types +'</p>'+
        '</div>'+
    '</div>');
    return pokeTypeCard;
}

const calculateAbout = (data) =>{
    if(data == 1){
        result = parseInt(pokemon.weight)/10;
        return(
        '<div class="poke-type '+ pokemon.types[0] +' row">'+
            '<h4 class="poke-type-text"><i class="fa fa-weight-hanging"></i> '+ result +' KG</h4>'+
            '<p class="col content-center poke-type-text">Weight</p>'+
        '</div>'
        );
        
    }
    if(data == 2){
        result = parseInt(pokemon.height)/10;
        return(
        '<div class="poke-type '+ pokemon.types[0] +' row">'+
            '<h4 class="poke-type-text"><i class="fa fa-ruler"></i> '+ result +' M</h4>'+
            '<p class="col content-center poke-type-text">Height</p>'+
        '</div>'
        );
    }
}

const getPokeAbilities = (data) =>{
    var pokeAbilities = [];
    for(let i = 0; i < data.abilities.length; i++) {
        pokeAbilities.push(data.abilities[i].ability.name);
    }
    return pokeAbilities;
};
const generatePokeAbilities = () =>{
    var pokeAbilities = '';
    pokemon.abilities.forEach(abilities => pokeAbilities = pokeAbilities +
        '<div class="col  content-center">'+
            '<div class="poke-type '+ pokemon.types[0] +' row abilities-name">'+                         
                '<p class="col content-center poke-type-text">'+ abilities +'</p>'+
            '</div>'+
        '</div>'
    );
    return pokeAbilities;
}

const generatePokeCharts = () =>{
    var pokeCharts = '';
    for (let i = 0; i < pokemon.stats.length; i++) {
        pokeCharts = pokeCharts +
        '<li class="row content-center"><span class="col number-stat '+ pokemon.types[0] +'">'+ pokemon.stats[i] +'</span><div class="base-bar col '+ pokemon.types[0] +'"><span class="progress-bar '+ pokemon.types[0] +'" style="width: '+ calcStatChart(pokemon.stats[i]) +'%;"></span></div></li>'
    }
    
    return pokeCharts;
}

const calcStatChart = (number) =>{
    result = (100/300)*number;
    if(result>100){
        return 100
    }else{
        return result;
    }
}

const ocultElement = () =>{
    document.getElementById("pokeDataCardInitial").classList.remove("invisible-card");
    document.getElementById("pokeDataCard").classList.add("invisible-card");
    document.getElementById("scape").classList.add("invisible-card");
    document.getElementById("favorite").classList.add("invisible-card");
    document.getElementById("right-division").classList.add("card-data-pokemon");
    document.getElementById("left-division").classList.remove("card-data-pokemon");
}

functionPokeList();


const setFavorite = () =>{
    var elemento = document.getElementById("favorite");
    id = elemento.getAttribute("data-pokeID");
    pokeName =  elemento.getAttribute("data-pokeName");
    htmlPoke = document.getElementById("pokeList"+id).innerHTML;
    // arrayStorage = localStorage;
    // console.log(localStorage.getItem(pokeName));
    if(localStorage.getItem(pokeName)){
        localStorage.removeItem(pokeName)
        document.getElementById("star-favorite-status").classList.remove("star-favorite-on");
    }else{
        if(id != ""){
            localStorage.setItem(pokeName,htmlPoke)
            document.getElementById("star-favorite-status").classList.add("star-favorite-on");
        }
    }
    // elemento.setAttribute("data-pokeID",123);
    // console.log(elemento.getAttribute("data-pokeID"));
}

const showFavorites = () =>{
    var elements = [];
    for(var x = 0; x < localStorage.length; x++) {
        elements.push(localStorage.getItem(localStorage.key(x)));
    }
    document.getElementById("favorite-pokemon-list").innerHTML = elements.map(pokemon => innerFavList(pokemon)).join("");
    buttonDownload = document.getElementById("download-button");
    if(localStorage.length > 0){
        document.getElementById("text-empty").innerHTML = "";
        buttonDownload.disabled = false
    }else{
        document.getElementById("text-empty").innerHTML = "Add your favorites pokemons to show in this list";
        buttonDownload.disabled = true
    }
    // return elements
}
const innerFavList = (pokemon) =>{
    return(
        '<div class="col pokemon" data-bs-dismiss="modal">'+
        pokemon+
        '</div>'
    );
}
const downloadJSON = () =>{
    var storageObj = localStorage;
    var fileName = 'favorites.json'
    // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj));
    var fileToSave = new Blob([JSON.stringify(storageObj)], {
    // var fileToSave = new Blob([storageObj], {   
        type: 'application/json'
    });
    saveAs(fileToSave,fileName);
}


var file;
document.getElementById('inputFile').addEventListener('change', function() {
    file = new FileReader();
    file.onload = () => {
        document.getElementById('output').textContent = "If you want save this data, press upload to continue";
    }
    file.readAsText(this.files[0]);
});

const loadFavorites = () =>{
    arrayFavorites = JSON.parse(file.result);
    console.log(arrayFavorites);
    tamFav = Object.keys(arrayFavorites);
    tamFav.forEach(element =>{
        console.log(arrayFavorites[element]);
        localStorage.setItem(element,arrayFavorites[element]);
    })
}

const eraseFavorites = ()=>{
    document.getElementById("star-favorite-status").classList.remove("star-favorite-on");
    localStorage.clear();
    showFavorites();
}