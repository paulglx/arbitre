import React, { useState } from 'react';


const Dropdown = (props: any) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return(
        <div className="dropdown flex flex-wrap items-center text-base justify-center relative">
            <button
                id="dropdown-basic"
                onClick={toggleDropdown}
                className="inline-flex bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
            >
                {props.icon}
                <span className={`${props.titleClassName}`}>{props.title}</span>
            </button>

            {showDropdown && (
                <div className="absolute inline-block border border-gray-200 z-10 top-12 right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-basic">
                        { props.elements.map((e: any) => {
                            return <li>
                                <a
                                    href="#"
                                    className="block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={e.action}
                                >
                                    {e.name}
                                </a>
                            </li>
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}
export default Dropdown