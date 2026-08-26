import { useState } from 'react';
import { Link } from 'react-router';
import Label from '@/components/atoms/label';
import styles from './MangaStaff.module.scss';
import classNames from 'classnames';

interface MangaAuthor {
	mal_id: number;
	name: string;
	type: string;
}

interface MangaStaffProps {
	authors: MangaAuthor[];
	initialLimit?: number;
	className?: string;
}

const DEFAULT_INITIAL_LIMIT = 4;

export const MangaStaff = ({ authors, initialLimit = DEFAULT_INITIAL_LIMIT, className }: MangaStaffProps) => {
	const [showAll, setShowAll] = useState(false);

	if (!authors || authors.length === 0) {
		return null;
	}

	const totalAuthors = authors.length;
	const hasMore = totalAuthors > initialLimit;
	const displayedAuthors = showAll ? authors : authors.slice(0, initialLimit);

	return (
		<div className={classNames(styles['manga-staff'], className)}>
			<div className={styles['manga-staff__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['manga-staff__title']}>
					Staff
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['manga-staff__count']}>
					{showAll ? totalAuthors : `${Math.min(initialLimit, totalAuthors)} / ${totalAuthors}`} authors
				</Label>
			</div>

			<div className={styles['manga-staff__grid']}>
				{displayedAuthors.map((author) => (
					<Link
						key={author.mal_id}
						to={`/people/${author.mal_id}`}
						className={styles['manga-staff__card']}
					>
						<div className={styles['manga-staff__avatar']}>
							<span className={styles['manga-staff__initial']}>
								{author.name.charAt(0).toUpperCase()}
							</span>
						</div>
						<div className={styles['manga-staff__info']}>
							<Label as="h3" font="typo-primary-m-semibold" className={styles['manga-staff__name']}>
								{author.name}
							</Label>
							<Label as="span" font="typo-primary-s-regular" className={styles['manga-staff__role']}>
								Author
							</Label>
						</div>
					</Link>
				))}
			</div>

			{hasMore && (
				<div className={styles['manga-staff__footer']}>
					<button
						type="button"
						onClick={() => setShowAll(!showAll)}
						className={styles['manga-staff__view-all']}
					>
						{showAll ? 'Show Less' : `View All Authors (${totalAuthors - initialLimit} more)`}
					</button>
				</div>
			)}
		</div>
	);
};

export default MangaStaff;
