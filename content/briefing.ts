/**
 * Everything the portal shows, shaped for the components.
 *
 * Canonical source: the client's charter, "GCI Final Master.pdf" (Master Institutional Charter,
 * 100-Initiative Edition, 22 pp), confirmed final by the client on 27 November 2026.
 * Its wording lives in ./charter.ts, generated word for word by content/tools/build_charter.py.
 *
 * This file adds only:
 * - site metadata (short labels, particle form names, keys);
 * - fragments quoted from the charter for layout (each is a verbatim excerpt);
 * - headlines marked DRAFT, which are written for this page and need client approval.
 */

import * as charter from "./charter";

export type Initiative = {
  /** Number in the charter, 1..100. */
  n: number;
  name: string;
  body: string;
};

export type Division = {
  /** Charter code, e.g. "I-A". */
  code: string;
  title: string;
  initiatives: readonly Initiative[];
};

export type Council = {
  numeral: string;
  key: string;
  title: string;
  directorate: string;
  /** Short label for rails and the bottom bar. */
  label: string;
  /** Name of the particle form shown for this council. */
  form: string;
  divisions: readonly Division[];
};

/** Site-only metadata per council, in charter order. */
const COUNCIL_META = [
  { key: "materials", label: "Materials & Construction", form: "Diamond-cubic lattice" },
  { key: "compute", label: "Compute & Physical AI", form: "Photonic layer stack" },
  { key: "resilience", label: "Cyber & Resilience", form: "Geodesic shield" },
  { key: "bio", label: "Bio, Agro & Space", form: "Double helix" },
  { key: "energy", label: "Energy, Mobility & Capital", form: "Ledger terraces" },
  { key: "trade", label: "Trade & Diplomacy", form: "Corridor globe" },
] as const;

export const councils: Council[] = charter.councils.map((c, k) => ({ ...c, ...COUNCIL_META[k] }));

/** All divisions in charter order, with the council each belongs to. */
export const divisions = councils.flatMap((council, councilIndex) =>
  council.divisions.map((division, indexInCouncil) => ({
    ...division,
    councilIndex,
    indexInCouncil,
  })),
);

/** Index of a council's first division in `divisions`. */
export const firstDivision = councils.map((_, k) => divisions.findIndex((d) => d.councilIndex === k));

export const initiativeCount = divisions.reduce((n, d) => n + d.initiatives.length, 0);
export const divisionCount = divisions.length;

export const councilInitiativeCount = (c: Council) =>
  c.divisions.reduce((n, d) => n + d.initiatives.length, 0);

/** First and last initiative numbers of a council (the charter's summary table). */
export const councilRange = (c: Council) => {
  const ns = c.divisions.flatMap((d) => d.initiatives.map((i) => i.n));
  return { first: ns[0], last: ns[ns.length - 1] };
};

export const pad = (n: number) => String(n).padStart(2, "0");

const particular = (name: string) => charter.particulars.find((p) => p.name === name)!.body;

export const entity = {
  name: "Global Confederation of Industries",
  short: "GCI",
  /** Charter: Corporate & Institutional Particulars. */
  structure: "Section 8 Apex Public-Private Execution Platform",
  structureFull: particular("Institutional Structure"),
  domicile: particular("Domicile"),
  classification: "Restricted · Institutional Briefing Portal",
  /** Charter Part VI.1: the top identity bar, reserved for GCI. */
  identityBar: charter.portal.identityBar,
  /** Charter: Institutional Counterparts, abbreviated for one-line display. Full list in `particulars`. */
  counterparts: [
    { short: "PMO", full: "Prime Minister’s Office (PMO)" },
    { short: "MEA", full: "Ministry of External Affairs (MEA)" },
    { short: "DEA", full: "Ministry of Finance (DEA)" },
    { short: "MeitY", full: "Ministry of Electronics and Information Technology (MeitY)" },
    { short: "ANRF", full: "Anusandhan National Research Foundation (ANRF)" },
    { short: "DoS", full: "Department of Space (DoS)" },
    { short: "MoD", full: "Ministry of Defence (MoD)" },
    { short: "MoES", full: "Ministry of Earth Sciences (MoES)" },
    { short: "MHI", full: "Ministry of Heavy Industries (MHI)" },
    { short: "MoEFCC", full: "Ministry of Environment, Forest and Climate Change (MoEFCC)" },
    { short: "Jal Shakti", full: "Ministry of Jal Shakti" },
    { short: "NITI Aayog", full: "NITI Aayog" },
    { short: "TIDCO", full: "State Industrial Secretariats (TIDCO)" },
    { short: "Diplomatic Missions", full: "Diplomatic Missions" },
    { short: "Sovereign Wealth Underwriters", full: "Global Sovereign Wealth Underwriters" },
    { short: "Institutional Private Equity", full: "Institutional Private Equity" },
  ],
};

export const particulars = charter.particulars;

export const hero = {
  /** DRAFT headline, built from two phrases of the Founding Vision. */
  headline: ["Upstream self-reliance.", "Collective global growth."],
  /** Excerpt of the Founding Vision, first sentence. */
  lede: "An India-anchored, non-governmental public-private execution platform.",
};

const [visionDefinition, visionContrast] = charter.vision.body.split(/(?<=\.) (?=Traditional)/);

export const vision = {
  title: charter.vision.title,
  /** DRAFT headline: the three qualifiers from the Founding Vision's first sentence. */
  headline: "India-anchored. Non-governmental. Public-private.",
  definition: visionDefinition,
  /** The charter's second sentence, quoted in full under the contrast. */
  contrastSentence: visionContrast,
  contrast: {
    incumbent: {
      label: "Traditional chambers of commerce",
      lines: ["Consultative advocacy", "Tariff lobbying", "Downstream assembly"],
    },
    gci: {
      label: "GCI works alongside Union Ministries, State Secretariats, and international partners",
      lines: [
        "Foundational capital tooling",
        "Green construction engineering",
        "Physical-AI and environmental analyzer networks",
        "Multi-domain surveillance and defense resilience",
        "Phased 24/7 clean base-load energy",
        "New-age transportation",
        "Green remediation chemistry",
        "Non-debt capital structures",
      ],
    },
  },
  purposeIntro: charter.vision.purposeIntro,
  purposes: charter.vision.purposes,
  closing: charter.vision.closing,
};

export const councilsIntro = charter.councilsIntro;

export const meta = charter.meta;

/** Part III: Regenerative Planetary Restoration. */
export const restoration = charter.restoration;

/** Part IV: Institutional, Human & Ethical Stewardships. */
export const stewardships = charter.stewardships;

export const statute = charter.statute;

export const portal = charter.portal;
