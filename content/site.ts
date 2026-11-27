/**
 * The words on the page, written for the web (27 Nov 2026).
 *
 * Kiran asked for copy that reads like a website, not the charter pasted in: shorter, plain,
 * and no em dashes. Everything here is rewritten from the Master Institutional Charter
 * (./charter.ts). The charter itself stays the reference, and its legal texts (the statute,
 * the access acknowledgment and the footer notice) are still shown word for word.
 *
 * House style: British spelling, sentence case, short sentences, no em dashes.
 */

export type SiteInitiative = { n: number; name: string; line: string };
export type SiteDivision = { code: string; name: string; items: readonly SiteInitiative[] };
export type SiteCouncil = {
  numeral: string;
  name: string;
  line: string;
  divisions: readonly SiteDivision[];
};

export const hero = {
  eyebrow: "Global Confederation of Industries",
  headline: ["From India’s laboratories", "to national scale."],
  lede: "A non-governmental platform where ministries, industry and capital build the science, infrastructure and industry India depends on.",
  counterpartsLabel: "Institutional counterparts",
  cue: "Scroll",
};

export const about = {
  kicker: "What GCI does",
  headline: "Chambers of commerce advise. GCI builds.",
  body: "Traditional industry bodies lobby on tariffs and assemble other people’s technology. GCI works with Union Ministries, State Secretariats and international partners to make the foundations here, at home.",
  contrast: {
    old: { label: "The old model", lines: ["Advocacy", "Tariff lobbying", "Downstream assembly"] },
    gci: {
      label: "The GCI model",
      lines: [
        "Capital tooling",
        "Green construction",
        "Physical AI and sensor networks",
        "Defence resilience",
        "24/7 clean power",
        "New-age transport",
        "Remediation chemistry",
        "Non-debt finance",
      ],
    },
  },
  mandatesKicker: "Three jobs",
  mandates: [
    {
      name: "Scale Indian science",
      line: "Take proven breakthroughs from Indian labs to factory scale, in step with the ANRF Act, 2023.",
    },
    {
      name: "Restore the commons",
      line: "Bring rivers, air and soil back with new chemistry, separated sewage grids and sensors that cannot be faked.",
    },
    {
      name: "Modernise without shutdowns",
      line: "Fit existing MSMEs and heavy industry with clean hardware, so carbon rules become an export advantage.",
    },
  ],
  closing: "Everything GCI incubates stays Indian. A shared technology commons for citizens and partner nations alike.",
};

export const councilsIntro = {
  kicker: "Six councils",
  headline: "One hundred initiatives. Six councils. One plan.",
  body: "Each initiative has to do three things: strengthen the nation, make daily life better, and prove its results with physical sensors.",
  living: "The Central Secretariat can charter new working groups as science, infrastructure and partner nations move.",
  explore: "See all initiatives",
};

