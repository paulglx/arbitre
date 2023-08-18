import React, { useEffect } from 'react';

import { useState } from 'react';

const GradingTest = (props: any) => {
    const [inputCoefficientValue, setInputCoefficientValue] = useState('1');

    const handleCoefficientValueChange = (e: any) => {
        let value = e.target.value;
        value = value > 100 ? 100 : value;
        value = value < 0 ? 0 : value;

        setInputCoefficientValue(value);
        props.handleTestCoefficientChangeValue(value, props.test.name, props.test.id, props.test.exercise);
    }

    useEffect(() => {
        if (props.test)
            setInputCoefficientValue(props.test.coefficient || "0")
    }, [props.test])

    return (
        <div className="flex items-center h-10">
            <label className={`bg-blue-50 border border-blue-100 rounded-l-lg h-10 flex items-center px-3 ${props.test.name ? "text-gray-700" : "text-gray-500"}`}>
                {props.test.name || "Untitled test"}
            </label>
            <input
                aria-label='coefficient'
                className="w-20 pl-4 py-2 text-gray-700 rounded-r-lg border border-blue-100 h-10 focus:outline-none focus:border-blue-600 text-right"
                id="coefficient"
                max="100"
                min="0"
                name={props.test.name}
                onChange={handleCoefficientValueChange}
                placeholder=""
                step="1"
                type="number"
                value={inputCoefficientValue}
            />
        </div>
    );
};

export default GradingTest;
