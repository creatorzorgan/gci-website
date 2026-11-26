import type { MetadataRoute } from "next";

/**
 * Charter Part V, 6.3: the portal is for human institutional review only.
 * Ask every crawler, search and AI-training bots included, to stay out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
