# Word Quest - Data Structure

This directory contains the seed data for the Word Quest language learning application.

## Overview

The data population phase has been completed with the following structure:

### Languages (2)

- **Spanish (es)** 🇪🇸 - Español
- **German (de)** 🇩🇪 - Deutsch

### Lessons (16 total, 8 per language)

Each language includes the following lesson topics:

1. **Greetings & Introductions** - Basic greetings and self-introduction
2. **Numbers 1-20** - Essential numbers for counting and basic math
3. **Food & Drinks** - Vocabulary for ordering and discussing food
4. **Family & Relationships** - Terms for family members and relationships
5. **Colors** - Basic color vocabulary for descriptions
6. **Days & Time** - Days of the week and time expressions
7. **Basic Verbs** - Essential action words for communication
8. **Common Adjectives** - Descriptive words for everyday use

### Vocabulary (61 total words)

The vocabulary is distributed across lessons with the following word types:

- **noun** - Objects, people, places
- **verb** - Actions and states
- **adjective** - Descriptive words
- **adverb** - Modifying words
- **interjection** - Exclamations and greetings

Each vocabulary entry includes:

- English word
- Translated word
- Pronunciation guide
- Word type
- Example sentences in both languages
- Audio URL reference
- Difficulty level (1-3)

## Audio File Structure

Audio files are organized using the following pattern:

```
/audio/{language_code}/{lesson_slug}/{normalized_word}.mp3
```

Examples:

- `/audio/es/greetings/hola.mp3`
- `/audio/de/numbers/eins.mp3`
- `/audio/es/food/agua.mp3`

## Scripts

### Seeding Data

```bash
pnpm run seed
```

Populates the database with languages, lessons, and vocabulary. Safe to run multiple times (idempotent).

### Verifying Data

```bash
pnpm run verify-data
```

Displays a summary of all populated data for verification.

## Data Files

- `languages.ts` - Language definitions with codes and metadata
- `lessons.ts` - Lesson structure and metadata for both languages
- `vocabulary.ts` - Complete vocabulary sets with translations and examples
- `index.ts` - Exports and data summary

## Next Steps

1. **Audio Files** - Record and upload native speaker audio files
2. **Exercises** - Create interactive exercises for each lesson
3. **Content Expansion** - Add more vocabulary and advanced lessons
4. **Localization** - Add support for additional languages

## Database Schema

The data populates the following Supabase tables:

- `languages` - Language metadata
- `lessons` - Lesson information and ordering
- `vocabulary` - Word translations and examples
- `user_progress` - User lesson completion (populated during usage)
- `user_vocabulary` - User word mastery tracking (populated during usage)

## Content Guidelines

When adding new content:

1. Use consistent pronunciation guides
2. Include practical example sentences
3. Maintain appropriate difficulty progression
4. Follow the established audio URL pattern
5. Use only valid word types: noun, verb, adjective, adverb, interjection
