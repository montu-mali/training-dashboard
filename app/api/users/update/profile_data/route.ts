import { db } from "@/db/connect";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { email, userId, name } = await req.json();

    // Find if another user (not the one being updated) has this email
    const existingUser = await db.user.findFirst({
      where: {
        email,
        id: {
          not: userId,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", success: false },
        { status: 400 }
      );
    }

    // Proceed with update
    const userData = await db.user.update({
      where: { id: userId },
      data: { email, name },
    });

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile", success: false },
      { status: 500 }
    );
  }
}
