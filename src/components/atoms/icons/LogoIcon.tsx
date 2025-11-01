import type { IconProps } from "./icon.model";

function LogoIcon({ size }: IconProps) {
    return (
        <img 
            src={`${import.meta.env.BASE_URL}icon.png`} 
            width={size} 
            height={size} 
            style={{ width: size, height: size, objectFit: 'contain' }}
            alt="Logo"
        />
    );
}

export default LogoIcon;