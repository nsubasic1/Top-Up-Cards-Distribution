import React, {useState} from 'react';

const QuestionItems =(props) =>{
    return(
        <div id = "odg">
        {
             props.questions.map(question=>(
                <li key={question}>{question}<input type="text"></input></li>
            ))
        }        
        </div>   
    );
}

export default QuestionItems;