export const councils: readonly SiteCouncil[] = [
  {
    numeral: "I",
    name: "Materials & Construction",
    line: "New materials, clean metal, and buildings that look after themselves.",
    divisions: [
      {
        code: "I-A",
        name: "Materials physics",
        items: [
          { n: 1, name: "Superconducting cables", line: "Zero-loss tapes and cables for the grid, compact fusion and maglev." },
          { n: 2, name: "Heat-free conductors", line: "Electronics and supercomputers that waste no power as heat." },
          { n: 3, name: "Chips printed in India", line: "Sub-5nm chips made at home, without $350M imported lithography tools." },
          { n: 4, name: "Atomic-layer films", line: "Gallium nitride for radar, micro-LED screens and fast chargers, with less toxic waste." },
          { n: 5, name: "Diamond quantum sensors", line: "Room-temperature sensors for wafer testing and portable heart and brain scanners." },
          { n: 6, name: "Robotic materials labs", line: "Self-driving labs inventing magnets and batteries free of rare earths and cobalt." },
          { n: 7, name: "Cooling without power", line: "Films that send a building’s heat into space, and panels that make power at night." },
          { n: 8, name: "Shielding surfaces", line: "Smart surfaces that protect the grid from electromagnetic attack and quieten aircraft noise." },
        ],
      },
      {
        code: "I-B",
        name: "Green construction",
        items: [
          { n: 9, name: "Self-healing concrete", line: "Low-carbon concrete that seals its own cracks and outlasts today’s bridges and ports." },
          { n: 10, name: "Earthquake cloaking", line: "Foundations that bend seismic waves around hospitals, dams and power plants." },
          { n: 11, name: "Factory-built construction", line: "Modules made in factories, and robots that fuse local sand into structure." },
          { n: 12, name: "Structures that report", line: "Sensors inside bridges, tunnels and dams that flag danger in real time." },
          { n: 13, name: "Carbon into roads", line: "Captured CO₂ locked into gravel for national highways." },
        ],
      },
      {
        code: "I-C",
        name: "Tools and clean metal",
        items: [
          { n: 14, name: "Metre-scale metal printers", line: "Weld-free rocket engines, turbines and implants, with 98% of powder reused." },
          { n: 15, name: "Oil-free precision machining", line: "Cryogenic machining of satellite mirrors and armour, with no cutting oils." },
          { n: 16, name: "Cold-laser machining", line: "Cooling channels in turbine blades and stents, cut without heat damage." },
          { n: 17, name: "Green steel", line: "Iron and aluminium made with hydrogen plasma. The only exhaust is water or oxygen." },
          { n: 18, name: "Metal restoration", line: "Worn turbines, frames and hulls rebuilt by cold spray and checked as it happens." },
        ],
      },
      {
        code: "I-D",
        name: "Resources and water",
        items: [
          { n: 19, name: "Lithium from brine and sea", line: "Battery-grade lithium in hours with 90% less water, plus minerals harvested from seawater." },
          { n: 20, name: "Urban mining", line: "Gold, cobalt and rare earths recovered from e-waste and spent EV batteries." },
          { n: 21, name: "Water from air", line: "Desalination that leaves no brine, and panels that pull drinking water from desert air." },
          { n: 22, name: "Japan-grade sewage grids", line: "Separate storm and sewage networks, fully treated water, and recharged aquifers." },
          { n: 23, name: "Green remediation chemistry", line: "Biodegradable chemistry that restores polluted rivers and lakes and leaves no residue." },
          { n: 24, name: "Ending forever chemicals", line: "Reactors that destroy 99.999% of PFAS, and clean retrofits for heavy industry." },
        ],
      },
    ],
  },
  {
    numeral: "II",
    name: "Compute & Physical AI",
    line: "Computing with light, and AI that works safely in the physical world.",
    divisions: [
      {
        code: "II-A",
        name: "New kinds of computing",
        items: [
          { n: 25, name: "Light-speed chips", line: "Photonic chips that cut data-centre power and cooling water by 85%." },
          { n: 26, name: "Photonic networks", line: "Links near the speed of light for low-latency clearing and planetary networks." },
          { n: 27, name: "Brain-like chips", line: "Micro-watt chips that optimise grids and logistics at a fraction of GPU power." },
          { n: 28, name: "Living computers", line: "Lab-grown neural tissue for adaptive learning and drug screening." },
          { n: 29, name: "DNA archives", line: "Land and court records kept in DNA for 1,000 years, with no power." },
        ],
      },
      {
        code: "II-B",
        name: "Physical AI and sensors",
        items: [
          { n: 30, name: "Environmental analysers", line: "Instruments that measure water, air, flue gas and sewage, around the clock." },
          { n: 31, name: "Robot skin", line: "Touch and force sensing for robots, construction machines and prosthetics." },
          { n: 32, name: "Battery-free sensor dust", line: "Tiny sensors powered by vibration and heat, for bridges, rivers and pipelines." },
          { n: 33, name: "Control at the edge", line: "Sensor data fused on site, so plants react in under a millisecond." },
          { n: 34, name: "Provably safe autonomy", line: "Mathematically verified safety cores that no AI model can override." },
        ],
      },
      {
        code: "II-C",
        name: "Secure AI and networks",
        items: [
          { n: 35, name: "Encrypted computing", line: "Ministries, banks and hospitals train AI on data that stays encrypted." },
          { n: 36, name: "National digital twins", line: "Simulations that balance grids, drainage, freight and traffic." },
          { n: 37, name: "Trusted knowledge graphs", line: "Air-gapped knowledge systems for blueprints, statutes and clinical rules." },
          { n: 38, name: "Switchable swarm factories", line: "Robot cells that move from consumer goods to emergency hardware in hours." },
          { n: 39, name: "6G that senses", line: "Terabit wireless that also turns towers into airspace and weather radar." },
        ],
      },
    ],
  },
  {
    numeral: "III",
    name: "Cyber & Resilience",
    line: "Defending networks, borders, orbit and the seabed.",
    divisions: [
      {
        code: "III-A",
        name: "Cyber defence",
        items: [
          { n: 40, name: "Quantum-secure links", line: "Fibre links between command centres where any tap breaks the signal." },
          { n: 41, name: "Post-quantum encryption", line: "Bond ledgers, satellites and UPI upgraded against quantum attack." },
          { n: 42, name: "Cyber decoys", line: "Decoy networks that trap state hackers and phone scammers." },
          { n: 43, name: "Self-healing firmware", line: "Grid controllers and vehicles that patch themselves before an exploit runs." },
          { n: 44, name: "Clean chip fabs", line: "Checks that stop hardware Trojans in defence and automotive chips." },
          { n: 45, name: "Unclonable chips", line: "Atomic fingerprints that make Indian chips and sensors impossible to copy or spoof." },
        ],
      },
      {
        code: "III-B",
        name: "Surveillance",
        items: [
          { n: 46, name: "Quantum radar", line: "Finds stealth aircraft and drones through jamming, without being seen." },
          { n: 47, name: "Seeing around corners", line: "Imaging that finds people behind walls and inside collapsed buildings." },
          { n: 48, name: "Muon and gravity scanning", line: "Passive scanners that find nuclear material in containers and tunnels under borders." },
          { n: 49, name: "Micro-drone swarms", line: "Insect-sized drones that spot camouflage, landmines, wildfires and illegal dumping." },
          { n: 50, name: "Stratospheric platforms", line: "Solar aircraft that stay up for months, for broadband, borders and watersheds." },
        ],
      },
      {
        code: "III-C",
        name: "Navigation, orbit and seabed",
        items: [
          { n: 51, name: "Navigation without GPS", line: "Atomic sensors that navigate to the metre when GPS is gone." },
          { n: 52, name: "Very-low-orbit satellites", line: "Satellites that breathe air for longer life and sharper imaging." },
          { n: 53, name: "Orbital servicing", line: "Robots that refuel satellites and clear space debris." },
          { n: 54, name: "Seabed protection", line: "Sensor grids that guard subsea cables and pipelines." },
        ],
      },
    ],
  },
  {
    numeral: "IV",
    name: "Bio, Agro & Space",
    line: "Food, medicine and materials grown by biology, and foundries in orbit.",
    divisions: [
      {
        code: "IV-A",
        name: "Biomanufacturing and farms",
        items: [
          { n: 55, name: "Air-to-protein", line: "Microbes turn CO₂ and crop waste into fuel, fibre and food protein." },
          { n: 56, name: "Fertiliser made on the farm", line: "Solar reactors make green ammonia on site, cutting ₹1.7 lakh crore of urea imports." },
          { n: 57, name: "Climate-proof crops", line: "Non-GMO rice and wheat with up to 50% more grain on less water." },
          { n: 58, name: "Laser farming", line: "Solar rovers that test the soil and remove weeds without herbicide." },
          { n: 59, name: "Cold chains for mandis", line: "Solar cold rooms that sense spoilage before it happens." },
          { n: 60, name: "Living seawalls", line: "Breakwaters grown from seawater minerals that repair themselves." },
          { n: 61, name: "Biosafety", line: "Kill switches for industrial microbes, and sensors that detect pathogens in air and wastewater." },
        ],
      },
      {
        code: "IV-B",
        name: "Medicine",
        items: [
          { n: 62, name: "Therapies for the brain", line: "Treatments that reach the brain for Alzheimer’s, Parkinson’s and cancer." },
          { n: 63, name: "Printed organs", line: "Kidneys, corneas and skin printed from a patient’s own cells." },
          { n: 64, name: "Non-invasive neural links", line: "Headbands that let paralysed citizens control prosthetics and computers." },
        ],
      },
      {
        code: "IV-C",
        name: "Physics and space",
        items: [
          { n: 65, name: "Lab-to-foundry pipelines", line: "Routes from Indian quantum labs to open micro-foundries, keeping talent at home." },
          { n: 66, name: "Orbital foundries", line: "Capsules that make flawless optical fibre and pure antibodies in microgravity." },
          { n: 67, name: "Lunar resources", line: "Oxygen, titanium and silicon from lunar soil, with clean-metal spin-offs on Earth." },
          { n: 68, name: "Light-sail research", line: "Laser-sail concepts whose ultra-reflective optics are useful today." },
        ],
      },
    ],
  },
  {
    numeral: "V",
    name: "Energy, Mobility & Capital",
    line: "Clean power around the clock, new transport, and finance that adds no debt.",
    divisions: [
      {
        code: "V-A",
        name: "Clean power",
        items: [
          { n: 69, name: "Thorium reactors", line: "Meltdown-proof molten-salt reactors on India’s thorium, to replace coal now." },
          { n: 70, name: "Compact fusion", line: "Fusion cores with no radioactive waste, for the next horizon." },
          { n: 71, name: "Deep geothermal", line: "Beams that drill 15 km into granite and repower retiring coal plants." },
          { n: 72, name: "Solar power from space", line: "Satellites that beam power through monsoon clouds to islands and villages." },
          { n: 73, name: "Tandem solar and wind kites", line: "30%+ solar cells, and high-altitude kites that need 90% less steel." },
          { n: 74, name: "Blue energy", line: "Power from salinity, ocean heat, waves and humidity along the coast." },
          { n: 75, name: "sCO₂ turbines", line: "Desk-sized turbines 40% more efficient, and heat banks that reuse factory heat." },
          { n: 76, name: "Diamond batteries", line: "Nuclear waste turned into 50-year batteries for sensors and pacemakers." },
          { n: 77, name: "Multi-day storage", line: "100 hours of lithium-free storage in magnets, gravity, firebrick and liquid air." },
          { n: 78, name: "Vehicles that power the grid", line: "Inverters that turn EV fleets into virtual power plants." },
          { n: 79, name: "Grid analysers", line: "Microsecond sensors that catch faults across the transmission network." },
        ],
      },
      {
        code: "V-B",
        name: "Transport",
        items: [
          { n: 80, name: "Reactor-powered cargo ships", line: "Container ships that run 20+ years without refuelling or bunker fuel." },
          { n: 81, name: "Silent marine drives", line: "Propeller-free magnetic thrusters and green-ammonia coastal fleets." },
          { n: 82, name: "Maglev freight", line: "600 km/h cargo lines that halve the cost of moving goods from port to hub." },
          { n: 83, name: "Hydrogen aircraft", line: "Zero-emission regional airliners and heavy airlift." },
          { n: 84, name: "Wing-in-ground freighters", line: "Craft that skim the sea at 300+ km/h, between ship and plane." },
          { n: 85, name: "Battery chassis", line: "Fireproof, lithium-free batteries that form the vehicle’s frame." },
          { n: 86, name: "Rare-earth-free motors", line: "High-torque motors with no neodymium, safe from export controls." },
          { n: 87, name: "Battery recycling", line: "Robotic teardown, and second-life storage for microgrids." },
          { n: 88, name: "Vehicle and ship diagnostics", line: "Onboard sensors for batteries, hulls and V2X safety." },
        ],
      },
      {
        code: "V-C",
        name: "Finance",
        items: [
          { n: 89, name: "Off-balance-sheet finance", line: "Pension and sovereign capital into utilities, without adding public debt." },
          { n: 90, name: "Smart-contract ledgers", line: "Contractors are paid automatically once satellites and sensors confirm the work." },
        ],
      },
    ],
  },
  {
    numeral: "VI",
    name: "Trade & Diplomacy",
    line: "Supply chains that hold, trade that clears fast, and oceans kept healthy.",
    divisions: [
      {
        code: "VI-A",
        name: "Supply chains and settlement",
        items: [
          { n: 91, name: "Backup supply corridors", line: "Dual sourcing so fabs, defence lines and pharma plants never stop." },
          { n: 92, name: "Chokepoint forecasting", line: "Six-month forecasts for Malacca, Hormuz and Suez, so cargo reroutes early." },
          { n: 93, name: "Rupee settlement", line: "Trade cleared in local currency through RBI-compliant rails, cutting remittance costs." },
        ],
      },
      {
        code: "VI-B",
        name: "Standards, oceans and green trade",
        items: [
          { n: 94, name: "Joint certification", line: "Partner nations certify clean-tech, medical and quantum hardware together." },
          { n: 95, name: "Deep-ocean minerals", line: "Nodules gathered across India’s EEZ by closed-loop rovers that protect the seabed." },
          { n: 96, name: "Digital customs", line: "Cryptographic papers and sealed-container sensors clear cargo in seconds." },
          { n: 97, name: "Carbon clearinghouse", line: "A satellite-verified registry that lines Indian exports up with CCTS, Article 6 and CBAM." },
          { n: 98, name: "Reactor-ship port accord", line: "Agreements that let reactor-powered ships trade freely at partner ports." },
          { n: 99, name: "Global South compacts", line: "Technology transfer for water, sanitation and remediation across partner nations." },
          { n: 100, name: "Shared audit data", line: "Common sensor proof for carbon, effluent and recycling claims across borders." },
        ],
      },
    ],
  },
];

