"use strict";
// ══════════════════════════════════════════════════
//  CODE PARSING HELPERS
//  Course code format: EEI5467
//  index:             0123456
//  [0-2] = dept+category  [3] = level  [4] = credit  [5-6] = serial
// ══════════════════════════════════════════════════
function codeLevel(c) {
  if (!c || c.length < 4) return 0;
  const v = parseInt(c[3]);
  return isNaN(v) ? 0 : v;
}
function codeCredit(c) {
  if (!c || c.length < 5) return 0;
  const v = parseInt(c[4]);
  return isNaN(v) ? 0 : v;
}
function codeCat(c) {
  if (!c || c.length < 3) return "?";
  // Try override first, else use position-2 char
  return CAT_OVERRIDE[c] || c[2].toUpperCase();
}

const GRADE_GPV = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  E: 0.0,
};

// ══════════════════════════════════════════════════
//  CATEGORY OVERRIDES (code → true category)
// ══════════════════════════════════════════════════
const CAT_OVERRIDE = {
  // Maths dept → Z
  MHZ2250: "Z",
  MHZ3459: "Z",
  MHZ4256: "Z",
  MHZ4377: "Z",
  MHZ5375: "Z",
  MHZ3356: "Z",
  MHZ4359: "Z",
  // Management/Agri dept → M
  AGM3263: "M",
  AGM4367: "M",
  CVM5402: "M",
  CVM4402: "M",
  DMM6601: "M",
  DMM6301: "M",
  DMM6302: "M",
  EEM6202: "M",
  EEM3366: "M",
  // Language
  LTE34SI: "L",
  EEL3263: "E",
  // Laws → J (general)
  LLJ3265: "J",
  LLM5281: "J",
  // Tech/Soc → J
  MHJ5372: "J",
  MHJ5383: "J",
  MHJ5282: "J",
  // Industrial Training → W
  EEW5811: "W",
  EEW5611: "W",
  // RC project → Y
  EEY4189: "Y",
  EEY6189: "Y",
  EEY6689: "Y",
  // RC25 project → R
  EER4189: "R",
  EER4489: "R",
  EER6289: "R",
  EER6689: "R",
};

// ══════════════════════════════════════════════════
//  COURSE NAME TABLES
// ══════════════════════════════════════════════════
const RC_NAMES = {
  MHZ2250: "Elementary Mathematics for Computing",
  MHZ3459: "Basic Mathematics for Computing",
  EEI3262: "Intro to OOP",
  EEI3269: "Intro to Mobile Application Development",
  EEX3373: "Communication and Computer Technology",
  EEI3346: "Web Application Development",
  EEI4346: "Web Technology",
  EEI3266: "Information Systems and Data Management",
  EEI3372: "Programming in Python",
  EEX3467: "Software Engineering Concepts and Programming",
  AGM3263: "Communication Skills",
  LTE34SI: "English for Academic Purpose – Intermediate",
  EEI4267: "Requirement Engineering",
  EEI4362: "Object Oriented Design",
  EEX4465: "Data Structures and Algorithms",
  MHZ4256: "Mathematics for Computing",
  EEI4361: "User Experience Engineering",
  EEI4366: "Data Modelling and Database Systems",
  AGM4367: "Economics and Marketing for Engineers",
  EEY4189: "Software Design in Group",
  MHZ4377: "Applied Statistics",
  EEI5467: "Software Testing and Quality Assurance",
  EEI4369: "Mobile Application Development for Android",
  EEX4373: "Data Science",
  EEI5270: "Information Security",
  MHZ5375: "Discrete Mathematics",
  EEX5563: "Computer Architecture and Operating Systems",
  EEW5811: "Industrial Training – Software",
  CVM5402: "Accounting for Engineers",
  EEX5362: "Performance Modelling",
  MHJ5372: "Technology, Society and Environment",
  EEY6189: "Research Methodology and Project ID",
  EEX5376: "Embedded Systems and Internet of Things",
  EEI5280: "Creative Design",
  EEI5466: "Advanced Database Systems",
  DMM6601: "Management for Engineers",
  EEI6360: "Software Project Management",
  EEI6171: "Emerging Technologies",
  EEI6567: "Software Architecture and Design",
  EEM6202: "Professional Practice",
  EEX6363: "Compiler Construction",
  EEY6689: "Final Project – Software Engineering",
  EEX6340: "AI Techniques and Agent Technology",
  EEX6278: "Neural Networks and Fuzzy Logic Applications",
  EEX6377: "Principles and Applications of Data Mining",
  LLJ3265: "Introduction to Laws of Sri Lanka",
  EEM3366: "Introduction to Business Studies",
};
const RC25_NAMES = {
  MHZ2250: "Elementary Mathematics for Computing",
  EEI3372: "Programming in Python",
  EEI3366: "Database Systems",
  EEI3346: "Web Application Development",
  EEI3467: "Software Engineering Concepts and Programming",
  EEL3263: "Communication Skills",
  EEI3347: "Web Technology",
  EEI3262: "Introduction to OOP",
  EEI3269: "Mobile Application Design",
  EEI3273: "Communication and Computer Technology",
  MHZ3356: "Mathematics for Computing I",
  EEM3366: "Introduction to Business Studies",
  LTE34SI: "English for Academic Purpose – Intermediate",
  EEI4267: "Requirement Engineering",
  MHZ4359: "Mathematics for Computing II",
  AGM4367: "Economics and Marketing for Engineers",
  EEI4361: "User Experience Engineering",
  EEI4362: "Object Oriented Design",
  EER4189: "Software Design in Group",
  EEI4370: "Computer Security Concepts",
  EEI4360: "Introduction to Artificial Intelligence",
  EEI4365: "Data Structures and Algorithms",
  CVM4402: "Accounting for Engineers",
  MHZ4377: "Applied Statistics",
  EER4489: "Higher Diploma Project – Software Engineering",
  EEI5263: "Computer Organization and Architecture",
  EEI5364: "Data Communication and Networking",
  MHJ5383: "Technology Society and Environment",
  MHZ5375: "Discrete Mathematics",
  LLM5281: "Basic Laws Relating to Engineering and Technology",
  EER6289: "Research Methodology and Project ID",
  EEW5611: "Industrial Training – Software",
  EEI5467: "Software Testing and Quality Assurance",
  EEI5265: "Operating Systems",
  EEI5486: "Advanced Database Systems",
  EEI5369: "Mobile App Development with Android",
  EEI6378: "Neural Networks and Fuzzy Logic Applications",
  EEI5376: "Embedded Systems and IoT",
  MHJ5282: "History of Technology",
  EEI5373: "Data Science",
  EEI6360: "Software Project Management",
  EEI6373: "Performance Modelling",
  EEI6567: "Software Architecture and Design",
  EER6689: "Final Project – Software Engineering",
  EEI6171: "Emerging Technologies",
  EEM6202: "Professional Practice",
  EEI6279: "Natural Language Processing",
  EEI6280: "Creative Design",
  EEI6320: "Intelligent Systems and Agent Technology",
  EEI6366: "Big Data Technologies & Distributed Systems",
  EEI6377: "Data Mining",
  EEI6363: "Compiler Construction",
  EEI6369: "Cloud Computing",
};

