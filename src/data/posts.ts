// All 21 blog posts, full text, transcribed verbatim from docs/site-audit.md
// §11 (with the §12 content fixes applied: byline "kd44montkids" ->
// "4Montgomery's Kids" except posts bylined "Alan Kraut" which keep his
// name; typo fixes "n our first year" -> "In our first year", "4Montogmerys
// Kids" -> "4Montgomery's Kids", "additionalexciting" -> "additional
// exciting", "team,Due" -> "team. Due", "what if can do" -> "what it can
// do" (both occurrences), "in the their homes" -> "in their homes", "in
// the our community" -> "in our community"). Old org emails
// (montgomeryskids@montgomeryskids.org, info@4montgomeryskids.org) are kept
// as plain text, never links. Numbers are left exactly as originally
// stated per post -- the 2,500 (title) vs 2,600 (body) vs 2,800 (Home) vs
// 2,852 (Programs) discrepancies are NOT reconciled; see README.
//
// Inline images that were hot-linked from Gmail-proxy URLs in the
// 2018-2019 posts are dropped (fragile off-site URLs); where the
// surrounding sentence still reads naturally without them the "[image]"
// slot is simply omitted. The "Over 550 in 5 years!" funding graph image
// is unavailable, so its content is rendered as the bullet list already
// in the post plus a short footnote.
//
// Cover images: only one post has a table-confirmed real photo in
// public/images/ -- "Peewee Football Champions" (peewee-football.jpg,
// explicitly listed in the build-prompt §4 mapping table as this post's
// cover). "How you can help" originally used `jumping-rope-square.jpg`,
// which is NOT itself in the mapping table -- the table only assigns the
// similarly-themed `double-dutch.jpg` (source `Jumping-rope-wide.jpg`) to
// the Home impact section and the About hero background, never to this
// post. That would have been a two-hop inference, not a confirmed match,
// so this post uses `iconForCover` like every other unconfirmed post
// instead of shipping an unverified photo assignment. Every other
// post either had no featured image, or one WordPress used a stock/email
// asset we don't have (or the favicon, which we never use as a cover) --
// those get `iconForCover` for the IllustratedCover component instead.

export type PostBlock =
  | { type: "p"; text: string /* inline **bold** / *italic* markup, rendered by a tiny inline renderer, not dangerouslySetInnerHTML */ }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "video"; youtubeId: string }
  | { type: "image"; src: string; alt: string }
  | { type: "footnote"; text: string };

export interface Post {
  slug: string;
  year: string;
  month: string;
  date: string; // ISO
  title: string;
  author: string;
  categories: string[];
  cover?: string;
  iconForCover?: string; // lucide icon name, used by IllustratedCover when cover is absent
  excerpt: string;
  body: PostBlock[];
}

