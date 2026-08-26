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
	limit?: number;
	className?: string;
}

const DEFAULT_LIMIT = 8;

export const MangaStaff = ({ authors, limit = DEFAULT_LIMIT, className }: MangaStaffProps) => {
	if (!authors || authors.length === 0) {
		return null;
	}

	const displayedAuthors = authors.slice(0, limit);
	const hasMore = authors.length > limit;

	return (
		<div className={classNames(styles['manga-staff'], className)}>
			<div className={styles['manga-staff__header']}>
				<Label as="h2" font="typo-primary-xl-semibold" className={styles['manga-staff__title']}>
					Staff
				</Label>
				<Label as="span" font="typo-primary-m-regular" className={styles['manga-staff__count']}>
					{authors.length} authors
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
					<span className={styles['manga-staff__view-all']}>
						View All Authors
					</span>
				</div>
			)}
		</div>
	);
};

export default MangaStaff;
