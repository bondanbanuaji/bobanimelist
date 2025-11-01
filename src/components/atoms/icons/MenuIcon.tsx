import type { IconProps } from './icon.model';
import { cssColorVar } from '../../../shared/design-system/util';
import styles from './MenuIcon.module.scss';
import classNames from 'classnames';

interface MenuIconProps extends Omit<IconProps, 'color'> {
    color?: IconProps['color'];
    isActive: boolean;
}

function MenuIcon({ size, color = 's-color-fg-primary', className, isActive }: MenuIconProps) {
    const iconStyle = {
        width: size,
        height: size,
    };

    const barStyle = {
        backgroundColor: cssColorVar(color),
    };

    return (
        <div
            className={classNames(styles.container, className, { [styles.active]: isActive })}
            style={iconStyle}
        >
            <span className={styles.bar} style={barStyle}></span>
            <span className={styles.bar} style={barStyle}></span>
            <span className={styles.bar} style={barStyle}></span>
        </div>
    );
}

export default MenuIcon;