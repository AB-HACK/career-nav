import { Opportunity } from '../types/domain';

export const SEEDED_OPPORTUNITIES: Opportunity[] = [
  // 1. THE EXACT SECTION 9 WORKED EXAMPLE OPPORTUNITY
  {
    id: 'opp-sec9-funded-research',
    type: 'Fellowship',
    title: 'Global Research & Specialist Visiting Fellowship (PRD Sec. 9 Worked Example)',
    organization: 'African-Global Academic & Clinical Consortium',
    summary: 'Intensive 6-month visiting research and mentorship fellowship providing direct research output, international conference presentation, and senior faculty letters of recommendation. Requires temporary relocation.',
    targetCareerIds: 'all',
    targetDestinationIds: 'all',
    deadline: '2027-01-31',
    isDeadlineVerified: true,
    eligibilityRules: [
      {
        id: 'er-sec9-1',
        description: 'Open to final-year students, recent graduates, and early-career professionals across clinical, STEM, and social science fields.',
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['research-output', 'practical-experience'],
    // Exact numbers from PRD Section 9 worked example:
    // gaps closed 9, credibility 8, funding 7, network and mentor 8, disruption cost 7, delay to payoff 6 (+ impactAlignment 8 for Mission-Driven)
    facts: {
      gapsClosed: 9,
      credibility: 8,
      funding: 7,
      networkAndMentor: 8,
      impactAlignment: 8,
      disruptionCost: 7,
      delayToPayoff: 6,
    },
    lowFitReasons: [
      'Requires 6 months full-time relocation away from current base',
      'Stipend covers living/research costs but pauses full-time local salary progression',
    ],
    prepTaskTemplates: [
      { title: 'Verify fellowship eligibility & host faculty track alignment', effortHours: 2 },
      { title: 'Update academic/professional CV & highlight research/project gaps', effortHours: 3 },
      { title: 'Request 2 academic/clinical referee letters', effortHours: 2 },
      { title: 'Draft 1,000-word research/project statement & submit portal packet', effortHours: 5 },
    ],
    verification: {
      opportunityId: 'opp-sec9-funded-research',
      state: 'verified',
      source: 'Official Consortium Fellowship Registry 2026/27',
      sourceUrl: 'https://example.org/global-visiting-fellowship',
      organization: 'African-Global Academic & Clinical Consortium',
      lastVerified: '2026-11-04',
      reviewer: 'North Curation Team (Lead Verifier)',
      isStale: false,
      reviewNotes: 'Confirmed stipend schedule, host institution list, and Jan 31 deadline.',
    },
  },

  // 2. CHEVENING / COMMONWEALTH MASTER'S & FELLOWSHIP TRACK (UK / All Fields)
  {
    id: 'opp-commonwealth-shared',
    type: 'Scholarship',
    title: 'Commonwealth & Chevening Fully Funded Postgraduate / Professional Fellowship',
    organization: 'UK FCDO & Association of Commonwealth Universities (ACU)',
    summary: 'Full tuition, return airfare, and monthly living stipend for high-potential African graduates pursuing specialist Master’s or professional fellowship tracks in the UK.',
    targetCareerIds: 'all',
    targetDestinationIds: ['uk', 'nigeria', 'kenya', 'south-africa', 'ghana'],
    deadline: '2026-12-12',
    isDeadlineVerified: true,
    eligibilityRules: [
      {
        id: 'er-cw-1',
        description: 'Citizen of an eligible Commonwealth / African nation with a completed undergraduate degree (minimum 2:1 equivalent).',
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['degree-completed', 'research-output', 'language-verified'],
    facts: {
      gapsClosed: 9,
      credibility: 9,
      funding: 10,
      networkAndMentor: 9,
      impactAlignment: 9,
      disruptionCost: 5,
      delayToPayoff: 6,
    },
    lowFitReasons: [
      '12-month full-time residency in the UK required; mandatory return-to-home-country bond on specific streams',
    ],
    prepTaskTemplates: [
      { title: 'Confirm target UK university programme & unconditional/conditional offer timeline', effortHours: 3 },
      { title: 'Draft 4 leadership, career plan, and development impact essays', effortHours: 6 },
      { title: 'Upload degree transcript, passport, and 2 verified reference letters', effortHours: 3 },
    ],
    verification: {
      opportunityId: 'opp-commonwealth-shared',
      state: 'verified',
      source: 'CSC UK Official Prospectus (cscuk.fcdo.gov.uk)',
      sourceUrl: 'https://cscuk.fcdo.gov.uk',
      organization: 'Commonwealth Scholarship Commission (UK)',
      lastVerified: '2026-10-30',
      reviewer: 'North Curation Team',
      isStale: false,
    },
  },

  // 3. TECH / CS / AI / ENGINEERING: REMOTE OPEN-SOURCE & CLOUD FELLOWSHIP (Paid, Low Disruption)
  {
    id: 'opp-outreachy-mlh-fellowship',
    type: 'Internship',
    title: 'Global Open-Source & Cloud Systems Engineering Paid Fellowship ($7,000 Stipend)',
    organization: 'Software Freedom Conservancy / Cloud Native Computing Foundation',
    summary: '12-week remote, paid engineering fellowship working directly with senior maintainers on production cloud, AI, or systems repositories. Zero relocation required.',
    targetCareerIds: ['cs-it', 'ai-emerging-tech', 'engineering'],
    targetDestinationIds: 'all',
    deadline: '2027-02-15',
    isDeadlineVerified: true,
    eligibilityRules: [
      {
        id: 'er-os-1',
        description: 'Available for 30–40 hrs/week during the 12-week remote sprint; open to African students and early-career engineers.',
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['practical-experience', 'research-output'],
    facts: {
      gapsClosed: 9,
      credibility: 8,
      funding: 9,
      networkAndMentor: 8,
      impactAlignment: 7,
      disruptionCost: 2, // Very low disruption! Remote & paid — scores great even for Stability Seeker
      delayToPayoff: 2,
    },
    lowFitReasons: ['Requires intensive initial contribution phase (2–3 merged PRs) during selection'],
    prepTaskTemplates: [
      { title: 'Select 2 target open-source organizations and set up local build environment', effortHours: 3 },
      { title: 'Submit and merge first verified pull request (PR) with mentor review', effortHours: 6 },
      { title: 'Submit final project timeline proposal before deadline', effortHours: 3 },
    ],
    verification: {
      opportunityId: 'opp-outreachy-mlh-fellowship',
      state: 'verified',
      source: 'Outreachy / CNCF Official Fellowship Portal',
      sourceUrl: 'https://www.outreachy.org',
      organization: 'Software Freedom Conservancy & CNCF',
      lastVerified: '2026-11-05',
      reviewer: 'North Tech Curators',
      isStale: false,
    },
  },

  // 4. MEDICINE / NURSING / HEALTHCARE: AFRICA CDC & WHO AFRO CLINICAL/PUBLIC HEALTH FELLOWSHIP
  {
    id: 'opp-africacdc-kofi-annan',
    type: 'Leadership',
    title: 'Africa CDC Public Health, Clinical & Health Systems Fellowship',
    organization: 'Africa Centres for Disease Control and Prevention (Africa CDC)',
    summary: 'Fully funded clinical and public health leadership track across African Union Member States with senior mentorship, field deployment stipends, and policy project funding.',
    targetCareerIds: ['medicine-surgery', 'nursing-pharmacy', 'healthcare-nursing', 'psychology-social'],
    targetDestinationIds: 'all',
    deadline: '2027-01-20',
    isDeadlineVerified: true,
    eligibilityRules: [
      {
        id: 'er-acdc-1',
        description: 'Citizen of an African Union Member State with background in medicine, nursing, pharmacy, or public health.',
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['practical-experience', 'research-output'],
    facts: {
      gapsClosed: 8,
      credibility: 8,
      funding: 8,
      networkAndMentor: 9,
      impactAlignment: 10, // Maximum impact alignment for Mission-Driven users!
      disruptionCost: 3,
      delayToPayoff: 3,
    },
    lowFitReasons: ['Requires institutional release letter if currently employed in a hospital/ministry'],
    prepTaskTemplates: [
      { title: 'Draft health systems / clinical intervention concept note (1,500 words)', effortHours: 4 },
      { title: 'Obtain head-of-department or clinical supervisor endorsement letter', effortHours: 3 },
      { title: 'Compile professional license & degree verification packet', effortHours: 2 },
    ],
    verification: {
      opportunityId: 'opp-africacdc-kofi-annan',
      state: 'verified',
      source: 'Africa CDC Official Fellowships Page (africacdc.org)',
      sourceUrl: 'https://africacdc.org',
      organization: 'African Union / Africa CDC',
      lastVerified: '2026-11-01',
      reviewer: 'North Clinical Curation Lead',
      isStale: false,
    },
  },

  // 5. LAW / FINANCE / BUSINESS / POL-SCI: MO IBRAHIM / AFDB / MULTILATERAL YOUNG ANALYST & LEGAL FELLOWSHIP
  {
    id: 'opp-afdb-ibrahim-fellowship',
    type: 'Fellowship',
    title: 'Mo Ibrahim & AfDB Governance, Legal & Financial Advisory Fellowship',
    organization: 'Mo Ibrahim Foundation / African Development Bank (AfDB)',
    summary: 'Salaried executive fellowship placing young African professionals in multilateral legal, infrastructure finance, policy, and strategic operations teams.',
    targetCareerIds: ['law', 'accounting-finance', 'business-mgmt', 'political-science', 'engineering', 'mass-comm'],
    targetDestinationIds: 'all',
    deadline: '2027-03-01',
    isDeadlineVerified: true,
    eligibilityRules: [
      {
        id: 'er-afdb-1',
        description: 'Strong academic qualification and analytical track record in law, finance, engineering, policy, or management.',
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['practical-experience', 'research-output', 'licensing-exam'],
    facts: {
      gapsClosed: 9,
      credibility: 9,
      funding: 9,
      networkAndMentor: 9,
      impactAlignment: 9,
      disruptionCost: 4,
      delayToPayoff: 3,
    },
    lowFitReasons: ['Highly selective cohort size; requires willingness to work from Abidjan, London, or Addis Ababa'],
    prepTaskTemplates: [
      { title: 'Prepare 2-page policy, legal, or financial transaction writing sample', effortHours: 4 },
      { title: 'Tailor CV to multilateral competency framework', effortHours: 3 },
      { title: 'Secure 2 senior professional or academic references', effortHours: 2 },
    ],
    verification: {
      opportunityId: 'opp-afdb-ibrahim-fellowship',
      state: 'verified',
      source: 'mo.ibrahim.foundation / afdb.org',
      sourceUrl: 'https://mo.ibrahim.foundation',
      organization: 'Mo Ibrahim Foundation & AfDB',
      lastVerified: '2026-10-25',
      reviewer: 'North Policy & Finance Curators',
      isStale: false,
    },
  },

  // 6. ARCHITECTURE / ENGINEERING / DESIGN: HOLCIM / RIBA SUSTAINABLE URBAN DESIGN GRANT
  {
    id: 'opp-riba-holcim-grant',
    type: 'Grant',
    title: 'Next-Generation Sustainable Architecture & Infrastructure Research Grant ($15,000)',
    organization: 'Holcim Foundation & RIBA Research Trust',
    summary: 'Non-dilutive research and design grant for emerging architects and civil/structural engineers tackling climate-resilient urban housing and infrastructure.',
    targetCareerIds: ['architecture', 'engineering'],
    targetDestinationIds: 'all',
    deadline: '2027-02-10',
    isDeadlineVerified: true,
    eligibilityRules: [
      {
        id: 'er-arch-1',
        description: 'Open to architecture and engineering students or recent graduates within 5 years of qualification.',
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['practical-experience', 'research-output'],
    facts: {
      gapsClosed: 8,
      credibility: 8,
      funding: 8,
      networkAndMentor: 7,
      impactAlignment: 9,
      disruptionCost: 2,
      delayToPayoff: 3,
    },
    lowFitReasons: ['Requires CAD/BIM visual boards and climate performance calculations at submission'],
    prepTaskTemplates: [
      { title: 'Assemble 4-board architectural/structural design & climate analysis sheet', effortHours: 8 },
      { title: 'Write 800-word project methodology and budget breakdown', effortHours: 3 },
    ],
    verification: {
      opportunityId: 'opp-riba-holcim-grant',
      state: 'verified',
      source: 'holcimfoundation.org / architecture.com',
      sourceUrl: 'https://www.holcimfoundation.org',
      organization: 'Holcim Foundation for Sustainable Construction',
      lastVerified: '2026-10-29',
      reviewer: 'North Built-Environment Curators',
      isStale: false,
    },
  },

  // 7. UNVERIFIED DISCOVERY ITEM (Demonstrates OP-5 & OP-6: High raw facts, but UNVERIFIED so capped at Normal!)
  {
    id: 'opp-unverified-ai-health-grant',
    type: 'Grant',
    title: 'Global Frontier Career Accelerator & Exam Fee Waiver Grant (Newly Discovered)',
    organization: 'International Career Mobility Initiative (Pending Verification)',
    summary: 'Newly discovered external grant claiming $5,000 in licensing exam fee waivers (USMLE/PLAB/SQE/ICAN/AWS) and mentorship pairing. Entered via automated discovery queue.',
    targetCareerIds: 'all',
    targetDestinationIds: 'all',
    deadline: 'Cycle Q1 2027 (Exact Date Unconfirmed)',
    isDeadlineVerified: false, // OP-5: UI must show "Verification required", never present as fact!
    eligibilityRules: [
      {
        id: 'er-unv-1',
        description: 'Early-career applicants from Africa pursuing professional licensure or technical specialization.',
        isRuleVerified: false, // OP-5
      },
    ],
    closesGapTags: ['licensing-exam', 'practical-experience', 'research-output'],
    facts: {
      gapsClosed: 9,
      credibility: 9,
      funding: 9,
      networkAndMentor: 8,
      impactAlignment: 8,
      disruptionCost: 1,
      delayToPayoff: 2,
    },
    lowFitReasons: [
      'Unverified external discovery: do not pay any application fee or rely on this deadline until verified by a North curator (OP-6)',
    ],
    prepTaskTemplates: [
      { title: 'Verify primary organization domain and past cohort alumni before submitting personal data', effortHours: 1 },
    ],
    verification: {
      opportunityId: 'opp-unverified-ai-health-grant',
      state: 'unverified', // OP-6: Must cap at Normal until promoted to 'verified' in /curator!
      source: 'Automated Discovery Feed (Pending Primary Source Audit)',
      sourceUrl: 'https://pending-verification.example.org',
      organization: 'International Career Mobility Initiative',
      lastVerified: 'Never (Awaiting Curator Check)',
      reviewer: 'Unassigned (In /curator Queue)',
      isStale: false,
      reviewNotes: 'Raw score would be Exceptional, but OP-6 caps this at Normal until a curator verifies source, org, and deadline.',
    },
  },

  // 8. LOW-FIT / HIGH-DISRUPTION UNPAID OPPORTUNITY (Demonstrates LV-8 Low-Fit Reason & Maximizer vs Stability Seeker contrast)
  {
    id: 'opp-unpaid-prestige-externship',
    type: 'Clinical',
    title: 'Unpaid Overseas Prestige Observership & Honors Symposium (Self-Funded)',
    organization: 'Metropolitan Honors Institute',
    summary: '4-week in-person overseas observership and symposium offering a high-prestige certificate and senior networking dinner, but zero stipend, no visa fee coverage, and full self-funded travel/accommodation.',
    targetCareerIds: 'all',
    targetDestinationIds: 'all',
    deadline: '2027-04-01',
    isDeadlineVerified: true,
    eligibilityRules: [
      {
        id: 'er-lowfit-1',
        description: 'Applicant must cover 100% of international airfare, visa fees, and 4 weeks of accommodation.',
        disallowedConstraintTag: 'constraint-needs-funding', // Fails Stage 3 Eligibility if user has financial constraint!
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['practical-experience'],
    facts: {
      gapsClosed: 5,
      credibility: 8,
      funding: 0,
      networkAndMentor: 7,
      impactAlignment: 3,
      disruptionCost: 9,
      delayToPayoff: 8,
    },
    lowFitReasons: [
      'Unpaid programme requiring ~$3,200+ in self-funded travel and accommodation',
      'Observership-only status does not count toward mandatory hands-on licensing hours in several jurisdictions',
    ],
    prepTaskTemplates: [
      { title: 'Audit cost-to-benefit ratio against local paid alternatives before committing funds', effortHours: 2 },
    ],
    verification: {
      opportunityId: 'opp-unpaid-prestige-externship',
      state: 'verified',
      source: 'Metropolitan Honors Registry 2026',
      sourceUrl: 'https://example.org/honors-symposium',
      organization: 'Metropolitan Honors Institute',
      lastVerified: '2026-10-12',
      reviewer: 'North Curation Team',
      isStale: false,
    },
  },

  // 9. UNDER-REVIEW ITEM FOR THE CURATOR QUEUE
  {
    id: 'opp-daaa-daad-stem-scholarship',
    type: 'Scholarship',
    title: 'DAAD EPOS & In-Country/In-Region Postgraduate Scholarship',
    organization: 'German Academic Exchange Service (DAAD)',
    summary: 'Full scholarship for development-related postgraduate courses and STEM/Policy research in Germany or partner African centers of excellence.',
    targetCareerIds: ['engineering', 'cs-it', 'ai-emerging-tech', 'healthcare-nursing', 'political-science', 'architecture'],
    targetDestinationIds: ['germany', 'nigeria', 'kenya', 'ghana', 'south-africa'],
    deadline: '2027-01-15',
    isDeadlineVerified: false,
    eligibilityRules: [
      {
        id: 'er-daad-1',
        description: 'Bachelor degree completed with above-average results and 1–2 years of relevant professional/practical experience.',
        isRuleVerified: true,
      },
    ],
    closesGapTags: ['degree-completed', 'research-output', 'language-verified'],
    facts: {
      gapsClosed: 9,
      credibility: 9,
      funding: 10,
      networkAndMentor: 8,
      impactAlignment: 9,
      disruptionCost: 4,
      delayToPayoff: 5,
    },
    lowFitReasons: ['Course-specific deadlines vary by partner university; requires verifying exact intake date'],
    prepTaskTemplates: [
      { title: 'Download DAAD EPOS course deadline matrix and select up to 3 programmes', effortHours: 2 },
      { title: 'Prepare Europass CV and employer/academic recommendation letters', effortHours: 3 },
    ],
    verification: {
      opportunityId: 'opp-daaa-daad-stem-scholarship',
      state: 'under_review',
      source: 'daad.de/en/study-and-research-in-germany',
      sourceUrl: 'https://www.daad.de',
      organization: 'DAAD Germany',
      lastVerified: '2026-03-18',
      reviewer: 'Pending Annual Cycle Check (/curator)',
      isStale: true,
      reviewNotes: '2027/28 university-specific deadline PDF is under curator verification.',
    },
  },
];
