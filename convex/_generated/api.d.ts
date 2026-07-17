/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents_composerAgent from "../agents/composerAgent.js";
import type * as agents_conversationAgent from "../agents/conversationAgent.js";
import type * as agents_devotionOrchestrator from "../agents/devotionOrchestrator.js";
import type * as agents_explanationAgent from "../agents/explanationAgent.js";
import type * as agents_prayerAgent from "../agents/prayerAgent.js";
import type * as agents_reflectionAgent from "../agents/reflectionAgent.js";
import type * as agents_retrievalAgent from "../agents/retrievalAgent.js";
import type * as agents_scriptureAgent from "../agents/scriptureAgent.js";
import type * as agents_theologyAgent from "../agents/theologyAgent.js";
import type * as agents_verificationAgent from "../agents/verificationAgent.js";
import type * as agents_vettingAgent from "../agents/vettingAgent.js";
import type * as chats from "../chats.js";
import type * as crons from "../crons.js";
import type * as devotions from "../devotions.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as ingestion from "../ingestion.js";
import type * as ingestion_chunker from "../ingestion/chunker.js";
import type * as ingestion_embedder from "../ingestion/embedder.js";
import type * as ingestion_pdfParser from "../ingestion/pdfParser.js";
import type * as lib_embeddings from "../lib/embeddings.js";
import type * as lib_grok from "../lib/grok.js";
import type * as lib_groq from "../lib/groq.js";
import type * as messages from "../messages.js";
import type * as pushNotifications from "../pushNotifications.js";
import type * as pushSubscriptions from "../pushSubscriptions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agents/composerAgent": typeof agents_composerAgent;
  "agents/conversationAgent": typeof agents_conversationAgent;
  "agents/devotionOrchestrator": typeof agents_devotionOrchestrator;
  "agents/explanationAgent": typeof agents_explanationAgent;
  "agents/prayerAgent": typeof agents_prayerAgent;
  "agents/reflectionAgent": typeof agents_reflectionAgent;
  "agents/retrievalAgent": typeof agents_retrievalAgent;
  "agents/scriptureAgent": typeof agents_scriptureAgent;
  "agents/theologyAgent": typeof agents_theologyAgent;
  "agents/verificationAgent": typeof agents_verificationAgent;
  "agents/vettingAgent": typeof agents_vettingAgent;
  chats: typeof chats;
  crons: typeof crons;
  devotions: typeof devotions;
  documents: typeof documents;
  http: typeof http;
  ingestion: typeof ingestion;
  "ingestion/chunker": typeof ingestion_chunker;
  "ingestion/embedder": typeof ingestion_embedder;
  "ingestion/pdfParser": typeof ingestion_pdfParser;
  "lib/embeddings": typeof lib_embeddings;
  "lib/grok": typeof lib_grok;
  "lib/groq": typeof lib_groq;
  messages: typeof messages;
  pushNotifications: typeof pushNotifications;
  pushSubscriptions: typeof pushSubscriptions;
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
