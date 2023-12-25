/**
 * Usually you'd have multiple files here, optionally re-exporting them from an index.ts file.
 * For this example, we'll just have one file, since we don't have many types.
 * These would be global types, used throughout the app. If you have types that are only used
 * in one component, you can define them in that component's folder.
 */

/** 
 * A character from the Rick and Morty API
 */
export interface RickAndMortyCharacter {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: {
      name: string;
      url: string;
    };
    location: {
      name: string;
      url: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
  }