export const restoration = {
  kicker: "Planetary restoration",
  headline: "Every project must leave the land healthier than it found it.",
  lede: "No pledges. Sensors measure the air, rivers, soil and sea before work starts, and the money stops if they get worse.",
  sensors: {
    title: "Sensors, not self-reporting",
    intro: "Every park, corridor, port and plant streams signed data from tamper-proof instruments.",
    groups: [
      { name: "Water and sewage", line: "Oxygen, heavy metals, microplastics, PFAS and pathogens." },
      { name: "Air and stacks", line: "Methane, CO₂, NOx, SOx and fine particulates." },
      { name: "Soil, groundwater and sea", line: "Salinity, contaminant plumes, noise and ocean acidity." },
    ],
  },
  chemistry: {
    title: "Chemistry that cleans without leaving damage",
    intro: "Initiative 23 turns lab chemistry into products for water boards and industry, replacing the toxic coagulants used today.",
    items: [
      { name: "Nano-flocculants", line: "Turn murky water into safe biomass for the soil." },
      { name: "Oxidation and nanobubbles", line: "Break down dyes and drug residues, and bring dead lakes back within hours." },
      { name: "Metal-catching polymers", line: "Pull chromium and lead from tannery runoff and send them back to industry." },
      { name: "Contained enzymes", line: "Digest oil slicks and fatbergs without harming aquatic life." },
    ],
  },
  rules: {
    title: "Three rules for every corridor",
    items: [
      { code: "A", name: "Water-positive cities", line: "Separate sewers, full treatment before anything reaches a river, and rain sent back into aquifers." },
      { code: "B", name: "Exit coal now, pivot next", line: "Thorium reactors and waste-heat turbines today, built to switch to fusion and deep geothermal later." },
      { code: "C", name: "Price the true cost", line: "Recovery and recharge are priced in before funding. MSMEs get subsidised clean hardware." },
    ],
  },
  xray: {
    hint: "Move across the city to see what lies beneath",
    hintTouch: "Scroll to see what lies beneath",
    labels: ["Separated sewers", "Aquifer recharge wells", "Signed sensors"],
  },
  chokes: {
    title: "Six points where pollution gets stopped",
    intro: "Every project is gated, physically and by contract.",
    columns: ["Choke point", "How it works", "What it stops"],
    rows: [
      { n: 1, name: "Baseline and bond", how: "Thirty days of independent measurement before ground-breaking, backed by a remediation bond.", stops: "Disputes over who polluted first, and abandoned sites." },
      { n: 2, name: "Shut-off valves", how: "Signed flow meters and automatic valves on every pipe and stack.", stops: "Midnight dumping. Off-spec waste goes into sealed tanks instead." },
      { n: 3, name: "Payments freeze", how: "Sensor data feeds the smart-contract ledger (initiative 90).", stops: "Greenwashing. Break a limit and payouts stop until it is fixed." },
      { n: 4, name: "Supply-chain balance", how: "Inputs and outputs tracked down to Tier-2 and Tier-3 suppliers.", stops: "Hiding dirty work in small, unregulated shops." },
      { n: 5, name: "Heat and health red line", how: "River temperature and toxic-air triggers wired into plant controls.", stops: "Hot water killing rivers, and plants running through pollution spikes." },
      { n: 6, name: "Decommissioning reserve", how: "A recycling fund builds up over each asset’s working life.", stops: "Panels, batteries and blades abandoned at end of life." },
    ],
  },
};

