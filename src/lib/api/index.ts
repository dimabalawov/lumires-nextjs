// Barrel for the Lumires API client. Import from "@/lib/api".
export * from "./client";
export * from "./films";
export * from "./reviews";
export * from "./lists";
export * from "./genres";
export * from "./directors";
export * from "../auth/server";
// Back-compat alias.
export { getMovie } from "./movies";
