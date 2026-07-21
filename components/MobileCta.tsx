"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`mobile-fixed-cta ${visible ? "visible" : ""}`}>
      <Link className="button" href="/diagnostico">
        Descobrir meu ponto de virada <ArrowRight size={18} />
      </Link>
    </div>
  );
}
