import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(async() => {
    const result = await axios.get('https://pokeapi.co/api/v2/pokemon');
    const pokemonsRes = result.data.results;
    const pokemonsArr = [];
    pokemonsRes.forEach(async(el) => {
      try {
        const pokemonObj = {};
        const pokemonInfo = await axios.get(el.url);
        pokemonObj.name = el.name;
        pokemonObj.img = pokemonInfo.sprites.front_default;
        pokemonObj.type = pokemonInfo.types.map(type => {type.type.name});
        pokemonsArr.push(pokemonObj); 
      }
      catch(e){
        console.log(e);
      }
    })
    setPokemons(pokemonsArr);
  }, [])

  return(
    <ul>
      {pokemons.map(el => <li>{el.name} {el.img} {el.type}</li>)}
    </ul>
  )
}

export default PokemonList;
