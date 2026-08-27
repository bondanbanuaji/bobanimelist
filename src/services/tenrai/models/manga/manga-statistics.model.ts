export interface MangaStatistics {
	reading: number;
	completed: number;
	on_hold: number;
	dropped: number;
	plan_to_read: number;
	total: number;
	scores: Array<{
		score: number;
		votes: number;
		percentage: number;
	}>;
}
