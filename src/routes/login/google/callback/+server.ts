import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/auth";
import { google } from "$lib/googleauth";
import { decodeIdToken } from "arctic";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { prisma } from "$lib/db";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";


export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = event.cookies.get('google_oauth_state');
  const codeVerifier = event.cookies.get("google_code_verifier");
  if (code === null || state === null || storedState === null || codeVerifier === null) { return new Response(null, { status: 400 }); }
  if (state !== storedState) {
    return new Response(null, { status: 400 });
  }
}