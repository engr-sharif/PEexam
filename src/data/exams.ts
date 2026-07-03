import type { Exam, KnowledgeArea } from '../types';

// ---------------------------------------------------------------------------
// Exam blueprints. Specs verified June 2026 against:
//  - NCEES PE Civil–Geotechnical CBT specs (effective April 2024)
//  - BPELSG / Prometric CA Civil Seismic Principles & Engineering Surveying
// Always re-verify the live test plans before your exam date (links in app).
// ---------------------------------------------------------------------------

// Geotechnical question ranges (midpoint used for weighting). Total = 80.
const geoAreas: KnowledgeArea[] = [
  {
    id: 'geo-site',
    examId: 'pe-geotech',
    name: 'Site Characterization',
    weight: 10 / 80,
    questionRange: '8–12',
    subtopics: [
      'Interpreting site & geologic data (aerial, GIS, as-builts)',
      'Subsurface exploration planning',
      'Exploration techniques (auger, rotary, coring, CPT, geophysics, test pits)',
      'Sampling techniques (split-barrel, thin-walled tube)',
      'In-situ testing (SPT, CPT, pressuremeter, dilatometer, vane shear)',
      'Soil description & classification (USCS, AASHTO)',
      'Rock classification (RQD, RMR, weathering, discontinuities)',
      'Groundwater exploration & characterization',
    ],
  },
  {
    id: 'geo-soilmech',
    examId: 'pe-geotech',
    name: 'Soil Mechanics, Lab Testing & Analysis',
    weight: 10 / 80,
    questionRange: '8–12',
    subtopics: [
      'Phase relationships & index properties',
      'Chemical, electrical & thermal properties',
      'Stress in soil mass (total & effective)',
      'Stress/strain & shear strength',
      'Permeability (constant & falling head, correlations)',
    ],
  },
  {
    id: 'geo-construction',
    examId: 'pe-geotech',
    name: 'Construction, Monitoring & QA/QC & Safety',
    weight: 7.5 / 80,
    questionRange: '6–9',
    subtopics: [
      'Earthwork (excavation, compaction, borrow, fill)',
      'Trench & construction safety (OSHA 29 CFR 1926 Subpart P)',
      'Geotechnical instrumentation (inclinometer, piezometer)',
      'Erosion & scour protection',
    ],
  },
  {
    id: 'geo-earthquake',
    examId: 'pe-geotech',
    name: 'Earthquake Engineering & Dynamic Loads',
    weight: 6.5 / 80,
    questionRange: '5–8',
    subtopics: [
      'Seismic site characterization (site class, Vs30)',
      'Liquefaction analysis',
      'Pseudo-static analysis & earthquake loads',
    ],
  },
  {
    id: 'geo-earthstruct',
    examId: 'pe-geotech',
    name: 'Earth Structures, Ground Improvement & Pavement',
    weight: 11.5 / 80,
    questionRange: '9–14',
    subtopics: [
      'Ground improvement (grouting, wick drains, stabilization, aggregate piers)',
      'Geosynthetics (separation, reinforcement, MSE internal stability)',
      'Slope stability evaluation & stabilization',
      'Embankments, dams & levees',
      'Landfills & caps',
      'Pavement & slab-on-grade design',
    ],
  },
  {
    id: 'geo-groundwater',
    examId: 'pe-geotech',
    name: 'Groundwater & Seepage',
    weight: 5 / 80,
    questionRange: '4–6',
    subtopics: [
      'Dewatering & seepage analysis',
      'Groundwater flow & impact on structures',
      'Drainage / infiltration / seepage control',
    ],
  },
  {
    id: 'geo-problematic',
    examId: 'pe-geotech',
    name: 'Problematic Soil & Rock Conditions',
    weight: 5 / 80,
    questionRange: '4–6',
    subtopics: [
      'Karst, collapsible, expansive, peat & sensitive soils',
      'Reactive / corrosive soils',
      'Frost susceptibility',
      'Rock slopes & rockfall',
    ],
  },
  {
    id: 'geo-retaining',
    examId: 'pe-geotech',
    name: 'Retaining Structures (ASD or LRFD)',
    weight: 12.5 / 80,
    questionRange: '10–15',
    subtopics: [
      'Lateral earth pressure & load distribution',
      'Rigid retaining wall analysis (CIP, gravity, MSE external stability)',
      'Flexible walls (soldier pile & lagging, sheet pile, secant/tangent)',
      'Cofferdams',
      'Underpinning',
      'Ground anchors, tie-backs, soil nails, rock anchors',
    ],
  },
  {
    id: 'geo-shallow',
    examId: 'pe-geotech',
    name: 'Shallow Foundations (ASD or LRFD)',
    weight: 7.5 / 80,
    questionRange: '6–9',
    subtopics: ['Bearing capacity', 'Settlement & induced stress distribution'],
  },
  {
    id: 'geo-deep',
    examId: 'pe-geotech',
    name: 'Deep Foundations (ASD or LRFD)',
    weight: 12.5 / 80,
    questionRange: '10–15',
    subtopics: [
      'Axial capacity & settlement (driven pile, drilled shaft, micropile, helical)',
      'Lateral capacity & deformation',
      'Installation methods',
      'Static & dynamic load testing',
      'Integrity testing',
    ],
  },
];

