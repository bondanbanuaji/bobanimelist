import { useState } from 'react';
import type { AnimeReview, MangaReview } from '@/services/tenrai';
import Label from '@/components/atoms/label';
import { Link } from 'react-router-dom';
import styles from './ReviewCard.module.scss';
import classNames from 'classnames';

interface ReviewCardProps {
	review: AnimeReview | MangaReview;
	className?: string;
}

export const ReviewCard = ({ review, className }: ReviewCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const maxLength = 300;
	const shouldTruncate = review.review.length > maxLength;
	const displayText = isExpanded || !shouldTruncate 
		? review.review 
		: review.review.substring(0, maxLength) + '...';

	const reviewDate = new Date(review.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	const mediaLink = review.type === 'anime' 
		? `/anime/${review.entry?.mal_id}` 
		: `/manga/${review.entry?.mal_id}`;

	return (
		<div className={classNames(styles['review-card'], className)}>
			<div className={styles['review-card__header']}>
				<div className={styles['review-card__user']}>
					<Link to={review.user.url} target="_blank" rel="noopener noreferrer">
						<img 
							src={review.user.images.jpg.image_url} 
							alt={review.user.username}
							className={styles['review-card__avatar']}
						/>
					</Link>
					<div className={styles['review-card__user-info']}>
						<Link 
							to={review.user.url} 
							target="_blank" 
							rel="noopener noreferrer"
							className={styles['review-card__username']}
						>
							<Label as="span" font="typo-primary-m-semibold">
								{review.user.username}
							</Label>
						</Link>
						<Label as="span" font="typo-primary-s-regular" className={styles['review-card__date']}>
							{reviewDate}
						</Label>
					</div>
				</div>
				
				<div className={styles['review-card__score']}>
					<Label as="span" font="typo-primary-xl-semibold" className={styles['review-card__score-value']}>
						{review.score}
					</Label>
					<Label as="span" font="typo-primary-s-regular" className={styles['review-card__score-label']}>
						/ 10
					</Label>
				</div>
			</div>

			{review.entry && (
				<Link to={mediaLink} className={styles['review-card__entry']}>
					<img 
						src={review.entry.images.jpg.image_url} 
						alt={review.entry.title}
						className={styles['review-card__entry-image']}
					/>
					<Label as="span" font="typo-primary-m-semibold" className={styles['review-card__entry-title']}>
						{review.entry.title}
					</Label>
				</Link>
			)}

			<div className={styles['review-card__badges']}>
				{review.is_spoiler && (
					<span className={classNames(styles['review-card__badge'], styles['review-card__badge--spoiler'])}>
						Spoiler
					</span>
				)}
				{review.is_preliminary && (
					<span className={classNames(styles['review-card__badge'], styles['review-card__badge--preliminary'])}>
						Preliminary
					</span>
				)}
				{review.tags.map((tag, index) => (
					<span key={index} className={styles['review-card__badge']}>
						{tag}
					</span>
				))}
			</div>

			<div className={styles['review-card__content']}>
				<Label as="p" font="typo-primary-m-regular" className={styles['review-card__text']}>
					{displayText}
				</Label>
				{shouldTruncate && (
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className={styles['review-card__expand-btn']}
					>
						{isExpanded ? 'Show Less' : 'Read More'}
					</button>
				)}
			</div>

			<div className={styles['review-card__footer']}>
				<div className={styles['review-card__reactions']}>
					<div className={styles['review-card__reaction']}>
						<span className={styles['review-card__reaction-emoji']}>👍</span>
						<Label as="span" font="typo-primary-s-regular">{review.reactions.overall}</Label>
					</div>
					<div className={styles['review-card__reaction']}>
						<span className={styles['review-card__reaction-emoji']}>❤️</span>
						<Label as="span" font="typo-primary-s-regular">{review.reactions.love_it}</Label>
					</div>
					<div className={styles['review-card__reaction']}>
						<span className={styles['review-card__reaction-emoji']}>😂</span>
						<Label as="span" font="typo-primary-s-regular">{review.reactions.funny}</Label>
					</div>
					<div className={styles['review-card__reaction']}>
						<span className={styles['review-card__reaction-emoji']}>💡</span>
						<Label as="span" font="typo-primary-s-regular">{review.reactions.informative}</Label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewCard;
