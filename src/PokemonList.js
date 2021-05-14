import React, { useEffect, useState } from 'react';
import { ListGroup } from "react-bootstrap"
import axios from 'axios';

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get('https://pokeapi.co/api/v2/pokemon');
      const pokemons = result.data.results;

      const promises = pokemons.map((pokemon) =>{
        return axios.get(pokemon.url);
      })

      const pokemonInfo = (await Promise.all(promises))
        .map((result) => {
          return result.data
        })
        .map((info) => {
          return {
            id: info.id,
            name: info.name,
            image: info.sprites.front_default,
            types: info.types.map(el => el.type.name)
          }
       })
       
      setPokemons(pokemonInfo);
    }
    fetchData();
  }, [])

  return(
    <div>
      <h3 className="header">Pokemons API</h3>
      {
        pokemons.map(el => (
          <ListGroup key={el.id}>
            <ListGroup.Item style={{marginRight: 200, marginLeft: 200, marginTop: 20}}>
              <h3><img src={el.image} alt=''></img> {el.name} - {el.types.join(', ')}</h3>
            </ListGroup.Item>
          </ListGroup>
        ))
      }
    </div>
  )
}

export default PokemonList;