// WRE question ranges per the NCEES CBT spec effective April 2024
// (midpoint used for weighting; the mock sampler normalizes).
const wreAreas: KnowledgeArea[] = [
  {
    id: 'wre-planning',
    examId: 'pe-wre',
    name: 'Project Planning',
    weight: 5 / 80,
    questionRange: '4–6',
    subtopics: [
      'Quantity take-off methods',
      'Cost estimating',
      'Project schedules, activity identification & sequencing',
      'Economic & sustainability analysis (present worth, lifecycle cost)',
    ],
  },
  {
    id: 'wre-soil',
    examId: 'pe-wre',
    name: 'Soil Mechanics',
    weight: 4 / 80,
    questionRange: '3–5',
    subtopics: [
      'Lateral earth pressure',
      'Consolidation & compaction',
      'Bearing capacity & settlement',
      'Slope stability',
    ],
  },
  {
    id: 'wre-materials',
    examId: 'pe-wre',
    name: 'Materials',
    weight: 5 / 80,
    questionRange: '4–6',
    subtopics: [
      'Soil classification & boring log interpretation',
      'Soil properties (strength, permeability, phase relationships)',
      'Concrete (plain & reinforced)',
      'Piping materials',
      'Material test methods & spec conformance',
    ],
  },
  {
    id: 'wre-analysis',
    examId: 'pe-wre',
    name: 'Analysis & Design',
    weight: 7.5 / 80,
    questionRange: '6–9',
    subtopics: [
      'Mass balance',
      'Hydraulic loading',
      'Solids loading (sediment, sludge)',
      'Hydraulic flow measurement (weirs, flumes, meters)',
    ],
  },
  {
    id: 'wre-closed',
    examId: 'pe-wre',
    name: 'Hydraulics — Closed Conduit',
    weight: 9 / 80,
    questionRange: '7–11',
    subtopics: [
      'Energy/continuity (Bernoulli, EGL/HGL, momentum)',
      'Pressure conduits (Hazen-Williams, Darcy-Weisbach, minor losses)',
      'Pumps: system curves, wet wells, lift stations, cavitation/NPSH',
      'Pipe networks (series, parallel, loops)',
    ],
  },
  {
    id: 'wre-open',
    examId: 'pe-wre',
    name: 'Hydraulics — Open Channel',
    weight: 9 / 80,
    questionRange: '7–11',
    subtopics: [
      "Open-channel flow (Manning's equation)",
      'HGL & energy dissipation (plunge pools, drop structures, culvert outlets)',
      'Stormwater collection (culverts, inlets, gutter & storm sewer flow)',
      'Sub/supercritical flow, Froude number, hydraulic jump',
    ],
  },
  {
    id: 'wre-hydrology',
    examId: 'pe-wre',
    name: 'Hydrology',
    weight: 10 / 80,
    questionRange: '8–12',
    subtopics: [
      'Storm frequency, rainfall measurement & distributions',
      'Runoff analysis (Rational & NRCS/SCS methods)',
      'Hydrographs, incl. synthetic (unit hydrograph)',
      'IDF curves & probability of exceedance',
      'Time of concentration',
      'Detention/retention & stormwater management (ponds, swales, wetlands)',
    ],
  },
  {
    id: 'wre-groundwater',
    examId: 'pe-wre',
    name: 'Groundwater & Wells',
    weight: 5 / 80,
    questionRange: '4–6',
    subtopics: ['Aquifers (confined/unconfined)', 'Groundwater flow (Darcy)', 'Well & drawdown analysis'],
  },
  {
    id: 'wre-quality',
    examId: 'pe-wre',
    name: 'Surface & Groundwater Quality',
    weight: 6.5 / 80,
    questionRange: '5–8',
    subtopics: [
      'Stream degradation & oxygen dynamics (DO sag, Streeter-Phelps)',
      'TMDL & load allocation',
      'Biological & chemical contaminants (BOD/COD, nutrients, pathogens)',
    ],
  },
  {
    id: 'wre-drinking',
    examId: 'pe-wre',
    name: 'Drinking Water Distribution & Treatment',
    weight: 7.5 / 80,
    questionRange: '6–9',
    subtopics: [
      'Distribution systems, demand & storage',
      'Coagulation/flocculation & sedimentation',
      'Filtration & membranes',
      'Disinfection & DBPs (CT concept)',
      'Hardness/softening, ion exchange, adsorption, UV/ozone',
    ],
  },
  {
    id: 'wre-wastewater',
    examId: 'pe-wre',
    name: 'Wastewater Collection & Treatment',
    weight: 9 / 80,
    questionRange: '7–11',
    subtopics: [
      'Collection systems (lift stations, I/I, odor control)',
      'Preliminary & primary treatment',
      'Secondary treatment (activated sludge, trickling filters)',
      'Nutrient removal (N & P)',
      'Solids handling & disinfection',
      'Advanced treatment & water reuse',
    ],
  },
  {
    id: 'wre-sitework',
    examId: 'pe-wre',
    name: 'Project Sitework',
    weight: 11.5 / 80,
    questionRange: '9–14',
    subtopics: [
      'Excavation & embankment (grading, cut/fill)',
      'Site layout & construction control',
      'Erosion & sediment control (permits, sediment transport, outlet protection)',
      'Impacts on adjacent facilities',
      'Safety (construction, roadside, work zone)',
      'Basic horizontal & vertical curves',
      'Retaining walls & construction methods',
    ],
  },
];

