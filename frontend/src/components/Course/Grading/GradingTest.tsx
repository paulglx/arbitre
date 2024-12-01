import { useEffect } from 'react';
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
    <div className="inline-flex items-center text-sm pe-1 pb-1">
      <label className={`bg-blue-50 border border-blue-100 rounded-l-lg flex items-center px-2 py-0.5 ${props.test.name ? "text-gray-700" : "text-gray-500"}`}>
        {props.test.name || "Untitled test"}
      </label>
      <input
        aria-label='coefficient'
        className=" pl-1 py-0.5 text-gray-700 rounded-r-lg border border-s-0 border-blue-100  focus:outline-none focus:border-blue-600 text-right"
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
