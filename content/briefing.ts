/**
 * Single source of all copy on the portal.
 *
 * Canonical source: "The True Identity of GCI" (approved PMO brief, 7 pp).
 * - `full` strings are the brief's wording, with three typos corrected
 *   ("Lattice-Based", "light speed to", "foolproof").
 * - `short` strings are the condensed descriptors supplied with the build brief.
 * - Anything marked DRAFT is wording written for this page and needs client approval.
 */

export type Programme = {
  name: string;
  short: string;
  full: string;
};

export type Council = {
  numeral: string;
  key: string;
  title: string;
  /** Short label for rails and the bottom bar. */
  label: string;
  /** Name of the particle form shown for this council. */
  form: string;
  domain?: string;
  programmes: Programme[];
};

export const entity = {
  name: "Global Confederation of Industries",
  short: "GCI",
  legalContext: "Section 8 Apex Corporate Node (Companies Act, 2013)",
  classification: "Restricted · Preliminary Institutional Briefing",
  audience: [
    "MeitY",
    "MoF",
    "TIDCO",
    "NITI Aayog",
    "Global Private Equity",
    "Sovereign Wealth Underwriters",
    "Fortune 500 Boardrooms",
  ],
};

export const hero = {
  /** DRAFT headline, built from the brief's thesis. */
  headline: ["The upstream layer", "of national autonomy."],
  lede:
    "An apex public-private execution platform operating alongside Union Ministries and State Agencies.",
};

export const thesis = {
  /** DRAFT headline. */
  definitionHeadline: "An apex public-private execution platform.",
  definition:
    "GCI operates alongside Union Ministries and State Agencies. It maps and governs the ultimate edge of physical, computational, and biological sciences.",
  mandates: [
    {
      verb: "Localize",
      object: "upstream technology supply chains",
    },
    {
      verb: "De-risk",
      object: "frontier manufacturing",
    },
    {
      verb: "Route",
      object: "non-debt institutional capital into strategic national infrastructure",
    },
  ],
  contrast: {
    incumbent: {
      label: "The incumbent trap",
      lines: [
        "Legacy infrastructure",
        "Risk-averse bureaucracy",
        "Fragmented public-private silos",
        "Expensive subsidy wars over low-margin commercial assembly",
      ],
    },
    gci: {
      label: "The GCI position",
      lines: [
        "Pre-emptively integrates emerging apex technologies",
        "Six structural councils under one cabinet",
        "Specialised, upstream execution",
        "Builds the critical upstream layers that global technology leaders require but domestic frameworks lack",
      ],
    },
  },
  outcomes: ["National autonomy.", "Radical resource efficiency.", "Foolproof systemic safety."],
};

export const councilsIntro = {
  title: "The Six Governing Councils & Macro-Prediction Engine",
  body:
    "GCI operates through an integrated cabinet structure where central leadership coordinates macro-policy and six autonomous councils govern critical tech pillars, supply-chain resilience, and macroeconomic stability.",
};

