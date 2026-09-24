// The 5 board members with exact bios. Source: docs/site-audit.md §7
// Section 3. Titles per docs/BUILD-PROMPT.md §6.3 Section 3 (the current
// site leaves Alan Kraut and Cynde Burgess without titles; the rebuild
// gives every member a title). §12 fix applied: "wefare" → "welfare" in
// Ronna Cook's bio.
export interface BoardMember {
  name: string;
  title: string;
  photo: string;
  alt: string;
  bio: string;
}

export const board = [
  {
    name: "Leslie Shedlin",
    title: "President",
    photo: "board-leslie-shedlin.jpg",
    alt: "Leslie Shedlin, President",
    bio: "Leslie Shedlin is an attorney with over twenty five years of experience in the area of child abuse and neglect. Ms. Shedlin's work includes litigation, advocacy and training.",
  },
  {
    name: "Agnes Leshner",
    title: "Board Chair",
    photo: "board-agnes-leshner.jpg",
    alt: "Agnes Leshner, Board Chair",
    bio: "Agnes Leshner is a psychologist and family therapist who served for over 25 years as the director of Montgomery County Child Welfare Services. Ms. Leshner has a Masters degree in Psychology and has extensive experience working with children, youth and families.",
  },
  {
    name: "Ronna Cook",
    title: "Treasurer",
    photo: "board-ronna-cook.jpg",
    alt: "Ronna Cook, Treasurer",
    // §12 fix: "wefare" → "welfare"
    bio: "Ronna Cook retired as an Associate Director at Westat, an internationally known research consultancy, after more than 35 years of conducting child welfare research. Ms. Cook has Masters Degrees in both social work and special education with emotionally disturbed children.",
  },
  {
    name: "Alan Kraut",
    title: "Board Member",
    photo: "board-alan-kraut.jpg",
    alt: "Alan Kraut, Board Member",
    bio: "Alan Kraut is a developmental psychologist with over 40 years of experience — on the faculty of Virginia Tech, as senior staff at the American Psychological Association, Executive Director of the Association for Psychological Science, and Executive Director of the Psychological Clinical Science Accreditation System. Dr. Kraut also served on the Board of Tree House, Montgomery County's Child Advocacy Center for abused and neglected children.",
  },
  {
    name: "Cynde R. Burgess",
    title: "Board Member",
    photo: "board-cynde-burgess.jpg",
    alt: "Cynde R. Burgess, Board Member",
    bio: "A retired Child Welfare Services Supervisor, Cynde Burgess is a Licensed Certified Social Worker-Clinical with over 30 years of experience serving children, youth and families of Montgomery County. With an expertise in transitioning youth services, Ms. Burgess worked with her team to empower youth and to help them develop the vital skills necessary to achieve their educational and employment goals and to live independently. She is currently a psychotherapist in private practice.",
  },
] satisfies BoardMember[];
