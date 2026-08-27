import { useGetAnimeStreamingQuery } from '@/services/tenrai';
import ErrorState from '@/components/atoms/error-state';
import styles from './StreamingLinks.module.scss';
import classNames from 'classnames';
import Label from '@/components/atoms/label';

interface StreamingLinksProps {
	animeId: number;
	className?: string;
}

export const StreamingLinks = ({ animeId, className }: StreamingLinksProps) => {
	const { data, isLoading, isError } = useGetAnimeStreamingQuery({ id: animeId });

	if (isLoading) {
		return (
			<div className={classNames(styles['streaming-links'], className)}>
				<Label as="h3" font="typo-primary-l-semibold" className={styles['streaming-links__title']}>
					Watch On
				</Label>
				<div className={styles['streaming-links__grid']}>
					{[...Array(3)].map((_, i) => (
						<div key={i} className={classNames(styles['streaming-link'], styles['streaming-link--loading'])} />
					))}
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className={classNames(styles['streaming-links'], className)}>
				<Label as="h3" font="typo-primary-l-semibold" className={styles['streaming-links__title']}>
					Watch On
				</Label>
				<ErrorState 
					type="generic" 
					message="Failed to load streaming links. Please try again later." 
					showRetryButton={true}
					onRetry={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null; // Still return null when there's no data (no links available)
	}

	return (
		<div className={classNames(styles['streaming-links'], className)}>
			<Label as="h3" font="typo-primary-l-semibold" className={styles['streaming-links__title']}>
				Watch On
			</Label>
			<div className={styles['streaming-links__grid']}>
				{data.data.map((stream, index) => (
					<a
						key={index}
						href={stream.url}
						target="_blank"
						rel="noopener noreferrer"
						className={styles['streaming-link']}
						aria-label={`Watch on ${stream.name}`}
					>
						<span className={styles['streaming-link__icon']}>▶️</span>
						<Label as="span" font="typo-primary-m-medium">
							{stream.name}
						</Label>
					</a>
				))}
			</div>
		</div>
	);
};

export default StreamingLinks;
