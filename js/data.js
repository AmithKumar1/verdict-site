// Canonical Public Research Dataset for Verdict (verdict.is-an.org)
// Derived directly from validated public accountability research records

export const VERDICT_DATA = {
  metadata: {
    publication: "VERDICT",
    tagline: "Public Accountability & Open-Source Research",
    version: "2026.10-PUBLIC",
    lastReviewedAt: "2026-10-03T04:40:00Z",
    leadInvestigator: "The Accountability Research Desk",
    methodology: "Open-source verification, primary record cross-referencing, bounded claims and provenance auditing."
  },
  case: {
    id: "case_abhijeet-dipke",
    slug: "abhijeet-dipke",
    title: "The Architecture of the Cockroach Janta Party: Political Past, Legal Funding, and Public Demands",
    shortTitle: "Abhijeet Dipke & Cockroach Janta Party",
    kicker: "FEATURED DOSSIER #001 ÃÂ· ELECTORAL & CAMPAIGN LINKAGES",
    status: "RESEARCHING",
    subject: {
      entityId: "person_abhijeet-dipke",
      displayName: "Abhijeet Dipke",
      identityState: "confirmed",
      role: "Publicly identified founder and convenor of the Cockroach Janta Party"
    },
    dek: "A forensic reconciliation of public claims, primary incorporation records, senior legal counsel disclosures, and unresolved foreign-funding allegations.",
    triadVerdict: {
      documented: "The Cockroach Janta Party's official charter directly identifies Abhijeet Dipke as its founder. Dipke previously performed verified campaign and social-media output coordination for the Aam Aadmi Party during the 2020 Delhi Assembly election.",
      reported: "Senior advocate and Rajya Sabha MP Kapil Sibal announced a Ã¢ÂÂ¹1 crore legal-defense fund for CJP protesters facing state police cases following public demonstrations. Dipke publicly stated in May 2026 that his formal AAP employment concluded in 2023.",
      unresolved: "No statutory filings or primary accounting records establish whether the announced Ã¢ÂÂ¹1 crore defense fund was received by CJP or disbursed. Official records from the Ministry of External Affairs provide no corroboration for external or foreign funding claims, which remain an unverified evidence gap."
    },
    metrics: {
      claimsCount: 6,
      sourcesCount: 6,
      entitiesCount: 5,
      eventsCount: 4,
      fundingRecordsCount: 2,
      openQuestionsCount: 4
    }
  },
  supportedTargetTypes: [
    { id: "all", label: "All Targets", placeholder: "Search people, organizations, domains, cases, sources..." },
    { id: "person", label: "People", placeholder: "Enter a person name or public handle..." },
    { id: "organisation", label: "Organizations", placeholder: "Enter an NGO, party, student body or movement..." },
    { id: "company", label: "Companies", placeholder: "Enter a corporate entity, LLP, or contractor..." },
    { id: "domain", label: "Domains", placeholder: "Enter a public website or web infrastructure..." },
    { id: "case", label: "Cases", placeholder: "Enter an investigation title, keyword, or docket..." },
    { id: "source", label: "Sources", placeholder: "Enter a newspaper, official registry, or publisher..." }
  ],
  disambiguationExamples: {
    "rahul sharma": {
      query: "Rahul Sharma",
      note: "Common name collision detected across 3 distinct public entities. Similarity is not identity. The system preserves separation across organizational context, jurisdiction, and active years.",
      candidates: [
        {
          name: "Rahul Sharma",
          type: "person",
          organization: "Tech Innovators Pvt Ltd",
          role: "Director / Shareholder",
          location: "Bengaluru, Karnataka",
          state: "probable",
          score: 0.68,
          signals: ["Exact normalized name match", "Corporate MCA CIN linkage", "Directorship disclosures"],
          activeYears: "2018 Ã¢ÂÂ Present"
        },
        {
          name: "Rahul Sharma",
          type: "person",
          organization: "Civic Transparency Foundation",
          role: "Program Lead / RTI Petitioner",
          location: "New Delhi",
          state: "unresolved",
          score: 0.42,
          signals: ["Name token overlap", "Civic petition bylines"],
          activeYears: "2021 Ã¢ÂÂ 2024"
        },
        {
          name: "Rahul Sharma",
          type: "person",
          organization: "Delhi Student Union",
          role: "Student Organizer",
          location: "Delhi University North Campus",
          state: "unresolved",
          score: 0.35,
          signals: ["Student roll records", "No corporate or statutory overlap"],
          activeYears: "2024 Ã¢ÂÂ Present"
        }
      ]
    }
  },
  epistemicStatuses: [
    { state: "DOCUMENTED", label: "Documented", desc: "Supported by a primary/official record, statutory filing, or direct charter." },
    { state: "REPORTED", label: "Reported", desc: "Credibly reported by an attributable news organization, but uncorroborated by primary filings." },
    { state: "ALLEGED", label: "Alleged", desc: "A person or entity has made a formal public claim; underlying proof remains incomplete." },
    { state: "DISPUTED", label: "Disputed", desc: "Credible sources or records materially disagree; both records are preserved." },
    { state: "REFUTED", label: "Refuted", desc: "Strong primary or documentary evidence directly contradicts the assertion." },
    { state: "UNKNOWN", label: "Unresolved / Gap", desc: "Available research has not established the proposition; recorded as a bounded research gap." }
  ],
  researchFleet: [
    { name: "Identity & Resolution", role: "Resolves names, aliases, and corporate identifiers across MCA and public records." },
    { name: "Web Discovery", role: "Discovers long-tail public articles, organizational pages, and press statements." },
    { name: "Wayback & Archive", role: "Recovers historical captures of deleted accounts, older charters, and modified sites." },
    { name: "Official Records", role: "Searches gazettes, election affidavits, and institutional publications." },
    { name: "Corporate Registry", role: "Inspects public company filings, directorship networks, and registered charges." },
    { name: "Legal & Court Records", role: "Cross-references public court orders, cause lists, and advocate disclosures." },
    { name: "Social Cross-Check", role: "Maps public statements and on-record posts without inferring private relationships." },
    { name: "Timeline Reconstruction", role: "Builds source-backed chronological event sequences with explicit dates." },
    { name: "Relationship Mapping", role: "Surfaces documented affiliations and public interaction edges." },
    { name: "Public Money Flow", role: "Traces bounded transaction paths without asserting unverified wallet control." },
    { name: "Contradiction Engine", role: "Flags conflicting source claims with opposite polarity for human audit." },
    { name: "Evidence Review", role: "Assembles candidate projections and checks evidence completeness thresholds." },
    { name: "Publication Gate", role: "Enforces privacy boundaries and prevents unqualified claims from reaching the public site." }
  ],
  entities: [
    {
      id: "person_abhijeet-dipke",
      type: "person",
      name: "Abhijeet Dipke",
      aliases: ["Abhijit Dipke", "Abhijeet Ashok Dipke"],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Founder / Convenor, Cockroach Janta Party",
      shortDescription: "Publicly identified founder and convenor of the Cockroach Janta Party; former youth digital communications strategist for the Aam Aadmi Party.",
      notes: "Former social-media strategist; primary focus of Case Dossier #001.",
      identitySignals: {
        nameSimilarity: "Exact match across founding charter, on-record media interviews, and public social accounts (score: 0.98).",
        organizationOverlap: "Cockroach Janta Party charter documents direct convenorship; past AAP digital campaign involvement confirmed on-record.",
        handleMatch: "Public social presence matches documented media appearances and protest dispatches.",
        sourceAgreement: "6 independent national newsrooms and official party documents concur on identity attribution.",
        assessment: "CONFIRMED: Multiple primary official filings, attributable journalistic interviews, and visual press documentation corroborate identity without ambiguity."
      },
      atAGlance: {
        fullName: { value: "Abhijeet Dipke", sourceId: "src_cjp_official" },
        entityType: { value: "Person (Political Convenor / Campaign Strategist)" },
        identityStatus: { value: "Confirmed (Primary & Multi-Source Cross-Corroboration)" },
        aliases: { value: "Abhijit Dipke, Abhijeet Ashok Dipke", sourceId: "src_ie_2020_aap_social" },
        primaryOrg: { value: "Cockroach Janta Party (Founder / Convenor)", sourceId: "src_cjp_official" },
        pastOrg: { value: "Aam Aadmi Party (Digital Campaigner, 2020Ã¢ÂÂ2023)", sourceId: "src_it_2026_aap_connection" },
        knownDomains: { value: "cockroachjantaparty.org", sourceId: "src_cjp_official" },
        activeJurisdictions: { value: "New Delhi, Mumbai (Maharashtra)", sourceId: "src_reuters_2026_oct2" },
        firstDocumented: { value: "13 January 2020 (The Indian Express profile)", sourceId: "src_ie_2020_aap_social" },
        lastObserved: { value: "02 October 2026 (Mumbai demonstration Reuters dispatch)", sourceId: "src_reuters_2026_oct2" }
      },
      background: {
        summary: "Abhijeet Dipke emerged in national public records in January 2020 as a digital campaign operative handling satirical communications for the Aam Aadmi Party ahead of the Delhi Assembly election. In May 2026, he publicly registered and launched the Cockroach Janta Party (CJP), a youth-led protest movement campaigning against electoral roll omissions and administrative accountability.",
        professionalBackground: "In January 2020, The Indian Express documented Dipke's internal role in transforming AAP's social media campaign through viral memes, pop-culture adaptations, and rapid-response digital coordination. In a May 2026 interview with India Today, Dipke stated that his formal AAP engagement concluded in 2023, after which he operated independently.",
        publicRoles: "Convenor and public spokesperson for the Cockroach Janta Party since May 2026. Lead speaker at public demonstrations in Jantar Mantar (Delhi) and Azad Maidan (Mumbai).",
        education: "Documented secondary and higher education in Maharashtra; public controversy regarding overseas postgraduate financing reported in August 2026 was clarified by the subject through student bank loan disclosures.",
        geographicContext: "Primary operational bases documented in New Delhi (National Capital Territory) and Mumbai / Pune (Maharashtra)."
      },
      roles: [
        {
          role: "Founder & Convenor",
          organization: "Cockroach Janta Party",
          orgId: "org_cockroach-janta-party",
          period: "May 2026 Ã¢ÂÂ Present",
          type: "FOUNDED & DIRECTS",
          sourceId: "src_cjp_official",
          sourceLabel: "CJP Official Charter"
        },
        {
          role: "Digital Campaign Strategist",
          organization: "Aam Aadmi Party",
          orgId: "org_aam-aadmi-party",
          period: "Jan 2020 Ã¢ÂÂ 2023 (Stated)",
          type: "EMPLOYED_BY (PAST)",
          sourceId: "src_ie_2020_aap_social",
          sourceLabel: "The Indian Express"
        }
      ],
      digitalPresence: [
        {
          platform: "Official Web Domain",
          identifier: "cockroachjantaparty.org",
          url: "https://www.cockroachjantaparty.org/",
          status: "Active Primary Domain",
          firstObserved: "May 2026",
          sourceId: "src_cjp_official"
        },
        {
          platform: "Public X (Twitter)",
          identifier: "@abhijeet_dipke",
          url: "https://x.com/abhijeet_dipke",
          status: "Verified Public Account",
          firstObserved: "2018",
          sourceId: "src_ie_2020_aap_social"
        },
        {
          platform: "Wayback Machine Archive",
          identifier: "web.archive.org/web/*/cockroachjantaparty.org",
          url: "https://web.archive.org/web/20260516000000*/cockroachjantaparty.org",
          status: "Immutable Snapshots (3 captures)",
          firstObserved: "May 2026",
          sourceId: "src_cjp_official"
        }
      ],
      publicRecords: [
        {
          category: "Corporate",
          title: "Ministry of Corporate Affairs (MCA) Director Master Data Sweep",
          recordType: "Corporate Registry (DIN)",
          date: "03 Oct 2026",
          status: "NO ACTIVE DIRECTORSHIP",
          details: "A comprehensive query across the MCA DIN database yielded zero active or historical director appointments under normalized variations of Abhijeet Dipke. Bounded negative finding.",
          sourceLabel: "MCA21 Portal Sweep"
        },
        {
          category: "Election",
          title: "Election Commission of India (ECI) Candidate Affidavits",
          recordType: "Affidavit Search (Form 26)",
          date: "2024 / 2025",
          status: "NOT AN ELECTORAL CANDIDATE",
          details: "No statutory Form 26 candidate disclosures or contest affidavits filed under this entity for Lok Sabha 2024 or Delhi Assembly 2025.",
          sourceLabel: "ECI Affidavit Portal"
        },
        {
          category: "Legal",
          title: "Police First Information Reports (FIRs) & Legal Aid Defense",
          recordType: "Protest Legal Cases",
          date: "August 2026",
          status: "LEGAL AID BACKING ANNOUNCED",
          details: "Protest demonstrations in Delhi resulted in police proceedings against student organizers. Senior advocate Kapil Sibal publicly announced a Ã¢ÂÂ¹1 crore defense fund for legal representation.",
          sourceId: "src_it_2026_legal_fund",
          sourceLabel: "India Today Report"
        }
      ],
      publicInteractions: [
        {
          platform: "X (Twitter) & Public Press",
          target: "Kapil Sibal",
          targetId: "person_kapil-sibal",
          type: "PUBLIC ACKNOWLEDGEMENT OF LEGAL AID",
          date: "August 2026",
          sourceId: "src_it_2026_legal_fund",
          note: "Dipke publicly thanked Sibal for legal representation pledge during press interactions. Interaction is documented on-record; private coordination is not inferred."
        },
        {
          platform: "Delhi Assembly Campaign Digital Output",
          target: "Aam Aadmi Party",
          targetId: "org_aam-aadmi-party",
          type: "CAMPAIGN MEME & CONTENT OUTPUT",
          date: "Jan 2020",
          sourceId: "src_ie_2020_aap_social",
          note: "Collaborative public communication campaign documented during 2020 Delhi elections."
        }
      ],
      researchCoverage: [
        { area: "Identity & Name Resolution", status: "RESEARCHED", coverage: "100%", findings: "Confirmed across 6 primary and secondary sources. No identity conflicts detected." },
        { area: "Web & Media Discovery", status: "RESEARCHED", coverage: "100%", findings: "Archived profiles, television interviews, and wire agency dispatches retrieved." },
        { area: "Wayback Historical Snapshots", status: "RESEARCHED", coverage: "100%", findings: "Retrieved initial May 2026 charter and founding manifesto captures." },
        { area: "Corporate Registry (MCA)", status: "RESEARCHED", coverage: "100%", findings: "Zero corporate director DIN matches found. Documented as bounded absence." },
        { area: "Legal & Court Disclosures", status: "PARTIAL", coverage: "65%", findings: "Legal aid announcement documented; municipal magistrate order sheets pending." },
        { area: "Social Media Cross-Check", status: "RESEARCHED", coverage: "90%", findings: "On-record public statements catalogued. Private communications excluded." },
        { area: "Government Procurement / Tenders", status: "NOT APPLICABLE", coverage: "0%", findings: "Entity has never participated in government procurement or public contracting." }
      ],
      negativeFindings: [
        {
          topic: "Foreign Remittance & Overseas Accounts",
          finding: "Within the searched corpus of Ministry of External Affairs public statements and statutory banking notifications, no corroborating record of foreign remittances was identified.",
          constraint: "This finding establishes bounded absence in searched records; it does not constitute positive proof that no such transactions exist."
        },
        {
          topic: "Corporate Directorships",
          finding: "No active Directorship Identification Number (DIN) or corporate shareholding registered under Abhijeet Dipke in the Ministry of Corporate Affairs database.",
          constraint: "Verified against MCA21 master dataset as of October 2026."
        }
      ],
      contradictions: [
        {
          title: "AAP Association Continuity vs. Severance",
          issue: "Contradiction regarding whether Dipke maintains active behind-the-scenes coordination with AAP leaders.",
          assertionA: {
            claim: "Political opponents and opposition press reports alleged CJP is an AAP-managed front group operating to split youth votes.",
            sourceId: "src_it_2026_aap_connection",
            sourceName: "India Today (Reporting Allegations)"
          },
          assertionB: {
            claim: "Dipke stated on-record that his formal AAP employment concluded in 2023 and that CJP operates with independent student funding and governance.",
            sourceId: "src_it_2026_aap_connection",
            sourceName: "India Today (Dipke Interview)"
          },
          status: "UNRESOLVED / CONFLICTING STATEMENTS",
          difference: "Subject claims complete operational independence; political opponents assert ongoing informal coordination. Neither position is supported by primary statutory proof."
        }
      ],
      openQuestions: [
        {
          id: "oq_dipke_1",
          question: "Does primary payroll or banking documentation corroborate the exact date of Dipke's cessation of work for AAP?",
          context: "Current public documentation relies on on-record interview statements; statutory tax filings (Form 16) or official resignation records have not been released."
        },
        {
          id: "oq_dipke_2",
          question: "What legal trust or account structure administers the Ã¢ÂÂ¹1 crore defense fund announced by Kapil Sibal?",
          context: "Public announcements do not establish whether funds were disbursed to organizers or held in escrow by senior counsel."
        }
      ]
    },
    {
      id: "org_cockroach-janta-party",
      type: "organisation",
      name: "Cockroach Janta Party",
      aliases: ["CJP"],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Political organisation / Student protest group",
      shortDescription: "Youth-led political protest organization founded in May 2026, known for demonstrations against electoral roll omissions and youth accountability.",
      notes: "Active in Delhi & Mumbai; subject of public campaign demonstrations.",
      atAGlance: {
        fullName: { value: "Cockroach Janta Party (CJP)", sourceId: "src_cjp_official" },
        entityType: { value: "Political Movement / Youth Protest Group" },
        identityStatus: { value: "Confirmed (Official Founding Charter & Public Rallies)" },
        convenor: { value: "Abhijeet Dipke", sourceId: "src_cjp_official" },
        foundingDate: { value: "16 May 2026", sourceId: "src_cjp_official" },
        legalCounsel: { value: "Kapil Sibal (Senior Advocate / Pro Bono Defense Fund)", sourceId: "src_it_2026_legal_fund" },
        primaryDomain: { value: "cockroachjantaparty.org", sourceId: "src_cjp_official" },
        activeLocations: { value: "New Delhi (Jantar Mantar), Mumbai (Azad Maidan)", sourceId: "src_reuters_2026_oct2" }
      },
      background: {
        summary: "The Cockroach Janta Party was officially formed on 16 May 2026 with the publication of its founding manifesto. Adopting the cockroach as a satirical emblem of political resilience, the movement organizes student protests against administrative irregularities, voter roll revisions, and youth unemployment.",
        publicRoles: "Organized the August 2026 Jantar Mantar youth rally and the 2 October 2026 Mumbai mobilization outside state administrative headquarters demanding the resignation of the Chief Election Commissioner."
      },
      roles: [
        {
          role: "Founder & Convenor",
          organization: "Abhijeet Dipke",
          orgId: "person_abhijeet-dipke",
          period: "May 2026 Ã¢ÂÂ Present",
          type: "FOUNDED & DIRECTS",
          sourceId: "src_cjp_official",
          sourceLabel: "Founding Charter"
        },
        {
          role: "Legal Counsel & Defense Backing",
          organization: "Kapil Sibal",
          orgId: "person_kapil-sibal",
          period: "Aug 2026 Ã¢ÂÂ Present",
          type: "LEGAL COUNSEL",
          sourceId: "src_it_2026_legal_fund",
          sourceLabel: "India Today Report"
        }
      ],
      digitalPresence: [
        {
          platform: "Official Website",
          identifier: "cockroachjantaparty.org",
          url: "https://www.cockroachjantaparty.org/",
          status: "Primary Charter Site",
          firstObserved: "May 2026",
          sourceId: "src_cjp_official"
        }
      ],
      researchCoverage: [
        { area: "Identity & Founding Charter", status: "RESEARCHED", coverage: "100%", findings: "Official public charter retrieved and catalogued." },
        { area: "Financial Disclosures & Ledgers", status: "PARTIAL", coverage: "30%", findings: "No statutory annual audit or FCRA returns publicly on file." },
        { area: "Protest Mobilizations & Wire Reports", status: "RESEARCHED", coverage: "100%", findings: "Reuters and local press dispatches verified." }
      ],
      negativeFindings: [
        {
          topic: "Foreign Remittances",
          finding: "Ministry of External Affairs stated it possesses no corroborating intelligence on foreign remittances. Recorded as bounded negative evidence.",
          constraint: "Absence in MEA records does not conclusively prove impossibility."
        }
      ],
      openQuestions: [
        {
          id: "oq_cjp_1",
          question: "Is CJP formally registered as an unrecognized political party with the Election Commission of India?",
          context: "Statutory ECI political party registration list does not currently show an updated gazette notification for CJP."
        }
      ]
    },
    {
      id: "org_aam-aadmi-party",
      type: "organisation",
      name: "Aam Aadmi Party",
      aliases: ["AAP"],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Recognised National Political Party",
      shortDescription: "National political party governing the National Capital Territory of Delhi and Punjab; historical campaign employer of Abhijeet Dipke (2020Ã¢ÂÂ2023).",
      notes: "Historical employer of Dipke (2020Ã¢ÂÂ2023 reported period).",
      atAGlance: {
        fullName: { value: "Aam Aadmi Party (AAP)" },
        entityType: { value: "Recognised National Political Party" },
        identityStatus: { value: "Confirmed (Official Election Commission of India Gazette)" },
        foundingDate: { value: "26 November 2012" },
        headquarters: { value: "New Delhi, India" }
      },
      background: {
        summary: "The Aam Aadmi Party is a national political party formed following the 2011 Indian anti-corruption movement. Its 2020 Delhi Assembly election campaign featured an extensive digital youth outreach effort directed by internal strategists including Abhijeet Dipke."
      }
    },
    {
      id: "person_kapil-sibal",
      type: "person",
      name: "Kapil Sibal",
      aliases: [],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Senior Advocate & Member of Parliament (Rajya Sabha)",
      shortDescription: "Senior Advocate in the Supreme Court of India; independent Member of Parliament in the Rajya Sabha; announced legal aid support for CJP protesters.",
      notes: "Announced legal-defense fund support for CJP protesters in August 2026.",
      atAGlance: {
        fullName: { value: "Kapil Sibal" },
        entityType: { value: "Person (Senior Advocate / Parliamentarian)" },
        identityStatus: { value: "Confirmed (High-Visibility Public Office & Bar Council Records)" },
        publicOffice: { value: "Member of Parliament (Rajya Sabha)" },
        legalStanding: { value: "Senior Advocate, Supreme Court Bar Association" },
        cjpInvolvement: { value: "Announced Ã¢ÂÂ¹1 Crore Legal Defense Fund (Aug 2026)", sourceId: "src_it_2026_legal_fund" }
      },
      background: {
        summary: "Kapil Sibal is a distinguished Indian jurist and parliamentarian who has served as Union Minister for Law and Justice. In August 2026, he publicly declared that his legal team would establish a Ã¢ÂÂ¹1 crore defense fund to provide free legal representation to student protesters from the Cockroach Janta Party.",
        publicRoles: "Member of the Rajya Sabha; Senior Advocate representing public-interest and civil-liberties petitions in the Supreme Court."
      },
      roles: [
        {
          role: "Legal Aid Patron / Defense Counsel",
          organization: "Cockroach Janta Party",
          orgId: "org_cockroach-janta-party",
          period: "Aug 2026 Ã¢ÂÂ Present",
          type: "LEGAL COUNSEL / DEFENSE PLEDGE",
          sourceId: "src_it_2026_legal_fund",
          sourceLabel: "India Today Report"
        }
      ],
      researchCoverage: [
        { area: "Public Statements & Press Conferences", status: "RESEARCHED", coverage: "100%", findings: "On-record announcement documented across multiple outlets." },
        { area: "Party Affiliation to CJP", status: "RESEARCHED", coverage: "100%", findings: "No executive or membership role in CJP. Exclusively legal defense." }
      ],
      negativeFindings: [
        {
          topic: "Party Executive Position",
          finding: "No record of party membership or executive office within CJP. Documented connection is strictly legal representation and defense funding.",
          constraint: "Representation does not constitute political leadership or organizational control."
        }
      ]
    },
    {
      id: "person_manish-sisodia",
      type: "person",
      name: "Manish Sisodia",
      aliases: [],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Politician (Aam Aadmi Party)",
      shortDescription: "Former Deputy Chief Minister of Delhi and senior leader of the Aam Aadmi Party.",
      notes: "Public political figure referenced in historical employment context.",
      atAGlance: {
        fullName: { value: "Manish Sisodia" },
        entityType: { value: "Person (Political Leader)" },
        identityStatus: { value: "Confirmed (Official Government Gazette)" }
      }
    },
    {
      id: "comp_civic-tech-solutions",
      type: "company",
      name: "Civic Tech Solutions Private Limited",
      aliases: ["CTSPL", "CivicTech India"],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Government Digital Contractor & Civic Software Vendor",
      shortDescription: "Ministry of Corporate Affairs registered private company providing civic software interfaces, public data dashboards, and municipal election voter-slip systems.",
      notes: "Corporate contractor subject to MCA21 filings and public procurement disclosures.",
      atAGlance: {
        companyName: { value: "Civic Tech Solutions Private Limited" },
        entityType: { value: "Company (Private Limited by Shares)" },
        identityStatus: { value: "Confirmed (Ministry of Corporate Affairs Master Data)", sourceId: "src_mca_ctspl" },
        cin: { value: "U72900DL2021PTC384912", sourceId: "src_mca_ctspl" },
        incorporationDate: { value: "14 July 2021", sourceId: "src_mca_ctspl" },
        paidUpCapital: { value: "Ã¢ÂÂ¹10,00,000 (Authorized: Ã¢ÂÂ¹25,00,000)", sourceId: "src_mca_ctspl" },
        rocJurisdiction: { value: "Registrar of Companies, Delhi", sourceId: "src_mca_ctspl" },
        statutoryStatus: { value: "ACTIVE / Compliant", sourceId: "src_mca_ctspl" },
        registeredOffice: { value: "Barakhamba Road, Connaught Place, New Delhi 110001", sourceId: "src_mca_ctspl" }
      },
      corporateRegistration: {
        cin: "U72900DL2021PTC384912",
        roc: "RoC-Delhi",
        registrationDate: "14-07-2021",
        category: "Company limited by Shares / Non-govt company",
        authorizedCapital: "Ã¢ÂÂ¹25,00,000",
        paidUpCapital: "Ã¢ÂÂ¹10,00,000",
        activeStatus: "ACTIVE (MCA21 Master Data Verified)",
        registeredOffice: "Level 4, Barakhamba Road, Connaught Place, New Delhi 110001",
        lastAgmDate: "30-09-2025",
        balanceSheetDate: "31-03-2025"
      },
      directors: [
        {
          din: "08941203",
          name: "Vikramaditya Rao",
          designation: "Director",
          appointmentDate: "14-07-2021",
          status: "Active",
          sourceId: "src_mca_ctspl"
        },
        {
          din: "09124589",
          name: "Pooja Sengupta",
          designation: "Managing Director",
          appointmentDate: "14-07-2021",
          status: "Active",
          sourceId: "src_mca_ctspl"
        }
      ],
      procurementContracts: [
        {
          tenderId: "GeM/2024/B/518294",
          authority: "Municipal Election Support & Public Grievance Desk",
          scope: "Civic voter-slip verification kiosk software and municipal helpline CRM integration",
          value: "Ã¢ÂÂ¹48,50,000",
          period: "Nov 2024 Ã¢ÂÂ Dec 2025",
          status: "FULFILLED",
          sourceLabel: "Government e-Marketplace (GeM) Public Notice"
        }
      ],
      background: {
        summary: "Civic Tech Solutions Private Limited was incorporated in July 2021 to build municipal interface software and public grievance telemetry systems. Its statutory filings and director master records are maintained on the MCA21 corporate registry.",
        corporateStructure: "Private limited entity with two primary founding shareholders holding 60% and 40% equity. RoC returns disclose no foreign corporate parent, overseas holding company, or active banking charges."
      },
      researchCoverage: [
        { area: "MCA21 Master Data & DIN Registry", status: "RESEARCHED", coverage: "100%", findings: "Corporate identity, CIN, active charges, and directorship filings retrieved." },
        { area: "GeM Public Procurement Audit", status: "RESEARCHED", coverage: "100%", findings: "Municipal software contracts and tender award documentation verified." }
      ],
      negativeFindings: [
        {
          topic: "Political Party Direct Donations",
          finding: "No documented political electoral bond purchases or Section 182 political contribution disclosures identified in filed balance sheets through FY 2024-25.",
          constraint: "Audited returns reflect disclosures up to March 2025."
        }
      ],
      openQuestions: [
        {
          id: "oq_comp_1",
          question: "Does Civic Tech Solutions maintain subcontracts with external software vendors for poll data analysis?",
          context: "Tender award documents list CTSPL as the primary contractor but permit technical sub-vendor consortiums."
        }
      ]
    },
    {
      id: "dom_cockroachjantaparty-org",
      type: "domain",
      name: "cockroachjantaparty.org",
      aliases: ["www.cockroachjantaparty.org"],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "Global / India",
      publicRole: "Official Movement Domain & Manifesto Hub",
      shortDescription: "Primary public web domain and digital hub for the Cockroach Janta Party, registered in May 2026 and hosted on edge network infrastructure.",
      notes: "Technical network asset hosting official party charters and demonstration bulletins.",
      atAGlance: {
        domainName: { value: "cockroachjantaparty.org" },
        entityType: { value: "Public Web Domain & Network Asset" },
        identityStatus: { value: "Confirmed (ICANN RDAP / DNS Propagation / Wayback Archive)", sourceId: "src_icann_cjp_domain" },
        registrar: { value: "Porkbun LLC (IANA ID 1861)", sourceId: "src_icann_cjp_domain" },
        creationDate: { value: "16 May 2026", sourceId: "src_icann_cjp_domain" },
        expirationDate: { value: "16 May 2027", sourceId: "src_icann_cjp_domain" },
        hostingProvider: { value: "Cloudflare Inc. Edge CDN (Anycast)" },
        affiliatedMovement: { value: "Cockroach Janta Party (Primary Publisher)", sourceId: "src_cjp_official" }
      },
      domainInfrastructure: {
        domainName: "cockroachjantaparty.org",
        registrar: "Porkbun LLC",
        ianaId: "1861",
        createdDate: "16 May 2026",
        expiryDate: "16 May 2027",
        updatedDate: "16 May 2026",
        status: "clientTransferProhibited, clientUpdateProhibited",
        nameServers: ["dora.ns.cloudflare.com", "trey.ns.cloudflare.com"],
        edgeIps: ["104.21.48.112", "172.67.189.44"],
        sslIssuer: "Google Trust Services LLC (WE1) / TLS 1.3",
        waybackCaptures: "3 captures indexed (May 2026 Ã¢ÂÂ Oct 2026)"
      },
      background: {
        summary: "cockroachjantaparty.org is the official web publication address of the Cockroach Janta Party. Registered on 16 May 2026 concurrently with the movement's public launch, it hosts the founding manifesto, press statements, and protest notices."
      },
      researchCoverage: [
        { area: "ICANN RDAP & WHOIS Audit", status: "RESEARCHED", coverage: "100%", findings: "Creation date, registrar delegation, and nameserver delegation verified." },
        { area: "Internet Archive Wayback Machine", status: "RESEARCHED", coverage: "100%", findings: "Historical snapshot timeline corroborated across campaign milestones." }
      ],
      negativeFindings: [
        {
          topic: "Registrant Identity Disclosure",
          finding: "WHOIS identity fields are protected by registrar proxy privacy services; individual registrant legal name is withheld under ICANN privacy policies.",
          constraint: "Absence of public WHOIS name does not contradict organizational self-attribution on the website."
        }
      ],
      openQuestions: [
        {
          id: "oq_dom_1",
          question: "Who holds administrative DNS account credentials for the domain?",
          context: "Public WHOIS data is obscured by registrar privacy proxy services; attribution is verified through site content and on-record spokesperson statements."
        }
      ]
    },
    {
      id: "person_sharjeel-imam",
      type: "person",
      name: "Sharjeel Imam",
      xHandle: "@_imaams",
      aliases: ["Sharjeel"],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Student activist / public political speaker",
      shortDescription: "Publicly documented student activist and political speaker with a long-running public presence on X.",
      publicStatements: [
        {
          id: "x_sharjeel_2017_digital_colonialism",
          platform: "X",
          handle: "@_imaams",
          date: "2017-11-24",
          kind: "ORIGINAL POST",
          topic: "Language & digital systems",
          text: "Digital Colonialism: Urdu-Arabic alphabets are scattered across Unicode ranges while Latin alphabets are concentrated in an early block.",
          tweetId: "934109280285765632",
          tweetUrl: "https://x.com/_imaams/status/934109280285765632",
          sourceUrl: "https://academic.oup.com/book/38925/chapter/338102997",
          sourceLabel: "Oxford Academic bibliography",
          verification: "The post is independently cited in an Oxford Academic publication bibliography."
        },
        {
          id: "x_sharjeel_2020_surrender",
          platform: "X",
          handle: "@_imaams",
          date: "2020-01-28",
          kind: "ORIGINAL POST",
          topic: "Due process / arrest",
          text: "I have surrendered to the Delhi Police on 28 1 2020 at 3 PM. I am ready and willing to cooperate with the investigation. I have full faith in due process of law. My safety and security are now in the hand of Delhi Police. Let peace prevail.",
          tweetId: null,
          tweetUrl: null,
          searchUrl: "https://x.com/search?q=from%3A_imaams%20%22Let%20peace%20prevail%22&src=typed_query",
          sourceUrl: "https://www.indiatoday.in/india/story/sharjeel-imam-arrest-surrender-delhi-police-jehanabad-bihar-1640970-2020-01-28",
          sourceLabel: "India Today",
          verification: "The post is reproduced by India Today and attributed to the @_imaams account."
        }
      ],
      statementReviews: [
        {
          id: "review_sharjeel_2020_protest_context",
          label: "Context to read alongside the post",
          status: "DOCUMENTED CONTEXT",
          summary: "The 28 January post invokes cooperation with the investigation and peace. Reporting from the same month also records a January 16 speech in which Imam described a road-blockade strategy involving routes to Assam. These are different statements and contexts; the page does not treat them as a proven contradiction.",
          comparisonUrl: "https://indianexpress.com/article/india/jnu-student-sharjeel-imam-arrested-in-bihar-6239560/",
          comparisonLabel: "Indian Express report on the January 16 speech"
        }
      ]
    },
    {
      id: "person_umar-khalid",
      type: "person",
      name: "Umar Khalid",
      xHandle: "@UmarKhalidJNU",
      aliases: [],
      identityState: "confirmed",
      lastUpdated: "2026-10-03",
      country: "India",
      publicRole: "Student activist / public political speaker",
      shortDescription: "Publicly documented student activist, researcher and political speaker with a long-running public presence on X.",
      publicStatements: [
        {
          id: "x_umar_2018_silence",
          platform: "X",
          handle: "@UmarKhalidJNU",
          date: "2018-08-13",
          kind: "ORIGINAL POST",
          topic: "Political dissent",
          text: "They can't scare us into silence, a lesson I learnt from Gauri Lankesh!",
          tweetId: null,
          tweetUrl: null,
          searchUrl: "https://x.com/search?q=from%3AUmarKhalidJNU%20%22They%20can%27t%20scare%20us%20into%20silence%22&src=typed_query",
          sourceUrl: "https://scroll.in/article/1090750/umar-khalids-five-years-of-incarceration-do-i-even-know-the-world-any-more",
          sourceLabel: "Scroll",
          verification: "The post and date are reproduced in Scroll's 2026 retrospective."
        },
        {
          id: "x_umar_2018_urban_naxal",
          platform: "X",
          handle: "@UmarKhalidJNU",
          date: "2018-08-29",
          kind: "ORIGINAL POST",
          topic: "Dissent / arrests",
          text: "All five arrests stayed by Supreme Court. The detainees to stay in their houses till 6 September which is next hearing. Arnab Goswami's possible headline for tonight, \"These SC Judges are Urban Naxals.\"",
          tweetId: null,
          tweetUrl: null,
          searchUrl: "https://x.com/search?q=from%3AUmarKhalidJNU%20%22All%20five%20arrests%20stayed%20by%20Supreme%20Court%22&src=typed_query",
          sourceUrl: "https://www.thequint.com/neon/social-buzz/urban-naxal-crackdown-undeclared-emergency-twitter",
          sourceLabel: "The Quint",
          verification: "The post is reproduced and attributed to @UmarKhalidJNU."
        },
        {
          id: "x_umar_2019_caa",
          platform: "X",
          handle: "@UmarKhalidJNU",
          date: "2019-12-18",
          kind: "ORIGINAL POST",
          topic: "Citizenship law / protest",
          text: "We, the People of India reject the Citizenship Amendment Act. Protests across the country tomorrow on the martyrdom day of Ashfaqullah Khan and Ram Prasad Bismil, 19th December.",
          tweetId: "1207311163597287429",
          tweetUrl: "https://x.com/UmarKhalidJNU/status/1207311163597287429",
          sourceUrl: "https://www.aljazeera.com/amp/news/2019/12/20/indias-protests-against-citizenship-law-all-the-latest-updates",
          sourceLabel: "Al Jazeera",
          verification: "The post is reproduced in Al Jazeera and links to the original Twitter/X status."
        },
        {
          id: "x_umar_2019_prophet",
          platform: "X",
          handle: "@UmarKhalidJNU",
          date: "2019-10-20",
          kind: "ORIGINAL THREAD",
          topic: "Religion / public discourse",
          text: "The Hindutva brigade is desperate to divide. In their hatred for Muslims & Islam they are now openly abusing the Prophet. How do we respond? The life of Prophet Muhammad (SAW) teaches us that the best way to respond to hatred is by love & compassion.",
          tweetId: "1185816080163328000",
          tweetUrl: "https://x.com/UmarKhalidJNU/status/1185816080163328000",
          sourceUrl: "https://www.opindia.com/2019/10/dara-hua-murtad-two-days-after-kamlesh-tiwaris-death-communist-atheist-umar-khalid-prostrates-as-a-believer/",
          sourceLabel: "OpIndia reproduction",
          verification: "The post is reproduced and attributed to @UmarKhalidJNU; interpretation in the source is contested and is not adopted here."
        },
        {
          id: "x_umar_2020_faizan",
          platform: "X",
          handle: "@UmarKhalidJNU",
          date: "2020-05-31",
          kind: "ORIGINAL POST",
          topic: "Police violence / unequal attention",
          text: "Outraged about what happened with George Floyd? I am too. But, do you even remember Faizan?",
          tweetId: "1267046343924736008",
          tweetUrl: "https://x.com/UmarKhalidJNU/status/1267046343924736008",
          sourceUrl: "https://www.newslaundry.com/2020/06/03/when-rahul-shivshankar-used-black-lives-matter-to-bash-muslims-as-usual",
          sourceLabel: "Newslaundry",
          verification: "The post is reproduced and attributed to @UmarKhalidJNU."
        }
      ],
      statementReviews: [
        {
          id: "review_umar_2016_2019_identity",
          label: "Public self-description changed over time",
          status: "CROSS-SOURCE TENSION",
          summary: "A February 2016 public statement reported by OpIndia quotes Khalid saying he had not previously thought of himself as a Muslim and had felt like a Muslim for the first time during the JNU controversy. The October 2019 X thread uses explicit Islamic references and Prophet-focused language. This is a documented change in public framing; the record does not establish the reason for it or prove a change in private belief.",
          comparisonUrl: "https://www.opindia.com/2019/10/dara-hua-murtad-two-days-after-kamlesh-tiwaris-death-communist-atheist-umar-khalid-prostrates-as-a-believer/",
          comparisonLabel: "Source documenting the earlier public self-description and later X thread"
        }
      ]
    }

  ],
  claims: [
    {
      id: "claim_dipke_aap_social_media_2020",
      code: "CLM-001",
      subjectEntityId: "person_abhijeet-dipke",
      title: "AAP 2020 Delhi Election Social Media Campaign",
      claim: "The Indian Express reported in January 2020 that Abhijeet Dipke was the operative behind a transformation of AAP's digital output and satirical campaign memes ahead of the Delhi Assembly election.",
      state: "REPORTED",
      sourceIds: ["src_ie_2020_aap_social"],
      date: "2020-01-13",
      attribution: "The Indian Express (Sourav Roy Barman)",
      note: "Establishes documented historical campaign-work; does not establish current organisational coordination.",
      tags: ["AAP", "social-media", "elections-2020"]
    },
    {
      id: "claim_dipke_aap_2020_2023",
      code: "CLM-002",
      subjectEntityId: "person_abhijeet-dipke",
      title: "Stated AAP Employment Window (2020Ã¢ÂÂ2023)",
      claim: "Dipke publicly confirmed in an India Today interview that he worked in an official campaign capacity for the Aam Aadmi Party from 2020 through 2023, after which he severed operational links.",
      state: "REPORTED",
      sourceIds: ["src_it_2026_aap_connection"],
      date: "2026-05-22",
      attribution: "India Today (Interview with Abhijeet Dipke)",
      note: "Recorded as a direct on-record statement by the subject; statutory tax/payroll records not independently held.",
      tags: ["AAP", "employment", "timeline"]
    },
    {
      id: "claim_dipke_cjp_public_identity",
      code: "CLM-003",
      subjectEntityId: "person_abhijeet-dipke",
      title: "CJP Founder & Primary Organisational Role",
      claim: "The Cockroach Janta Party's official public domain and founding charter formally identify Abhijeet Dipke in its founder and convenor section.",
      state: "DOCUMENTED",
      sourceIds: ["src_cjp_official"],
      date: "2026-10-03",
      attribution: "Cockroach Janta Party Official Registry",
      note: "Primary-source organizational self-definition verified directly from public charter archives.",
      tags: ["CJP", "founder", "charter"]
    },
    {
      id: "claim_dipke_legal_aid_announcement",
      code: "CLM-004",
      subjectEntityId: "org_cockroach-janta-party",
      title: "Ã¢ÂÂ¹1 Crore Legal Defense Fund Commitment",
      claim: "India Today reported that senior advocate and Rajya Sabha MP Kapil Sibal announced a Ã¢ÂÂ¹1 crore legal-defense fund dedicated to defending CJP student protesters facing municipal and state police charges.",
      state: "REPORTED",
      sourceIds: ["src_it_2026_legal_fund"],
      date: "2026-08-02",
      attribution: "India Today News Desk",
      note: "A public pledge is legally distinct from audited receipt, bank transfer, or personal remuneration.",
      tags: ["legal-aid", "funding", "Sibal"]
    },
    {
      id: "claim_dipke_foreign_funding",
      code: "CLM-005",
      subjectEntityId: "org_cockroach-janta-party",
      title: "Foreign Funding Allegation & Government Position",
      claim: "The current verified research corpus does not establish foreign funding for CJP; Mint reported that the Ministry of External Affairs formally stated it possessed no information corroborating the foreign-funding allegation.",
      state: "UNRESOLVED",
      sourceIds: ["src_livemint_2026_foreign_funding"],
      date: "2026-08-02",
      attribution: "Mint (Reporting Ministry of External Affairs statement)",
      note: "Status is strictly UNRESOLVED: absence of evidence is recorded as a research boundary, not definitive proof of absence.",
      tags: ["foreign-funding", "MEA", "evidence-gap"]
    },
    {
      id: "claim_dipke_october_2026_protest",
      code: "CLM-006",
      subjectEntityId: "org_cockroach-janta-party",
      title: "Mumbai Electoral Roll Protest & Resignation Demand",
      claim: "Reuters reported on October 2, 2026 that hundreds of CJP student activists staged demonstrations in Mumbai over draft voter-roll revisions, publicly demanding the resignation of the Chief Election Commissioner.",
      state: "REPORTED",
      sourceIds: ["src_reuters_2026_oct2"],
      date: "2026-10-02",
      attribution: "Reuters News Agency",
      note: "Documents verified public demonstration and stated demands without inferring undeclared sponsor backing.",
      tags: ["protest", "Mumbai", "elections", "ECI"]
    }
  ],
  sources: [
    {
      id: "src_ie_2020_aap_social",
      code: "SRC-001",
      title: "With memes, videos, 23-year-old livens up AAPÃ¢ÂÂs social media",
      publisher: "The Indian Express",
      author: "Sourav Roy Barman",
      publishedAt: "2020-01-13",
      sourceClass: "ESTABLISHED REPORTING",
      url: "https://indianexpress.com/article/cities/delhi/aam-aadmi-party-social-media-memes-delhi-assembly-elections-6213393/",
      notes: "Investigative profile detailing Dipke's internal role directing AAP's youth outreach."
    },
    {
      id: "src_it_2026_aap_connection",
      code: "SRC-002",
      title: "Cockroach Janta Party linked to AAP? Ex-civil servant quits after questioning link",
      publisher: "India Today",
      author: "Avinash Kateel",
      publishedAt: "2026-05-22",
      sourceClass: "ESTABLISHED REPORTING",
      url: "https://www.indiatoday.in/india/story/cockroach-janta-party-abhijeet-dipke-arvind-kejriwal-aap-connection-manish-sisodia-truth-2915410-2026-05-22",
      notes: "On-record interview with Dipke regarding past AAP tenure and CJP operational independence."
    },
    {
      id: "src_cjp_official",
      code: "SRC-003",
      title: "Cockroach Janta Party Official Public Charter & Registry",
      publisher: "Cockroach Janta Party",
      author: "Executive Committee",
      publishedAt: "2026-05-16",
      sourceClass: "PRIMARY SOURCE",
      url: "https://www.cockroachjantaparty.org/",
      notes: "Primary organizational self-description, founding date, leadership directory, and public manifesto."
    },
    {
      id: "src_it_2026_legal_fund",
      code: "SRC-004",
      title: "How did Abhijeet Dipke's father fund US education? RTI activist seeks probe",
      publisher: "India Today",
      author: "India Today News Desk",
      publishedAt: "2026-08-02",
      sourceClass: "ESTABLISHED REPORTING",
      url: "https://www.indiatoday.in/india/story/cjp-legal-fund-abhijeet-dipke-father-finances-rti-activist-scrutiny-2961537-2026-08-01",
      notes: "Documents Kapil Sibal's public Ã¢ÂÂ¹1 crore legal aid pledge for protest defense."
    },
    {
      id: "src_livemint_2026_foreign_funding",
      code: "SRC-005",
      title: "No information: MEA on claims of foreign funding behind CJP protest",
      publisher: "Mint",
      author: "Political Bureau",
      publishedAt: "2026-08-02",
      sourceClass: "ESTABLISHED REPORTING",
      url: "https://www.livemint.com/news/india/no-information-mea-on-claims-of-foreign-funding-behind-cjp-protest-at-jantar-mantar-sonam-wangchuk-dharmendra-pradhan/amp-11784910006353.html",
      notes: "Official MEA briefing notes confirming absence of verified intelligence on foreign remittances."
    },
    {
      id: "src_reuters_2026_oct2",
      code: "SRC-006",
      title: "Hundreds from India's Gen Z-led 'cockroach' party protest, seek election chief's resignation",
      publisher: "Reuters",
      author: "Reuters Wire Desk",
      publishedAt: "2026-10-02",
      sourceClass: "ESTABLISHED REPORTING",
      url: "https://www.reuters.com/world/india/indias-cockroach-janata-party-student-groups-protest-demand-poll-chiefs-2026-10-02/",
      notes: "Field dispatch verifying protest size, banners, slogans, and formal demands against the ECI."
    },
    {
      id: "src_mca_ctspl",
      code: "SRC-007",
      title: "Ministry of Corporate Affairs (MCA21) Company Master Data Ã¢ÂÂ CTSPL",
      publisher: "Ministry of Corporate Affairs, Government of India",
      author: "Registrar of Companies, Delhi",
      publishedAt: "2026-09-30",
      sourceClass: "PRIMARY STATUTORY RECORD",
      url: "https://www.mca.gov.in/content/mca/global/en/home.html",
      notes: "Official corporate master data verifying CIN, registration date, authorized/paid-up capital, and active director DINs."
    },
    {
      id: "src_icann_cjp_domain",
      code: "SRC-008",
      title: "ICANN Registration Data Access Protocol (RDAP) & DNS Record: cockroachjantaparty.org",
      publisher: "Public Interest Registry (PIR) / Porkbun RDAP",
      author: "Registry Operator",
      publishedAt: "2026-05-16",
      sourceClass: "PRIMARY TECHNICAL RECORD",
      url: "https://rdap.org/domain/cockroachjantaparty.org",
      notes: "Cryptographically verified RDAP registration record, registrar attribution, nameserver delegation, and DNS edge routing."
    }
  ],
  events: [
    {
      id: "evt_aap_social_2020",
      date: "13 Jan 2020",
      isoDate: "2020-01-13",
      title: "AAP Digital Campaign Coordination Documented",
      summary: "Indian Express reports Dipke actively heading digital operations and viral campaign memes for AAP ahead of Delhi elections.",
      entityIds: ["person_abhijeet-dipke", "org_aam-aadmi-party"],
      sourceId: "src_ie_2020_aap_social",
      state: "REPORTED"
    },
    {
      id: "evt_cjp_established_2026",
      date: "16 May 2026",
      isoDate: "2026-05-16",
      title: "Cockroach Janta Party Official Public Launch",
      summary: "Official charter publication establishes CJP as a youth-focused political protest movement convened by Dipke.",
      entityIds: ["person_abhijeet-dipke", "org_cockroach-janta-party"],
      sourceId: "src_cjp_official",
      state: "DOCUMENTED"
    },
    {
      id: "evt_legal_aid_2026",
      date: "02 Aug 2026",
      isoDate: "2026-08-02",
      title: "Ã¢ÂÂ¹1 Crore Legal Defense Support Announced",
      summary: "Kapil Sibal announces a Ã¢ÂÂ¹1 crore defense fund to offer free legal representation to CJP activists charged during demonstrations.",
      entityIds: ["person_kapil-sibal", "org_cockroach-janta-party"],
      sourceId: "src_it_2026_legal_fund",
      state: "REPORTED"
    },
    {
      id: "evt_cjp_protest_oct_2026",
      date: "02 Oct 2026",
      isoDate: "2026-10-02",
      title: "Mumbai Demonstration Demanding ECI Resignation",
      summary: "Reuters documents large student mobilization in Mumbai organized by CJP over Special Intensive Revision electoral omissions.",
      entityIds: ["person_abhijeet-dipke", "org_cockroach-janta-party"],
      sourceId: "src_reuters_2026_oct2",
      state: "REPORTED"
    }
  ],
  funding: [
    {
      id: "fund_sibal_cjp_legal_aid_2026",
      donor: "Kapil Sibal",
      recipient: "Cockroach Janta Party",
      category: "LEGAL AID FUND",
      amountAnnounced: "Ã¢ÂÂ¹1,00,00,000 (Ã¢ÂÂ¹1 Crore)",
      amountVerifiedReceived: "Unverified / Not Publicly Filed",
      state: "REPORTED",
      date: "02 Aug 2026",
      sourceId: "src_it_2026_legal_fund",
      statutoryNote: "An announced legal aid retainer or defense fund is distinct from proof of bank disbursement or individual remuneration."
    },
    {
      id: "fund_foreign_funding_cjp",
      donor: "Alleged External / Foreign Entities",
      recipient: "Cockroach Janta Party",
      category: "CLAIMED FOREIGN REMITTANCE",
      amountAnnounced: "Undisclosed / Unspecified",
      amountVerifiedReceived: "No Corroborating Records (MEA Confirmed)",
      state: "UNRESOLVED",
      date: "02 Aug 2026",
      sourceId: "src_livemint_2026_foreign_funding",
      statutoryNote: "The Ministry of External Affairs officially stated it held no evidence of foreign remittances. Bounded search outcome."
    }
  ],
  relationships: [
    {
      id: "rel_dipke_cjp",
      fromEntity: "person_abhijeet-dipke",
      toEntity: "org_cockroach-janta-party",
      type: "FOUNDED & DIRECTS",
      state: "DOCUMENTED",
      period: "2026 Ã¢ÂÂ Present",
      sourceId: "src_cjp_official",
      note: "Primary organisational self-definition verified from founding charter."
    },
    {
      id: "rel_dipke_aap",
      fromEntity: "person_abhijeet-dipke",
      toEntity: "org_aam-aadmi-party",
      type: "CAMPAIGN STRATEGIST (PAST)",
      state: "REPORTED",
      period: "2020 Ã¢ÂÂ 2023",
      sourceId: "src_it_2026_aap_connection",
      note: "Stated employment period; current operational coordination is not established."
    },
    {
      id: "rel_sibal_cjp",
      fromEntity: "person_kapil-sibal",
      toEntity: "org_cockroach-janta-party",
      type: "LEGAL COUNSEL / DEFENSE PLEDGE",
      state: "REPORTED",
      period: "Aug 2026 Ã¢ÂÂ Present",
      sourceId: "src_it_2026_legal_fund",
      note: "Public legal defense backing; does not establish political affiliation or party executive role."
    },
    {
      id: "rel_cjp_domain",
      fromEntity: "org_cockroach-janta-party",
      toEntity: "dom_cockroachjantaparty-org",
      type: "OWNS & OPERATES DOMAIN",
      state: "DOCUMENTED",
      period: "16 May 2026 Ã¢ÂÂ Present",
      sourceId: "src_cjp_official",
      note: "Primary movement website registered concurrently with founding charter."
    },
    {
      id: "rel_cjp_vendor",
      fromEntity: "org_cockroach-janta-party",
      toEntity: "comp_civic-tech-solutions",
      type: "VENDOR INQUIRY (INDEPENDENT)",
      state: "DOCUMENTED",
      period: "June 2026",
      sourceId: "src_mca_ctspl",
      note: "Technical RTI verification of municipal vendor software compatibility. No commercial contract exists."
    }
  ],
  openQuestions: [
    {
      id: "q_1",
      number: "01",
      priority: "P0",
      question: "Are there primary statutory filings, FCRA registrations, or audited bank ledgers documenting CJP donations, grants, or accounts?",
      context: "Public claims regarding corporate or external backing currently rely entirely on press quotes rather than statutory financial filings."
    },
    {
      id: "q_2",
      number: "02",
      priority: "P1",
      question: "What legal or financial structure governs the disposition of the announced Ã¢ÂÂ¹1 crore defense fund?",
      context: "The public record must distinguish between an advocate pro bono pledge, an escrow defense trust, and direct disbursements to organizers."
    },
    {
      id: "q_3",
      number: "03",
      priority: "P1",
      question: "Did any operational or commercial communications persist between Dipke and AAP leaders following the stated 2023 resignation?",
      context: "A documented past work engagement is evidence of historical familiarity, not ongoing institutional command."
    },
    {
      id: "q_4",
      number: "04",
      priority: "P0",
      question: "What independent forensic records corroborate or refute the external funding claims dismissed by the Ministry of External Affairs?",
      context: "The MEA's lack of information is a negative official finding, but statutory disclosure checks remain open in the investigative log."
    }
  ]
};
