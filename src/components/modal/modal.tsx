import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = { open: boolean; onClose: () => void; title?: string };

export const Modal = ({
  open,
  onClose,
  title,
  children,
}: PropsWithChildren<TModalProps>): React.JSX.Element | null => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <div className={`${styles.modal_title} text text_type_main-medium`}>
            {title}
          </div>
          <CloseIcon className={styles.modal_close} type="primary" onClick={onClose} />
        </div>
        {children}
      </div>
    </ModalOverlay>,
    document.body
  );
};
