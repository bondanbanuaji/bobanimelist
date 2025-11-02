import styles from './Footer.module.scss';
import Label from '../../atoms/label';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router';
import MailIcon from '../../atoms/icons/MailIcon';

function Footer() {
    const { t } = useTranslation();
    
    return (
        <footer className={styles.footer}>
            <div className={styles.footer__content}>
                <div className={styles.footer__description}>
                    <Label as="p" font="typo-primary-m-regular">
                        {t('APP_DESC')}
                    </Label>
                </div>
                <nav className={styles.footer__socials}>
                    <Link to='mailto:bondanbanuaji@gmail.com' target="_blank" rel="noopener noreferrer" >
                        <MailIcon size={24} color='s-color-fg-primary' className={styles['footer__actions']} />
                    </Link>
                </nav>
            </div>
            <Label as='p' font='typo-primary-s-medium' className={styles['footer__copy-right']}>
                &copy; {new Date().getFullYear()} {t('COPY_RIGHT')}
            </Label>
        </footer>
    );
}

export default Footer;