import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, RequestEvent } from "./$types";

export const load: PageServerLoad = (event: RequestEvent) => {
  console.log(event.locals.session);
  if (event.locals.session == null) {
    return redirect(302, '/login');
  }
}