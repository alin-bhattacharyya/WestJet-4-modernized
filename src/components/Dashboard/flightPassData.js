// Illustrative Flight Pass sample data (Figma frame "WestJet RFP - Flight Pass").
export const passAsset = (name) => `${import.meta.env.BASE_URL}figma-assets/v3/${name}`;

export const passes = [
  {
    id: "canada-domestic",
    name: "Canada Domestic 10-Credit Pass",
    reference: "FP-DEMO-10482",
    status: "active",
    total: 10,
    redeemed: 4,
    region: "Eastern to Western Canada · 3 sample routes",
    validFrom: "1 Mar 2026",
    expires: "28 Feb 2027",
    routes: [
      "Toronto (YYZ) ⇄ Calgary (YYC)",
      "Toronto (YYZ) ⇄ Vancouver (YVR)",
      "Calgary (YYC) ⇄ Vancouver (YVR)",
    ],
    activity: [
      ["14 Oct 2026", "YVR → YYZ", "29 Oct 2026", "KT7M2Q", "Upcoming", 1],
      ["02 Aug 2026", "YYZ → YVR", "18 Aug 2026", "RB4N8D", "Travelled", 1],
      ["20 May 2026", "YYC → YYZ", "11 Jun 2026", "PW9C3L", "Travelled", 1],
      ["12 Mar 2026", "YYZ → YYC", "02 Apr 2026", "XH5J6A", "Travelled", 1],
    ],
  },
  {
    id: "pacific-coast",
    name: "Pacific Coast 4-Credit Pass",
    reference: "FP-DEMO-20917",
    status: "active",
    total: 4,
    redeemed: 1,
    region: "British Columbia coast · 2 sample routes",
    validFrom: "1 Jun 2026",
    expires: "31 May 2027",
    routes: ["Vancouver (YVR) ⇄ Victoria (YYJ)", "Vancouver (YVR) ⇄ Kelowna (YLW)"],
    activity: [["09 Jul 2026", "YVR → YYJ", "24 Jul 2026", "MC3P7V", "Travelled", 1]],
  },
  {
    id: "atlantic",
    name: "Atlantic 8-Credit Pass",
    reference: "FP-DEMO-30655",
    status: "expired",
    total: 8,
    redeemed: 5,
    region: "Atlantic Canada · 3 sample routes",
    validFrom: "1 Sep 2025",
    expires: "31 Aug 2026",
    routes: [
      "Toronto (YYZ) ⇄ Halifax (YHZ)",
      "Montréal (YUL) ⇄ Halifax (YHZ)",
      "Halifax (YHZ) ⇄ St. John’s (YYT)",
    ],
    activity: [
      ["18 Jun 2026", "YHZ → YYZ", "03 Jul 2026", "GL8T2W", "Travelled", 1],
      ["04 Apr 2026", "YYZ → YHZ", "21 Apr 2026", "DN6R4K", "Travelled", 1],
      ["15 Jan 2026", "YUL → YHZ", "02 Feb 2026", "SV2H9M", "Travelled", 1],
      ["28 Nov 2025", "YHZ → YUL", "12 Dec 2025", "QA5Z1E", "Cancelled", 1],
      ["10 Oct 2025", "YHZ → YYT", "25 Oct 2025", "BW7J3C", "Travelled", 1],
    ],
  },
];

export const remaining = (pass) => pass.total - pass.redeemed;

export const tabBalance = (pass) =>
  pass.status === "expired"
    ? `${remaining(pass)} credits unused at expiry`
    : `${remaining(pass)} of ${pass.total} credits left`;

export const helpTopics = [
  [
    "How do credits work?",
    "Each eligible one-way booking made with a pass redeems credits from that pass's own balance.",
  ],
  [
    "Which flights are eligible?",
    "Only the routes listed under Eligible routes for the selected pass can be booked with its credits.",
  ],
  [
    "What happens when plans change?",
    "Credit treatment after a change or cancellation depends on the pass terms. Contact your travel administrator.",
  ],
  [
    "Get help with a Flight Pass",
    "Contact your company travel administrator for help with Flight Pass balances, eligibility or renewals.",
  ],
];

export const discoverPasses = [
  {
    name: "Western Canada 10-Credit Pass",
    coverage: "Calgary, Edmonton, Vancouver and Banff gateways (sample coverage)",
    credits: "10 credits",
    image: "pass-discover-western.jpg",
  },
  {
    name: "Pacific Coast 6-Credit Pass",
    coverage: "Vancouver, Victoria and Kelowna (sample coverage)",
    credits: "6 credits",
    image: "pass-discover-pacific.jpg",
  },
  {
    name: "Sun Escapes 8-Credit Pass",
    coverage: "Selected sun destinations (sample coverage)",
    credits: "8 credits",
    image: "pass-discover-sun.jpg",
  },
];
