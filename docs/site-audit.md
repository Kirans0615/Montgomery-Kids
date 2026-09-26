# 4Montgomery's Kids — Full Current-Site Snapshot (for Claude Code)

Captured: September 23, 2026 from https://4montgomeryskids.org
Purpose: complete reference of the CURRENT website (structure, navigation, layout, exact copy, images, links, styling, and known issues) so a redesign/improvement can preserve content and fix problems.

Conventions in this doc:
- Copy inside `>` blockquotes or under "Exact copy" is verbatim from the live site (typos preserved on purpose and flagged in the Issues section).
- "Section / Row / Column / Module" mirror the Divi Builder structure of each page.
- Image paths are relative to `https://4montgomeryskids.org/wp-content/uploads/` unless a full URL is given.

---

## 1. Platform & Tech Stack

- CMS: WordPress (hosted on GoDaddy Managed WordPress — GoDaddy "launch" mu-plugin present)
- Theme: Divi v4.27.9 (Elegant Themes), all pages built with the Divi Builder (`et_pb_pagebuilder_layout`)
- Header style: Divi "left" header (`et_header_style_left`), fixed/sticky nav (`et_fixed_nav`), dropdown fade animation
- Footer: Divi default footer, 4 footer-column setting but no widgets — only the bottom bar is shown
- Donations: external hosted form at `https://secure.4montgomeryskids.org/forms/donations` (third‑party donation platform on a subdomain). One legacy link still points to `https://4montgomeryskids.networkforgood.com/` (old Network for Good form).
- Fonts (Google Fonts): **Open Sans** (body, nav, h1) and **Rubik** (h2, h3, buttons)
- No meta descriptions, no Open Graph images on any page (SEO gap)
- WordPress REST API is public (`/wp-json/wp/v2/pages`, `/wp-json/wp/v2/posts`)

## 2. Design Tokens (computed from live CSS)