const seismicAreas: KnowledgeArea[] = [
  {
    id: 'seis-data',
    examId: 'ca-seismic',
    name: 'Seismic Data & Seismic Design Criteria',
    weight: 0.1,
    subtopics: [
      'Seismicity, faults & ground motion',
      'Risk category & importance factor',
      'Site class & site coefficients (Fa, Fv)',
      'Design spectral accelerations (SDS, SD1)',
      'Seismic Design Category (SDC)',
    ],
  },
  {
    id: 'seis-characteristics',
    examId: 'ca-seismic',
    name: 'Seismic Characteristics of Engineered Systems',
    weight: 0.15,
    subtopics: [
      'Mass, stiffness & natural period',
      'Single & multi-degree-of-freedom behavior',
      'Damping & resonance',
      'Ductility & response modification (R, Ω0, Cd)',
      'Diaphragms (rigid vs flexible) & load path',
    ],
  },
  {
    id: 'seis-buildings',
    examId: 'ca-seismic',
    name: 'Seismic Forces: Building Structures',
    weight: 0.28,
    subtopics: [
      'Equivalent Lateral Force (ELF) base shear',
      'Approximate fundamental period Ta',
      'Vertical distribution of forces (Cvx)',
      'Story shear & overturning',
      'Drift & P-delta',
      'Redundancy ρ & accidental torsion',
    ],
  },
  {
    id: 'seis-nonbuilding',
    examId: 'ca-seismic',
    name: 'Seismic Forces: Nonbuilding, Components & Equipment',
    weight: 0.12,
    subtopics: [
      'Architectural / mechanical / electrical component forces (Fp)',
      'Nonbuilding structures (tanks, racks)',
      'Anchorage of components & equipment',
      'Rigid vs flexible component amplification',
    ],
  },
  {
    id: 'seis-analysis',
    examId: 'ca-seismic',
    name: 'Seismic Analysis Procedures',
    weight: 0.25,
    subtopics: [
      'Permitted analysis procedures by SDC',
      'Modal response spectrum analysis',
      'Response spectra construction',
      'Load combinations w/ vertical seismic (0.2 SDS D)',
      'Overstrength (Emh) load effects',
    ],
  },
  {
    id: 'seis-detailing',
    examId: 'ca-seismic',
    name: 'Seismic Detailing & Construction QC',
    weight: 0.1,
    subtopics: [
      'Ductile detailing concepts (concrete, steel, wood, masonry)',
      'Capacity design / strong-column weak-beam',
      'Connections & collectors',
      'Special inspection & construction QA',
    ],
  },
];

