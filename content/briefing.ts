/**
 * Everything the portal shows, shaped for the components.
 *
 * Two sources:
 * - ./site.ts: the web copy, rewritten and shortened from the charter (Kiran, 27 Nov 2026);
 * - ./charter.ts: the client's charter, generated word for word from "GCI Final Master.pdf".
 *   It supplies the legal texts the site shows verbatim (statute, access acknowledgment,
 *   footer notice, particulars) and is the reference the web copy is checked against.
 */

import * as charter from "./charter";
import * as site from "./site";

export type Initiative = site.SiteInitiative;

export type Division = {
  code: string;
  name: string;
  initiatives: readonly Initiative[];
};

export type Council = {
  numeral: string;
  key: string;
  /** Short name, e.g. "Materials & Construction". */
  name: string;
  /** One sentence on what the council is for. */
  line: string;
  /** The charter's full council title, kept for screen readers and the index. */
  title: string;
  /** Name of the particle form shown for this council. */
  form: string;
  divisions: readonly Division[];
};

/** Site-only metadata per council, in charter order. */
const COUNCIL_META = [
  { key: "materials", form: "Diamond-cubic lattice" },
  { key: "compute", form: "Photonic layer stack" },
  { key: "resilience", form: "Geodesic shield" },
  { key: "bio", form: "Double helix" },
  { key: "energy", form: "Ledger terraces" },
  { key: "trade", form: "Corridor globe" },
] as const;

export const councils: Council[] = site.councils.map((c, k) => ({
  numeral: c.numeral,
  key: COUNCIL_META[k].key,
  form: COUNCIL_META[k].form,
  name: c.name,
  line: c.line,
  title: charter.councils[k].title,
  divisions: c.divisions.map((d) => ({ code: d.code, name: d.name, initiatives: d.items })),
}));

/**
 * The web copy must cover the charter one for one: same councils, divisions and initiative
 * numbers. Fails the build (and the dev server) if they drift apart.
 */
(function checkAgainstCharter() {
  const a = charter.councils.flatMap((c) => c.divisions.map((d) => `${d.code}:${d.initiatives.map((i) => i.n).join(",")}`));
  const b = councils.flatMap((c) => c.divisions.map((d) => `${d.code}:${d.initiatives.map((i) => i.n).join(",")}`));
  if (a.join("|") !== b.join("|")) throw new Error("content/site.ts no longer matches the charter's initiatives");
  const text = JSON.stringify(site);
  if (text.includes("—")) throw new Error("content/site.ts contains an em dash");
})();

/** All divisions in charter order, with the council each belongs to. */
export const divisions = councils.flatMap((council, councilIndex) =>
  council.divisions.map((division, indexInCouncil) => ({ ...division, councilIndex, indexInCouncil })),
);

/** Index of a council's first division in `divisions`. */
export const firstDivision = councils.map((_, k) => divisions.findIndex((d) => d.councilIndex === k));

export const initiatives = councils.flatMap((c, councilIndex) =>
  c.divisions.flatMap((d) => d.initiatives.map((i) => ({ ...i, councilIndex, division: d.code }))),
);

export const initiativeCount = initiatives.length;
export const divisionCount = divisions.length;

export const councilInitiativeCount = (c: Council) =>
  c.divisions.reduce((n, d) => n + d.initiatives.length, 0);

/** First and last initiative numbers of a council (the charter's summary table). */
export const councilRange = (c: Council) => {
  const ns = c.divisions.flatMap((d) => d.initiatives.map((i) => i.n));
  return { first: ns[0], last: ns[ns.length - 1] };
};

export const pad = (n: number) => String(n).padStart(2, "0");

export const entity = {
  name: "Global Confederation of Industries",
  short: "GCI",
  structure: "Section 8 Apex Public-Private Execution Platform",
  classification: "Restricted · Institutional Briefing Portal",
  /** Charter Part VI.1: the top identity bar, reserved for GCI. */
  identityBar: charter.portal.identityBar,
  /** Charter: Institutional Counterparts, abbreviated for one-line display. Full names in `title`. */
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
    { short: "Missions", full: "Diplomatic Missions" },
    { short: "Sovereign funds", full: "Global Sovereign Wealth Underwriters" },
    { short: "Private equity", full: "Institutional Private Equity" },
  ],
};

export const hero = site.hero;
export const about = site.about;
export const councilsIntro = site.councilsIntro;
export const restoration = site.restoration;
export const stewardships = site.stewardships;
export const governance = site.governance;
export const gate = site.gate;
export const chapters = site.chapters;

/** Legal texts shown word for word. */
export const particulars = charter.particulars;
export const statute = charter.statute;
export const portal = charter.portal;
