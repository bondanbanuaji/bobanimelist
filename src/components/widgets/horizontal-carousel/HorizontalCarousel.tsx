import { skipToken, type TypedUseQuery } from "@reduxjs/toolkit/query/react";
import SwipeCarousel, { type SwipeCarouselType } from "../../atoms/swipe-carousel";
import ImageCard, { ImageCardLoading } from "../../atoms/image-card";
import Label from "../../atoms/label";
import ErrorState from "../../atoms/error-state";
import styles from "./HorizontalCarousel.module.scss";
import React from "react";
import { type SwiperClass } from "swiper/react";
import LeftChevron from "../../atoms/icons/LeftChevron";
import RightChevron from "../../atoms/icons/RightChevron";
import classNames from "classnames";
import MediaDetailCard, { MediaDetailCardLoading } from "../../atoms/media-detail-card";
import { shuffleArray } from "../../../shared/util/image-utils";
import { useAnimationTrigger } from "../../../shared/util/animation/useAnimationTrigger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseQuery = TypedUseQuery<any, any, any>;

type ExtractResultAndArgFromTypedUseQuery<THook extends UseQuery> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THook extends TypedUseQuery<infer R, infer A, any> ? { result: R, arg: A; } : never;

type ExtractDataTypeFromHook<THook extends UseQuery> =
    ExtractResultAndArgFromTypedUseQuery<THook>['result'];

type ExtractArgTypeFromHook<THook extends UseQuery> =
    ExtractResultAndArgFromTypedUseQuery<THook>['arg'];

interface MediaDetailCardCarouselData {
    key: string,
    title: string;
    imageUrl: string;
    navigateTo?: string;
    alt: string;
    summary?: string;
    ratings?: string;
    favorites?: string;
    status?: string;
    genres?: string[];
}

interface ImageCardCarouselData {
    key: string,
    title: string;
    imageUrl: string;
    navigateTo?: string;
    alt: string;
    ratings?: string;
    favorites?: string;
}

type CardType = 'image' | 'media-detail';

interface HorizontalCarouselProps<TQueryHook extends UseQuery, TCardType extends CardType> {
    heading: string;
    type?: SwipeCarouselType;
    cardType?: TCardType;
    useQueryHook: TQueryHook;
    options: ExtractArgTypeFromHook<TQueryHook> | typeof skipToken;
    adapter: (
        data: ExtractDataTypeFromHook<TQueryHook>
    ) => TCardType extends 'image' ? ImageCardCarouselData[] : MediaDetailCardCarouselData[];
}

