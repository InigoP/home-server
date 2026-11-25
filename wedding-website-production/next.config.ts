import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Keep page segments in the client-side Router Cache for longer so
    // navigations after an idle period don't re-fetch and flash. Default
    // for `dynamic` is 0s, which causes the pre-transition "flush."
    staleTimes: {
      dynamic: 3600,
      static: 3600,
    },
  },
};

export default nextConfig;
