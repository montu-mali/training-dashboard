import { NextResponse } from "next/server";
import { db } from "@/db/connect";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login Successful",
      data: {
        email: user.email,
        id: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}