export const posts: Post[] = [
  {
    slug: "you-made-it-happen-2500-kids-supported-and-counting",
    year: "2025",
    month: "11",
    date: "2025-11-30",
    title: "You Made It Happen: 2,500 Kids Supported and Counting",
    author: "Alan Kraut",
    categories: ["What your money supports"],
    iconForCover: "HeartHandshake",
    excerpt:
      "Because of you, dear donor, 2025 was a record-breaking year for 4Montgomery's Kids!",
    body: [
      {
        type: "p",
        text: "**Because of you, dear donor, 2025 was a record-breaking year for 4Montgomery's Kids!**",
      },
      {
        type: "p",
        text: "We have supported **over 2,600 children** in foster care since our founding. That milestone is a testament to your generosity and belief in our mission.",
      },
      {
        type: "p",
        text: "Children and families in foster care face needs that County and State funding simply cannot cover. **Won't you help us continue this vital work** with an end-of-year donation?",
      },
      {
        type: "p",
        text: "We provide routine support that creates normalcy and hope, for example:",
      },
      {
        type: "ul",
        items: [
          "**Education:** Special rewards for outstanding academic achievements.",
          "**Family Connection:** Helping families connect, reunify, and ensuring separated siblings can spend time together.",
          "**Enrichment:** Paying for after-school music and art classes, as well as sports equipment and team fees.",
          "**Summer Experiences:** Funding summer camps, including those specializing in care for children with disabilities.",
          "**Emergency Backstops:** Providing crucial assistance for emergency transportation to jobs and school, and for stop-gap utility or food payments.",
          "**Milestones:** Funding for prom and graduation outfits, and beautiful quinceañera dresses.",
          "**Futures:** Up to **$1,000 college and technical school scholarships.**",
          "**Boost:** For the second year in a row, we are giving $600 per month for one year to youth who have aged out of foster care. With this **Boost**, we aim to ease their transition to young adulthood.",
        ],
      },
      {
        type: "p",
        text: "These payments are our foundation, but we also fund critical life-changing 'one-offs:'",
      },
      {
        type: "ul",
        items: [
          "**Project Turkey:** We collaborated on 'Project Turkey' to ensure families involved in Child Welfare enjoy a Thanksgiving dinner filled with comfort and tradition. We **helped 60 families and more than 100 children and youth this year!**",
          "**The Power of a Pedal:** A young girl lost her leg in an earthquake before coming to America. She then found herself in foster care. Her teenage dream was to drive like her friends. We funded a unique accelerator pedal that fit her prosthetics, giving her independence.",
          "**A Mother's Determination:** A mother of three was determined to reunify with her children who had been removed from her home. She secured a job, but her plan derailed when her car broke down. We stepped in, paying for a substantial repair. She returned to work, and within months, her children were back in her care.",
        ],
      },
      {
        type: "p",
        text: "**These are the moments you make possible. Please donate now to continue our collective good work!**",
      },
    ],
  },
  {
    slug: "fall-for-kids",
    year: "2025",
    month: "10",
    date: "2025-10-13",
    title: "\"Fall\" for Kids",
    author: "Alan Kraut",
    categories: ["What your money supports"],
    iconForCover: "Car",
    excerpt:
      "What do you do if you're a foster youth stuck in a bus station with no way to get home and no money for food? You call 4Montgomery's Kids.",
    body: [
      {
        type: "p",
        text: "**What do you do if you're a foster youth stuck in a bus station with no way to get home and no money for food? You call 4Montgomery's Kids.** Within an hour, we had an Uber card on its way.",
      },
      {
        type: "p",
        text: "Or what if you suddenly need transportation to get to a family emergency? Once again, we were able to step in right away.",
      },
      {
        type: "p",
        text: "Most of the time, we turn around requests in less than 24 hours. But this month, these two urgent calls for immediate transportation came in with just one hour's notice. Because of your support, both ended with a positive outcome instead of escalating into a crisis.",
      },
      {
        type: "p",
        text: "Summer and back-to-school time can also bring other challenges for kids in foster care. But this year with your help, we were able to:",
      },
      {
        type: "ul",
        items: [
          "Send eleven kids to summer camp and make it possible for one child to take a trip to Florida with her foster family.",
          "Provide four computers for schoolwork and to help youth stay connected with siblings and parents.",
          "Cover transportation needs like car insurance, Uber cards, and Metro passes so kids could get to work or visit family.",
          "Boost self-confidence with cosmetics and hair supplies for prom and back-to-school.",
          "Supply sports equipment for camp and school team participation.",
        ],
      },
      {
        type: "p",
        text: "We also just wrapped up the first year of our guaranteed income program, **Boost,** and are continuing the program this year, with nine additional young adults who are aging out of foster care. They each will receive $600 a month for a full year—giving them some much-needed financial stability, (or a **boost),** as they take initial steps toward independence.",
      },
      { type: "p", text: "Our first year recipients have told us:" },
      {
        type: "ul",
        items: [
          "\"I feel fantastic! I am now employed full time and am very grateful for the opportunity to receive the monthly stipend,\"",
          "the stipend went a long way and even prevented two evictions,",
          "it provided peace of mind,",
          "it allowed for a greater opportunity to focus on educational and employment goals.",
        ],
      },
      {
        type: "p",
        text: "And finally, looking ahead, we're once again teaming up with the residents of Ingleside in Rockville for Thanksgiving. Together, we'll provide Giant gift cards so families in the child welfare system can celebrate the holiday with a special meal. Last year, we helped 100 families!",
      },
      {
        type: "p",
        text: "We're so grateful to you—our donors and friends—for making all this possible. Every ride, every meal, every camp experience, every boost of confidence happens because of your generosity.",
      },
      { type: "p", text: "Board of Directors – 4Montgomery's Kids" },
      {
        type: "p",
        text: "Cynde Burgess, Ronna Cook, Alan Kraut, Agnes Leshner, Leslie Shedlin",
      },
    ],
  },
  {
    slug: "spring-forward-with-4montgomerys-kids",
    year: "2025",
    month: "08",
    date: "2025-08-07",
    title: "Spring Forward with 4Montgomery's Kids",
    author: "Alan Kraut",
    categories: ["Success Stories"],
    iconForCover: "GraduationCap",
    excerpt:
      "4Montgomery's Kids has just closed the books on our ninth year, and what a year it has been!",
    body: [
      {
        type: "p",
        text: "4Montgomery's Kids has just closed the books on our ninth year, and what a year it has been! We provided resources for over **300** children and we are closing it by awarding scholarships to fifteen students. We could not be more grateful to you, our amazing donors, for making this possible. We hope you will keep us in your gift giving plans.",
      },
      { type: "h3", text: "Scholarships" },
      {
        type: "p",
        text: "Once again, we at 4MK were thrilled to be able to offer scholarships, ranging from $500 – $1,000, to high school graduates in foster care who are pursuing further education either in college or a trade. This year we were able to give 15 scholarships. Here are just some of the exemplary students we are supporting.",
      },
      {
        type: "ul",
        items: [
          "B completed most of her credits a semester early (earning straight A's!) and used the abbreviated school schedule to gain work experience. She has experienced extensive trauma in her life and wants to become a nurse so she can continue to help others as she has already throughout her life. She plans to work as a Certified Nursing Assistant while she pursues her nursing degree and is training over the summer to make this possible.",
          "From a very early age, S has had to overcome severe obstacles. He got into trouble but completed treatment and is back on track. While in treatment, he graduated from high school, completing two years of school in eight months. He plans to attend trade school to become a plumber and create a better life for himself.",
          "G is a straight-A student who has been on honor roll throughout high school and was recently inducted into the National Honor Society. He has been involved with a variety of afterschool programs, including one that focuses on community service and engagement. He plans to major in math, science, or engineering.",
          "J is the first person in her family to graduate from high school. Not only has she worked almost continuously with tutors and teachers to ensure that she was successful in academics, but she has spent the last two years in activities that build social connections and created more support among her Latino community.",
          "R has plans to attend college out of state and so will not be eligible for the tuition waiver otherwise available to high school graduates in the child welfare system. Even though she only recently entered foster care with all the life changes that has meant, she nonetheless was able to complete high school on time, get her driver's license, and sought and has held down a job.",
          "While C was in high school, she managed her own nail business. Her goal is to become a licensed nail technician. The scholarship money will allow her to complete a nail certification program.",
          "We were also able to assist a deserving young woman with a special high school scholarship. She was accepted into an elite private school known for its rigorous academics, where she also plans to join the track team. She already has had athletic success on a national level. Attending this school is a rare opportunity but a large financial commitment for her foster family. What an honor to be able to help her out.",
        ],
      },
      { type: "h3", text: "For Love of Turtles" },
      {
        type: "p",
        text: "It was one of our more unique requests. First, what do you think of when you think of stress reducing pets? Maybe a service dog? Well for K. who was transitioning out of care *and* moving from a group home to her first apartment *and* starting a new job, it is her treasured four small turtles.",
      },
      {
        type: "p",
        text: "These big steps were exciting but challenging for K, and the turtles helped her get through them. But turtle care – frequent cleaning and maintenance of the tank is critical, along with the use of proper filters – is critical, and it is not cheap! (Who knew?)",
      },
      {
        type: "p",
        text: "Imagine K's delight and relief when 4Montgomery's Kids provided her with the funds to care for her beloved pets.",
      },
      { type: "h3", text: "Camp" },
      {
        type: "p",
        text: "This time of year brings requests for a variety of after school and summer programs. So far this year – and we expect more requests to come – we are sending twelve children to summer programs and we provided seven children with after school activities. The camp experiences include traditional sleep-away camp, special-needs camps, sports- themed programs and dance camp. We wish them all a fantastic, fun-filled summer.",
      },
      {
        type: "p",
        text: "Beyond the turtle, in this fiscal year, approximately 20% of our grants to children involved education, 11% involved transportation, 15% supported recreational activities, 1% were housing-related, and 53% were for a combination of personal and household needs. Most notably, we were able to fill every request we received – no child or family was denied the assistance they sought. And, it is all due to your generosity.",
      },
    ],
  },
  {
    slug: "fall-2023-we-are-thankful-for-you",
    year: "2025",
    month: "08",
    date: "2025-08-07",
    title: "We are Thankful for You",
    author: "Alan Kraut",
    categories: ["Success Stories"],
    iconForCover: "Gift",
    excerpt:
      "This year 4MK gave $500 and $1000 grants to deserving graduating seniors in foster care to help launch the next phase of their lives.",
    body: [
      { type: "h3", text: "4MK Excellence Awards for Graduating Seniors" },
      {
        type: "p",
        text: "This year 4MK gave $500 and $1000 grants to deserving graduating seniors in foster care to help launch the next phase of their lives. We have been awed by the creative ways these young adults have used the funds to help fulfill their dreams. Here are a few examples:",
      },
      {
        type: "ul",
        items: [
          "L is taking both college and study skills courses as prerequisites to a nursing degree. Public transportation is limited near her, so she is putting the money toward a first car as an easier way to get to multiple classes.",
          "J was accepted into an out-of-state university known for its College of Education. She is now a freshman majoring in Early Childhood and is using her funds to lower out of pocket school expenses.",
          "S is taking a break from school but is now in the process of applying for a technical degree. In the interim she has used her award to invest in her own business.",
        ],
      },
      { type: "h3", text: "Spotlight: Marie Schwartz" },
      {
        type: "p",
        text: "Marie Schwartz retired from Child Welfare Services after 37 years of providing much needed services to the most vulnerable groups in Montgomery County. You would think that kind of dedication over a lifetime would have been enough for anyone. Not for Marie. Marie now lives at Ingleside, a retirement community in Rockville, and for the past two years she has reached out to Ingleside residents for donations to 4MK for Project Turkey. Marie not only made Project Turkey happen but she partnered with 4Montgomery's Kids to expand the reach of her good deeds.",
      },
      { type: "h3", text: "Project Turkey" },
      {
        type: "p",
        text: "Thanks to the generous support of 51 residents of Ingleside Retirement Community in Rockville, Md, 4MK is providing $100 gift certificates to 72 families to help them create a special Thanksgiving dinner. These are families where the children are being kept in their homes with intensive support from child and family services, a program designed to help prevent these children from being placed into foster care.",
      },
      {
        type: "p",
        text: "**We wish these families a joyous and bountiful Thanksgiving. Thank you residents of Ingleside and Marie Schwartz for your care and compassion**",
      },
      {
        type: "p",
        text: "Who doesn't love a birthday party, right? Or at least a present on the big day? But too often for children in foster care the special nature of the day is forgotten. We at 4MK cannot let that happen. No one deserves to be forgotten.",
      },
      {
        type: "p",
        text: "Among the many ways we celebrated our kids this year, we provided funds for a birthday party for a child in a hospital, a birthday party and reunion at Dave and Busters for a family's first big event after the child went into foster care, a birthday trip to the movies for a youth and her younger sister, and a party at Sky Zone for a family moving toward reunification.",
      },
      {
        type: "p",
        text: "We also gave gifts to help a teen turning 15 feel accepted and appreciated at her quinceanera, Legos and beach toys for a child moving to a new placement near the ocean, a gift card for a teen who did not receive a gift from her mother or her group home, a basketball jersey and more for a budding athlete, a Spiderman outfit for a huge Spidey fan, and hair extensions to make a young woman feel special on her special day. We even gave a gift card to a youth in foster care to buy a birthday present for a friend.",
      },
      { type: "p", text: "After all, who doesn't love a good birthday!!" },
      {
        type: "p",
        text: "**Please help us celebrate more children in foster care!!!**",
      },
    ],
  },
  {
    slug: "10-years-of-helping-children",
    year: "2025",
    month: "08",
    date: "2025-08-07",
    title: "10 Years of Helping Children",
    author: "Alan Kraut",
    categories: ["News"],
    iconForCover: "Award",
    excerpt:
      "It's hard to believe it has been 10 years of 4Montgomery's Kids providing the children in Montgomery County's foster care system with things no one else could pay for.",
    body: [
      {
        type: "p",
        text: "**TEN YEARS!!!** It's hard to believe it has been 10 years of 4Montgomery's Kids providing the children in Montgomery County's foster care system with things no one else could pay for. We helped **more than 2,000 children and youth** over those ten years by providing things like gifts for birthdays that might have been forgotten, paying for summer camps and after-school activities, furnishing apartments and assisting with rent, rewarding major accomplishments, helping families reunite, and so much more.",
      },
      {
        type: "p",
        text: "In our first year, we could only afford to help 36 children; by our tenth year, that number soared to an astonishing 364! All while ensuring that **100% of your donations** go directly to helping those children, teens, and young adults who are the most vulnerable among us.",
      },
      {
        type: "p",
        text: "In 2017, we expanded to giving partial scholarships to those going on to college or trade school. Since then, we've awarded 48 scholarships, increasing from just two in 2017 to an impressive 15 in 2023.",
      },
      {
        type: "p",
        text: "And we kept at it when the nation was hit by a pandemic. As our amazing county social workers continued to stay in touch with these children, 4Montgomery's Kids bought them laptops, books, school supplies, and more so they could stay connected to school.",
      },
      {
        type: "p",
        text: "Thanks to you, our generous donors, we have been able to better meet the needs of these children each year. In the beginning, we had to limit our grants to a maximum of $250 each. Today, we fund every deserving request we get.",
      },
      { type: "p", text: "As social workers have told us:" },
      {
        type: "quote",
        text: "4MK provides social workers with a rare opportunity to say 'yes' to needs that enhance a child's well-being in a tangible way.",
      },
      {
        type: "quote",
        text: "My work (and all of Child Welfare Services) is so much better because of 4MK!",
      },
      {
        type: "p",
        text: "But we have more work to do. So long as children remain in foster care, their needs will persist. The power to make a difference lies in your hands. Let's keep the momentum going! Please give generously and here's to the next 10 years of hope and change!",
      },
    ],
  },
  {
    slug: "how-scary-must-it-be-to-have-to-leave-foster-care-at-age-21",
    year: "2025",
    month: "08",
    date: "2025-08-07",
    title: "How scary must it be to have to leave foster care at age 21?",
    author: "Alan Kraut",
    categories: ["News"],
    iconForCover: "ShieldCheck",
    excerpt:
      "You have been in foster care for years – removed from your biological family because of abuse and neglect. Suddenly you find yourself out at 21 with only the support you can muster on your own.",
    body: [
      {
        type: "quote",
        text: "You have been in foster care for years – removed from your biological family because of abuse and neglect. You've rotated through multiple placements, through group homes and residential treatment centers. Suddenly you find yourself out at 21 with only the support you can muster on your own.",
      },
      {
        type: "p",
        text: "That was true for some of the most vulnerable kids who aged out of foster care in Montgomery County last year. **This time we at 4Montgomery's Kids were there to help.**",
      },
      {
        type: "p",
        text: "Research shows that abruptly ending support on a 21st birthday abandons young people just when they need critical assistance. It ignores threats of homelessness, cuts education when many are still in school, disrupts mental health services for those coping with histories of trauma and abuse, and plunges a young parent and their children into poverty.",
      },
      {
        type: "p",
        text: "Using this research, and after talking with experts at the University of Pennsylvania, in Los Angeles, and colleagues in Prince George's County, **4Montgomery's Kids embarked on a Pilot Guaranteed Income Program**. Nine youth were identified to receive $600 a month for one year – no strings attached.",
      },
      {
        type: "p",
        text: "Those identified were initially interviewed about their working, living, educational, and emotional states. They will be interviewed again at 6 and 12 months to see if the money has made a difference in their lives.",
      },
      {
        type: "p",
        text: "Throughout the year, we'll partner with **Empowering the Ages** to provide mentorship. Empowering the Ages, another Montgomery County nonprofit, will work with our nine on getting county services, applying and interviewing for jobs, and basics like getting a checking account and keeping track of spending.",
      },
      {
        type: "p",
        text: "We will report what we find to you, our donors. But already one young woman has said our funding has prevented an eviction, gotten her job training, and put her in a full-time job. She reports, \"I feel amazing!\"",
      },
      {
        type: "p",
        text: "**Our pilot is being funded solely by the 4MK board**. Since the program goes beyond anything we've ever asked of you, we felt it was important not to spend your funds before we told you about it.",
      },
      {
        type: "p",
        text: "Now you know!! Know, too, that **our program is one of only three we could find anywhere devoted exclusively to those aging out of foster care**.",
      },
      {
        type: "p",
        text: "**We hope to continue and even expand our Guaranteed Income Program. For that, we need your support.** You have been so generous to 4MK in the past. We know you will generously support this new program, as well.",
      },
      {
        type: "footnote",
        text: "*Of course we are also staying true to our core mission. The approaching end of the school year will mean sending kids to summer camp and our annual scholarships for deserving graduates who are attending college and trade schools. But that and more is for our next newsletter.*",
      },
    ],
  },
  {
    slug: "spring-arrives-for-children-in-foster-care",
    year: "2022",
    month: "09",
    date: "2022-09-01",
    title: "Spring Arrives for Children in Foster Care",
    author: "4Montgomery's Kids",
    categories: ["Success Stories"],
    iconForCover: "Sun",
    excerpt:
      "What if a baseball bat wasn't just a baseball bat? That's when a bat is more than a bat and what a new baseball bat meant to JR, one of our children in foster care.",
    body: [
      {
        type: "p",
        text: "What if a baseball bat wasn't just a baseball bat? What if it was a chance to get involved in a new community and new school after your father passed away and you recently moved? What if it was an opportunity to be part of a healthy, fun sport where you could learn valuable life skills and make new friends? And what if you were too tall to use your teammates' bats? That's when a bat is more than a bat and what a new baseball bat meant to JR, one of our children in foster care who went through a terrible winter.",
      },
      {
        type: "p",
        text: "But baseball also means that spring is finally here after this long hard year. For the children, teenagers, and young adults that 4Montgomery's Kids serves, it means a return to school, sports, summer camp, and employment. As for JR, it may mean new beginnings and a return to a more normal way of life.",
      },
      {
        type: "p",
        text: "Things have been exceptionally tough for children in the foster care system. Between July 2020 and March 2021, there were almost 7,000 calls to Montgomery County's Child Welfare to report child abuse and neglect. The average number of children and youth in foster care is 435 each month. In addition, 110 children remain with their biological families but are being monitored by social workers. There is also concern that because most children have not been in school an important source of identifying children being mistreated has been missing. At the same time, young adults who are aging out of Child Welfare are unable to find jobs to cover housing and other expenses.",
      },
      {
        type: "p",
        text: "Thanks to our generous donors, 4MK has been able to quickly and fully respond to every request we have received this past year! From families experiencing food insecurity to students needing laptops, to young adults unable to pay rent, and, yes, to a baseball bat for JR. In the words of one of our donors, 4MK has kept \"these kids in the forefront during this tragic time for our country\" and it's only through your help we have been able to do it.",
      },
    ],
  },
  {
    slug: "donor-spotlight-the-ammerman-family-foundation",
    year: "2021",
    month: "08",
    date: "2021-08-25",
    title: "Donor Spotlight: the Ammerman Family Foundation",
    author: "4Montgomery's Kids",
    categories: ["Donor Spotlight"],
    iconForCover: "Landmark",
    excerpt:
      "Joy Ammerman is a long-time resident of Montgomery County where she raised her three children and taught school.",
    body: [
      {
        type: "p",
        text: "Joy Ammerman is a long-time resident of Montgomery County where she raised her three children and taught school. She manages the Ammerman Family Foundation to give back to the community that has been so good to her family.",
      },
      {
        type: "p",
        text: "In deciding what organizations to support Joy often looks to her children for suggestions. Her daughter-in-law attended our Zoom Workout fundraiser and told Joy about \"this organization that provides money to youth aging out of foster care.\" She chose to make a generous contribution earmarked to helping these young adults. With Joy's gift, we will have supported fifteen foster youth who are aging out by paying for furnishings, professional work clothes, tuition, loan repayment, auto expenses, transportation, groceries, computers, and more.",
      },
      {
        type: "p",
        text: "Joy feels rewarded by the thought that her contribution will make a difference right here in Montgomery County. She hopes through her gift and the example she set that someday the young adults she is supporting will be able to give back as well. (Thank you, Joy!)",
      },
      {
        type: "p",
        text: "**Without you, our donors, we could not continue to help the children and young adults who continue to face great difficulties as they try to overcome the trauma from child abuse and neglect. So please, now more than ever, help us help our community.**",
      },
    ],
  },
  {
    slug: "fall-2020-update",
    year: "2020",
    month: "11",
    date: "2020-11-19",
    title: "Fall 2020 Update",
    author: "4Montgomery's Kids",
    categories: ["News", "Success Stories", "What your money supports"],
    iconForCover: "Laptop",
    excerpt:
      "We are living in a difficult time, one that has forced all of us to rearrange our lives. Children and their families in Montgomery County's Child Welfare System have been particularly hard hit.",
    body: [
      {
        type: "p",
        text: "We are living in a difficult time, one that has forced all of us to rearrange our lives. Children and their families in Montgomery County's Child Welfare System have been particularly hard hit. In September there were 436 children in foster care in the county. Additionally, there are children receiving services in 95 homes where, despite a finding of abuse and neglect, the situation was not deemed serious enough to place the children into foster care.",
      },
      {
        type: "p",
        text: "The 4MK board continues to partner with social workers in Child Welfare to help. We have been concentrating on families and, particularly, on older foster youth as they move ahead with their lives. The state of Maryland also is focusing on the hardships these young adults face. Maryland is now allowing them to stay in the foster care system for an extra six months, even when they would have aged out at twenty one. This will affect eleven young adults. But so many of them still need services, including help with rent, support for transportation to school and jobs, and money for basic living needs, and we can help with some of these.",
      },
      {
        type: "p",
        text: "Here are just a handful of requests Montgomery County social workers asked us to fill in the last six months. We were able to fill all of them because of your support:",
      },
      {
        type: "ul",
        items: [
          "Helping with housing costs for ten older youth moving into their first apartments",
          "Purchasing fourteen Chromebooks to assist with online learning",
          "Awarding nine college scholarships for youth graduating from high school",
          "Paying for transportation so a mother could visit her daughter in preparation for reunification",
          "Buying a large dining room table for an aunt who had four foster kids placed with her in addition to her own already large family. Now they can all eat together",
          "Purchasing bunk beds for four children who now live with relatives after they were removed from their parents' home",
          "Providing special camps and gym activities for foster children whose camps were closed due to Covid-19",
        ],
      },
      {
        type: "p",
        text: "Let us introduce to you some young people your contributions have helped:",
      },
      {
        type: "p",
        text: "N is a young woman just leaving the foster care system. She loves graphic design and is a self-taught artist. Her designs for filters were recently accepted by Instagram. 4MK, through your donations, bought her a MacBook, the key tool she needs to pursue both her education and her passion for graphic art.",
      },
      {
        type: "p",
        text: "J is a kind and resilient young person preparing to move into her first apartment. She has completed two semesters at Montgomery College in addition to having finished her Certified Nursing Assistant (CNA) degree. She currently is focused on working and saving money. With your contributions, 4MK helped pay her rent, and J now is managing her expenses and looking forward to being on her own.",
      },
      { type: "p", text: "And here is how L expressed her thanks for 4MK:" },
      {
        type: "quote",
        text: "I am a youth in foster care and I had the support of 4Montgomery's Kids. They helped me when I was pregnant and needed baby supplies. I am thankful because I was not working because of COVID, and did not have anything for my baby. They helped me a lot.",
        cite: "L",
      },
    ],
  },
  {
    slug: "workout-for-good",
    year: "2020",
    month: "11",
    date: "2020-11-17",
    title: "Workout for Good",
    author: "4Montgomery's Kids",
    categories: ["Donor Spotlight", "Success Stories"],
    iconForCover: "Dumbbell",
    excerpt:
      "What an amazing evening. On September 22, 2020, in the midst of a global pandemic, we hosted a virtual exercise class.",
    body: [
      { type: "h3", text: "Workout for Good" },
      { type: "p", text: "What an amazing evening." },
      {
        type: "p",
        text: "On September 22, 2020, in the midst of a global pandemic, we hosted a virtual exercise class, led by one of the premier trainers in the DMV, Jennifer Blackburn. Forty five minutes of heart pumping exercise was preceded by a presentation from two former foster youth who have aged out of the child welfare system but were the beneficiaries of assistance from 4Montgomery's Kids. One of the speakers who just graduated from medical school discussed how she was able to concentrate on taking her medical exams knowing that we were there to help her out. The other speaker told us how she was able to get to school and her job when we helped pay for her parking and her car repairs.",
      },
      {
        type: "p",
        text: "We never imagined that with all the chaos in the world our donors, new and old, would come together to make this one of our most successful fundraisers ever. More than 80 people took part in this virtual event. It is not too late to do even more!!",
      },
    ],
  },
  {
    slug: "thank-you",
    year: "2019",
    month: "12",
    date: "2019-12-13",
    title: "Thank you!",
    author: "4Montgomery's Kids",
    categories: ["Success Stories", "What your money supports"],
    iconForCover: "ShoppingCart",
    excerpt:
      "For over five years now and with the generous support of donors like you – THANK YOU SO MUCH! – 4 Montgomery's Kids has helped close to 700 foster kids in the county's Child Welfare System.",
    body: [
      {
        type: "p",
        text: "For over five years now and with the generous support of donors like you – THANK YOU SO MUCH! – 4 Montgomery's Kids has helped close to 700 foster kids in the county's Child Welfare System. But today these kids are more vulnerable than ever. Their schools, from elementary to college, are closed. They can't participate in any of their favorite activities. They are even more uncertain about their futures than they ever were. While this is true of all the children in the county, children and youth in foster care are often in particularly precarious situations during this pandemic.",
      },
      {
        type: "p",
        text: "Our wonderful social workers are working remotely, still protecting children. We are working with them to be as responsive as we can to their requests for help. Here are just a few recent ones we have answered. We've:",
      },
      {
        type: "ul",
        items: [
          "bought grocery store cards to help those having trouble getting food since many families are not working",
          "provided a laptop for a child who moved from one foster home to another in the midst of all this; she needed the laptop to keep up with schoolwork and her computer was at her old school",
          "helped cover rent for a youth who is aging out of foster care and lost her job at a hair salon when it closed down",
          "helped a mother whose car broke down going to work; we paid to get her car fixed after the mechanic gave a reduced rate",
          "bought Metro cards, including one for a young woman who works as a nursing assistant but doesn't have enough money to pay for rent, food, and transportation",
          "sent in deposits for children who want to go to camp this summer to hold their places until we find out if the camp will open",
        ],
      },
      {
        type: "p",
        text: "Sure, the past few weeks have been challenging for all of us, but foster kids are among the most vulnerable among us. Thank you to all who gave gifts to 4Montgomery's Kids so that we could help during this particularly difficult time.",
      },
    ],
  },
  {
    slug: "moving-to-independence",
    year: "2019",
    month: "12",
    date: "2019-12-05",
    title: "Moving to Independence",
    author: "4Montgomery's Kids",
    categories: ["Success Stories"],
    iconForCover: "GraduationCap",
    excerpt:
      "A high priority for 4MK has been helping youth move towards independence. This year, Kayla and Carson were selected and received their awards at the annual foster care family picnic.",
    body: [
      {
        type: "p",
        text: "A high priority for 4MK has been helping youth move towards independence. Each year, with the assistance of Montgomery County social workers, we offer scholarships to a few students who are moving on to higher education after high school. This year, Kayla and Carson were selected and received their awards at the annual foster care family picnic.",
      },
      {
        type: "p",
        text: "Carson is going to community college and is interested in studying information technology. Kayla will be studying nursing.",
      },
      {
        type: "p",
        text: "While both Carson and Kayla will have their tuition covered by federal and state funds, no money was provided for transportation, books, and all the other extra expenses that go with this next stage of life. Without our funds, the full college experience would have been out of reach for these young people. As you can see from the video, Carson and Kayla greatly appreciated our support. We wish them so much luck in this next step in their adventures.",
      },
      { type: "video", youtubeId: "SdGjQlQfNbU" },
      { type: "video", youtubeId: "kGPDdpDPDSw" },
    ],
  },
  {
    slug: "over-550-in-5-years",
    year: "2019",
    month: "11",
    date: "2019-11-27",
    title: "Over 550 in 5 years!",
    author: "4Montgomery's Kids",
    categories: ["News"],
    iconForCover: "TrendingUp",
    excerpt:
      "More than 550 in less than five years! That is how many children and youth have been helped by 4Montgomery's Kids (4MK) and we can't thank you enough!",
    body: [
      {
        type: "p",
        text: "**More than 550 in less than five years!** That is how many children and youth have been helped by 4Montgomery's Kids (4MK) and we can't thank you enough! In 2015, 4Montgomery's Kids began this incredible journey of helping Montgomery County's neediest children and youth receive the goods and services other children get. 4MK provides funding for:",
      },
      {
        type: "ul",
        items: [
          "extracurricular activities such as summer camp, gym memberships, art classes and sports;",
          "educational support including books, computers and tuition;",
          "assistance with rent, security deposits and furniture for youth transitioning out of foster care;",
          "help with transportation, including gas cards, metro cards, drivers education and car repairs;",
          "job support with the focus on vocational training, uniforms and work clothes;",
          "other targeted areas such as gift cards for special occasions, prom attire, clothing and family support.",
        ],
      },
      {
        type: "footnote",
        text: "The original post included a graph here breaking down how funds were allocated across these categories; that image is no longer available, so the categories above are shown as a list instead.",
      },
    ],
  },
  {
    slug: "foster-children-need-summer-camp-too",
    year: "2019",
    month: "04",
    date: "2019-04-08",
    title: "Foster Children Need Summer Camp Too!!",
    author: "4Montgomery's Kids",
    categories: ["Success Stories", "What your money supports"],
    iconForCover: "Tent",
    excerpt:
      "We are particularly excited to be sending more than 35 children to summer camp this year. Summer camp can change a child's life in so many ways.",
    body: [
      {
        type: "p",
        text: "We are particularly excited to be sending more than 35 children to summer camp this year. Summer camp can change a child's life in so many ways. As a social worker told us:",
      },
      {
        type: "quote",
        text: "this young lady had a number of issues, including an inability to make friends. She went to camp, gained confidence, tried new activities, made friends and her mother reported that she came home a completely different kid and, subsequently did extremely well in school in the fall, had a group of friends, and the family has not been involved with CWS again.",
      },
      {
        type: "p",
        text: "If camp can do this for one child, imagine what it can do for thirty-five. With your help we can sponsor even more.",
      },
    ],
  },
  {
    slug: "new-community-parters",
    year: "2018",
    month: "11",
    date: "2018-11-06",
    title: "Get to Know our Social Workers",
    author: "4Montgomery's Kids",
    categories: ["News"],
    iconForCover: "Users",
    excerpt:
      "This month we are saluting the social workers in the Transitioning Youth Services Unit, headed by Shari Zouhairi.",
    body: [
      {
        type: "p",
        text: "This month we are saluting the social workers in the Transitioning Youth Services Unit, headed by Shari Zouhairi. These social workers develop and implement plans for youth who must leave the Child Welfare system at age twenty-one. The youth they work with have some of the greatest challenges facing children in the child welfare system. The workers in this unit help these young people navigate among other things finding jobs, affordable housing and higher education. They often ask 4MK to support these youth by providing money for housing deposits, transportation expenses, clothing for interviews, and books and laptops for school.",
      },
      {
        type: "p",
        text: "Most recently a social worker from this unit asked 4MK to help with the security deposit for a girl who is aging out of the system. The girl was working and could pay the monthly rent but did not have the outlay for the security deposit. Keeping this girl from homelessness is but one of the miracles performed by the amazing workers in this unit.",
      },
      {
        type: "p",
        text: "Our hats are off to these dedicated workers who work so hard to help put these young people on the path to a successful future. It is our great pleasure to help them do their jobs.",
      },
    ],
  },
  {
    slug: "fall-2018-update",
    year: "2018",
    month: "11",
    date: "2018-11-05",
    title: "Fall 2018 Update",
    author: "4Montgomery's Kids",
    categories: ["News"],
    iconForCover: "Sparkles",
    excerpt:
      "I want to thank you all at Montgomery Kids for all the help. When I was down on the floor, you all came to help and stretched your hand.",
    body: [
      {
        type: "quote",
        text: "I want to thank you all at Montgomery Kids for all the help. When I was down on the floor, you all came to help and stretched your hand.",
      },
      {
        type: "p",
        text: "These are the words of a young person we have helped. There are over 400 children who have been removed from their homes because of child abuse and neglect. These children suffer trauma from the circumstances that led to foster care. They are grieving for the home and people they left. They are the focus of our work.",
      },
      {
        type: "p",
        text: "**4Montgomery's Kids** (formerly Montgomery's Kids) is a local nonprofit agency that helps Montgomery County's most vulnerable children and youth. 4MK supplements what children who have experienced abuse and neglect, those in the Child Welfare system, receive from the state and county services. Resources we provide help normalize a child's life experiences, and help youth transitioning out of foster care find housing, jobs, and other resources. We help create a brighter future for these children.",
      },
      { type: "p", text: "**We need your help to continue this work**" },
      {
        type: "p",
        text: "**A few of those young people wrote:** \"I just wanted to thank you Montgomery's Kids. I appreciated everything. If it was not for you guys helping me with the cost for Certified Medication Technician (CMT), I wouldn't have my current job. I appreciate it sincerely. Y'all are the best!\"",
      },
      {
        type: "quote",
        text: "Through the 4Montgomery Kids Program, I received funding for meals when I served as a Student Page for the Maryland General Assembly in Annapolis. Thank you 4Montgomery Kids for your generosity to youth in foster care. 🍔🍟🍕🌮",
      },
      {
        type: "quote",
        text: "Thank you so very much for helping me out with school and buying me a laptop. I'm a college student and it's very much appreciated. 💻🖥🖨",
      },
      {
        type: "p",
        text: "From July 2017 to July 2018 (our last fiscal year) 4MK provided assistance to 122 children. Since July, we have helped an additional 45 children. We supplemented their educations with college books, computers and money for extracurricular activities. This summer we sent 40 children to summer camp. Young people transitioning out of foster care received security deposits, furniture, food, gift cards, and work clothes.",
      },
      {
        type: "p",
        text: "**Social workers also have told us how children benefit greatly from the opportunities and services you helped us provide.**",
      },
      {
        type: "quote",
        text: "I am so thankful for Montgomery's Kids who has poured out opportunity time and time again for current and former youth in foster care to succeed toward self-sufficiency. They have blessed youth with financial support for higher education pathway for college/vocational training, housing and employment stability, and personal health care. Personally, it has been especially challenging to locate funds for emancipated youth; however, Montgomery's Kids has been a tremendous source of help and hope when the need arises. The state needs more organization like them.",
      },
      {
        type: "quote",
        text: "Providing assistance for \"things\" has enabled many of my clients to achieve a sense of normalcy in their anything but normal lives. 4Montgomery Kids paid for a parking pass at University of Maryland while one of my clients was a student commuter, bought a new Ipad for a hearing impaired client and purchased gym memberships for several of my clients — and that's just a few ways 4Montgomery kids helps make a difference in one life at a time!!!",
      },
    ],
  },
  {
    slug: "donor-spotlight-diane-burch",
    year: "2018",
    month: "11",
    date: "2018-11-05",
    title: "Donor Spotlight: Diane Burch",
    author: "4Montgomery's Kids",
    categories: ["Donor Spotlight"],
    iconForCover: "PawPrint",
    excerpt:
      "Diane Burch is the owner of a small business in Montgomery County. She cares deeply about its residents, particularly the four-legged ones.",
    body: [
      {
        type: "p",
        text: "**Diane Burch** is the owner of a small business in Montgomery County. She cares deeply about its residents, particularly the four-legged ones. While Diane has been a consistent donor to 4Montgomery's Kids, she has also been a major supporter. Diane has trumpeted the cause to her clients and friends who have gone on to become supporters in their own right. She has truly shown how members of a community can come together to become a greater force. Thank you Diane, for increasing the size of your contributions by personal advocacy.",
      },
    ],
  },
  {
    slug: "peewee-football-champions",
    year: "2018",
    month: "04",
    date: "2018-04-10",
    title: "Peewee Football Champions",
    author: "4Montgomery's Kids",
    categories: ["Success Stories"],
    cover: "peewee-football.jpg",
    excerpt:
      "The peewee football team that Jeff, a nine year old boy played on, was going to the national championships in Florida.",
    body: [
      {
        type: "p",
        text: "The peewee football team that Jeff, a nine year old boy played on, was going to the national championships in Florida. Jeff's foster parent was unable to afford the cost of this trip and he would have been unable to accompany his team. Due to your generous contributions, 4Montgomery's Kids was able to pay for his trip and they won the national championship. In his words, \"Thank you 4Montgomery's Kids!!! We could not have done this without you!!!\"",
      },
      {
        type: "p",
        text: "As always, we thank you our supporters for making our work possible. All the money you contribute goes directly towards helping the children as all administrative costs of 4Montgomery's Kids are absorbed by our board members. We look forward to telling you about additional exciting ways your money has helped and to doubling our efforts in the upcoming year. Please, spread the word about our work and encourage others to support us with donations and house parties where we can bring youth to talk to you about their experiences and how 4Montgomery's Kids has helped them.",
      },
    ],
  },
  {
    slug: "donor-spotlight-gail-maidenbaum",
    year: "2018",
    month: "04",
    date: "2018-04-10",
    title: "Donor Spotlight: Gail Maidenbaum",
    author: "4Montgomery's Kids",
    categories: ["Donor Spotlight"],
    iconForCover: "Briefcase",
    excerpt:
      "As a Montgomery County mother and a Montgomery County employer, Gail Maidenbaum feels a dual obligation to the foster kids in our county.",
    body: [
      {
        type: "p",
        text: "As a Montgomery County mother and a Montgomery County employer, Gail Maidenbaum feels a dual obligation to the foster kids in our county. Her belief is that \"we have to take care of our own\" and these kids are the responsibility of all county residents and companies. She realizes that these kids are at school with the rest of the county children, but they lack what many of the other students take for granted. The ability to have a laptop, a Metro card to go to work, to take a ballet class, to go to summer camp – these opportunities should be available to all \"our kids\". That's why she has chosen to give back to her county by generously supporting 4Montgomery's Kids.",
      },
    ],
  },
  {
    slug: "spring-2018-news",
    year: "2018",
    month: "04",
    date: "2018-04-10",
    title: "Spring 2018 News",
    author: "4Montgomery's Kids",
    categories: ["News"],
    iconForCover: "Flower2",
    excerpt:
      "Spring is here and with it comes our new name, 4Montgomery's Kids. All your generous support goes for the children and youth in our county who have been abused and neglected.",
    body: [
      {
        type: "p",
        text: "Spring is here and with it comes our new name, 4Montgomery's Kids. All your generous support goes for the children and youth in our county who have been abused and neglected.",
      },
      {
        type: "p",
        text: "Spring also brings news of our efforts during the past few months. We do this though our wonderful partnership with the amazing County's Child Protective Services (CWS) social workers who have been passionate advocates for the children with whom they work, and of course you our wonderful donors.",
      },
      { type: "h3", text: "Summer Camp" },
      {
        type: "p",
        text: "We are particularly excited to be sending more than 35 children to summer camp this year. Summer camp can change a child's life in so many ways. As a social worker told us:",
      },
      {
        type: "quote",
        text: "this young lady had a number of issues, including an inability to make friends. She went to camp, gained confidence, tried new activities, made friends and her mother reported that she came home a completely different kid and, subsequently did extremely well in school in the fall, had a group of friends, and the family has not been involved with CWS again.",
      },
      {
        type: "p",
        text: "If camp can do this for one child, imagine what it can do for thirty-five. With your help we can sponsor even more.",
      },
      { type: "h3", text: "New Projects" },
      {
        type: "p",
        text: "In addition to our ongoing efforts such as funding transportation for a parent living out of state to visit her children, books for college classes, a costume for dance class and gift cards for food for a youth living on his own who was going hungry, we are pleased to announce our new ventures.",
      },
      {
        type: "ul",
        items: [
          "Together with the Jewish Council for Aging and other community partners we are exploring housing in Montgomery County for young people transitioning out of foster care at age 21. The high cost of rent in the county makes it extremely hard for these youth to find local housing. Our dream is to establish intergenerational housing where young people and seniors can live side by side and assist each other.",
          "We are partnering with Interfaith Works to provide mentors to youth transitioning out of foster care. Mentors work with these youth to provide guidance and to help them develop the skills they need to live on their own. If you would like to be a mentor please contact us at info@4montgomeryskids.org.",
        ],
      },
    ],
  },
  {
    slug: "how-you-can-help",
    year: "2017",
    month: "10",
    date: "2017-10-10",
    title: "How you can help",
    author: "4Montgomery's Kids",
    categories: ["What your money supports"],
    iconForCover: "PiggyBank",
    excerpt:
      "Many children in Montgomery County need help – as of the beginning of March there were over 500 children eligible to be served by Montgomery's Kids.",
    body: [
      {
        type: "p",
        text: "Many children in Montgomery County need help – as of the beginning of March there were over 500 children eligible to be served by Montgomery's Kids. The key to Montgomery's Kids success is our desire and ability to help these children who have been abused and neglected and have different experiences than their friends and classmates. We want these children to have \"normal\" experiences. Through our efforts we are enhancing the quality of life for many of these children. Your dollars can help us do this.",
      },
      {
        type: "p",
        text: "How does your donation make a difference in our community:",
      },
      {
        type: "ul",
        items: [
          "$100 helps provide transportation for a child going to summer camp",
          "$150 helps provide tutoring for youth who has not done well in school this semester",
          "$150 helps provide community pool membership",
          "$200 helps provide books and new clothes for children at the beginning of the school year",
        ],
      },
      {
        type: "p",
        text: "We need to grow and we need your help to do it. Please share this newsletter with friends who might help us support these children and youth. Encourage them to check our website and send us their emails to montgomeryskids@montgomeryskids.org so we can share more of our needs and our great success stories.",
      },
    ],
  },
];
