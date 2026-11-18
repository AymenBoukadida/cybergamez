const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
const fallback = vercelHost ? `https://${vercelHost}` : "http://localhost:3000";

export const siteUrl = (configured || fallback).replace(/\/$/, "");
