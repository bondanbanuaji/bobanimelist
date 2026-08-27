export interface SeasonArchive {
	year: number;
	seasons: SeasonName[];
}

export type SeasonName = 'winter' | 'spring' | 'summer' | 'fall';

export interface SeasonParams {
	year: number;
	season: SeasonName;
	filter?: string;
	sfw?: boolean;
	unapproved?: boolean;
	continuing?: boolean;
	page?: number;
	limit?: number;
}
