import { useState } from 'react';
import { useGetTopReviewsQuery } from '@/services/tenrai';
import type { ReviewType } from '@/services/tenrai';
import { ReviewCard } from '@/components/widgets/review-card';
import Label from '@/components/atoms/label';
import { ErrorState } from '@/components/atoms/error-state';
import styles from './TopReviewsPage.module.scss';
import classNames from 'classnames';

export const TopReviewsPage = () => {
	const [typeFilter, setTypeFilter] = useState<ReviewType | 'all'>('all');
	const [page, setPage] = useState(1);
	const [showSpoilers, setShowSpoilers] = useState(false);
	const [showPreliminary, setShowPreliminary] = useState(false);

	const { data, isLoading, isError } = useGetTopReviewsQuery({
		type: typeFilter === 'all' ? undefined : typeFilter,
		page,
		spoiler: showSpoilers,
		preliminary: showPreliminary,
	});

	const totalPages = data?.pagination?.last_visible_page || 1;
	const hasMultiplePages = totalPages > 1;

	return (
		<div className={styles['top-reviews-page']}>
			<div className={styles['top-reviews-page__header']}>
				<Label as="h1" font="typo-primary-xl-semibold" className={styles['top-reviews-page__title']}>
					Top Reviews
				</Label>
				<Label as="p" font="typo-primary-l-regular" className={styles['top-reviews-page__subtitle']}>
					Highest-rated reviews from the community
				</Label>
			</div>

			<div className={styles['top-reviews-page__controls']}>
				<div className={styles['top-reviews-page__type-tabs']}>
					<button
						onClick={() => { setTypeFilter('all'); setPage(1); }}
						className={classNames(
							styles['top-reviews-page__type-tab'],
							typeFilter === 'all' && styles['top-reviews-page__type-tab--active']
						)}
					>
						All
					</button>
					<button
						onClick={() => { setTypeFilter('anime'); setPage(1); }}
						className={classNames(
							styles['top-reviews-page__type-tab'],
							typeFilter === 'anime' && styles['top-reviews-page__type-tab--active']
						)}
					>
						Anime Only
					</button>
					<button
						onClick={() => { setTypeFilter('manga'); setPage(1); }}
						className={classNames(
							styles['top-reviews-page__type-tab'],
							typeFilter === 'manga' && styles['top-reviews-page__type-tab--active']
						)}
					>
						Manga Only
					</button>
				</div>

				<div className={styles['top-reviews-page__filters']}>
					<button
						onClick={() => setShowSpoilers(!showSpoilers)}
						className={classNames(
							styles['top-reviews-page__filter-btn'],
							showSpoilers && styles['top-reviews-page__filter-btn--active']
						)}
					>
						{showSpoilers ? '✓' : ''} Include Spoilers
					</button>
					<button
						onClick={() => setShowPreliminary(!showPreliminary)}
						className={classNames(
							styles['top-reviews-page__filter-btn'],
							showPreliminary && styles['top-reviews-page__filter-btn--active']
						)}
					>
						{showPreliminary ? '✓' : ''} Include Ongoing
					</button>
				</div>
			</div>

			<div className={styles['top-reviews-page__content']}>
				{isLoading && (
					<div className={styles['top-reviews-page__loading']}>
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className={styles['top-reviews-page__skeleton']} />
						))}
					</div>
				)}

				{isError && (
					<ErrorState message="Failed to load top reviews. Please try again later." />
				)}

				{!isLoading && !isError && data?.data && (
					<>
						{data.data.length === 0 ? (
							<div className={styles['top-reviews-page__empty']}>
								<Label as="p" font="typo-primary-l-regular">
									No reviews found
								</Label>
							</div>
						) : (
							<>
								<Label as="p" font="typo-primary-m-regular" className={styles['top-reviews-page__count']}>
									Page {page} of {totalPages}
								</Label>
								<div className={styles['top-reviews-page__list']}>
									{data.data.map((review) => (
										<ReviewCard key={review.mal_id} review={review} />
									))}
								</div>
							</>
						)}
					</>
				)}

				{hasMultiplePages && !isLoading && (
					<div className={styles['top-reviews-page__pagination']}>
						<button
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page === 1}
							className={styles['top-reviews-page__pagination-btn']}
						>
							← Previous
						</button>
						<Label as="span" font="typo-primary-m-regular" className={styles['top-reviews-page__pagination-info']}>
							Page {page} of {totalPages}
						</Label>
						<button
							onClick={() => setPage(p => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
							className={styles['top-reviews-page__pagination-btn']}
						>
							Next →
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default TopReviewsPage;
