import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/connect";
import bcrypt from "bcrypt";

export async function POST(req:NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({
      where: { email },
      select: { email: true, password: true, id: true, role: true },
    });

    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const compPassword = await bcrypt.compare(password, user.password);

    if (!compPassword) {
      console.log("Invalid password for user:", email);
      return NextResponse.json({ success: false, message: "invalid password" });
    }
    return NextResponse.json({
      success: true,
      message: "Login Successfully",
      data: {
        email: user.email,
        id: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
