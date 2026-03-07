import { useAppDispatch } from '@/hooks/redux';
import { useGetIngredientsQuery } from '@/services/ingredients';
import { clearSelectedIngredient, selectIngredient } from '@/services/modal-ingredient';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

type TIngredientContentProps = {
  isModal?: boolean;
};

export const IngredientContent = ({
  isModal = false,
}: TIngredientContentProps): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: ingredients = [] } = useGetIngredientsQuery({});

  const ingredient = ingredients.find((ing) => ing._id === id);

  useEffect(() => {
    if (ingredient && id) {
      dispatch(selectIngredient(ingredient));
    }
  }, [ingredient, id, dispatch]);

  useEffect(() => {
    if (id && !ingredient) {
      void navigate('/not-found', { replace: true });
    }
  }, [id, ingredient, navigate]);

  if (!ingredient) {
    return null;
  }

  const handleCloseModal = (): void => {
    dispatch(clearSelectedIngredient());
    void navigate(-1);
  };

  if (isModal) {
    return (
      <Modal open onClose={handleCloseModal} title="Детали ингредиента">
        <IngredientDetails ingredient={ingredient} />
      </Modal>
    );
  }

  return (
    <div className="p-25" style={{ textAlign: 'center' }}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>
      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <IngredientDetails ingredient={ingredient} />
        </div>
      </main>
    </div>
  );
};
