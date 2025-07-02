import { type NextRequest, NextResponse } from "next/server";
import { modules, assignments } from "@/lib/database";
import type { Module } from "@/lib/types";
import { db } from "@/db/connect";
import { decrypt } from "@/lib/data-fetching";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const instructorTokan = url.searchParams.get("instructorId") as string;
    const instructorId = decrypt(instructorTokan);
    if (instructorId) {
      const instructorModules = await db.module.findMany({
        where: { instructorId },
      });
      return NextResponse.json({
        success: true,
        instructorModules,
      });
    }

    const instructorModules = await db.module.findMany({});

    return NextResponse.json({ success: true, instructorModules });
  } catch (error) {
    console.error("Get modules error:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const url = new URL(req.url);
    const instructorId = url.searchParams.get("instructorId") as string;

    if (
      !data.title ||
      !data.description ||
      !data.content ||
      !instructorId ||
      !data.estimatedDuration
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newModule = {
      title: data.title,
      description: data.description,
      content: data.content,
      instructorId,
      estimatedDuration: data.estimatedDuration,
    };

    const response = await db.module.create({
      data: newModule,
    });

    return NextResponse.json({ success: true, module: response });
  } catch (error) {
    console.error("Create module error:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, content } = await request.json();

    if (!id || !title || !description || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const moduleIndex = modules.findIndex((module) => module.id === id);
    if (moduleIndex === -1) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    modules[moduleIndex] = {
      ...modules[moduleIndex],
      title,
      description,
      content,
    };

    return NextResponse.json({ success: true, module: modules[moduleIndex] });
  } catch (error) {
    console.error("Update module error:", error);
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const moduleId = url.searchParams.get("id");

    if (!moduleId) {
      return NextResponse.json(
        { error: "Module ID is required" },
        { status: 400 }
      );
    }

    const moduleIndex = modules.findIndex((module) => module.id === moduleId);
    if (moduleIndex === -1) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Remove module
    modules.splice(moduleIndex, 1);

    // Remove related assignments
    const assignmentIndices = assignments
      .map((assignment, index) =>
        assignment.moduleId === moduleId ? index : -1
      )
      .filter((index) => index !== -1)
      .reverse();

    assignmentIndices.forEach((index) => assignments.splice(index, 1));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete module error:", error);
    return NextResponse.json(
      { error: "Failed to delete module" },
      { status: 500 }
    );
  }
}
