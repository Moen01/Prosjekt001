import { NextResponse } from "next/server";
import { loginRequestSchema } from "@lib/validators/auth";
import type { LoginResponse } from "@lib/types/auth";

export async function POST(request: Request) {
  const payload = await request.json();
  const parseResult = loginRequestSchema.safeParse(payload);

  if (!parseResult.success) {
    return NextResponse.json<LoginResponse>(
      {
        success: false,
        message: parseResult.error.issues[0]?.message ?? "Invalid input",
      },
      { status: 400 }
    );
  }

  const { username, password } = parseResult.data;

  if (username !== "admin" || password !== "password") {
    return NextResponse.json<LoginResponse>(
      {
        success: false,
        message: "Incorrect username or password",
      },
      { status: 401 }
    );
  }

  return NextResponse.json<LoginResponse>({
    success: true,
    redirectPath: "/ProjectManagment",
    message: "Signed in",
  });
}
