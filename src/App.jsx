import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MathAdditionGame from './components/MathAdditionGame.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	  <MathAdditionGame />
    </>
  )
}

export default App
