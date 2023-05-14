import {useState} from "react";
import '../styles/style.css';

const Quiz = () => {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [result, setResult] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    const questions = [
        {
            question: 'What are you doing?'
        },
        {
            question: 'Huh.'
        },
        {
            question: 'Me?'
        },
    ];

    const choices = [
        {
            id: 0,
            name: 'Ante',
        },
        {
            id: 1,
            name: 'Me?',
        },
        {
            id: 2,
            name: 'Fellan',
        },
        {
            id: 3,
            name: 'Huh',
        },
    ];

    console.log(questions);
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
        //activeQuestion agerar "key" för att veta vilken fråga svaret ska sparas

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
                <div className="header">
                    <div className="number-of-count">
                        <span>NF10 reunion quiz</span>
                    </div>
                </div>
                {isFinished ? (
                    <>
                        End of quiz
                    </>
                ) : (
                    <>
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