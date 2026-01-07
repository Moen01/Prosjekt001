import { redirect } from "next/navigation";
import NewFamilyPage, { buildFamilyFmeaRedirectUrl } from "./page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const redirectMock = redirect as jest.Mock;

/**
 * What it does:
 * Call the page component with optional search params.
 * Why it exists:
 * Keeps redirect tests focused on the redirect behavior.
 *
 * @param searchParams - Optional query params to pass to the component.
 * @returns Void; invokes the component function.
 *
 * @throws None.
 * @sideEffects Calls the mocked redirect function.
 *
 * Edge cases:
 * - Uses undefined when no params are supplied.
 */
const callPage = (searchParams?: {
  title?: string;
  familyId?: string;
  familyCode?: string;
}): void => {
  NewFamilyPage({ searchParams });
};

describe("newFamily redirect", () => {
  beforeEach(() => {
    redirectMock.mockClear();
  });

  test("builds a base redirect when no params exist", () => {
    expect(buildFamilyFmeaRedirectUrl()).toBe("/family-fmea");
  });

  test("builds a redirect including the title param", () => {
    expect(buildFamilyFmeaRedirectUrl({ title: "M52" })).toBe(
      "/family-fmea?title=M52"
    );
  });

  test("redirects to the family-fmea route with the title param", () => {
    callPage({ title: "M52" });

    expect(redirectMock).toHaveBeenCalledWith("/family-fmea?title=M52");
  });

  test("redirects with multiple legacy params", () => {
    callPage({ title: "M90", familyId: "fam-1", familyCode: "F90" });

    expect(redirectMock).toHaveBeenCalledWith(
      "/family-fmea?title=M90&familyId=fam-1&familyCode=F90"
    );
  });
});
