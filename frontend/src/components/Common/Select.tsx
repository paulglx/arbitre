import { useState } from "react";

const Select = (props: any) => {
  const [selected, setSelected] = useState({name: null, code: null})
  const [isOpen, setIsOpen] = useState(false)

  const handleSelection = (option: any) => {
    setSelected(option);
    setIsOpen(false);
  }

  return (
  <div>
  <div className="relative w-32 h-10">
    <button 
      type="button" 
      className="relative w-full h-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" 
      aria-haspopup="listbox" 
      aria-expanded="true" 
      aria-labelledby="listbox-label"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="flex items-center">
        <span className="ml-3 block truncate">{selected.name === null ? props.title : selected.name}</span>
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    {isOpen && (
      <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
        
        <li className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9" id="listbox-option-0" role="option">
          <div className="flex flex-col items-center">
            {props.options.map((option: any, index: any) => (
                <span 
                  key={index} 
                  className={`${option === selected ? "font-semibold" : "font-normal"} ml-3 block truncate`} 
                  onClick={() => handleSelection(option)}
                >
                  {option.name}
                </span >
            ))}
          </div>
        </li>
      </ul>
    )}
    
  </div>
</div>

  )
  };
    
  export default Select;

/*import { Flag } from "heroicons-react";

const Select = (props: any) => {
    return (
        <select className="bg-gray-200 border border-gray-200 text-gray-500 h-10 text-sm rounded-lg block w-full p-2.5">
          {props.options.map((option: any, index: any) => (
            <option key={index} value={option.code}>
              {option.name}
            </option>
          ))}
          <Flag className="h-6 w-6 ml-2" />
        </select>
    )
};
  
export default Select;
*/

  