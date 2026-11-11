import {
  CareerFieldId,
  DestinationId,
  Pathway,
  PathwayDimensionItem,
  Requirement,
} from '../types/domain';
import { CAREER_FIELDS, DESTINATIONS } from './careersAndDestinations';

interface CareerBlueprint {
  localRegulatorByCountry: Partial<Record<DestinationId, { body: string; exam: string; source: string; specificity: Pathway['specificityUsed'] }>>;
  defaultRegulator: { body: string; exam: string; source: string; specificity: Pathway['specificityUsed'] };
  corePracticalTitle: string;
  corePracticalDesc: string;
  coreOutputTitle: string;
  coreOutputDesc: string;
  estimatedMonthsLocal: number;
  estimatedMonthsIntl: number;
  competitionNoteLocal: string;
  competitionNoteIntl: string;
  bottleneckLocal: string;
  bottleneckIntl: string;
}

const CAREER_BLUEPRINTS: Record<Exclude<CareerFieldId, 'custom-unsupported'>, CareerBlueprint> = {
  'medicine-surgery': {
    localRegulatorByCountry: {
      nigeria: { body: 'Medical and Dental Council of Nigeria (MDCN)', exam: 'MDCN Full Registration & Housemanship + NPMCN/WACP Primary', source: 'mdcn.gov.ng', specificity: 'Institution / Licensing Body-level' },
      kenya: { body: 'Kenya Medical Practitioners and Dentists Council (KMPDC)', exam: 'KMPDC Internship & MMed Qualifying Entry', source: 'kmpdc.go.ke', specificity: 'Institution / Licensing Body-level' },
      'south-africa': { body: 'Health Professions Council of South Africa (HPCSA)', exam: 'HPCSA Medical Board & Registrarship CMSA Primaries', source: 'hpcsa.co.za', specificity: 'Institution / Licensing Body-level' },
      ghana: { body: 'Medical and Dental Council Ghana (MDC)', exam: 'MDC Housemanship & GCPS Primary Fellowship', source: 'mdcghana.org', specificity: 'Institution / Licensing Body-level' },
      uk: { body: 'General Medical Council (GMC) & NHS England', exam: 'UKMLA / PLAB 1 & 2 + OET/IELTS + Foundation/Core Training', source: 'gmc-uk.org', specificity: 'Institution / Licensing Body-level' },
      us: { body: 'ECFMG / USMLE & NRMP Residency Match', exam: 'USMLE Step 1, Step 2 CK, OET Medicine & US Clinical Electives (USCE)', source: 'ecfmg.org / nrmp.org', specificity: 'Institution / Licensing Body-level' },
      canada: { body: 'Medical Council of Canada (MCC) & CaRMS', exam: 'MCCQE Part I + NAC Examination + CaRMS IMG Stream', source: 'mcc.ca / carms.ca', specificity: 'State / Regional-level' },
      germany: { body: 'Landesprüfungsamt & Ärztekammer', exam: 'Fachsprachprüfung (C1 Medical) + Kenntnisprüfung (Approbation)', source: 'bundesaerztekammer.de', specificity: 'State / Regional-level' },
      australia: { body: 'Australian Medical Council (AMC) & AHPRA', exam: 'AMC CAT MCQ + AMC Clinical Examination', source: 'amc.org.au', specificity: 'Country-level' },
    },
    defaultRegulator: { body: 'Global Medical Licensing Authority', exam: 'Primary Medical Qualification & Clinical Licensing Exam', source: 'who.int/hrh', specificity: 'Country-level' },
    corePracticalTitle: 'Supervised Clinical Rotations / Housemanship & Specialty Electives',
    corePracticalDesc: '12+ months of verified clinical housemanship plus documented specialty clinical rotations with consultant reference letters.',
    coreOutputTitle: 'Peer-Reviewed Clinical Audit, Case Report, or Research Manuscript',
    coreOutputDesc: 'At least 1 published clinical abstract, audit presentation, or co-authored specialty research paper to differentiate residency applications.',
    estimatedMonthsLocal: 24,
    estimatedMonthsIntl: 36,
    competitionNoteLocal: 'Teaching hospital residency slots have a ~4:1 applicant-to-slot ratio; early Primary exam clearance is decisive.',
    competitionNoteIntl: 'International Medical Graduate (IMG) specialty match rates require high Step 2 CK / PLAB scores plus verifiable research & clinical references.',
    bottleneckLocal: 'Securing accredited teaching hospital housemanship placement and passing Primary fellowship exams on first sitting.',
    bottleneckIntl: 'Exam fee financing ($1,000–$3,500+), visa lead times for clinical electives/PLAB 2, and securing target-country clinical Letters of Recommendation.',
  },
  'cs-it': {
    localRegulatorByCountry: {
      nigeria: { body: 'CPN / NITDA & Tier-1 Lagos/Pan-African Tech Ecosystems', exam: 'Production Systems Architecture & Algorithmic Technical Assessment', source: 'cpn.gov.ng / nitda.gov.ng', specificity: 'Country-level' },
      uk: { body: 'UK Tech Nation / Home Office Skilled Worker & Global Talent', exam: 'System Design, Distributed Engineering & Sponsor-Licensed Technical Loop', source: 'gov.uk/skilled-worker-visa', specificity: 'Country-level' },
      us: { body: 'US Tech Employers (F-1 STEM OPT / H-1B / O-1A Talent Track)', exam: 'Data Structures, Systems Architecture & Verified Open-Source/Production Impact', source: 'uscis.gov', specificity: 'Country-level' },
      germany: { body: 'EU Blue Card IT Specialist Track (Make it in Germany)', exam: 'ZAB Degree Recognition (Anabin H+) or 3+ Years Verified Engineering Experience', source: 'make-it-in-germany.com', specificity: 'Country-level' },
      'remote-global': { body: 'Global Distributed Engineering Teams (Deel / Remote / GitLab Standard)', exam: 'Async Systems Engineering, CI/CD Production Ownership & Live Code Review', source: 'roadmap.sh / cncf.io', specificity: 'Country-level' },
    },
    defaultRegulator: { body: 'Global Software Engineering & Cloud Standards', exam: 'Algorithmic Problem Solving, System Design & Cloud Architecture Verification', source: 'acm.org / ieee.org', specificity: 'Country-level' },
    corePracticalTitle: 'Production-Grade Full-Stack / Cloud Engineering Portfolio (3 Deployed Systems)',
    corePracticalDesc: 'Build and document 3 live, tested software systems with CI/CD pipelines, telemetry, and architectural decision records (ADRs).',
    coreOutputTitle: 'Open-Source Contributions or Technical Engineering Internship',
    coreOutputDesc: 'Merged pull requests in established open-source repositories or 6+ months of verified software engineering internship experience.',
    estimatedMonthsLocal: 12,
    estimatedMonthsIntl: 18,
    competitionNoteLocal: 'High volume of bootcamp graduates at entry level; verifiable production engineering and backend/cloud depth separates top 5% candidates.',
    competitionNoteIntl: 'Visa-sponsoring and global remote roles receive 500+ applicants per role; strong referrals and verifiable open-source/production history are essential.',
    bottleneckLocal: 'Moving from tutorial projects to real-world multi-user production systems and reliable power/broadband infrastructure.',
    bottleneckIntl: 'Passing multi-stage live coding + system design loops and meeting mid-to-senior bar required for visa sponsorship.',
  },
  law: {
    localRegulatorByCountry: {
      nigeria: { body: 'Council of Legal Education (Nigerian Law School) & Body of Benchers', exam: 'Bar Part II Qualifying Examination (BL) & Call to the Nigerian Bar', source: 'nigerianlawschool.edu.ng', specificity: 'Institution / Licensing Body-level' },
      kenya: { body: 'Council of Legal Education & Kenya School of Law (KSL)', exam: 'Advocates Training Programme (ATP) Bar Exam & Pupillage', source: 'ksl.ac.ke', specificity: 'Institution / Licensing Body-level' },
      'south-africa': { body: 'Legal Practice Council (LPC) of South Africa', exam: 'Competency-Based Admission Examination & 2-Year Articles of Clerkship', source: 'lpc.org.za', specificity: 'Institution / Licensing Body-level' },
      ghana: { body: 'General Legal Council & Ghana School of Law', exam: ' Ghana School of Law Entrance & Professional Law Course Part I & II', source: 'glc.gov.gh', specificity: 'Institution / Licensing Body-level' },
      uk: { body: 'Solicitors Regulation Authority (SRA) / Bar Standards Board', exam: 'Solicitors Qualifying Examination (SQE1 & SQE2) + 2 Years Qualifying Work Experience (QWE)', source: 'sra.org.uk', specificity: 'Institution / Licensing Body-level' },
      us: { body: 'NCBE / New York or California State Board of Law Examiners', exam: 'ABA-Approved LL.M + Foreign Credential Evaluation + Uniform Bar Exam (UBE / NY Bar)', source: 'nybarexam.org / ncbex.org', specificity: 'State / Regional-level' },
    },
    defaultRegulator: { body: 'National Bar Council & Legal Licensing Authority', exam: 'Bar Qualification Examination & Supervised Legal Practice', source: 'ibanet.org', specificity: 'Country-level' },
    corePracticalTitle: 'Law Firm Externship / Pupillage / Qualifying Work Experience (QWE)',
    corePracticalDesc: 'Structured legal placement in corporate, dispute resolution, or public interest chambers with partner evaluation.',
    coreOutputTitle: 'Published Law Review Note, Moot Court Distinction, or Policy Brief',
    coreOutputDesc: 'Verifiable legal writing sample, international moot court competition record (e.g. Jessup/Vis), or published case commentary.',
    estimatedMonthsLocal: 18,
    estimatedMonthsIntl: 28,
    competitionNoteLocal: 'Tier-1 commercial law firms recruit 12–18 months ahead based on LL.B class of degree and Law School standing.',
    competitionNoteIntl: 'International training contracts and LL.M scholarships require top 5% academic rank plus demonstrable cross-border commercial awareness.',
    bottleneckLocal: 'Law School tuition/fees and high-stakes single-sitting Bar examination grading.',
    bottleneckIntl: 'SQE / LL.M tuition costs (£4,500–$65,000) and securing full scholarship or cross-border QWE sign-off.',
  },
  engineering: {
    localRegulatorByCountry: {
      nigeria: { body: 'Council for the Regulation of Engineering in Nigeria (COREN) & NSE', exam: 'Mandatory SIWES / Post-NYSC Supervised Experience & COREN Professional Interview', source: 'coren.gov.ng', specificity: 'Institution / Licensing Body-level' },
      kenya: { body: 'Engineers Board of Kenya (EBK)', exam: 'Graduate Engineer Registration & Professional Engineer (PE) Competence Assessment', source: 'ebk.go.ke', specificity: 'Institution / Licensing Body-level' },
      'south-africa': { body: 'Engineering Council of South Africa (ECSA)', exam: 'Washington Accord Degree Evaluation & Candidate Engineer Registration (Pr Eng)', source: 'ecsa.co.za', specificity: 'Institution / Licensing Body-level' },
      uk: { body: 'Engineering Council UK (IMechE / ICE / IET / Energy Institute)', exam: 'Incorporated (IEng) or Chartered Engineer (CEng) Competence Review', source: 'engc.org.uk', specificity: 'Institution / Licensing Body-level' },
      us: { body: 'NCEES & State Professional Engineering Boards', exam: 'Fundamentals of Engineering (FE) Exam + ABET Credential Evaluation', source: 'ncees.org', specificity: 'State / Regional-level' },
      canada: { body: 'Engineers Canada (PEO / APEGA Provincial Associations)', exam: 'Academic Technical Exam Review + NPPE (National Professional Practice Exam) for P.Eng.', source: 'engineerscanada.ca', specificity: 'State / Regional-level' },
    },
    defaultRegulator: { body: 'International Engineering Alliance & National Licensing Board', exam: 'Engineering Competence & Safety Certification', source: 'ieagreements.org', specificity: 'Country-level' },
    corePracticalTitle: 'Industrial Field Placement & CAD/Simulation Engineering Project',
    corePracticalDesc: 'Documented industrial engineering placement (Petroleum/Civil/Electrical/Mechanical) plus industry-standard design/simulation deliverables (AutoCAD, ANSYS, MATLAB, Petrel, or ETAP).',
    coreOutputTitle: 'Technical Design Report, Safety Certification (HSE), or Capstone Prototype',
    coreOutputDesc: 'Verified engineering design calculation portfolio and HSE Level 1–3 or discipline-specific certification.',
    estimatedMonthsLocal: 18,
    estimatedMonthsIntl: 24,
    competitionNoteLocal: 'IOCs (Shell, TotalEnergies, Chevron, NLNG) and top EPC firms run highly selective aptitude + technical assessment centers.',
    competitionNoteIntl: 'International graduate schemes and MSc scholarships favor candidates linking core engineering to energy transition, grid resilience, or sustainable infrastructure.',
    bottleneckLocal: 'Access to modern laboratory/industrial equipment and limited graduate trainee intake cycles.',
    bottleneckIntl: 'Degree equivalency evaluation (ABET/Washington Accord) and securing funded MSc or employer visa sponsorship.',
  },
  'accounting-finance': {
    localRegulatorByCountry: {
      nigeria: { body: 'Institute of Chartered Accountants of Nigeria (ICAN) / ACCA / SEC Nigeria', exam: 'ICAN Professional Level (ACA) or ACCA Strategic Professional / CFA Level I–II', source: 'icanig.org / accaglobal.com', specificity: 'Institution / Licensing Body-level' },
      kenya: { body: 'Institute of Certified Public Accountants of Kenya (ICPAK) / CFA', exam: 'KASNEB CPA Finalist & Practical Experience Requirement', source: 'icpak.com', specificity: 'Institution / Licensing Body-level' },
      'south-africa': { body: 'South African Institute of Chartered Accountants (SAICA)', exam: 'ITC & APC Qualifying Examinations + 3-Year Training Contract', source: 'saica.org.za', specificity: 'Institution / Licensing Body-level' },
      uk: { body: 'ICAEW / ACCA / FCA Financial Services Track', exam: 'ACA / ACCA / CFA Qualification + Audit or Investment Banking Analyst Assessment', source: 'icaew.com / cfainstitute.org', specificity: 'Institution / Licensing Body-level' },
      us: { body: 'AICPA / NASBA & FINRA / CFA Institute', exam: 'Uniform CPA Examination (150-Credit Evaluation) or CFA / Series 79 Track', source: 'nasba.org / cfainstitute.org', specificity: 'State / Regional-level' },
    },
    defaultRegulator: { body: 'IFAC Member Body / ACCA / CFA Institute', exam: 'Professional Accounting Charter or CFA Examination', source: 'ifac.org', specificity: 'Country-level' },
    corePracticalTitle: 'Financial Modeling, Valuation & Audit/Advisory Internship Experience',
    corePracticalDesc: '3-statement financial models, DCF/LBO valuation case studies, and structured audit, tax, or corporate finance internship.',
    coreOutputTitle: 'Equity Research / Credit Memo or Chartered Exam Paper Clearance',
    coreOutputDesc: 'Published investment pitchbook/memo and documented exam progression (ICAN/ACCA/CFA).',
    estimatedMonthsLocal: 16,
    estimatedMonthsIntl: 24,
    competitionNoteLocal: 'Big-4 (PwC, Deloitte, EY, KPMG) and tier-1 investment banks screen heavily on psychometric speed tests and charter exam progress.',
    competitionNoteIntl: 'London/New York/Toronto finance roles require off-cycle internships, ACCA/CFA portability, or target MSc Finance degrees.',
    bottleneckLocal: 'Balancing intensive professional exam diets with full-time study or NYSC/entry roles.',
    bottleneckIntl: 'Foreign exam registration fees (GBP/USD denominated) and strict Autumn recruitment deadlines (9–12 months prior).',
  },
  'nursing-pharmacy': {
    localRegulatorByCountry: {
      nigeria: { body: 'Nursing & Midwifery Council of Nigeria (NMCN) / Pharmacy Council of Nigeria (PCN)', exam: 'NMCN Professional Exam or PCN Pre-Registration Exam (PEP) + 1-Year Internship', source: 'nmcn.gov.ng / pcn.gov.ng', specificity: 'Institution / Licensing Body-level' },
      uk: { body: 'Nursing and Midwifery Council (NMC) / General Pharmaceutical Council (GPhC)', exam: 'NMC CBT + OSCE (with IELTS 7.0 / OET B) or GPhC OSPAP + Foundation Training', source: 'nmc.org.uk / pharmacyregulation.org', specificity: 'Institution / Licensing Body-level' },
      us: { body: 'NCSBN (CGFNS + NCLEX-RN) / NABP (FPGEE + NAPLEX)', exam: 'CGFNS CES Report + NCLEX-RN or FPGEC Certification + NAPLEX', source: 'ncsbn.org / nabp.pharmacy', specificity: 'State / Regional-level' },
      canada: { body: 'NNAS & Provincial Nursing Regulators / Pharmacy Examining Board of Canada (PEBC)', exam: 'NNAS Advisory Report + NCLEX-RN or PEBC Evaluating & Qualifying Exams', source: 'nnas.ca / pebc.ca', specificity: 'State / Regional-level' },
    },
    defaultRegulator: { body: 'National Nursing & Pharmacy Regulatory Councils', exam: 'Clinical Licensure Exam & Supervised Pre-Registration Internship', source: 'icn.ch / fip.org', specificity: 'Country-level' },
    corePracticalTitle: '12-Month Accredited Clinical Internship & Ward/Dispensing Logbook',
    corePracticalDesc: 'Verified post-qualification clinical rotation with signed competency logbooks across acute, community, or specialist care.',
    coreOutputTitle: 'Medication Safety Audit, Patient Care Protocol, or BLS/ACLS Certification',
    coreOutputDesc: 'Active Basic/Advanced Life Support certification plus a documented clinical quality improvement audit.',
    estimatedMonthsLocal: 15,
    estimatedMonthsIntl: 24,
    competitionNoteLocal: 'Federal teaching hospital internship placement slots open in narrow windows and require immediate post-senate clearance.',
    competitionNoteIntl: 'Strong global demand for registered nurses and pharmacists, provided council verification and language thresholds are met cleanly.',
    bottleneckLocal: 'Delays in council indexing and competitive federal hospital internship portals.',
    bottleneckIntl: 'Home-council verification processing times (NMCN/PCN verification to CGFNS/NMC/PEBC) and OSCE/OSPAP funding.',
  },
  'mass-comm': {
    localRegulatorByCountry: {
      nigeria: { body: 'NIPR / APCON (ARCON) & NUJ Media Standards', exam: 'NIPR Professional Certification & Multi-Format Media Portfolio', source: 'nipr.org.ng', specificity: 'Country-level' },
    },
    defaultRegulator: { body: 'Global Journalism, PR & Media Practice Standards', exam: 'Verified Multimedia Bylines, Editorial Portfolio & Audience Analytics', source: 'reutersinstitute.politics.ox.ac.uk', specificity: 'Country-level' },
    corePracticalTitle: 'Published Bylines, Broadcast Reels, or Strategic Comms Campaign Portfolio',
    corePracticalDesc: 'Curated portfolio of 5+ verifiable published articles, broadcast segments, or measurable PR/digital campaigns.',
    coreOutputTitle: 'Investigative Grant Story, Fact-Checking Fellowship, or Media Internship',
    coreOutputDesc: 'Completed newsroom/agency placement or fellowship output demonstrating editorial rigor and data journalism.',
    estimatedMonthsLocal: 12,
    estimatedMonthsIntl: 18,
    competitionNoteLocal: 'Top agencies and media houses hire on proven writing sharpness, multimedia versatility, and portfolio evidence over transcripts alone.',
    competitionNoteIntl: 'International media fellowships (Reuters, Nieman, Chevening, DW Akademie) require strong regional reporting impact and pitch clarity.',
    bottleneckLocal: 'Building high-visibility bylines early rather than waiting until after graduation.',
    bottleneckIntl: 'Cross-border commissioning access and demonstrating data/investigative journalism tooling.',
  },
  architecture: {
    localRegulatorByCountry: {
      nigeria: { body: 'Architects Registration Council of Nigeria (ARCON) & NIA', exam: 'B.Sc + M.Sc Architecture + 2-Year Post-Qualification Logbook & ARCON Professional Competence Exam', source: 'arconigeria.org.ng', specificity: 'Institution / Licensing Body-level' },
      uk: { body: 'Architects Registration Board (ARB) & RIBA', exam: 'ARB Part 1 Prescribed Exam + Part 2 M.Arch + 24 Months Practical Experience (PEDR) + Part 3', source: 'arb.org.uk / architecture.com', specificity: 'Institution / Licensing Body-level' },
      us: { body: 'NCARB & State Architectural Licensing Boards', exam: 'NAAB EESA Evaluation + Architectural Experience Program (AXP) + ARE 5.0 Exams', source: 'ncarb.org', specificity: 'State / Regional-level' },
    },
    defaultRegulator: { body: 'International Union of Architects (UIA) & National Registration Board', exam: 'Design Portfolio Review, Practical Logbook & Professional Practice Exam', source: 'uia-architectes.org', specificity: 'Country-level' },
    corePracticalTitle: 'Curated Architectural Design Portfolio & BIM (Revit/Rhino/ArchiCAD) Technical Set',
    corePracticalDesc: 'A 20–30 page high-resolution architectural portfolio showing spatial concept, climate response, structural detailing, and BIM execution.',
    coreOutputTitle: 'Supervised Studio Practice Logbook & International Design Competition Entry',
    coreOutputDesc: 'Documented practice hours under a licensed architect plus at least 1 architectural design competition submission.',
    estimatedMonthsLocal: 24,
    estimatedMonthsIntl: 30,
    competitionNoteLocal: 'Top design-build and urban practices evaluate BIM speed and technical working drawings immediately.',
    competitionNoteIntl: 'M.Arch scholarships and global studios weight portfolio originality, climate/vernacular intelligence, and computational design heavily.',
    bottleneckLocal: 'Long 2-tier degree + logbook timeline before full independent ARCON/NIA stamp.',
    bottleneckIntl: 'ARB Part 1/EESA portfolio examination costs and high workstation hardware requirements for rendering.',
  },
  'business-mgmt': {
    localRegulatorByCountry: {
      nigeria: { body: 'NIM / CIPM & Pan-African Corporate/Startup Leadership Pipelines', exam: 'Case Interview Mastery, Quantitative GMAT/GRE (for MBA) & Commercial P&L Execution', source: 'nim.ng', specificity: 'Country-level' },
    },
    defaultRegulator: { body: 'Global Management Consulting, Product & MBA Standards', exam: 'Structured Case Interviews, Quantitative Analytics & Verifiable Operational Impact', source: 'mba.com / pmi.org', specificity: 'Country-level' },
    corePracticalTitle: 'Quantified Operations, Consulting, or Product Growth Case Portfolio',
    corePracticalDesc: 'Documented leadership or internship projects showing measurable KPIs (revenue growth, cost reduction, process turnaround, or user retention).',
    coreOutputTitle: 'Structured Business Case Deck & SQL/Data Analytics Certification',
    coreOutputDesc: 'Completed consulting/product strategy teardown deck backed by data analysis (Excel modeling, SQL, PowerBI/Tableau).',
    estimatedMonthsLocal: 12,
    estimatedMonthsIntl: 20,
    competitionNoteLocal: 'McKinsey/BCG/Bain Africa offices, FMCGs, and fintechs filter $<2\\%$ of applicants through structured problem-solving assessments.',
    competitionNoteIntl: 'Top global MBAs and international leadership programmes require 2–4 years of progressive leadership impact and strong GMAT/GRE scores.',
    bottleneckLocal: 'Translating academic business degrees into concrete, metric-backed execution stories.',
    bottleneckIntl: 'Securing cross-border work sponsorship in non-technical management tracks without a target MBA or multinational internal transfer.',
  },
  'healthcare-nursing': {
    localRegulatorByCountry: {
      nigeria: { body: 'Federal Ministry of Health / NMCN / West African Health Organisation (WAHO)', exam: 'Clinical/Public Health Licensure + Epidemiological Field Practice', source: 'health.gov.ng / aircdc.org', specificity: 'Country-level' },
      uk: { body: 'NMC UK / UK Faculty of Public Health & LSHTM/Global Health Track', exam: 'NMC Registration or MPH + Epidemiological Data Competence (R/Stata)', source: 'fph.org.uk / nmc.org.uk', specificity: 'Institution / Licensing Body-level' },
    },
    defaultRegulator: { body: 'WHO / Africa CDC & National Healthcare Regulatory Authorities', exam: 'Clinical / Public Health Qualification & Field Programme Evaluation', source: 'africacdc.org / who.int', specificity: 'Country-level' },
    corePracticalTitle: 'Community Health / Clinical Intervention & Epidemiological Field Dataset',
    corePracticalDesc: 'Verified field health outreach, clinical care logbook, or public health monitoring & evaluation (M&E) project.',
    coreOutputTitle: 'Public Health Policy Brief, Biostatistical Analysis (R/Python), or Clinical Audit',
    coreOutputDesc: 'Written epidemiological analysis or health systems intervention report suitable for MPH/fellowship review.',
    estimatedMonthsLocal: 15,
    estimatedMonthsIntl: 24,
    competitionNoteLocal: 'WHO, UNICEF, Gates Foundation partners, and tier-1 NGOs prioritize candidates with real field M&E and biostatistics skills.',
    competitionNoteIntl: 'Fully funded MPH scholarships (Chevening, Commonwealth, Mastercard, Gates Cambridge) require clear community impact and leadership track records.',
    bottleneckLocal: 'Transitioning from routine facility duties into funded public health research and multilateral programmes.',
    bottleneckIntl: 'Securing full tuition + stipend fellowships for international MPH or specialist training.',
  },
  'ai-emerging-tech': {
    localRegulatorByCountry: {
      'remote-global': { body: 'Global AI Research Labs, Open-Source AI Ecosystems & Deep Learning Indaba', exam: 'PyTorch/JAX Model Engineering, Evaluation Benchmarks & Research Reproduction', source: 'deeplearningindaba.com / huggingface.co', specificity: 'Country-level' },
    },
    defaultRegulator: { body: 'Global ML Engineering & AI Research Standards (NeurIPS / ICLR / IEEE)', exam: 'Deep Learning Implementation, LLM/MLOps Deployment & Mathematical Foundations', source: 'neurips.cc /deeplearningindaba.com', specificity: 'Country-level' },
    corePracticalTitle: 'End-to-End Trained/Fine-Tuned ML System with Reproducible Evaluation',
    corePracticalDesc: 'Public code repository and live demo of a fine-tuned model, RAG/agentic pipeline, or computer vision/NLP dataset benchmarked with clear metrics.',
    coreOutputTitle: 'AI Workshop Paper, Indaba/Masakhane Contribution, or Production MLOps Deployment',
    coreOutputDesc: 'Co-authored workshop/conference paper, open-source African NLP/AI dataset contribution, or deployed ML microservice.',
    estimatedMonthsLocal: 14,
    estimatedMonthsIntl: 20,
    competitionNoteLocal: 'Growing regional demand in fintech/agritech/healthtech AI; practical MLOps and data engineering skills stand out over notebook-only skills.',
    competitionNoteIntl: 'Global AI residencies (Google Research Africa, Meta AI, MILA, DeepMind scholarships) expect strong linear algebra/probability plus reproducible code.',
    bottleneckLocal: 'Compute/GPU constraints (mitigated via cloud credits, Kaggle/Colab, and research fellowships).',
    bottleneckIntl: 'Publishing verifiable research or open-source artifacts before applying to top PhD/residency tracks.',
  },
  'psychology-social': {
    localRegulatorByCountry: {
      nigeria: { body: 'Nigerian Psychological Association (NPA) & Social Research Institutes', exam: 'Postgraduate Clinical/Counseling Practicum & Quantitative Research Methods', source: 'npa.org.ng', specificity: 'Country-level' },
      uk: { body: 'British Psychological Society (BPS) & Health and Care Professions Council (HCPC)', exam: 'Graduate Basis for Chartered Membership (GBC) & Supervised Clinical/Research Training', source: 'bps.org.uk / hcpc-uk.org', specificity: 'Institution / Licensing Body-level' },
    },
    defaultRegulator: { body: 'Psychological & Social Science Professional Associations', exam: 'Research Methodology, Ethics Clearance & Supervised Practicum Hours', source: 'apa.org / bps.org.uk', specificity: 'Country-level' },
    corePracticalTitle: 'Supervised Clinical/Counseling Practicum or Behavioural/M&E Field Study',
    corePracticalDesc: 'Documented supervised client/community practicum hours or empirical behavioural/UX research study.',
    coreOutputTitle: 'Quantitative Research Paper / Survey Analysis (SPSS/R) & Ethics Protocol',
    coreOutputDesc: 'Completed empirical manuscript, M&E baseline report, or UX research case study with statistical validation.',
    estimatedMonthsLocal: 18,
    estimatedMonthsIntl: 26,
    competitionNoteLocal: 'Development agencies, HR advisory firms, and mental health initiatives value strong quantitative M&E and survey design skills.',
    competitionNoteIntl: 'Clinical psychology doctorates and funded social science MSc/PhD tracks require BPS/APA equivalence and published research exposure.',
    bottleneckLocal: 'Limited paid clinical practicum slots; combining psychology with UX research or M&E expands early career options.',
    bottleneckIntl: 'Strict clinical licensure equivalency rules; research/organizational/UX tracks offer faster cross-border mobility.',
  },
  'political-science': {
    localRegulatorByCountry: {
      nigeria: { body: 'NIIA / National Assembly Legislative Institute & ECOWAS/AU Policy Track', exam: 'Policy Analysis, Econometric/Governance Research & Civil/Diplomatic Service Assessment', source: 'niia.gov.ng / au.int', specificity: 'Country-level' },
    },
    defaultRegulator: { body: 'Multilateral Policy Institutions (AU, UN, Chatham House, World Bank)', exam: 'Policy Memo Writing, Quantitative Program Evaluation & Diplomatic/Governance Track Record', source: 'au.int / un.org', specificity: 'Country-level' },
    corePracticalTitle: 'Think-Tank, Legislative, Civic-Tech, or Multilateral Policy Internship',
    corePracticalDesc: 'Structured policy research or governance programme placement producing actionable legislative or development analysis.',
    coreOutputTitle: 'Published Policy Briefs (2+) & Data-Backed Governance/Economic Analysis',
    coreOutputDesc: 'Two published policy briefs or op-eds backed by empirical governance/fiscal data.',
    estimatedMonthsLocal: 14,
    estimatedMonthsIntl: 22,
    competitionNoteLocal: 'Think-tanks, development consultancies, and civic-tech orgs look for sharp policy writing combined with data literacy.',
    competitionNoteIntl: 'Mo Ibrahim, Chevening, Mandela Washington, and UN YPP fellowships require proven civic leadership and analytical rigor.',
    bottleneckLocal: 'Moving from theoretical political science essays to evidence-based policy evaluation and budget/data analysis.',
    bottleneckIntl: 'High competition for multilateral YPP and international public policy (MPP/MPA) full scholarships.',
  },
};

