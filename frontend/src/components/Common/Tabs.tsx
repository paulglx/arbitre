import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export interface Tab {
  key: string;
  title: string;
  content: any;
  buttonClassName: string;
}

export interface TabsProps {
  tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {

  const urlTab = useParams()?.tab;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const defaultTab = tabs[0].key;

  useEffect(() => {
    if (!urlTab) {
      navigate(`./${defaultTab}`, { replace: true });
    }
    setActiveTab(urlTab!);
  }, [urlTab, navigate, defaultTab]);

  const handleTabClick = (key: String) => {
    setActiveTab(key as string);
    navigate(`./../${key}`, { replace: true });
  };

  return (
    <>
      <div className="flex mb-3">
        {tabs.map((tab: any) => (
          <button
            key={tab.key}
            className={`${tab.buttonClassName} ${activeTab === tab.key ? "z-10" : ""} px-4 py-2 border border-l-0 first:border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs.find((tab: any) => tab.key === activeTab)?.content}
    </>
  );
};

export default Tabs;