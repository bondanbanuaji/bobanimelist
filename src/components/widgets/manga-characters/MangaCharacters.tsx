import { useGetMangaCharactersQuery } from '@/services/tenrai';
import Label from '@/components/atoms/label';
import ErrorState from '@/components/atoms/error-state';
import styles from './MangaCharacters.module.scss';
import classNames from 'classnames';
import { Link } from 'react-router';

interface MangaCharactersProps {
	mangaId: number;
	className?: string;
}

export const MangaCharacters = ({ mangaId, className }: MangaCharactersProps) => {
	const { data, isLoading, isError } = useGetMangaCharactersQuery({ id: mangaId });

	if (isError) {
		return (
			<div className={classNames(styles['manga-characters'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['manga-characters__title']}>
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
			<div className={classNames(styles['manga-characters'], className)}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['manga-characters__title']}>
					Characters
				</Label>
				<div className={styles['manga-characters__grid']}>
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className={styles['manga-characters__skeleton']} />
					))}
				</div>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null; // Hide section if no characters
	}

	return (
		<div className={classNames(styles['manga-characters'], className)}>
			<div className={styles['manga-characters__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['manga-characters__title']}>
					Characters
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['manga-characters__count']}>
					{data.data.length} characters
				</Label>
			</div>

			<div className={styles['manga-characters__grid']}>
				{data.data.map((item) => (
					<Link
						key={item.character.mal_id}
						to={`/character/${item.character.mal_id}`}
						className={styles['manga-characters__card']}
					>
						<div className={styles['manga-characters__image-wrapper']}>
							<img
								src={item.character.images.jpg.image_url}
								alt={item.character.name}
								className={styles['manga-characters__image']}
								loading="lazy"
							/>
						</div>
						<div className={styles['manga-characters__info']}>
							<Label as="h3" font="typo-primary-m-semibold" className={styles['manga-characters__name']}>
								{item.character.name}
							</Label>
							<Label as="span" font="typo-primary-s-regular" className={styles['manga-characters__role']}>
								{item.role}
							</Label>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default MangaCharacters;
