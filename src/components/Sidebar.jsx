import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Upload, List, Bell, Globe2, Users, FileText, Settings, Info, ShieldCheck } from "lucide-react";

const items = [
  ["dashboard","Dashboard",LayoutDashboard],
  ["upload","Upload Logs",Upload],
  ["logs","View Logs",List],
  ["alerts","Alerts",Bell],
  ["ip","IP Analysis",Globe2],
  ["users","User Activity",Users],
  ["reports","Reports",FileText],
];

export default function Sidebar({onLogout}) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-icon"><ShieldCheck size={23}/></div><div><b>SecureX</b><small>SECURITY ANALYZER</small></div></div>
    <div className="nav-label">MONITORING</div>
    <nav>{items.map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>`nav-item ${isActive?"active":""}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
    <div className="nav-label lower">SYSTEM</div>
    <nav>
      <NavLink to="settings" className={({isActive})=>`nav-item ${isActive?"active":""}`}><Settings size={18}/><span>Settings</span></NavLink>
      <NavLink to="about" className={({isActive})=>`nav-item ${isActive?"active":""}`}><Info size={18}/><span>About</span></NavLink>
    </nav>
    <div className="sidebar-bottom"><div className="mini-status"><span className="pulse"></span><div><b>Engine Online</b><small>Detection service active</small></div></div><button onClick={onLogout} className="logout-btn">Sign out</button></div>
  </aside>;
}