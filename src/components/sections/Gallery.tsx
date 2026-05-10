"use client";

import { CldImage, getCldImageUrl } from "@/lib/cld-client";
import { useState } from "react";
import {
  RowsPhotoAlbum,
  type RenderImageContext,
  type RenderImageProps,
} from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hasCloudinary } from "@/lib/cloudinary";
import { gallery, type Photo } from "@/lib/media";

interface AlbumPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  publicId: string;
}

const sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw";

function toAlbumPhoto(photo: Photo): AlbumPhoto {
  const src = hasCloudinary
    ? getCldImageUrl({ src: photo.publicId, width: photo.width })
    : `https://placehold.co/${photo.width}x${photo.height}/e3d8c3/2c5562?text=${encodeURIComponent(photo.alt)}`;

  return {
    src,
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
    publicId: photo.publicId,
  };
}

function renderCldImage(
  imageProps: RenderImageProps,
  context: RenderImageContext<AlbumPhoto>,
) {
  const { style, alt, onClick } = imageProps;
  const { photo } = context;

  if (hasCloudinary) {
    return (
      <CldImage
        src={photo.publicId}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        style={style}
        onClick={onClick}
        className="cursor-pointer transition-opacity duration-300 hover:opacity-90"
      />
    );
  }

  return (
    <img
      src={photo.src}
      alt={alt ?? photo.alt}
      width={photo.width}
      height={photo.height}
      style={style}
      onClick={onClick}
      className="cursor-pointer object-cover transition-opacity duration-300 hover:opacity-90"
    />
  );
}

export function Gallery() {
  const photos = gallery.map(toAlbumPhoto);
  const [index, setIndex] = useState<number>(-1);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-sand-50 py-28 sm:py-40"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 sm:px-10">
        <SectionHeading
          id="gallery-heading"
          eyebrow="Gallery"
          title="The cottage, room by room and out to the water"
          description="Tap any photo to view it full-screen. Use the arrow keys to move through the set."
        />

        <RowsPhotoAlbum
          photos={photos}
          targetRowHeight={320}
          spacing={12}
          render={{ image: renderCldImage }}
          onClick={({ index: clicked }) => setIndex(clicked)}
        />

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={photos.map((photo) => ({
            src: photo.src,
            alt: photo.alt,
            width: photo.width,
            height: photo.height,
          }))}
          controller={{ closeOnBackdropClick: true }}
        />
      </div>
    </section>
  );
}
