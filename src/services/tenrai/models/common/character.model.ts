import type { TenraiImages } from './image.model'
import type { TenraiPerson } from './person.model'

export interface CommonCharacter {
	character: CommonCharacterData & { name: string }
	role: CharacterRole
}

export interface CommonCharacterData {
	mal_id: number
	url: string
	images: TenraiImages
}

export interface CharacterVoiceActor {
	person: TenraiPerson
	language: string
}

export type CharacterRole = 'Main' | 'Supporting'
