import { useParams } from "react-router";
import { useGetCharacterByIdQuery } from "../../services/jikan";
import { MediaContent } from "../../components/widgets/media-content";
import { formatThresholdNumber } from "../../shared/util";
import { getLargeImageUrl } from "../../shared/util/image-utils";

function CharacterPage() {
    const { id } = useParams();

    return (
        <div>
            <MediaContent
                useQueryHook={useGetCharacterByIdQuery}
                contentType="character"
                options={{ id: Number(id) }}
                adapter={(data) => {
                    return (
                        {
                            imageAlt: data.data.mal_id.toString(),
                            imageSrc: getLargeImageUrl(data.data.images),
                            title: data.data.name,
                            titleEnglish: data.data.nicknames?.[0],
                            mediaStats: {
                                favorite: data.data.favorites ? `${formatThresholdNumber(data.data.favorites)} Favorites` : undefined,

                            },
                            summary: data.data.about ?? 'NA',
                            infoGroup: {
                                title: 'Info',
                                group: [{ title: 'Kanji', text: data.data.name_kanji }]
                            },
                            primaryContentGroup: data.data.anime ? {
                                title: 'Anime',
                                group: data.data.anime.map((entry) => { return { title: entry.anime.title, desc: entry.role, link: `/anime/${entry.anime.mal_id}?`, imgSrc: getLargeImageUrl(entry.anime.images) }; })
                            } : undefined,
                            secondaryContentGroup: data.data.manga ? {
                                title: 'Manga',
                                group: data.data.manga.map((entry) => { return { title: entry.manga.title, desc: entry.role, link: `/manga/${entry.manga.mal_id}?`, imgSrc: getLargeImageUrl(entry.manga.images) }; })
                            } : undefined,
                            tertiaryContentGroup: data.data.voices ? {
                                title: 'People',
                                group: data.data.voices.map((entry) => { return { title: entry.person.name, desc: entry.language, link: `/people/${entry.person.mal_id}?`, imgSrc: getLargeImageUrl(entry.person.images) }; })
                            } : undefined,
                        }
                    );
                }}
            />
        </div>
    );

}

export default CharacterPage;