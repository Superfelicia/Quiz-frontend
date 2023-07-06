import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWrench} from '@fortawesome/free-solid-svg-icons'
import Modal from "../components/Modal";

const Settings = () => {
    const [settings, setSettings] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(0);
    let currentQuestion;

    useEffect(() => {
        async function asyncFetch() {
            const res = await fetch('http://localhost:3001/settings');
            const resQuestions = await fetch('http://localhost:3001/getQuizQuestions')
                .then(res => res.json())
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
    }

    const QuestionModal = ({questionId}) => {
        if (!questionId) return;
        currentQuestion = questions.find(el => el.id === questionId);

        return (
            <Modal currentQuestion={currentQuestion}/>
        )
    }

    const QuestionComponent = (props) => {
        const [edit, setEdit] = useState(false);
        const [value, setValue] = useState('');

        const handleChange = (event) => {
            const newValue = event.target.value;
            setValue(newValue);
        }

        const handleClick = () => {
            setEdit(false);
            props.question.question = value;
            console.log('value changed');
        }

        return (
            <div style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between', border: '1px solid pink'}}>
                <div onClick={() => setEdit(true)} style={{
                    margin: '10px',
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    {!edit ? (
                        <p id={props.question.id}>{props.question.question}</p>
                    ) : (
                        <input type={'text'} value={value} onChange={(event) => handleChange(event)}/>
                    )}
                </div>
                <div style={{alignSelf: 'center', padding: '10px', cursor: 'pointer'}} onClick={() => handleClick()}>
                    <FontAwesomeIcon icon={faWrench}/>
                </div>
            </div>

        )
    }


    return (
        <>
            <div className='settings-container'>
                <div className='settings-header'>
                    <h2>Settings</h2>
                </div>
                <div className='container'>
                    <div className='settings-grid-1'>
                        <h3 className='settings-h3'>General quiz settings</h3>
                        <div style={{margin: '5px'}}>
                            <p style={{marginBottom: '10px',}}>Quiz name:</p>
                            <input type={'text'}/>
                            <button type={'submit'}
                                    style={{marginLeft: '5px', border: '1px solid black', borderRadius: '5px'}}>Submit
                            </button>
                        </div>
                    </div>
                    <div className='settings-grid-2'>
                        <h3 className='settings-h3'>Color settings</h3>
                        <h4 style={{fontStyle: 'italic', fontWeight: '400'}}>Color scheme</h4>
                        <p>Primary:</p>
                        <input type={'color'}/>
                        <p>Secondary:</p>
                        <input type={'color'}/>

                        <h4 style={{fontStyle: 'italic', fontWeight: '400'}}>Other colors</h4>
                        <p>Answer color:</p>
                        <input type={'color'}/>
                        <p>Selected answer color:</p>
                        <input type={'color'}/>
                    </div>

                    <div className='settings-grid-3'>
                        <h3 className='settings-h3'>Questions</h3>
                        <h4 style={{fontStyle: 'italic', fontWeight: '400'}}>Add more answers to a question:</h4>
                        {questions.length && questions.map((question) => {
                            return <QuestionComponent question={question}/>
                        })}
                    </div>
                </div>


            </div>
            {modalShow && <QuestionModal questionId={activeQuestion}/>}
        </>
    )
}

export default Settings;