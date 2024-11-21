export interface Flashcard {
    front: string;
    back: string;
  }

export interface Deck {
  name: string;
  flashcards: Flashcard[];
}