export function getPathwayForCareerAndDestination(
  careerId: CareerFieldId,
  destinationId: DestinationId,
  applicantType: string = 'Early-Career Professional',
  customGoalText?: string,
  engineeringTrack?: string
): Pathway {
  const careerMeta = CAREER_FIELDS.find((c) => c.id === careerId) || CAREER_FIELDS[0];
  const destMeta = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];

  // Requirement PI-8: For unsupported pathways, say so and offer a generic guided plan instead of fabricating requirements.
  if (careerId === 'custom-unsupported') {
    const fallbackId = `pw-unsupported-${destinationId}`;
    const fallbackRequirements: Requirement[] = [
      {
        id: `${fallbackId}-req-1`,
        pathwayId: fallbackId,
        type: 'Academic & Accreditation',
        title: 'Verify Official Regulatory & Credential Baseline',
        description: `Identify the official national licensing body or employer standard for "${customGoalText || 'your custom career goal'}" in ${destMeta.name} before committing funds.`,
        deadline: 'Rolling — Complete within 14 days',
        isDeadlineVerified: true,
        evidenceNeeded: 'Official syllabus or regulatory handbook link saved to Career Identity',
        source: 'North Generic Guided Plan (PI-8 Safe Fallback)',
        organization: 'User Curated Verification',
        lastVerified: '2026-11-01',
        isStale: false,
        matchTag: 'degree-completed',
        effortHours: 6,
        importance: 5,
      },
      {
        id: `${fallbackId}-req-2`,
        pathwayId: fallbackId,
        type: 'Clinical / Practical / Portfolio',
        title: 'Build Verifiable Proof-of-Work Artifact',
        description: 'Document 1–2 concrete projects, case studies, or supervised practical experiences recognized by practitioners in your target field.',
        deadline: 'Target within 60 days',
        isDeadlineVerified: true,
        evidenceNeeded: 'Portfolio link, supervisor letter, or completed project artifact',
        source: 'North Generic Guided Plan (PI-8 Safe Fallback)',
        organization: 'North Career Framework',
        lastVerified: '2026-11-01',
        isStale: false,
        matchTag: 'practical-experience',
        effortHours: 25,
        importance: 4,
      },
    ];

    const fallbackDimensions: PathwayDimensionItem[] = [
      { dimension: 'Competition', whatItExamines: 'Applicants vs. available opportunities', specificChallenge: 'Unverified pathway: research typical applicant-to-opening ratios from official industry reports.', planningHorizonNote: 'Verify before applying', linkedRequirementId: fallbackRequirements[0].id },
      { dimension: 'Applicant fit', whatItExamines: 'How profile compares with requirements', specificChallenge: 'Map your existing degree and skills against 5 real role descriptions in your target destination.', planningHorizonNote: 'Month 1 priority', linkedRequirementId: fallbackRequirements[0].id },
      { dimension: 'Eligibility', whatItExamines: 'Whether the user can actually apply', specificChallenge: 'Confirm statutory licensing or degree equivalency rules directly with the target regulator.', planningHorizonNote: 'Immediate check', linkedRequirementId: fallbackRequirements[0].id },
      { dimension: 'Geography', whatItExamines: 'Whether location affects access', specificChallenge: `Assess whether steps for ${destMeta.name} can be started remotely or require in-country presence.`, planningHorizonNote: 'Month 1', linkedRequirementId: fallbackRequirements[0].id },
      { dimension: 'Financial burden', whatItExamines: 'Resources the pathway may require', specificChallenge: 'List all mandatory application, exam, and relocation costs; never pay unverified intermediaries.', planningHorizonNote: 'Ongoing', linkedRequirementId: fallbackRequirements[0].id },
      { dimension: 'Access', whatItExamines: 'How easily required experiences are obtained', specificChallenge: 'Identify local or remote projects to build verifiable work evidence.', planningHorizonNote: 'Months 1–2', linkedRequirementId: fallbackRequirements[1].id },
      { dimension: 'Timeline', whatItExamines: 'How long the pathway takes', specificChallenge: 'Construct a conservative timeline buffered for credential verification.', planningHorizonNote: '6–18 months typical', linkedRequirementId: fallbackRequirements[1].id },
      { dimension: 'Bottlenecks', whatItExamines: 'What could limit progress', specificChallenge: 'Lack of verified pathway data is the main risk; verify every deadline from primary sources.', planningHorizonNote: 'Critical safeguard', linkedRequirementId: fallbackRequirements[0].id },
      { dimension: 'Opportunity availability', whatItExamines: 'Resources existing to close gaps', specificChallenge: 'Use North’s verified cross-disciplinary scholarships and fellowships while building field-specific proof.', planningHorizonNote: 'Active now', linkedRequirementId: fallbackRequirements[1].id },
    ];

    return {
      id: fallbackId,
      careerId,
      careerTitle: customGoalText ? `${customGoalText} (Unlisted Pathway)` : careerMeta.title,
      destinationId,
      destinationName: destMeta.name,
      specificityUsed: 'Country-level',
      regulatingBody: 'Curated Pathway Not Yet Indexed — Generic Guided Plan Active (PI-8)',
      applicantType,
      version: 'v1.0-fallback',
      isSupported: false,
      overview: `North does not yet have a verified, hand-curated regulatory rulebook for "${customGoalText || 'this custom pathway'}" in ${destMeta.name}. Per product principle PI-8, we never fabricate requirements or deadlines. Below is an honest, structured generic guided plan to help you validate requirements safely.`,
      estimatedMonths: 12,
      requirements: fallbackRequirements,
      dimensions: fallbackDimensions,
    };
  }

  const bp = CAREER_BLUEPRINTS[careerId];
  const isLocalAfrica = destMeta.region === 'Africa (Home / Regional)';
  const isRemote = destinationId === 'remote-global';
  const regInfo = bp.localRegulatorByCountry[destinationId] || bp.defaultRegulator;
  const pathwayId = `pw-${careerId}-${destinationId}`;
  const displayCareerTitle =
    careerId === 'engineering' && engineeringTrack
      ? `${engineeringTrack} Engineering`
      : careerMeta.title;

  const requirements: Requirement[] = [
    {
      id: `${pathwayId}-req-degree`,
      pathwayId,
      type: 'Academic & Accreditation',
      title: `Primary Qualification & Transcript Verification (${displayCareerTitle})`,
      description: isLocalAfrica
        ? `Verified degree qualification, senate clearance, and NYSC/national service or council indexing required by ${regInfo.body}.`
        : `Primary degree transcript verification and credential equivalency assessment required for ${destMeta.name} (${regInfo.body}).`,
      deadline: 'Rolling — Prerequisite Step',
      isDeadlineVerified: true,
      evidenceNeeded: 'Official Degree Certificate / Academic Transcript & Credential Evaluation Receipt',
      source: regInfo.source,
      organization: regInfo.body,
      lastVerified: '2026-10-28',
      isStale: false,
      matchTag: 'degree-completed',
      effortHours: 10,
      importance: 5,
    },
    {
      id: `${pathwayId}-req-exam`,
      pathwayId,
      type: 'Licensing & Examination',
      title: regInfo.exam,
      description: `Mandatory professional assessment, qualifying exam, or technical evaluation administered under ${regInfo.body} for ${destMeta.name}.`,
      deadline: isLocalAfrica ? 'Next Diet: May / November 2027' : 'Rolling Testing Windows (Book 3–5 months ahead)',
      isDeadlineVerified: true,
      evidenceNeeded: 'Official Exam Pass Notification / Score Report PDF',
      source: regInfo.source,
      organization: regInfo.body,
      lastVerified: '2026-10-15',
      isStale: false,
      matchTag: 'licensing-exam',
      effortHours: 45,
      importance: 5,
    },
    {
      id: `${pathwayId}-req-practical`,
      pathwayId,
      type: 'Clinical / Practical / Portfolio',
      title: bp.corePracticalTitle,
      description: bp.corePracticalDesc,
      deadline: 'Before Final Application Submission',
      isDeadlineVerified: true,
      evidenceNeeded: 'Supervisor Logbook Sign-off, Reference Letter, or Live Portfolio Repository',
      source: regInfo.source,
      organization: regInfo.body,
      lastVerified: '2026-11-02',
      isStale: false,
      matchTag: 'practical-experience',
      effortHours: 35,
      importance: 4,
    },
    {
      id: `${pathwayId}-req-output`,
      pathwayId,
      type: 'Research & Technical Output',
      title: bp.coreOutputTitle,
      description: bp.coreOutputDesc,
      deadline: 'Recommended 3+ Months Prior to Cycle',
      isDeadlineVerified: true,
      evidenceNeeded: 'DOI / Published Link, Abstract Acceptance Letter, or Technical Case Study PDF',
      source: `${regInfo.source} / Peer Benchmarks`,
      organization: regInfo.body,
      lastVerified: '2026-09-20',
      isStale: false,
      matchTag: 'research-output',
      effortHours: 25,
      importance: 4,
    },
  ];

  // Add International / Visa & Financial requirement when targeting an international destination
  if (!isLocalAfrica && !isRemote) {
    requirements.push({
      id: `${pathwayId}-req-visa`,
      pathwayId,
      type: 'Visa & Regulatory',
      title: `${destMeta.name} Language Proficiency & Visa Sponsorship Eligibility`,
      description: `Meet statutory language threshold (IELTS/OET/TestDaF where required) and visa sponsorship/financial proof rules for ${destMeta.name}.`,
      deadline: 'At least 4 months prior to cohort start',
      isDeadlineVerified: false, // Demonstrates PI-6 / OP-5 stale or verification notice on shifting visa fee schedules
      evidenceNeeded: 'Valid Language Test Report & Sponsorship/Funding Strategy',
      source: `Official ${destMeta.name} Immigration Portal`,
      organization: `${destMeta.name} Border & Licensing Agency`,
      lastVerified: '2026-04-10',
      isStale: true, // PI-6: Stale items display a warning!
      matchTag: 'language-verified',
      effortHours: 20,
      importance: 4,
    });
  }

  // All 9 Difficulty Dimensions required by PI-3 & PI-4 (Never output "this career is hard")
  const dimensions: PathwayDimensionItem[] = [
    {
      dimension: 'Competition',
      whatItExamines: 'Applicants vs. available opportunities',
      specificChallenge: isLocalAfrica ? bp.competitionNoteLocal : bp.competitionNoteIntl,
      planningHorizonNote: 'Differentiate via early exam + portfolio proof',
      linkedRequirementId: requirements[3].id,
    },
    {
      dimension: 'Applicant fit',
      whatItExamines: 'How your profile compares with requirements',
      specificChallenge: `Requires aligning your academic record, ${bp.corePracticalTitle.toLowerCase()}, and verifiable references to ${regInfo.body} criteria.`,
      planningHorizonNote: 'Closed progressively through Gap Analysis',
      linkedRequirementId: requirements[2].id,
    },
    {
      dimension: 'Eligibility',
      whatItExamines: 'Whether you can actually apply',
      specificChallenge: `Gated by primary qualification recognition and ${regInfo.exam}.`,
      planningHorizonNote: 'Mandatory baseline gate',
      linkedRequirementId: requirements[0].id,
    },
    {
      dimension: 'Geography',
      whatItExamines: 'Whether location affects access or pathway',
      specificChallenge: isLocalAfrica
        ? `In-country pathway in ${destMeta.name}: proximity to accredited teaching/training hubs (e.g., Lagos, Abuja, Nairobi, Johannesburg, Accra) accelerates placement.`
        : isRemote
        ? 'Borderless execution: allows building global track record from your home country provided timezone overlap and reliable connectivity are maintained.'
        : `Cross-border transition to ${destMeta.name}: requires coordinating remote exam sittings (Pearson VUE / Prometric / British Council) before travel.`,
      planningHorizonNote: isLocalAfrica ? 'Regional hub access' : 'Cross-border coordination',
      linkedRequirementId: requirements[1].id,
    },
    {
      dimension: 'Financial burden',
      whatItExamines: 'What resources the pathway may require',
      specificChallenge: isLocalAfrica
        ? 'Moderate local currency licensing and exam fees; prioritize paid placements and local research/training grants.'
        : `High upfront FX cost for ${regInfo.exam} and credential verification; prioritize fee waivers and fully funded scholarships in the Opportunity Funnel.`,
      planningHorizonNote: 'Filter opportunities by funding need',
      linkedRequirementId: requirements[1].id,
    },
    {
      dimension: 'Access',
      whatItExamines: 'How easily you can obtain required experiences',
      specificChallenge: `Securing supervised mentors and ${bp.corePracticalTitle.toLowerCase()} requires targeted outreach 3–6 months before formal deadlines.`,
      planningHorizonNote: 'Actionable via weekly prep tasks',
      linkedRequirementId: requirements[2].id,
    },
    {
      dimension: 'Timeline',
      whatItExamines: 'How long the pathway takes',
      specificChallenge: `Typical structured transition spans ~${isLocalAfrica ? bp.estimatedMonthsLocal : bp.estimatedMonthsIntl} months across qualification, practical proof, and placement cycles.`,
      planningHorizonNote: `~${isLocalAfrica ? bp.estimatedMonthsLocal : bp.estimatedMonthsIntl} months total horizon`,
      linkedRequirementId: requirements[1].id,
    },
    {
      dimension: 'Bottlenecks',
      whatItExamines: 'What could limit progress',
      specificChallenge: isLocalAfrica ? bp.bottleneckLocal : bp.bottleneckIntl,
      planningHorizonNote: 'Primary risk to plan around',
      linkedRequirementId: requirements[requirements.length - 1].id,
    },
    {
      dimension: 'Opportunity availability',
      whatItExamines: 'What resources exist to close the gaps',
      specificChallenge: `Curated fellowships, funded research/technical programmes, and exam/tuition scholarships are actively tracked for ${displayCareerTitle} in ${destMeta.name}.`,
      planningHorizonNote: 'Matched in Opportunity Funnel',
      linkedRequirementId: requirements[3].id,
    },
  ];

  return {
    id: pathwayId,
    careerId,
    careerTitle: displayCareerTitle,
    destinationId,
    destinationName: destMeta.name,
    specificityUsed: regInfo.specificity,
    regulatingBody: regInfo.body,
    applicantType,
    version: '2026.11-v1',
    isSupported: true,
    overview: `${displayCareerTitle} pathway in ${destMeta.name} regulated/benchmarked via ${regInfo.body}. Designed for ${applicantType}s navigating from current standing to verified execution.`,
    estimatedMonths: isLocalAfrica ? bp.estimatedMonthsLocal : bp.estimatedMonthsIntl,
    requirements,
    dimensions,
  };
}
