import './css/App.css'
import React from 'react'
import Board from './components/Board'
import { StructureContext } from './components/contexts/contexts'


function App() {
  const structure = [
    { id: 1, name: 'Pending', limit: 1 },
    { id: 2, name: 'Analysis', limit: 4 },
    { id: 3, name: 'Development', limit: 4 },
    { id: 4, name: 'Deploy', limit: 5 }
  ]

  return (
    <>
      <StructureContext.Provider value={{ structure: structure }}>
        <Board />
      </StructureContext.Provider>
    </>
  )
}

export default App