const surveyingAreas: KnowledgeArea[] = [
  {
    id: 'surv-topo',
    examId: 'ca-surveying',
    name: 'Topographic Surveys',
    weight: 0.35,
    subtopics: [
      'Distance, angle & leveling measurements',
      'Traverse computations & closure / adjustment',
      'Coordinate geometry (COGO), bearings & azimuths',
      'GNSS / GPS & datums (NAD83, NAVD88)',
      'Photogrammetry, LiDAR & remote sensing',
      'Contours, DTM & topographic mapping',
      'State Plane Coordinate System & scale factor',
    ],
  },
  {
    id: 'surv-construction',
    examId: 'ca-surveying',
    name: 'Construction Surveys',
    weight: 0.35,
    subtopics: [
      'Horizontal curves (simple, compound, spiral)',
      'Vertical curves & grades',
      'Earthwork volumes (average end area, prismoidal)',
      'Staking, offsets & grade control',
      'Slope staking & cross-sections',
      'As-built & layout surveys',
    ],
  },
  {
    id: 'surv-error',
    examId: 'ca-surveying',
    name: 'Accuracy & Error Analysis',
    weight: 0.1,
    subtopics: [
      'Systematic vs random error & blunders',
      'Error propagation',
      'Standard deviation & most probable value',
      'Relative precision & error of closure',
      'Significant figures & rounding',
    ],
  },
  {
    id: 'surv-reports',
    examId: 'ca-surveying',
    name: 'Preparation of Reports & Maps',
    weight: 0.2,
    subtopics: [
      'Legal descriptions & boundary principles',
      'Public Land Survey System (PLSS)',
      'Plats, maps & record of survey (CA Land Surveyors Act / PLS Act)',
      'Areas (DMD, coordinates, geometric)',
      'Map scales & symbology',
    ],
  },
];

