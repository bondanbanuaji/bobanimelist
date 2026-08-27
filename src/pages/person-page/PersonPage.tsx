import { useParams } from "react-router";
import { useGetPersonByIdQuery } from "../../services/tenrai";
import { MediaContent } from "../../components/widgets/media-content";
import { PersonAnimeWorks, PersonMangaWorks, PersonVoiceRoles } from "../../components/widgets/person-works";
import { formatThresholdNumber } from "../../shared/util";
import { getLargeImageUrl } from "../../shared/util/image-utils";

function PersonPage() {
    const { id } = useParams();

    return (
        <div>
            <MediaContent
                useQueryHook={useGetPersonByIdQuery}
                contentType="person"
                options={{ id: Number(id) }}
                adapter={(data) => {
                    const infoGroupData = [];
                    
                    if (data.data.birthday) {
                        const birthday = new Date(data.data.birthday);
                        const formattedBirthday = birthday.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        infoGroupData.push({ title: 'Birthday', text: formattedBirthday });
                    }
                    
                    if (data.data.alternate_names && data.data.alternate_names.length > 0) {
                        infoGroupData.push({ 
                            title: 'Alternative Names', 
                            text: data.data.alternate_names.join(', ') 
                        });
                    }

                    return {
                        imageAlt: data.data.mal_id.toString(),
                        imageSrc: getLargeImageUrl(data.data.images),
                        title: data.data.name,
                        mediaStats: {
                            favorite: data.data.favorites ? `${formatThresholdNumber(data.data.favorites)} Favorites` : undefined,
                        },
                        summary: data.data.about ?? 'No biography available.',
                        infoGroup: infoGroupData.length > 0 ? {
                            title: 'Personal Information',
                            group: infoGroupData
                        } : undefined,
                    };
                }}
            />
            
            {/* Person Anime Works - Full List */}
            {id && <PersonAnimeWorks personId={Number(id)} />}
            
            {/* Person Manga Works - Full List */}
            {id && <PersonMangaWorks personId={Number(id)} />}
            
            {/* Person Voice Acting Roles - Full List */}
            {id && <PersonVoiceRoles personId={Number(id)} />}
        </div>
    );

}

export default PersonPage;