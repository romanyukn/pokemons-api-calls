import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);

  //Dont use async function here
  useEffect(() => {
    async function fetchData() {
      const result = await axios.get('https://pokeapi.co/api/v2/pokemon');
      const pokemons = result.data.results;

      // Solution 1
      // Fetch all at the same time and wait for them to finish
      const promises = pokemons.map((pokemon) => {
        return axios.get(pokemon.url)
      });
      const returnValue = (await Promise.all(promises))
        .map((result) => {
          return result.data
        })
        .map((pokemonDetails) => {
          return {
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            img: pokemonDetails.sprites.front_default,
            types: pokemonDetails.types.map(type => type.type.name)
          }
        });

      // Solution 2
      // Fetch pokemon details one after the other in an almost linear fashion
      // let pokemonsArr = [];
      // for (const pokemon of pokemons) {
      //   const pokemonInfo = await axios.get(pokemon.url);
      //   pokemonsArr.push({
      //     id: pokemonInfo.id,
      //     name: pokemon.name,
      //     img: pokemonInfo.data.sprites.front_default,
      //     types: pokemonInfo.data.types.map(type => type.type.name),
      //   });
      // }

      // This does not work because
      // the state is set immediately
      // without waiting for the async
      // foreach to finish executing.
      // it updates the array directly,
      // giving the illusion that it worked.
      // but this mutation should be done via
      // pokemons.forEach(async(el) => {
      //   try {
      //     const pokemonObj = {};
      //     const pokemonInfo = await axios.get(el.url);
      //     pokemonObj.name = el.name;
      //     pokemonObj.img = pokemonInfo.data.sprites.front_default;
      //     pokemonObj.type = pokemonInfo.data.types.map(type => type.type.name);
      //     console.log(el.name);
      //     pokemonsArr.push(pokemonObj);
      //   }
      //   catch(e){
      //     console.log(e);
      //   }
      // })

      console.log(returnValue);
      setPokemons(returnValue);
    }
    fetchData();
  }, [])

  return(
    <ul>
      {
        pokemons.map(el => (
          <li key={el.id}>
            <h3>{el.name}</h3>
            <h4>{el.types.join(', ')}</h4>
            <img src={el.img} alt="" />
          </li>
        ))
      }
    </ul>
  )
}

export default PokemonList;
