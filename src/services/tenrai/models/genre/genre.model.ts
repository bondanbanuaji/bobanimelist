import type { TenraiNamedResource } from '../common';

export interface Genre extends TenraiNamedResource {
	mal_id: number;
	count: number;
}
