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
                type="number"
                id="coefficient"
                className="w-20 pl-4 py-2 text-gray-700 rounded-r-lg border border-blue-100 h-10 focus:outline-none focus:border-blue-600 text-right"
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
