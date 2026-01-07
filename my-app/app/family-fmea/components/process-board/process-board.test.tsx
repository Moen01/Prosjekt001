import { render, screen, within } from "@testing-library/react";
import type { Process } from "@lib/types/familyFmea";
import ProcessBoard from "./process-board";

/**
 * What it does:
 * Build a minimal process fixture with a process-level element.
 * Why it exists:
 * Validate the element is rendered inside the process card.
 *
 * @returns A Process with one attached element.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Uses a single equipment item to keep the board minimal.
 */
const makeProcess = (): Process => ({
  id: "proc-1",
  productionLineId: "line-1",
  name: "Process One",
  status: "not_started",
  notes: "Notes",
  equipment: [{ id: "eq-1", name: "Equipment A", status: "not_started" }],
  element: {
    id: "elem-1",
    name: "Process Element",
    status: "not_started",
  },
});

describe("ProcessBoard", () => {
  test("renders the process element inside the process card", () => {
    const process = makeProcess();

    render(
      <ProcessBoard
        familyCode="F1"
        processes={[process]}
        selectedProcessId={process.id}
        onSelectProcess={jest.fn()}
        onToggleProcessStatus={jest.fn()}
        onToggleEquipmentStatus={jest.fn()}
        onAddProcess={jest.fn()}
        onAddEquipment={jest.fn()}
        onEditProcessElement={jest.fn()}
        onEditEquipment={jest.fn()}
      />
    );

    const card = screen.getByTestId(`process-card-${process.id}`);

    expect(within(card).getByText("Process Element")).toBeInTheDocument();
  });
});