export const councils: Council[] = [
  {
    numeral: "I",
    key: "materials",
    title: "Semiconductor, Superconductor & Advanced Materials Ecosystem",
    label: "Materials",
    form: "Diamond-cubic lattice",
    programmes: [
      {
        name: "Direct Lithium Extraction (DLE)",
        short:
          "Harvesting battery-grade lithium from brines in hours via chemical separation hubs.",
        full:
          "Bypassing slow, water-intensive evaporation ponds by harvesting battery-grade lithium from brines in hours via advanced chemical separation hubs.",
      },
      {
        name: "Passive Radiative Cooling Metamaterials",
        short:
          "Zero-energy nano-coatings emitting thermal IR heat through the atmospheric window into deep space.",
        full:
          "Deploying zero-energy nano-coatings and structural films that emit thermal infrared heat directly through the atmospheric window into deep space, dropping surface temperatures below ambient without consuming electricity.",
      },
      {
        name: "Supercritical PFAS & “Forever Chemical” Destruction",
        short:
          "Supercritical water oxidation and electrochemical reactors breaking C-F bonds at scale.",
        full:
          "Utilizing supercritical water oxidation and electrochemical reactors to break unbreakable carbon-fluorine bonds in industrial waste streams at scale.",
      },
      {
        name: "Room-Temperature Diamond NV Center Qubits",
        short:
          "Nitrogen-vacancy centers in synthetic diamond matrices for ambient quantum sensing.",
        full:
          "Eliminating cryogenic cooling barriers through nitrogen-vacancy centers in synthetic diamond matrices for ambient-condition quantum sensing and materials characterization.",
      },
      {
        name: "Metamaterial Cloaking & Electromagnetic Shielding",
        short:
          "Negative-index metamaterials bending EM radiation against HEMP and directed-energy weapons.",
        full:
          "Engineering negative-index metamaterials that bend electromagnetic radiation around sensitive infrastructure, rendering assets completely immune to high-altitude electromagnetic pulses (HEMP) and directed-energy weapons.",
      },
      {
        name: "Atomic Layer Deposition (ALD) & Molecular Beam Epitaxy (MBE)",
        short:
          "Monolayer-precise film growth for high-k gate dielectrics and sub-nm logic.",
        full:
          "Perfecting monolayer-precise film growth to construct high-k gate dielectrics and quantum-well heterostructures required for sub-nanometer logic and ultra-dense storage.",
      },
      {
        name: "Topological Insulators & Weyl Fermion Conductors",
        short:
          "Loss-free surface electron flow without backscattering or thermal dissipation.",
        full:
          "Moving beyond standard sub-nanometer silicon by engineering materials where electrons flow entirely loss-free along surface boundaries without backscattering, eliminating thermal dissipation at the atomic scale.",
      },
      {
        name: "Direct-Write Quantum Dot Printing & Sub-Wavelength Lithography",
        short:
          "Bypassing EUV mask limits via nanophotonic stamping for sub-5nm devices.",
        full:
          "Bypassing traditional extreme ultraviolet (EUV) optical mask limits using direct-write nanophotonic stamping to fabricate sub-5nm multi-layered optoelectronic devices.",
      },
      {
        name: "Autonomous Materials Discovery",
        short:
          "AI-driven closed-loop robotic synthesis labs discovering superconducting compounds in days.",
        full:
          "AI-driven high-throughput synthesis: deploying closed-loop robotic synthesis labs driven by generative chemistry models to discover, test, and scale novel wide-bandgap and superconducting compounds in days instead of decades.",
      },
      {
        name: "Metamaterial Acoustic & EM Lattices",
        short:
          "Rendering critical infrastructure and transport invisible to radar, sonar, and directed-energy tracking.",
        full:
          "Engineering negative-index acoustic and electromagnetic lattices that render critical infrastructure and advanced transport completely invisible to radar, sonar, and directed-energy tracking.",
      },
    ],
  },
  {
    numeral: "II",
    key: "compute",
    title: "Artificial Intelligence & Post-Silicon Compute",
    label: "AI & Compute",
    form: "Photonic layer stack",
    programmes: [
      {
        name: "Petahertz-Scale All-Optical Logic",
        short:
          "Photonic Integrated Circuits executing logic at light speed to eradicate data center thermal walls.",
        full:
          "Transitioning away from electron resistance by implementing Photonic Integrated Circuits (PICs) that execute logic operations at light speed to eradicate data center thermal walls.",
      },
      {
        name: "World-Model & Multi-Agent AI Systems",
        short:
          "Autonomous optimization of industrial corridors, automated factories, and national power grids.",
        full:
          "Deploying advanced AI agents equipped with internal environment simulations to autonomously optimize complex industrial corridors, automated factories, and national power grids.",
      },
      {
        name: "Context-Driven Semantic Knowledge Graphs",
        short:
          "Persistent high-dimensional semantic layers for zero-hallucination, zero-leakage enterprise AI queries.",
        full:
          "Establishing persistent, high-dimensional semantic layers that enable enterprise AI systems to securely query proprietary technical data without hallucinations or systemic leakage.",
      },
      {
        name: "Neuromorphic Spiking Neural Networks (SNNs)",
        short:
          "Brain-inspired microwatt asynchronous hardware for edge-AI defense and remote sensors.",
        full:
          "Deploying brain-inspired hardware architectures that process information asynchronously and consume micro-watts of power, enabling edge-AI intelligence in autonomous defense and remote sensor arrays.",
      },
      {
        name: "DNA Data Storage & Molecular Computing",
        short:
          "Synthesized DNA oligomers archiving centuries of data in a fingertip with zero power degradation.",
        full:
          "Utilizing synthesized DNA oligomers as a high-density, ultra-stable storage medium capable of archiving centuries of human data in a space the size of a fingertip with zero power degradation.",
      },
      {
        name: "Homomorphic Confidential Computing Infrastructure",
        short:
          "Hardware-encrypted computation allowing third-party AI processing while data remains encrypted in use.",
        full:
          "Enforcing hardware-encrypted computation layers that allow sensitive government and financial data to be processed by third-party AI models while remaining fully encrypted while in use.",
      },
    ],
  },
  {
    numeral: "III",
    key: "defense",
    title: "Cyber Security & Sovereign Defense",
    label: "Cyber & Defense",
    form: "Geodesic shield",
    programmes: [
      {
        name: "Autonomous Swarm Cyber-Deception",
        short:
          "Dynamic honeytoken nets: real-time AI synthetic decoy networks trapping state-sponsored APTs.",
        full:
          "Dynamic honeytoken nets: deploying real-time, AI-generated synthetic enterprise networks and decoy microservices that actively mislead, trap, and neutralize state-sponsored APT intrusions before they touch core infrastructure.",
      },
      {
        name: "Quantum Key Distribution (QKD) & Entangled Fiber Backbones",
        short:
          "Physics-guaranteed channels where interception alters quantum state and collapses the link.",
        full:
          "Implementing physics-guaranteed communication networks where any adversarial interception attempt alters the quantum state and instantly collapses the data channel.",
      },
      {
        name: "Zero-Trust Cryo-Physical Cleanroom Telemetry",
        short:
          "Air-gapped hardware isolation neutralizing supply-chain espionage during fabrication.",
        full:
          "Enforcing air-gapped, hardware-level isolation protocols across advanced manufacturing lines to neutralize physical hardware-injection or supply-chain espionage during cleanroom fabrication.",
      },
      {
        name: "Preemptive AI-Driven Cybersecurity",
        short:
          "Autonomous code-rewriting and predictive behavioral threat neutralization.",
        full:
          "Shifting defense from reactive patch-management to autonomous, proactive code-rewriting and threat neutralization using predictive behavioral models.",
      },
      {
        name: "Lattice-Based Post-Quantum Cryptography (PQC)",
        short:
          "Hardening national comms, finance, and grids against “Harvest Now, Decrypt Later” (ML-KEM / ML-DSA).",
        full:
          "Hardening all national communication lines, financial systems, and grid backbones against “Harvest Now, Decrypt Later” threats using hard math standards (ML-KEM / ML-DSA).",
      },
    ],
  },
  {
    numeral: "IV",
    key: "foresight",
    title: "Strategic Foresight & Translational Labs",
    label: "Foresight & Labs",
    form: "Double helix",
    domain: "Ministry of Future Disruptions",
    programmes: [
      {
        name: "Precision Industrial Fermentation",
        short:
          "Engineered microbes synthesizing structural proteins, polymers, and feedstocks independent of climate or land.",
        full:
          "Programming custom engineered microbes to synthesize complex structural proteins, specialized polymers, and chemical feedstocks independently of climate, arable land, or seasonal agriculture.",
      },
      {
        name: "Attosecond Metrology & Nanophysics Pipelines",
        short:
          "Direct translation pipelines from IIT quantum labs into open-access hardware micro-foundries.",
        full:
          "Creating direct translation pipelines from academic quantum physics labs (e.g., IIT networks) into open-access hardware micro-foundries for domestic founders.",
      },
      {
        name: "Targeted Exosome Drug Delivery",
        short:
          "Molecular couriers transporting biological payloads across the blood-brain barrier.",
        full:
          "Harnessing the body's natural molecular couriers to safely transport biological payloads across complex barriers like the blood-brain barrier.",
      },
      {
        name: "Synthetic Biology & Gene-Drive Containment Switches",
        short:
          "Fail-safe genetic kill-switches ensuring zero accidental environmental spread.",
        full:
          "Engineering fail-safe genetic kill-switches into synthetic organisms to ensure zero accidental environmental spread during large-scale bio-manufacturing runs.",
      },
      {
        name: "Advanced Magnetohydrodynamic (MHD) Propulsion",
        short:
          "Moving-fluid plasma drives with zero mechanical moving parts for aerospace and maritime.",
        full:
          "Researching moving-fluid plasma drives with zero mechanical moving parts for high-efficiency aerospace and maritime transport.",
      },
    ],
  },
  {
    numeral: "V",
    key: "economy",
    title: "Economic Growth & Stability Forum",
    label: "Economic Stability",
    form: "Ledger terraces",
    domain: "Ministry of Sovereign Capital Realignment",
    programmes: [
      {
        name: "Everything-to-Grid (E2G) Decentralized Energy Integration",
        short:
          "Converting commercial assets, EV fleets, and industrial microgrids into active grid reserves.",
        full:
          "Converting distributed commercial assets, EV fleets, and industrial microgrids into active real-time grid stabilization and energy storage reserves.",
      },
      {
        name: "Off-Balance-Sheet Asset-Substitution Models",
        short:
          "Routing non-debt institutional PE into shovel-ready national utility infrastructure to compress state debt-to-GSDP ratios.",
        full:
          "Routing non-debt institutional private equity directly into shovel-ready national utility infrastructure to compress state debt-to-GSDP ratios.",
      },
      {
        name: "Autonomous Smart-Contract Fiscal Ledgers",
        short:
          "Cryptographic immutable treasury distribution automating public-private financing and eliminating leakage.",
        full:
          "Deploying cryptographic, immutable treasury distribution protocols that automate public-private project financing and eliminate bureaucratic corruption or fund leakage.",
      },
    ],
  },
  {
    numeral: "VI",
    key: "trade",
    title: "Global Trade Architecture & Neutral Diplomacy",
    label: "Trade & Diplomacy",
    form: "Corridor globe",
    domain: "Ministry of Neutral Diplomacy",
    programmes: [
      {
        name: "Cross-Border Strategic Supply-Chain Redundancies",
        short:
          "Non-aligned regulatory sandboxes and bilateral frameworks insulating corridors from tariffs and blockades.",
        full:
          "Authoring non-aligned regulatory sandboxes and bilateral trade frameworks that insulate critical manufacturing corridors from shifting international tariffs and export blockades.",
      },
      {
        name: "Predictive Geopolitical Risk Hedging",
        short:
          "Continuous macroeconomic simulations anticipating trade friction, sanctions, and mineral chokepoints.",
        full:
          "Running continuous macroeconomic simulation models to anticipate trade friction, sanction vectors, and critical mineral chokepoints before they impact domestic industrial output.",
      },
      {
        name: "Autonomous Bilateral Trade Settlement Corridors",
        short:
          "Multi-lateral currency-swap frameworks and non-dollar digital settlement rails.",
        full:
          "Establishing direct, multi-lateral currency-swap frameworks and non-dollar digital settlement rails that protect sovereign trade against external weaponized financial systems.",
      },
      {
        name: "Non-Aligned Regulatory Sandboxes",
        short:
          "Cross-border legal frameworks for frictionless testing of dual-use, export-controlled technologies.",
        full:
          "Authoring cross-border legal frameworks that permit frictionless testing of dual-use, export-controlled technologies outside traditional Western trade blocs.",
      },
    ],
  },
];

