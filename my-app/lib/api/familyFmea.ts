// Client helpers for the Family FMEA mock API (swap with real backend later).

import type { Family, FamilyFmeaOverview } from "@lib/types/familyFmea";

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function fetchFamilies(): Promise<Family[]> {
  return requestJson<Family[]>("/api/family-fmea/families", {
    cache: "no-store",
  });
}

export async function fetchFamilyOverview(
  familyId: string
): Promise<FamilyFmeaOverview> {
  return requestJson<FamilyFmeaOverview>(
    `/api/family-fmea/families/${familyId}`,
    { cache: "no-store" }
  );
}
