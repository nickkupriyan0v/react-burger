import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderNumber: number | null;
};

export const OrderDetails = ({ orderNumber }: OrderDetailsProps): React.JSX.Element => {
  return (
    <article className={styles.order_details}>
      <p className="text text_type_digits-large">{orderNumber ?? '...'}</p>
      <p className="text text_type_main-medium mt-8 mb-15">идентификатор заказа</p>
      <img className="mb-15" src="/done.svg" alt="Готово" />
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive mb-15">
        Дождитесь готовности на орбитальной станции
      </p>
    </article>
  );
};
