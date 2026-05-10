"use client";

// next-cloudinary doesn't include "use client" in its built output, so we
// re-export from a marked module to create a clean client boundary for the
// components that need to render hooks (useState, useCallback) during SSR.
export { CldImage, CldVideoPlayer, getCldImageUrl } from "next-cloudinary";
