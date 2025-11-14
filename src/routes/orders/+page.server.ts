import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session == null) { return redirect(302, "/login"); }

  try {
    const orders = await prisma.order.findMany({ orderBy: { id: "asc"}, where: { createdBy: locals.session.userId } });
    return { orders };
  } catch (err) {
    console.error("Error fetching orders:", err);
    return { orders: [] };
  }
}