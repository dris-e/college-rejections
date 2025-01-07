import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex absolute bottom-0 flex-row w-full justify-between items-center gap-4 overflow-hidden p-4">
      <Link href="https://dris.one" target="_blank">
        <p className="text-sm text-muted-foreground font-bold">By Dris</p>
      </Link>
      <Link href="https://github.com/dris-e/college-rejections" target="_blank">
        <p className="text-sm text-muted-foreground font-bold">Github (OSS)</p>
      </Link>
    </footer>
  );
}
