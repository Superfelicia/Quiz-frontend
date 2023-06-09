import {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCrown, faMedal, faAward} from '@fortawesome/free-solid-svg-icons';
import {Link, useLocation} from "react-router-dom";

const Results = () => {
    const location = useLocation();
    const questions = location.state;

    const [answers, setAnswers] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    console.log(questions, 'hej');

    useEffect(() => {
        console.log(answers, 'svar');
    }, [answers])

    useEffect(() => {
        const headers = new Headers();
        headers.append('ngrok-skip-browser-warning', 'true');

        Promise.all([
            fetch('https://647c-82-196-111-182.ngrok-free.app/getQuizAnswers', {headers}),
        ])
            .then(([resAnswers]) =>
                Promise.all([resAnswers.json()])
            )
            .then(([dataAnswers]) => {
                setAnswers(dataAnswers);
            });
    }, []);


    const onClickNext = () => {
        if (activeQuestion <= questions.length - 2) {
            setActiveQuestion(prevActiveQuestion => prevActiveQuestion + 1);
            const nextQuestionIndex = activeQuestion + 1;

            setActiveQuestion(nextQuestionIndex);
        } else {
            setIsFinished(true);
        }
    }

    const getResultAnswers = () => {
        let matchedAnswers = [];
        const formattedAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            if (questions[activeQuestion] === questions[i]) {
                matchedAnswers = answers[i];
            }
        }

        let answerCounts = matchedAnswers.reduce((count, answer) => {
            count[answer] = count[answer] + 1 || 1;
            return count
        }, {});
        // Find objects occurring multiple times
        for (let el in answerCounts) {
            if (answerCounts.hasOwnProperty(el)) {
                formattedAnswers.push({name: el, count: answerCounts[el]});
            }
        }

        let sortedAnswers = formattedAnswers.sort((a, b) => b.count - a.count);

        const identicalCountCollection = new Map();

        for (let i = 0; i < sortedAnswers.length; i++) {
            let voteAmount = sortedAnswers[i].count;
            if (identicalCountCollection.has(voteAmount)) {
                const existingNames = identicalCountCollection.get(voteAmount);

                existingNames.push(sortedAnswers[i].name);
                identicalCountCollection.set(sortedAnswers[i].count, existingNames);
            } else {
                identicalCountCollection.set(voteAmount, [sortedAnswers[i].count, sortedAnswers[i].name]);
            }
        }
        return Array.from(identicalCountCollection.values());
    }

    const renderQuestion = () => {
        if (questions[activeQuestion] === undefined) {
            return 'No more questions';
        } else {
            return questions[activeQuestion].question;
        }
    }

    const endOfResults = () => {
        return (
            <>
                <div className="header">
                    <h4>Results</h4>
                </div>
                <div className="question-container">
                    <span className="question">End of results</span>
                </div>
                <div>
                    <Link className='next-button' to={'/'}>Back to quiz</Link>
                </div>
            </>
        );
    }

    const handleResultStyling = (index) => {
        switch (index) {
            case 0:
                return 'result-gold';
            case 1:
                return 'result-silver';
            case 2:
                return 'result-bronze';
            default:
                return 'result-container';
        }
    }

    const ResultsIcon = ({index}) => {
        let icon;
        let size;
        switch (index) {
            case 0:
                icon = faCrown
                size = '2xl'
                break;
            case 1:
            case 2:
                icon = faMedal
                size = 'xl'
                break;
            default:
                icon = faAward
                size = 'lg'
                break;
        }
        return (
            <div className='award-icon'>
                <FontAwesomeIcon icon={icon} size={size}></FontAwesomeIcon>
            </div>
        )
    }

    if (questions?.length === 0 || !questions) return null;

    return (
        <div className="display-container">
            {isFinished ? endOfResults() : (
                <>
                    <div className="header">
                        <h4>Results</h4>
                    </div>
                    <div className="question-container">
                        <span className="question">{renderQuestion()}</span>
                    </div>
                    <div className="container-results">
                        {getResultAnswers().map((el, index) => {
                                return <div key={index} className={handleResultStyling(index)}>
                                    <div className='result-answer'>
                                        {el.map((item, index) => {
                                            if (typeof item === 'string')
                                                return (
                                                    <div key={index} className='text'>
                                                        {item}
                                                    </div>
                                                );
                                            return null;
                                        })}
                                    </div>
                                    <ResultsIcon index={index}/>
                                    <div className='result-answer'>
                                        {el.map((item, index) => {
                                            if (typeof item === 'number') {
                                                return (
                                                    <div key={index} className='text-count'>
                                                        {item}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            }
                        )}
                    </div>
                    <button className="next-button"
                            onClick={onClickNext}>{activeQuestion === questions.length - 1 ? 'End of results' : 'Next'}
                    </button>
                </>
            )}
        </div>
    )
}

export default Results;