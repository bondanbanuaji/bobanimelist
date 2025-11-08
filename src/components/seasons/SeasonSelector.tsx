import { type FC, useRef, useState } from 'react';
import Label from '@/components/atoms/label';
import classNames from 'classnames';
import type { SeasonName } from '@/services/jikan/models/schedule/season-archive.model';
import styles from './SeasonSelector.module.scss';

interface SeasonSelectorProps {
	selectedYear: number;
	selectedSeason: SeasonName;
	years: number[];
	availableSeasons: SeasonName[];
	onYearChange: (year: number) => void;
	onSeasonChange: (season: SeasonName) => void;
	isLoading?: boolean;
	currentYear: number;
	currentSeason: SeasonName;
	className?: string;
}

const SEASON_LABELS: Record<SeasonName, string> = {
	winter: 'Winter',
	spring: 'Spring',
	summer: 'Summer',
	fall: 'Fall',
};

const SEASON_ICONS: Record<SeasonName, string> = {
	winter: '❄️',
	spring: '🌸',
	summer: '☀️',
	fall: '🍂',
};

export const SeasonSelector: FC<SeasonSelectorProps> = ({
	selectedYear,
	selectedSeason,
	years,
	availableSeasons,
	onYearChange,
	onSeasonChange,
	isLoading = false,
	currentYear,
	currentSeason,
	className,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
	const isCurrentSeason = selectedYear === currentYear && selectedSeason === currentSeason;

	// 3D Tilt effect handler - inspired by HomePage hero
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		// Calculate rotation based on cursor position (max tilt: 5 degrees for subtle effect)
		const rotateY = ((x - centerX) / centerX) * 5;
		const rotateX = ((centerY - y) / centerY) * 5;

		setTiltStyle({
			transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`,
			transition: 'transform 0.15s ease-out',
		});
	};

	const handleMouseLeave = () => {
		setTiltStyle({
			transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
			transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
		});
	};

	return (
		<div 
			ref={containerRef}
			className={classNames(styles['season-selector'], className)}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={tiltStyle}
		>
			{/* Year Selector */}
			<div className={styles['season-selector__year-section']}>
				<Label
					as="label"
					font="typo-primary-m-semibold"
					className={styles['season-selector__label']}
				>
					Year
				</Label>
				<select
					value={selectedYear}
					onChange={(e) => onYearChange(Number(e.target.value))}
					disabled={isLoading}
					aria-label="Select year"
					className={styles['season-selector__year-select']}
				>
					{years.map(year => (
						<option 
							key={year} 
							value={year}
						>
							{year} {year === currentYear && '(Current)'}
						</option>
					))}
				</select>
			</div>

			{/* Season Tabs */}
			<nav aria-label="Season selector" className={styles['season-selector__nav']}>
				<div className={styles['season-selector__season-grid']}>
					{(['winter', 'spring', 'summer', 'fall'] as SeasonName[]).map((season) => {
						const isAvailable = availableSeasons.includes(season);
						const isActive = selectedSeason === season;
						const isCurrent = currentYear === selectedYear && season === currentSeason;

						return (
							<button
								key={season}
								onClick={() => isAvailable && onSeasonChange(season)}
								disabled={!isAvailable}
								className={classNames(
									styles['season-selector__season-btn'],
									isActive && styles['season-selector__season-btn--active'],
									!isAvailable && styles['season-selector__season-btn--disabled']
								)}
								data-season={season}
								aria-pressed={isActive}
								aria-label={`${SEASON_LABELS[season]}${isCurrent ? ' (Current)' : ''}`}
							>
								<span className={styles['season-selector__season-icon']} aria-hidden="true">
									{SEASON_ICONS[season]}
								</span>
								<span className={styles['season-selector__season-label']}>
									{SEASON_LABELS[season]}
								</span>
								{isCurrent && isCurrentSeason && (
									<span className={styles['season-selector__current-badge']} aria-hidden="true">
										Current
									</span>
								)}
							</button>
						);
					})}
				</div>
			</nav>
		</div>
	);
};

export default SeasonSelector;