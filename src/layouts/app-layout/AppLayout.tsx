import { ScrollRestoration, useLocation, useOutlet } from "react-router";
import Header from "../../components/widgets/header";
import styles from './AppLayout.module.scss';
import Footer from "../../components/widgets/footer";
import Drawer from "../../components/widgets/drawer";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Suspense, useState } from "react";
import { Loader } from "../loader";
import AnimatedLogo from "../../components/atoms/animated-logo/AnimatedLogo";
import useScrollLock from "../../hooks/useScrollLock";

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        x: -20,
        rotateY: -15,
        scale: 0.95,
    },
    in: {
        opacity: 1,
        x: 0,
        rotateY: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 0.3 },
            rotateY: { duration: 0.5, ease: "easeOut" },
            scale: { duration: 0.4, ease: "easeOut" },
        },
    },
    out: {
        opacity: 0,
        x: 20,
        rotateY: 15,
        scale: 0.95,
        transition: {
            duration: 0.3,
            ease: "easeIn",
        },
    },
};

function AppLayout() {
    const location = useLocation();
    const outlet = useOutlet();
    const [showIntro, setShowIntro] = useState(true);
    
    // Lock scroll when intro is showing
    useScrollLock(showIntro);

    return (
        <>
            {showIntro && (
                <div className={styles['animated-logo-container']}>
                    <AnimatedLogo onAnimationComplete={() => setShowIntro(false)} />
                </div>
            )}
            <div className={`${styles['app-layout']} ${showIntro ? styles['intro-active'] : ''}`}>
                <Drawer />
                <Header />
                <main className={styles['app-layout__content']}>
                    <ScrollRestoration />
                    <AnimatePresence mode="sync">
                        <Suspense key={location.key} fallback={<Loader />}>
                            <motion.div
                                key={location.pathname}
                                variants={pageVariants}
                                initial="initial"
                                animate="in"
                                exit="out"
                                style={{ 
                                    transformStyle: 'preserve-3d',
                                    backfaceVisibility: 'hidden',
                                    willChange: 'transform, opacity',
                                }}
                            >
                                {outlet}
                            </motion.div>
                        </Suspense>
                    </AnimatePresence>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default AppLayout;