import type { TenraiImages, TenraiNamedResource } from '../common';

export interface Producer {
    mal_id: number;
    type: string;
    name: string;
    url: string;
    images: TenraiImages;
    approved: boolean;
    count: number;
    external: TenraiNamedResource[];
}