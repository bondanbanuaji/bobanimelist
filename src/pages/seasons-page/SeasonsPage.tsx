import { useGetSeasonAnimeQuery } from '@/services/tenrai';
import { SeasonAnimeList, SeasonSkeleton } from '@/components/widgets/seasons';
import Label from '@/components/atoms/label';
import { ErrorState } from '@/components/atoms/error-state';
import styles from './SeasonsPage.module.scss';

const SEASON_LABELS: Record<string, string> = {
	winter: 'Winter',
	spring: 'Spring',
	summer: 'Summer',
	fall: 'Fall',
};

const getCurrentSeason = (): string => {
	const month = new Date().getMonth();
	if (month < 3) return 'winter';
	if (month < 6) return 'spring';
	if (month < 9) return 'summer';
	return 'fall';
};

export const SeasonsPage = () => {
	const currentSeason = getCurrentSeason();
	const currentYear = new Date().getFullYear();

	const { data, isLoading, isError } = useGetSeasonAnimeQuery({
		page: 1,
		limit: 25,
		sfw: true,
	});

	return (
		<div className={styles['seasons-page']}>
			<header className={styles['seasons-page__header']}>
				<Label as="h1" font="typo-primary-xl-semibold" className={styles['seasons-page__title']}>
					Current Season Anime
				</Label>
				<Label as="p" font="typo-primary-l-regular" className={styles['seasons-page__subtitle']}>
					{SEASON_LABELS[currentSeason]} {currentYear} anime
				</Label>
			</header>

			<main className={styles['seasons-page__content']}>
				{isLoading && (
					<SeasonSkeleton 
						count={12} 
						className={styles['seasons-page__loading']} 
					/>
				)}

				{isError && (
					<ErrorState message="Failed to load seasonal anime. Please try again later." />
				)}

				{!isLoading && !isError && data?.data && (
					<SeasonAnimeList
						anime={data.data}
						seasonLabel={SEASON_LABELS[currentSeason]}
						year={currentYear}
						className={styles['seasons-page__grid-container']}
					/>
				)}
			</main>
		</div>
	);
};

export default SeasonsPage;
