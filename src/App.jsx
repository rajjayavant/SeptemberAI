import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import SearchBar from  './components/SearchBar.jsx'
import HomePage from './components/HomePage.jsx'


function App() {
  const [count, setCount] = useState(0)
  return (
      <HomePage/>
  )
}

export default App
