import { db } from "@/db/connect";
import { decrypt } from "@/src/lib/data-fetching";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { userTokan, password, newPassword } = await req.json();

    const userId = decrypt(userTokan);

    const checkUser = await db.user.findFirst({
      where: { id: userId },
      select: { password: true, id: true },
    });

    if (checkUser) {
      const compPassword = await bcrypt.compare(password, checkUser?.password);
      if (!compPassword) {
        return NextResponse.json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (compPassword) {
        const newPasswords = await bcrypt.hash(newPassword, 10);
        const changePass = await db.user.update({
          where: { id: checkUser.id },
          data: { password: newPasswords },
        });

        return NextResponse.json({
          success: true,
          message: "Password changed successfully",
        });
      }
    }
  } catch (err) {
    console.error("Error changing password:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
