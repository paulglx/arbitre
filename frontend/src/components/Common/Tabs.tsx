import { useState } from 'react';

const Tabs = (props: any) => {
  const [activeTab, setActiveTab] = useState(props.tabs[0].eventKey);

  const handleTabClick = (eventKey: String) => {
    setActiveTab(eventKey);
  };

  return (
    <>
      <div className="flex mb-3">
        {props.tabs.map((tab: any) => (
          <button
          key={tab.eventKey}
          className={`${tab.buttonClassName} ${activeTab === tab.eventKey ? "z-10" : ""} px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === tab.eventKey ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabClick(tab.eventKey)}
          >
            {tab.title}
          </button>
   ))}
      </div>
        {props.tabs.map((tab: any) => (
        <div key={tab.eventKey} className={activeTab === tab.eventKey ? '' : 'hidden'}>
          {tab.component}
        </div>
      ))}
    </>
  );
};

export default Tabs;