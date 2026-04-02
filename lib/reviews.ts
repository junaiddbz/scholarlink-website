export type ReviewSource = "manual" | "google";
export type ReviewMediaType = "none" | "photo" | "video";

export interface ReviewItem {
  id: string;
  authorName: string;
  authorRole: string;
  program: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
  source: ReviewSource;
  mediaType: ReviewMediaType;
  mediaUrl?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

export const REVIEWS: ReviewItem[] = [
  {
    id: "review-parent-1",
    authorName: "Ayesha R.",
    authorRole: "Parent",
    program: "Academic Tutoring",
    content:
      "My daughter improved her mathematics grades significantly in one term. The teachers are structured and very supportive.",
    rating: 5,
    source: "manual",
    mediaType: "none",
    mediaUrl: null,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "review-student-1",
    authorName: "Hamza K.",
    authorRole: "Student",
    program: "IELTS Preparation",
    content:
      "The speaking and writing feedback was practical and clear. I achieved my target band with confidence.",
    rating: 5,
    source: "manual",
    mediaType: "none",
    mediaUrl: null,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "review-parent-2",
    authorName: "Sara M.",
    authorRole: "Parent",
    program: "Quran Courses",
    content:
      "Excellent Tajweed coaching and respectful communication. We are very satisfied with the progress.",
    rating: 5,
    source: "manual",
    mediaType: "none",
    mediaUrl: null,
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "review-student-media-1",
    authorName: "Ali H.",
    authorRole: "Student",
    program: "SAT Preparation",
    content:
      "Weekly strategy sessions and timed mock analysis helped me raise my score. The instructors kept every step practical.",
    rating: 5,
    source: "manual",
    mediaType: "photo",
    mediaUrl: "https://placehold.co/1200x800/png?text=Student+Review+Media",
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "review-video-student-1",
    authorName: "Mahnoor T.",
    authorRole: "Student",
    program: "Spoken English",
    content:
      "The class routines improved my fluency and confidence in presentations. Weekly speaking checks kept me consistent.",
    rating: 5,
    source: "manual",
    mediaType: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "review-video-parent-1",
    authorName: "Usman F.",
    authorRole: "Parent",
    program: "Computer Basics",
    content:
      "My son now practices independently and submits assignments on time. The mentor communication with parents has been excellent.",
    rating: 5,
    source: "manual",
    mediaType: "video",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "review-youtube-student-1",
    authorName: "Nimra A.",
    authorRole: "Student",
    program: "IELTS Preparation",
    content:
      "My mock speaking recordings improved every week and the strategy sessions made my test day much easier.",
    rating: 5,
    source: "manual",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "review-youtube-parent-1",
    authorName: "Farah N.",
    authorRole: "Parent",
    program: "Academic Tutoring",
    content:
      "The weekly progress briefings helped us track exactly where improvement was happening in maths and science.",
    rating: 5,
    source: "manual",
    mediaType: "video",
    mediaUrl: "https://youtu.be/aqz-KE-bpKQ",
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "review-youtube-student-2",
    authorName: "Bilal S.",
    authorRole: "Student",
    program: "Spoken English",
    content:
      "My confidence in live conversations improved a lot, and role-play practice made interviews feel natural.",
    rating: 5,
    source: "manual",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    isPublished: true,
    isFeatured: false,
  },
];
