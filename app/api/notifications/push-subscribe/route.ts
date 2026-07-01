import { requireAuth } from "@/app/lib/auth";
import {
  removePushSubscription,
  savePushSubscription,
} from "@/app/lib/notifications/push";
import type { PushSubscription } from "web-push";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await requireAuth();

  try {
    const subscription = (await request.json()) as PushSubscription;
    await savePushSubscription(user.uid, subscription);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save push subscription:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const user = await requireAuth();

  try {
    const { endpoint } = await request.json();
    await removePushSubscription(user.uid, endpoint);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove push subscription:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