// ══════════════════════════════════════════════════
//  RC'25 VIRTUAL CREDIT OVERRIDES
//  Only for courses where RC'25 credit < RC credit
//  Key = RC'25 code, value = RC credit to use for GPA in Virtual mode
// ══════════════════════════════════════════════════
const VIRTUAL_CR = {
  EEI3273: 3, // RC EEX3373=3cr, RC25=2cr
  EEI3269: 3, // RC EEI3269=3cr, RC25=2cr
  EEI4365: 4, // RC EEX4465=4cr, RC25=3cr
  EEW5611: 8, // RC EEW5811=8cr, RC25=6cr
  EEI5263: 3, // RC EEX5563=5cr split → COA gets 3
  EEI5364: 4, // RC EEX5464=4cr, RC25=3cr
  MHZ3356: 4, // RC MHZ3459=4cr, RC25=3cr
};
// Note: courses where RC25 credit > RC (no virtual needed):
// EEI3366 (3 vs RC 2), MHZ4359 (3 vs RC 2), EEI4360 new, EEI4370 (3 vs 2), EEI5486 (5 vs 3), EER6289 (2 vs 1)

// ══════════════════════════════════════════════════
//  COMPULSORY SETS (for GPA 70-credit ordering)
// ══════════════════════════════════════════════════
const RC_COMP_56 = new Set([
  "EEI5270",
  "MHZ5375",
  "EEX5563",
  "EEW5811",
  "CVM5402",
  "EEX5362",
  "MHJ5372",
  "EEI5467",
  "EEY6189",
  "DMM6601",
  "EEI6360",
  "EEI6171",
  "EEI6567",
  "EEM6202",
  "EEY6689",
]);
const RC_COMP_4 = new Set([
  "EEI4267",
  "EEI4362",
  "EEX4465",
  "MHZ4256",
  "EEI4361",
  "EEI4366",
  "AGM4367",
  "EEY4189",
  "MHZ4377",
  "EEI5467",
]);
const RC25_COMP_56 = new Set([
  "EEI5263",
  "EEI5364",
  "MHJ5383",
  "MHZ5375",
  "LLM5281",
  "EER6289",
  "EEW5611",
  "EEI5467",
  "EEI5265",
  "EEI5486",
  "EEI6360",
  "EEI6373",
  "EEI6567",
  "EER6689",
  "EEI6171",
  "EEM6202",
]);
const RC25_COMP_4 = new Set([
  "EEI4267",
  "MHZ4359",
  "AGM4367",
  "EEI4361",
  "EEI4362",
  "EER4189",
  "EEI4370",
  "EEI4360",
  "EEI4365",
  "CVM4402",
  "MHZ4377",
]);

// ══════════════════════════════════════════════════
//  REQUIREMENTS
// ══════════════════════════════════════════════════
const REQS = {
  RC: {
    totalMin: 130,
    l56min: 60,
    l6min: 30,
    categories: {
      "X+I": {
        label: "Industrial/Engineering (X)",
        letters: ["X", "I"],
        min: 65,
        max: 76,
        note: "min 30 at L5+L6, 15 at L6",
      },
      M: {
        label: "Management (M)",
        letters: ["M"],
        min: 17,
        max: 28,
        note: "min 12 at L5+",
      },
      J: { label: "General (J)", letters: ["J"], min: 5, max: 16 },
      Z: {
        label: "Mathematics (Z)",
        letters: ["Z"],
        min: 12,
        max: 21,
        note: "min 3 at L5+",
      },
      Y: {
        label: "Project (Y)",
        letters: ["Y"],
        min: 8,
        max: 12,
        note: "min 6 at L6",
      },
      L: { label: "Language (L)", letters: ["L"], min: 4, max: 4 },
      W: { label: "Industrial Training (W)", letters: ["W"], min: 8, max: 8 },
    },
  },
  RC25: {
    totalMin: 125,
    l56min: 63,
    l6min: 30,
    categories: {
      I: { label: "Industrial (X)", letters: ["X", "I"], min: 67, max: 78 },
      M: { label: "Management (M)", letters: ["M"], min: 11, max: 20 },
      J: { label: "General (J)", letters: ["J"], min: 3, max: 6 },
      Z: { label: "Mathematics (Z)", letters: ["Z"], min: 12, max: 12 },
      R: {
        label: "Project (R)",
        letters: ["R"],
        min: 9,
        max: 13,
        note: "min 6 at L6",
      },
      LE: { label: "Language (L+E)", letters: ["L", "E"], min: 6, max: 6 },
      W: { label: "Industrial Training (W)", letters: ["W"], min: 6, max: 6 },
    },
  },
};

