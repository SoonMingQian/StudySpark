export interface Flashcard {
  _id?: string;
  front: string;
  back: string;
}

export interface Deck {
  _id: string;
  name: string;
  flashcards: Flashcard[];
}