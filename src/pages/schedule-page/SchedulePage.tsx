import { useState, useMemo, useEffect } from 'react';
import { useGetSchedulesQuery } from '@/services/tenrai';
import type { SchedulesFilter } from '@/services/tenrai/models/params/schedules-params.model';
import ImageCard, { ImageCardLoading } from '@/components/atoms/image-card/ImageCard';
import Label from '@/components/atoms/label';
import { ErrorState } from '@/components/atoms/error-state';
import styles from './SchedulePage.module.scss';
import classNames from 'classnames';

const DAYS: SchedulesFilter[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DAY_LABELS: Record<SchedulesFilter, string> = {
	monday: 'Monday',
	tuesday: 'Tuesday',
	wednesday: 'Wednesday',
	thursday: 'Thursday',
	friday: 'Friday',
	saturday: 'Saturday',
	sunday: 'Sunday',
	unknown: 'Unknown',
	other: 'Other',
};

export const SchedulePage = () => {
	// Get current day (0 = Sunday, 1 = Monday, ...)
	const currentDayIndex = useMemo(() => {
		const day = new Date().getDay();
		return day === 0 ? 6 : day - 1; // Convert to 0-6 where 0 = Monday
	}, []);

	const [selectedDay, setSelectedDay] = useState<SchedulesFilter | 'all'>(DAYS[currentDayIndex]);

	const { data, isLoading, isError } = useGetSchedulesQuery(
		selectedDay === 'all' ? {} : { filter: selectedDay }
	);

	// Scroll to top when day changes
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [selectedDay]);

	return (
		<div className={styles['schedule-page']}>
			<header className={styles['schedule-page__header']}>
				<Label as="h1" font="typo-primary-xl-semibold" className={styles['schedule-page__title']}>
					Anime Schedule
				</Label>
				<Label as="p" font="typo-primary-l-regular" className={styles['schedule-page__subtitle']}>
					Check out what's airing this week
				</Label>
			</header>

			<nav className={styles['schedule-page__filters']} aria-label="Day filter">
				<button
					onClick={() => setSelectedDay('all')}
					className={classNames(
						styles['schedule-page__filter-btn'],
						{ [styles['schedule-page__filter-btn--active']]: selectedDay === 'all' }
					)}
					aria-pressed={selectedDay === 'all'}
					aria-label="Show all days"
				>
					All Days
				</button>
				{DAYS.map((day) => {
					const isToday = DAYS[currentDayIndex] === day;
					const isActive = selectedDay === day;
					
					return (
						<button
							key={day}
							onClick={() => setSelectedDay(day)}
							className={classNames(
								styles['schedule-page__filter-btn'],
								{ [styles['schedule-page__filter-btn--active']]: isActive },
								{ [styles['schedule-page__filter-btn--today']]: isToday }
							)}
							aria-pressed={isActive}
							aria-label={isToday ? `${DAY_LABELS[day]} (Today)` : DAY_LABELS[day]}
						>
							{DAY_LABELS[day]}
							{isToday && (
								<span className={styles['schedule-page__today-badge']} aria-hidden="true">
									Today
								</span>
							)}
						</button>
					);
				})}
			</nav>

			<main className={styles['schedule-page__content']}>
				{isLoading && (
					<div className={styles['schedule-page__grid']} aria-busy="true" aria-label="Loading anime">
						{[...Array(12)].map((_, i) => (
							<ImageCardLoading key={i} grid />
						))}
					</div>
				)}

				{isError && (
					<ErrorState message="Failed to load schedule. Please try again later." />
				)}

				{!isLoading && !isError && data?.data && (
					<>
						{data.data.length === 0 ? (
							<div className={styles['schedule-page__empty']} role="status">
								<Label as="p" font="typo-primary-l-regular">
									No anime scheduled for {selectedDay === 'all' ? 'this week' : DAY_LABELS[selectedDay]}
								</Label>
							</div>
						) : (
							<>
								<Label as="p" font="typo-primary-m-regular" className={styles['schedule-page__count']} role="status">
									{data.data.length} anime {selectedDay === 'all' ? 'this week' : `on ${DAY_LABELS[selectedDay]}`}
								</Label>
								<div 
									className={styles['schedule-page__grid']} 
									role="list"
									aria-label={`Anime airing ${selectedDay === 'all' ? 'this week' : `on ${DAY_LABELS[selectedDay]}`}`}
								>
									{data.data.map((anime, index) => (
										<ImageCard
											key={anime.mal_id}
											src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
											alt={anime.title}
											navigateTo={`/anime/${anime.mal_id}`}
											title={anime.title}
											ratings={anime.score?.toString()}
											grid
											index={index}
										/>
									))}
								</div>
							</>
						)}
					</>
				)}
			</main>
		</div>
	);
};

export default SchedulePage;
