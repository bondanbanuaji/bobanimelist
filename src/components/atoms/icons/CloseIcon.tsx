import type { IconProps } from './icon.model';
import { cssColorVar } from '../../../shared/design-system/util';
import styles from './CloseIcon.module.scss';

function CloseIcon({ size, color, className }: IconProps) {
    // Jika className berisi kelas ukuran khusus, jangan terapkan style inline
    const hasCustomSizeClass = className && (
        className.includes('small') || 
        className.includes('medium') || 
        className.includes('large') || 
        className.includes('xlarge') || 
        className.includes('xxlarge') || 
        className.includes('xxxlarge')
    );

    const combinedClassName = `${className || ''} ${styles['close-icon']}`.trim();
    
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={combinedClassName} 
            style={hasCustomSizeClass ? undefined : { height: size, width: size }}
            viewBox="0 -960 960 960" 
            fill={cssColorVar(color)}
        >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
    );
}

export default CloseIcon;