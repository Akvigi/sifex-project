import React, { useCallback, useEffect } from 'react';
import {createPortal} from 'react-dom';


const portal = document.querySelector('#portal');

const Modal = ({ textOfEnd, closeModal }) => {
    const esc = useCallback(
		e => {
			if (e.code === 'Escape') {
				closeModal();
			}
		},
		[closeModal],
	);

	useEffect(() => {
		window.addEventListener('keydown', esc);

		return () => {
			window.removeEventListener('keydown', esc);
		};
	}, [esc]);

	const onBackClick = useCallback(
		e => {
			if (e.currentTarget === e.target) {
				closeModal();
			}
		},
		[closeModal],
	);
    return createPortal(
        <div className='overlay' onClick={(e) => onBackClick(e)}>
            <div className='modal-cont'>
                <p>{textOfEnd}</p>
                <button type="button" className='modalbtn' onClick={() => closeModal()}>Oк</button>
            </div>
        </div>,    
        portal,
    )
};

export default Modal;