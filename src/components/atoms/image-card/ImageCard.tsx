import React from 'react';
import { Link } from 'react-router';
import Image from '../image';
import Label from '../label';
import styles from './ImageCard.module.scss';
import classNames from 'classnames';
import StarIcon from '../icons/StarIcon';
import HeartIcon from '../icons/HeartIcon';
import { CardAnimation } from '../../../shared/util/animation/CardAnimation';

interface ImageCardProps {
    src: string;
    alt: string;
    navigateTo?: string;
    title?: string;
    ratings?: string;
    favorites?: string;
    grid?: boolean;
    index?: number; // For stagger animations
    isInView?: boolean; // For scroll-triggered animations
}

function ImageCard({ src, alt, navigateTo, title, ratings, favorites, grid, index = 0, isInView = true }: ImageCardProps) {
    const content = (
        <div 
            className={classNames({ 
                [styles['image-card']]: true, 
                [styles['image-card__clickable']]: navigateTo, 
                'no-text-select': true, 
                [styles['image-card--grid']]: grid 
            })}
            role={navigateTo ? "link" : "article"}
            tabIndex={navigateTo ? 0 : undefined}
            aria-label={`${title ? title : 'Media'} ${ratings ? `, Rating: ${ratings}` : ''} ${favorites ? `, Favorites: ${favorites}` : ''}`}
        >
            <Image src={src} alt={alt} className={classNames(styles['image-card__image'], { [styles['image-card__image--grid']]: grid })} />
            {(!!ratings || !!favorites) && <div className={styles['image-card__top-overlay']} aria-hidden="true">
                {!!ratings && <div className={styles['image-card__rating']} role="group" aria-label={`Rating: ${ratings}`}>
                    <StarIcon color='s-color-fg-primary' size={16} aria-hidden="true" />
                    <Label as='span' font='typo-primary-s-semibold' >{ratings}</Label>
                </div>}
                {!!favorites && <div className={styles['image-card__favorite']} role="group" aria-label={`Favorites: ${favorites}`}>
                    <HeartIcon color='s-color-fg-primary' size={16} aria-hidden="true" />
                    <Label as='span' font='typo-primary-s-semibold' >{favorites}</Label>
                </div>}
            </div>}
            {!!title && <div className={styles['image-card__bottom-overlay']}>
                <Label as='h4' font='typo-primary-m-medium' className={styles['image-card__title']} >{title}</Label>
            </div>}
        </div>
    );

    const animatedContent = (
        <CardAnimation index={index} isInView={isInView} className={classNames({ [styles['image-card-wrapper']]: true, [styles['image-card--grid']]: grid })}>
            {content}
        </CardAnimation>
    );

    return navigateTo ? (
        <Link to={navigateTo} aria-label={`${title ? title : 'Media'} - Navigate`}>{animatedContent}</Link>
    ) : (
        animatedContent
    );
}

const ImageCardLoadingComponent = ({ grid }: { grid?: boolean; }) => {
    return (
        <CardAnimation className={classNames(styles['image-card-wrapper'], { [styles['image-card--grid']]: grid })}>
            <div className={classNames(styles['image-card'], styles['image-card--loading'], { [styles['image-card--grid']]: grid })}>
                <div className={classNames(styles['image-card__image'], { [styles['image-card__image--grid']]: grid })} />
            </div>
        </CardAnimation>
    );
}

export const ImageCardLoading = React.memo(ImageCardLoadingComponent);

export default React.memo(ImageCard);