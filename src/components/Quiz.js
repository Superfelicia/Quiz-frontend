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
        fetch('http://localhost:3001/getQuizQuestions')
            .then(res => res.json())
            .then(questions => setQuestions(questions))
            .catch(error => console.error('data not loaded', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/getQuizChoices')
            .then(res => res.json())
            .then(choices => setChoices(choices.choices));
    }, []);


    console.log(choices)

    console.log(result);

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
        console.log(questions)
        if (questions[activeQuestion] === undefined) {
            return 'No more questions';
        } else {
            return questions[activeQuestion].question;
        }
    }

    const quizIsFinished = () => {
        return (
            <>
                <div className="header">
                    <div>
                        <span>NF10</span>
                    </div>
                </div>
                <div className="question-container">
                    <span className="question">End of quiz</span>
                </div>
            </>
        );
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
                id: choices[index].id,
                name: choices[index].name,
            }
        }));
    }


    return (
        <div>
            <div className="display-container">
                {isFinished ? quizIsFinished() : (
                    <>
                        <div className="header">
                            <div>
                                <span>NF10 reunion quiz</span>
                            </div>
                        </div>
                        <div className="question-container">
                            <span className="question">{renderQuestion()}</span>
                        </div>
                        <div className="container">
                            {choices.map((choice, index) => (
                                <div id="option-div"
                                     onClick={() => onSelectedAnswer(choice.id, index)}
                                     className={index === selectedAnswerIndex ? 'selected-answer' : null}
                                     key={index}>
                                    {`${choice.name}`}
                                </div>
                            ))}
                        </div>
                        <button className="next-button" disabled={selectedAnswerIndex === null}
                                onClick={onClickNext}>{activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Quiz;