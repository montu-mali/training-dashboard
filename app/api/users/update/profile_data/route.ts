import { db } from "@/db/connect";
import { decrypt } from "@/lib/data-fetching";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { email, userId, name } = await req.json();

    const existingUser = await db.user.findFirst({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", success: false },
        { status: 400 }
      );
    }

    if (!existingUser) {
      const userData = await db.user.update({
        where: { id: userId },
        data: { email, name },
      });

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error Update user profile:", error);
    return NextResponse.json(
      { error: "Failed to Update user profile", success: false },
      { status: 500 }
    );
  }
}
