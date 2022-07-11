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
        // searchPokeResults = pokemonListFinal.filter(pokemon => pokemon.id.includes(e.target.value));
        searchPokeResults = pokemonListFinal.filter(pokemon => pokemon.name.includes(e.target.value.toLowerCase()));
        document.getElementById("pokemon-list").innerHTML = searchPokeResults.map(pokemon => innerPoke(pokemon)).join("");
        // console.log(searchPokeResults);
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
        '<div class="col pokemon" onclick="dataPoke('+ id +')">'+
            '<div class="content-center card text-white space-card-top poke-card-list bg-card grass">'+
                '<img class="" src="'+ image +'" alt="" style="width: 75px;">'+
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
        [data.types],
        data.weight,
        data.height,
        [data.abilities],
        [data.stats[0].base_stat,data.stats[1].base_stat,data.stats[2].base_stat,data.stats[3].base_stat,data.stats[4].base_stat,data.stats[5].base_stat]
    );
    console.log(pokemon);
    console.log(data);
    // document.getElementById("pokeDataCard").innerHTML = generatePokeDataCard();

}





functionPokeList();



// Busqueda
