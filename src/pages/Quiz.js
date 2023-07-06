import {useEffect, useState} from "react";
import '../styles/style.css';
import {Link} from "react-router-dom";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [result, setResult] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const headers = new Headers();
        headers.append('ngrok-skip-browser-warning', 'true');

        Promise.all([
            fetch('https://647c-82-196-111-182.ngrok-free.app/getQuizQuestions', {headers}),
            fetch('https://647c-82-196-111-182.ngrok-free.app/getQuizChoices', {headers}),
        ])
            .then(([resQuestions, resChoices]) =>
                Promise.all([resQuestions.json(), resChoices.json()])
            )
            .then(([dataQuestions, dataChoices]) => {
                setQuestions(dataQuestions);
                setChoices(dataChoices);
            });
    }, []);

    const onClickNext = () => {
        if (activeQuestion <= questions.length - 2) {
            setActiveQuestion(prevActiveQuestion => prevActiveQuestion + 1);
            const nextQuestionIndex = activeQuestion + 1;

            setActiveQuestion(nextQuestionIndex);
            setSelectedAnswer(null);
            setSelectedAnswerIndex(null);
        }
    }

    const renderQuestion = () => {
        if (questions[activeQuestion] === undefined) {
            return 'No more questions';
        } else {
            return questions[activeQuestion].question;
        }
    }

    const onSelectedAnswer = (answer, index) => {
        setSelectedAnswer(answer);
        setSelectedAnswerIndex(index);

        setResult(prevResult => ({
            ...prevResult,
            [activeQuestion]: {
                choice: choices[index].choice,
            }
        }));
    }

    const onFinishedClick = () => {
        fetch('https://647c-82-196-111-182.ngrok-free.app/postQuizAnswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result,
            }),
        })
        setIsFinished(true)
    }

    const quizIsFinished = () => {
        return (
            <>
                <div className="header">
                    <h4>Quiz inactive</h4>
                </div>
                <div className="question-container">
                    <span className="question">End of quiz</span>
                </div>
                <div>
                    <Link className="result-button" to={'/results'} state={questions}>Show result</Link>
                </div>
            </>
        );
    }

    return (
        <div className="display-container">
            {questions.length > 0 &&
                <div>
                    {isFinished ? quizIsFinished() : (
                        <>
                            <div className="header">
                                <div>
                                    <h4>NF10 quiz</h4>
                                </div>
                            </div>
                            <div className="question-container">
                                <span className="question">{renderQuestion()}</span>
                            </div>
                            <div className="container">
                                {choices.map(({choice}, index) => (
                                    <div id="option-container"
                                         onClick={() => onSelectedAnswer(choice.id, index, selectedAnswer)}
                                         className={index === selectedAnswerIndex ? 'selected-answer' : null}
                                         key={index}>
                                        <div className='option-text'>
                                            {`${choice}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="next-button" disabled={selectedAnswerIndex === null}
                                    onClick={activeQuestion >= questions.length - 1 ? onFinishedClick : onClickNext}>{activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </>
                    )}
                </div>
            }
        </div>
    );
}

export default Quiz;