import { useRef, useState } from 'react';
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
  const interval = useRef();
  const startTimer1 = () => {
    return setInterval(() => {
      setTimer1((seconds) => {
        return seconds + 0.1
      })
    }, 100)
  }
  const startTimer2 = () => {
    return setInterval(() => {
      setTimer2((seconds) => {
        return seconds + 0.1
      })
    }, 100)
  }
  
  const cellsQuantity = (quant) => {
    const arr = []
    let row = 0
    for (let index = 0; index < quant; index++) {
      if (index % Math.sqrt(quant)===0 && index!==0) {
        row+=1
      }
      arr.push({ index, currRow: row, marked: null, disabled: false, win: false})
    }
    return arr
  }

  const [field, setField] = useState(cellsQuantity(cells))

  const endGame = (st, move, winCells, timer) => {
    st.forEach(item => {
      item.disabled = true
    })
    if (winCells.length === 3) {
      winCells.forEach(i => st[i].win = true)
    }
    clearInterval(interval.current)
    setMove(true)

    if (move === 'none') {
      openModal(`Нічия! Спробуйте ще :) Загальний час гри: ${Math.round(timer)} секунд`)
      return 
    }
    if (move) {
      openModal(`Гравець1 переміг. Вітаємо! Він витратив ${Math.round(timer)} секунд`)
      return setWin1(win1+1)
    }
    openModal(`Гравець2 переміг. Вітаємо! Він витратив ${Math.round(timer)} секунд`)
    return setWin2(win2+1)
  }

  const openModal = (text) => {
    setTextModal(text)
    setTimeout(() => setModal(true), 2000)
  }
  const closeModal = () => {
    setTextModal(null)
    setModal(false)
  }

  const checkWinCondition = (arr, i, inc, curMove, diag) => {
    let a = i + inc
    let b = i + (inc * 2)
    if (b === arr.length) {
      b = b - 1
    } else if (b > arr.length) {
      b = b - (b - arr.length) - 1
    }
    const arrOfCheck = [arr[i], arr[a], arr[b]]
    const checkRowDiff = (arr) => {
      let d = true
      for (let i = 0; i < arr.length; i++) {
        for (let index = i+1; index < arr.length; index++) {
          if (arr[i].currRow === arr[index].currRow) {
            return d = false
          }
        }
        if (arr[i + 1] && Math.abs(arr[i + 1].currRow - arr[i].currRow) !== 1) {
          return d = false
        }
        if (!d) {
          break
        }
      }
      return d
    }
    const xWin = arrOfCheck.every(item => item.marked === 'X')  
    const oWin = arrOfCheck.every(item => item.marked === 'O')
    if ((xWin && !diag) || (diag && xWin && checkRowDiff(arrOfCheck))) {
      endGame(arr, curMove, [i, a, b],timer1)
    } else if ((oWin && !diag) || (diag && oWin && checkRowDiff(arrOfCheck))) {
      endGame(arr, curMove, [i, a, b],timer2)
    }
  }

  const markCell = (statefield, number, currRow, curMove) => {
    const arr = [...statefield]
    arr[number].marked = curMove ? "X" : "O"
    if (curMove) {
      clearInterval(interval.current)
      interval.current = startTimer2()
    } else {
      clearInterval(interval.current)
      interval.current = startTimer1()
    }
    arr[number].disabled = true
    const rows = Math.sqrt(cells)
    const objAr = {
      '3': 1,
      '4': 2,
      '5': 3,
      '6': 4,
      '7': 5,
      '8': 6,
      '9': 7,
    }
    const count = (rows * objAr[`${rows}`])
    if (arr.every(item => item.marked) && !textModal) {
      endGame(arr, 'none', [], timer1+timer2)
    }
    for (let i = 0; i < count; i++) {
      checkWinCondition(arr, i, rows, curMove) // vertical row
      if (rows > 3) {
        checkWinCondition(arr, i, rows+1, curMove, true) // diagonal row from top to bot
        if (i % rows !== 0 || i === 0) {
          checkWinCondition(arr, i, rows-1, curMove, true) // diagonal row from bot to top
        }
      }
    }
    if (rows < 4) {
      checkWinCondition(arr, 2, 2, curMove) // diagonal row from bot to top
      checkWinCondition(arr, 0, 4, curMove) // diagonal row from top to bot
    }
    for (let i = currRow * rows; i < (currRow * rows)+(rows-2); i++) {
      checkWinCondition(arr, i, 1, curMove) // horizontal row
    }
    
    setField([...arr])
    setMove(curMove => !curMove)
  }

  const changeField = () => {
    setTimer1(0)
    setTimer2(0)
    clearInterval(interval.current)
    interval.current = startTimer1()
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
        timer1={Math.round(timer1)}
        timer2={Math.round(timer2)}
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
