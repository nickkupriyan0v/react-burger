import styles from './modal-overlay.module.css';

export const ModalOverlay = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className={styles.modal_overlay} onClick={onClick}>
      {children}
    </div>
  );
};
