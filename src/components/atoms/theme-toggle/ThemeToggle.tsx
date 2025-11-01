import styles from './ThemeToggle.module.scss';
import { useAppSelector } from '../../../store';
import { useDispatch } from 'react-redux';
import { updateTheme } from '../../../store/slices/persistedAppContext';
import MoonIcon from '../icons/MoonIcon';
import SunIcon from '../icons/SunIcon';
import classNames from 'classnames';

function ThemeToggle() {

    const theme = useAppSelector((state) => state.persistedAppContext.theme);
    const dispatch = useDispatch();

    const handleThemeToggle = () => {
        dispatch(updateTheme(theme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={styles['theme-toggle']}>
            <div className={styles['theme-toggle__container']}>
                <button
                    className={classNames(styles['theme-toggle__button'], { 
                        [styles['theme-toggle__button--dark']]: theme === 'dark',
                        [styles['theme-toggle__button--light']]: theme === 'light'
                    })}
                    onClick={handleThemeToggle}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                >
                    <div className={styles['theme-toggle__icon-container']}>
                        <div className={styles['theme-toggle__icon-wrapper']}>
                            <MoonIcon 
                                size={16} 
                                color="s-color-fg-logo" 
                                className={classNames(styles['theme-toggle__icon-inside'], styles['theme-toggle__icon--moon-inside'], { 
                                    [styles['theme-toggle__icon--visible']]: theme === 'dark'
                                })} 
                            />
                        </div>
                        <div className={styles['theme-toggle__icon-wrapper']}>
                            <SunIcon 
                                size={16} 
                                color="s-color-fg-logo" 
                                className={classNames(styles['theme-toggle__icon-inside'], styles['theme-toggle__icon--sun-inside'], { 
                                    [styles['theme-toggle__icon--visible']]: theme === 'light'
                                })} 
                            />
                        </div>
                    </div>
                    <div className={styles['theme-toggle__slider']}>
                        <div className={classNames(styles['theme-toggle__circle'], { 
                            [styles['theme-toggle__circle--light']]: theme === 'light'
                        })} />
                    </div>
                </button>
            </div>
        </div>

    );
}

export default ThemeToggle;