"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type BackProps = {
  href: string;
  label: string;
};

function BackButton({ href, label }: BackProps) {
  return (
    <Button asChild variant={"link"} className="font-medium w-full">
      <Link href={href} aria-label={label}>
        {label}
      </Link>
    </Button>
  );
}

export default BackButton;
