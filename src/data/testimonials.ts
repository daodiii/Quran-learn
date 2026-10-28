export interface Testimonial {
  name: string;
  text: string;
  role?: string;
  /** The Arabic word shown beside the quote on the home page (decoration, not part of the quote), with its English gloss. */
  word?: { ar: string; en: string };
}

// Add approved testimonials here. When a user submits feedback
// via the form and you want to feature it, add an entry and redeploy.
export const testimonials: Testimonial[] = [
  {
    name: "Ahmed K.",
    text: "This site completely changed how I approach the Quran. I can now understand the grammatical structure behind every ayah I read.",
    role: "University Student",
    word: { ar: "فَهْم", en: "understanding" },
  },
  {
    name: "Fatima R.",
    text: "The word-by-word surah breakdowns are incredible. I finally understand why each word has the ending it does.",
    role: "Self-learner",
    word: { ar: "إِعْرَاب", en: "iʿrāb, the grammar of endings" },
  },
  {
    name: "Omar S.",
    text: "I've tried many Arabic courses, but this is the first one that ties everything back to the Quran. The progression from basics to full verse analysis is perfect.",
    role: "Weekend School Teacher",
    word: { ar: "دَرْس", en: "a lesson" },
  },
];
