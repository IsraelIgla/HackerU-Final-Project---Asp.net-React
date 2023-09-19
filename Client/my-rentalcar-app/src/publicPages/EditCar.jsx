import React from 'react'
import ReactDom from 'react-dom'
import UpdateFormForCar from "../components/UpdateFormForCar";

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '5vmin',
    borderRadius: '2vmin',
    fontSize: '2.5vmin',
    zIndex: 1000
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

export default function EditCar({ theCar, editIndex, onSave, onClose, onDelete }) {
    if (editIndex == -1) return null

    return ReactDom.createPortal(
        <>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES}>
                <div style={{ marginBottom: '1vmin' }}>
                    <UpdateFormForCar mode={"edit"} args={{ theCar, onSave, 
                        onClose, onDelete }} />
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}