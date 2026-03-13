/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents_devotionOrchestrator from "../agents/devotionOrchestrator.js";
import type * as agents_explanationAgent from "../agents/explanationAgent.js";
import type * as agents_prayerAgent from "../agents/prayerAgent.js";
import type * as agents_reflectionAgent from "../agents/reflectionAgent.js";
import type * as agents_scriptureAgent from "../agents/scriptureAgent.js";
import type * as agents_vettingAgent from "../agents/vettingAgent.js";
import type * as crons from "../crons.js";
import type * as devotions from "../devotions.js";
import type * as lib_grok from "../lib/grok.js";
import type * as lib_groq from "../lib/groq.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agents/devotionOrchestrator": typeof agents_devotionOrchestrator;
  "agents/explanationAgent": typeof agents_explanationAgent;
  "agents/prayerAgent": typeof agents_prayerAgent;
  "agents/reflectionAgent": typeof agents_reflectionAgent;
  "agents/scriptureAgent": typeof agents_scriptureAgent;
  "agents/vettingAgent": typeof agents_vettingAgent;
  crons: typeof crons;
  devotions: typeof devotions;
  "lib/grok": typeof lib_grok;
  "lib/groq": typeof lib_groq;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
