import { useCallback, useEffect, useState } from 'react'
import Autofill from './components/Autofill/Autofill'
import { RickAndMortyCharacter } from './types'

import './app.css'

function App() {
  const [selected, setSelected] = useState<RickAndMortyCharacter[]>([])
  const [options, setOptions] = useState<RickAndMortyCharacter[]>([])
  const [search, setSearch] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((response) => response.json())
      .then((data) => {
        setOptions(data.results)
        setIsLoading(false)
      })
      .catch((_error) => {
        setError(_error.message)
        setOptions([])
        setIsLoading(false)
      })
  }, [])

  const handleSearch = useCallback((searchQuery: string) => {
    setIsLoading(true)
    fetch(`https://rickandmortyapi.com/api/character/?name=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          if (data.error === "There is nothing here") {
            setError("")
            setSearch(searchQuery)
            setOptions([])
            setIsLoading(false)
            return
          }
          setError(data.error)
          setSearch(searchQuery)
          setOptions([])
          setIsLoading(false)
          return
        }
        setOptions(data.results)
        setSearch(searchQuery)
        setIsLoading(false)
        setError("")
      }).catch((_error: Error) => {
        setError(_error.message)
        setOptions([])
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="center">
      <a
        href="https://github.com/antoniormrzz"
        target="_blank"
        tabIndex={-1}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
        }}
      >
        <img
          src="src/assets/rick.jpg"
          alt="Rick admiring his toilet"
          style={{
            width: '300px',
            borderRadius: '10px',
          }}
        />
      </a>
      <p
        style={
          {
            fontSize: '12px',
            textAlign: 'center',
          }
        }
      >
        TAB to select field, Arrow down to open popover,
        <br />
        Arrow up/down to navigate options, Enter to toggle options,
        <br />
        Arrow right/left to navigate selection, Del to remove selected value,
        <br />
        ESC to close the popover.
        <br />
        Hope you can remember all that, Morty.
      </p>
      <Autofill
        value={selected}
        onChange={(values) => setSelected(values)}
        search={search}
        onSearch={handleSearch}
        options={options.slice(0, 10)}
        isLoading={isLoading}
        error={error}
        placeholder="Wubba Lubba Dub Dub!!!"
      />
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <iframe src="https://giphy.com/embed/YpFnbM8Vjx7qaxL39a" width="150px" height="150px" className="giphy-embed"></iframe>
        <p>Congratulations! you won an schlammy! Enter a parent's credit card to claim your prize!</p>
        <input
          type="text"
          placeholder="Card Number"
        />
        <input
          type="text"
          placeholder="Card Holder Name"
        />
        <input
          type="text"
          placeholder="Expiration Date"
        />
        <input
          type="text"
          placeholder="CVV"
        />
        <br />
        <button
          onClick={() => alert('Great! it will arrive in 3-5 business days.')}
        >Claim Prize</button>
      </div>
    </div>
  )
}

export default App
