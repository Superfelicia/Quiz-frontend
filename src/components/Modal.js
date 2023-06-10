import {useState} from "react";

const Modal = ({currentQuestion}) => {
    const [choice, setChoice] = useState('');

    const handleChange = (event) => {
        let value = (event.target.value);
        console.log(value)
        setChoice(value)
    }

    const handleSubmit = (event) => {
        fetch('http://localhost:3001/postQuizChoices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                choice: choice,
            }),
        })
        event.preventDefault();
        console.log({choice: choice})
    }

    return (
        <div className='question-modal'>
            <div className='question-modal-container'>
                <h3 className='question-modal-header'>
                    {currentQuestion.question}
                </h3>
                <div className='question-answer-container'>
                    <form onSubmit={handleSubmit}>
                        <label>New question:</label><br/>
                            <input value={choice} type={'text'} placeholder={'New answer'} onChange={e => handleChange(e)}/>
                    </form>
                    <div style={{padding: '10px', marginTop: '20px', textDecoration: 'underline'}}>
                        <p>{choice}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;