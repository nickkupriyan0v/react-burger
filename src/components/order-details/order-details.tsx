import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  return (
    <article className={styles.order_details}>
      <p className="text text_type_digits-large">034536</p>
      <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
      <p className="text text_type_main-medium mt-8">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive mt-15">
        Дождитесь готовности на орбитальной станции
      </p>
    </article>
  );
};
