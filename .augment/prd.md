# Product Requirements Document (PRD) for Gamified Language Learning App MVP

## Overview

**Product Name:** WordQuest  
**Purpose:** To provide beginners with an engaging and effective way to learn a new language through gamified elements and proven learning techniques.  
**Target Audience:** Beginners with little to no prior knowledge of the target language, primarily English speakers learning Spanish and German for the MVP.  
**Platform:** Web app (Progressive Web App for mobile compatibility)  
**Technology Stack:** React, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, Supabase

## Key Features

### 1. Language Selection

**Description:** Allow users to select the language they want to learn.

**Requirements:**
- For MVP, support both Spanish and German (English to Spanish and English to German)
- UI displays a simple selection screen with options for Spanish and German, and a "Start Learning" button
- Future versions will support additional languages

### 2. Lessons

**Description:** Structured lessons focused on specific topics to teach vocabulary, grammar, and basic phrases.

**Requirements:**
- Topics include Greetings, Numbers, Food, etc., tailored for each language
- Each lesson includes:
  - Vocabulary words with audio playback for pronunciation (using native speakers)
  - Example sentences using the vocabulary
  - Interactive exercises: multiple-choice quizzes, fill-in-the-blank sentences, matching words to pictures
- Users must complete exercises to unlock the next lesson
- Completing a lesson awards 10 points

### 3. Review

**Description:** Spaced repetition system to reinforce learned material.

**Requirements:**
- Displays words/phrases due for review based on a simple spaced repetition algorithm (e.g., review after 1 day, then 3 days, etc., increasing if correct)
- Review activities: flashcards and quizzes
- Correct answers award 5 points per item
- Implemented using Supabase for data persistence

### 4. Progress Tracking

**Description:** Visual representation of user achievements and engagement.

**Requirements:**
- Displays total points, earned badges, daily streak count, and overall progress
- Badges awarded for milestones (e.g., 5 lessons completed, 7-day streak)
- Streaks increment with daily activity (lesson or review completion)
- UI includes a progress bar with milestone markers (25%, 50%, 75%, 100%)

### 5. Gamification Elements

**Description:** Game-like features to motivate and engage users.

**Requirements:**
- Points System: Earn 10 points for lessons and 5 points per correct review item
- Badges: Unlock badges for achievements, displayed with colorful icons and tooltips
- Daily Streaks: Visual streak counter with a growing flame icon for consecutive days
- Optional Animations: Subtle effects (e.g., button scale on hover, glow on correct answers)

## Technical Requirements

**Frontend:** Built with React and TypeScript for a component-based, interactive UI  
**Design:** Responsive, PWA-enabled for desktop and mobile use, styled with Tailwind CSS v4 and shadcn/ui components  
**Data Storage:** Language content and user progress stored in Supabase database  
**State Management:** TanStack Query for server state management and caching  
**Audio:** Pre-recorded audio files for pronunciation playback, using native speakers for each language  
**Authentication:** Supabase Auth for user management and session handling

## Design Guidelines

**Color Scheme:** Modern dark mode design with clean aesthetics, using shadcn/ui's dark theme palette  
**Typography:** Clean, sans-serif fonts with consistent sizing (shadcn/ui typography system)  
**Icons/Illustrations:** Use Lucide React icons (included with shadcn/ui) for consistency  
**UI:** Intuitive dashboard with Lessons, Review, and Progress sections, using shadcn/ui cards and components  
**Gamified Experience:** Progress bars with milestone markers, badges with tooltips, and subtle animations  
**Accessibility:** Ensure WCAG 2.1 compliance with high contrast ratios and proper semantic markup

## User Flow

**Welcome Screen:** Brief intro with language selection and "Start Learning" button  
**Dashboard:** Options for Lessons, Review, and Progress, with dynamic content based on selected language  
**Lessons:** Select topic → View vocab with audio → Read sentences → Complete exercises → Earn points  
**Review:** Practice due items via flashcards/quizzes → Earn points  
**Progress:** View points, badges, streaks, and overall progress with visual indicators

## Assumptions and Constraints

**Content Scope:** Limited to English-to-Spanish and English-to-German for MVP  
**Storage:** Supabase database for persistent data storage  
**Interactivity:** Text-based exercises; no speech recognition initially  
**Gamification:** Basic features (points, badges, streaks); advanced customization deferred

## Future Considerations

- Additional language pairs
- Speech recognition for pronunciation feedback
- Enhanced gamification (avatars, themes, leaderboards)
- Social features and community aspects
- Offline mode capabilities
- Advanced analytics and learning insights

## Implementation Phases

### Phase 1: Core Foundation
- Set up React + TypeScript + Tailwind v4 + shadcn/ui
- Implement basic routing with React Router
- Set up Supabase integration
- Create basic UI layout and navigation

### Phase 2: Language Learning Features
- Implement lesson system with vocabulary and exercises
- Add audio playback functionality
- Create review system with spaced repetition
- Implement progress tracking

### Phase 3: Gamification & Polish
- Add points, badges, and streak systems
- Implement animations and visual feedback
- Add PWA capabilities
- Performance optimization and testing

### Phase 4: Content & Launch
- Create comprehensive Spanish and German content
- Record native speaker audio
- User testing and feedback integration
- Launch preparation and deployment
