export type StatusColor = "red" | "yellow" | "green";

export interface ChecklistState {
  id: string;
  label: string;
  checked: boolean;
}

export interface GuideStep {
  id: number;
  title: string;
  description: string;
  checklist: ChecklistState[];
}

export interface ProcessTextField {
  id: string;
  title: string;
  value: string;
}

export interface RotatedTextField {
  id: string;
  value: string;
  isBold: boolean;
}

export type FmeaCardId = string;

export interface ProcessBox {
  id: string;
  rotatedText: RotatedTextField;
  textFields: ProcessTextField[];
  initialCardId: FmeaCardId;
  extraCardIds: FmeaCardId[];
}

export interface RedPanelState {
  category: string;
  cardIds: FmeaCardId[];
}

export interface ProcessGuideStatus {
  statusColors: StatusColor[];
}
