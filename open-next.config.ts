import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * No overrides.
 *
 * The getting-started guide wires an R2 incremental cache in here. That exists
 * for ISR and on-demand revalidation; this site prerenders all ten routes at
 * build time with `dynamicParams = false` and revalidates nothing, so the cache
 * would sit empty while adding a paid storage binding to the deployment.
 *
 * If a route is ever made dynamic — a live availability feed, say — this is the
 * file that has to change with it.
 */
export default defineCloudflareConfig();
