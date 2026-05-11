"use client";

import "next-cloudinary/dist/cld-video-player.css";
import { CldVideoPlayer } from "@/lib/cld-client";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { hasCloudinary } from "@/lib/cloudinary";
import { hero } from "@/lib/media";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      aria-label={`Welcome to ${site.name}`}
      className="relative isolate flex h-dvh min-h-[640px] w-full items-end overflow-hidden bg-navy-900"
    >
      <div className="absolute inset-0 -z-10">
        {hasCloudinary ? (
          <div className="absolute inset-0 [&_.video-js]:!h-full [&_.video-js]:!w-full [&_video]:!h-full [&_video]:!w-full [&_video]:!object-cover">
            <CldVideoPlayer
              src={hero.publicId}
              poster={hero.posterPublicId}
              width="1920"
              height="1080"
              autoplay="always"
              muted
              loop
              controls={false}
              pictureInPictureToggle={false}
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-navy-700 via-navy-900 to-deep"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-deep/30 via-transparent to-deep/70"
        />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-24 pt-40 sm:px-10 sm:pb-32">
        <p className="text-xs uppercase tracking-[0.5em] text-foam/80">
          Port Mouton · Nova Scotia
        </p>
        <h1 className="font-display text-display-2xl leading-[0.95] text-foam">
          {site.name}
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-foam/90 sm:text-xl">
          {site.tagline}.
        </p>
      </div>

      <ScrollIndicator />
    </section>
  );
}
