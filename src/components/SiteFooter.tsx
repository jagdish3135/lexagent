"use client";
import { useLang } from "@/lib/i18n";
import { KNIT_BADGE_HTML } from "./knit-badge-html";
import { LogoMark } from "./Logo";

const BADGE = KNIT_BADGE_HTML.replace('class="bwk"', 'class="bwk" data-align="right"');

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="foot-mark">
          <LogoMark size={28} />
          <span>{t("footer.note")}</span>
        </p>
        <div dangerouslySetInnerHTML={{ __html: BADGE }} />
      </div>
    </footer>
  );
}
