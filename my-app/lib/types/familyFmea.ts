// Types for the Family FMEA flow derived from the ER model.

/**
 * Process/equipment lifecycle status for the Family FMEA flow.
 */
export type ProcessStatus = "not_started" | "in_progress" | "completed";

export interface Family {
  id: string;
  name: string;
  code: string;
}

export interface ProductionLine {
  id: string;
  familyId: string;
  name: string;
}

/**
 * Optional detail fields captured when creating an element or equipment.
 */
export interface ElementDetails {
  /** Feasability notes or references, if provided. */
  feasability?: string;
  /** FMEA notes or references, if provided. */
  fmea?: string;
  /** Inspection notes or references, if provided. */
  inspection?: string;
  /** SC notes or references, if provided. */
  sc?: string;
}

/**
 * Equipment item associated with a process.
 */
export interface Equipment {
  /** Unique identifier for the equipment entry. */
  id: string;
  /** Display name for the equipment entry. */
  name: string;
  /** Lifecycle status used for UI styling. */
  status: ProcessStatus;
  /** Optional detail fields captured in the create modal. */
  details?: ElementDetails;
}

/**
 * Process row with its equipment and optional attached element.
 */
export interface Process {
  /** Unique identifier for the process row. */
  id: string;
  /** Production line foreign key for the process. */
  productionLineId: string;
  /** Display name for the process. */
  name: string;
  /** Lifecycle status used for UI styling. */
  status: ProcessStatus;
  /** Freeform notes shown under the process title. */
  notes: string;
  /** Equipment entries displayed in the right panel. */
  equipment: Equipment[];
  /** Optional element attached directly to the process card. */
  element?: Equipment;
}

export interface AcceptanceCriteria {
  id: string;
  label: string;
  detail: string;
}

export interface GuideStep {
  id: number;
  title: string;
  description: string;
  acceptanceCriteria: AcceptanceCriteria[];
}

export interface FamilyFmeaOverview {
  family: Family;
  productionLine: ProductionLine;
  processes: Process[];
  steps: GuideStep[];
}
