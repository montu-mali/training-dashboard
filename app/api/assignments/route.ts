import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/connect";
import { decrypt } from "@/lib/data-fetching";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const traineeTokan = url.searchParams.get("traineeId") as string;
    const instructorId = url.searchParams.get("instructorId");
    const traineeId = decrypt(traineeTokan);
    let assignments;

    if (traineeId) {
      // assignments = await db.assignment.findMany({ where: { traineeId } });
      const TaineeAssignments = await db.assignment.findMany({
        where: { traineeId },
      });

      if (TaineeAssignments.length === 0) {
        return NextResponse.json({ data: [] }); // No assignments
      }

      const moduleIds = TaineeAssignments.map((a) => a.moduleId);

      const modules = await db.module.findMany({
        where: { id: { in: moduleIds } },
      });

      assignments = TaineeAssignments.map((assignment) => {
        const module = modules.find((m) => m.id === assignment.moduleId);

        return {
          assignmentId: assignment.id,
          moduleId: assignment.moduleId,
          status: assignment.status,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt,
          // Add whatever fields you want
          title: module?.title,
          description: module?.description,
          content: module?.content,
          estimatedDuration: module?.estimatedDuration,
        };
      });
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

export async function PUT(req: Request) {
  try {
    const { assignmentId, status } = await req.json();

    if (!assignmentId || status !== "COMPLETED") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const completeAssign = await db.assignment.update({
      where: { id: assignmentId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    );
  }
}
