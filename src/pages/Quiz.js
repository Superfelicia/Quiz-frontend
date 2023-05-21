import {useEffect, useState} from "react";
import '../styles/style.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [result, setResult] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/getQuizQuestions'),
            fetch('http://localhost:3001/getQuizChoices'),
        ])
            .then(([resQuestions, resChoices]) =>
                Promise.all([resQuestions.json(), resChoices.json()])
            )
            .then(([dataQuestions, dataChoices]) => {
                setQuestions(dataQuestions);
                setChoices(dataChoices);
            });
    }, []);
    
    useEffect(() => {
        console.log(result)
    },[result])

    const onClickNext = () => {
        if (activeQuestion <= questions.length - 2) {
            setActiveQuestion(prevActiveQuestion => prevActiveQuestion + 1);
            const nextQuestionIndex = activeQuestion + 1;

            setActiveQuestion(nextQuestionIndex);
            setSelectedAnswer(null);
            setSelectedAnswerIndex(null);
        } else {
            setIsFinished(true);
        }
    }

    const renderQuestion = () => {
        if (questions[activeQuestion] === undefined) {
            return 'No more questions';
        } else {
            return questions[activeQuestion].question;
        }
    }

    //sätter vilket svar som valts
    const onSelectedAnswer = (answer, index) => {
        setSelectedAnswer(answer);
        setSelectedAnswerIndex(index);
        //sparar och kopierar alla properties av det tidigare resultatet och använder spread operator (...prevResult)
        //activeQuestion agerar "key" för att veta vilken fråga svaret ska sparas på

        setResult(prevResult => ({
            ...prevResult,
            [activeQuestion]: {
                choice: choices[index].choice,
            }
        }));
    }

    const onFinishedClick = () => {
        fetch('http://localhost:3001/postQuizAnswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result,
            }),
        })
    }


    const quizIsFinished = () => {
        return (
            <>
                <div className="header">
                    <div>
                        <span>Quiz inactive</span>
                    </div>
                </div>
                <div className="question-container">
                    <span className="question">End of quiz</span>
                </div>
            </>
        );
    }

    return (
        <div>
            <div className="display-container">
                {isFinished ? quizIsFinished() : (
                    <>
                        <div className="header">
                            <div>
                                <span>Quiz active</span>
                            </div>
                        </div>
                        <div className="question-container">
                            <span className="question">{renderQuestion()}</span>
                        </div>
                        <div className="container">
                            {choices.map(({choice}, index) => (
                                <div id="option-div"
                                     onClick={() => onSelectedAnswer(choice.id, index)}
                                     className={index === selectedAnswerIndex ? 'selected-answer' : null}
                                     key={index}>
                                    {`${choice}`}
                                </div>
                            ))}
                        </div>
                        <button className="next-button" disabled={selectedAnswerIndex === null}
                                onClick={activeQuestion === questions.length - 1 ? onFinishedClick : onClickNext}>{activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Quiz;