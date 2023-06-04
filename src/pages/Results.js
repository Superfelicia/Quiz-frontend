import {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCrown, faMedal} from '@fortawesome/free-solid-svg-icons';

const Results = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [isFinished, setIsFinished] = useState(false);


    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/getQuizQuestions'),
            fetch('http://localhost:3001/getQuizAnswers'),
        ])
            .then(([resQuestions, resAnswers]) =>
                Promise.all([resQuestions.json(), resAnswers.json()])
            )
            .then(([dataQuestions, dataAnswers]) => {
                setQuestions(dataQuestions);
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
        let newResultArr = [];
        const duplicates = [];
        for (let i = 0; i < answers.length; i++) {
            if (questions[activeQuestion] === questions[i]) {
                newResultArr = answers[i];
            }
        }

        let duplicateCounts = newResultArr.reduce((count, answer) => (count[answer] = count[answer] + 1 || 1, count), {});
        // Find objects occurring multiple times
        for (let el in duplicateCounts) {
            if (duplicateCounts.hasOwnProperty(el)) {
                duplicates.push({object: el, count: duplicateCounts[el]});
            }
        }


        // 6, 3, 3, 2, 2

        let sorted = duplicates.sort((a, b) => b.count - a.count);

        const randomMap = new Map();

        for (let i = 0; i < sorted.length; i++) {
            let voteAmount = sorted[i].count;
            if (randomMap.has(voteAmount)) {
                const newObject = randomMap.get(voteAmount);

                newObject.push(sorted[i].object)
                randomMap.set(sorted[i].count, newObject);
            } else {
                randomMap.set(voteAmount, [sorted[i].count, sorted[i].object])
            }
        }

        let arr = Array.from(randomMap.values())
        console.log(arr);

        console.log(randomMap.forEach(el => console.log(el)))

        return arr;
    };

    const renderQuestion = () => {
        if (questions[activeQuestion] === undefined) {
            return 'No more questions';
        } else {
            return questions[activeQuestion].question;
        }
    }

    const resultsIsFinished = () => {
        return (
            <>
                <div className="header">
                    <div>
                        <span>Results</span>
                    </div>
                </div>
                <div className="question-container">
                    <span className="question">End of results</span>
                </div>
            </>
        );
    }

    const optionDivStyle = (index) => {
        switch (index) {
            case 0:
                return 'option-gold';
            case 1:
                return 'option-silver';
            case 2:
                return 'option-bronze';
            default:
                return 'option-div';
        }
    }

    return (
        <div>
            <div className="display-container">
                {isFinished ? resultsIsFinished() : (
                    <>
                        <div className="header">
                            <div>
                                <span>Results</span>
                            </div>
                        </div>
                        <div className="question-container">
                            <span className="question">{renderQuestion()}</span>
                        </div>
                        <div className="container-results">
                            {getResultAnswers().map((el, index) => {
                                    return <div id={optionDivStyle(index)}>
                                        <div className='result-answer'>
                                            {el.map(item => {
                                                if (typeof item === 'string')
                                                    return <div className='text'>
                                                        {item}
                                                    </div>
                                            })}
                                        </div>
                                        <div style={{alignSelf: "center", justifyContent: 'center'}}>
                                            {optionDivStyle(index) === 'option-gold' ?
                                                <FontAwesomeIcon icon={faCrown} size={'2xl'}></FontAwesomeIcon> :
                                                optionDivStyle(index) === 'option-silver' || 'option-bronze' ?
                                                    <FontAwesomeIcon icon={faMedal} size={optionDivStyle(index) === 'option-silver' ? 'xl' : 'lg'}></FontAwesomeIcon> : null}
                                        </div>
                                        <div className='result-answer'>
                                            {el.map(item => {
                                                if (typeof item === 'number') {
                                                    return <div className='text-count'>
                                                        {item}
                                                    </div>
                                                }
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
                )
                }
            </div>
        </div>
    )
}

export default Results;