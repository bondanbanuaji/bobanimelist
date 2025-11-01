import LogoIcon from "../icons/LogoIcon";
import Label from "../label";
import { useTranslation } from 'react-i18next';
import styles from './Logo.module.scss';

interface LogoProps {
    hideName?: boolean;
}

function Logo({ hideName }: LogoProps) {
    const { t } = useTranslation();
    
    return (
        <div className={styles.logo}>
            <LogoIcon size={48} color={'s-color-fg-logo'} />
            {!hideName && <Label as='h1' font='typo-primary-xl-medium' className={styles['logo__title']} >
                {t('APP_NAME')}
            </Label>}
        </div>
    );
}

export default Logo;