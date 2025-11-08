import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useGetSeasonAnimeQuery } from '@/services/jikan';
import { useLazyGetRandomAnimeQuery } from '@/services/jikan/randomApi';
import { useJikanTranslation } from '@/hooks/useJikanTranslation';
import ImageCard, { ImageCardLoading } from '@/components/atoms/image-card/ImageCard';
import Label from '@/components/atoms/label';
import { ErrorState } from '@/components/atoms/error-state';
import { useScrollParallax } from '@/hooks/useParallax3D';
import styles from './HomePage.module.scss';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_SEASON = (() => {
	const month = new Date().getMonth();
	if (month < 3) return 'winter';
	if (month < 6) return 'spring';
	if (month < 9) return 'summer';
	return 'fall';
})() as 'winter' | 'spring' | 'summer' | 'fall';

export const HomePage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const heroRef = useRef<HTMLDivElement>(null);
	const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
	
	// Parallax effects for sections
	const featuredParallax = useScrollParallax(80);
	const seasonParallax = useScrollParallax(50);

	// Fetch current season anime
	const { data: seasonData, isLoading: seasonLoading, isError: seasonError } = useGetSeasonAnimeQuery({
		year: CURRENT_YEAR,
		season: CURRENT_SEASON,
		page: 1,
		limit: 12,
		sfw: true,
	});

	// Fetch random featured anime
	const [getRandomAnime, { data: randomData, isLoading: randomLoading }] = useLazyGetRandomAnimeQuery();
	
	// Translate Jikan data
	const translatedSeasonData = useJikanTranslation(seasonData, { dataType: 'anime' });
	const translatedRandomData = useJikanTranslation(randomData, { dataType: 'anime' });

	useEffect(() => {
		getRandomAnime();
	}, [getRandomAnime]);

	// 3D Tilt effect handler
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!heroRef.current) return;

		const rect = heroRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		// Calculate rotation based on cursor position
		// Max tilt: 8 degrees
		const rotateY = ((x - centerX) / centerX) * 8;
		const rotateX = ((centerY - y) / centerY) * 8;

		setTiltStyle({
			transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`,
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
		<div className={styles['home-page']}>
			{/* Hero Section with 3D Tilt */}
			<section 
				ref={heroRef}
				className={styles['home-page__hero']}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				style={tiltStyle}
			>
				<div className={styles['home-page__hero-content']}>
					<Label as="h1" font="typo-primary-xl-semibold" className={styles['home-page__hero-title']}>
						{t('hero_title')}
					</Label>
					<Label as="p" font="typo-primary-l-regular" className={styles['home-page__hero-subtitle']}>
						{t('hero_subtitle')}
					</Label>
					<div className={styles['home-page__hero-buttons']}>
						<button 
							onClick={() => navigate('/anime')}
							className={styles['home-page__hero-btn']}
						>
							{t('browse_anime')}
						</button>
						<button 
							onClick={() => navigate('/manga')}
							className={styles['home-page__hero-btn']}
						>
							{t('browse_manga')}
						</button>
						<button 
							onClick={() => navigate('/schedule')}
							className={styles['home-page__hero-btn-secondary']}
						>
							{t('view_schedule')}
						</button>
					</div>
				</div>
			</section>

			{/* Random Featured Anime with Parallax */}
			{!randomLoading && translatedRandomData?.data && translatedRandomData.data.images?.jpg && (
				<motion.section 
					ref={featuredParallax.ref}
					className={styles['home-page__featured']}
					style={{ 
						y: featuredParallax.y,
						rotateX: featuredParallax.rotateX,
						transformStyle: 'preserve-3d'
					}}
				>
					<div className={styles['home-page__featured-card']}>
						<div className={styles['home-page__featured-image']}>
							<img 
								src={translatedRandomData.data.images.jpg.large_image_url || translatedRandomData.data.images.jpg.image_url} 
								alt={translatedRandomData.data.title}
							/>
						</div>
						<div className={styles['home-page__featured-info']}>
							<Label as="span" font="typo-primary-s-semibold" className={styles['home-page__featured-badge']}>
								{t('featured')}
							</Label>
							<Label as="h2" font="typo-primary-xl-semibold" className={styles['home-page__featured-title']}>
								{translatedRandomData.data.title}
							</Label>
							<p className={styles['home-page__featured-synopsis']}>
								{translatedRandomData.data.synopsis?.substring(0, 300)}...
							</p>
							<button 
								onClick={() => navigate(`/anime/${translatedRandomData.data.mal_id}`)}
								className={styles['home-page__featured-btn']}
							>
								{t('view_details')}
							</button>
						</div>
					</div>
				</motion.section>
			)}

			{/* Current Season Anime with Parallax */}
			<motion.section 
				ref={seasonParallax.ref}
				className={styles['home-page__section']}
				style={{ 
					y: seasonParallax.y,
					transformStyle: 'preserve-3d'
				}}
			>
				<div className={styles['home-page__section-header']}>
					<Label as="h2" font="typo-primary-xl-semibold" className={styles['home-page__section-title']}>
						{t(CURRENT_SEASON)} {CURRENT_YEAR} {t('anime_nav')}
					</Label>
					<button 
						onClick={() => navigate('/seasons')}
						className={styles['home-page__section-link']}
					>
						{t('see_all')}
					</button>
				</div>

				{seasonLoading && (
					<div className={styles['home-page__grid']}>
						{Array.from({ length: 12 }).map((_, i) => (
							<ImageCardLoading key={i} grid />
						))}
					</div>
				)}

				{seasonError && (
					<ErrorState message="Failed to load seasonal anime" />
				)}

				{!seasonLoading && !seasonError && translatedSeasonData?.data && (
					<div className={styles['home-page__grid']}>
						{translatedSeasonData.data
							.filter(anime => anime.images?.jpg) // Filter out items without images
							.map((anime, index) => (
								<ImageCard
									key={anime.mal_id}
									src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
									alt={anime.title}
									navigateTo={`/anime/${anime.mal_id}`}
									title={anime.title}
									ratings={anime.score ? String(anime.score) : undefined}
									grid
									index={index}
								/>
							))
						}
					</div>
				)}
			</motion.section>

			{/* Quick Actions */}
			<section className={styles['home-page__actions']}>
				<button onClick={() => navigate('/seasons')} className={styles['home-page__action-card']}>
					<Label as="h3" font="typo-primary-l-semibold">{t('seasons_nav')}</Label>
					<Label as="p" font="typo-primary-m-regular">{t('ALP_CURRENT_SEASON_TITLE')}</Label>
				</button>
				<button onClick={() => navigate('/schedule')} className={styles['home-page__action-card']}>
					<Label as="h3" font="typo-primary-l-semibold">{t('schedule_nav')}</Label>
					<Label as="p" font="typo-primary-m-regular">{t('ALP_SCHEDULE_TITLE')}</Label>
				</button>
				<button onClick={() => navigate('/search')} className={styles['home-page__action-card']}>
					<Label as="h3" font="typo-primary-l-semibold">{t('search_nav')}</Label>
					<Label as="p" font="typo-primary-m-regular">{t('search_placeholder')}</Label>
				</button>
			</section>
		</div>
	);
};

export default HomePage;
