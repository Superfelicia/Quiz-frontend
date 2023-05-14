import {useState} from "react";
import '../styles/style.css';
const Quiz = () => {
    const [activeQuestion, setActiveQuestion] = useState(0);

    const onClickNext = () => {
        setActiveQuestion(prevActiveQuestion => prevActiveQuestion + 1);
        const nextQuestionIndex = activeQuestion + 1;

        setActiveQuestion(nextQuestionIndex);
    }


    return (
        <div>
            <div className="display-container">
                <div className="header">
                    <div className="number-of-count">
                        <span>NF10 reunion quiz</span>
                    </div>
                </div>
                <div className="question-container">
                    <span className="question">Question</span>
                </div>
                <div className="container">
                    <div id="option-div">Choice</div>
                </div>
                <button className="next-button" onClick={onClickNext}>{'Next'}</button>
            </div>
        </div>
    );
}

export default Quiz;