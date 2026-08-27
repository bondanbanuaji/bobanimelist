import { useGetPersonMangaQuery } from '@/services/tenrai';
import Label from '@/components/atoms/label';
import { Link } from 'react-router';
import ErrorState from '@/components/atoms/error-state';
import styles from './PersonWorks.module.scss';
import classNames from 'classnames';

interface PersonMangaWorksProps {
	personId: number;
	className?: string;
}

export const PersonMangaWorks = ({ personId, className }: PersonMangaWorksProps) => {
	const { data, isLoading, isError } = useGetPersonMangaQuery({ id: personId });

	if (isError) {
		return (
			<div className={classNames(styles['person-works'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['person-works__title']}>
					Manga Works
				</Label>
				<ErrorState 
					type="generic" 
					message="Failed to load manga works. Please try again later." 
					showRetryButton={true}
					onRetry={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classNames(styles['person-works'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['person-works__title']}>
					Manga Works
				</Label>
				<div className={styles['person-works__grid']}>
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className={styles['person-works__skeleton']} />
					))}
				</div>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null;
	}

	return (
		<div className={classNames(styles['person-works'], className)}>
			<div className={styles['person-works__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['person-works__title']}>
					Manga Works
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['person-works__count']}>
					{data.data.length} publications
				</Label>
			</div>

			<div className={styles['person-works__grid']}>
				{data.data.map((item) => (
					<Link
						key={item.manga.mal_id}
						to={`/manga/${item.manga.mal_id}`}
						className={styles['person-works__card']}
					>
						<div className={styles['person-works__image-wrapper']}>
							<img
								src={item.manga.images.jpg.image_url}
								alt={item.manga.title}
								className={styles['person-works__image']}
								loading="lazy"
							/>
						</div>
						<div className={styles['person-works__info']}>
							<Label as="h3" font="typo-primary-m-semibold" className={styles['person-works__name']}>
								{item.manga.title}
							</Label>
							<Label as="span" font="typo-primary-s-regular" className={styles['person-works__position']}>
								{item.position}
							</Label>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default PersonMangaWorks;
