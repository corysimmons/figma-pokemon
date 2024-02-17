import fetch from 'node-fetch'
import { promises as fs } from 'fs'

async function fetchDataWithRetry(url, retries = 3, retryDelay = 1000) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`)
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
      return fetchDataWithRetry(url, retries - 1, retryDelay)
    } else {
      console.error(`Failed to fetch ${url}:`, error.message)
      return null
    }
  }
}

async function fetchPokemonData() {
  const limit = 1302
  const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`

  try {
    const data = await fetchDataWithRetry(apiUrl)
    const pokemons = data.results

    const pokemonDetailsPromises = pokemons.map(async (pokemon) => {
      const pokemonData = await fetchDataWithRetry(pokemon.url)
      if (pokemonData && pokemonData.sprites.front_default) {
        return {
          name: pokemonData.name,
          imgUrl: pokemonData.sprites.front_default,
        }
      }
      return null
    })

    const pokemonDetails = (await Promise.all(pokemonDetailsPromises)).filter(
      (p) => p !== null && p.imgUrl !== null
    )

    await fs.writeFile('pokemon.json', JSON.stringify(pokemonDetails, null, 2))
    console.log('Pokémon data saved to pokemon.json')
  } catch (error) {
    console.error('Error fetching Pokémon data:', error)
  }
}

fetchPokemonData()
