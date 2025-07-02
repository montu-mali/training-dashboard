import { type NextRequest, NextResponse } from "next/server";
import { assignments } from "@/lib/database";
import type { Assignment } from "@/lib/types";
import { db } from "@/db/connect";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const traineeId = url.searchParams.get("traineeId");
    const instructorId = url.searchParams.get("instructorId");

    let assignments;

    if (traineeId) {
      assignments = await db.assignment.findMany({ where: { traineeId } });
    } else if (instructorId) {
      assignments = await db.assignment.findMany({ where: { instructorId } });
    }

    return NextResponse.json({ success: true, assignments });
  } catch (error) {
    console.error("Get assignments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { moduleIds, traineeId, instructorId } = await request.json();

    // Basic validation
    if (
      !Array.isArray(moduleIds) ||
      moduleIds.length === 0 ||
      moduleIds.some((id) => !id) ||
      !traineeId ||
      !instructorId
    ) {
      return NextResponse.json(
        { error: "Invalid assignment data" },
        { status: 400 }
      );
    }

    // 1. Get existing assignments for this trainee
    const existingAssignments = await db.assignment.findMany({
      where: {
        traineeId: String(traineeId),
      },
      select: {
        moduleId: true,
      },
    });

    const existingModuleIds = existingAssignments.map((a) => a.moduleId);

    // 2. Find moduleIds to remove (those in DB but not in new list)
    const moduleIdsToRemove = existingModuleIds.filter(
      (id) => !moduleIds.includes(id)
    );

    // 3. Delete the ones that should be removed
    if (moduleIdsToRemove.length > 0) {
      await db.assignment.deleteMany({
        where: {
          traineeId: String(traineeId),
          moduleId: { in: moduleIdsToRemove },
        },
      });
    }

    // 4. Find moduleIds to add (those in new list but not already in DB)
    const moduleIdsToAdd = moduleIds.filter(
      (id: string) => !existingModuleIds.includes(id)
    );

    const newAssignments = moduleIdsToAdd.map((moduleId: string) => ({
      moduleId: String(moduleId),
      traineeId: String(traineeId),
      instructorId: String(instructorId),
    }));

    // 5. Create new assignments
    if (newAssignments.length > 0) {
      await db.assignment.createMany({
        data: newAssignments,
      });
    }

    return NextResponse.json({
      success: true,
      added: newAssignments.length,
      removed: moduleIdsToRemove.length,
      assignments: newAssignments,
    });
  } catch (error) {
    console.error("Create assignments error:", error);
    return NextResponse.json(
      { error: "Failed to update assignments" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { assignmentId, isCompleted } = await request.json();

    if (!assignmentId || typeof isCompleted !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const assignmentIndex = assignments.findIndex(
      (assignment) => assignment.id === assignmentId
    );
    if (assignmentIndex === -1) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    assignments[assignmentIndex].isCompleted = isCompleted;
    if (isCompleted) {
      assignments[assignmentIndex].completedAt = new Date();
    } else {
      delete assignments[assignmentIndex].completedAt;
    }

    return NextResponse.json({
      success: true,
      assignment: assignments[assignmentIndex],
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    );
  }
}

// const incomingVariantIds = variants
//     .filter((v: Variant) => v.id)
//     .map((v: Variant) => v.id as string);

//   // Delete removed variants
//   await db.variants.deleteMany({
//     where: {
//       productId: productId,
//       NOT: {
//         id: { in: incomingVariantIds },
//       },
//     },
//   });
