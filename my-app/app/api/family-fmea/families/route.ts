import { NextResponse } from "next/server";
import { getFamilyList } from "../mock-data";

// GET /api/family-fmea/families
export async function GET() {
  return NextResponse.json(getFamilyList());
}
