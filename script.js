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
    // if(parseInt(id)==718){
    //     console.log("xd");
    // }
    return(
        '<div class="col pokemon" onclick="dataPoke('+ id +')">'+
            '<div class="content-center card text-white space-card-top poke-card-list bg-card grass">'+
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
    console.log(pokemon);
    console.log(data);
    document.getElementById("poke-image-card").src = pokemon.image;
    document.getElementById("poke-name-card").innerHTML = pokemon.name;
    document.getElementById("poke-type-card").innerHTML = generatePokeTypes();
    document.getElementById("poke-weight-card").innerHTML = calculateAbout(1);
    document.getElementById("poke-height-card").innerHTML = calculateAbout(2);
    document.getElementById("poke-abilities-card").innerHTML = generatePokeAbilities();
    document.getElementById("poke-stats-card").innerHTML = generatePokeCharts();
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
            '<h4 class="poke-type-text"><i class="fa fa-weight-hanging"></i>'+ result +'KG</h4>'+
            '<p class="col content-center poke-type-text">Weight</p>'+
        '</div>'
        );
        
    }
    if(data == 2){
        result = parseInt(pokemon.height)/10;
        return(
        '<div class="poke-type '+ pokemon.types[0] +' row">'+
            '<h4 class="poke-type-text"><i class="fa fa-ruler"></i>'+ result +'KG</h4>'+
            '<p class="col content-center poke-type-text">Weight</p>'+
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
        '<div class="col">'+
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
        '<li class="row content-center"><span class="col number-stat">'+ pokemon.stats[i] +'</span><div class="base-bar col '+ pokemon.types[0] +'"><span class="progress-bar '+ pokemon.types[0] +'" style="width: '+ calcStatChart(pokemon.stats[i]) +'%;"></span></div></li>'
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

functionPokeList();



// Busqueda