| Element | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|
| body | Open Sans | 14px | 500 | #666666 (rgb 102,102,102) | line-height 23.8px, bg #FFFFFF |
| h1 | Open Sans | 26px | 500 | #333333 | |
| h2 | Rubik | 42px | 700 | #333333 | line-height 50.4px |
| h3 | Rubik | 30px | 700 | #333333 | line-height 42px |
| Hero paragraph | Open Sans | 18px | 500 | #FFFFFF | on dark photo overlay |
| Nav links (#top-menu a) | Open Sans | 14px | 600 | active/hover green #8EC63F (rgb 142,198,63) | other items #666 |
| Buttons (.et_pb_button) | Rubik | 14px | 700 | text #FFFFFF, bg #FFB400 (rgb 255,180,0) | UPPERCASE, wide letter-spacing |
| Outline button variant | Rubik | — | 700 | text/border #FFB400 on dark bg | e.g. "ABOUT US" on dark section |
| Footer (#main-footer) | Open Sans | 14px | 500 | #666 | bg #222222 |
| Footer bottom bar | — | — | — | — | bg rgba(0,0,0,0.32) |

Other colors in use:
- Section dark bg: #2A2A2A (rgb 42,42,42)
- Light gray section bg: #F7F7F7
- Hero overlays: radial-gradient rgba(40,40,40,0.59→0.66) over photo (Blog uses 0.79→0.86; Programs "No Request" section uses rgba(12,12,12,0.4→0))
- Divider accent: short yellow/orange bar (#FFB400-ish) under section headings, centered or left-aligned
- Brand logo colors: green + orange script "4Montgomery's Kids" wordmark

Brand assets:
- Logo: `2026/01/Untitled-1.png` (alt "4 Montgomery's Kids") — note the filename is "Untitled-1"
- Next to the logo in the header: a Candid "Platinum Transparency 2026" seal
- Favicon: `2022/06/favicon-150x150.png`
- Older square logo: `2018/03/logosquare.png`, `2018/03/4-Montgomerys-Kids-Final.jpg`

## 3. Global Header / Navigation

Layout: white sticky header, logo + Candid seal on the left, menu on the right. Same six items on mobile (hamburger).

| Order | Label (exact) | URL |
|---|---|---|
| 1 | Home | `/` |
| 2 | About Us | `/about-us/` |
| 3 | Our Stories | `/our-stories/` |
| 4 | Programs | `/25726-2/` ← ugly auto-generated slug |
| 5 | Blog | `/blog-2/` |
| 6 | DONATE | `https://secure.4montgomeryskids.org/forms/donations` (plain text link, not styled as a button) |

No dropdowns / sub-menus. No top bar. No search.

## 4. Global Footer

Only a bottom bar (no widgets, no nav, no social icons). Exact text:

> © 4Montgomery's Kids, 2022 / P.O. Box 34864, 10421Westlake Drive, Bethesda, MD 20817

(Issues: stale year 2022; missing space "10421Westlake"; street conflicts with "10421 Motor City Drive" used on About page and donation form.)

## 5. Sitemap / Inventory

Pages (published):
| ID | Title in WP | URL | In nav? | Notes |
|---|---|---|---|---|
| 859 | Home2 | `/` | Yes | Front page. `<title>` renders as "4 Montgomery's Kids \|" (dangling pipe) |
| 957 | About Us | `/about-us/` | Yes | |
| 788 | Our Stories | `/our-stories/` | Yes | |
| 25726 | Programs | `/25726-2/` | Yes | Slug should be `/programs/` |
| 26085 | Blog | `/blog-2/` | Yes | Active blog listing (paginated, `/blog-2/page/2/`) |
| 707 | Blog | `/blog/` | No | Orphan older duplicate blog listing (dark hero, gray section, shows dates/categories) |
| 666 | Overview | `/overview/` | No | Empty page (one blank text module) |

External: Donation form `secure.4montgomeryskids.org/forms/donations`; Facebook `https://www.facebook.com/4montgomeryskids`.

Blog posts (21), newest first — full text in Section 11:
1. 2025-11-30 — You Made It Happen: 2,500 Kids Supported and Counting — `/2025/11/you-made-it-happen-2500-kids-supported-and-counting/`
2. 2025-10-13 — "Fall" for Kids — `/2025/10/fall-for-kids/`
3. 2025-08-07 — Spring Forward with 4Montgomery's Kids — `/2025/08/spring-forward-with-4montgomerys-kids/`
4. 2025-08-07 — We are Thankful for You — `/2025/08/fall-2023-we-are-thankful-for-you/`
5. 2025-08-07 — 10 Years of Helping Children — `/2025/08/10-years-of-helping-children/`
6. 2025-08-07 — How scary must it be to have to leave foster care at age 21? — `/2025/08/how-scary-must-it-be-to-have-to-leave-foster-care-at-age-21/`
7. 2022-09-01 — Spring Arrives for Children in Foster Care — `/2022/09/spring-arrives-for-children-in-foster-care/`
8. 2021-08-25 — Donor Spotlight: the Ammerman Family Foundation — `/2021/08/donor-spotlight-the-ammerman-family-foundation/`
9. 2020-11-19 — Fall 2020 Update — `/2020/11/fall-2020-update/`
10. 2020-11-17 — Workout for Good — `/2020/11/workout-for-good/`
11. 2019-12-13 — Thank you! — `/2019/12/thank-you/`
12. 2019-12-05 — Moving to Independence — `/2019/12/moving-to-independence/`
13. 2019-11-27 — Over 550 in 5 years! — `/2019/11/over-550-in-5-years/`
14. 2019-04-08 — Foster Children Need Summer Camp Too!! — `/2019/04/foster-children-need-summer-camp-too/`
15. 2018-11-06 — Get to Know our Social Workers — `/2018/11/new-community-parters/` (slug typo)
16. 2018-11-05 — Fall 2018 Update — `/2018/11/fall-2018-update/`
17. 2018-11-05 — Donor Spotlight: Diane Burch — `/2018/11/donor-spotlight-diane-burch/`
18. 2018-04-10 — Peewee Football Champions — `/2018/04/peewee-football-champions/`
19. 2018-04-10 — Donor Spotlight: Gail Maidenbaum — `/2018/04/donor-spotlight-gail-maidenbaum/`
20. 2018-04-10 — Spring 2018 News — `/2018/04/spring-2018-news/`
21. 2017-10-10 — How you can help — `/2017/10/how-you-can-help/`

Categories used: Uncategorized (all 2021+ posts), News, Success Stories, What your money supports, Donor Spotlight.
Authors: "Alan Kraut" (2025 posts), "kd44montkids" (older posts — username exposed as byline).

---

## 6. HOME — `/`

`<title>`: "4 Montgomery's Kids |"

### Section 1 — Hero (full-width, photo bg)
- Background: `2018/03/students-377789_1280-1024x679.jpg` (stock photo of children writing at desks) with dark radial overlay
- Row 1 (1 col): spacer module, then text (white, 18px), then yellow button

Exact copy:
> 4Montgomery's Kids enriches the lives of abused and neglected children and youth in Montgomery County's child welfare system by providing them with opportunities and services they would not otherwise receive. One child at a time, we provide hope, help restore dignity and increase self-esteem.

Button: **HOW WE MAKE A DIFFERENCE** → `/our-stories/`

(No H1 on the homepage.)

### Section 2 — About strip (white)
- Row 1: 2 columns (3/4 + 1/4)
  - Col 1: H2 "About 4Montgomery's Kids"
  - Col 2: Button **About** → `/about-us/`

### Section 3 — "Some of Our Stories" (white)
- Row 1: empty text module; H2 "Some of Our Stories" (centered); yellow divider
- Row 2: Full-width **slider** (5 slides, dark text layout over photo, dot controls 1–5):
  1. **Summer Camp** — "4Montgomery's Kids sends many children to summer camps. Most are the result of simple requests for usual camp activities. Some requests are more complex. For example, we sent siblings who witnessed domestic violence to a special overnight camp, and we sent an older child struggling with depression to a traveling teen camp." (no button)
  2. **Graduating in Style** — "A is a foster teen who was set to graduate from high school when commencement was cancelled because of the pandemic. The ceremony was rescheduled at the last minute as a virtual event, and seniors were encouraged to "attend" in cap and gown. 4 Montgomery's Kids rented the graduation package and A proudly "received" his diploma—exactly like the rest of his classmates." Button **Donate** → `https://4montgomeryskids.networkforgood.com/` (OLD donation link)
  3. **Fulfilling a Young Girl's Dream to Drive** — "R is a high school student who recently moved from one foster care placement to another. Then came the pandemic—and with it, online learning. 4Montgomery's Kids purchased a tablet for him so R could attend his new school virtually and get to know his new classmates. With the help of his foster parents, R also is using the tablet for tutoring in Spanish." Button **Donate** → `#` (BROKEN). NOTE: title and body don't match (title is the driving story; body is the tablet story).
  4. **Providing a Critical Outlet** — "C is a foster teen with autism. He had difficulty adjusting when pandemic restrictions no longer allowed him to attend school or participate in his usual afterschool activities. 4Montgomery's Kids paid for a new bicycle.  Bike riding now gives C the daily routine he missed, with the benefit of exercise and a way to release energy."
  5. **The Young Champion** — "A 9-year-old foster child's pee-wee football team was scheduled to travel to Florida for a championship playoff. The young boy was able to join his team when 4Montgomery's paid the way.  (His team won!)"
- Row 3: Button **Read More Stories** → `/our-stories/`

### Section 4 — Impact (specialty section, dark #2A2A2A)
- Row 1: 2 columns (1/3 + 2/3)
  - Col 1:
    - H2 (white): "We've made a difference in the lives of over 2,800 kids!"
    - Yellow divider (left)
    - Text: "A need to some is only a dream when it's out of reach. 4Montgomery's Kids helps children in the foster care system in Montgomery County, Maryland achieve their dreams, both big and small."
    - Outline button **ABOUT US** → `/about-us/`
  - Col 2:
    - Image `2022/06/Jumping-rope-wide.jpg` (980×541, no alt) — double-dutch jump rope crowd photo
    - Text module: empty H3, then H3 "Follow us on Facebook" (low-contrast text, not an obvious link)
    - Button **DONATE** → donation form

### Section 5 — Testimonials + Partners (light gray #F7F7F7)
- Row 1: H2 "What Others Are Saying About Us" + divider
- Row 2 (3 cols, white testimonial cards):
  1. "I was an older youth in foster care. 4Montgomery's Kids helped me when I was pregnant and needed baby supplies. I was not working because of COVID and did not have anything for my baby. They helped me a lot!" — **A Young Adult Out of Foster Care**
  2. "This is a great resource for our kids and provides us with a way to bring them incentives as well as well-deserved rewards for their efforts." — Voices for Children Montgomery
  3. "4MK provides social workers with a rare opportunity to say 'yes' to the needs that enhance a child's well-being in a tangible way." — A Social Worker for Montgomery County
- Row 3 (3 cols):
  1. "Thank you for paying J's football fee! J has been working so hard to get his grades up so that he can play in a game. He has loved going to practice every day and you gave him the motivation to work in class every day. Your financial assistance was critical!" — **A Foster Mom**
  2. "I appreciate the check you gave for the security deposit on my VERY FIRST apartment! I can't express enough how much it means to me. This has really given me the chance for a head start. Hopefully in the future, you are able to do the same for other kids in the position I am in now!" — **A Foster Youth who was Aging Out of Foster Care**
  3. "I gave T the phone you bought him and wish you guys could have seen his face. So happy! The best part He texted me to arrange to call me (not text me) today. I almost died from happiness. He often does things that could have been avoided had he talked them through first. So to have him reaching out to talk to me is amazing. My work (and all of Child Welfare Services) is so much better because of 4MK!" — A Social Worker for Montgomery County
- Row 4: H2 "Thank You to Our Community Partners" + divider
- Row 5 (4 cols, partner logos, all without alt text):
  - Col 1: `2022/06/100WCA-horizontal.png` → https://www.100whocarealliance.org/ ; then text H1 "The Phase Foundation" (text only, no logo, uses an H1)
  - Col 2: `2022/06/St-Annes-words-1.png` → https://www.saintannesdamascus.net/ ; `2025/10/1-1.png` → https://lowermocowwc.com/
  - Col 3: `2025/08/Nora-Roberts-Foundation-Logo.png` → https://norarobertsfoundation.org/ ; H3 "Norah Roberts Foundation" (misspelled — logo says Nora)
  - Col 4: `2025/08/Healthcare-Initiative-Foundation.png` → https://hifmc.org/
- Row 6: 5 empty columns (leftover)

### Section 6 — empty (white, one empty row)

Inconsistent impact numbers on site: Home says "over 2,800 kids"; Programs counter says 2,852 fulfilled requests; Nov 2025 post title says "2,500 Kids" while body says "over 2,600 children".

---

## 7. ABOUT US — `/about-us/`

`<title>`: "About Us | 4 Montgomery's Kids"

### Section 1 — Hero (photo bg `2018/03/jumping-rope-square.jpg`, dark overlay)
- Row 1: 2 cols (2/3 + 1/3)
  - Col 1:
    - H1 "About Us"
    - Text: "4Montgomery's Kids is a 501(c)3 nonprofit working to create a brighter future for abused and neglected children and young adults in Montgomery County, MD."
      "For Questions or Comments, please contact President: Leslie Shedlin lkshedlin@4montgomeryskids.org or Board Chair: Agnes Leshner aleshner@4montgomeryskids.org" (both mailto links; missing space before "or")
    - Button **View Our Stories** → `/` (WRONG: goes to Home, should go to /our-stories/)
  - Col 2: three blurbs (icon + H4 + text):
    - **Our Mission** — "To improve the lives of abused and neglected children by providing opportunities and services they otherwise might not receive."
    - **Meeting Ongoing Needs** — "As long as there are children in foster care, demand for our support will never end."
    - **Serving the local community** — "We work directly with county social workers to fill the needs they have identified for children in their care."

### Section 2 — About copy (white)
- Row 1: H2 "About 4 Montgomery's Kids" + divider
- Row 2: two text modules:
  > A need to some is only a dream when it's out of reach. 4Montgomery's Kids helps children in the foster care system in Montgomery County, Maryland achieve their dreams, both big and small.
  >
  > On any given day, more than 400 children live in foster care. They were removed from families because of physical or sexual abuse or chronic neglect. Another 100 or so at-risk children remain with their families but are being monitored by county social workers. 4Montgomery's Kids provides support and enrichment to these children and young adults to help turn needs that once were only dreams into reality.

  > Dreams come in all shapes and sizes. The dreams of children in foster care range from a simple gift card for a birthday, to summer camp, to transportation for a job, to rent so they won't be homeless as they age out of child welfare.
  >
  > Mailing Address:
  > 4 Montgomery's Kids
  > P.O.Box 34864, 10421 Motor City Drive
  > Bethesda, MD 20817
- Row 3: H2 "Board of Directors" + divider

### Section 3 — Board (Divi Person/Team Member modules, photo + name + title + bio)
Row 1 (3 cols):
- **Leslie Shedlin** — President — photo `2025/06/Leslie-Pic-for-Website-edited-1.jpg` — "Leslie Shedlin is an attorney with over twenty five years of experience in the area of child abuse and neglect. Ms. Shedlin's work includes litigation, advocacy and training."
- **Agnes Leshner** — Board Chair — photo `2022/03/Agnes-Lesner.jpg` — "Agnes Leshner is a psychologist and family therapist who served for over 25 years as the director of Montgomery County Child Welfare Services. Ms. Leshner has a Masters degree in Psychology and has extensive experience working with children, youth and families."
- **Ronna Cook** — Treasurer — photo `2018/03/Ronna-1.jpg` — "Ronna Cook retired as an Associate Director at Westat, an internationally known research consultancy, after more than 35 years of conducting child wefare research. Ms. Cook has Masters Degrees in both social work and special education with emotionally disturbed children." ("wefare" typo)

Row 2 (3 cols, third empty):
- **Alan Kraut** (no title) — photo `2019/02/AlanKraut.jpg` (lazy/0×0 at capture) — "Alan Kraut is a developmental psychologist with over 40 years of experience — on the faculty of Virginia Tech, as senior staff at the American Psychological Association, Executive Director of the Association for Psychological Science, and Executive Director of the Psychological Clinical Science Accreditation System. Dr. Kraut also served on the Board of Tree House, Montgomery County's Child Advocacy Center for abused and neglected children."
- **Cynde R. Burgess** (no title) — photo `2022/03/Cynde-Burgess.jpg` — "A retired Child Welfare Services Supervisor, Cynde Burgess is a Licensed Certified Social Worker-Clinical with over 30 years of experience serving children, youth and families of Montgomery County. With an expertise in transitioning youth services, Ms. Burgess worked with her team to empower youth and to help them develop the vital skills necessary to achieve their educational and employment goals and to live independently. She is currently a psychotherapist in private practice."
- (empty column)

### Section 4 — Quote (white)
> I am writing this letter to display my utmost gratitude for everything your organization has done for me and my brother. I was able to take a shot like any ordinary kid. . . You have given me hope that I am not forgotten."

Attribution: "L, Foster youth" (note: missing opening quotation mark)

---

## 8. OUR STORIES — `/our-stories/`

`<title>`: "Our Stories | 4 Montgomery's Kids" (uses a Divi Theme Builder template)

### Section 1 (white) — no hero image
- Row 1: H3 "Our Stories" (page title is only an H3; no H1)
- Rows 2–5: 3-column grid of story cards, each = image + H3 title + paragraph. All images have empty alt.

Row 2:
1. Image `2020/09/crop-Depositphotos_247059818_l-2015-e1606228205102.jpg` — **Equipping for a Toddler's Future** — "L is a medically fragile toddler. The pandemic has made it impossible for L's foster parents to continue her occupational therapy. 4Montgomery's Kids donors provided the set of play blocks and other tools recommended by her therapist so L could stay busy and continue therapy at home, as well as a dresser for her clothing."
2. Image `2020/09/young-woman-driving-car-gettyimages-680x402-1.jpg` — **Fulfilling a Young Girl's Dream to Drive** — "Prior to coming to the U.S., M. was severely injured in an earthquake. She lost a leg. Her father brought her to Montgomery County, but soon he ran into trouble and she was placed in foster care. Many years later, the now-teenager's dream was to be able to drive a car like her friends. With the help of generous contributions from our donors, 4Montgomery's Kids bought her a special accelerator pedal to use with her prosthetic leg. Now, drive she does!"
3. Image `2020/11/boywithcomputer-e1606227354320.jpg` — **Helping a Young Man Move from Foster Care** — "F is a young adult is in the process of exiting the foster care system. He is now between a foster home and a group home. The next step is independence! Donors' support allowed 4Montgomery's Kids to buy him a Chromebook 'bundle' and gave him additional funds to help support the transition. F is hoping to attend Montgomery College in the fall and plans to use the Chromebook for his course work."

Row 3:
4. Image `2020/09/PR-photo.jpg` — **Giving a Gift of Independence** — "E is a young child with mental disabilities who cannot speak clearly or make herself understood. If separated from her family, she can't tell anyone where she lives, her phone number, or other identifying information. Thanks to our contributors, 4Montgomery's Kids has provided her a special medical identification that has given the foster family confidence to give the child more independent experiences while still protecting her safety."
5. Image `2018/03/shutterstock_199303319.jpeg` — **Encouraging Higher Education** — "Six high-performing high school seniors in foster care are receiving 4MontgomeryKids scholarships to support them as they move on to higher education in the fall. Two are going to study nursing, one is going to study early childhood, and the three others are still considering what to study. One of these graduates also received a scholarship from his college; another is overcoming a developmental disability to attend."
6. Image `2020/09/asian-woman-student-tablet-pc-home-people-education-high-school-learning-concept-happy-young-computer-book-notepad-69782503.jpg` — **Staying Connected to High School** — "R is a high school student who recently moved from one foster care placement to another. Then came the pandemic—and with it, online learning. 4Montgomery's Kids purchased a tablet for him so R could attend his new school virtually and get to know his new classmates. With the help of his foster parents, R also is using the tablet for tutoring in Spanish."

Row 4:
7. Image `2020/11/shutterstock_1041248800-scaled.jpg` — **A First Apartment** — "D is a young man moving from a group home to his own apartment—a critical step to provide stability as he looks for employment—and needed money for the deposit so the apartment would be held for him. 4Montgomery's Kids was able to quickly provide deposit funds. Thanks to the support of our donors, the apartment is now his!"
8. Image `2020/09/boy-riding-bicycle-1024x768-1.jpg` — **Providing a Critical Outlet** — "C. is a pre-teen boy with autism who thrives on daily routines. Since the pandemic, though, C. has not been able to go to school or participate in his regular after-school activities. He was having difficulty adjusting — becoming easily agitated, starting arguments, and even destroying things. Contributions to 4Montgomery's Kids have helped to turn this challenging situation around—in the form of a new bicycle! Riding the bike has become a daily activity, helps him get exercise, and is a way for him to release energy when he is upset."
9. Image `2020/11/shutterstock_44597371-scaled.jpg` — **Repairing a Family** — "M is a mother of three young children who were living in a foster home. She was working very hard to reunify the family. Then M's car transmission broke down. She was stranded without a way to get to her job. She was able to borrow some money, but not enough. Through donors' contributions, 4Montgomery's Kids paid for the balance of the repair. As a result, M returned to work, and several months later the children returned home to live with her."

Row 5:
10. Image `2020/11/capandgown.jpg` — **Graduating in Style** — "A is a foster teen who was set to graduate from high school when commencement was cancelled because of the pandemic. The ceremony was rescheduled at the last minute as a virtual event, and seniors were encouraged to "attend" in cap and gown. 4 Montgomery's Kids rented the graduation package and A proudly "received" his diploma—exactly like the rest of his classmates."
11. Image `2021/03/featured_past-due-stamp-on-envelope.jpg` — **Supporting Success** — "N was aging out of foster care and with tuition assistance from 4Montgomery's Kids donors was able to attend cosmetology school. N graduated, got a great job in a salon, and moved into her own apartment. But when the pandemic hit, N's salon closed and she was laid off. The support of our donors enabled 4Montgomery's Kids to pay her rent so she could stay in the apartment."
12. (CTA card, no image) — "These are just a few stories of how, with support from our donors, 4 Montgomery's Kids has been able to help kids in need." / "Make a difference in the life of a child in foster care in Montgomery County." — Button **Donate** → donation form

(Stories are mostly pandemic-era 2020–2021 content.)

---

## 9. PROGRAMS — `/25726-2/`

`<title>`: "Programs | 4 Montgomery's Kids"

### Section 1 — Hero (photo bg `2022/03/shutterstock_539264002-scaled.jpg`, dark overlay)
- Row 1: 2 cols (2/3 + 1/3 empty)
  - H1 "What your money supports"
  - Bullet list (exact):
    - Summer camp fees
    - Computers and schoolbooks
    - Transportation to college classes, jobs, and medical appointments
    - Recreational activities such as soccer and baseball
    - After school programs in dance, art, and music
    - College and technical school scholarships
    - Specialized classes in areas such as nursing, home care and cosmetology
    - Costs for parental visits with their children in foster care
    - Security deposits, rents, and furniture for those aging out of foster care
    - …and much more!
  - Button **About 4Montgomery's Kids** → `/about-us/`

### Section 2 — Specialty section (photo bg `2022/02/left-side-hug.jpg` on left third, light overlay)
- Row 1: 2 cols (1/3 spacer + 2/3 content)
  - H2 "No Request Too Big Or Too Small" + divider
  - Text:
    > Our services range from something as simple as buying a gift card for a birthday that would otherwise be forgotten, to sending a child to summer camp, to subsidizing transportation to get to a job, to paying rent to prevent a young adult from becoming homeless when aging out of Child Welfare.
    >
    > Thanks to the generous contributions of our supporters, 4Montgomery's Kids says "yes!"to virtually all requests made to us by Montgomery County social workers, who know the needs of each child and young person in their caseload.

    > The support that 4Montgomery's Kids provides has played an important role in helping children and young people succeed. We've helped children and youth of all ages, enabling them to do better in school, participate in new activities, and reach goals like learning trades or attending college. But as proud as we are about where our "kids" go when they leave us, our goal is not about where they end up. It is about giving these kids a little bit of normalcy here and now, for those everyday things they otherwise might not get.
  - Button **Learn More** → `/our-stories/`
  - Number counters (animated): **10** — "YEARS SERVING CHILDREN AND YOUTH"; **2852** — "FULFILLED REQUESTS"
    (Note: 2025 posts say the org has passed 10 years — "10" is stale-prone; hard-coded.)

Note: Programs doesn't actually describe named programs (e.g., Boost guaranteed income, Scholarships/Excellence Awards, Project Turkey, Summer Camp) even though the blog does.

---

## 10. BLOG — `/blog-2/` (the one in the nav)

`<title>`: "Blog | 4 Montgomery's Kids"

### Section 1 — Hero (photo bg `2018/03/MontKids1-1024x683.jpg`, dark overlay)
- Row 1: 2 cols — H1 "Blog"; text "News from 4Montgomery's Kids"

### Section 2 — Blog grid module (white)
- Divi Blog module, grid layout, cards = featured image + H2 title + excerpt + "read more"; NO dates or categories shown
- Page 1 shows 20 posts; page 2 (`/blog-2/page/2/`) shows 1 post ("How you can help"); pagination links: "Next Entries »" / "« Older Entries"
- Card order on page 1 is NOT chronological (Divi ordering issue): You Made It Happen → Spring Forward → 10 Years → Spring Arrives → Fall 2020 Update → Thank you! → Over 550 → Get to Know our Social Workers → Donor Spotlight: Diane Burch → Donor Spotlight: Gail Maidenbaum → "Fall" for Kids → We are Thankful for You → How scary must it be… → Donor Spotlight: Ammerman → Workout for Good → Moving to Independence → Foster Children Need Summer Camp Too!! → Fall 2018 Update → Peewee Football Champions → Spring 2018 News
- Several 2025 posts use the favicon (`2022/06/cropped-android-chrome-192x192-1.png`) as the featured image (placeholder look); "Get to Know our Social Workers" and "Fall for Kids" have no image.

### Orphan `/blog/` page (not in nav)
Hero with `2018/03/children-185159_1280-1024x680.jpg` + H1 "Blog"; gray section with a blog grid that shows date + category meta ("Nov 30, 2025 | Uncategorized"). Duplicate of /blog-2/ — candidate for deletion/redirect.

### Post template (all single posts)
Divi layout: spacer row → Post Title module (H1 + meta "by {author} | {date} | {categories}" + featured image) → Post Content → Posts Nav (← previous / next →). No sidebar, no share buttons, no donate CTA, no related posts.

---

## 11. BLOG POSTS — FULL TEXT

(Formatting: **bold** and *italic* as on site; line breaks approximate.)

### 11.1 You Made It Happen: 2,500 Kids Supported and Counting
by Alan Kraut | Nov 30, 2025 | Uncategorized — Featured image `2018/03/4-Montgomerys-Kids-Final.jpg` — Prev: "Fall" for Kids

**Because of you, dear donor, 2025 was a record-breaking year for 4Montgomery's Kids!**

We have supported **over 2,600 children** in foster care since our founding. That milestone is a testament to your generosity and belief in our mission.

Children and families in foster care face needs that County and State funding simply cannot cover. **Won't you help us continue this vital work** with an end-of-year donation?

We provide routine support that creates normalcy and hope, for example:
- **Education:** Special rewards for outstanding academic achievements.
- **Family Connection:** Helping families connect, reunify, and ensuring separated siblings can spend time together.
- **Enrichment:** Paying for after-school music and art classes, as well as sports equipment and team fees.
- **Summer Experiences:** Funding summer camps, including those specializing in care for children with disabilities.
- **Emergency Backstops:** Providing crucial assistance for emergency transportation to jobs and school, and for stop-gap utility or food payments.
- **Milestones:** Funding for prom and graduation outfits, and beautiful quinceañera dresses.
- **Futures:** Up to **$1,000 college and technical school scholarships.**
- **Boost:** For the second year in a row, we are giving $600 per month for one year to youth who have aged out of foster care. With this **Boost**, we aim to ease their transition to young adulthood.

These payments are our foundation, but we also fund critical life-changing 'one-offs:'
- **Project Turkey:** We collaborated on 'Project Turkey' to ensure families involved in Child Welfare enjoy a Thanksgiving dinner filled with comfort and tradition. We **helped 60 families and more than 100 children and youth this year!**
- **The Power of a Pedal:** A young girl lost her leg in an earthquake before coming to America. She then found herself in foster care. Her teenage dream was to drive like her friends. We funded a unique accelerator pedal that fit her prosthetics, giving her independence.
- **A Mother's Determination:** A mother of three was determined to reunify with her children who had been removed from her home. She secured a job, but her plan derailed when her car broke down. We stepped in, paying for a substantial repair. She returned to work, and within months, her children were back in her care.

**These are the moments you make possible. Please donate now to continue our collective good work!**

(No donate button/link in the post itself.)

### 11.2 "Fall" for Kids
by Alan Kraut | Oct 13, 2025 | Uncategorized — no featured image

**What do you do if you're a foster youth stuck in a bus station with no way to get home and no money for food? You call 4Montgomery's Kids.** Within an hour, we had an Uber card on its way.

Or what if you suddenly need transportation to get to a family emergency? Once again, we were able to step in right away.

Most of the time, we turn around requests in less than 24 hours. But this month, these two urgent calls for immediate transportation came in with just one hour's notice. Because of your support, both ended with a positive outcome instead of escalating into a crisis.

Summer and back-to-school time can also bring other challenges for kids in foster care. But this year with your help, we were able to:
- Send eleven kids to summer camp and make it possible for one child to take a trip to Florida with her foster family.
- Provide four computers for schoolwork and to help youth stay connected with siblings and parents.
- Cover transportation needs like car insurance, Uber cards, and Metro passes so kids could get to work or visit family.
- Boost self-confidence with cosmetics and hair supplies for prom and back-to-school.
- Supply sports equipment for camp and school team participation.

We also just wrapped up the first year of our guaranteed income program, **Boost,** and are continuing the program this year, with nine additional young adults who are aging out of foster care. They each will receive $600 a month for a full year—giving them some much-needed financial stability, (or a **boost),** as they take initial steps toward independence.

Our first year recipients have told us:
- "I feel fantastic! I am now employed full time and am very grateful for the opportunity to receive the monthly stipend,"
- the stipend went a long way and even prevented two evictions,
- it provided peace of mind,
- it allowed for a greater opportunity to focus on educational and employment goals.

And finally, looking ahead, we're once again teaming up with the residents of Ingleside in Rockville for Thanksgiving. Together, we'll provide Giant gift cards so families in the child welfare system can celebrate the holiday with a special meal. Last year, we helped 100 families!

We're so grateful to you—our donors and friends—for making all this possible. Every ride, every meal, every camp experience, every boost of confidence happens because of your generosity.

Board of Directors – 4Montgomery's Kids
Cynde Burgess, Ronna Cook, Alan Kraut, Agnes Leshner, Leslie Shedlin

### 11.3 Spring Forward with 4Montgomery's Kids
by Alan Kraut | Aug 7, 2025 | Uncategorized — featured image = favicon placeholder

4Montgomery's Kids has just closed the books on our ninth year, and what a year it has been! We provided resources for over **300** children and we are closing it by awarding scholarships to fifteen students. We could not be more grateful to you, our amazing donors, for making this possible. We hope you will keep us in your gift giving plans.

**Scholarships**

Once again, we at 4MK were thrilled to be able to offer scholarships, ranging from $500 – $1,000, to high school graduates in foster care who are pursuing further education either in college or a trade. This year we were able to give 15 scholarships. Here are just some of the exemplary students we are supporting.
- B completed most of her credits a semester early (earning straight A's!) and used the abbreviated school schedule to gain work experience. She has experienced extensive trauma in her life and wants to become a nurse so she can continue to help others as she has already throughout her life. She plans to work as a Certified Nursing Assistant while she pursues her nursing degree and is training over the summer to make this possible.
- From a very early age, S has had to overcome severe obstacles. He got into trouble but completed treatment and is back on track. While in treatment, he graduated from high school, completing two years of school in eight months. He plans to attend trade school to become a plumber and create a better life for himself.
- G is a straight-A student who has been on honor roll throughout high school and was recently inducted into the National Honor Society. He has been involved with a variety of afterschool programs, including one that focuses on community service and engagement. He plans to major in math, science, or engineering.
- J is the first person in her family to graduate from high school. Not only has she worked almost continuously with tutors and teachers to ensure that she was successful in academics, but she has spent the last two years in activities that build social connections and created more support among her Latino community.
- R has plans to attend college out of state and so will not be eligible for the tuition waiver otherwise available to high school graduates in the child welfare system. Even though she only recently entered foster care with all the life changes that has meant, she nonetheless was able to complete high school on time, get her driver's license, and sought and has held down a job.
- While C was in high school, she managed her own nail business. Her goal is to become a licensed nail technician. The scholarship money will allow her to complete a nail certification program.
- We were also able to assist a deserving young woman with a special high school scholarship. She was accepted into an elite private school known for its rigorous academics, where she also plans to join the track team. She already has had athletic success on a national level. Attending this school is a rare opportunity but a large financial commitment for her foster family. What an honor to be able to help her out.

**For Love of Turtles**

It was one of our more unique requests. First, what do you think of when you think of stress reducing pets? Maybe a service dog? Well for K. who was transitioning out of care *and* moving from a group home to her first apartment *and* starting a new job, it is her treasured four small turtles.

These big steps were exciting but challenging for K, and the turtles helped her get through them. But turtle care – frequent cleaning and maintenance of the tank is critical, along with the use of proper filters – is critical, and it is not cheap! (Who knew?)

Imagine K's delight and relief when 4Montgomery's Kids provided her with the funds to care for her beloved pets.

**Camp**

This time of year brings requests for a variety of after school and summer programs. So far this year – and we expect more requests to come – we are sending twelve children to summer programs and we provided seven children with after school activities. The camp experiences include traditional sleep-away camp, special-needs camps, sports- themed programs and dance camp. We wish them all a fantastic, fun-filled summer.

Beyond the turtle, in this fiscal year, approximately 20% of our grants to children involved education, 11% involved transportation, 15% supported recreational activities, 1% were housing-related, and 53% were for a combination of personal and household needs. Most notably, we were able to fill every request we received – no child or family was denied the assistance they sought. And, it is all due to your generosity.

### 11.4 We are Thankful for You
by Alan Kraut | Aug 7, 2025 | Uncategorized — slug `fall-2023-we-are-thankful-for-you` (content is from Fall 2023, re-dated 2025) — featured image = favicon placeholder

**4MK Excellence Awards for Graduating Seniors**

This year 4MK gave $500 and $1000 grants to deserving graduating seniors in foster care to help launch the next phase of their lives. We have been awed by the creative ways these young adults have used the funds to help fulfill their dreams. Here are a few examples:
- L is taking both college and study skills courses as prerequisites to a nursing degree. Public transportation is limited near her, so she is putting the money toward a first car as an easier way to get to multiple classes.
- J was accepted into an out-of-state university known for its College of Education. She is now a freshman majoring in Early Childhood and is using her funds to lower out of pocket school expenses.
- S is taking a break from school but is now in the process of applying for a technical degree. In the interim she has used her award to invest in her own business.

**Spotlight: Marie Schwartz**

Marie Schwartz retired from Child Welfare Services after 37 years of providing much needed services to the most vulnerable groups in Montgomery County. You would think that kind of dedication over a lifetime would have been enough for anyone. Not for Marie. Marie now lives at Ingleside, a retirement community in Rockville, and for the past two years she has reached out to Ingleside residents for donations to 4MK for Project Turkey. Marie not only made Project Turkey happen but she partnered with 4Montgomery's Kids to expand the reach of her good deeds.

**Project Turkey**

Thanks to the generous support of 51 residents of Ingleside Retirement Community in Rockville, Md, 4MK is providing $100 gift certificates to 72 families to help them create a special Thanksgiving dinner. These are families where the children are being kept in the their homes with intensive support from child and family services, a program designed to help prevent these children from being placed into foster care.

**We wish these families a joyous and bountiful Thanksgiving. Thank you residents of Ingleside and Marie Schwartz for your care and compassion**

Who doesn't love a birthday party, right? Or at least a present on the big day? But too often for children in foster care the special nature of the day is forgotten. We at 4MK cannot let that happen. No one deserves to be forgotten.

Among the many ways we celebrated our kids this year, we provided funds for a birthday party for a child in a hospital, a birthday party and reunion at Dave and Busters for a family's first big event after the child went into foster care, a birthday trip to the movies for a youth and her younger sister, and a party at Sky Zone for a family moving toward reunification.

We also gave gifts to help a teen turning 15 feel accepted and appreciated at her quinceanera, Legos and beach toys for a child moving to a new placement near the ocean, a gift card for a teen who did not receive a gift from her mother or her group home, a basketball jersey and more for a budding athlete, a Spiderman outfit for a huge Spidey fan, and hair extensions to make a young woman feel special on her special day. We even gave a gift card to a youth in foster care to buy a birthday present for a friend.

After all, who doesn't love a good birthday!!

Please help us celebrate more children in foster care!!!

### 11.5 10 Years of Helping Children
by Alan Kraut | Aug 7, 2025 | Uncategorized — featured image = favicon placeholder; inline image `2025/08/unnamed-300x185.png`

**TEN YEARS!!!** It's hard to believe it has been 10 years of 4Montgomery's Kids providing the children in Montgomery County's foster care system with things no one else could pay for**.** We helped **more than 2,000 children and youth** over those ten years by providing things like gifts for birthdays that might have been forgotten, paying for summer camps and after-school activities, furnishing apartments and assisting with rent, rewarding major accomplishments, helping families reunite, and so much more.

n our first year, we could only afford to help 36 children; by our tenth year, that number soared to an astonishing 364! All while ensuring that **100% of your donations** go directly to helping those children, teens, and young adults who are the most vulnerable among us. ("n" = missing "I")

[image]

In 2017, we expanded to giving partial scholarships to those going on to college or trade school. Since then, we've awarded 48 scholarships, increasing from just two in 2017 to an impressive 15 in 2023.

And we kept at it when the nation was hit by a pandemic. As our amazing county social workers continued to stay in touch with these children, 4Montgomery's Kids bought them laptops, books, school supplies, and more so they could stay connected to school.

Thanks to you, our generous donors, we have been able to better meet the needs of these children each year. In the beginning, we had to limit our grants to a maximum of $250 each. Today, we fund every deserving request we get.

As social workers have told us:

*"4MK provides social workers with a rare opportunity to say 'yes' to needs that enhance a child's well-being in a tangible way."*

*"My work (and all of Child Welfare Services) is so much better because of 4MK!"*

But we have more work to do. So long as children remain in foster care, their needs will persist. The power to make a difference lies in your hands. Let's keep the momentum going! Please give generously and here's to the next 10 years of hope and change!

### 11.6 How scary must it be to have to leave foster care at age 21?
by Alan Kraut | Aug 7, 2025 | Uncategorized — featured image = favicon placeholder

*You have been in foster care for years – removed from your biological family because of abuse and neglect. You've rotated through multiple placements, through group homes and residential treatment centers. Suddenly you find yourself out at 21 with only the support you can muster on your own.*

That was true for some of the most vulnerable kids who aged out of foster care in Montgomery County last year**. This time we at 4Montgomery's Kids were there to help.**

Research shows that abruptly ending support on a 21st birthday abandons young people just when they need critical assistance. It ignores threats of homelessness, cuts education when many are still in school, disrupts mental health services for those coping with histories of trauma and abuse, and plunges a young parent and their children into poverty.

Using this research, and after talking with experts at the University of Pennsylvania, in Los Angeles, and colleagues in Prince George's County, **4Montgomery's Kids embarked on a Pilot Guaranteed Income Program**. Nine youth were identified to receive $600 a month for one year – no strings attached.

Those identified were initially interviewed about their working, living, educational, and emotional states. They will be interviewed again at 6 and 12 months to see if the money has made a difference in their lives.

Throughout the year, we'll partner with **Empowering the Ages** to provide mentorship. Empowering the Ages, another Montgomery County nonprofit, will work with our nine on getting county services, applying and interviewing for jobs, and basics like getting a checking account and keeping track of spending.

We will report what we find to you, our donors. But already one young woman has said our funding has prevented an eviction, gotten her job training, and put her in a full-time job. She reports, "I feel amazing!"

**Our pilot is being funded solely by the 4MK board**. Since the program goes beyond anything we've ever asked of you, we felt it was important not to spend your funds before we told you about it.

Now you know!! Know, too, that **our program is one of only three we could find anywhere devoted exclusively to those aging out of foster care**.

**We hope to continue and even expand our Guaranteed Income Program. For that, we need your support.** You have been so generous to 4MK in the past. We know you will generously support this new program, as well.[1]

[1] *Of course we are also staying true to our core mission. The approaching end of the school year will mean sending kids to summer camp and our annual scholarships for deserving graduates who are attending college and trade schools. But that and more is for our next newsletter.*

### 11.7 Spring Arrives for Children in Foster Care
by kd44montkids | Sep 1, 2022 | Uncategorized — featured image `2022/09/spring-arrives.jpg`

What if a baseball bat wasn't just a baseball bat? What if it was a chance to get involved in a new community and new school after your father passed away and you recently moved? What if it was an opportunity to be part of a healthy, fun sport where you could learn valuable life skills and make new friends? And what if you were too tall to use your teammates' bats? That's when a bat is more than a bat and what a new baseball bat meant to JR, one of our children in foster care who went through a terrible winter.

But baseball also means that spring is finally here after this long hard year. For the children, teenagers, and young adults that 4Montgomery's Kids serves, it means a return to school, sports, summer camp, and employment. As for JR, it may mean new beginnings and a return to a more normal way of life.

Things have been exceptionally tough for children in the foster care system. Between July 2020 and March 2021, there were almost 7,000 calls to Montgomery County's Child Welfare to report child abuse and neglect. The average number of children and youth in foster care is 435 each month. In addition, 110 children remain with their biological families but are being monitored by social workers. There is also concern that because most children have not been in school an important source of identifying children being mistreated has been missing. At the same time, young adults who are aging out of Child Welfare are unable to find jobs to cover housing and other expenses.

Thanks to our generous donors, 4MK has been able to quickly and fully respond to every request we have received this past year! From families experiencing food insecurity to students needing laptops, to young adults unable to pay rent, and, yes, to a baseball bat for JR. In the words of one of our donors, 4MK has kept "these kids in the forefront during this tragic time for our country" and it's only through your help we have been able to do it.

### 11.8 Donor Spotlight: the Ammerman Family Foundation
by kd44montkids | Aug 25, 2021 | Uncategorized — featured image `2020/11/Joy-Ammerman.jpg`

Joy Ammerman is a long-time resident of Montgomery County where she raised her three children and taught school. She manages the Ammerman Family Foundation to give back to the community that has been so good to her family.

In deciding what organizations to support Joy often looks to her children for suggestions. Her daughter-in-law attended our Zoom Workout fundraiser and told Joy about "this organization that provides money to youth aging out of foster care." She chose to make a generous contribution earmarked to helping these young adults. With Joy's gift, we will have supported fifteen foster youth who are aging out by paying for furnishings, professional work clothes, tuition, loan repayment, auto expenses, transportation, groceries, computers, and more.

Joy feels rewarded by the thought that her contribution will make a difference right here in Montgomery County. She hopes through her gift and the example she set that someday the young adults she is supporting will be able to give back as well. (Thank you, Joy!)

**Without you, our donors, we could not continue to help the children and young adults who continue to face great difficulties as they try to overcome the trauma from child abuse and neglect. So please, now more than ever, help us help our community.**

### 11.9 Fall 2020 Update
by kd44montkids | Nov 19, 2020 | News, Success Stories, What your money supports — featured image `2020/11/N.jpg`; inline images `2020/11/N.jpg` (alt "N"), `2020/11/J.jpg` (alt "J")

We are living in a difficult time, one that has forced all of us to rearrange our lives. Children and their families in Montgomery County's Child Welfare System have been particularly hard hit. In September there were 436 children in foster care in the county. Additionally, there are children receiving services in 95 homes where, despite a finding of abuse and neglect, the situation was not deemed serious enough to place the children into foster care.

The 4MK board continues to partner with social workers in Child Welfare to help. We have been concentrating on families and, particularly, on older foster youth as they move ahead with their lives. The state of Maryland also is focusing on the hardships these young adults face. Maryland is now allowing them to stay in the foster care system for an extra six months, even when they would have aged out at twenty one. This will affect eleven young adults. But so many of them still need services, including help with rent, support for transportation to school and jobs, and money for basic living needs, and we can help with some of these.

Here are just a handful of requests Montgomery County social workers asked us to fill in the last six months. We were able to fill all of them because of your support:

Helping with housing costs for ten older youth moving into their first apartments
- Purchasing fourteen Chromebooks to assist with online learning
- Awarding nine college scholarships for youth graduating from high school
- Paying for transportation so a mother could visit her daughter in preparation for reunification
- Buying a large dining room table for an aunt who had four foster kids placed with her in addition to her own already large family. Now they can all eat together
- Purchasing bunk beds for four children who now live with relatives after they were removed from their parents' home
- Providing special camps and gym activities for foster children whose camps were closed due to Covid-19

Let us introduce to you some young people your contributions have helped:

N is a young woman just leaving the foster care system. She loves graphic design and is a self-taught artist. Her designs for filters were recently accepted by Instagram. 4MK, through your donations, bought her a MacBook, the key tool she needs to pursue both her education and her passion for graphic art.

J is a kind and resilient young person preparing to move into her first apartment. She has completed two semesters at Montgomery College in addition to having finished her Certified Nursing Assistant (CNA) degree. She currently is focused on working and saving money. With your contributions, 4MK helped pay her rent, and J now is managing her expenses and looking forward to being on her own.

And here is how L expressed her thanks for 4MK:

"*I am a youth in foster care and I had the support of 4Montgomery's Kids. They helped me when I was pregnant and needed baby supplies. I am thankful because I was not working because of COVID, and did not have anything for my baby. They helped me a lot.*"

### 11.10 Workout for Good
by kd44montkids | Nov 17, 2020 | Donor Spotlight, Success Stories — featured image `2020/11/workout-for-good-pic.png`

**Workout for Good**

What an amazing evening.

On September 22, 2020, in the midst of a global pandemic, we hosted a virtual exercise class, led by one of the premier trainers in the DMV, Jennifer Blackburn. Forty five minutes of heart pumping exercise was preceded by a presentation from two former foster youth who have aged out of the child welfare system but were the beneficiaries of assistance from 4Montgomery's Kids. One of the speakers who just graduated from medical school discussed how she was able to concentrate on taking her medical exams knowing that we were there to help her out. The other speaker told us how she was able to get to school and her job when we helped pay for her parking and her car repairs.

We never imagined that with all the chaos in the world our donors, new and old, would come together to make this one of our most successful fundraisers ever. More than 80 people took part in this virtual event. It is not too late to do even more!!

### 11.11 Thank you!
by kd44montkids | Dec 13, 2019 | Success Stories, What your money supports — featured image `2019/12/thank-you-lettering_1262-6963.jpg` (note: content is about the COVID pandemic but dated Dec 2019)

For over five years now and with the generous support of donors like you – THANK YOU SO MUCH! – 4 Montgomery's Kids has helped close to 700 foster kids in the county's Child Welfare System. But today these kids are more vulnerable than ever. Their schools, from elementary to college, are closed. They can't participate in any of their favorite activities. They are even more uncertain about their futures than they ever were. While this is true of all the children in the county, children and youth in foster care are often in particularly precarious situations during this pandemic.

Our wonderful social workers are working remotely, still protecting children. We are working with them to be as responsive as we can to their requests for help. Here are just a few recent ones we have answered. We've:

– bought grocery store cards to help those having trouble getting food since many families are not working
– provided a laptop for a child who moved from one foster home to another in the midst of all this; she needed the laptop to keep up with schoolwork and her computer was at her old school
– helped cover rent for a youth who is aging out of foster care and lost her job at a hair salon when it closed down
– helped a mother whose car broke down going to work; we paid to get her car fixed after the mechanic gave a reduced rate
– bought Metro cards, including one for a young woman who works as a nursing assistant but doesn't have enough money to pay for rent, food, and transportation
– sent in deposits for children who want to go to camp this summer to hold their places until we find out if the camp will open

Sure, the past few weeks have been challenging for all of us, but foster kids are among the most vulnerable among us. Thank you to all who gave gifts to 4Montogmerys Kids so that we could help during this particularly difficult time

### 11.12 Moving to Independence
by kd44montkids | Dec 5, 2019 | Success Stories — featured image `2019/12/CarsonVideopicture.jpg`

A high priority for 4MK has been helping youth move towards independence. Each year, with the assistance of Montgomery County social workers, we offer scholarships to a few students who are moving on to higher education after high school. This year, Kayla and Carson were selected and received their awards at the annual foster care family picnic.

Carson is going to community college and is interested in studying information technology. Kayla will be studying nursing.

While both Carson and Kayla will have their tuition covered by federal and state funds, no money was provided for transportation, books, and all the other extra expenses that go with this next stage of life. Without our funds, the full college experience would have been out of reach for these young people. As you can see from the video, Carson and Kayla greatly appreciated our support. We wish them so much luck in this next step in their adventures.

[YouTube embed: https://www.youtube.com/embed/SdGjQlQfNbU]
[YouTube embed: https://www.youtube.com/embed/kGPDdpDPDSw]

### 11.13 Over 550 in 5 years!
by kd44montkids | Nov 27, 2019 | News — featured image `2019/11/graph-of-funding-breakdown.png`

**More than 550 in less than five years!** That is how many children and youth have been helped by 4Montgomery's Kids (4MK) and we can't thank you enough! In 2015, 4Montgomery's Kids began this incredible journey of helping Montgomery County's neediest children and youth receive the goods and services other children get. 4MK provides funding for:
- extracurricular activities such as summer camp, gym memberships, art classes and sports;
- educational support including books, computers and tuition;
- assistance with rent, security deposits and furniture for youth transitioning out of foster care;
- help with transportation, including gas cards, metro cards, drivers education and car repairs;
- job support with the focus on vocational training, uniforms and work clothes;
- other targeted areas such as gift cards for special occasions, prom attire, clothing and family support.

The graph is a breakdown of the way your funds have been allocated.

### 11.14 Foster Children Need Summer Camp Too!!
by kd44montkids | Apr 8, 2019 | Success Stories, What your money supports — featured image `2019/04/campphoto.png`; inline image hot-linked from a Gmail proxy (googleusercontent.com → nfg-dm-production S3) — fragile

We are particularly excited to be sending more than 35 children to summer camp this year. Summer camp can change a child's life in so many ways. As a social worker told us:

*"this young lady had a number of issues, including an inability to make friends. She went to camp, gained confidence, tried new activities, made friends and her mother reported that she came home a completely different kid and, subsequently did extremely well in school in the fall, had a group of friends, and the family has not been involved with CWS again."*

If camp can do this for one child, imagine what if can do for thirty-five. With your help we can sponsor even more.

### 11.15 Get to Know our Social Workers
by kd44montkids | Nov 6, 2018 | News — no featured image

This month we are saluting the social workers in the Transitioning Youth Services Unit, headed by Shari Zouhairi. These social workers develop and implement plans for youth who must leave the Child Welfare system at age twenty-one. The youth they work with have some of the greatest challenges facing children in the child welfare system. The workers in this unit help these young people navigate among other things finding jobs, affordable housing and higher education. They often ask 4MK to support these youth by providing money for housing deposits, transportation expenses, clothing for interviews, and books and laptops for school.

Most recently a social worker from this unit asked 4MK to help with the security deposit for a girl who is aging out of the system. The girl was working and could pay the monthly rent but did not have the outlay for the security deposit. Keeping this girl from homelessness is but one of the miracles performed by the amazing workers in this unit.

Our hats are off to these dedicated workers who work so hard to help put these young people on the path to a successful future. It is our great pleasure to help them do their jobs.

### 11.16 Fall 2018 Update
by kd44montkids | Nov 5, 2018 | News — featured image `2018/03/logosquare.png`; several inline images and emoji hot-linked from Gmail proxy URLs (pasted from an email newsletter) — fragile

"I want to thank you all at Montgomery Kids for all the help. When I was down on the floor, you all came to help and stretched your hand."

These are the words of a young person we have helped . There are over 400 children who have been removed from their homes because of child abuse and neglect. These children suffer trauma from the circumstances that led to foster care. They are grieving for the home and people they left. They are the focus of our work
**4Montgomery's Kids** (formerly Montgomery's Kids) is a local nonprofit agency that helps Montgomery County's most vulnerable children and youth. 4MK supplements what children who have experienced abuse and neglect, those in the Child Welfare system, receive from the state and county services. Resources we provide help normalize a child's life experiences, and help youth transitioning out of foster care find housing, jobs, and other resources. We help create a brighter future for these children.

**We need your help to continue this work**

[image]

**A few of those young people wrote:** "I just wanted to thank you Montgomery's Kids. I appreciated everything. If it was not for you guys helping me with the cost for Certified Medication Technician (CMT), I wouldn't have my current job. I appreciate it sincerely. Y'all are the best!"

"Through the 4Montgomery Kids Program, I received funding for meals when I served as a Student Page for the Maryland General Assembly in Annapolis. Thank you 4Montgomery Kids for your generosity to youth in foster care." 🍔🍟🍕🌮

[image]

"Thank you so very much for helping me out with school and buying me a laptop. I'm a college student and it's very much appreciated. " 💻🖥🖨

From July 2017 to July 2018 (our last fiscal year) 4MK provided assistance to 122 children. Since July, we have helped an additional 45 children. We supplemented their educations with college books, computers and money for extracurricular activities. This summer we sent 40 children to summer camp. Young people transitioning out of foster care received security deposits, furniture, food, gift cards, and work clothes.

**Social workers also have told us how children benefit greatly from the opportunities and services you helped us provide.**
"I am so thankful for Montgomery's Kids who has poured out opportunity time and time again for current and former youth in foster care to succeed toward self-sufficiency. They have blessed youth with financial support for higher education pathway for college/vocational training, housing and employment stability, and personal health care. Personally, it has been especially challenging to locate funds for emancipated youth; however, Montgomery's Kids has been a tremendous source of help and hope when the need arises. The state needs more organization like them."

[image]

"Providing assistance for "things" has enabled many of my clients to achieve a sense of normalcy in their anything but normal lives. 4Montgomery Kids paid for a parking pass at University of Maryland while one of my clients was a student commuter, bought a new Ipad for a hearing impaired client and purchased gym memberships for several of my clients — and that's just a few ways 4Montgomery kids helps make a difference in one life at a time!!!"

### 11.17 Donor Spotlight: Diane Burch
by kd44montkids | Nov 5, 2018 | Donor Spotlight — featured image `2018/11/DianeB.jpg`

**Diane Burch** is the owner of a small business in Montgomery County. She cares deeply about its residents, particularly the four-legged ones. While Diane has been a consistent donor to 4Montgomery's Kids, she has also been a major supporter. Diane has trumpeted the cause to her clients and friends who have gone on to become supporters in their own right. She has truly shown how members of a community can come together to become a greater force. Thank you Diane, for increasing the size of your contributions by personal advocacy.

### 11.18 Peewee Football Champions
by kd44montkids | Apr 10, 2018 | Success Stories — featured image `2018/03/kid-49252_1280.jpeg`; inline image via Gmail proxy

The peewee football team that Jeff, a nine year old boy played on, was going to the national championships in Florida. Jeff's foster parent was unable to afford the cost of this trip and he would have been unable to accompany his team,Due to your generous contributions, 4Montgomery's Kids was able to pay for his trip and they won the national championship. In his words, "Thank you 4Montgomery's Kids!!! We could not have done this without you!!!"

[image]

As always, we thank you our supporters for making our work possible. All the money you contribute goes directly towards helping the children as all administrative costs of 4Montgomery's Kids are absorbed by our board members. We look forward to telling you about additionalexciting ways your money has helped and to doubling our efforts in the upcoming year. Please, spread the word about our work and encourage others to support us with donations and house parties where we can bring youth to talk to you about their experiences and how 4Montgomery's Kids has helped them.

### 11.19 Donor Spotlight: Gail Maidenbaum
by kd44montkids | Apr 10, 2018 | Donor Spotlight — featured image `2019/12/GailMaidenbaum.jpg`

As a Montgomery County mother and a Montgomery County employer, Gail Maidenbaum feels a dual obligation to the foster kids in our county. Her belief is that "we have to take care of our own" and these kids are the responsibility of all county residents and companies. She realizes that these kids are at school with the rest of the county children, but they lack what many of the other students take for granted. The ability to have a laptop, a Metro card to go to work, to take a ballet class, to go to summer camp – these opportunities should be available to all "our kids". That's why she has chosen to give back to her county by generously supporting 4Montgomery's Kids.

### 11.20 Spring 2018 News
by kd44montkids | Apr 10, 2018 | News — featured image `2018/03/shutterstock_199303319.jpeg`

Spring is here and with it comes our new name, 4Montgomery's Kids. All your generous support goes for the children and youth in our county who have been abused and neglected.

Spring also brings news of our efforts during the past few months. We do this though our wonderful partnership with the amazing County's Child Protective Services (CWS) social workers who have been passionate advocates for the children with whom they work, and of course you our wonderful donors.

**Summer Camp**
We are particularly excited to be sending more than 35 children to summer camp this year. Summer camp can change a child's life in so many ways. As a social worker told us: *"this young lady had a number of issues, including an inability to make friends. She went to camp, gained confidence, tried new activities, made friends and her mother reported that she came home a completely different kid and, subsequently did extremely well in school in the fall, had a group of friends, and the family has not been involved with CWS again."*

If camp can do this for one child, imagine what if can do for thirty-five. With your help we can sponsor even more.

**New Projects**
In addition to our ongoing efforts such as funding transportation for a parent living out of state to visit her children, books for college classes, a costume for dance class and gift cards for food for a youth living on his own who was going hungry, we are pleased to announce our new ventures.

• Together with the [Jewish Council for Aging](https://accessjca.org/) and other community partners we are exploring housing in Montgomery County for young people transitioning out of foster care at age 21. The high cost of rent in the county makes it extremely hard for these youth to find local housing. Our dream is to establish intergenerational housing where young people and seniors can live side by side and assist each other.

• We are partnering with [Interfaith Works](https://www.iworksmc.org/) to provide mentors to youth transitioning out of foster care. Mentors work with these youth to provide guidance and to help them develop the skills they need to live on their own. If you would like to be a mentor please contact us at info@4montgomeryskids.org.

### 11.21 How you can help
by kd44montkids | Oct 10, 2017 | What your money supports — featured image `2018/03/jumping-rope-square.jpg`

Many children in Montgomery County need help – as of the beginning of March there were over 500 children eligible to be served by Montgomery's Kids. The key to Montgomery's Kids success is our desire and ability to help these children who have been abused and neglected and have different experiences than their friends and classmates. We want these children to have "normal" experiences. Through our efforts we are enhancing the quality of life for many of these children. Your dollars can help us do this.

How does your donation make a difference in the our community:
$100 helps provide transportation for a child going to summer camp
$150 helps provide tutoring for youth who has not done well in school this semester
$150 helps provide community pool membership
$200 helps provide books and new clothes for children at the beginning of the school year

We need to grow and we need your help to do it. Please share this newsletter with friends who might help us support these children and youth. Encourage them to check our website and send us their emails to montgomeryskids@montgomeryskids.org so we can share more of our needs and our great success stories.

(Old email domain montgomeryskids.org — likely dead.)

---

## 12. External Donation Page — `https://secure.4montgomeryskids.org/forms/donations`

Separate hosted form (not WordPress). Layout: full-bleed photo bg (child in football helmet holding a basketball), logo top-left, multi-step form card on the left, mission card on the right.
- Step 1 "AMOUNT": toggle **Donate Once** / **Donate Monthly**; preset amounts $50, $100, $250, $500, $1,000, Other Amount; checkbox "In honor or memory of (optional)"; green **Next** button; "We never sell your information. Privacy Policy" + "Secure"
- Right card: "MAKE A DIFFERENCE IN THE LIFE OF A CHILD IN FOSTER CARE IN MONTGOMERY COUNTY" / "Our Mission" / "To improve the lives of abused and neglected children by providing opportunities and services they otherwise might not receive."
- Footer: "4Montgomerys Kids / www.4montgomeryskids.org / P.O.Box 34864 / 10421 Motor City Drive / Bethesda, MD 20817-9995" / Privacy Statement | Terms of Service
- Uses green (#4CAF50-ish) buttons — doesn't match the main site's yellow #FFB400.

---

## 13. Known Issues & Improvement Opportunities (found during sweep)

Broken / wrong links
- Home slider slide 3 "Donate" button → `#` (dead)
- Home slider slide 2 "Donate" → old `4montgomeryskids.networkforgood.com`
- About "View Our Stories" button → `/` instead of `/our-stories/`
- "Follow us on Facebook" on Home is not visibly a link; no social icons anywhere (Facebook: https://www.facebook.com/4montgomeryskids)
- Old email addresses in posts (montgomeryskids@montgomeryskids.org, info@4montgomeryskids.org) — confirm which are live
- Inline images in 2018–2019 posts are hot-linked from Gmail proxy URLs (ci3/ci5/ci6.googleusercontent.com) — will eventually break

Content accuracy / consistency
- Impact numbers conflict: "over 2,800 kids" (Home) vs "2852 fulfilled requests" + "10 years" counters (Programs) vs "2,500 Kids" title / "over 2,600 children" body (Nov 2025 post)
- Address conflict: footer "10421Westlake Drive" vs About/donation form "10421 Motor City Drive"; footer © year 2022
- Home slider slide 3 title "Fulfilling a Young Girl's Dream to Drive" has the tablet/R story text
- "Norah Roberts Foundation" (should be Nora); "The Phase Foundation" is text-only in an H1
- Typos: "wefare" (Ronna Cook bio), "n our first year" (10 Years post), "4Montogmerys Kids", "additionalexciting", "team,Due", "says "yes!"to", "or Board Chair" spacing on About, "Kidssuccess" / "over500" in How you can help excerpt
- About quote missing opening quotation mark
- Several 2025 posts are re-dated older newsletters (e.g., "fall-2023" slug dated Aug 2025; "Thank you!" is pandemic content dated Dec 2019)
- Board members Alan Kraut and Cynde Burgess have no titles; empty third column in board row 2

Structure / UX
- Programs URL is `/25726-2/`; old `/blog/` duplicate and empty `/overview/` page still published
- Homepage has no H1; Our Stories uses H3 as the page title; heading hierarchy inconsistent (H1 used for partner name)
- Empty Divi rows/sections (Home section 6, Home partners row 6 with 5 empty columns, empty text modules)
- DONATE in nav isn't styled as a button; donation form styling (green) doesn't match site (yellow)
- Blog listing: not chronological, no dates, favicon used as featured image on 4 posts, all recent posts "Uncategorized", author byline shows username "kd44montkids"
- No meta descriptions / OG images; homepage title has trailing "|"
- All content images lack alt text (except board photos)
- Nothing on the site describes named programs that the blog mentions: **Boost** guaranteed income ($600/mo for 1 year to youth aging out), **Scholarships / 4MK Excellence Awards** ($500–$1,000), **Project Turkey** (Thanksgiving gift cards with Ingleside residents), **Summer Camp**, emergency transportation
- No contact page/form, no newsletter signup, no volunteer/mentor info, no financial transparency page (despite Candid Platinum seal and "100% of donations go to kids / board absorbs admin costs" messaging)
- Stories/testimonials largely from 2018–2021 (pandemic-era)

Key messages worth preserving in a redesign
- Mission: "To improve the lives of abused and neglected children by providing opportunities and services they otherwise might not receive."
- Tagline-ish: "One child at a time, we provide hope, help restore dignity and increase self-esteem." / "A need to some is only a dream when it's out of reach." / "No Request Too Big Or Too Small"
- Model: works directly with Montgomery County social workers, who submit requests; says "yes" to virtually every request, usually within 24 hours
- 100% of donations go to kids; admin costs covered by the all-volunteer board
- 501(c)(3), founded 2015, Bethesda MD, P.O. Box 34864
