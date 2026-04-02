export type FacultyGroup = "academy-head" | "general-faculty";
export type FacultyGender = "male" | "female";
export type FacultyTeachingMode = "Online" | "Hybrid" | "In-person";
export type FacultyContactPreference = "whatsapp" | "email" | "admin-desk";

export interface FacultyMember {
  id: string;
  name: string | null;
  role: string | null;
  degree: string | null;
  gender: FacultyGender;
  // Will come from admin-managed database later; null uses gender placeholder.
  image: string | null;
  phone: string | null;
  email?: string | null;
  bio?: string | null;
  expertise?: string[] | null;
  experienceYears?: number | null;
  languages?: string[] | null;
  teachingMode?: FacultyTeachingMode | null;
  availability?: string | null;
  contactPreference?: FacultyContactPreference | null;
  link: string;
  group: FacultyGroup;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: "fakeha-ali-khan",
    name: "Ms. Fakeha Ali Khan",
    role: "Head of Science",
    degree: "MS Biotechnology",
    gender: "female",
    image: null,
    phone: "+92 331 0207775",
    email: null,
    bio: null,
    expertise: ["Biology", "Science Mentorship", "Exam Preparation"],
    experienceYears: null,
    languages: ["English", "Urdu"],
    teachingMode: "Online",
    availability: null,
    contactPreference: "admin-desk",
    link: "https://wa.me/923310207775",
    group: "academy-head",
  },
  {
    id: "rabia-farhat",
    name: "Ms. Kanwal Zulfiqar",
    role: "Mathematics Lead",
    degree: "MSc Mathematics",
    gender: "female",
    image: null,
    phone: "+92 323 5893245",
    email: null,
    bio: null,
    expertise: ["Mathematics", "O/A Levels", "Problem Solving"],
    experienceYears: null,
    languages: ["English", "Urdu"],
    teachingMode: "Online",
    availability: null,
    contactPreference: "admin-desk",
    link: "https://wa.me/923235893245",
    group: "academy-head",
  },
  {
    id: "kanwal-zulfiqar",
    name: "Ms. Rabia Farhat",
    role: "Head of English Department",
    degree: "MA Literature",
    gender: "female",
    image: null,
    phone: "Inquire",
    email: null,
    bio: null,
    expertise: ["English Literature", "Writing Skills"],
    experienceYears: null,
    languages: ["English", "Urdu"],
    teachingMode: "Online",
    availability: null,
    contactPreference: "admin-desk",
    link: "https://wa.me/923310207775",
    group: "academy-head",
  },
  {
    id: "hammad-tariq",
    name: "Mr. Hammad Tariq",
    role: "Quran Instructor",
    degree: "Shahadat ul Almiya",
    gender: "male",
    image: null,
    phone: "+92 301 7781144",
    email: "hammad.tariq@scholarlink.edu.pk",
    bio: "Specialized Quran instructor focused on Tajweed fluency, memorization planning, and consistent recitation confidence for school-age learners.",
    expertise: ["Nazra", "Hifz", "Tajweed"],
    experienceYears: 8,
    languages: ["Arabic", "Urdu"],
    teachingMode: "Hybrid",
    availability: "Mon-Thu | 4:00 PM - 9:00 PM PKT",
    contactPreference: "admin-desk",
    link: "https://wa.me/923310207775",
    group: "general-faculty",
  },
  {
    id: "alina-shah",
    name: "Ms. Alina Shah",
    role: "Computer Skills Trainer",
    degree: "BS Computer Science",
    gender: "female",
    image: null,
    phone: "+92 333 9054421",
    email: "alina.shah@scholarlink.edu.pk",
    bio: "Guides beginners in computer fundamentals, productivity tools, and practical digital workflows for academic and professional use.",
    expertise: ["Computer Basics", "Office Skills", "Digital Literacy"],
    experienceYears: 6,
    languages: ["English", "Urdu"],
    teachingMode: "Online",
    availability: "Tue-Sat | 3:00 PM - 8:00 PM PKT",
    contactPreference: "admin-desk",
    link: "https://wa.me/923235893245",
    group: "general-faculty",
  },
  {
    id: "usman-khalid",
    name: "Mr. Usman Khalid",
    role: "Physics Lecturer",
    degree: "MPhil Physics",
    gender: "male",
    image: null,
    phone: "+92 321 4418820",
    email: null,
    bio: "Teaches conceptual physics through exam-focused numericals and simplified topic breakdowns for board and entry-test students.",
    expertise: ["Physics", "Conceptual Problem Solving"],
    experienceYears: 5,
    languages: ["English", "Urdu"],
    teachingMode: "Online",
    availability: null,
    contactPreference: "admin-desk",
    link: "https://wa.me/923310207775",
    group: "general-faculty",
  },
  {
    id: "sana-adeel",
    name: "Ms. Sana Adeel",
    role: "Creative Media Mentor",
    degree: "BS Media Sciences",
    gender: "female",
    image: null,
    phone: "+92 345 2207740",
    email: null,
    bio: "Mentors students in creative media production with practical assignments in editing, visual storytelling, and portfolio work.",
    expertise: ["Video Editing", "Graphic Content", "Creative Workflows"],
    experienceYears: null,
    languages: ["English", "Urdu"],
    teachingMode: "Online",
    availability: "Weekend batches available",
    contactPreference: "admin-desk",
    link: "https://wa.me/923235893245",
    group: "general-faculty",
  },
];

export function getFacultyImage(member: FacultyMember) {
  if (member.image) {
    return member.image;
  }

  return member.gender === "male"
    ? "/placeholders/faculty-male.svg"
    : "/placeholders/faculty-female.svg";
}

export function getFacultyName(member: FacultyMember) {
  return member.name?.trim() || "Faculty Member";
}

export function getFacultyRole(member: FacultyMember) {
  return member.role?.trim() || "Subject Instructor";
}

export function getFacultyDegree(member: FacultyMember) {
  return member.degree?.trim() || "Qualification details will be updated soon.";
}

export function getFacultyBio(member: FacultyMember) {
  return member.bio?.trim() || "Profile summary will be available soon.";
}

export function getFacultyExpertise(member: FacultyMember) {
  return member.expertise?.length ? member.expertise : ["General Mentorship"];
}

export function getFacultyExperience(member: FacultyMember) {
  return member.experienceYears
    ? `${member.experienceYears}+ years`
    : "Experience details on request.";
}

export function getFacultyLanguages(member: FacultyMember) {
  return member.languages?.length
    ? member.languages.join(", ")
    : "Languages will be shared on request.";
}

export function getFacultyAvailability(member: FacultyMember) {
  return member.availability?.trim() || "Please contact admin for availability.";
}

export const ACADEMY_HEADS = FACULTY_MEMBERS.filter(
  (member) => member.group === "academy-head"
);

export const GENERAL_FACULTY = FACULTY_MEMBERS.filter(
  (member) => member.group === "general-faculty"
);