// ══════════════════════════════════════════════════
//  COMPARE DATA
// ══════════════════════════════════════════════════
const CMP = [
  {
    rc: "EEX3467",
    rn: "Software Eng. Concepts & Programming",
    rc_: 4,
    r25: "EEI3467",
    rn25: "Software Eng. Concepts & Programming",
    r25_: 4,
    ch: "code",
  },
  {
    rc: "EEI3262",
    rn: "Intro to OOP",
    rc_: 2,
    r25: "EEI3262",
    rn25: "Intro to OOP",
    r25_: 2,
    ch: "same",
  },
  {
    rc: "EEI3269",
    rn: "Intro to Mobile Application Development",
    rc_: 3,
    r25: "EEI3269",
    rn25: "Mobile Application Design",
    r25_: 2,
    ch: "rename+cr↓",
  },
  {
    rc: "EEX3373",
    rn: "Communication and Computer Technology",
    rc_: 3,
    r25: "EEI3273",
    rn25: "Communication and Computer Technology",
    r25_: 2,
    ch: "code+cr↓",
  },
  {
    rc: "EEI3346",
    rn: "Web Application Development",
    rc_: 3,
    r25: "EEI3346",
    rn25: "Web Application Development",
    r25_: 3,
    ch: "same",
  },
  {
    rc: "EEI4346",
    rn: "Web Technology",
    rc_: 3,
    r25: "EEI3347",
    rn25: "Web Technology",
    r25_: 3,
    ch: "code",
  },
  {
    rc: "EEI3266",
    rn: "Information Systems & Data Management",
    rc_: 2,
    r25: "EEI3366",
    rn25: "Database Systems",
    r25_: 3,
    ch: "rename+cr↑",
  },
  {
    rc: "EEI3372",
    rn: "Programming in Python",
    rc_: 3,
    r25: "EEI3372",
    rn25: "Programming in Python",
    r25_: 3,
    ch: "same",
  },
  {
    rc: "AGM3263",
    rn: "Communication Skills",
    rc_: 2,
    r25: "EEL3263",
    rn25: "Communication Skills",
    r25_: 2,
    ch: "code",
  },
  {
    rc: "LTE34SI",
    rn: "English for Academic Purpose",
    rc_: 4,
    r25: "LTE34SI",
    rn25: "English for Academic Purpose",
    r25_: 4,
    ch: "same",
  },
  {
    rc: "MHZ3459",
    rn: "Basic Mathematics for Computing",
    rc_: 4,
    r25: "MHZ3356",
    rn25: "Mathematics for Computing I",
    r25_: 3,
    ch: "rename+cr↓",
  },
  {
    rc: "MHZ4256",
    rn: "Mathematics for Computing",
    rc_: 2,
    r25: "MHZ4359",
    rn25: "Mathematics for Computing II",
    r25_: 3,
    ch: "rename+cr↑",
  },
  {
    rc: "EEX4465",
    rn: "Data Structures and Algorithms",
    rc_: 4,
    r25: "EEI4365",
    rn25: "Data Structures and Algorithms",
    r25_: 3,
    ch: "code+cr↓",
  },
  {
    rc: "EEI4267",
    rn: "Requirement Engineering",
    rc_: 2,
    r25: "EEI4267",
    rn25: "Requirement Engineering",
    r25_: 2,
    ch: "same",
  },
  {
    rc: "EEI4362",
    rn: "Object Oriented Design",
    rc_: 3,
    r25: "EEI4362",
    rn25: "Object Oriented Design",
    r25_: 3,
    ch: "same",
  },
  {
    rc: "EEI4361",
    rn: "User Experience Engineering",
    rc_: 3,
    r25: "EEI4361",
    rn25: "User Experience Engineering",
    r25_: 3,
    ch: "same",
  },
  {
    rc: "EEI4366",
    rn: "Data Modelling & Database Systems",
    rc_: 3,
    r25: "EEI5486",
    rn25: "Advanced Database Systems",
    r25_: 5,
    ch: "rename+cr↑",
  },
  {
    rc: "AGM4367",
    rn: "Economics and Marketing for Engineers",
    rc_: 3,
    r25: "AGM4367",
    rn25: "Economics and Marketing for Engineers",
    r25_: 3,
    ch: "same",
  },
  {
    rc: "EEY4189",
    rn: "Software Design in Group",
    rc_: 1,
    r25: "EER4189",
    rn25: "Software Design in Group",
    r25_: 1,
    ch: "code",
  },
  {
    rc: "MHZ4377",
    rn: "Applied Statistics",
    rc_: 3,
    r25: "MHZ4377",
    rn25: "Applied Statistics",
    r25_: 3,
    ch: "same",
  },
  {
    rc: "EEI5270",
    rn: "Information Security",
    rc_: 2,
    r25: "EEI4370",
    rn25: "Computer Security Concepts",
    r25_: 3,
    ch: "rename+cr↑",
  },
  {
    rc: "EEX5563",
    rn: "Computer Architecture and Operating Systems",
    rc_: 5,
    r25: "EEI5263+EEI5265",
    rn25: "COA (2cr) + Operating Systems (2cr)",
    r25_: 4,
    ch: "split+cr↓",
  },
  {
    rc: "EEX5464",
    rn: "Data Communication and Networking",
    rc_: 4,
    r25: "EEI5364",
    rn25: "Data Communication and Networking",
    r25_: 3,
    ch: "code+cr↓",
  },
  {
    rc: "EEI5467",
    rn: "Software Testing and Quality Assurance",
    rc_: 4,
    r25: "EEI5467",
    rn25: "Software Testing and Quality Assurance",
    r25_: 4,
    ch: "same",
  },
  {
    rc: "EEW5811",
    rn: "Industrial Training – Software",
    rc_: 8,
    r25: "EEW5611",
    rn25: "Industrial Training – Software",
    r25_: 6,
    ch: "code+cr↓",
  },
  {
    rc: "CVM5402",
    rn: "Accounting for Engineers",
    rc_: 4,
    r25: "CVM4402",
    rn25: "Accounting for Engineers",
    r25_: 4,
    ch: "code",
  },
  {
    rc: "EEX5362",
    rn: "Performance Modelling",
    rc_: 3,
    r25: "EEI6373",
    rn25: "Performance Modelling",
    r25_: 3,
    ch: "code",
  },
  {
    rc: "MHJ5372",
    rn: "Technology, Society and Environment",
    rc_: 3,
    r25: "MHJ5383",
    rn25: "Technology Society and Environment",
    r25_: 3,
    ch: "code",
  },
  {
    rc: "EEY6189",
    rn: "Research Methodology & Project ID",
    rc_: 1,
    r25: "EER6289",
    rn25: "Research Methodology & Project ID",
    r25_: 2,
    ch: "code+cr↑",
  },
  {
    rc: "EEY6689",
    rn: "Final Project – Software Engineering",
    rc_: 6,
    r25: "EER6689",
    rn25: "Final Project – Software Engineering",
    r25_: 6,
    ch: "code",
  },
  {
    rc: "DMM6601",
    rn: "Management for Engineers",
    rc_: 6,
    r25: "DMM6301+DMM6302",
    rn25: "(split into two courses)",
    r25_: 6,
    ch: "split",
  },
  {
    rc: "EEI6360",
    rn: "Software Project Management",
    rc_: 3,
    r25: "EEI6360",
    rn25: "Software Project Management",
    r25_: 3,
    ch: "same",
  },
  {
    rc: "EEI6171",
    rn: "Emerging Technologies",
    rc_: 1,
    r25: "EEI6171",
    rn25: "Emerging Technologies",
    r25_: 1,
    ch: "same",
  },
  {
    rc: "EEI6567",
    rn: "Software Architecture and Design",
    rc_: 5,
    r25: "EEI6567",
    rn25: "Software Architecture and Design",
    r25_: 5,
    ch: "same",
  },
  {
    rc: "EEM6202",
    rn: "Professional Practice",
    rc_: 2,
    r25: "EEM6202",
    rn25: "Professional Practice",
    r25_: 2,
    ch: "same",
  },
  {
    rc: "EEX6363",
    rn: "Compiler Construction",
    rc_: 3,
    r25: "EEI6363",
    rn25: "Compiler Construction",
    r25_: 3,
    ch: "code",
  },
  {
    rc: "EEX6340",
    rn: "AI Techniques and Agent Technology",
    rc_: 3,
    r25: "EEI6320",
    rn25: "Intelligent Systems and Agent Technology",
    r25_: 3,
    ch: "rename",
  },
  {
    rc: "EEX6278",
    rn: "Neural Networks and Fuzzy Logic",
    rc_: 2,
    r25: "EEI6378",
    rn25: "Neural Networks and Fuzzy Logic",
    r25_: 3,
    ch: "code+cr↑",
  },
  {
    rc: "EEX6377",
    rn: "Principles & Application of Data Mining",
    rc_: 3,
    r25: "EEI6377",
    rn25: "Data Mining",
    r25_: 3,
    ch: "rename",
  },
  {
    rc: "N/A",
    rn: "—",
    rc_: 0,
    r25: "EEI4360",
    rn25: "Introduction to Artificial Intelligence",
    r25_: 3,
    ch: "new",
  },
  {
    rc: "N/A",
    rn: "—",
    rc_: 0,
    r25: "EEI6366",
    rn25: "Big Data Technologies & Distributed Systems",
    r25_: 3,
    ch: "new",
  },
  {
    rc: "N/A",
    rn: "—",
    rc_: 0,
    r25: "EEI6369",
    rn25: "Cloud Computing",
    r25_: 3,
    ch: "new",
  },
];

