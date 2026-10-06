"use client";

import { Check, Code2, Database, Gamepad2, Settings2, ShieldCheck } from "lucide-react";
import { nolineConfig } from "../../config/noline.config";

export function ConfigBrowserPage() {
  const rows = [
    ["Command trigger", nolineConfig.brand.commandTrigger],
    ["Protocol", nolineConfig.brand.protocol],
    ["Default route", nolineConfig.browser.defaultRoute],
    ["Currency", nolineConfig.commerce.currency],
    ["Accounts", nolineConfig.commerce.accountRequired ? "Required" : "Disabled"],
    ["Purchase authority", nolineConfig.commerce.authoritativeOwner],
    ["Purchase boundary", nolineConfig.commerce.purchaseBoundary],
    ["Game bridge", nolineConfig.integration.bridgeKey],
  ];
  return <div className="page"><div className="page-head"><span className="kicker">NOLINE / CONFIG</span><h1>The browser, exposed.</h1><p>Configuration stays isolated from UI, pages and catalog data. Change behavior here or in <code>config/noline.config.ts</code> without rewriting the browser.</p></div><div className="config-hero"><div><Settings2 size={18}/><strong>Plug-and-play by design.</strong><span>Identity, inventory and wallet systems can be attached later.</span></div><div><ShieldCheck size={18}/><strong>Game-authoritative.</strong><span>The browser never decides ownership or currency.</span></div></div><div className="config-table">{rows.map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong><Check size={14}/></div>)}</div><div className="config-modules"><span><Code2 size={15}/> Catalog data</span><span><Database size={15}/> Local persistence</span><span><Gamepad2 size={15}/> Game bridge ready</span></div></div>;
}
