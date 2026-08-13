interface ITabsNavigationProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export const TabsNavigation = ({ tabs, activeTab, onChange }: ITabsNavigationProps) => (
  <div className="tabsList" role="tablist">
    {tabs.map((tab) => (
      <div
        key={tab}
        role="tab"
        aria-selected={tab === activeTab}
        className={`tabNavigationCard${tab === activeTab ? ' active' : ''}`}
        onClick={() => onChange(tab)}
      >
        {tab}
        <div className="tabNavigationCard-decoration" />
      </div>
    ))}
  </div>
);
