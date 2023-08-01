import React, { useEffect } from 'react';
import { useState } from 'react';
const GradingTest = (props: any) => {
    const [inputCoefficientValue, setInputCoefficientValue] = useState('1');

    const handleCoefficientValueChange = (e: any) => {
        setInputCoefficientValue(e.target.value);
        props.handleTestCoefficientChangeValue(e.target.value, props.test.id, props.test.exercise);
    }

    useEffect(() => {
        if (props.test)
            setInputCoefficientValue(props.test.coefficient || "1")
    }, [props.test])

    return (
        <div className="flex items-center h-10">
            <span className="bg-blue-50 border border-blue-100 rounded-l-lg text-gray-700 h-10 flex items-center px-3">
                {props.test.name}
            </span>
            <input
                type="number"
                id="notation"
                className="w-20 px-4 py-2 text-gray-700 rounded-r-lg border border-blue-100 h-10 focus:outline-none focus:border-blue-600"
                placeholder=""
                min="0"
                max="100"
                step="1"
                value={inputCoefficientValue}
                onChange={handleCoefficientValueChange}
                name={props.test.name}
            />
        </div>
    );
};

export default GradingTest;