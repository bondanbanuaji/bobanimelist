import { useGetCharacterMangaQuery } from '@/services/tenrai';
import Label from '@/components/atoms/label';
import { Link } from 'react-router';
import ErrorState from '@/components/atoms/error-state';
import styles from './CharacterAppearances.module.scss';
import classNames from 'classnames';

interface CharacterMangaAppearancesProps {
	characterId: number;
	className?: string;
}

export const CharacterMangaAppearances = ({ characterId, className }: CharacterMangaAppearancesProps) => {
	const { data, isLoading, isError } = useGetCharacterMangaQuery({ id: characterId });

	if (isError) {
		return (
			<div className={classNames(styles['character-appearances'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['character-appearances__title']}>
					Manga Appearances
				</Label>
				<ErrorState 
					type="generic" 
					message="Failed to load manga appearances. Please try again later." 
					showRetryButton={true}
					onRetry={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classNames(styles['character-appearances'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['character-appearances__title']}>
					Manga Appearances
				</Label>
				<div className={styles['character-appearances__grid']}>
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className={styles['character-appearances__skeleton']} />
					))}
				</div>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null;
	}

	return (
		<div className={classNames(styles['character-appearances'], className)}>
			<div className={styles['character-appearances__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['character-appearances__title']}>
					Manga Appearances
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['character-appearances__count']}>
					{data.data.length} manga
				</Label>
			</div>

			<div className={styles['character-appearances__grid']}>
				{data.data.map((item) => (
					<Link
						key={item.manga.mal_id}
						to={`/manga/${item.manga.mal_id}`}
						className={styles['character-appearances__card']}
					>
						<div className={styles['character-appearances__image-wrapper']}>
							<img
								src={item.manga.images.jpg.image_url}
								alt={item.manga.title}
								className={styles['character-appearances__image']}
								loading="lazy"
							/>
						</div>
						<div className={styles['character-appearances__info']}>
							<Label as="h3" font="typo-primary-m-semibold" className={styles['character-appearances__name']}>
								{item.manga.title}
							</Label>
							<Label as="span" font="typo-primary-s-regular" className={styles['character-appearances__role']}>
								{item.role}
							</Label>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default CharacterMangaAppearances;
