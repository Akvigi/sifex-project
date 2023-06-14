import React from 'react'

const Stats = ({ win1, win2, changeField }) => {
    const fields = [9, 16, 25, 36, 49, 64, 81]
    return (
        <div className='statistics'>
            <h2>Перемоги</h2>
            <p className='player'>Гравець1: {win1}</p>
            <p className='player'>Гравець2: {win2}</p>
            <ul className='choosefields'>
                <h4>Поля для гри</h4>
                {fields.map(item =>
                    <label
                        key={item}
                    >
                        <input
                            type='radio'
                            onClick={() => changeField(item)}
                            name='fieldlist'
                        />
                        {Math.sqrt(item)}x{Math.sqrt(item)}
                    </label>
                    
                    
                )}
            </ul>
        </div>
    )
}

export default Stats