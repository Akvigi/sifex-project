import { useState } from 'react';
import './App.css';
import Stats from './components/Stats';
import { Game } from './components/Game';
import Modal from './components/Modal';

function App() {
  const [cells, setCells] = useState(9)
  const [futureCells, setFutureCells] = useState(9)
  const [timer1, setTimer1] = useState(0)
  const [timer2, setTimer2] = useState(0)
  const [modal, setModal] = useState(false)
  const [textModal, setTextModal] = useState(null)
  const [win1, setWin1] = useState(0)
  const [win2, setWin2] = useState(0)
  const [move, setMove] = useState(true)
  const [interval, setInterv] = useState()

  const startTimer1 = () => {
    return setInterval(() => {
      setTimer1((seconds) => {
        return seconds + 1
      })
    }, 1000)
  }
  const startTimer2 = () => {
    return setInterval(() => {
      setTimer2((seconds) => {
        return seconds + 1
      })
    }, 1000)
  }
  
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
    if (move === 'none') {
      return 
    }
    if (move) {
      return setWin1(win1+1)
    }
    return setWin2(win2+1)
  }

  const openModal = (text) => {
    setTextModal(text)
    setTimeout(() => clearInterval(interval), 500)
    setTimeout(() => setModal(true), 2000)
  }
  const closeModal = () => {
    setTextModal(null)
    setModal(false)
  }

  const checkWinCondition = (arr, i, inc, curMove) => {
    if (arr[i].marked === "X" && arr[i + inc].marked === "X" && arr[i + (inc * 2)].marked === "X") {
      endGame(arr, curMove)
      return openModal(`Гравець1 переміг. Вітаємо! Він витратив ${timer1} секунд`)
    } else if (arr[i].marked === "O" && arr[i + inc].marked === "O" && arr[i + (inc * 2)].marked === "O") {
      endGame(arr, curMove)
      return openModal(`Гравець2 переміг. Вітаємо! Він витратив ${timer2} секунд`)
    }
  }
  
  const markCell = (statefield, number, currRow, curMove) => {
    const arr = [...statefield]
    arr[number].marked = curMove ? "X" : "O"
    if (curMove) {
      clearInterval(interval)
      setInterv(startTimer2())
    } else {
      clearInterval(interval)
      setInterv(startTimer1())
    }
    arr[number].disabled = true
    const rows = Math.sqrt(cells)  
    for (let i = 0; i < cells-(rows*2); i++) {
      checkWinCondition(arr, i, rows, curMove) // vertical row
      if (rows>3) {
        checkWinCondition(arr, i, rows+1, curMove) // diagonal row from top to bot
      }
      checkWinCondition(arr, i, rows-1, curMove) // diagonal row from bot to top
    }
    if (rows < 4) {
      checkWinCondition(arr, 0, rows+1, curMove) // diagonal row from top to bot
    }
    for (let i = currRow*rows; i < currRow*rows+rows-2; i++) {
      checkWinCondition(arr, i, 1, curMove) // horizontal row
    }
    if (arr.every(item => item.marked) && !textModal) {
      endGame(arr, 'none')
      return openModal(`Нічия! Спробуйте ще :) Загальний час гри: ${timer1+timer2} секунд`) 
    }
    setField([...arr])
    setMove(curMove => !curMove)
  }

  const changeField = () => {
    setTimer1(0)
    setTimer2(0)
    clearInterval(interval)
    setInterv(startTimer1())
    setCells(futureCells)
    setField(cellsQuantity(futureCells))
    setMove(true)
  }

  return (
    <div className="App">
      <Stats
        win1={win1}
        win2={win2}
        changeField={setFutureCells}
        timer1={timer1}
        timer2={timer2}
      />
      <Game
        cellsQuantity={cells}
        newGame={changeField}
        move={move}
        markCell={markCell}
        field={field}
      />
      {modal && <Modal textOfEnd={textModal} closeModal={closeModal}/>}
    </div>
  );
}

export default App;
