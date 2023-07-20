import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export interface Tab {
  key: string;
  title: string;
  content: any;
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
        {tabs.map((tab: any, i: number) => (
          <button
            aria-label={`Tab ${i + 1} of ${tabs.length} : ${tab.title}`}
            key={tab.key}
            className={`
              font-medium
              rounded-lg px-4 py-2 mx-1 first:ml-0 last:mr-0
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
              ${activeTab === tab.key ?
                'bg-blue-600 hover:bg-blue-700 text-white'
                :
                'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100'
              }`}
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