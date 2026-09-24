// The 6 home-page testimonials, verbatim with exact attributions.
// Source: docs/site-audit.md §6 Section 5 ("What Others Are Saying About
// Us"). No §12 fixes apply to this file — quotes are preserved exactly as
// written, including their original punctuation.
export interface Testimonial {
  /** Stable id so other pages (e.g. Our Stories §6.4 NEW Section 3) can
   * reuse specific testimonials without duplicating the copy. */
  id: string;
  quote: string;
  attribution: string;
}

export const testimonials = [
  {
    id: "young-adult-out-of-foster-care",
    quote:
      "I was an older youth in foster care. 4Montgomery's Kids helped me when I was pregnant and needed baby supplies. I was not working because of COVID and did not have anything for my baby. They helped me a lot!",
    attribution: "A Young Adult Out of Foster Care",
  },
  {
    id: "voices-for-children-montgomery",
    quote:
      "This is a great resource for our kids and provides us with a way to bring them incentives as well as well-deserved rewards for their efforts.",
    attribution: "Voices for Children Montgomery",
  },
  {
    id: "social-worker-rare-opportunity",
    quote:
      "4MK provides social workers with a rare opportunity to say 'yes' to the needs that enhance a child's well-being in a tangible way.",
    attribution: "A Social Worker for Montgomery County",
  },
  {
    id: "foster-mom-football-fee",
    quote:
      "Thank you for paying J's football fee! J has been working so hard to get his grades up so that he can play in a game. He has loved going to practice every day and you gave him the motivation to work in class every day. Your financial assistance was critical!",
    attribution: "A Foster Mom",
  },
  {
    id: "aging-out-first-apartment",
    quote:
      "I appreciate the check you gave for the security deposit on my VERY FIRST apartment! I can't express enough how much it means to me. This has really given me the chance for a head start. Hopefully in the future, you are able to do the same for other kids in the position I am in now!",
    attribution: "A Foster Youth who was Aging Out of Foster Care",
  },
  {
    id: "social-worker-phone-story",
    quote:
      "I gave T the phone you bought him and wish you guys could have seen his face. So happy! The best part He texted me to arrange to call me (not text me) today. I almost died from happiness. He often does things that could have been avoided had he talked them through first. So to have him reaching out to talk to me is amazing. My work (and all of Child Welfare Services) is so much better because of 4MK!",
    attribution: "A Social Worker for Montgomery County",
  },
] satisfies Testimonial[];
