export default function Modal({ isOpen, onRequestClose, onConfirm, message }) {

    return <div className={!isOpen ? "modal" : "modal is-active"}>
        <div className="modal-background"></div>
        <div className="modal-card">
            <section className="modal-card-body">
                <p >{message}</p>
                <div className="buttons mt-2">
                    <button className="button is-primary" onClick={onConfirm}>Yes</button>
                    <button className="button is-light" onClick={onRequestClose}>No</button>
                </div>
            </section>
        </div>
    </div>
}