export const stewardships = {
  kicker: "Stewardships",
  headline: "Seven promises that protect people, not only the planet.",
  lede: "Every council and every partner is bound by them.",
  items: [
    { n: 1, name: "Workers first", line: "Automation funds reskilling, wearables halt work in deadly heat, and small suppliers are paid within 15 days." },
    { n: 2, name: "Bio-ethics", line: "No germline editing or uncontained gene drives. Brain data belongs to the person. Medicines and seeds stay affordable." },
    { n: 3, name: "Privacy", line: "Surveillance needs two keys and leaves an audit trail. A human can always override the machine." },
    { n: 4, name: "Orbit and oceans", line: "A bond for every satellite against debris. Seabed mining stops on its own if marine life is at risk." },
    { n: 5, name: "No capture", line: "No conglomerate or foreign investor can control the standards. Indian IP stays in India, at fair prices for cities." },
    { n: 6, name: "Clean supply chains", line: "Every mineral shipment proves it is conflict-free and made without forced or child labour." },
    { n: 7, name: "Silicon Seedling", line: "Wildlife corridors, quiet nights and dark skies. A share of every licence funds open micro-foundries that train young Indian scientists." },
  ],
};

export const governance = {
  kicker: "Governance",
  headline: "The rules GCI is bound by.",
  lede: "The charter’s statutory framework, in full. Each section opens with a plain summary.",
  particularsLabel: "Particulars",
  contentsLabel: "Sections",
  /** One plain-language line per statute section, in order (1 to 6). */
  summaries: [
    "A Section 8 company that advises and facilitates. It claims no government power or patronage.",
    "Domestic funds and regulated investment vehicles are kept apart, under FCRA, FEMA and the ANRF rules.",
    "GCI follows India’s foreign policy, export controls and international law on climate, space, sea and biosafety.",
    "Everything in the charter belongs to GCI and stays confidential. Reading it grants no licence.",
    "The sovereign powers of India and of foreign states are respected. Disputes go to arbitration.",
    "Copying, passing off or scraping GCI’s work is prohibited. The Central Secretariat keeps final control.",
  ],
  readFull: "Read the full text",
};

export const gate = {
  button: "Press and hold to enter",
  keyboard: "Keyboard: press Enter",
};

/** Chapter names for the header, menu and bottom bar. */
export const chapters = [
  { id: "hero", n: "01", label: "GCI" },
  { id: "thesis", n: "02", label: "What we do" },
  { id: "councils", n: "03", label: "Six councils" },
  { id: "restoration", n: "04", label: "Restoration" },
  { id: "stewardships", n: "05", label: "Stewardships" },
  { id: "legal", n: "06", label: "Governance" },
] as const;
