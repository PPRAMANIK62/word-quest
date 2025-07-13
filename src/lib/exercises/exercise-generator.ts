import type { GameQuestion, QuestionType, Vocabulary } from "@/types";

/**
 * Generates exercise questions from vocabulary data
 */
export class ExerciseGenerator {
  /**
   * Generate multiple choice questions from vocabulary
   */
  static generateMultipleChoice(
    vocabulary: Vocabulary[],
    count: number = 5,
  ): GameQuestion[] {
    if (vocabulary.length < 4) {
      throw new Error("Need at least 4 vocabulary words to generate multiple choice questions");
    }

    const questions: GameQuestion[] = [];
    const shuffledVocab = [...vocabulary].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, vocabulary.length); i++) {
      const targetWord = shuffledVocab[i];
      const otherWords = vocabulary.filter(v => v.id !== targetWord.id);
      const wrongOptions = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.translated_word);

      const options = [targetWord.translated_word, ...wrongOptions]
        .sort(() => Math.random() - 0.5);

      questions.push({
        id: `mc_${targetWord.id}_${Date.now()}_${i}`,
        type: "multiple_choice" as QuestionType,
        vocabulary: targetWord,
        question: `What is the translation of "${targetWord.english_word}"?`,
        correctAnswer: targetWord.translated_word,
        options,
        hint: targetWord.example_sentence_english
          ? `Hint: "${targetWord.example_sentence_english}"`
          : undefined,
        explanation: targetWord.example_sentence_translated
          ? `Example: "${targetWord.example_sentence_translated}"`
          : undefined,
      });
    }

    return questions;
  }

  /**
   * Generate fill-in-the-blank questions from vocabulary
   */
  static generateFillInTheBlank(
    vocabulary: Vocabulary[],
    count: number = 5,
  ): GameQuestion[] {
    const questions: GameQuestion[] = [];
    const vocabWithExamples = vocabulary.filter(
      v => v.example_sentence_english && v.example_sentence_translated,
    );

    if (vocabWithExamples.length === 0) {
      throw new Error("No vocabulary with example sentences found for fill-in-the-blank");
    }

    const shuffledVocab = [...vocabWithExamples].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, vocabWithExamples.length); i++) {
      const targetWord = shuffledVocab[i];

      if (!targetWord.example_sentence_english)
        continue;

      // Create a sentence with the English word replaced by a blank
      const sentence = targetWord.example_sentence_english;
      const wordToReplace = targetWord.english_word;
      const questionSentence = sentence.replace(
        new RegExp(`\\b${wordToReplace}\\b`, "gi"),
        "______",
      );

      questions.push({
        id: `fib_${targetWord.id}_${Date.now()}_${i}`,
        type: "fill_in_blank" as QuestionType,
        vocabulary: targetWord,
        question: `Fill in the blank: "${questionSentence}"`,
        correctAnswer: targetWord.english_word,
        hint: `Translation: "${targetWord.translated_word}"`,
        explanation: targetWord.example_sentence_translated
          ? `Full sentence: "${targetWord.example_sentence_translated}"`
          : undefined,
      });
    }

    return questions;
  }

  /**
   * Generate translation questions (English to target language) with multiple choice options
   */
  static generateTranslation(
    vocabulary: Vocabulary[],
    count: number = 5,
    direction: "to_english" | "from_english" = "from_english",
  ): GameQuestion[] {
    if (vocabulary.length < 4) {
      throw new Error("Need at least 4 vocabulary words to generate translation questions");
    }

    const questions: GameQuestion[] = [];
    const shuffledVocab = [...vocabulary].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, vocabulary.length); i++) {
      const targetWord = shuffledVocab[i];

      const isToEnglish = direction === "to_english";
      const questionWord = isToEnglish ? targetWord.translated_word : targetWord.english_word;
      const correctAnswer = isToEnglish ? targetWord.english_word : targetWord.translated_word;

      // Generate wrong options for multiple choice
      const otherWords = vocabulary.filter(v => v.id !== targetWord.id);
      const wrongOptions = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => isToEnglish ? v.english_word : v.translated_word);

      const options = [correctAnswer, ...wrongOptions]
        .sort(() => Math.random() - 0.5);

      questions.push({
        id: `trans_${targetWord.id}_${Date.now()}_${i}`,
        type: direction === "to_english" ? "translate_to_english" : "translate_from_english",
        vocabulary: targetWord,
        question: `Translate: "${questionWord}"`,
        correctAnswer,
        options,
        hint: targetWord.example_sentence_english
          ? `Example: "${targetWord.example_sentence_english}"`
          : undefined,
        explanation: targetWord.example_sentence_translated
          ? `In context: "${targetWord.example_sentence_translated}"`
          : undefined,
      });
    }

    return questions;
  }

  /**
   * Generate a mixed set of exercises
   */
  static generateMixedExercises(
    vocabulary: Vocabulary[],
    totalCount: number = 10,
  ): GameQuestion[] {
    if (vocabulary.length < 4) {
      throw new Error("Need at least 4 vocabulary words to generate exercises");
    }

    const questions: GameQuestion[] = [];
    const exerciseTypes = ["multiple_choice", "fill_in_blank", "translation"];
    const questionsPerType = Math.ceil(totalCount / exerciseTypes.length);

    // Generate multiple choice questions
    try {
      const mcQuestions = this.generateMultipleChoice(vocabulary, questionsPerType);
      questions.push(...mcQuestions);
    }
    catch (error) {
      console.warn("Could not generate multiple choice questions:", error);
    }

    // Generate fill-in-the-blank questions
    try {
      const fibQuestions = this.generateFillInTheBlank(vocabulary, questionsPerType);
      questions.push(...fibQuestions);
    }
    catch (error) {
      console.warn("Could not generate fill-in-the-blank questions:", error);
    }

    // Generate translation questions
    try {
      const transQuestions = this.generateTranslation(vocabulary, questionsPerType);
      questions.push(...transQuestions);
    }
    catch (error) {
      console.warn("Could not generate translation questions:", error);
    }

    // Shuffle and limit to requested count
    return questions
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCount);
  }

  /**
   * Validate if an answer is correct (with some flexibility for typing)
   */
  static validateAnswer(userAnswer: string, correctAnswer: string): boolean {
    const normalize = (str: string) =>
      str.toLowerCase().trim().replace(/[^\w\s]/g, "");

    return normalize(userAnswer) === normalize(correctAnswer);
  }

  /**
   * Calculate similarity score between user answer and correct answer
   */
  static calculateSimilarity(userAnswer: string, correctAnswer: string): number {
    const normalize = (str: string) => str.toLowerCase().trim();
    const user = normalize(userAnswer);
    const correct = normalize(correctAnswer);

    if (user === correct)
      return 1.0;

    // Simple Levenshtein distance-based similarity
    const maxLength = Math.max(user.length, correct.length);
    if (maxLength === 0)
      return 1.0;

    const distance = this.levenshteinDistance(user, correct);
    return Math.max(0, (maxLength - distance) / maxLength);
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = Array.from({ length: str2.length + 1 }, () => Array.from({ length: str1.length + 1 }, () => 0));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}
