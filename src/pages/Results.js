import {useEffect, useState} from "react";

const Results = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [allAnswers, setAllAnswers] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

    let newResultArr = [];
    let duplicates = [];


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
            setSelectedAnswer(null);
            setSelectedAnswerIndex(null);
        }
    }

    const getResultAnswers = () => {
        for (let i = 0; i < answers.length; i++) {
            if (questions[activeQuestion] === questions[i]) {
                console.log(answers[i])
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

        return duplicates;
    };


    useEffect(() => {
        if (answers.length === 0) {
            const resultAnswers = getResultAnswers();
            console.log(resultAnswers)

            setAllAnswers(prevAllAnswers => [...prevAllAnswers, ...resultAnswers]);
        }
    }, [answers]);


    const renderQuestion = () => {
        if (questions[activeQuestion] === undefined) {
            return 'No more questions';
        } else {
            return questions[activeQuestion].question;
        }
    }

    return (
        <div>
            <div className="display-container">
                <div className="header">
                    <div>
                        <span>Results</span>
                    </div>
                </div>
                <div className="question-container">
                    <span className="question">{renderQuestion()}</span>
                </div>
                <div className="container">
                    {getResultAnswers().map(({object, count}, index) => (
                        <div id="option-div" key={index}>
                            {object} {count}
                        </div>
                    ))}
                </div>
                <button className="next-button"
                        onClick={onClickNext}>{activeQuestion === questions.length - 1 ? 'End of results' : 'Next'}
                </button>
            </div>
        </div>
    )
}

export default Results;