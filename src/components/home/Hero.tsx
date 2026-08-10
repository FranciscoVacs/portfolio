import Image from "next/image";
import { useLocale } from "next-intl";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/schema";

export function Hero() {
  const locale = useLocale() as Locale;

  return (
    <div className="flex flex-col gap-5 pt-14 sm:flex-row sm:items-center">
      {profile.avatar ? (
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={96}
          height={110}
          className="h-[110px] w-24 rounded-md border border-border object-cover"
          priority
        />
      ) : null}
      <div>
        <h1 className="font-semibold text-2xl text-primary tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-1 text-foreground">{profile.headline[locale]}</p>
        <p className="mt-1 text-foreground text-sm">{profile.location}</p>
      </div>
    </div>
  );
}
