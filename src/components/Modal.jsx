import React from 'react';
import {createPortal} from 'react-dom';


const portal = document.querySelector('#portal');

const Modal = ({textOfEnd, closeModal}) => createPortal(
    <div className='overlay'>
        <div>
            <p>{textOfEnd}</p>
            <button type="button" onClick={closeModal}>Закрити</button>
        </div>
    </div>,    
	portal,
);

export default Modal;