export const programmeCount = councils.reduce((n, c) => n + c.programmes.length, 0);

export const esg = {
  title: "Preemptive ESG & Catastrophic Risk Mitigation",
  mandate:
    "GCI's primary mandate is ensuring that humanity does not fracture under reckless, uncontained scientific experimentation.",
  preface:
    "To prevent first-world technological overreach from triggering systemic ecological or digital collapse, GCI enforces:",
  mandates: [
    {
      title: "Mandatory Pre-Deployment Algorithmic & Biological Audits",
      body:
        "Independent multi-agent simulation testing for any frontier AI model or synthetic biology output prior to commercial or state integration.",
    },
    {
      title: "Zero-Discharge Closed-Loop Mandates",
      body:
        "Absolute circularity requirements for advanced chemical synthesis and material processing, transforming industrial waste streams into immediate manufacturing inputs.",
    },
    {
      title: "Generational Human Capital Binding",
      body:
        "Automatically funneling a fixed percentage of all advanced industrial yields into the Silicon Seedling Initiative and regional open-access fab-lab networks to secure long-term domestic talent sovereignty.",
      callout: "Silicon Seedling Initiative",
    },
  ],
};

export const legal = {
  title: "Legal Notice & Intellectual Property Exclusivity",
  header: "Global Confederation of Industries (GCI) Proposed Section 8 Apex Node",
  warning: [
    "The architectural frameworks, predictive models, governing matrices, proprietary nomenclature, and strategic governance doctrines contained within this portal constitute the exclusive, proprietary intellectual property of the Global Confederation of Industries (GCI) initiative.",
    "Unauthorized reproduction, duplication, extraction, or commercial misappropriation of this material in whole or in part by web development personnel, corporate entities, sovereign agencies, or unauthorized third parties is strictly prohibited.",
  ],
  enforcementTitle: "Enforcement & Liability Governance",
  clauses: [
    {
      title: "Strict Confidentiality & Non-Disclosure",
      short: "Access is restricted to designated secretariats, accredited underwriters, and authorized personnel.",
      body:
        "Access to this preliminary institutional briefing portal is restricted solely to designated government secretariats, accredited institutional underwriters, and authorized administrative personnel.",
    },
    {
      title: "Zero-Tolerance for Misappropriation",
      short: "Any attempt to plagiarize, mirror, re-brand, or exploit these frameworks will result in legal action.",
      body:
        "Any attempt by web development contractors, design agencies, or external corporate actors to plagiarize, mirror, re-brand, or commercially exploit these operational frameworks, systemic equations, or council taxonomies will result in immediate, unsparing legal action.",
    },
    {
      title: "Statutory Penalties",
      short: "Infringement will be prosecuted under applicable civil and criminal jurisprudence.",
      body:
        "Infringement, unauthorized caching, or unauthorized deployment of GCI's proprietary institutional architecture will be prosecuted to the absolute limit under applicable civil and criminal jurisprudence, including intellectual property protections, breach of fiduciary trust, and statutory damages under corporate law.",
    },
  ],
  acknowledgment:
    "By accessing, viewing, or interacting with the code, text, or structural layouts of this portal, you acknowledge that you are bound by these terms under direct legal liability.",
};
