import { useState } from 'react';
import './App.css';
import Stats from './components/Stats';
import { Game } from './components/Game';
import Modal from './components/Modal';

function App() {
  const [cells, setCells] = useState(9)
  const [futureCells, setFutureCells] = useState(9)
  const [modal, setModal] = useState(false)
  const [win1, setWin1] = useState(0)
  const [win2, setWin2] = useState(0)
  const [move, setMove] = useState(true)
  
  const cellsQuantity = (quant) => {
    const arr = []
    let row = 0
    for (let index = 0; index < quant; index++) {
      if (index % Math.sqrt(quant)===0 && index!==0) {
        row+=1
      }
      arr.push({ index, currRow: row, marked: null, disabled: false })
    }
    return arr
  }

  const [field, setField] = useState(cellsQuantity(cells))

  const endGame = (st, move) => {
    st.forEach(item => item.disabled = true)
    setMove(true)
    if (move) {
      return setWin1(win1+1)
    }
    return setWin2(win2+1)
  }
  
  const checkGameProgress = (arr, i, inc, curMove) => {
    if (arr[i].marked === "X" && arr[i + inc].marked === "X" && arr[i + inc * 2].marked === "X") {
      endGame(arr, curMove)
      setTimeout(() => setModal(true))
    } else if (arr[i].marked === "O" && arr[i + inc].marked === "O" && arr[i + inc * 2].marked === "O") {
      endGame(arr, curMove)
      setTimeout(() => setModal(true))
    }
  }
  
  const markCell = (statefield, number, currRow, curMove) => {
    const arr = [...statefield]
    arr[number].marked = curMove ? "X" : "O"
    arr[number].disabled = true
    const rows = Math.sqrt(cells) 
    for (let i = 0; i < cells-(rows*2); i++) {
      checkGameProgress(arr, i, rows, curMove) // vertical row
      checkGameProgress(arr, i, rows+1, curMove) // diagonal row from top to bot
      checkGameProgress(arr, i, rows-1, curMove) // diagonal row from bot to top
    }
    for (let i = currRow*rows; i < currRow*rows+rows-2; i++) {
      checkGameProgress(arr, i, 1, curMove) // horizontal row
    }
    setField([...arr])
    setMove(curMove => !curMove)
  }

  const changeField = () => {
    setCells(futureCells)
    setField(cellsQuantity(futureCells))
    setMove(true)
  }

  return (
    <div className="App">
      <Stats win1={win1} win2={win2} changeField={setFutureCells} />
      <Game
        cellsQuantity={cells}
        newGame={changeField}
        move={move}
        markCell={markCell}
        field={field}
      />
      {modal && <Modal />}
    </div>
  );
}

export default App;
