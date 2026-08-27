import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLazyGetRandomAnimeQuery, useLazyGetRandomMangaQuery } from '@/services/tenrai';
import styles from './RandomButton.module.scss';
import classNames from 'classnames';

interface RandomButtonProps {
	type?: 'anime' | 'manga';
	variant?: 'primary' | 'secondary';
	className?: string;
}

export const RandomButton = ({ type = 'anime', variant = 'primary', className }: RandomButtonProps) => {
	const navigate = useNavigate();
	const [isRolling, setIsRolling] = useState(false);
	
	const [triggerAnime] = useLazyGetRandomAnimeQuery();
	const [triggerManga] = useLazyGetRandomMangaQuery();

	const handleRandom = async () => {
		setIsRolling(true);
		
		try {
			const result = type === 'anime' 
				? await triggerAnime().unwrap()
				: await triggerManga().unwrap();
			
			if (result?.data) {
				const path = type === 'anime' 
					? `/anime/${result.data.mal_id}`
					: `/manga/${result.data.mal_id}`;
				navigate(path);
			}
		} catch (error) {
			console.error('Random fetch failed:', error);
			setIsRolling(false);
		}
	};

	return (
		<button
			onClick={handleRandom}
			disabled={isRolling}
			className={classNames(
				styles['random-button'],
				styles[`random-button--${variant}`],
				{ [styles['random-button--rolling']]: isRolling },
				className
			)}
			aria-label={`Get random ${type}`}
		>
			<span className={styles['random-button__icon']} aria-hidden="true">
				🎲
			</span>
			<span className={styles['random-button__text']}>
				{isRolling ? 'Rolling...' : 'Feeling Lucky'}
			</span>
		</button>
	);
};

export default RandomButton;
