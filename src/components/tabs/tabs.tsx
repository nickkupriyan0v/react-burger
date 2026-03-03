import { Tab } from '@krgaa/react-developer-burger-ui-components';

import type { TTab } from '@/utils/types';

import styles from './tabs.module.css';

type TTabsProps = {
  tabs: TTab[];
  onChange: (tab: TTab) => void;
  active?: TTab;
};

export const Tabs = ({ tabs, onChange, active }: TTabsProps): React.JSX.Element => {
  const activeTab = active ?? tabs[0];

  const handleClick = (tab: TTab): void => {
    onChange(tab);
  };

  return (
    <nav>
      <ul className={styles.menu}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            active={activeTab.id === tab.id}
            onClick={() => handleClick(tab)}
          >
            {tab.title}
          </Tab>
        ))}
      </ul>
    </nav>
  );
};
