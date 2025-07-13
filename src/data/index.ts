// Export all data structures for easy importing
export { type LanguageData, languages } from "./languages";
export { type LessonData, lessons } from "./lessons";
export { getAudioUrl, vocabulary, type VocabularyData } from "./vocabulary";

// Data summary for reference
export const dataSummary = {
  languages: 2, // Spanish, German
  lessonsPerLanguage: 8,
  totalLessons: 16,
  vocabularyWords: {
    spanish: {
      greetings: 15,
      numbers: 10,
      food: 5,
      colors: 5,
    },
    german: {
      greetings: 12,
      numbers: 5,
      food: 4,
      colors: 5,
    },
  },
  totalVocabulary: 61,
};

// Audio URL structure documentation
export const audioStructure = {
  baseUrl: "/audio",
  pattern: "/{language_code}/{lesson_slug}/{normalized_word}.mp3",
  examples: [
    "/audio/es/greetings/hola.mp3",
    "/audio/de/numbers/eins.mp3",
    "/audio/es/food/agua.mp3",
  ],
  notes: [
    "Words are normalized (lowercase, no special characters)",
    "Audio files should be recorded by native speakers",
    "MP3 format recommended for web compatibility",
  ],
};
