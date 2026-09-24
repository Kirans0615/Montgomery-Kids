// Fiscal-year grant allocation donut data, from the "Spring Forward with
// 4Montgomery's Kids" post (docs/site-audit.md §11.3): "approximately 20%
// of our grants to children involved education, 11% involved
// transportation, 15% supported recreational activities, 1% were
// housing-related, and 53% were for a combination of personal and
// household needs." Caption quote is verbatim from build-prompt §6.1
// Section 4b (itself drawn from the same post's "we were able to fill
// every request we received" line).
export interface AllocationSegment {
  label: string;
  percent: number;
}

export interface AllocationData {
  sourceLabel: string;
  segments: AllocationSegment[];
  captionQuote: string;
}

export const allocation = {
  sourceLabel: "Spring Forward with 4Montgomery's Kids",
  segments: [
    { label: "Education", percent: 20 },
    { label: "Transportation", percent: 11 },
    { label: "Recreational activities", percent: 15 },
    { label: "Housing", percent: 1 },
    { label: "Personal & household needs", percent: 53 },
  ],
  captionQuote:
    "we were able to fill every request we received – no child or family was denied the assistance they sought.",
} satisfies AllocationData;
