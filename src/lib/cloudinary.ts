/**
 * Cloudinary configuration shared across components.
 * The cloud name comes from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME — see .env.example.
 * If unset, components that reference Cloudinary assets will render their
 * fallback states (skeleton or gradient).
 */

export const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export const hasCloudinary =
  cloudName.length > 0 && cloudName !== "your-cloud-name";
