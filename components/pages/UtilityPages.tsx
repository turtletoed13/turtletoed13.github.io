"use client";

import { ArrowRight, Bookmark, BookmarkCheck, Clock3, Download, History, Settings, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export function HistoryPage({ items, onOpen }: { items: string[]; onOpen: (url: string) => void }) {
  return <Shell icon={History} kicker="BROWSER" title="History" description="Local browsing history until the game identity layer exists.">{items.length ? items.map((url, i) => <button className="utility-row" key={url+i} onClick={() => onOpen(url)}><Clock3 size={15}/><span><strong>{url}</strong><small>Recent NOLINE visit</small></span><ArrowRight size={13}/></button>) : <Empty icon={History} title="Nothing here yet." body="Visit NOLINE services and they will appear here."/>}</Shell>;
}

export function BookmarksPage({ items, onOpen }: { items: string[]; onOpen: (id: string) => void }) {
  return <Shell icon={Bookmark} kicker="BROWSER" title="Bookmarks" description="Saved catalog items. They stay local until profile sync is connected.">{items.length ? items.map((id) => <button className="utility-row" key={id} onClick={() => onOpen(id)}><BookmarkCheck size={15}/><span><strong>{id}</strong><small>Saved vehicle</small></span><ArrowRight size={13}/></button>) : <Empty icon={Bookmark} title="No bookmarks." body="Bookmark a vehicle from its inspection page."/>}</Shell>;
}

export function DownloadsPage() {
  return <Shell icon={Download} kicker="BROWSER" title="Downloads" description="Native surface for future receipts, documents and game-generated files."><Empty title="Your downloads are empty." body="Receipts and exported files can appear here later."/></Shell>;
}

export function SettingsPage({ settings, setSettings }: { settings: { motion: boolean; glass: boolean; compact: boolean }; setSettings: Dispatch<SetStateAction<{ motion: boolean; glass: boolean; compact: boolean }>> }) {
  return <Shell icon={Settings} kicker="BROWSER" title="Settings" description="Presentation preferences are local today and can become profile-backed later."><div className="settings-card"><Setting title="Motion" detail="Smooth transitions, modal reveals and purchase feedback." enabled={settings.motion} onClick={() => setSettings((s) => ({...s,motion:!s.motion}))}/><Setting title="Liquid glass" detail="Translucent browser chrome and layered panels." enabled={settings.glass} onClick={() => setSettings((s) => ({...s,glass:!s.glass}))}/><Setting title="Compact mode" detail="Tighter spacing for smaller displays." enabled={settings.compact} onClick={() => setSettings((s) => ({...s,compact:!s.compact}))}/><div className="settings-note"><ShieldCheck size={14}/> No account system is connected. Preferences remain local.</div></div></Shell>;
}

function Shell({ icon: Icon, kicker, title, description, children }: { icon: LucideIcon; kicker: string; title: string; description: string; children: ReactNode }) {
  return <div className="page"><div className="page-head"><span className="kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div><div className="utility-card"><div className="utility-icon"><Icon size={18}/></div>{children}</div></div>;
}

function Empty({ icon: Icon = Download, title, body }: { icon?: LucideIcon; title: string; body: string }) {
  return <div className="empty"><span><Icon size={21}/></span><h3>{title}</h3><p>{body}</p></div>;
}

function Setting({ title, detail, enabled, onClick }: { title: string; detail: string; enabled: boolean; onClick: () => void }) {
  return <div className="setting"><div><strong>{title}</strong><p>{detail}</p></div><button className={`switch ${enabled ? "on" : ""}`} onClick={onClick} aria-label={`${title}: ${enabled ? "on" : "off"}`}><span/></button></div>;
}


export function DiagnosticsPage() {
  return <div className="page"><div className="page-head"><span className="kicker">NOLINE / INTERNAL</span><h1>Diagnostics</h1><p>Browser-side status before the game integration exists.</p></div><div className="diag-grid"><Diag label="Browser shell" value="Operational"/><Diag label="Local storage" value="Available"/><Diag label="Account service" value="Not connected"/><Diag label="Game bridge" value="Awaiting game"/><Diag label="Catalog" value="5 vehicles / 11 services"/><Diag label="Checkout" value="Adapter ready"/></div><div className="diag-log"><div><span/> UI initialized</div><div><span/> Identity intentionally disabled</div><div><span/> Local persistence enabled</div><div><span/> Purchase boundary active</div></div></div>;
}
function Diag({ label, value }: { label: string; value: string }) { return <div className="diag"><span>{label}</span><strong>{value}</strong><small className={value === "Operational" || value === "Available" || value === "Adapter ready" ? "good" : ""}>{value === "Operational" || value === "Available" || value === "Adapter ready" ? "READY" : "STATUS"}</small></div>; }
