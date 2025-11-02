import { useGetTopAnimeQuery, useGetTopMangaQuery, useGetAnimeSearchQuery, useGetMangaSearchQuery } from '../../../services/jikan';
import { shuffleArray } from '../../../shared/util/image-utils';
import { formatThresholdNumber } from '../../../shared/util';
import { getBestImageUrl } from '../../../shared/util/image-utils';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import SwipeCarousel from '../../atoms/swipe-carousel';
import MediaDetailCard, { MediaDetailCardLoading } from '../../atoms/media-detail-card';
import Label from '../../atoms/label';
import ErrorState from '../../atoms/error-state';
import styles from '../horizontal-carousel/HorizontalCarousel.module.scss';
import { type SwiperClass } from 'swiper/react';
import LeftChevron from '../../atoms/icons/LeftChevron';
import RightChevron from '../../atoms/icons/RightChevron';
import classNames from 'classnames';
import { type Anime, type Manga, type AnimeType, type MangaType } from '../../../services/jikan/models';
import { useAnimationTrigger } from '../../../shared/util/animation/useAnimationTrigger';

// --- Constants for Randomization ---
const ANIME_TYPES: AnimeType[] = ['TV', 'Movie', 'Ova', 'Special', 'Ona', 'Music'];
const MANGA_TYPES: MangaType[] = ['Manga', 'Novel', 'Lightnovel', 'Oneshot', 'Doujin', 'Manhwa', 'Manhua'];
type CommonTopFilter = 'bypopularity' | 'favorite';
const TOP_FILTERS: CommonTopFilter[] = ['bypopularity', 'favorite'];
// Genres: Action, Adventure, Comedy, Drama, Fantasy, Horror, Romance, Sci-Fi, Sports, Slice of Life, Supernatural, Psychological
const GENRE_IDS = [1, 2, 4, 8, 10, 14, 22, 24, 30, 36, 37, 40];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const RandomAnimeCarousel = () => {
    const randomHeading = 'Recommended For You';

    // Generate random parameters only once on component mount
    const randomParams = React.useMemo(() => {
        return {
            page: Math.floor(Math.random() * 10) + 1,
            animeType: getRandomItem(ANIME_TYPES),
            mangaType: getRandomItem(MANGA_TYPES),
            filter: getRandomItem(TOP_FILTERS),
            genreId: getRandomItem(GENRE_IDS),
            midRangePage: Math.floor(Math.random() * 50) + 1, // Wider page range for more variety
        };
    }, []); // Empty dependency array ensures this runs only once

    // --- Data Fetching ---
    // 1. Top Anime (random type, filter, and page)
    const { data: topAnimeData, isLoading: topAnimeLoading, isError: topAnimeError, isFetching: topAnimeFetching } = useGetTopAnimeQuery({
        type: randomParams.animeType,
        filter: randomParams.filter,
        limit: 15,
        page: randomParams.page,
        sfw: true,
    }, {
        // Use RTK Query's built-in caching with 60-second TTL
        refetchOnMountOrArgChange: false, // Don't refetch on mount since baseApi has caching
    });

    // 2. Top Manga (random type, filter, and page)
    const { data: topMangaData, isLoading: topMangaLoading, isError: topMangaError, isFetching: topMangaFetching } = useGetTopMangaQuery({
        type: randomParams.mangaType,
        filter: randomParams.filter,
        limit: 15,
        page: randomParams.page,
    }, {
        // Use RTK Query's built-in caching with 60-second TTL
        refetchOnMountOrArgChange: false, // Don't refetch on mount since baseApi has caching
    });

    // 3. Anime by Random Genre
    const { data: animeGenreData, isLoading: animeGenreLoading, isError: animeGenreError } = useGetAnimeSearchQuery({
        genres: randomParams.genreId.toString(),
        limit: 10,
        page: 1,
        sfw: true,
        order_by: 'popularity',
        sort: 'desc',
    }, {
        // Use RTK Query's built-in caching with 60-second TTL
        refetchOnMountOrArgChange: false, // Don't refetch on mount since baseApi has caching
    });

    // 4. Manga by Random Genre
    const { data: mangaGenreData, isLoading: mangaGenreLoading, isError: mangaGenreError } = useGetMangaSearchQuery({
        genres: randomParams.genreId.toString(),
        limit: 10,
        page: 1,
        order_by: 'popularity',
        sort: 'desc',
    }, {
        // Use RTK Query's built-in caching with 60-second TTL
        refetchOnMountOrArgChange: false, // Don't refetch on mount since baseApi has caching
    });

    // 5. "Average" or "Mid-Range" Anime (not too popular, but well-liked)
    const { data: midRangeAnimeData, isLoading: midRangeAnimeLoading, isError: midRangeAnimeError } = useGetAnimeSearchQuery({
        page: randomParams.midRangePage,
        min_score: 6.5,
        max_score: 8.2,
        order_by: 'favorites',
        sort: 'desc',
        limit: 10,
        sfw: true,
    }, {
        // Use RTK Query's built-in caching with 60-second TTL
        refetchOnMountOrArgChange: false, // Don't refetch on mount since baseApi has caching
    });

    // --- Combined States ---
    const isLoading = topAnimeLoading || topMangaLoading || animeGenreLoading || mangaGenreLoading || midRangeAnimeLoading;
    const isFetching = topAnimeFetching || topMangaFetching; // Primary sources fetching
    const hasError = topAnimeError || topMangaError || animeGenreError || mangaGenreError || midRangeAnimeError;

    const [hasInitialData, setHasInitialData] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const showLoading = (isLoading || isFetching) && !hasInitialData;
    const [shuffledData, setShuffledData] = useState<(Anime | Manga)[]>([]);

    // Process data only when all queries are complete
    useEffect(() => {
        if (isLoading || isFetching) return;

        const allItems: (Anime | Manga)[] = [];

        // Combine data from all sources
        if (topAnimeData?.data?.length) allItems.push(...topAnimeData.data);
        if (topMangaData?.data?.length) allItems.push(...topMangaData.data);
        if (animeGenreData?.data?.length) allItems.push(...animeGenreData.data);
        if (mangaGenreData?.data?.length) allItems.push(...mangaGenreData.data);
        if (midRangeAnimeData?.data?.length) allItems.push(...midRangeAnimeData.data);

        // Filter out nulls/undefined and remove duplicates by mal_id
        const uniqueItems = [...new Map(allItems.filter(Boolean).map((item) => [item.mal_id, item])).values()];

        if (!uniqueItems.length) {
            setShuffledData([]);
            setHasInitialData(true); // Mark as having data to avoid infinite loading state
            setIsReady(true);
            return;
        }

        // Sort items to favor "mid-range" scores, creating a more balanced list
        const sortedItems: (Anime | Manga)[] = [...uniqueItems]
            .filter((item): item is (Anime | Manga) & { score: number; favorites: number } => 
                item.score !== null && item.score !== undefined && item.favorites !== null && item.favorites !== undefined
            )
            .sort((a, b) => {
                const getWeightedScore = (item: Anime | Manga) => {
                    const score = item.score ?? 0;
                    const favorites = item.favorites ?? 0;
                    // Prioritize scores around 7.5 for a "balanced" feel
                    const normalizedScore = Math.abs(score - 7.5);
                    // Use log to temper the impact of very high favorite counts
                    return (8 - normalizedScore) + Math.log10(favorites + 1);
                };
                return getWeightedScore(b) - getWeightedScore(a);
            });

        // Shuffle the sorted items thoroughly and take a final slice for display
        const finalSelection: (Anime | Manga)[] = shuffleArray(sortedItems).slice(0, 15);
        setShuffledData(finalSelection);

        setHasInitialData(true);
        setIsReady(true);
    }, [
        topAnimeData,
        topMangaData,
        animeGenreData,
        mangaGenreData,
        midRangeAnimeData,
        isLoading,
        isFetching,
    ]);

    // --- Carousel Controls ---
    const swiperRef = useRef<SwiperClass | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleCarouselMove = useCallback((swiper: SwiperClass) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    }, []);

    const { ref: containerRef, shouldAnimate } = useAnimationTrigger({ threshold: 0.1 });

    // --- Render Content ---
    const getContent = useCallback((): React.ReactNode[] => {
        if (hasError && shuffledData.length === 0) {
            // Determine if any of the errors is a 429 (Too Many Requests)
            const errors = [topAnimeError, topMangaError, animeGenreError, mangaGenreError, midRangeAnimeError];
            const has429Error = errors.some(error => 
                error && typeof error === 'object' && 'status' in error && (error as { status: unknown }).status === 429
            );
            
            let errorMessage = "We couldn’t load recommendations right now. Try refreshing.";
            let errorTitle = "Failed to load content";
            
            if (has429Error) {
                errorMessage = "Too many requests — please wait a moment before refreshing.";
                errorTitle = "Rate Limit Exceeded";
            }
            
            return [
                <div key="error" className={styles['error-container']}>
                    <ErrorState
                        title={errorTitle}
                        message={errorMessage}
                        onRetry={() => window.location.reload()}
                        retryButtonText="Reload"
                    />
                </div>,
            ];
        }

        if (showLoading) {
            return Array.from({ length: 15 }, (_, idx) => <MediaDetailCardLoading key={`loading-${idx}`} />);
        }

        if (isReady && !shuffledData.length) {
            return [
                <div key="empty" className={styles['empty-container']}>
                    <ErrorState
                        title="No content found"
                        message="Could not find any recommendations based on the current random criteria."
                        showRetryButton={false}
                    />
                </div>,
            ];
        }

        return shuffledData.map((item, index) => {
            const isAnime = 'episodes' in item;
            return (
                <MediaDetailCard
                    key={item.mal_id.toString()}
                    index={index}
                    isInView={shouldAnimate}
                    navigateTo={isAnime ? `/anime/${item.mal_id}` : `/manga/${item.mal_id}`}
                    src={getBestImageUrl(item.images)}
                    alt={item.title}
                    title={item.title}
                    ratings={item.score?.toString() ?? 'N/A'}
                    favorites={formatThresholdNumber(item.favorites)}
                    summary={item.synopsis}
                    status={item.status}
                    genres={item.genres?.map((g) => g.name).slice(0, 5) || []}
                />
            );
        });
    }, [shuffledData, hasError, showLoading, isReady, topAnimeError, topMangaError, animeGenreError, mangaGenreError, midRangeAnimeError, shouldAnimate]);

    return (
        <div
            ref={containerRef}
            className={classNames(styles['horizontal-carousel'], {
                [styles['horizontal-carousel--loading']]: !isReady,
                    [styles['horizontal-carousel--ready']]: isReady,
            })}
        >
            <div className={styles['horizontal-carousel__header']}>
                <Label
                    as="h3"
                    font="typo-primary-l-semibold"
                    className={styles['horizontal-carousel__heading']}
                >
                    {randomHeading}
                </Label>
                <div className={styles['horizontal-carousel__nav']}>
                    <button
                        className={classNames(styles['horizontal-carousel__nav-button'], styles['horizontal-carousel__nav-button-left'])}
                        disabled={isBeginning}
                        onClick={() => swiperRef.current?.slidePrev()}
                        aria-label="Previous slide"
                        aria-disabled={isBeginning}
                    >
                        <LeftChevron size={12} color="s-color-fg-primary" aria-hidden="true" />
                    </button>
                    <button
                        className={classNames(styles['horizontal-carousel__nav-button'], styles['horizontal-carousel__nav-button-right'])}
                        disabled={isEnd}
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Next slide"
                        aria-disabled={isEnd}
                    >
                        <RightChevron size={12} color="s-color-fg-primary" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <SwipeCarousel
                type="centered"
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={handleCarouselMove}
            >
                {getContent()}
            </SwipeCarousel>
        </div>
    );
};

export default RandomAnimeCarousel;
