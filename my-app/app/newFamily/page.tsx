import { redirect } from "next/navigation";

/**
 * Search params accepted by the legacy newFamily route.
 */
interface NewFamilySearchParams {
  /** Optional family title to pass through to the Family FMEA page. */
  title?: string;
  /** Optional family identifier to pass through to the Family FMEA page. */
  familyId?: string;
  /** Optional family code to pass through to the Family FMEA page. */
  familyCode?: string;
}

/**
 * Props for the legacy newFamily redirect page.
 */
interface NewFamilyPageProps {
  /** Query string parameters forwarded to the new Family FMEA route. */
  searchParams?: NewFamilySearchParams;
}

/**
 * What it does:
 * Build a redirect URL from legacy newFamily query parameters.
 * Why it exists:
 * Keeps existing links working after the newFamily route was removed.
 *
 * @param searchParams - Optional query params from the legacy route.
 * @returns A URL string for the new Family FMEA route.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Returns the base route when no params are provided.
 */
const buildFamilyFmeaRedirectUrl = (
  searchParams?: NewFamilySearchParams
): string => {
  const params = new URLSearchParams();

  if (searchParams?.title) {
    params.set("title", searchParams.title);
  }
  if (searchParams?.familyId) {
    params.set("familyId", searchParams.familyId);
  }
  if (searchParams?.familyCode) {
    params.set("familyCode", searchParams.familyCode);
  }

  const query = params.toString();
  return query.length > 0 ? `/family-fmea?${query}` : "/family-fmea";
};

/**
 * Responsibility:
 * Redirect legacy /newFamily requests to /family-fmea.
 * Props:
 * - searchParams: legacy query values to forward.
 * State:
 * - none.
 * Side effects:
 * - Uses Next.js redirect to navigate on the server.
 * Rendering states:
 * - loading: n/a.
 * - error: n/a.
 * - empty: n/a.
 * - success: performs redirect.
 */
export default function NewFamilyPage({ searchParams }: NewFamilyPageProps) {
  redirect(buildFamilyFmeaRedirectUrl(searchParams));
}

export { buildFamilyFmeaRedirectUrl };
