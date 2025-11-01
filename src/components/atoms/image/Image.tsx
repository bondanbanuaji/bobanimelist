import classNames from 'classnames';
import { type ImgHTMLAttributes, useState, useEffect, type SyntheticEvent } from 'react';
import styles from './Image.module.scss';

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    fallbackSrc?: string;
    onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
    onLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
};

function Image({ fallbackSrc, ...props }: ImageProps) {
    const [src, setSrc] = useState(props.src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setSrc(props.src);
        setHasError(false);
    }, [props.src]);

    const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        if (!hasError && fallbackSrc) {
            setSrc(fallbackSrc);
            setHasError(true);
        } else if (props.onError) {
            props.onError(e);
        }
    };

    const handleLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        if (props.onLoad) {
            props.onLoad(e);
        }
    };

    return (
        <img
            {...props}
            src={src}
            loading="lazy"
            decoding="async"
            className={classNames({
                [props.className ?? '']: true,
                [styles.image]: true,
            })}
            onError={handleError}
            onLoad={handleLoad}
        />
    );
}

export default Image;
