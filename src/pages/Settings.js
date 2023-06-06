import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWrench} from '@fortawesome/free-solid-svg-icons'

const Settings = () => {

    const [settings, setSettings] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(0);

    useEffect(() => {
        async function asyncFetch() {
            const res = await fetch('http://localhost:3001/settings');
            const resQuestions = await fetch('http://localhost:3001/getQuizQuestions').then(res => res.json())
            setSettings(res);
            console.log(resQuestions)
            setQuestions(resQuestions)
        }
        asyncFetch();
    }, [])

    const openQuestionModal = (el) => {
        setModalShow(!modalShow);
        // + gör om string till integer, om stringen redan är en siffra
        setActiveQuestion(+el.target.id)
        console.log(el.target.id)
    }

    const QuestionModal = ({ questionId }) => {
        console.log(questionId, 1)
        if (!questionId) return;
        const currentQuestion = questions.find(el => el.id === questionId)

        return (
            <div className='question-modal'>
                <div className='question-modal-container'>
                    <h3 className='question-modal-header'>
                        {currentQuestion.question}
                    </h3>
                    <div className='question-answer-container'>
                        <p>newAnswer</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='settings-container'>
                <div>
                    <h2>Settings</h2>
                    <div>
                        <h3>General quiz settings</h3>
                        <p>Quiz name:</p>
                        <input type={'text'}/>

                    </div>
                    <div>
                        <h3>Color settings</h3>
                        <h4>Color scheme</h4>
                        <p>Primary:</p>
                        <input type={'color'}/>
                        <p>Secondary:</p>
                        <input type={'color'}/>

                        <h4>Other colors</h4>
                        <p>Answer color:</p>
                        <input type={'color'}/>
                        <p>Selected answer color:</p>
                        <input type={'color'}/>
                    </div>
                </div>

                <div>
                    <h3>Questions</h3>
                    {questions.length && questions.map((question) => {
                        return (
                            <div style={{border: '1px solid black'}} onClick={(el) => openQuestionModal(el)}>
                                <p id={question.id}>{question.question}<FontAwesomeIcon icon={faWrench}/></p>
                            </div>
                        )
                    })}
                </div>

            </div>
            {modalShow && <QuestionModal questionId={activeQuestion}/>}
        </>
    )
}

export default Settings;