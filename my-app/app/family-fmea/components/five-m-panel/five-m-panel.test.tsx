import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FiveMPanel from "./five-m-panel";

const labels = ["Man", "Machine"];

/**
 * Test-only sub-element shape for FiveMPanel fixtures.
 */
interface FiveMTestItem {
  /** Stable id for React keys. */
  id: string;
  /** Label shown inside the sub-element. */
  label: string;
}

/**
 * Map from 5M label to its sub-elements.
 */
type FiveMItemsByLabel = Record<string, FiveMTestItem[]>;

/**
 * What it does:
 * Build a minimal items map for FiveMPanel tests.
 * Why it exists:
 * Keep test fixtures compact and focused on rendering behavior.
 *
 * @returns A label-to-items map with one sub-element.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Only the first label has items to verify per-column rendering.
 */
const makeItems = (): FiveMItemsByLabel => ({
  Man: [{ id: "item-1", label: "Man element 1" }],
  Machine: [],
});

describe("FiveMPanel", () => {
  test("renders buttons and sub-elements with header height styling", async () => {
    const user = userEvent.setup();
    const onAddItem = jest.fn();

    render(
      <FiveMPanel
        labels={labels}
        items={makeItems()}
        headerHeight={80}
        onAddItem={onAddItem}
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
