// Mock data for the Family FMEA API routes (replace with real backend later).

import type {
  Family,
  FamilyFmeaOverview,
  GuideStep,
  Process,
  ProductionLine,
} from "@lib/types/familyFmea";

const families: Family[] = [
  { id: "fam-b62", name: "Bearing Housing", code: "B62" },
  { id: "fam-m52", name: "M52 Platform", code: "M52" },
  { id: "fam-m76", name: "M76 Platform", code: "M76" },
];

const productionLines: ProductionLine[] = [
  { id: "line-b62-1", familyId: "fam-b62", name: "Bearing Line 1" },
  { id: "line-m52-1", familyId: "fam-m52", name: "M52 Line 1" },
  { id: "line-m76-1", familyId: "fam-m76", name: "M76 Line 1" },
];

const processesByLine: Record<string, Process[]> = {
  "line-b62-1": [
    {
      id: "proc-melt",
      productionLineId: "line-b62-1",
      name: "Melt & alloy",
      status: "completed",
      notes: "Confirmed chemistry recipe and furnace limits.",
      equipment: [
        { id: "equip-temp", name: "Temperature profile", status: "completed" },
        { id: "equip-safety", name: "Safety interlocks", status: "in_progress" },
        { id: "equip-qa", name: "Quality sampling", status: "not_started" },
      ],
      fiveMIssues: {
        Man: [
          {
            id: "issue-1",
            label: "Operator Training",
            status: "in_progress",
            details: "Need certification for furnace operation.",
            linkedEquipmentId: "equip-temp",
          },
        ],
      },
    },
    {
      id: "proc-cast",
      productionLineId: "line-b62-1",
      name: "Casting",
      status: "in_progress",
      notes: "Draft mold changes require tooling review.",
      equipment: [
        { id: "equip-mold", name: "Mold design", status: "in_progress" },
        { id: "equip-cool", name: "Cooling controls", status: "not_started" },
        { id: "equip-inspect", name: "In-line inspection", status: "not_started" },
      ],
    },
    {
      id: "proc-cnc",
      productionLineId: "line-b62-1",
      name: "CNC machining",
      status: "not_started",
      notes: "Fixtures pending torque validation.",
      equipment: [
        { id: "equip-fixt", name: "Fixture set", status: "not_started" },
        { id: "equip-prog", name: "Program files", status: "not_started" },
        { id: "equip-maint", name: "Maintenance plan", status: "not_started" },
      ],
    },
  ],
};

const steps: GuideStep[] = [
  {
    id: 1,
    title: "Create process flow",
    description:
      "Set up the process flow of the new line and add process equipment to each step.",
    acceptanceCriteria: [
      {
        id: "ac1",
        label: "AC1",
        detail: "All processes are added according to the actual process flow.",
      },
      {
        id: "ac2",
        label: "AC2",
        detail: "All equipment is linked to the corresponding process step.",
      },
      {
        id: "ac3",
        label: "AC3",
        detail: "Process flow approved by process engineer.",
      },
    ],
  },
  {
    id: 2,
    title: "Add standard characteristics",
    description:
      "Capture the standard product and process characteristics for the family.",
    acceptanceCriteria: [
      {
        id: "ac1",
        label: "AC1",
        detail: "All characteristics are defined for each process step.",
      },
      {
        id: "ac2",
        label: "AC2",
        detail: "Link characteristics to product and process cards.",
      },
      {
        id: "ac3",
        label: "AC3",
        detail: "Reviewed with process owner.",
      },
    ],
  },
  {
    id: 3,
    title: "Confirm causes and actions",
    description:
      "Add standard causes and preventive actions for the family.",
    acceptanceCriteria: [
      {
        id: "ac1",
        label: "AC1",
        detail: "Causes mapped for each characteristic.",
      },
      {
        id: "ac2",
        label: "AC2",
        detail: "Preventive actions captured and prioritized.",
      },
      {
        id: "ac3",
        label: "AC3",
        detail: "Approved by process planner.",
      },
    ],
  },
];

export function getFamilyList(): Family[] {
  return families;
}

export function getFamilyOverview(familyId: string): FamilyFmeaOverview {
  const family = families.find((item) => item.id === familyId) ?? families[0];
  const productionLine =
    productionLines.find((item) => item.familyId === family.id) ??
    productionLines[0];

  return {
    family,
    productionLine,
    processes: processesByLine[productionLine.id] ?? [],
    steps,
  };
}
