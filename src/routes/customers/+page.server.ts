import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session == null) { return redirect(302, "/login"); }

  try {
    const customers = await prisma.customer.findMany({ orderBy: { id: "asc" } });
    return { customers };
  } catch (err) {
    console.error("Error fetching customers:", err);
    return { customers: [] };
  }
}