import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FamilyFmeaHandler from "./page";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

/**
 * What it does:
 * Render the Family FMEA handler for tests.
 * Why it exists:
 * Centralizes setup for list and routing tests.
 *
 * @returns The rendered component instance.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Uses the default entries seeded by the component.
 */
const renderPage = () => render(<FamilyFmeaHandler />);

describe("FamilyFmeaHandler", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  test("blocks opening when no entry is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText("Open Family FMEA"));

    expect(screen.getByText("Select a Family FMEA to open")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("opens the selected entry with the family-fmea route", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText("M52"));
    await user.click(screen.getByText("Open Family FMEA"));

    expect(pushMock).toHaveBeenCalledWith("/family-fmea?title=M52");
  });

  test("rejects empty new family names", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText("New Family FMEA"));
    await user.click(screen.getByText("Add"));

    expect(
      screen.getByText("Family FMEA name cannot be empty")
    ).toBeInTheDocument();
  });

  test("adds a new entry with the family-fmea route", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText("New Family FMEA"));
    await user.type(screen.getByPlaceholderText("Enter new Family FMEA"), "M90");
    await user.click(screen.getByText("Add"));

    await user.click(screen.getByText("M90"));
    await user.click(screen.getByText("Open Family FMEA"));

    expect(pushMock).toHaveBeenCalledWith("/family-fmea?title=M90");
  });
});
