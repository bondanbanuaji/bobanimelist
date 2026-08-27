import { tenraiApi } from './baseApi';
import type { TenraiResponse, Anime } from './models';
import type { SchedulesParams } from './models/params/schedules-params.model';

const ScheduleEndpoints = {
	schedules: '/schedules',
} as const;

export const scheduleApi = tenraiApi.injectEndpoints({
	endpoints: (builder) => ({
		getSchedules: builder.query<TenraiResponse<Anime[]>, SchedulesParams | void>({
			query: (params) => {
				if (!params) {
					return {
						url: ScheduleEndpoints.schedules,
						params: { page: 1, limit: 25, sfw: true },
					};
				}
				
				const { filter, page = 1, limit = 25, sfw = true, kids, unapproved } = params;
				
				return {
					url: ScheduleEndpoints.schedules,
					params: {
						...(filter && { filter }),
						page,
						limit,
						sfw,
						...(kids !== undefined && { kids }),
						...(unapproved !== undefined && { unapproved }),
					},
				};
			},
			// Cache for 5 minutes (schedules change daily)
			keepUnusedDataFor: 60 * 5,
		}),
	}),
});

export const { useGetSchedulesQuery } = scheduleApi;