function HorizontalCarousel<TQueryHook extends UseQuery, TCardType extends CardType = 'image'>({
    heading,
    type,
    cardType,
    useQueryHook,
    options,
    adapter,
}: HorizontalCarouselProps<TQueryHook, TCardType>) {
    const swiperRef = React.useRef<SwiperClass>(null);
    const [isBeginning, setIsBeginning] = React.useState(true);
    const [isEnd, setIsEnd] = React.useState(false);
    
    const isTopPeople = heading === 'Top People';

    const finalOptions = React.useMemo(() => {
        if (isTopPeople && typeof options === 'object' && options !== null && !('page' in options)) {
            // Only set random page if not already specified in options
            return {
                ...options,
                page: Math.floor(Math.random() * 5) + 1,
            };
        }
        return options;
    }, [isTopPeople, options]);

    // Optimized query with better error handling and caching
    const { data, isLoading, isError, isFetching, error } = useQueryHook(finalOptions, {
        // Use RTK Query's built-in caching with 60-second TTL
        refetchOnMountOrArgChange: false, // Don't refetch on mount since baseApi has caching
    });

    const adaptedData = React.useMemo(() => {
        if (!data) {
            return undefined;
        }
        
        const adapted = adapter(data);

        if (isTopPeople) {
            return shuffleArray(adapted).slice(0, 15);
        }

        return adapted;
    }, [data, adapter, isTopPeople]);

    // Smart loading state: only show loading initially, not during background updates
    const [hasInitialData, setHasInitialData] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const showLoading = (isLoading || isFetching) && !hasInitialData;

    // Track when we first receive data or an error to hide loading state
    React.useEffect(() => {
        if ((data || (!isLoading && !isFetching)) && !hasInitialData) {
            setHasInitialData(true);
        }
        // Also set hasInitialData to true if there's an error (to stop showing loading state)
        if (isError && !hasInitialData) {
            setHasInitialData(true);
        }
        
        // Set ready state once we have initial data or error to show content
        if (hasInitialData || (isError && !hasInitialData)) {
            setIsReady(true);
        }
    }, [data, isLoading, isFetching, isError, hasInitialData]);

    const getCarouselInstance = (swiper: SwiperClass) => {
        swiperRef.current = swiper;
    };

    const handleCarouselMove = React.useCallback((swiper: SwiperClass) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    }, []);

    const { ref: containerRef, shouldAnimate } = useAnimationTrigger({ threshold: 0.1 });

    const getContent = React.useCallback((): React.ReactNode[] => {
        // If data is not loaded and we're still fetching, show loading state
        if (showLoading) {
            switch (cardType) {
                case 'media-detail':
                    return Array.from({ length: 10 }, (_, idx) => <MediaDetailCardLoading key={`loading-${idx}`} />);
                case 'image':
                default:
                    return Array.from({ length: 10 }, (_, idx) => <ImageCardLoading key={`loading-${idx}`} />);
            }
        }

        // If there's an error and no cached data, show the error state
        if (isError && (!adaptedData || adaptedData.length === 0)) {
            console.error('HorizontalCarousel error:', error); // Log error for debugging
            
            // Check if the error is due to 429 (Too Many Requests)
            let errorMessage = "There was an error loading the content. Please try again later.";
            let errorTitle = "Failed to load content";
            
            if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
                errorMessage = "Too many requests — please wait a moment before refreshing.";
                errorTitle = "Rate Limit Exceeded";
            }
            
            return [<div key="error" className={styles['error-container']}>
                <ErrorState 
                    key="error-state"
                    title={errorTitle} 
                    message={errorMessage} 
                    onRetry={() => window.location.reload()}
                    retryButtonText="Reload"
                />
            </div>];
        }

        // If data is loaded but empty (and no error), we should handle empty state
        if (adaptedData && adaptedData.length === 0 && !isError) {
            return [<div key="empty" className={styles['empty-container']}>
                <ErrorState 
                    key="empty-state"
                    title="No content found" 
                    message="There is no content to display in this section." 
                    showRetryButton={false}
                />
            </div>];
        }

        // Render the actual content (this handles both successful data and error with cached data)
        switch (cardType) {
            case 'media-detail': {
                return (adaptedData as MediaDetailCardCarouselData[]).map((data, index) => (
                    <MediaDetailCard
                        key={data.key}
                        index={index}
                        isInView={shouldAnimate}
                        navigateTo={data.navigateTo}
                        src={data.imageUrl}
                        alt={data.title}
                        title={data.title}
                        ratings={data.ratings}
                        favorites={data.favorites}
                        summary={data.summary}
                        status={data.status}
                        genres={data.genres}
                    />
                ));
            }
            case 'image':
            default: {
                return (adaptedData as ImageCardCarouselData[]).map((data, index) => (
                    <ImageCard
                        key={data.key}
                        index={index}
                        isInView={shouldAnimate}
                        navigateTo={data.navigateTo}
                        src={data.imageUrl}
                        alt={data.title}
                        title={data.title}
                        ratings={data.ratings}
                        favorites={data.favorites}
                    />
                ));
            }
        }
    }, [cardType, adaptedData, isError, showLoading, error, shouldAnimate]);

    return (
        <div ref={containerRef} className={`${styles['horizontal-carousel']} ${!isReady ? styles['horizontal-carousel--loading'] : styles['horizontal-carousel--ready']}`}>
            <div className={styles['horizontal-carousel__header']}>
                {<Label as='h3' font="typo-primary-l-semibold" className={styles['horizontal-carousel__heading']}>{heading ?? ''}</Label>}
                <div className={styles['horizontal-carousel__nav']}>
                    <button
                        className={classNames({ [styles['horizontal-carousel__nav-button']]: true, [styles['horizontal-carousel__nav-button-left']]: true })}
                        disabled={isBeginning}
                        onClick={() => swiperRef.current?.slidePrev()}
                        aria-label="Previous slide"
                        aria-disabled={isBeginning}
                    >
                        <LeftChevron size={12} color="s-color-fg-primary" aria-hidden="true" />
                    </button>

                    <button
                        className={classNames({ [styles['horizontal-carousel__nav-button']]: true, [styles['horizontal-carousel__nav-button-right']]: true })}
                        disabled={isEnd}
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Next slide"
                        aria-disabled={isEnd}
                    >
                        <RightChevron size={12} color="s-color-fg-primary" aria-hidden="true" />
                    </button>
                </div>
            </div>
            <SwipeCarousel type={type} onSwiper={getCarouselInstance} onSlideChange={handleCarouselMove}>{getContent()}</SwipeCarousel>
        </div>
    );
}

export default HorizontalCarousel;