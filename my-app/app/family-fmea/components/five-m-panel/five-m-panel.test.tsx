import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ProcessStatus } from "@lib/types/familyFmea";
import FiveMPanel from "./five-m-panel";

const labels = ["Man", "Machine"];

const statusLabel: Record<ProcessStatus, string> = {
  not_started: "Not started",
  in_progress: "In work",
  completed: "Completed",
};

/**
 * Test-only cause card shape for FiveMPanel fixtures.
 */
interface FiveMTestItem {
  /** Stable id for React keys. */
  id: string;
  /** Label shown inside the cause card. */
  label: string;
  /** Status value for the cause card. */
  status: ProcessStatus;
}

/**
 * Map from 5M label to its cause cards.
 */
type FiveMItemsByLabel = Record<string, FiveMTestItem[]>;

/**
 * What it does:
 * Build a minimal items map for FiveMPanel tests.
 * Why it exists:
 * Keep test fixtures compact and focused on rendering behavior.
 *
 * @returns A label-to-items map with one cause card.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Only the first label has items to verify per-column rendering.
 */
const makeItems = (): FiveMItemsByLabel => ({
  Man: [{ id: "item-1", label: "Man element 1", status: "not_started" }],
  Machine: [],
});

describe("FiveMPanel", () => {
  test("renders buttons and cause cards with header height styling", async () => {
    const user = userEvent.setup();
    const onAddItem = jest.fn();
    const onToggleCauseStatus = jest.fn();
    const onEditCause = jest.fn();

    render(
      <FiveMPanel
        labels={labels}
        items={makeItems()}
        headerHeight={80}
        statusLabel={statusLabel}
        onAddItem={onAddItem}
        onToggleCauseStatus={onToggleCauseStatus}
        onEditCause={onEditCause}
      />
    );

    const panel = screen.getByTestId("five-m-panel");

    expect(screen.getByText("Man")).toBeInTheDocument();
    expect(screen.getByText("Machine")).toBeInTheDocument();
    expect(screen.getByText("Man element 1")).toBeInTheDocument();
    expect(panel).toHaveStyle("--equipment-header-height: 80px");

    await user.click(screen.getByText("Machine"));
    expect(onAddItem).toHaveBeenCalledWith("Machine");
  });
});
