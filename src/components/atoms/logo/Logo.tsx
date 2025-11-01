import LogoIcon from "../icons/LogoIcon";
import Label from "../label";
import { useTranslation } from 'react-i18next';
import styles from './Logo.module.scss';
import useTypingEffect from '../../../shared/hooks/useTypingEffect';

interface LogoProps {
    hideName?: boolean;
}

function Logo({ hideName }: LogoProps) {
    const { t } = useTranslation();
    const appName = t('APP_NAME');
    
    const { currentText } = useTypingEffect({
        text: appName,
        initialDisplaySpeed: 30,
        initialDeleteSpeed: 50,
        typingSpeed: 100,
        pauseDuration: 1500,
        deleteSpeed: 80,
    });

    return (
        <div className={styles.logo}>
            <LogoIcon color={'s-color-fg-logo'} className={styles['logo-icon']} />
            {!hideName && <Label as='h1' font='typo-primary-xl-medium' className={styles['logo__title']} >
                {currentText}
                <span className={styles.cursor}>&#124;</span>
            </Label>}
        </div>
    );
}

export default Logo;