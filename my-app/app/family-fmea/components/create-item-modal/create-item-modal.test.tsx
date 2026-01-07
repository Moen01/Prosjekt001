import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import CreateItemModal from "./create-item-modal";

/**
 * What it does:
 * Render a CreateItemModal with default props for tests.
 * Why it exists:
 * Keeps test setup concise and consistent across scenarios.
 *
 * @param overrides - Partial overrides for modal props.
 * @returns Rendered modal props and user-event instance.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Allows closed modal rendering for negative tests.
 */
const renderModal = (overrides?: Partial<ComponentProps<typeof CreateItemModal>>) => {
  const props: ComponentProps<typeof CreateItemModal> = {
    open: true,
    title: "Create process",
    processNameLabel: "Process name",
    elementNameLabel: "Process element",
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    ...overrides,
  };

  return {
    props,
    user: userEvent.setup(),
    ...render(<CreateItemModal {...props} />),
  };
};

describe("CreateItemModal", () => {
  test("shows detail fields after element name input and submits payload", async () => {
    const { user, props } = renderModal();

    await user.type(screen.getByPlaceholderText("Enter process name"), "Proc A");
    await user.type(screen.getByPlaceholderText("Enter element name"), "Elem A");

    expect(screen.getByPlaceholderText("Enter feasability notes")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Enter feasability notes"), "Feas");

    await user.click(screen.getByText("Save"));

    expect(props.onSubmit).toHaveBeenCalledWith({
      processName: "Proc A",
      elementName: "Elem A",
      details: { feasability: "Feas" },
    });
  });

  test("disables save when process name is required and missing", async () => {
    const { user } = renderModal();

    await user.type(screen.getByPlaceholderText("Enter element name"), "Elem A");

    expect(screen.getByText("Save")).toBeDisabled();
  });

  test("disables save when element name is missing", async () => {
    renderModal({ processNameLabel: undefined, title: "Create element" });

    expect(screen.getByText("Save")).toBeDisabled();
  });

  test("prefills values when initial data is provided", () => {
    renderModal({
      title: "Edit element",
      processNameLabel: undefined,
      elementNameLabel: "Element name",
      initialValues: {
        elementName: "Existing element",
        details: { feasability: "Known feasibility" },
      },
    });

    expect(screen.getByDisplayValue("Existing element")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Known feasibility")).toBeInTheDocument();
  });
});
