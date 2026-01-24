import { prisma } from '$lib/db.js';
import { authKit } from '@workos/authkit-sveltekit';


export const load = authKit.withAuth(async ({ auth }) => {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { id: "asc" }, where: { active: true }, include: { notes: true } });
    return { customers, user: auth.user };
  } catch (err) {
    console.error("Error fetching customers:", err);
    return { customers: [], user: auth.user }
  }
})