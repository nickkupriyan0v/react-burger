import { Link } from 'react-router-dom';

import styles from './helper-link.module.css';

type THelperLinkProps = {
  text: string;
  linkText: string;
  link: string;
};
export const HelperLink = ({
  text,
  linkText,
  link,
}: THelperLinkProps): React.JSX.Element => (
  <div className={styles.helper_link}>
    <span className="text text_type_main-default text_color_inactive">{text}</span>
    <Link to={link} className={styles.link}>
      {linkText}
    </Link>
  </div>
);
