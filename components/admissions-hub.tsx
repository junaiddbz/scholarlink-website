"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useCatalogData } from "@/hooks/use-catalog-data";

type ApplicationFormState = {
  studentName: string;
  dob: string;
  currentGrade: string;
  schoolCurriculum: string;
  targetSubjects: string[];
  goals: string;
  supportNeeds: string;
  guardianName: string;
  relation: string;
  guardianPhone: string;
  guardianEmail: string;
  preferredContactMethod: "whatsapp" | "email";
  country: string;
  timezone: string;
  preferredSchedule: string;
  deviceReadiness: string;
  consent: boolean;
};

const processSteps = [
  { number: "01", title: "Submit Application", detail: "Share student details and goals." },
  { number: "02", title: "Academic Review", detail: "We assess goals, level, and fit." },
  { number: "03", title: "Guidance Call", detail: "Parent and student consultation." },
  { number: "04", title: "Onboarding", detail: "Batch placement and class start." },
];

const NOT_SPECIFIED_SENTINEL = "__not_specified";

const gradeOptions = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "O Levels", "A Levels", "IGCSE", "Others"];
const curriculumOptions = ["Federal Board", "Cambridge", "IB", "American Curriculum", "Custom/Home School", "None of the above"];
const relationOptions = ["Mother", "Father", "Guardian", "Sibling", "Other"];
const countryOptions = ["Pakistan", "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Oman", "UK", "USA", "Canada", "Australia", "Other"];
const timezoneOptions = ["PKT (UTC+5)", "GST (UTC+4)", "AST (UTC+3)", "GMT (UTC+0)", "EST (UTC-5)", "PST (UTC-8)", "Other"];
const scheduleOptions = ["Weekday Evening", "Weekend Morning", "Weekend Evening", "Flexible"];
const deviceReadinessOptions = ["Laptop + Stable Internet", "Tablet + Stable Internet", "Phone + Stable Internet", "Need guidance"];

