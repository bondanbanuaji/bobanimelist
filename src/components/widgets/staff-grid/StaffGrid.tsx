import { useState } from 'react';
import { useGetAnimeStaffQuery } from '@/services/tenrai';
import { Link } from 'react-router';
import Image from '@/components/atoms/image';
import Label from '@/components/atoms/label';
import ErrorState from '@/components/atoms/error-state';
import styles from './StaffGrid.module.scss';
import classNames from 'classnames';

interface StaffGridProps {
	animeId: number;
	initialLimit?: number;
	className?: string;
}

const DEFAULT_INITIAL_LIMIT = 4;

export const StaffGrid = ({ animeId, initialLimit = DEFAULT_INITIAL_LIMIT, className }: StaffGridProps) => {
	const [showAll, setShowAll] = useState(false);
	const { data, isLoading, isError } = useGetAnimeStaffQuery({ id: animeId });

	if (isLoading) {
		return (
			<div className={classNames(styles['staff-grid'], className)}>
				<Label as="h3" font="typo-primary-l-semibold" className={styles['staff-grid__title']}>
					Staff
				</Label>
				<div className={styles['staff-grid__container']}>
					{[...Array(initialLimit)].map((_, i) => (
						<div key={i} className={classNames(styles['staff-card'], styles['staff-card--loading'])}>
							<div className={styles['staff-card__image']} />
							<div className={styles['staff-card__content']}>
								<div className={styles['staff-card__name']} />
								<div className={styles['staff-card__role']} />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className={classNames(styles['staff-grid'], className)}>
				<Label as="h3" font="typo-primary-l-semibold" className={styles['staff-grid__title']}>
					Staff
				</Label>
				<ErrorState 
					type="generic" 
					message="Failed to load staff information. Please try again later." 
					showRetryButton={true}
					onRetry={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (!data?.data || data.data.length === 0) {
		return null;
	}

	const staffWithImages = data.data.filter((staff) => {
		const imageUrl = staff.person.images.jpg.image_url;
		return imageUrl && !imageUrl.includes('questionmark');
	});

	if (staffWithImages.length === 0) {
		return null;
	}

	const totalStaff = staffWithImages.length;
	const hasMore = totalStaff > initialLimit;
	const displayedStaff = showAll ? staffWithImages : staffWithImages.slice(0, initialLimit);

	return (
		<div className={classNames(styles['staff-grid'], className)}>
			<div className={styles['staff-grid__header']}>
				<Label as="h3" font="typo-primary-l-semibold" className={styles['staff-grid__title']}>
					Staff
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['staff-grid__count']}>
					{showAll ? totalStaff : `${Math.min(initialLimit, totalStaff)} / ${totalStaff}`}
				</Label>
			</div>
			<div className={styles['staff-grid__container']}>
				{displayedStaff.map((staff, index) => (
					<Link
						key={`${staff.person.mal_id}-${index}`}
						to={`/people/${staff.person.mal_id}`}
						className={styles['staff-card']}
						aria-label={`View ${staff.person.name} profile`}
					>
						<div className={styles['staff-card__image']}>
							<Image
								src={staff.person.images.jpg.image_url}
								alt={staff.person.name}
								className={styles['staff-card__img']}
							/>
						</div>
						<div className={styles['staff-card__content']}>
							<Label as="h4" font="typo-primary-m-medium" className={styles['staff-card__name']}>
								{staff.person.name}
							</Label>
							<Label as="p" font="typo-primary-s-regular" className={styles['staff-card__role']}>
								{staff.positions.join(', ')}
							</Label>
						</div>
					</Link>
				))}
			</div>

			{hasMore && (
				<div className={styles['staff-grid__footer']}>
					<button
						type="button"
						onClick={() => setShowAll(!showAll)}
						className={styles['staff-grid__view-all']}
					>
						{showAll ? 'Show Less' : `View All Staff (${totalStaff - initialLimit} more)`}
					</button>
				</div>
			)}
		</div>
	);
};

export default StaffGrid;
