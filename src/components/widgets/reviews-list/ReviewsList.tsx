import { useState } from 'react';
import { useGetAnimeReviewsQuery, useGetMangaReviewsQuery } from '@/services/tenrai';
import { ReviewCard } from '../review-card';
import Label from '@/components/atoms/label';
import ErrorState from '@/components/atoms/error-state';
import styles from './ReviewsList.module.scss';
import classNames from 'classnames';

interface ReviewsListProps {
	contentId: number;
	contentType: 'anime' | 'manga';
	className?: string;
}

export const ReviewsList = ({ contentId, contentType, className }: ReviewsListProps) => {
	const [page, setPage] = useState(1);
	const [showSpoilers, setShowSpoilers] = useState(false);
	const [showPreliminary, setShowPreliminary] = useState(false);

	const queryHook = contentType === 'anime' ? useGetAnimeReviewsQuery : useGetMangaReviewsQuery;
	const { data, isLoading, isError } = queryHook({
		id: contentId,
		page,
		spoiler: showSpoilers,
		preliminary: showPreliminary,
	});

	if (isError) {
		return (
			<div className={classNames(styles['reviews-list'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['reviews-list__title']}>
					Reviews
				</Label>
				<ErrorState 
					type="generic" 
					message="Failed to load reviews. Please try again later." 
					showRetryButton={true}
					onRetry={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classNames(styles['reviews-list'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['reviews-list__title']}>
					Reviews
				</Label>
				<div className={styles['reviews-list__loading']}>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className={styles['reviews-list__skeleton']} />
					))}
				</div>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null;
	}

	const totalPages = data.pagination?.last_visible_page || 1;
	const hasMultiplePages = totalPages > 1;

	return (
		<div className={classNames(styles['reviews-list'], className)}>
			<div className={styles['reviews-list__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['reviews-list__title']}>
					Reviews
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['reviews-list__count']}>
					{data.pagination?.items?.total || data.data.length} reviews
				</Label>
			</div>

			<div className={styles['reviews-list__filters']}>
				<button
					onClick={() => setShowSpoilers(!showSpoilers)}
					className={classNames(
						styles['reviews-list__filter-btn'],
						showSpoilers && styles['reviews-list__filter-btn--active']
					)}
				>
					{showSpoilers ? '✓' : ''} Include Spoilers
				</button>
				<button
					onClick={() => setShowPreliminary(!showPreliminary)}
					className={classNames(
						styles['reviews-list__filter-btn'],
						showPreliminary && styles['reviews-list__filter-btn--active']
					)}
				>
					{showPreliminary ? '✓' : ''} Include Ongoing
				</button>
			</div>

			<div className={styles['reviews-list__content']}>
				{data.data.map((review) => (
					<ReviewCard key={review.mal_id} review={review} />
				))}
			</div>

			{hasMultiplePages && (
				<div className={styles['reviews-list__pagination']}>
					<button
						onClick={() => setPage(p => Math.max(1, p - 1))}
						disabled={page === 1}
						className={styles['reviews-list__pagination-btn']}
					>
						← Previous
					</button>
					<Label as="span" font="typo-primary-m-regular" className={styles['reviews-list__pagination-info']}>
						Page {page} of {totalPages}
					</Label>
					<button
						onClick={() => setPage(p => Math.min(totalPages, p + 1))}
						disabled={page === totalPages}
						className={styles['reviews-list__pagination-btn']}
					>
						Next →
					</button>
				</div>
			)}
		</div>
	);
};

export default ReviewsList;
