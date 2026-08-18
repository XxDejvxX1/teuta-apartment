import { describe, expect, it, vi } from "vitest";

import worker from "./index";

/**
 * The Worker's only job is the 301 from the retired `/en/*` URLs, which is what
 * carries the live site's search ranking to the new root-level ones. It is worth
 * a test precisely because it is easy to leave working "well enough" — a 302
 * instead of a 301, or a prefix match that eats `/energy`, both look fine in a
 * browser and quietly cost rankings.
 */
function call(path: string) {
  const assets = { fetch: vi.fn(async () => new Response("asset", { status: 200 })) };
  const response = worker.fetch(
    new Request(`https://teuta-apartment.com${path}`),
    { ASSETS: assets },
  );
  return { response, assets };
}

async function redirect(path: string) {
  const { response, assets } = call(path);
  const result = await response;
  return {
    status: result.status,
    location: result.headers.get("location"),
    servedAsset: assets.fetch.mock.calls.length > 0,
  };
}

describe("legacy /en redirects", () => {
  it("sends /en to the root", async () => {
    const r = await redirect("/en");
    expect(r.status).toBe(301);
    expect(r.location).toBe("https://teuta-apartment.com/");
  });

  it("sends /en/ to the root", async () => {
    expect((await redirect("/en/")).location).toBe("https://teuta-apartment.com/");
  });

  it("keeps the rest of the path", async () => {
    expect((await redirect("/en/guide")).location).toBe(
      "https://teuta-apartment.com/guide",
    );
    expect((await redirect("/en/guide/day-trips")).location).toBe(
      "https://teuta-apartment.com/guide/day-trips",
    );
  });

  it("keeps the query string", async () => {
    expect((await redirect("/en/guide?from=whatsapp")).location).toBe(
      "https://teuta-apartment.com/guide?from=whatsapp",
    );
  });

  /**
   * 301, not 302 or 307. Only a permanent redirect passes ranking to the new
   * URL and gets the old one dropped from the index.
   */
  it("is permanent", async () => {
    expect((await redirect("/en")).status).toBe(301);
  });
});

describe("everything else is a static asset", () => {
  it("passes the real pages straight through", async () => {
    for (const path of ["/", "/guide", "/guide/day-trips", "/sitemap.xml"]) {
      const r = await redirect(path);
      expect(r.servedAsset, `${path} should be served, not redirected`).toBe(true);
      expect(r.status).toBe(200);
    }
  });

  /**
   * The prefix trap. `startsWith("/en")` would swallow any path that merely
   * begins with those two letters and redirect it somewhere that does not
   * exist — a guide slug like `english-in-durres` is not far-fetched.
   */
  it("does not eat paths that merely start with 'en'", async () => {
    for (const path of ["/energy", "/enclave", "/guide/english-signs"]) {
      const r = await redirect(path);
      expect(r.servedAsset, `${path} should not be redirected`).toBe(true);
    }
  });
});
