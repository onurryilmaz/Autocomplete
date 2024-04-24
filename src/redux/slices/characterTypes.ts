export interface Character {
   status: any;
   loading: boolean;
   error: string;
   characterSearch: CharacterSearch;
}

export interface CharacterSearch {
   info?: Info;
   results?: Result[];
}

export interface Info {
   count: number;
   pages: number;
   next: any;
   prev: any;
}

export interface Result {
   id: number;
   name: string;
   status: string;
   species: string;
   type: string;
   gender: string;
   origin: Origin;
   location: Location;
   image: string;
   episode: string[];
   url: string;
   created: string;
}

export interface Origin {
   name: string;
   url: string;
}

export interface Location {
   name: string;
   url: string;
}
