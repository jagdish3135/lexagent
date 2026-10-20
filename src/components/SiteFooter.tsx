import { KNIT_BADGE_HTML } from "./knit-badge-html";
import { LogoMark } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark size={24} />
          <span>LexAgent assists understanding. It is not legal advice and does not replace an advocate or a court.</span>
        </p>
        <div dangerouslySetInnerHTML={{ __html: KNIT_BADGE_HTML.replace('class="bwk"', 'class="bwk" data-align="right"') }} />
      </div>
    </footer>
  );
}
