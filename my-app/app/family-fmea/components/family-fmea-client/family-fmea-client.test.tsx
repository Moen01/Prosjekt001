import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FamilyFmeaOverview } from "@lib/types/familyFmea";
import FamilyFmeaClient from "./family-fmea-client";

jest.mock("@lib/api/familyFmea", () => ({
  fetchFamilies: jest.fn(),
  fetchFamilyOverview: jest.fn(),
}));

const { fetchFamilies, fetchFamilyOverview } = jest.requireMock(
  "@lib/api/familyFmea"
) as {
  fetchFamilies: jest.Mock;
  fetchFamilyOverview: jest.Mock;
};

/**
 * What it does:
 * Build a minimal FamilyFmeaOverview fixture for client tests.
 * Why it exists:
 * Keep render tests focused on modal-driven creation flows.
 *
 * @returns A minimal overview with one process and empty steps.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Equipment list starts empty for add-equipment testing.
 */
const makeOverview = (): FamilyFmeaOverview => ({
  family: { id: "fam-1", name: "Family One", code: "F1" },
  productionLine: { id: "line-1", familyId: "fam-1", name: "Line A" },
  processes: [
    {
      id: "proc-1",
      productionLineId: "line-1",
      name: "Process One",
      status: "not_started",
      notes: "Notes",
      equipment: [],
    },
  ],
  steps: [],
});

describe("FamilyFmeaClient", () => {
  beforeEach(() => {
    fetchFamilies.mockResolvedValue([
      { id: "fam-1", name: "Family One", code: "F1" },
    ]);
    fetchFamilyOverview.mockResolvedValue(makeOverview());
  });

  test("adds a process from the create modal", async () => {
    const user = userEvent.setup();

    render(<FamilyFmeaClient />);

    const processLabels = await screen.findAllByText("Process One");
    expect(processLabels.length).toBeGreaterThan(0);

    await user.click(screen.getByText("Add process"));

    await user.type(screen.getByPlaceholderText("Enter process name"), "Proc Two");
    await user.type(screen.getByPlaceholderText("Enter element name"), "Proc Elem");

    await user.click(screen.getByText("Save"));

    const newProcessLabels = await screen.findAllByText("Proc Two");
    expect(newProcessLabels.length).toBeGreaterThan(0);
    expect(await screen.findByText("Proc Elem")).toBeInTheDocument();
  });

  test("adds equipment from the shared create modal", async () => {
    const user = userEvent.setup();

    render(<FamilyFmeaClient />);

    const processLabels = await screen.findAllByText("Process One");
    expect(processLabels.length).toBeGreaterThan(0);

    await user.click(screen.getByTestId("equipment-add-element-proc-1"));
    await user.type(screen.getByPlaceholderText("Enter element name"), "Equip A");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Equip A")).toBeInTheDocument();
    });
  });

  test("adds a family element from the header button", async () => {
    const user = userEvent.setup();

    render(<FamilyFmeaClient />);

    const processLabels = await screen.findAllByText("Process One");
    expect(processLabels.length).toBeGreaterThan(0);

    await user.click(screen.getByTestId("family-add-element"));
    await user.type(screen.getByPlaceholderText("Enter element name"), "Family Elem");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Family Elem")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("family-add-element")).toBeNull();
    expect(screen.getByTestId("family-element")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit family element")).toBeEnabled();
  });

  test("edits an equipment element from the edit icon", async () => {
    const user = userEvent.setup();

    render(<FamilyFmeaClient />);

    const processLabels = await screen.findAllByText("Process One");
    expect(processLabels.length).toBeGreaterThan(0);

    await user.click(screen.getByTestId("equipment-add-element-proc-1"));
    await user.type(screen.getByPlaceholderText("Enter element name"), "Equip A");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Equip A")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Edit element"));
    const editInput = screen.getByPlaceholderText("Enter element name");
    await user.clear(editInput);
    await user.type(editInput, "Equip B");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Equip B")).toBeInTheDocument();
    });
  });

  test("edits a family element from the edit icon", async () => {
    const user = userEvent.setup();

    render(<FamilyFmeaClient />);

    const processLabels = await screen.findAllByText("Process One");
    expect(processLabels.length).toBeGreaterThan(0);

    await user.click(screen.getByTestId("family-add-element"));
    await user.type(screen.getByPlaceholderText("Enter element name"), "Family Elem");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Family Elem")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Edit family element"));
    const editInput = screen.getByPlaceholderText("Enter element name");
    await user.clear(editInput);
    await user.type(editInput, "Family Updated");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Family Updated")).toBeInTheDocument();
    });
  });
});
