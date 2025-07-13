#!/usr/bin/env node
/* eslint-disable node/no-process-env */
/* eslint-disable no-console */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import type { Database } from "@/types/supabase";

// Load environment variables
config({ path: ".env.local" });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function verifyData() {
  console.log("🔍 Verifying populated data...\n");

  // Check languages
  const { data: languages, error: langError } = await supabase
    .from("languages")
    .select("*")
    .order("name");

  if (langError) {
    console.error("Error fetching languages:", langError.message);
    return;
  }

  console.log("🌍 Languages:");
  languages.forEach((lang) => {
    console.log(`  ✓ ${lang.name} (${lang.code}) ${lang.flag_emoji}`);
  });
  console.log();

  // Check lessons by language
  for (const language of languages) {
    const { data: lessons, error: lessonError } = await supabase
      .from("lessons")
      .select("*")
      .eq("language_id", language.id)
      .order("order_index");

    if (lessonError) {
      console.error(`Error fetching lessons for ${language.name}:`, lessonError.message);
      continue;
    }

    console.log(`📚 ${language.name} Lessons (${lessons.length}):`);
    lessons.forEach((lesson) => {
      console.log(`  ${lesson.order_index}. ${lesson.title} (${lesson.estimated_duration_minutes}min, Level ${lesson.difficulty_level})`);
    });
    console.log();

    // Check vocabulary for each lesson
    for (const lesson of lessons.slice(0, 3)) { // Show first 3 lessons to avoid too much output
      const { data: vocabulary, error: vocabError } = await supabase
        .from("vocabulary")
        .select("english_word, translated_word, word_type")
        .eq("lesson_id", lesson.id)
        .order("english_word")
        .limit(5);

      if (vocabError) {
        console.error(`Error fetching vocabulary for ${lesson.title}:`, vocabError.message);
        continue;
      }

      console.log(`  📝 ${lesson.title} - Sample Vocabulary (${vocabulary.length} shown):`);
      vocabulary.forEach((word) => {
        console.log(`    • ${word.english_word} → ${word.translated_word} (${word.word_type})`);
      });
      console.log();
    }
  }

  // Summary statistics
  const { count: totalLessons } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true });

  const { count: totalVocabulary } = await supabase
    .from("vocabulary")
    .select("*", { count: "exact", head: true });

  console.log("📊 Summary:");
  console.log(`  • Languages: ${languages.length}`);
  console.log(`  • Total Lessons: ${totalLessons}`);
  console.log(`  • Total Vocabulary: ${totalVocabulary}`);
  console.log();

  console.log("✅ Data verification completed!");
}

// Run the verification
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyData().catch(console.error);
}
