import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Process, ProcessStatus } from "@lib/types/familyFmea";
import EquipmentPanel from "./equipment-panel";

const statusLabel: Record<ProcessStatus, string> = {
  not_started: "Not started",
  in_progress: "In work",
  completed: "Completed",
};

/**
 * What it does:
 * Build a minimal process fixture for equipment panel tests.
 * Why it exists:
 * Keep tests focused on the panel behavior without extra setup.
 *
 * @returns A Process with one equipment entry for testing.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Equipment list contains a single item to simplify assertions.
 */
const makeProcess = (): Process => ({
  id: "proc-1",
  productionLineId: "line-1",
  name: "Process 1",
  status: "not_started",
  notes: "Notes",
  equipment: [{ id: "eq-1", name: "Equipment A", status: "not_started" }],
});

describe("EquipmentPanel", () => {
  test("selects the process when clicking a faded panel", async () => {
    const user = userEvent.setup();
    const process = makeProcess();
    const onSelectProcess = jest.fn();

    render(
      <EquipmentPanel
        process={process}
        isSelected={false}
        clampHeight={120}
        statusLabel={statusLabel}
        onAddEquipment={jest.fn()}
        onSelectProcess={onSelectProcess}
        onToggleEquipmentStatus={jest.fn()}
        onEditEquipment={jest.fn()}
      />
    );

    await user.click(screen.getByTestId(`equipment-panel-${process.id}`));

    expect(onSelectProcess).toHaveBeenCalledWith(process.id);
  });

  test("does not reselect when the panel is already active", async () => {
    const user = userEvent.setup();
    const process = makeProcess();
    const onSelectProcess = jest.fn();

    render(
      <EquipmentPanel
        process={process}
        isSelected
        clampHeight={120}
        statusLabel={statusLabel}
        onAddEquipment={jest.fn()}
        onSelectProcess={onSelectProcess}
        onToggleEquipmentStatus={jest.fn()}
        onEditEquipment={jest.fn()}
      />
    );

    await user.click(screen.getByTestId(`equipment-panel-${process.id}`));

    expect(onSelectProcess).not.toHaveBeenCalled();
  });

  test("does not toggle equipment status when panel is inactive", async () => {
    const user = userEvent.setup();
    const process = makeProcess();
    const onSelectProcess = jest.fn();
    const onToggleEquipmentStatus = jest.fn();

    render(
      <EquipmentPanel
        process={process}
        isSelected={false}
        clampHeight={120}
        statusLabel={statusLabel}
        onAddEquipment={jest.fn()}
        onSelectProcess={onSelectProcess}
        onToggleEquipmentStatus={onToggleEquipmentStatus}
        onEditEquipment={jest.fn()}
      />
    );

    await user.click(screen.getByText("Equipment A"));

    expect(onSelectProcess).toHaveBeenCalledWith(process.id);
    expect(onToggleEquipmentStatus).not.toHaveBeenCalled();
  });

  test("routes edit icon clicks to the edit callback", async () => {
    const user = userEvent.setup();
    const process = makeProcess();
    const onEditEquipment = jest.fn();

    render(
      <EquipmentPanel
        process={process}
        isSelected
        clampHeight={120}
        statusLabel={statusLabel}
        onAddEquipment={jest.fn()}
        onSelectProcess={jest.fn()}
        onToggleEquipmentStatus={jest.fn()}
        onEditEquipment={onEditEquipment}
      />
    );

    const editButton = screen.getByLabelText("Edit element");
    await user.click(editButton);

    expect(onEditEquipment).toHaveBeenCalledWith(process.id, "eq-1");
  });
});
