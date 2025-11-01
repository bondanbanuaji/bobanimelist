import { useGetTopMangaQuery } from "../../services/jikan";
import LazyMount from "../../components/atoms/lazy-mount";
import { HorizontalCarousel } from "../../components/widgets/horizontal-carousel";
import { useTranslation } from 'react-i18next';
import { formatThresholdNumber } from "../../shared/util";
import { getBestImageUrl } from "../../shared/util/image-utils";

function MangaLandingPage() {
    const { t } = useTranslation();

    return (
        <div>
            <HorizontalCarousel
                heading={t('MLP_TRENDING_MANGA_TITLE')}
                type="centered"
                cardType="media-detail"
                useQueryHook={useGetTopMangaQuery}
                options={{ type: 'Manga' }}
                adapter={(data) => data.data.map((manga) => ({
                    key: manga.mal_id.toString(),
                    title: manga.titles.find((title) => title.type === 'Default')?.title ?? manga.title,
                    imageUrl: getBestImageUrl(manga.images),
                    navigateTo: `/manga/${manga.mal_id}?`,
                    alt: manga.title,
                    ratings: manga.score?.toString(),
                    favorites: formatThresholdNumber(manga.favorites),
                    summary: manga.synopsis,
                    status: manga.status,
                    genres: manga.genres.map((genre) => genre.name).slice(0, 5)
                }))}
            />
            <HorizontalCarousel
                heading={t('MLP_TRENDING_MANHWA_TITLE')}
                useQueryHook={useGetTopMangaQuery}
                options={{ type: 'Manhwa' }}
                adapter={(data) => data.data.map((manga) => ({
                    key: manga.mal_id.toString(),
                    title: manga.titles.find((title) => title.type === 'Default')?.title ?? manga.title,
                    imageUrl: getBestImageUrl(manga.images),
                    navigateTo: `/manga/${manga.mal_id}?`,
                    alt: manga.title,
                    ratings: manga.score?.toString(),
                    favorites: formatThresholdNumber(manga.favorites)
                }))}
            />
            <LazyMount estimatedHeight={359}>
                <HorizontalCarousel
                    heading={t('MLP_TRENDING_MANHUA_TITLE')}
                    useQueryHook={useGetTopMangaQuery}
                    options={{ type: 'Manhua' }}
                    adapter={(data) => data.data.map((manga) => ({
                        key: manga.mal_id.toString(),
                        title: manga.titles.find((title) => title.type === 'Default')?.title ?? manga.title,
                        imageUrl: getBestImageUrl(manga.images),
                        navigateTo: `/manga/${manga.mal_id}?`,
                        alt: manga.title,
                        ratings: manga.score?.toString(),
                        favorites: formatThresholdNumber(manga.favorites)
                    }))}
                />
            </LazyMount>
        </div>
    );
}

export default MangaLandingPage;