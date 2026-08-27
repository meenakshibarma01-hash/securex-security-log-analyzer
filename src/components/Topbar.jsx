import React from "react";
import { Search, Bell, CircleUserRound } from "lucide-react";
export default function Topbar({title,subtitle,user,onSearch}) {
 return <header className="topbar">
   <div><h1>{title}</h1><p>{subtitle}</p></div>
   <div className="top-actions"><div className="top-search"><Search size={16}/><input placeholder="Search logs..." onChange={e=>onSearch?.(e.target.value)}/></div><div className="live-pill"><span className="pulse"></span> LIVE</div><Bell size={19} className="icon-btn"/><div className="user-chip"><CircleUserRound size={28}/><span>{user || "Analyst"}</span></div></div>
 </header>;
}