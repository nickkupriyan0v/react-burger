import { ingredientTypeMapping } from '@/utils/constants';
import { useMemo, useRef } from 'react';

import { IngredientType, type TIngredient, type TTab } from '@utils/types';

import { BurgerIngredient } from '../burger-ingredient/burger-ingredient';
import { Tabs } from '../tabs/tabs';
import { groupByType } from './helpers';

import styles from './burger-ingredients.module.css';

const tabs: TTab[] = Object.values(IngredientType).map((value) => ({
  id: value,
  title: ingredientTypeMapping[value],
}));

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const sections = useMemo(() => groupByType(ingredients), [ingredients]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const handleTabs = (tab: TTab): void => {
    sectionRefs.current[tab.id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className={styles.burger_ingredients}>
      <Tabs tabs={tabs} onChange={handleTabs} />
      <section className={styles.ingredients_list}>
        {sections.map((section) => (
          <article
            key={section.type}
            ref={(el) => {
              sectionRefs.current[section.type] = el;
            }}
            id={section.type}
          >
            <h3 className="text text_type_main-medium">
              {ingredientTypeMapping[section.type]}
            </h3>
            <ul className={styles.burger_sections}>
              {section.ingredients.map((ingredient) => (
                <BurgerIngredient key={ingredient._id} ingredient={ingredient} />
              ))}
            </ul>
          </article>
        ))}
      </section>
    </section>
  );
};
