import { type NextRequest, NextResponse } from "next/server";
import { users } from "@/src/lib/database";
import { db } from "@/db/connect";
import { decrypt } from "@/src/lib/data-fetching";
import { Role } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userTokan = url.searchParams.get("profileTokanId") as string;
    const userId = decrypt(userTokan);
    const role = url.searchParams.get("role") as string;
    if (userId) {
      const userData = await db.user.findFirst({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!userData) {
        return NextResponse.json({ error: "Something Wrong" }, { status: 404 });
      }

      return NextResponse.json(userData);
    }
    if (role) {
      const userData = await db.user.findMany({
        where: { role: role as Role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          Assignment:true
        },
      });
      if (!userData) {
        return NextResponse.json({ error: "Something Wrong" }, { status: 404 });
      }

      return NextResponse.json(userData);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, currentPassword, newPassword } =
      await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[userIndex];

    // Update profile information
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided
    if (newPassword) {
      if (!currentPassword || user.password !== currentPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
      user.password = newPassword;
    }

    // Remove password from response
    const { password, ...safeUser } = user;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
