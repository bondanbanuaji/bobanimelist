import { useState } from 'react';
import { useGetAnimeEpisodesQuery } from '@/services/tenrai';
import Label from '@/components/atoms/label';
import ErrorState from '@/components/atoms/error-state';
import styles from './EpisodesList.module.scss';
import classNames from 'classnames';

interface EpisodesListProps {
	animeId: number;
	className?: string;
}

export const EpisodesList = ({ animeId, className }: EpisodesListProps) => {
	const [page, setPage] = useState(1);
	const { data, isLoading, isError } = useGetAnimeEpisodesQuery({ id: animeId, page, limit: 100 });

	if (isError) {
		return (
			<div className={classNames(styles['episodes-list'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['episodes-list__title']}>
					Episodes
				</Label>
				<ErrorState 
					type="generic" 
					message="Failed to load episodes. Please try again later." 
					showRetryButton={true}
					onRetry={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classNames(styles['episodes-list'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['episodes-list__title']}>
					Episodes
				</Label>
				<div className={styles['episodes-list__loading']}>
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className={styles['episodes-list__skeleton']} />
					))}
				</div>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null; // Hide section if no episodes
	}

	const totalPages = data.pagination?.items ? Math.ceil(data.pagination.items.total / data.pagination.items.per_page) : 1;
	const hasMultiplePages = totalPages > 1;

	return (
		<div className={classNames(styles['episodes-list'], className)}>
			<div className={styles['episodes-list__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['episodes-list__title']}>
					Episodes
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['episodes-list__count']}>
					{data.pagination?.items?.total || data.data.length} episodes
				</Label>
			</div>

			<div className={styles['episodes-list__grid']}>
				{data.data.map((episode) => (
					<div key={episode.mal_id} className={styles['episodes-list__item']}>
						<div className={styles['episodes-list__item-header']}>
							<Label as="span" font="typo-primary-m-semibold" className={styles['episodes-list__episode-number']}>
								Episode {episode.mal_id}
							</Label>
							{episode.filler && (
								<span className={classNames(styles['episodes-list__badge'], styles['episodes-list__badge--filler'])}>
									Filler
								</span>
							)}
							{episode.recap && (
								<span className={classNames(styles['episodes-list__badge'], styles['episodes-list__badge--recap'])}>
									Recap
								</span>
							)}
						</div>

						<Label as="h3" font="typo-primary-m-semibold" className={styles['episodes-list__episode-title']}>
							{episode.title}
						</Label>

						{episode.title_japanese && (
							<Label as="p" font="typo-primary-s-regular" className={styles['episodes-list__episode-title-jp']}>
								{episode.title_japanese}
							</Label>
						)}

						{episode.aired && (
							<Label as="p" font="typo-primary-s-regular" className={styles['episodes-list__episode-date']}>
								Aired: {new Date(episode.aired).toLocaleDateString('en-US', { 
									year: 'numeric', 
									month: 'short', 
									day: 'numeric' 
								})}
							</Label>
						)}

						{episode.forum_url && (
							<a 
								href={episode.forum_url} 
								target="_blank" 
								rel="noopener noreferrer"
								className={styles['episodes-list__forum-link']}
							>
								Discussion Forum →
							</a>
						)}
					</div>
				))}
			</div>

			{hasMultiplePages && (
				<div className={styles['episodes-list__pagination']}>
					<button
						onClick={() => setPage(p => Math.max(1, p - 1))}
						disabled={page === 1}
						className={styles['episodes-list__pagination-btn']}
					>
						← Previous
					</button>
					<Label as="span" font="typo-primary-m-regular" className={styles['episodes-list__pagination-info']}>
						Page {page} of {totalPages}
					</Label>
					<button
						onClick={() => setPage(p => Math.min(totalPages, p + 1))}
						disabled={page === totalPages}
						className={styles['episodes-list__pagination-btn']}
					>
						Next →
					</button>
				</div>
			)}
		</div>
	);
};

export default EpisodesList;
