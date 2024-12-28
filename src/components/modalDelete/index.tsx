import React from 'react';
import Modal from 'react-modal';
import styles from './styles.module.css'

Modal.setAppElement('#__next'); // Necessário para acessibilidade

const ConfirmDeleteModal = ({ isOpen, onRequestClose, onConfirm, message }: any) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmar Exclusão"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>Confirmar Exclusão</h2>
            <p>{message}</p>
            <div className={styles.Containerbuttons}>
                <button className={styles.button} style={{ backgroundColor: 'red' }} onClick={onConfirm}>Sim</button>
                <button className={styles.button} style={{ backgroundColor: 'green' }} onClick={onRequestClose}>Não</button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
