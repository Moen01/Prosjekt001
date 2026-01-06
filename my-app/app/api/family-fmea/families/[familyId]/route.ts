import { NextResponse } from "next/server";
import { getFamilyOverview } from "../../mock-data";

interface RouteContext {
  params: { familyId: string };
}

// GET /api/family-fmea/families/:familyId
export async function GET(_request: Request, context: RouteContext) {
  const { familyId } = context.params;
  return NextResponse.json(getFamilyOverview(familyId));
}
