// Home-page story slides (audit §6 Section 3 / build-prompt §6.1 Section 3)
// and the Our Stories page cards + CTA (audit §8 / build-prompt §6.4
// Section 2). Copy is verbatim from docs/site-audit.md except for the
// §12 fixes: the slide-3 title is corrected to match its body text, and
// the two broken/old Donate links on slides 2 and 3 now point at the
// current donation URL.
import { DONATE_URL } from "@/lib/donate";

export type StoryCategory = "Education" | "Independence" | "Wellbeing";

export type StoryCover =
  | { kind: "photo"; image: string; alt: string }
  | { kind: "illustrated"; icon: string };

export interface HomeStorySlide {
  slug: string;
  /** Caveat tag shown on the slide (build-prompt §6.1 Section 3(B)). */
  tag: string;
  title: string;
  body: string;
  cover: StoryCover;
  donate?: { label: string; url: string };
}

export interface StoryCard {
  slug: string;
  title: string;
  body: string;
  category: StoryCategory;
  cover: StoryCover;
}

export interface StoriesCta {
  body: string;
  subline: string;
  buttonLabel: string;
  donateUrl: string;
  cover: StoryCover;
  overlayTone: "sun";
}

// ---------------------------------------------------------------------------
// Home — "Some of Our Stories" slider, 5 slides (audit §6 Section 3)
// ---------------------------------------------------------------------------
export const homeStorySlides = [
  {
    slug: "summer-camp",
    tag: "summer camp",
    title: "Summer Camp",
    body: "4Montgomery's Kids sends many children to summer camps. Most are the result of simple requests for usual camp activities. Some requests are more complex. For example, we sent siblings who witnessed domestic violence to a special overnight camp, and we sent an older child struggling with depression to a traveling teen camp.",
    cover: {
      kind: "photo",
      image: "summer-camp-scouts.jpg",
      alt: "Two children in scout uniforms outside a tent, one playing guitar and one reading a scout field book",
    },
  },
  {
    slug: "graduating-in-style",
    tag: "graduation",
    title: "Graduating in Style",
    body: "A is a foster teen who was set to graduate from high school when commencement was cancelled because of the pandemic. The ceremony was rescheduled at the last minute as a virtual event, and seniors were encouraged to \"attend\" in cap and gown. 4 Montgomery's Kids rented the graduation package and A proudly \"received\" his diploma—exactly like the rest of his classmates.",
    cover: {
      kind: "photo",
      image: "graduate.jpg",
      alt: "A smiling graduate in cap and gown holding his diploma",
    },
    donate: { label: "Donate", url: DONATE_URL },
  },
  {
    // §12 fix: title corrected from "Fulfilling a Young Girl's Dream to
    // Drive" (a mismatch on the current site) to match this slide's actual
    // body text, which is the tablet story.
    slug: "staying-connected-to-high-school",
    tag: "school",
    title: "Staying Connected to High School",
    body: "R is a high school student who recently moved from one foster care placement to another. Then came the pandemic—and with it, online learning. 4Montgomery's Kids purchased a tablet for him so R could attend his new school virtually and get to know his new classmates. With the help of his foster parents, R also is using the tablet for tutoring in Spanish.",
    cover: {
      kind: "photo",
      image: "high-school-classroom.jpg",
      alt: "High school students at their desks facing a classroom smartboard",
    },
    donate: { label: "Donate", url: DONATE_URL },
  },
  {
    slug: "providing-a-critical-outlet-home",
    tag: "wellbeing",
    title: "Providing a Critical Outlet",
    body: "C is a foster teen with autism. He had difficulty adjusting when pandemic restrictions no longer allowed him to attend school or participate in his usual afterschool activities. 4Montgomery's Kids paid for a new bicycle.  Bike riding now gives C the daily routine he missed, with the benefit of exercise and a way to release energy.",
    cover: {
      kind: "photo",
      image: "bike-ride.jpg",
      alt: "A young person riding a bicycle down a leafy path",
    },
  },
  {
    slug: "the-young-champion",
    tag: "sports",
    title: "The Young Champion",
    body: "A 9-year-old foster child's pee-wee football team was scheduled to travel to Florida for a championship playoff. The young boy was able to join his team when 4Montgomery's paid the way.  (His team won!)",
    cover: {
      kind: "photo",
      image: "peewee-football.jpg",
      alt: "A young football player in a helmet watching his team on the field",
    },
  },
] satisfies HomeStorySlide[];

