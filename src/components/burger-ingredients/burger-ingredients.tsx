import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useGetIngredientsQuery } from '@/services/ingredients';
import { clearSelectedIngredient, selectIngredient } from '@/services/modal-ingredient';
import { ingredientTypeMapping } from '@/utils/constants';
import { IngredientType, type TIngredient, type TTab } from '@/utils/types';
import { useCallback, useMemo, useRef, useState } from 'react';

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

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { data: ingredients = [] } = useGetIngredientsQuery({});
  const selectedIngredient = useAppSelector(
    (state) => state.modalIngredient.selectedIngredient
  );

  const [activeTab, setActiveTab] = useState<TTab>(tabs[0]);
  const sections = useMemo(() => groupByType(ingredients), [ingredients]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const titleRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const containerRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    let closestTab = tabs[0];
    let closestDistance = Infinity;

    tabs.forEach((tab) => {
      const titleElement = titleRefs.current[tab.id];
      if (!titleElement) return;

      const titleTop = titleElement.getBoundingClientRect().top;
      const distance = Math.abs(titleTop - containerTop);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestTab = tab;
      }
    });

    setActiveTab(closestTab);
  }, []);

  const handleTabs = (tab: TTab): void => {
    setActiveTab(tab);
    sectionRefs.current[tab.id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleIngredientClick = (ingredient: TIngredient): void => {
    dispatch(selectIngredient(ingredient));
  };

  const handleCloseModal = (): void => {
    dispatch(clearSelectedIngredient());
  };

  return (
    <>
      <section className={styles.burger_ingredients}>
        <Tabs tabs={tabs} onChange={handleTabs} active={activeTab} />
        <section
          ref={containerRef}
          onScroll={handleScroll}
          className={styles.sections_list}
        >
          {sections.map((section) => (
            <BurgerIngredientSection
              key={section.type}
              ref={(el) => {
                sectionRefs.current[section.type] = el;
              }}
              titleRef={(el) => {
                titleRefs.current[section.type] = el;
              }}
              type={section.type}
              ingredients={section.ingredients}
              onIngredientClick={handleIngredientClick}
            />
          ))}
        </section>
      </section>
      {selectedIngredient && (
        <Modal
          open={Boolean(selectedIngredient)}
          onClose={handleCloseModal}
          title="Детали ингредиента"
        >
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
