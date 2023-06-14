import React from 'react'

export const Game = ({newGame, field, move, markCell, cellsQuantity}) => {
  return (
      <div className='gamecontainer'>
        <button
            onClick={newGame}
            type="button"
            className='playbutton'
        >
            Нова гра
        </button>
        
        <h3>Хід: {move ? "Гравець1" : "Гравець2"}</h3>  
          
        <ul className={`playfield p-f${cellsQuantity}`}>
          {field.map(({marked, index, disabled, currRow}) => <button
            key={index}
            type='button'
            disabled= {disabled} 
            className='cell'
            onClick={() => markCell(field, index, currRow, move)}
          >
            {marked === 'X' &&
              <span className='markX'>X</span>
            }
            {marked === 'O' &&
              <span className='markO'>O</span>
            }
          </button>)}
        </ul>
      </div>
  )
}
