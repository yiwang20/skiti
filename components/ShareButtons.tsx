"use client";

import { useState } from "react";

interface Props {
  personalityName: string;
}

export default function ShareButtons({ personalityName }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const cardEl = document.getElementById("share-card");
    if (!cardEl) return;
    const canvas = await html2canvas(cardEl, { scale: 2 });
    const link = document.createElement("a");
    link.download = `skti-${personalityName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopyLink}
        className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] transition-colors"
      >
        {copied ? "已复制" : "复制链接"}
      </button>
      <button
        onClick={handleDownloadCard}
        className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] transition-colors"
      >
        下载分享卡
      </button>
    </div>
  );
}
