import styles from './empty-state.module.css';

export const EmptyState = (): React.JSX.Element => {
  return (
    <div className={styles.empty_state}>
      <p className="text text_type_main-medium">Перетащите сюда булку и ингредиенты</p>
    </div>
  );
};