export const EXAMS: Exam[] = [
  {
    id: 'pe-geotech',
    name: 'PE Civil — Geotechnical Depth (NCEES)',
    shortName: 'PE Geotech',
    authority: 'NCEES',
    questionCount: 80,
    examMinutes: 480, // 8 h of testing within the 9 h appointment
    appointmentNote:
      '9-hour appointment: nondisclosure + tutorial + 8 h testing + one optional 25-min break. Depth-only (all 80 questions are geotechnical).',
    passNote:
      'Pass/fail by NCEES cut score (≈ 56–60% correct in recent administrations; not published exactly). Aim for ≥ 70% in practice.',
    color: 'amber',
    blurb:
      'The national PE Civil computer-based exam in the Geotechnical depth. Closed book with the searchable NCEES PE Civil Reference Handbook plus design standards provided on-screen.',
    references: [
      'NCEES PE Civil Reference Handbook (provided on exam)',
      'ASCE/SEI 7-16 — Minimum Design Loads',
      'USACE EM 1110-2-1902 — Slope Stability',
      'FHWA NHI-06-088/089 — Soils & Foundations Reference Manual',
      'FHWA GEC No. 3, 5, 10, 12 (seismic, site char., drilled shafts, driven piles)',
      'NAVFAC DM-7.02 — Foundations & Earth Structures',
      'OSHA 29 CFR 1926 (Subparts E, M, P, CC)',
      'UFC 3-220-05 / 3-220-10 — Dewatering & Soil Mechanics',
    ],
    areas: geoAreas,
  },
  {
    id: 'pe-wre',
    name: 'PE Civil — Water Resources & Environmental Depth (NCEES)',
    shortName: 'PE WRE',
    authority: 'NCEES',
    questionCount: 80,
    examMinutes: 480,
    appointmentNote:
      '9-hour appointment: nondisclosure + tutorial + 8 h testing + one optional 25-min break. Depth-only (all 80 questions are water resources & environmental).',
    passNote:
      'Pass/fail by NCEES cut score (≈ 53–58% correct in recent administrations; not published exactly). Aim for ≥ 70% in practice.',
    color: 'sky',
    blurb:
      'The national PE Civil computer-based exam in the Water Resources & Environmental depth. Closed book with the searchable NCEES PE Civil Reference Handbook plus the Ten States Standards provided on-screen.',
    references: [
      'NCEES PE Civil Reference Handbook (provided on exam)',
      'Recommended Standards for Wastewater Facilities (Ten States Standards), 2014',
      'Recommended Standards for Water Works (Ten States Standards), 2018',
    ],
    areas: wreAreas,
  },
  {
    id: 'ca-seismic',
    name: 'CA Civil Seismic Principles',
    shortName: 'CA Seismic',
    authority: 'BPELSG (Prometric)',
    questionCount: 55,
    examMinutes: 150,
    appointmentNote:
      '2.5-hour computer-based test at Prometric. 55 multiple-choice questions. California-specific requirement for civil PE licensure.',
    passNote: 'Scaled passing standard set by BPELSG. Aim for ≥ 70% in practice.',
    color: 'rose',
    blurb:
      'California-only exam on earthquake engineering and seismic design of structures, based on ASCE 7-16 and the California Building Code.',
    references: [
      'ASCE/SEI 7-16 + Supplements 1, 2 & 3',
      '2022 California Building Code (CBC) Vol. 2 — or 2021 IBC',
      'CA Seismic Design Review references (SEAOC / SDR)',
    ],
    areas: seismicAreas,
  },
  {
    id: 'ca-surveying',
    name: 'CA Civil Engineering Surveying',
    shortName: 'CA Surveying',
    authority: 'BPELSG (Prometric)',
    questionCount: 55,
    examMinutes: 150,
    appointmentNote:
      '2.5-hour computer-based test at Prometric. 55 multiple-choice questions. California-specific requirement for civil PE licensure.',
    passNote: 'Scaled passing standard set by BPELSG. Aim for ≥ 70% in practice.',
    color: 'emerald',
    blurb:
      'California-only exam on engineering surveying: topographic and construction surveys, route geometry, error analysis, and maps/reports.',
    references: [
      'CA Professional Land Surveyors’ Act / Subdivision Map Act (concepts)',
      'Standard surveying texts (e.g., Ghilani & Wolf, Elementary Surveying)',
      'Caltrans Surveys Manual (route surveying concepts)',
    ],
    areas: surveyingAreas,
  },
];

export const EXAM_BY_ID: Record<string, Exam> = Object.fromEntries(
  EXAMS.map((e) => [e.id, e]),
);

export function areaById(areaId: string): KnowledgeArea | undefined {
  for (const e of EXAMS) {
    const a = e.areas.find((x) => x.id === areaId);
    if (a) return a;
  }
  return undefined;
}
