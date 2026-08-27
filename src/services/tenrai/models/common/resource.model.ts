export interface TenraiResource {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

export interface TenraiNamedResource {
	name: string;
	url: string;
}

export interface TenraiResourceTitle {
	type: string;
	title: string;
}

export interface TenraiResourcePeriod {
	from: string;
	to: string;
	string: string;
	prop: {
		from: { day: number; month: number; year: number; };
		to: { day: number; month: number; year: number; };
	};
}

export interface TenraiResourceRelation {
	relation: string;
	entry: TenraiResource[];
}
