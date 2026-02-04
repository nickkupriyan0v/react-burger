import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import type { TTab } from '@/utils/types';

import styles from './tabs.module.css';

type TTabsProps = {
  tabs: TTab[];
  onChange: (tab: TTab) => void;
};

export const Tabs = ({ tabs, onChange }: TTabsProps): React.JSX.Element => {
  const [active, setActive] = useState(tabs[0]);

  const handleClick = (tab: TTab): void => {
    setActive(tab);
    onChange(tab);
  };
  return (
    <nav>
      <ul className={styles.menu}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value="bun"
            active={active.id === tab.id}
            onClick={() => handleClick(tab)}
          >
            {tab.title}
          </Tab>
        ))}
      </ul>
    </nav>
  );
};