export function AdmissionsHub() {
  const { categories, courses } = useCatalogData();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "admissions-direct";
  const sourceCourseId = searchParams.get("courseId") || "";
  const sourceCourseTitle = searchParams.get("courseTitle") || "";
  const whatsappNumber = "923310207775";

  const [step, setStep] = useState(1);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationError, setApplicationError] = useState("");
  const [applicationForm, setApplicationForm] = useState<ApplicationFormState>({
    studentName: "",
    dob: "",
    currentGrade: "",
    schoolCurriculum: "",
    targetSubjects: sourceCourseTitle ? [sourceCourseTitle] : [],
    goals: sourceCourseTitle ? `Interested in ${sourceCourseTitle}.` : "",
    supportNeeds: "",
    guardianName: "",
    relation: "",
    guardianPhone: "",
    guardianEmail: "",
    preferredContactMethod: "whatsapp",
    country: "",
    timezone: "",
    preferredSchedule: "",
    deviceReadiness: "",
    consent: false,
  });

  const targetSubjectOptions = useMemo(() => {
    const categoryOptions = categories.map((item) => item.title);
    const courseOptions = courses.map((course) => course.title);
    return Array.from(new Set([...categoryOptions, ...courseOptions])).sort((a, b) => a.localeCompare(b));
  }, [categories, courses]);

  const setApplicationValue = <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K]
  ) => {
    setApplicationForm((prev) => ({ ...prev, [key]: value }));
  };

  const formatOptional = (value: string) => value.trim() || "Not specified";
  const formatNotSpecifiedItalic = (value: string) =>
    value === NOT_SPECIFIED_SENTINEL ? "_NOT SPECIFIED_" : formatOptional(value);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, "_blank", "noopener,noreferrer");

    if (!popup) {
      window.location.href = url;
    }
  };

  const validateApplicationStep = (currentStep: number) => {
    if (currentStep === 1) {
      return (
        applicationForm.studentName.trim() &&
        applicationForm.dob &&
        applicationForm.currentGrade.trim() &&
        applicationForm.schoolCurriculum.trim()
      );
    }

    if (currentStep === 2) {
      return applicationForm.targetSubjects.length > 0 && applicationForm.goals.trim();
    }

    if (currentStep === 3) {
      return (
        applicationForm.guardianName.trim() &&
        applicationForm.relation.trim() &&
        applicationForm.guardianPhone.trim() &&
        applicationForm.guardianEmail.trim()
      );
    }

    if (currentStep === 4) {
      return (
        applicationForm.country.trim() &&
        applicationForm.timezone.trim() &&
        applicationForm.preferredSchedule.trim() &&
        applicationForm.deviceReadiness.trim()
      );
    }

    if (currentStep === 5) {
      return applicationForm.consent;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateApplicationStep(step)) {
      setApplicationError("Please complete required fields for this step.");
      return;
    }

    setApplicationError("");
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setApplicationError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const submitApplication = () => {
    if (!validateApplicationStep(5)) {
      setApplicationError("Please accept the consent to submit your application.");
      return;
    }

    setApplicationError("");

    const applicationMessage = [
      "*Scholarlink Admission Application*",
      "",
      "*1) Student Profile*",
      `- Student Name: ${formatOptional(applicationForm.studentName)}`,
      `- Date of Birth: ${formatOptional(applicationForm.dob)}`,
      `- Current Grade: ${formatNotSpecifiedItalic(applicationForm.currentGrade)}`,
      `- School/Curriculum: ${formatNotSpecifiedItalic(applicationForm.schoolCurriculum)}`,
      "",
      "*2) Learning Plan*",
      `- Target Subjects/Courses: ${applicationForm.targetSubjects.length ? applicationForm.targetSubjects.join(", ") : "Not specified"}`,
      `- Learning Goals: ${formatOptional(applicationForm.goals)}`,
      `- Support Needs: ${formatOptional(applicationForm.supportNeeds)}`,
      "",
      "*3) Guardian Contact*",
      `- Guardian Name: ${formatOptional(applicationForm.guardianName)}`,
      `- Relation: ${formatOptional(applicationForm.relation)}`,
      `- Phone: ${formatOptional(applicationForm.guardianPhone)}`,
      `- Email: ${formatOptional(applicationForm.guardianEmail)}`,
      `- Preferred Contact: ${applicationForm.preferredContactMethod.toUpperCase()}`,
      "",
      "*4) Logistics*",
      `- Country: ${formatOptional(applicationForm.country)}`,
      `- Timezone: ${formatOptional(applicationForm.timezone)}`,
      `- Preferred Schedule: ${formatOptional(applicationForm.preferredSchedule)}`,
      `- Device/Internet: ${formatOptional(applicationForm.deviceReadiness)}`,
      "",
      "*5) Context*",
      `- Source: ${source}`,
      `- Course ID: ${sourceCourseId || "Not specified"}`,
      `- Course Context: ${sourceCourseTitle || "Not specified"}`,
      "",
      "Please confirm receipt and share the next admissions steps.",
    ].join("\n");

    setApplicationSubmitted(true);
    openWhatsApp(applicationMessage);
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <motion.section
        className="home-panel rounded-[2.5rem] p-5 sm:p-8 lg:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-3">
          Admissions Desk
        </p>
        <h1 className="mb-4 text-2xl font-black leading-tight text-primary dark:text-white sm:text-4xl lg:text-5xl">
          Start Your
          <br />
          Admissions Application
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          Complete the full admissions form to help our team review student needs,
          recommend the right learning plan, and guide your enrollment.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold">
          <a href="#apply-now" className="px-4 py-2 rounded-lg bg-accent text-primary">Go to Application Form</a>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((item) => (
          <article key={item.number} className="home-card rounded-2xl p-4 sm:p-5">
            <p className="text-accent text-xs font-black tracking-widest">{item.number}</p>
            <h3 className="text-lg font-extrabold text-primary dark:text-white mt-2">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
          </article>
        ))}
      </section>

      <section id="apply-now" className="home-panel scroll-mt-32 rounded-[2rem] p-5 sm:p-7">
        <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h2 className="text-2xl font-black text-primary dark:text-white">Application Form</h2>
          <span className="text-xs font-bold text-accent">Step {step} of 5</span>
        </div>

        {source === "course-modal" && sourceCourseTitle ? (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
              Course context received: {sourceCourseTitle}
            </p>
          </div>
        ) : null}

        {applicationSubmitted ? (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              Application submitted. Our admissions team will review and contact you soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {step === 1 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Student Name *
                  </label>
                  <input className="form-field w-full" placeholder="Student Name *" autoComplete="name" value={applicationForm.studentName} onChange={(e) => setApplicationValue("studentName", e.target.value)} />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    DOB *
                  </label>
                  <input
                    type="date"
                    className="form-field w-full"
                    value={applicationForm.dob}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setApplicationValue("dob", e.target.value)}
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Use student date of birth.</p>
                </div>

                <select className="form-field" value={applicationForm.currentGrade} onChange={(e) => setApplicationValue("currentGrade", e.target.value)}>
                  <option value="">Current Grade *</option>
                  {gradeOptions.map((option) => (
                    <option key={option} value={option === "Others" ? NOT_SPECIFIED_SENTINEL : option}>{option}</option>
                  ))}
                </select>

                <select className="form-field" value={applicationForm.schoolCurriculum} onChange={(e) => setApplicationValue("schoolCurriculum", e.target.value)}>
                  <option value="">School/Curriculum *</option>
                  {curriculumOptions.map((option) => (
                    <option key={option} value={option === "None of the above" ? NOT_SPECIFIED_SENTINEL : option}>{option}</option>
                  ))}
                </select>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <details className="surface-soft rounded-xl border border-primary/15 p-3 dark:border-white/15">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-primary dark:text-white">
                    Target Subject/Course *
                    <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      ({applicationForm.targetSubjects.length} selected)
                    </span>
                  </summary>
                  <div className="mt-3 grid max-h-56 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {targetSubjectOptions.map((option) => {
                      const checked = applicationForm.targetSubjects.includes(option);
                      return (
                        <label key={option} className="flex items-start gap-2 rounded-lg border border-primary/10 bg-white/80 px-2.5 py-2 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-200">
                          <input
                            type="checkbox"
                            className="mt-0.5"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setApplicationValue("targetSubjects", [...applicationForm.targetSubjects, option]);
                              } else {
                                setApplicationValue(
                                  "targetSubjects",
                                  applicationForm.targetSubjects.filter((item) => item !== option)
                                );
                              }
                            }}
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </details>
                <textarea className="form-field" rows={3} placeholder="Learning Goals *" value={applicationForm.goals} onChange={(e) => setApplicationValue("goals", e.target.value)} />
                <textarea className="form-field" rows={3} placeholder="Support Needs (optional)" value={applicationForm.supportNeeds} onChange={(e) => setApplicationValue("supportNeeds", e.target.value)} />
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <input className="form-field" placeholder="Parent/Guardian Name *" autoComplete="name" value={applicationForm.guardianName} onChange={(e) => setApplicationValue("guardianName", e.target.value)} />
                <select className="form-field" value={applicationForm.relation} onChange={(e) => setApplicationValue("relation", e.target.value)}>
                  <option value="">Relation *</option>
                  {relationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <input className="form-field" type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone *" value={applicationForm.guardianPhone} onChange={(e) => setApplicationValue("guardianPhone", e.target.value)} />
                <input type="email" className="form-field" autoComplete="email" placeholder="Email *" value={applicationForm.guardianEmail} onChange={(e) => setApplicationValue("guardianEmail", e.target.value)} />
                <select className="form-field sm:col-span-2" value={applicationForm.preferredContactMethod} onChange={(e) => setApplicationValue("preferredContactMethod", e.target.value as ApplicationFormState["preferredContactMethod"])}>
                  <option value="whatsapp">Preferred Contact: WhatsApp</option>
                  <option value="email">Preferred Contact: Email</option>
                </select>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <select className="form-field" value={applicationForm.country} onChange={(e) => setApplicationValue("country", e.target.value)}>
                  <option value="">Country *</option>
                  {countryOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="form-field" value={applicationForm.timezone} onChange={(e) => setApplicationValue("timezone", e.target.value)}>
                  <option value="">Timezone *</option>
                  {timezoneOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="form-field" value={applicationForm.preferredSchedule} onChange={(e) => setApplicationValue("preferredSchedule", e.target.value)}>
                  <option value="">Preferred Schedule *</option>
                  {scheduleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select className="form-field" value={applicationForm.deviceReadiness} onChange={(e) => setApplicationValue("deviceReadiness", e.target.value)}>
                  <option value="">Device/Internet Readiness *</option>
                  {deviceReadinessOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="surface-soft rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Student Profile</p>
                    <p><span className="font-semibold">Student Name:</span> {applicationForm.studentName || "Not specified"}</p>
                    <p><span className="font-semibold">DOB:</span> {applicationForm.dob || "Not specified"}</p>
                    <p><span className="font-semibold">Current Grade:</span> {applicationForm.currentGrade === NOT_SPECIFIED_SENTINEL ? "NOT SPECIFIED" : (applicationForm.currentGrade || "Not specified")}</p>
                    <p><span className="font-semibold">School/Curriculum:</span> {applicationForm.schoolCurriculum === NOT_SPECIFIED_SENTINEL ? "NOT SPECIFIED" : (applicationForm.schoolCurriculum || "Not specified")}</p>
                  </div>

                  <div className="surface-soft rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Learning Plan</p>
                    <p><span className="font-semibold">Target Subjects/Courses:</span> {applicationForm.targetSubjects.length ? applicationForm.targetSubjects.join(", ") : "Not specified"}</p>
                    <p><span className="font-semibold">Learning Goals:</span> {applicationForm.goals || "Not specified"}</p>
                    <p><span className="font-semibold">Support Needs:</span> {applicationForm.supportNeeds || "Not specified"}</p>
                  </div>

                  <div className="surface-soft rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Guardian Contact</p>
                    <p><span className="font-semibold">Guardian Name:</span> {applicationForm.guardianName || "Not specified"}</p>
                    <p><span className="font-semibold">Relation:</span> {applicationForm.relation || "Not specified"}</p>
                    <p><span className="font-semibold">Phone:</span> {applicationForm.guardianPhone || "Not specified"}</p>
                    <p><span className="font-semibold">Email:</span> {applicationForm.guardianEmail || "Not specified"}</p>
                    <p><span className="font-semibold">Preferred Contact:</span> {applicationForm.preferredContactMethod.toUpperCase()}</p>
                  </div>

                  <div className="surface-soft rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Logistics</p>
                    <p><span className="font-semibold">Country:</span> {applicationForm.country || "Not specified"}</p>
                    <p><span className="font-semibold">Timezone:</span> {applicationForm.timezone || "Not specified"}</p>
                    <p><span className="font-semibold">Preferred Schedule:</span> {applicationForm.preferredSchedule || "Not specified"}</p>
                    <p><span className="font-semibold">Device/Internet:</span> {applicationForm.deviceReadiness || "Not specified"}</p>
                  </div>
                </div>
                <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={applicationForm.consent} onChange={(e) => setApplicationValue("consent", e.target.checked)} className="mt-1" />
                  <span>I confirm the information is accurate and consent to admissions follow-up.</span>
                </label>
              </div>
            ) : null}

            {applicationError ? <p className="text-sm font-semibold text-red-600 dark:text-red-400">{applicationError}</p> : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <button type="button" onClick={prevStep} className="w-full rounded-xl border border-primary/20 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-40 dark:border-white/20 dark:text-slate-200 sm:w-auto" disabled={step === 1}>
                Back
              </button>

              {step < 5 ? (
                <button type="button" onClick={nextStep} className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-light sm:w-auto">
                  Continue
                </button>
              ) : (
                <button type="button" onClick={submitApplication} className="w-full rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-primary hover:bg-accent-light sm:w-auto">
                  Submit Application
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
