import { IngredientContent } from '@/components/ingredient-modal/ingredient-modal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation } from 'react-router-dom';

import { HomePage } from '../home-page/home-page';

export const IngredientView = (): React.JSX.Element | null => {
  const location = useLocation();
  const state = location.state as { background?: unknown } | null;
  const isModal = Boolean(state?.background);

  if (isModal) {
    return (
      <>
        <DndProvider backend={HTML5Backend}>
          <HomePage />
        </DndProvider>
        <IngredientContent isModal />
      </>
    );
  }

  return <IngredientContent isModal={false} />;
};
