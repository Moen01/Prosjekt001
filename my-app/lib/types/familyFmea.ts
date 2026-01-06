// Types for the Family FMEA flow derived from the ER model.

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

export interface Equipment {
  id: string;
  name: string;
  status: ProcessStatus;
}

export interface Process {
  id: string;
  productionLineId: string;
  name: string;
  status: ProcessStatus;
  notes: string;
  equipment: Equipment[];
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