// ══════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════
let mode = "RC25";
let courses = [];

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
window.onload = () => {
  renderCompare();
  renderAll();
};

// ══════════════════════════════════════════════════
//  TAB & MODE
// ══════════════════════════════════════════════════
function switchTab(name, el) {
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  el.classList.add("active");
  if (name === "requirements") renderRequirements();
  if (name === "gpa") renderGPADetails();
}
function setMode(m) {
  mode = m;
  document
    .querySelectorAll(".mode-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("btn-" + m).classList.add("active");
  renderAll();
}

// ══════════════════════════════════════════════════
//  ENRICH COURSE
// ══════════════════════════════════════════════════
function enrich(raw) {
  const code = (raw.code || "").trim().toUpperCase();
  const level = codeLevel(code);
  const codeCr = codeCredit(code); // credit from code digit
  // For RC25V: if VIRTUAL_CR has this code, that means RC had more credits → use that for GPA
  const virtualCr = VIRTUAL_CR[code];
  // Credit used for category/total calculations (always from code)
  const credits = codeCr;
  // Credit used for GPA in virtual mode
  const gpaCr = mode === "RC25V" && virtualCr ? virtualCr : codeCr;
  const cat = CAT_OVERRIDE[code] || code[2] || "?";
  const nameMap = mode === "RC" ? RC_NAMES : RC25_NAMES;
  const name = raw.name || nameMap[code] || code;
  return {
    ...raw,
    code,
    level,
    credits,
    gpaCr,
    cat,
    name,
    isVirtual: !!(mode === "RC25V" && virtualCr),
  };
}
function enrichAll() {
  return courses.map(enrich);
}

// ══════════════════════════════════════════════════
//  STATUS HELPERS
// ══════════════════════════════════════════════════
function sNorm(s) {
  if (!s) return "";
  const l = s.toLowerCase().trim();
  if (l.includes("ca") || l.includes("continuous")) return "ca";
  if (l === "p" || l === "pass" || l.includes("pass")) return "pass";
  if (l.includes("absent")) return "absent";
  if (l.includes("resit")) return "resit";
  if (l.includes("repeat")) return "repeat";
  if (l.includes("fail") || l === "f") return "fail";
  if (
    l.includes("ongoing") ||
    l.includes("current") ||
    l.includes("registered")
  )
    return "ongoing";
  if (l.includes("pending") || l.includes("result")) return "pending";
  return "other";
}
function isPass(c) {
  const s = sNorm(c.status);
  return s === "pass" || s === "ca";
}

// ══════════════════════════════════════════════════
//  FILE UPLOAD
// ══════════════════════════════════════════════════
const dz = document.getElementById("dropZone");
dz.addEventListener("dragover", (e) => {
  e.preventDefault();
  dz.classList.add("drag");
});
dz.addEventListener("dragleave", () => dz.classList.remove("drag"));
dz.addEventListener("drop", (e) => {
  e.preventDefault();
  dz.classList.remove("drag");
  const f = e.dataTransfer.files[0];
  if (f) processFile(f);
});
function handleFile(e) {
  const f = e.target.files[0];
  if (f) processFile(f);
}
function processFile(file) {
  const rd = new FileReader();
  rd.onload = (e) => {
    try {
      const wb = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
      parseRows(
        XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
          header: 1,
          defval: "",
        }),
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  rd.readAsArrayBuffer(file);
}
function nh(h) {
  return String(h)
    .toLowerCase()
    .replace(/[\s_\-\/]+/g, "");
}
function parseRows(rows) {
  if (rows.length < 2) return;
  const H = rows[0].map(nh);
  const ci = (k) => H.indexOf(k);
  const iC = ci("coursecode"),
    iN = ci("coursename"),
    iL = ci("lastofferedyear"),
    iS = ci("progressstatus"),
    iG = ci("grade"),
    iA = ci("attempts"),
    iEY = ci("eligibilitycompletedyears"),
    iEL = ci("eligibilityleft");
  courses = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const code = String(iC >= 0 && r[iC] ? r[iC] : "")
      .trim()
      .toUpperCase();
    if (!code) continue;
    courses.push({
      code,
      name: iN >= 0 ? String(r[iN] || "") : "",
      lastOffered: iL >= 0 ? String(r[iL] || "") : "",
      status: iS >= 0 ? String(r[iS] || "") : "",
      grade: iG >= 0 ? String(r[iG] || "").trim() : "",
      attempts: iA >= 0 ? r[iA] : "",
      eligYears: iEY >= 0 ? r[iEY] : "",
      eligLeft: iEL >= 0 ? r[iEL] : "",
    });
  }
  renderAll();
}
function addManual() {
  const code = document.getElementById("m-code").value.trim().toUpperCase();
  if (!code) {
    alert("Enter a course code");
    return;
  }
  const nm = mode === "RC" ? RC_NAMES : RC25_NAMES;
  courses.push({
    code,
    name: document.getElementById("m-name").value.trim() || nm[code] || "",
    lastOffered: "",
    status: document.getElementById("m-status").value,
    grade: document.getElementById("m-grade").value,
    attempts: document.getElementById("m-att").value || 1,
    eligYears: "",
    eligLeft: "",
  });
  ["m-code", "m-name", "m-att"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("m-status").value = "";
  document.getElementById("m-grade").value = "";
  renderAll();
}
function removeCourse(i) {
  courses.splice(i, 1);
  renderAll();
}
function clearAll() {
  if (courses.length && !confirm("Clear all course data?")) return;
  courses = [];
  document.getElementById("fileInput").value = "";
  renderAll();
}

// ══════════════════════════════════════════════════
//  RENDER ALL
// ══════════════════════════════════════════════════
function renderAll() {
  const lbl = { RC: "RC", RC25: "RC'25", RC25V: "RC'25 Virtual" }[mode];
  document.getElementById("mode-label").textContent = lbl;
  document.getElementById("sb-gpa-mode").textContent = lbl;
  document.getElementById("sb-total-req").textContent =
    "Required: " + (mode === "RC" ? 130 : 125) + " credits";
  document.getElementById("sb-l56-req").textContent =
    "Min: " + (mode === "RC" ? 60 : 63) + " credits";
  renderTable();
  renderSidebar();
  const ap = document.querySelector(".tab-panel.active");
  if (ap && ap.id === "tab-requirements") renderRequirements();
  if (ap && ap.id === "tab-gpa") renderGPADetails();
}

// ══════════════════════════════════════════════════
//  DISPLAY HELPERS
// ══════════════════════════════════════════════════
function gCls(g) {
  if (!g || g === "—") return "gN";
  const u = g.toUpperCase();
  if (u.startsWith("A")) return "gA";
  if (u.startsWith("B")) return "gB";
  if (u.startsWith("C")) return "gC";
  if (u.startsWith("D")) return "gD";
  if (u === "E") return "gE";
  return "gN";
}
function sCls(s) {
  const n = sNorm(s);
  const m = {
    pass: "st-pass",
    ca: "st-ca",
    fail: "st-fail",
    absent: "st-absent",
    resit: "st-resit",
    repeat: "st-repeat",
    ongoing: "st-ongoing",
    pending: "st-pending",
  };
  return m[n] || "st-none";
}
function sLbl(s) {
  const n = sNorm(s);
  const m = {
    pass: "Pass",
    ca: "CA Pass",
    fail: "Fail",
    absent: "Absent",
    resit: "Resit",
    repeat: "Repeat",
    ongoing: "Ongoing",
    pending: "Pending",
  };
  return m[n] || s || "—";
}

// ══════════════════════════════════════════════════
//  RENDER TABLE
// ══════════════════════════════════════════════════
function renderTable() {
  const ec = enrichAll();
  document.getElementById("course-count").textContent =
    ec.length + " course" + (ec.length !== 1 ? "s" : "");
  // Status counts
  let nR = 0,
    nP = 0,
    nRs = 0,
    nPd = 0,
    nRp = 0;
  ec.forEach((c) => {
    nR++;
    const n = sNorm(c.status);
    if (n === "pass" || n === "ca") nP++;
    if (n === "resit") nRs++;
    if (n === "pending") nPd++;
    if (n === "fail" || n === "repeat") nRp++;
  });
  document.getElementById("cnt-reg").textContent = nR;
  document.getElementById("cnt-pass").textContent = nP;
  document.getElementById("cnt-resit").textContent = nRs;
  document.getElementById("cnt-pend").textContent = nPd;
  document.getElementById("cnt-rep").textContent = nRp;

  const wrap = document.getElementById("courseTableWrap");
  if (!ec.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="ei">📋</div><h3>No courses loaded</h3><p>Upload a spreadsheet or add courses manually</p></div>`;
    return;
  }
  let html = `<table><thead><tr>
    <th>Code</th><th>Course Name</th><th>Lv</th><th>Cat</th><th>Cr</th>
    <th>GPA Cr${mode === "RC25V" ? "*" : ""}</th><th>Status</th><th>Grade</th>
    <th>Attempts</th><th>Last Offered</th><th>Elig.Yrs</th><th>Elig.Left</th><th></th>
  </tr></thead><tbody>`;
  ec.forEach((c, i) => {
    const vMark = c.isVirtual
      ? `<span style="color:var(--accent2);font-size:8px;margin-left:2px" title="Using RC credit (${c.gpaCr}) for GPA">▲</span>`
      : "";
    html += `<tr>
      <td class="code-cell">${c.code}</td>
      <td style="max-width:160px;font-size:11px">${c.name || c.code}</td>
      <td style="text-align:center;color:var(--text2);font-family:'DM Mono',monospace">${c.level || "?"}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;font-size:10px;color:var(--accent2)">${c.cat || "?"}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace">${c.credits}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:${c.isVirtual ? "var(--accent2)" : "var(--text)"}">${c.gpaCr}${vMark}</td>
      <td><span class="spill ${sCls(c.status)}">${sLbl(c.status)}</span></td>
      <td><span class="grade-badge ${gCls(c.grade)}">${c.grade || "—"}</span></td>
      <td style="text-align:center;color:var(--text2);font-size:11px">${c.attempts || "—"}</td>
      <td style="color:var(--text2);font-size:11px">${c.lastOffered || "—"}</td>
      <td style="color:var(--text2);font-size:11px">${c.eligYears || "—"}</td>
      <td style="color:var(--text2);font-size:11px">${c.eligLeft || "—"}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="removeCourse(${i})" style="padding:2px 7px;font-size:9px">✕</button></td>
    </tr>`;
  });
  if (mode === "RC25V")
    html += `<tr><td colspan="13" style="padding:6px 11px;font-size:9px;color:var(--accent2)">* GPA Cr column shows RC credit value for virtual courses (▲). Category/total credits use actual RC'25 code credits.</td></tr>`;
  html += "</tbody></table>";
  wrap.innerHTML = html;
}

// ══════════════════════════════════════════════════
//  STATS CALCULATION
// ══════════════════════════════════════════════════
function calcStats() {
  const ec = enrichAll();
  const req = mode === "RC" ? REQS.RC : REQS.RC25;
  let tot = 0,
    l3 = 0,
    l4 = 0,
    l5 = 0,
    l6 = 0;
  const catCr = {},
    catL5 = {},
    catL6 = {};
  ec.forEach((c) => {
    if (!isPass(c)) return;
    const cr = c.credits || 0,
      lv = c.level || 0,
      cat = c.cat || "?";
    tot += cr;
    if (lv === 3) l3 += cr;
    else if (lv === 4) l4 += cr;
    else if (lv === 5) l5 += cr;
    else if (lv === 6) l6 += cr;
    catCr[cat] = (catCr[cat] || 0) + cr;
    if (lv >= 5) catL5[cat] = (catL5[cat] || 0) + cr;
    if (lv === 6) catL6[cat] = (catL6[cat] || 0) + cr;
  });
  return { ec, req, tot, l3, l4, l5, l6, l56: l5 + l6, catCr, catL5, catL6 };
}

// ══════════════════════════════════════════════════
//  GPA CALCULATION
//  70 credits from L4-L6:
//  (1) Compulsory L5+L6, (2) Elective L5+L6, (3) Compulsory L4, (4) Elective L4
//  Uses gpaCr (not credits) for weighted sum
// ══════════════════════════════════════════════════
function calcGPA(ec) {
  const isRC = mode === "RC";
  const comp56 = isRC ? RC_COMP_56 : RC25_COMP_56;
  const comp4 = isRC ? RC_COMP_4 : RC25_COMP_4;
  // Eligible: passed, L4+, has grade with GPV
  const elig = ec.filter(
    (c) => isPass(c) && c.level >= 4 && GRADE_GPV[c.grade] !== undefined,
  );
  const b1 = elig.filter((c) => c.level >= 5 && comp56.has(c.code));
  const b2 = elig.filter((c) => c.level >= 5 && !comp56.has(c.code));
  const b3 = elig.filter((c) => c.level === 4 && comp4.has(c.code));
  const b4 = elig.filter((c) => c.level === 4 && !comp4.has(c.code));
  const ordered = [...b1, ...b2, ...b3, ...b4];
  let used = 0,
    wsum = 0;
  const sel = [];
  for (const c of ordered) {
    if (used >= 70) break;
    const rem = 70 - used;
    const gpv = GRADE_GPV[c.grade];
    const cr = c.gpaCr || c.credits || 0; // use gpaCr (virtual or actual)
    if (cr <= rem) {
      used += cr;
      wsum += gpv * cr;
      sel.push({
        ...c,
        usedCr: cr,
        partial: false,
        gpv,
        bucket: getBucket(c, comp56, comp4),
      });
    } else {
      used += rem;
      wsum += gpv * rem;
      sel.push({
        ...c,
        usedCr: rem,
        partial: true,
        gpv,
        bucket: getBucket(c, comp56, comp4),
      });
      break;
    }
  }
  return { gpa: used > 0 ? wsum / used : null, used, sel, elig, ordered };
}
function getBucket(c, comp56, comp4) {
  if (c.level >= 5 && comp56.has(c.code)) return "Comp L5+L6";
  if (c.level >= 5) return "Elec L5+L6";
  if (c.level === 4 && comp4.has(c.code)) return "Comp L4";
  return "Elec L4";
}

// ══════════════════════════════════════════════════
//  RENDER SIDEBAR
// ══════════════════════════════════════════════════
function renderSidebar() {
  const s = calcStats();
  const { gpa, used } = calcGPA(s.ec);
  const reqT = mode === "RC" ? 130 : 125,
    l56r = mode === "RC" ? 60 : 63;
  document.getElementById("sb-gpa").textContent =
    gpa !== null ? gpa.toFixed(2) : "—";
  document.getElementById("sb-gpa-note").textContent =
    `${used}/70 credits selected`;
  document.getElementById("sb-total").textContent = s.tot;
  const pt = document.getElementById("pb-total");
  pt.style.width = Math.min(100, (s.tot / reqT) * 100) + "%";
  pt.className =
    "pfill" + (s.tot >= reqT ? " good" : s.tot > reqT * 0.6 ? " warn" : " bad");
  document.getElementById("sb-l56").textContent = s.l56;
  const p56 = document.getElementById("pb-l56");
  p56.style.width = Math.min(100, (s.l56 / l56r) * 100) + "%";
  p56.className = "pfill" + (s.l56 >= l56r ? " good" : " warn");
  document.getElementById("sb-l6").textContent = s.l6;
  const p6 = document.getElementById("pb-l6");
  p6.style.width = Math.min(100, (s.l6 / 30) * 100) + "%";
  p6.className = "pfill" + (s.l6 >= 30 ? " good" : " warn");
  [3, 4, 5, 6].forEach(
    (lv) => (document.getElementById("lv" + lv).textContent = s["l" + lv]),
  );
  // Categories
  const cc = {
    X: "#6c8cff",
    I: "#6c8cff",
    M: "#ff8c6c",
    J: "#6cffc8",
    Z: "#ffcc6c",
    Y: "#c86cff",
    R: "#c86cff",
    L: "#6ce0ff",
    E: "#6ce0ff",
    W: "#ff6caa",
  };
  const cats = s.req.categories;
  let cHtml = "";
  Object.keys(cats).forEach((k) => {
    const cat = cats[k];
    const letters = cat.letters || [k];
    const earned = letters.reduce((a, l) => a + (s.catCr[l] || 0), 0);
    const ok = earned >= cat.min;
    cHtml += `<div class="cat-row">
      <div class="cat-dot" style="background:${cc[letters[0]] || "#888"}"></div>
      <span class="cat-name">${cat.label}</span>
      <span class="cat-val ${ok ? "cv-ok" : earned > 0 ? "cv-maybe" : "cv-no"}">${earned}/${cat.min}${cat.max !== cat.min ? "–" + cat.max : ""}</span>
    </div>`;
  });
  document.getElementById("cat-breakdown").innerHTML = cHtml;
  // Alerts
  const al = [];
  if (s.tot >= reqT)
    al.push({ t: "ok", m: `✓ Total credits: ${s.tot}/${reqT}` });
  else al.push({ t: "err", m: `Total: ${s.tot}/${reqT} needed` });
  if (s.l56 >= l56r) al.push({ t: "ok", m: `✓ L5+L6: ${s.l56}/${l56r}` });
  else al.push({ t: "warn", m: `L5+L6: ${s.l56}/${l56r} needed` });
  if (s.l6 >= 30) al.push({ t: "ok", m: `✓ Level 6: ${s.l6}/30` });
  else al.push({ t: "warn", m: `Level 6: ${s.l6}/30 needed` });
  Object.keys(cats).forEach((k) => {
    const cat = cats[k];
    const letters = cat.letters || [k];
    const earned = letters.reduce((a, l) => a + (s.catCr[l] || 0), 0);
    if (earned < cat.min)
      al.push({ t: "err", m: `${cat.label}: ${earned}/${cat.min}` });
    else if (cat.max && earned > cat.max)
      al.push({ t: "warn", m: `${cat.label}: ${earned} > max ${cat.max}` });
  });
  document.getElementById("alert-panel").innerHTML = al
    .map(
      (a) =>
        `<div class="alert a-${a.t === "ok" ? "ok" : a.t === "warn" ? "warn" : "err"}">${a.m}</div>`,
    )
    .join("");
}

// ══════════════════════════════════════════════════
//  RENDER REQUIREMENTS
// ══════════════════════════════════════════════════
function renderRequirements() {
  const s = calcStats();
  const { gpa, used } = calcGPA(s.ec);
  const reqT = mode === "RC" ? 130 : 125,
    l56r = mode === "RC" ? 60 : 63;
  const ml = { RC: "RC", RC25: "RC'25", RC25V: "RC'25 Virtual" }[mode];
  let h = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
    <h2 style="font-family:'Fraunces',serif;font-size:16px;font-weight:700">Degree Requirements</h2>
    <span class="badge" style="color:var(--accent2)">${ml}</span>
  </div>`;
  // Top row
  h += `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:16px">
    ${rsm("Total Credits", s.tot, reqT)}${rsm("L5+L6 Credits", s.l56, l56r)}
    ${rsm("Level 6 Credits", s.l6, 30)}
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:11px;text-align:center">
      <div style="font-size:9px;color:var(--text3);font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">GPA</div>
      <div style="font-family:'Fraunces',serif;font-size:22px;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${gpa !== null ? gpa.toFixed(2) : "—"}</div>
      <div style="font-size:9px;color:var(--text2)">${used}/70 cr used</div>
    </div>
  </div>`;
  // Category table
  h += `<div class="card" style="margin-bottom:14px">
    <div style="font-size:12px;font-weight:600;margin-bottom:11px">Category Requirements — ${ml}</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Category</th><th>Earned</th><th>Min</th><th>Max</th><th>L5+ Earned</th><th>L6 Earned</th><th>Notes</th><th>Status</th><th>Progress</th></tr></thead>
      <tbody>`;
  const cc = {
    X: "#6c8cff",
    I: "#6c8cff",
    M: "#ff8c6c",
    J: "#6cffc8",
    Z: "#ffcc6c",
    Y: "#c86cff",
    R: "#c86cff",
    L: "#6ce0ff",
    E: "#6ce0ff",
    W: "#ff6caa",
  };
  Object.keys(s.req.categories).forEach((k) => {
    const cat = s.req.categories[k];
    const letters = cat.letters || [k];
    const earned = letters.reduce((a, l) => a + (s.catCr[l] || 0), 0);
    const eL5 = letters.reduce((a, l) => a + (s.catL5[l] || 0), 0);
    const eL6 = letters.reduce((a, l) => a + (s.catL6[l] || 0), 0);
    const ok = earned >= cat.min && (!cat.max || earned <= cat.max);
    const pct = Math.min(100, cat.min > 0 ? (earned / cat.min) * 100 : 100);
    const col = ok ? "var(--pass)" : earned > 0 ? "var(--warn)" : "var(--fail)";
    h += `<tr>
      <td><span style="display:inline-flex;align-items:center;gap:5px"><span style="width:6px;height:6px;border-radius:50%;background:${cc[letters[0]] || "#888"};display:inline-block"></span>${cat.label}</span></td>
      <td style="text-align:center;font-family:'DM Mono',monospace;font-weight:600;color:${ok ? "var(--pass)" : "var(--text)"}">${earned}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--text2)">${cat.min}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--text2)">${cat.max || "—"}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--text3)">${eL5}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--text3)">${eL6}</td>
      <td style="font-size:9px;color:var(--text3)">${cat.note || "—"}</td>
      <td>${ok ? '<span class="spill st-pass">MET</span>' : '<span class="spill st-fail">SHORT</span>'}</td>
      <td style="min-width:70px"><div class="ptrack" style="margin:0"><div style="height:100%;border-radius:2px;background:${col};width:${pct}%;transition:width .5s"></div></div></td>
    </tr>`;
  });
  h += `</tbody></table></div></div>`;
  // Sub-requirements
  if (mode === "RC") {
    const ixL5 = (s.catL5["X"] || 0) + (s.catL5["I"] || 0);
    const ixL6 = (s.catL6["X"] || 0) + (s.catL6["I"] || 0);
    const mL5 = s.catL5["M"] || 0,
      zL5 = s.catL5["Z"] || 0,
      yL6 = s.catL6["Y"] || 0;
    h += subReqCard("RC Sub-Requirements", [
      ["Industrial (X) at L5+L6", ixL5, 30],
      ["Industrial (X) at L6", ixL6, 15],
      ["Management (M) at L5+", mL5, 12],
      ["Mathematics (Z) at L5+", zL5, 3],
      ["Project (Y) at L6", yL6, 6],
    ]);
  } else {
    const rL6 = s.catL6["R"] || 0;
    h += subReqCard("RC'25 Sub-Requirements", [
      ["Project (R) at L6", rL6, 6],
      ["Min elective credits at L6", s.l6, 8, "(overall L6 ≥8)"],
    ]);
  }
  document.getElementById("req-body").innerHTML = h;
}
function rsm(lbl, earned, req) {
  const ok = earned >= req,
    pct = Math.min(100, (earned / req) * 100);
  const col = ok ? "var(--pass)" : earned > 0 ? "var(--warn)" : "var(--fail)";
  return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:11px;text-align:center">
    <div style="font-size:9px;color:var(--text3);font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">${lbl}</div>
    <div style="font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:${ok ? "var(--pass)" : "var(--text)"}">${earned}</div>
    <div style="font-size:9px;color:var(--text2)">of ${req}</div>
    <div class="ptrack" style="margin-top:6px"><div style="height:100%;border-radius:2px;background:${col};width:${pct}%"></div></div>
  </div>`;
}
function subReqCard(title, rows) {
  let h = `<div class="card" style="margin-bottom:14px">
    <div style="font-size:12px;font-weight:600;margin-bottom:10px">${title}</div>
    <table class="req-tbl"><thead><tr><th>Requirement</th><th>Earned</th><th>Min</th><th>Status</th></tr></thead><tbody>`;
  rows.forEach(([lbl, earned, min, note = ""]) => {
    const ok = earned >= min;
    h += `<tr><td>${lbl}${note ? ` <span style="font-size:9px;color:var(--text3)">${note}</span>` : ""}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;font-weight:600;color:${ok ? "var(--pass)" : "var(--fail)"}">${earned}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--text2)">${min}</td>
      <td>${ok ? '<span class="spill st-pass">MET</span>' : '<span class="spill st-fail">SHORT</span>'}</td></tr>`;
  });
  return h + "</tbody></table></div>";
}

// ══════════════════════════════════════════════════
//  RENDER GPA DETAILS
// ══════════════════════════════════════════════════
function renderGPADetails() {
  const s = calcStats();
  const { gpa, used, sel, elig } = calcGPA(s.ec);
  const ml = { RC: "RC", RC25: "RC'25", RC25V: "RC'25 Virtual" }[mode];
  let h = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
    <h2 style="font-family:'Fraunces',serif;font-size:16px;font-weight:700">GPA Calculation Detail</h2>
    <span class="badge" style="color:var(--accent2)">${ml}</span>
  </div>`;
  h += `<div class="card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-size:12px;font-weight:600;margin-bottom:3px">Final GPA</div>
      <div style="font-size:10px;color:var(--text2)">Best ${used} credits (target 70) from L4–L6</div>
      <div style="font-size:10px;color:var(--text2)">Priority: Compulsory L5+L6 → Elective L5+L6 → Compulsory L4 → Elective L4</div>
      ${mode === "RC25V" ? `<div style="font-size:9px;color:var(--accent2);margin-top:4px">⚑ Virtual mode: reduced courses use original RC credit values for GPA weighting</div>` : ""}
    </div>
    <div style="font-family:'Fraunces',serif;font-size:40px;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;flex-shrink:0;margin-left:16px">${gpa !== null ? gpa.toFixed(2) : "—"}</div>
  </div>`;
  if (!sel.length) {
    h += `<div class="empty-state"><div class="ei">📊</div><h3>No graded courses yet</h3><p>Add courses with grades (A+–E) to calculate GPA.</p></div>`;
    document.getElementById("gpa-body").innerHTML = h;
    return;
  }
  // Selected courses table
  h += `<div class="card" style="margin-bottom:14px">
    <div style="font-size:12px;font-weight:600;margin-bottom:10px">Selected Courses for GPA (${used} credits)</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Code</th><th>Course</th><th>Lv</th><th>Priority Bucket</th><th>Actual Cr</th><th>GPA Cr</th><th>Used Cr</th><th>Grade</th><th>GPV</th><th>Weighted</th></tr></thead>
      <tbody>`;
  let rsum = 0;
  sel.forEach((c) => {
    const w = (c.gpv * c.usedCr).toFixed(2);
    rsum += c.gpv * c.usedCr;
    const bCol =
      {
        "Comp L5+L6": "rgba(108,140,255,.12)",
        "Elec L5+L6": "rgba(108,255,200,.08)",
        "Comp L4": "rgba(255,204,108,.1)",
        "Elec L4": "rgba(200,200,200,.06)",
      }[c.bucket] || "";
    h += `<tr${c.partial ? ' style="background:rgba(240,192,96,.04)"' : ""}>
      <td class="code-cell">${c.code}</td>
      <td style="font-size:10px;max-width:150px">${c.name || c.code}${c.partial ? ` <span style="font-size:8px;color:var(--warn)">(partial)</span>` : ""}</td>
      <td style="text-align:center;color:var(--text2);font-family:'DM Mono',monospace">${c.level}</td>
      <td><span style="font-size:9px;padding:2px 7px;border-radius:4px;background:${bCol};color:var(--text2)">${c.bucket}</span></td>
      <td style="text-align:center;font-family:'DM Mono',monospace">${c.credits}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:${c.isVirtual ? "var(--accent2)" : "var(--text)"}">${c.gpaCr}${c.isVirtual ? "▲" : ""}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:${c.partial ? "var(--warn)" : "var(--text)"}">${c.usedCr}</td>
      <td><span class="grade-badge ${gCls(c.grade)}">${c.grade}</span></td>
      <td style="text-align:center;font-family:'DM Mono',monospace">${c.gpv.toFixed(1)}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--accent);font-weight:600">${w}</td>
    </tr>`;
  });
  h += `<tr style="background:var(--surface2)">
    <td colspan="6" style="text-align:right;padding:7px 11px;font-size:10px;color:var(--text2)">Totals →</td>
    <td style="text-align:center;font-family:'DM Mono',monospace;padding:7px 11px;font-weight:600">${used}</td>
    <td colspan="2"></td>
    <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--accent);padding:7px 11px;font-weight:600">${rsum.toFixed(2)}</td>
  </tr></tbody></table></div></div>`;
  // GPA formula display
  h += `<div class="card" style="margin-bottom:14px;font-size:11px;color:var(--text2)">
    <div style="font-size:12px;font-weight:600;margin-bottom:8px">Formula</div>
    <div style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text)">GPA = Σ(GPV<sub>i</sub> × CR<sub>i</sub>) / Σ(CR<sub>i</sub>)</div>
    <div style="margin-top:6px">= ${rsum.toFixed(2)} / ${used} = <strong style="color:var(--accent)">${gpa !== null ? gpa.toFixed(4) : "—"}</strong></div>
  </div>`;
  // Not selected
  const usedCodes = new Set(sel.map((c) => c.code));
  const notUsed = elig.filter((c) => !usedCodes.has(c.code));
  if (notUsed.length) {
    h += `<div class="card"><div style="font-size:12px;font-weight:600;margin-bottom:10px;color:var(--text2)">Eligible but not selected (${notUsed.length})</div>
    <table class="req-tbl"><thead><tr><th>Code</th><th>Course</th><th>Lv</th><th>Actual Cr</th><th>GPA Cr</th><th>Grade</th><th>GPV</th></tr></thead><tbody>`;
    notUsed.forEach((c) => {
      h += `<tr><td class="code-cell" style="font-size:10px">${c.code}</td>
        <td style="font-size:10px;color:var(--text2)">${c.name || c.code}</td>
        <td style="text-align:center;color:var(--text3)">${c.level}</td>
        <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--text3)">${c.credits}</td>
        <td style="text-align:center;font-family:'DM Mono',monospace;color:${c.isVirtual ? "var(--accent2)" : "var(--text3)"}">${c.gpaCr}${c.isVirtual ? "▲" : ""}</td>
        <td><span class="grade-badge ${gCls(c.grade)}" style="opacity:.6">${c.grade}</span></td>
        <td style="text-align:center;font-family:'DM Mono',monospace;color:var(--text3)">${GRADE_GPV[c.grade].toFixed(1)}</td>
      </tr>`;
    });
    h += `</tbody></table></div>`;
  }
  document.getElementById("gpa-body").innerHTML = h;
}

// ══════════════════════════════════════════════════
//  RENDER COMPARE
// ══════════════════════════════════════════════════
function renderCompare() {
  const cc = {
    same: "var(--pass)",
    code: "var(--accent)",
    rename: "var(--accent2)",
    "code+cr↓": "var(--warn)",
    "rename+cr↓": "var(--warn)",
    "rename+cr↑": "var(--accent3)",
    "code+cr↑": "var(--accent3)",
    "split+cr↓": "var(--warn)",
    split: "var(--accent3)",
    new: "var(--accent)",
  };
  let h = "";
  CMP.forEach((d) => {
    const col = cc[d.ch] || "var(--text2)";
    h += `<tr>
      <td class="code-cell">${d.rc}</td><td style="font-size:11px">${d.rn}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;font-size:11px">${d.rc_ || "—"}</td>
      <td class="code-cell">${d.r25}</td><td style="font-size:11px">${d.rn25}</td>
      <td style="text-align:center;font-family:'DM Mono',monospace;font-size:11px">${d.r25_ || "—"}</td>
      <td><span style="font-size:9px;padding:2px 7px;border-radius:4px;font-family:'DM Mono',monospace;background:${col}22;color:${col}">${d.ch}</span></td>
    </tr>`;
  });
  document.getElementById("compare-body").innerHTML = h;
}

// ══════════════════════════════════════════════════
//  EXPORT
// ══════════════════════════════════════════════════
function exportCSV() {
  const ec = enrichAll();
  if (!ec.length) {
    alert("No courses to export.");
    return;
  }
  const s = calcStats();
  const { gpa, used } = calcGPA(ec);
  const ml = { RC: "RC", RC25: "RC25", RC25V: "RC25_Virtual" }[mode];
  const H = [
    "Course Code",
    "Course Name",
    "Level",
    "Category",
    "Credits (actual)",
    "Credits (GPA)",
    "Status",
    "Grade",
    "GPV",
    "Attempts",
    "Last Offered",
    "Elig Years",
    "Elig Left",
  ];
  const rows = ec.map((c) => [
    c.code,
    c.name,
    c.level,
    c.cat,
    c.credits,
    c.gpaCr,
    c.status,
    c.grade,
    GRADE_GPV[c.grade] ?? "",
    c.attempts,
    c.lastOffered,
    c.eligYears,
    c.eligLeft,
  ]);
  rows.push(
    [],
    [`Mode: ${ml}`],
    [`GPA (${used}/70cr)`, gpa ? gpa.toFixed(2) : "N/A"],
    [`Total Passed`, s.tot],
    [`L5+L6`, s.l56],
    [`Level 6`, s.l6],
  );
  const csv = [H, ...rows]
    .map((r) =>
      r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `OUSL_BSE_${ml}.csv`;
  a.click();
}
