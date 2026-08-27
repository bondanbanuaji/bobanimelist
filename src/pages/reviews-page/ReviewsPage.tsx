import { useState } from 'react';
import { useGetRecentAnimeReviewsQuery, useGetRecentMangaReviewsQuery } from '@/services/tenrai';
import { ReviewCard } from '@/components/widgets/review-card';
import Label from '@/components/atoms/label';
import { ErrorState } from '@/components/atoms/error-state';
import styles from './ReviewsPage.module.scss';
import classNames from 'classnames';

type ReviewTab = 'anime' | 'manga';

export const ReviewsPage = () => {
	const [activeTab, setActiveTab] = useState<ReviewTab>('anime');
	const [page, setPage] = useState(1);
	const [showSpoilers, setShowSpoilers] = useState(false);
	const [showPreliminary, setShowPreliminary] = useState(false);

	const { 
		data: animeData, 
		isLoading: animeLoading, 
		isError: animeError 
	} = useGetRecentAnimeReviewsQuery(
		activeTab === 'anime' ? { page, spoiler: showSpoilers, preliminary: showPreliminary } : undefined,
		{ skip: activeTab !== 'anime' }
	);

	const { 
		data: mangaData, 
		isLoading: mangaLoading, 
		isError: mangaError 
	} = useGetRecentMangaReviewsQuery(
		activeTab === 'manga' ? { page, spoiler: showSpoilers, preliminary: showPreliminary } : undefined,
		{ skip: activeTab !== 'manga' }
	);

	const data = activeTab === 'anime' ? animeData : mangaData;
	const isLoading = activeTab === 'anime' ? animeLoading : mangaLoading;
	const isError = activeTab === 'anime' ? animeError : mangaError;

	const handleTabChange = (tab: ReviewTab) => {
		setActiveTab(tab);
		setPage(1); // Reset to page 1 when changing tabs
	};

	const totalPages = data?.pagination?.last_visible_page || 1;
	const hasMultiplePages = totalPages > 1;

	return (
		<div className={styles['reviews-page']}>
			<div className={styles['reviews-page__header']}>
				<Label as="h1" font="typo-primary-xl-semibold" className={styles['reviews-page__title']}>
					Recent Reviews
				</Label>
				<Label as="p" font="typo-primary-l-regular" className={styles['reviews-page__subtitle']}>
					Latest reviews from the community
				</Label>
			</div>

			<div className={styles['reviews-page__tabs']}>
				<button
					onClick={() => handleTabChange('anime')}
					className={classNames(
						styles['reviews-page__tab'],
						activeTab === 'anime' && styles['reviews-page__tab--active']
					)}
				>
					Anime Reviews
				</button>
				<button
					onClick={() => handleTabChange('manga')}
					className={classNames(
						styles['reviews-page__tab'],
						activeTab === 'manga' && styles['reviews-page__tab--active']
					)}
				>
					Manga Reviews
				</button>
			</div>

			<div className={styles['reviews-page__filters']}>
				<button
					onClick={() => setShowSpoilers(!showSpoilers)}
					className={classNames(
						styles['reviews-page__filter-btn'],
						showSpoilers && styles['reviews-page__filter-btn--active']
					)}
				>
					{showSpoilers ? '✓' : ''} Include Spoilers
				</button>
				<button
					onClick={() => setShowPreliminary(!showPreliminary)}
					className={classNames(
						styles['reviews-page__filter-btn'],
						showPreliminary && styles['reviews-page__filter-btn--active']
					)}
				>
					{showPreliminary ? '✓' : ''} Include Ongoing
				</button>
			</div>

			<div className={styles['reviews-page__content']}>
				{isLoading && (
					<div className={styles['reviews-page__loading']}>
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className={styles['reviews-page__skeleton']} />
						))}
					</div>
				)}

				{isError && (
					<ErrorState message="Failed to load reviews. Please try again later." />
				)}

				{!isLoading && !isError && data?.data && (
					<>
						{data.data.length === 0 ? (
							<div className={styles['reviews-page__empty']}>
								<Label as="p" font="typo-primary-l-regular">
									No reviews found
								</Label>
							</div>
						) : (
							<>
								<Label as="p" font="typo-primary-m-regular" className={styles['reviews-page__count']}>
									Showing page {page} of {totalPages}
								</Label>
								<div className={styles['reviews-page__list']}>
									{data.data.map((review) => (
										<ReviewCard key={review.mal_id} review={review} />
									))}
								</div>
							</>
						)}
					</>
				)}

				{hasMultiplePages && !isLoading && (
					<div className={styles['reviews-page__pagination']}>
						<button
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page === 1}
							className={styles['reviews-page__pagination-btn']}
						>
							← Previous
						</button>
						<Label as="span" font="typo-primary-m-regular" className={styles['reviews-page__pagination-info']}>
							Page {page} of {totalPages}
						</Label>
						<button
							onClick={() => setPage(p => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
							className={styles['reviews-page__pagination-btn']}
						>
							Next →
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ReviewsPage;
