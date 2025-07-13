#!/usr/bin/env node
/* eslint-disable node/no-process-env */
/* eslint-disable no-console */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import type { Database } from "@/types/supabase";

import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { getAudioUrl, vocabulary } from "@/data/vocabulary";

// Load environment variables
config({ path: ".env.local" });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables:");
  console.error("- VITE_SUPABASE_URL");
  console.error("- VITE_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function seedLanguages() {
  console.log("🌍 Seeding languages...");

  for (const language of languages) {
    // Check if language already exists
    const { data: existing } = await supabase
      .from("languages")
      .select("id")
      .eq("code", language.code)
      .single();

    if (existing) {
      console.log(`  ✓ Language ${language.name} (${language.code}) already exists`);
      continue;
    }

    // Insert new language
    const { error } = await supabase
      .from("languages")
      .insert(language);

    if (error) {
      console.error(`  ✗ Failed to insert ${language.name}:`, error.message);
    }
    else {
      console.log(`  ✓ Inserted ${language.name} (${language.code})`);
    }
  }
}

async function seedLessons() {
  console.log("📚 Seeding lessons...");

  // Get language IDs
  const { data: languageData, error: langError } = await supabase
    .from("languages")
    .select("id, code");

  if (langError) {
    console.error("Failed to fetch languages:", langError.message);
    return;
  }

  const languageMap = new Map(languageData.map(lang => [lang.code, lang.id]));

  for (const lesson of lessons) {
    const languageId = languageMap.get(lesson.language_code);
    if (!languageId) {
      console.error(`  ✗ Language ${lesson.language_code} not found for lesson ${lesson.title}`);
      continue;
    }

    // Check if lesson already exists
    const { data: existing } = await supabase
      .from("lessons")
      .select("id")
      .eq("title", lesson.title)
      .eq("language_id", languageId)
      .single();

    if (existing) {
      console.log(`  ✓ Lesson "${lesson.title}" (${lesson.language_code}) already exists`);
      continue;
    }

    // Insert new lesson
    const { error } = await supabase
      .from("lessons")
      .insert({
        title: lesson.title,
        description: lesson.description,
        language_id: languageId,
        order_index: lesson.order_index,
        difficulty_level: lesson.difficulty_level,
        estimated_duration_minutes: lesson.estimated_duration_minutes,
        is_published: lesson.is_published,
      });

    if (error) {
      console.error(`  ✗ Failed to insert lesson "${lesson.title}":`, error.message);
    }
    else {
      console.log(`  ✓ Inserted lesson "${lesson.title}" (${lesson.language_code})`);
    }
  }
}

async function seedVocabulary() {
  console.log("📝 Seeding vocabulary...");

  // Get language and lesson data
  const { data: languageData, error: langError } = await supabase
    .from("languages")
    .select("id, code");

  if (langError) {
    console.error("Failed to fetch languages:", langError.message);
    return;
  }

  const { data: lessonData, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, language_id");

  if (lessonError) {
    console.error("Failed to fetch lessons:", lessonError.message);
    return;
  }

  const languageMap = new Map(languageData.map(lang => [lang.code, lang.id]));

  // Create a map of lesson titles to IDs by language
  const lessonMap = new Map();
  for (const lesson of lessonData) {
    const languageCode = languageData.find(lang => lang.id === lesson.language_id)?.code;
    if (languageCode) {
      const key = `${languageCode}-${lesson.title}`;
      lessonMap.set(key, lesson.id);
    }
  }

  for (const vocab of vocabulary) {
    const languageId = languageMap.get(vocab.language_code);
    if (!languageId) {
      console.error(`  ✗ Language ${vocab.language_code} not found for word ${vocab.english_word}`);
      continue;
    }

    // Find the lesson by matching slug to title pattern
    const lessonTitle = lessons.find(l =>
      l.language_code === vocab.language_code && l.slug === vocab.lesson_slug,
    )?.title;

    if (!lessonTitle) {
      console.error(`  ✗ Lesson with slug ${vocab.lesson_slug} not found for ${vocab.language_code}`);
      continue;
    }

    const lessonKey = `${vocab.language_code}-${lessonTitle}`;
    const lessonId = lessonMap.get(lessonKey);

    if (!lessonId) {
      console.error(`  ✗ Lesson ID not found for ${lessonKey}`);
      continue;
    }

    // Check if vocabulary already exists
    const { data: existing } = await supabase
      .from("vocabulary")
      .select("id")
      .eq("english_word", vocab.english_word)
      .eq("lesson_id", lessonId)
      .single();

    if (existing) {
      console.log(`  ✓ Vocabulary "${vocab.english_word}" already exists`);
      continue;
    }

    // Generate audio URL
    const audioUrl = getAudioUrl(vocab.language_code, vocab.lesson_slug, vocab.translated_word);

    // Insert new vocabulary
    const { error } = await supabase
      .from("vocabulary")
      .insert({
        english_word: vocab.english_word,
        translated_word: vocab.translated_word,
        pronunciation: vocab.pronunciation,
        word_type: vocab.word_type,
        example_sentence_english: vocab.example_sentence_english,
        example_sentence_translated: vocab.example_sentence_translated,
        difficulty_level: vocab.difficulty_level,
        lesson_id: lessonId,
        audio_url: audioUrl,
      });

    if (error) {
      console.error(`  ✗ Failed to insert vocabulary "${vocab.english_word}":`, error.message);
    }
    else {
      console.log(`  ✓ Inserted vocabulary "${vocab.english_word}" -> "${vocab.translated_word}"`);
    }
  }
}

async function main() {
  console.log("🚀 Starting data seeding process...\n");

  try {
    await seedLanguages();
    console.log();

    await seedLessons();
    console.log();

    await seedVocabulary();
    console.log();

    console.log("✅ Data seeding completed successfully!");
  }
  catch (error) {
    console.error("❌ Data seeding failed:", error);
    process.exit(1);
  }
}

// Run the seeding process
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
