import { type TypedUseQuery } from "@reduxjs/toolkit/query/react";
import ImageCard from "../../atoms/image-card";
import ErrorState from "../../atoms/error-state";
import styles from "./SearchResult.module.scss";
import React from "react";
import { ImageCardLoading } from "../../atoms/image-card/ImageCard";
import type { JikanPagination } from "../../../services/jikan/models";
import { useSearchParams } from "react-router";
import Label from "../../atoms/label";
import classNames from "classnames";
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

interface ImageCardData {
    key: string,
    title: string;
    imageUrl: string;
    navigateTo?: string;
    alt: string;
    ratings?: string;
    favorites?: string;
}

interface SearchResultData {
    data: ImageCardData[];
    pagination?: JikanPagination;
}

interface SearchResultProps<TQueryHook extends UseQuery> {
    useQueryHook: TQueryHook;
    options: ExtractArgTypeFromHook<TQueryHook>;
    adapter: (
        data: ExtractDataTypeFromHook<TQueryHook>
    ) => SearchResultData;
}

function SearchResult<TQueryHook extends UseQuery>({
    useQueryHook,
    options,
    adapter,
}: SearchResultProps<TQueryHook>) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isFetching, isError } = useQueryHook(options);

    const adaptedData = data ? adapter(data) : undefined;

    const { ref: containerRef, shouldAnimate } = useAnimationTrigger({ threshold: 0.1 });

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', newPage.toString());
            return newParams;
        }, { replace: true });
    };

    const getContent = (): React.ReactNode => {
        // Check for error state first
        if (isError) {
            return (
                <div className={styles['error-container']}>
                    <ErrorState 
                        title="Failed to load search results" 
                        message="There was an error loading the search results. Please try again later." 
                        onRetry={() => window.location.reload()}
                        retryButtonText="Reload"
                    />
                </div>
            );
        }

        // Show loading state when data is not loaded and still fetching
        if (!adaptedData || !adaptedData.data || isFetching) {
            return Array.from({ length: 25 }, (_, idx) => <ImageCardLoading key={idx} grid />);
        }

        // Show empty state if there's no data after loading
        if (adaptedData.data.length === 0) {
            return (
                <ErrorState 
                    title="No search results found" 
                    message="There are no results matching your search. Try different keywords." 
                    showRetryButton={false}
                    className={styles['no-result']}
                />
            );
        }

        return (adaptedData.data).map((data, index) => (
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
                grid
            />
        ));
    };

    const page = Number(searchParams.get('page') ?? '1');

    return (
        <div ref={containerRef} className={styles['search-result']}>
            <div className={classNames(styles['search-result__grid'])}>
                {getContent()}
            </div>
            {adaptedData?.pagination && adaptedData.pagination.last_visible_page > 1 && (
                <div className={styles['search-result__pagination']} role="navigation" aria-label="Pagination navigation">
                    <button 
                        onClick={() => handlePageChange(page - 1)} 
                        disabled={page === 1}
                        aria-label={`Go to previous page, current page ${page}`}
                        aria-disabled={page === 1}
                    >
                        <Label as="p" font="typo-primary-m-semibold">Previous</Label>
                    </button>
                    <Label as="p" font="typo-primary-m-medium" aria-live="polite">Page {page} of {adaptedData.pagination.last_visible_page}</Label>
                    <button 
                        onClick={() => handlePageChange(page + 1)} 
                        disabled={!adaptedData.pagination.has_next_page}
                        aria-label={`Go to next page, current page ${page}`}
                        aria-disabled={!adaptedData.pagination.has_next_page}
                    >
                        <Label as="p" font="typo-primary-m-semibold">Next</Label>
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchResult;