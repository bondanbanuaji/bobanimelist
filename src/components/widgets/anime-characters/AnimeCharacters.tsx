import { useGetAnimeCharactersQuery } from '@/services/jikan';
import { Link } from 'react-router';
import Label from '@/components/atoms/label';
import ErrorState from '@/components/atoms/error-state';
import styles from './AnimeCharacters.module.scss';
import classNames from 'classnames';

interface AnimeCharactersProps {
	animeId: number;
	className?: string;
}

export const AnimeCharacters = ({ animeId, className }: AnimeCharactersProps) => {
	const { data, isLoading, isError } = useGetAnimeCharactersQuery({ id: animeId });

	if (isError) {
		return (
			<div className={classNames(styles['anime-characters'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['anime-characters__title']}>
					Characters
				</Label>
				<ErrorState 
					type="generic" 
					message="Failed to load characters. Please try again later." 
					showRetryButton={true}
					onRetry={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classNames(styles['anime-characters'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['anime-characters__title']}>
					Characters
				</Label>
				<div className={styles['anime-characters__grid']}>
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className={styles['anime-characters__skeleton']} />
					))}
				</div>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null;
	}

	return (
		<div className={classNames(styles['anime-characters'], className)}>
			<div className={styles['anime-characters__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['anime-characters__title']}>
					Characters
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['anime-characters__count']}>
					{data.data.length} characters
				</Label>
			</div>

			<div className={styles['anime-characters__grid']}>
				{data.data.map((item) => (
					<Link
						key={item.character.mal_id}
						to={`/character/${item.character.mal_id}`}
						className={styles['anime-characters__card']}
					>
						<div className={styles['anime-characters__image-wrapper']}>
							<img
								src={item.character.images.jpg.image_url}
								alt={item.character.name}
								className={styles['anime-characters__image']}
								loading="lazy"
							/>
						</div>
						<div className={styles['anime-characters__info']}>
							<Label as="h3" font="typo-primary-m-semibold" className={styles['anime-characters__name']}>
								{item.character.name}
							</Label>
							<Label as="span" font="typo-primary-s-regular" className={styles['anime-characters__role']}>
								{item.role}
							</Label>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default AnimeCharacters;
