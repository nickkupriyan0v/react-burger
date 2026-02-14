import { selectTotalPrice } from '@/services/burger-constructor';
import { useSelector } from 'react-redux';

export const useTotalPrice = (): number => {
  return useSelector(selectTotalPrice);
};
