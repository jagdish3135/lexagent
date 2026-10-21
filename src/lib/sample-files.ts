import { SAMPLE_FORMATS, SAMPLES } from "./samples";

// Ready-made case files in /sample-cases (copied to public/sample-cases at install), for trying uploads.
export const SAMPLE_FILES = SAMPLES.map((s) => ({ slug: s.slug, title: `${s.label} · ${s.hint}`, formats: SAMPLE_FORMATS }));
