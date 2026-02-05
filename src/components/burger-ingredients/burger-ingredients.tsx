import { ingredientTypeMapping } from '@/utils/constants';
import { useMemo, useRef, useState } from 'react';

import { IngredientType, type TIngredient, type TTab } from '@utils/types';

import { BurgerIngredientSection } from '../burger-ingredient-section/burger-ingredient-section';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
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
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

  const handleTabs = (tab: TTab): void => {
    sectionRefs.current[tab.id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <section className={styles.burger_ingredients}>
        <Tabs tabs={tabs} onChange={handleTabs} />
        <section className={styles.sections_list}>
          {sections.map((section) => (
            <BurgerIngredientSection
              key={section.type}
              ref={(el) => {
                sectionRefs.current[section.type] = el;
              }}
              type={section.type}
              ingredients={section.ingredients}
              onIngredientClick={setSelectedIngredient}
            />
          ))}
        </section>
      </section>
      {selectedIngredient && (
        <Modal
          open={Boolean(selectedIngredient)}
          onClose={() => setSelectedIngredient(null)}
          title="Детали ингредиента"
        >
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