// ---------------------------------------------------------------------------
// Our Stories page — 11 story cards (audit §8), categorized per
// build-prompt §6.4 Section 2: Education (1,5,6,10), Independence
// (2,3,7,11), Wellbeing (4,8,9).
// ---------------------------------------------------------------------------
export const storyCards = [
  {
    slug: "equipping-for-a-toddlers-future",
    title: "Equipping for a Toddler's Future",
    category: "Education",
    body: "L is a medically fragile toddler. The pandemic has made it impossible for L's foster parents to continue her occupational therapy. 4Montgomery's Kids donors provided the set of play blocks and other tools recommended by her therapist so L could stay busy and continue therapy at home, as well as a dresser for her clothing.",
    cover: {
      kind: "photo",
      image: "toddler-blocks.jpg",
      alt: "A laughing toddler playing with colorful building blocks",
    },
  },
  {
    slug: "fulfilling-a-young-girls-dream-to-drive",
    title: "Fulfilling a Young Girl's Dream to Drive",
    category: "Independence",
    body: "Prior to coming to the U.S., M. was severely injured in an earthquake. She lost a leg. Her father brought her to Montgomery County, but soon he ran into trouble and she was placed in foster care. Many years later, the now-teenager's dream was to be able to drive a car like her friends. With the help of generous contributions from our donors, 4Montgomery's Kids bought her a special accelerator pedal to use with her prosthetic leg. Now, drive she does!",
    cover: {
      kind: "photo",
      image: "young-woman-driving.jpg",
      alt: "A young woman smiling as she drives",
    },
  },
  {
    slug: "helping-a-young-man-move-from-foster-care",
    title: "Helping a Young Man Move from Foster Care",
    category: "Independence",
    body: "F is a young adult is in the process of exiting the foster care system. He is now between a foster home and a group home. The next step is independence! Donors' support allowed 4Montgomery's Kids to buy him a Chromebook 'bundle' and gave him additional funds to help support the transition. F is hoping to attend Montgomery College in the fall and plans to use the Chromebook for his course work.",
    cover: { kind: "illustrated", icon: "Laptop" },
  },
  {
    slug: "giving-a-gift-of-independence",
    title: "Giving a Gift of Independence",
    category: "Wellbeing",
    body: "E is a young child with mental disabilities who cannot speak clearly or make herself understood. If separated from her family, she can't tell anyone where she lives, her phone number, or other identifying information. Thanks to our contributors, 4Montgomery's Kids has provided her a special medical identification that has given the foster family confidence to give the child more independent experiences while still protecting her safety.",
    cover: { kind: "illustrated", icon: "ShieldCheck" },
  },
  {
    slug: "encouraging-higher-education",
    title: "Encouraging Higher Education",
    category: "Education",
    body: "Six high-performing high school seniors in foster care are receiving 4MontgomeryKids scholarships to support them as they move on to higher education in the fall. Two are going to study nursing, one is going to study early childhood, and the three others are still considering what to study. One of these graduates also received a scholarship from his college; another is overcoming a developmental disability to attend.",
    cover: { kind: "illustrated", icon: "GraduationCap" },
  },
  {
    slug: "staying-connected-to-high-school",
    title: "Staying Connected to High School",
    category: "Education",
    body: "R is a high school student who recently moved from one foster care placement to another. Then came the pandemic—and with it, online learning. 4Montgomery's Kids purchased a tablet for him so R could attend his new school virtually and get to know his new classmates. With the help of his foster parents, R also is using the tablet for tutoring in Spanish.",
    cover: { kind: "illustrated", icon: "Tablet" },
  },
  {
    slug: "a-first-apartment",
    title: "A First Apartment",
    category: "Independence",
    body: "D is a young man moving from a group home to his own apartment—a critical step to provide stability as he looks for employment—and needed money for the deposit so the apartment would be held for him. 4Montgomery's Kids was able to quickly provide deposit funds. Thanks to the support of our donors, the apartment is now his!",
    cover: { kind: "illustrated", icon: "KeyRound" },
  },
  {
    slug: "providing-a-critical-outlet",
    title: "Providing a Critical Outlet",
    category: "Wellbeing",
    body: "C. is a pre-teen boy with autism who thrives on daily routines. Since the pandemic, though, C. has not been able to go to school or participate in his regular after-school activities. He was having difficulty adjusting — becoming easily agitated, starting arguments, and even destroying things. Contributions to 4Montgomery's Kids have helped to turn this challenging situation around—in the form of a new bicycle! Riding the bike has become a daily activity, helps him get exercise, and is a way for him to release energy when he is upset.",
    cover: {
      kind: "photo",
      image: "bike-ride.jpg",
      alt: "A young person riding a bicycle down a leafy path",
    },
  },
  {
    slug: "repairing-a-family",
    title: "Repairing a Family",
    category: "Wellbeing",
    body: "M is a mother of three young children who were living in a foster home. She was working very hard to reunify the family. Then M's car transmission broke down. She was stranded without a way to get to her job. She was able to borrow some money, but not enough. Through donors' contributions, 4Montgomery's Kids paid for the balance of the repair. As a result, M returned to work, and several months later the children returned home to live with her.",
    cover: { kind: "illustrated", icon: "Car" },
  },
  {
    slug: "graduating-in-style",
    title: "Graduating in Style",
    category: "Education",
    body: "A is a foster teen who was set to graduate from high school when commencement was cancelled because of the pandemic. The ceremony was rescheduled at the last minute as a virtual event, and seniors were encouraged to \"attend\" in cap and gown. 4 Montgomery's Kids rented the graduation package and A proudly \"received\" his diploma—exactly like the rest of his classmates.",
    cover: {
      kind: "photo",
      image: "graduate.jpg",
      alt: "A smiling graduate in cap and gown holding his diploma",
    },
  },
  {
    slug: "supporting-success",
    title: "Supporting Success",
    category: "Independence",
    body: "N was aging out of foster care and with tuition assistance from 4Montgomery's Kids donors was able to attend cosmetology school. N graduated, got a great job in a salon, and moved into her own apartment. But when the pandemic hit, N's salon closed and she was laid off. The support of our donors enabled 4Montgomery's Kids to pay her rent so she could stay in the apartment.",
    cover: { kind: "illustrated", icon: "Scissors" },
  },
] satisfies StoryCard[];

// ---------------------------------------------------------------------------
// Our Stories page — trailing CTA card (audit §8, item 12)
// ---------------------------------------------------------------------------
export const storiesCta = {
  body: "These are just a few stories of how, with support from our donors, 4 Montgomery's Kids has been able to help kids in need.",
  subline:
    "Make a difference in the life of a child in foster care in Montgomery County.",
  buttonLabel: "Donate",
  donateUrl: DONATE_URL,
  cover: {
    kind: "photo",
    image: "tug-of-war.jpg",
    alt: "Laughing kids pulling together in a game of tug of war",
  },
  overlayTone: "sun",
} satisfies StoriesCta;
