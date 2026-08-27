export interface TenraiPagination {
	last_visible_page: number
	has_next_page: boolean
	items?: TenraiPaginationItems
}

export interface TenraiPaginationItems {
	count: number
	total: number
	per_page: number
}

export interface TenraiResponse<T> {
	data: T
	pagination?: TenraiPagination
}
