import React from 'react';
import Modal from 'react-modal';
import styles from './styles.module.css'

Modal.setAppElement('#__next'); // Necessário para acessibilidade

const ConfirmDeleteModal = ({ isOpen, onRequestClose, onConfirm }: any) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmar Exclusão"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>Confirmar Exclusão</h2>
            <p>Você tem certeza que deseja excluir esta tarefa?</p>
            <div className={styles.Containerbuttons}>
                <button className={styles.button} style={{ backgroundColor: 'red' }} onClick={onConfirm}>Sim</button>
                <button className={styles.button} style={{ backgroundColor: 'green' }} onClick={onRequestClose}>Não</button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
