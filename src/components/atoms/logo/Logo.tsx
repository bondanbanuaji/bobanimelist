import { useState, useEffect, useRef } from 'react';
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
    const [containerWidth, setContainerWidth] = useState(0);
    const sizerRef = useRef<HTMLDivElement>(null);
    
    const { currentText } = useTypingEffect({
        text: appName,
        initialDisplaySpeed: 30,
        initialDeleteSpeed: 50,
        typingSpeed: 100,
        pauseDuration: 1500,
        deleteSpeed: 80,
    });

    useEffect(() => {
        if (sizerRef.current) {
            setContainerWidth(sizerRef.current.getBoundingClientRect().width);
        }
    }, [appName]);

    return (
        <div className={styles.logo}>
            <LogoIcon color={'s-color-fg-logo'} className={styles['logo-icon']} />
            
            {/* Sizer element to measure the true width, rendered off-screen */}
            <div ref={sizerRef} style={{ position: 'absolute', visibility: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
                <Label as='h1' font='typo-primary-xl-medium' className={styles['logo__title']} style={{ width: 'auto' }}>
                    {appName}
                    <span style={{ display: 'inline-block', width: '0.3ch', marginLeft: 'var(--s-spacing-1)' }} />
                </Label>
            </div>

            {hideName ? (
                <div className={styles['title-container--hidden']} />
            ) : (
                <div className={styles['title-container']} style={{ width: containerWidth > 0 ? `${containerWidth}px` : 'auto', display: 'flex' }}>
                    <Label as='h1' font='typo-primary-xl-medium' className={styles['logo__title']} style={{ width: 'auto' }}>
                        {currentText}
                        <span className={styles.cursor}>|</span>
                    </Label>
                </div>
            )}
        </div>
    );
}

export default Logo;