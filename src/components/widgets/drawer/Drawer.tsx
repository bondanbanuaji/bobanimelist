import styles from './Drawer.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateIsDrawerOpen } from '../../../store/slices/appContextSlice';
import { RemoveScroll } from 'react-remove-scroll';
import { AnimatePresence, motion } from 'motion/react';
import CloseIcon from '../../atoms/icons/CloseIcon';
import Label from '../../atoms/label';
import AnimeIcon from '../../atoms/icons/AnimeIcon';
import MangaIcon from '../../atoms/icons/MangaIcon';
import HomeIcon from '../../atoms/icons/HomeIcon';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../../atoms/theme-toggle';
import LogoIcon from '../../atoms/icons/LogoIcon';
import FacebookIcon from '../../atoms/icons/FacebookIcon';
import InstagramIcon from '../../atoms/icons/InstagramIcon';
import WhatsAppIcon from '../../atoms/icons/WhatsAppIcon';
import XIcon from '../../atoms/icons/XIcon';
import TikTokIcon from '../../atoms/icons/TikTokIcon';
import GithubIcon from '../../atoms/icons/GithubIcon';
import YouTubeIcon from '../../atoms/icons/YouTubeIcon';


const drawerVariants = {
    hidden: { 
        x: '100%',
        opacity: 0.8
    },
    visible: { 
        x: '0%', 
        opacity: 1,
        transition: { 
            type: "spring" as const, 
            damping: 25,
            stiffness: 300,
            duration: 0.4 
        } 
    },
    exit: { 
        x: '100%', 
        opacity: 0.8,
        transition: { 
            type: "spring" as const, 
            damping: 25,
            stiffness: 300,
            duration: 0.4 
        } 
    },
};

const backdropVariants = {
    hidden: { 
        opacity: 0,
        backdropFilter: 'blur(0px)'
    },
    visible: { 
        opacity: 1, 
        backdropFilter: 'blur(4px)',
        transition: { 
            duration: 0.4,
            ease: [0.37, 0, 0.63, 1] as const // Using cubic-bezier values instead of string
        } 
    },
    exit: { 
        opacity: 0, 
        backdropFilter: 'blur(0px)',
        transition: { 
            duration: 0.4,
            ease: [0.37, 0, 0.63, 1] as const // Using cubic-bezier values instead of string
        } 
    },
};

function Drawer() {
    const location = useLocation();
    const { t } = useTranslation();
    const isDrawerOpen = useAppSelector((state) => state.appContext.isDrawerOpen);
    const isHeaderNavHidden = useAppSelector((state) => state.appContext.isHeaderNavHidden);
    const dispatch = useAppDispatch();

    const handleDrawerClose = () => {
        dispatch(updateIsDrawerOpen(false));
    };

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    <motion.div
                        className={styles.drawer}
                        onClick={handleDrawerClose}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={backdropVariants}
                    >
                    </motion.div>
                    <RemoveScroll enabled={isDrawerOpen} style={{ position: 'absolute' }}>
                        <motion.aside
                            className={styles['drawer__content']}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={drawerVariants}
                        >
                            <div className={styles['drawer__header']}>
                                <div className={styles['drawer__logo']}>
                                    <LogoIcon size={32} color="s-color-fg-primary" />
                                    <span className={styles['drawer__logo-text']}>Menu</span>
                                </div>
                                <button 
                                    onClick={handleDrawerClose} 
                                    className={styles['drawer__close-button']}
                                    aria-label="Close menu"
                                >
                                    <CloseIcon size={24} color="s-color-fg-primary" />
                                </button>
                            </div>
                            
                            {isHeaderNavHidden && (
                                <motion.div 
                                    className={styles['drawer__menu-group']}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Label className={styles['drawer__menu-heading']} font='typo-primary-l-medium'>Explore</Label>
                                    <nav className={styles.drawer__nav}>
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link 
                                                onClick={handleDrawerClose} 
                                                to={{ pathname: '/', search: '' }} 
                                                className={`${styles['drawer__nav-item']} ${location.pathname === '/' ? styles['drawer__nav-item--active'] : ''}`}
                                            >
                                                <HomeIcon size={20} color="s-color-fg-primary" />
                                                <span className={styles['drawer__nav-text']}>{t('HOME')}</span>
                                            </Link>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link 
                                                onClick={handleDrawerClose} 
                                                to={{ pathname: '/anime', search: '' }}
                                                className={`${styles['drawer__nav-item']} ${location.pathname === '/anime' ? styles['drawer__nav-item--active'] : ''}`}
                                            >
                                                <AnimeIcon size={20} color="s-color-fg-primary" />
                                                <span className={styles['drawer__nav-text']}>{t('ANIME')}</span>
                                            </Link>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link 
                                                onClick={handleDrawerClose} 
                                                to={{ pathname: '/manga', search: '' }}
                                                className={`${styles['drawer__nav-item']} ${location.pathname === '/manga' ? styles['drawer__nav-item--active'] : ''}`}
                                            >
                                                <MangaIcon size={20} color="s-color-fg-primary" />
                                                <span className={styles['drawer__nav-text']}>{t('MANGA')}</span>
                                            </Link>
                                        </motion.div>
                                    </nav>
                                </motion.div>
                            )}
                            
                            <motion.div 
                                className={styles['drawer__menu-group']}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Label className={styles['drawer__menu-heading']} font='typo-primary-l-medium'>Settings</Label>
                                <div className={styles['drawer__theme-toggle']}>
                                    <ThemeToggle />
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className={styles['drawer__footer']}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className={styles['drawer__social-icons']}>
                                    <motion.a 
                                        href="https://facebook.com/bobanimelist" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles['drawer__social-icon']}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="Facebook"
                                    >
                                        <FacebookIcon size={24} color="s-color-fg-primary" />
                                    </motion.a>
                                    <motion.a 
                                        href="https://instagram.com/bdn_bnj" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles['drawer__social-icon']}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="Instagram"
                                    >
                                        <InstagramIcon size={24} color="s-color-fg-primary" />
                                    </motion.a>
                                    <motion.a 
                                        href="https://wa.me/628978601538" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles['drawer__social-icon']}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="WhatsApp"
                                    >
                                        <WhatsAppIcon size={24} color="s-color-fg-primary" />
                                    </motion.a>
                                    <motion.a 
                                        href="https://x.com/bobanimelist" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles['drawer__social-icon']}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="X (Twitter)"
                                    >
                                        <XIcon size={24} color="s-color-fg-primary" />
                                    </motion.a>
                                    <motion.a 
                                        href="https://tiktok.com/@bobanimelist" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles['drawer__social-icon']}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="TikTok"
                                    >
                                        <TikTokIcon size={24} color="s-color-fg-primary" />
                                    </motion.a>
                                    <motion.a 
                                        href="https://github.com/bondanbanuaji/bobanimelist" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles['drawer__social-icon']}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="GitHub"
                                    >
                                        <GithubIcon size={24} color="s-color-fg-primary" />
                                    </motion.a>
                                    <motion.a 
                                        href="https://youtube.com/@bobanimelist" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles['drawer__social-icon']}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="YouTube"
                                    >
                                        <YouTubeIcon size={24} color="s-color-fg-primary" />
                                    </motion.a>
                                </div>
                                <p className={styles['drawer__copyright']}>© {new Date().getFullYear()} bobanimelist</p>
                            </motion.div>
                        </motion.aside>
                    </RemoveScroll>
                </>
            )}
        </AnimatePresence>
    );
}

export default Drawer;