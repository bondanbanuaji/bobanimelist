import { type FC } from 'react';
import ImageCard from '@/components/atoms/image-card/ImageCard';
import Label from '@/components/atoms/label';
import type { Anime } from '@/services/tenrai/models';

interface SeasonAnimeListProps {
	anime: Anime[];
	seasonLabel: string;
	year: number;
	className?: string;
}

export const SeasonAnimeList: FC<SeasonAnimeListProps> = ({
	anime,
	seasonLabel,
	year,
	className,
}) => {
	if (anime.length === 0) {
		return (
			<div 
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '400px',
					padding: 'var(--s-spacing-8)',
					background: 'var(--s-color-bg-secondary)',
					borderRadius: '16px',
					border: '2px dashed var(--s-color-border-primary)',
					textAlign: 'center',
				}}
				role="status"
			>
				<Label as="p" font="typo-primary-l-regular">
					No anime found for {seasonLabel} {year}
				</Label>
			</div>
		);
	}

	return (
		<div className={className}>
			<Label 
				as="p" 
				font="typo-primary-m-regular" 
				style={{ 
					color: 'var(--s-color-fg-secondary)',
					marginBottom: 'var(--s-spacing-6)',
				}}
				role="status"
			>
				{anime.length} anime in {seasonLabel} {year}
			</Label>
			<div 
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
					gap: 'var(--s-spacing-5)',
					animation: 'fadeInUp 0.5s ease-out',
				}}
				role="list"
				aria-label={`Anime from ${seasonLabel} ${year}`}
			>
				{anime.map((item, index) => (
					<ImageCard
						key={item.mal_id}
						src={item.images.jpg.large_image_url || item.images.jpg.image_url}
						alt={item.title}
						navigateTo={`/anime/${item.mal_id}`}
						title={item.title}
						ratings={item.score ? String(item.score) : undefined}
						grid
						index={index}
					/>
				))}
			</div>
		</div>
	);
};

export default SeasonAnimeList;
