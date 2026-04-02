export type CourseCategory = string;

export type CourseIconKey =
  | "book"
  | "brain"
  | "graduation"
  | "code"
  | "laptop"
  | "bot"
  | "chart"
  | "video"
  | "image"
  | "calculator"
  | "flask"
  | "atom"
  | "dna"
  | "languages"
  | "landmark";

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: CourseCategory;
  subcategory: string;
  icon: CourseIconKey;
  link: string;
  duration?: string;
  prerequisites?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

export interface CourseCategoryMeta {
  id: string;
  title: string;
  description: string;
  badgeClassName: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

const PRIMARY_WA =
  "https://wa.me/923310207775?text=Hello%20Scholarlink,%20I%20am%20interested%20in%20this%20course.";
const SECONDARY_WA =
  "https://wa.me/923235893245?text=Hello%20Scholarlink,%20I%20am%20interested%20in%20this%20course.";

export const COURSE_CATEGORIES: CourseCategoryMeta[] = [
  {
    id: "academic",
    title: "Academic Tutoring",
    description:
      "Maths, Triple Science, and Humanities support across all levels.",
    badgeClassName:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  {
    id: "language",
    title: "Language Courses",
    description:
      "English, Arabic, Urdu, IELTS, and writing-focused language development.",
    badgeClassName:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  {
    id: "quran",
    title: "Quran Courses",
    description: "Nazra, Hifz, Tarjama, and Tafseer for children and adults.",
    badgeClassName:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  {
    id: "computer",
    title: "Computer Courses",
    description:
      "Job-ready digital skills from Office Automation to ML foundations.",
    badgeClassName:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  {
    id: "media",
    title: "Video & Photo Editing",
    description: "Creative production tracks for social, freelance, and business use.",
    badgeClassName:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
];

export const COURSES: Course[] = [
  {
    id: "quran-nazra",
    title: "Nazra Quran",
    description:
      "Letter recognition, fluent recitation, and confidence building with guided practice.",
    level: "All Levels",
    category: "quran",
    subcategory: "Recitation",
    icon: "book",
    duration: "Flexible batches",
    link: PRIMARY_WA,
  },
  {
    id: "quran-hifz",
    title: "Hifz Program",
    description:
      "Structured memorization plans with daily revision cycles and progress tracking.",
    level: "All Levels",
    category: "quran",
    subcategory: "Memorization",
    icon: "brain",
    duration: "Long-term track",
    link: PRIMARY_WA,
  },
  {
    id: "quran-tarjama",
    title: "Tarjama ul Quran",
    description:
      "Word-by-word and thematic translation sessions for practical understanding.",
    level: "All Levels",
    category: "quran",
    subcategory: "Translation",
    icon: "graduation",
    duration: "12-week module",
    link: SECONDARY_WA,
  },
  {
    id: "quran-tafseer",
    title: "Tafseer Studies",
    description:
      "Contextual interpretation with authentic references and guided discussion.",
    level: "Intermediate to Advanced",
    category: "quran",
    subcategory: "Interpretation",
    icon: "book",
    prerequisites: "Basic Quran reading",
    duration: "16-week module",
    link: SECONDARY_WA,
  },
  {
    id: "computer-office-automation",
    title: "MS Office And Office Automation",
    description:
      "Hands-on Microsoft Office and productivity workflows for study and work.",
    level: "Beginner to Intermediate",
    category: "computer",
    subcategory: "Productivity",
    icon: "laptop",
    duration: "8-10 weeks",
    link: PRIMARY_WA,
  },
  {
    id: "computer-intro-programming",
    title: "IT Essentials",
    description:
      "Build practical digital confidence with foundational computer operations and essential IT skills.",
    level: "Beginner",
    category: "computer",
    subcategory: "IT Fundamentals",
    icon: "code",
    duration: "10-12 weeks",
    link: PRIMARY_WA,
  },
  {
    id: "computer-programming-languages",
    title: "Programming Languages (Python And Java)",
    description:
      "Learn coding fundamentals and build practical projects in beginner-friendly Python and Java pathways.",
    level: "Beginner to Intermediate",
    category: "computer",
    subcategory: "Programming",
    icon: "code",
    duration: "10-14 weeks",
    link: PRIMARY_WA,
  },
  {
    id: "computer-ai-basic",
    title: "AI Basics",
    description:
      "Understand AI concepts, practical tools, and responsible AI fundamentals.",
    level: "Beginner to Intermediate",
    category: "computer",
    subcategory: "Artificial Intelligence",
    icon: "bot",
    duration: "6-8 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "computer-ml-foundation",
    title: "Machine Learning Foundation",
    description:
      "Learn supervised and unsupervised models with guided mini-projects.",
    level: "Intermediate",
    category: "computer",
    subcategory: "Machine Learning",
    icon: "chart",
    prerequisites: "Basic programming",
    duration: "12 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "computer-robotics-foundation",
    title: "Robotics Foundation",
    description:
      "Understand robotics basics, sensors, and control logic through guided project-based learning.",
    level: "Beginner to Intermediate",
    category: "computer",
    subcategory: "Applied Automation",
    icon: "bot",
    duration: "8-12 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "computer-freelancing-skills",
    title: "Freelancing Skills Bootcamp",
    description:
      "Learn profile setup, client communication, gig strategy, and delivery workflows for online freelancing.",
    level: "Beginner",
    category: "computer",
    subcategory: "Career Skills",
    icon: "chart",
    duration: "6-8 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "media-video-editing",
    title: "Video Editing And Animation",
    description:
      "Edit professional reels and animated visual content using modern storytelling workflows.",
    level: "Beginner to Advanced",
    category: "media",
    subcategory: "Video Production",
    icon: "video",
    duration: "8-12 weeks",
    link: PRIMARY_WA,
  },
  {
    id: "media-photo-editing",
    title: "Graphic Designing (Canva And Adobe)",
    description:
      "Create social and branding designs using Canva and Adobe-based workflows.",
    level: "Beginner to Advanced",
    category: "media",
    subcategory: "Design",
    icon: "image",
    duration: "8-10 weeks",
    link: PRIMARY_WA,
  },
  {
    id: "media-digital-marketing",
    title: "Digital Marketing",
    description:
      "Learn social media strategy, campaign planning, and practical growth tactics for digital platforms.",
    level: "Beginner to Intermediate",
    category: "media",
    subcategory: "Marketing",
    icon: "chart",
    duration: "8-10 weeks",
    link: PRIMARY_WA,
  },
  {
    id: "academic-maths",
    title: "Mathematics Tutoring",
    description:
      "Concept clarity and exam mastery for Algebra, Geometry, and advanced problem solving.",
    level: "All Levels",
    category: "academic",
    subcategory: "Maths",
    icon: "calculator",
    duration: "Ongoing support",
    link: PRIMARY_WA,
  },
  {
    id: "academic-triple-science",
    title: "Triple Science Track",
    description:
      "Integrated Biology, Chemistry, and Physics preparation for school and board exams.",
    level: "All Levels",
    category: "academic",
    subcategory: "Science",
    icon: "flask",
    duration: "Ongoing support",
    link: PRIMARY_WA,
  },
  {
    id: "academic-biology",
    title: "Biology",
    description:
      "Theory, diagrams, and exam strategies with topic-wise reinforcement.",
    level: "All Levels",
    category: "academic",
    subcategory: "Science",
    icon: "dna",
    duration: "Ongoing support",
    link: PRIMARY_WA,
  },
  {
    id: "academic-chemistry",
    title: "Chemistry",
    description:
      "Numericals, reactions, and conceptual strengthening for confident performance.",
    level: "All Levels",
    category: "academic",
    subcategory: "Science",
    icon: "atom",
    duration: "Ongoing support",
    link: PRIMARY_WA,
  },
  {
    id: "academic-physics",
    title: "Physics",
    description:
      "Core principles, derivations, and practical problem-solving practice.",
    level: "All Levels",
    category: "academic",
    subcategory: "Science",
    icon: "flask",
    duration: "Ongoing support",
    link: PRIMARY_WA,
  },
  {
    id: "academic-english",
    title: "English",
    description:
      "Language fluency, writing skills, and literature preparation across curriculums.",
    level: "All Levels",
    category: "language",
    subcategory: "Language",
    icon: "languages",
    duration: "Ongoing support",
    link: SECONDARY_WA,
  },
  {
    id: "academic-ielts",
    title: "IELTS Preparation",
    description:
      "Band-focused preparation for reading, writing, listening, and speaking with mock testing.",
    level: "Intermediate to Advanced",
    category: "language",
    subcategory: "Language",
    icon: "languages",
    duration: "8-10 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "academic-spoken-english",
    title: "Spoken English",
    description:
      "Fluency and confidence development through guided conversation and real-life scenarios.",
    level: "Beginner to Advanced",
    category: "language",
    subcategory: "Language",
    icon: "languages",
    duration: "6-8 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "language-arabic",
    title: "Arabic Language",
    description:
      "Build foundational to intermediate Arabic reading, vocabulary, and conversation skills.",
    level: "Beginner to Intermediate",
    category: "language",
    subcategory: "Language",
    icon: "languages",
    duration: "10-12 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "language-urdu",
    title: "Urdu Language",
    description:
      "Improve Urdu reading, writing, and spoken communication for academic and daily use.",
    level: "All Levels",
    category: "language",
    subcategory: "Language",
    icon: "languages",
    duration: "8-10 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "language-creative-writing",
    title: "Creative Writing Short Course",
    description:
      "Develop storytelling, structure, and expression through practical guided writing exercises.",
    level: "Beginner to Intermediate",
    category: "language",
    subcategory: "Writing",
    icon: "book",
    duration: "4-6 weeks",
    link: SECONDARY_WA,
  },
  {
    id: "academic-humanities",
    title: "Humanities",
    description:
      "History, social sciences, and analytical writing for strong academic outcomes.",
    level: "All Levels",
    category: "academic",
    subcategory: "Humanities",
    icon: "landmark",
    duration: "Ongoing support",
    link: SECONDARY_WA,
  },
];

export function getCoursesByCategory(category: CourseCategory): Course[] {
  return COURSES.filter((course) => course.category === category);
}
