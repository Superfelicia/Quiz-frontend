import {useEffect, useState} from "react";

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

        duplicates.sort((a, b) => (a.count < b.count) ? 1 : -1);

        return duplicates;
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
                            {getResultAnswers().map(({object, count}, index) => (
                                <div id="option-div" key={index}>
                                    {object} {count}
                                </div>
                            ))}
                        </div>
                        <button className="next-button"
                                onClick={onClickNext}>{activeQuestion === questions.length - 1 ? 'End of results' : 'Next'}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Results;