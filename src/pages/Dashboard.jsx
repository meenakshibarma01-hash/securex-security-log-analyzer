import React from "react";
import { Activity, AlertTriangle, ShieldCheck, Database, TrendingUp, Clock3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import SeverityBadge from "../components/SeverityBadge";
import { severityColors } from "../utils/analyzer";

export default function Dashboard({logs,monitoring,onToggle}) {
 const counts={normal:0,medium:0,high:0,critical:0}; logs.forEach(l=>counts[l.severity]++);
 const trend = Array.from({length:12},(_,i)=>({time:`${String(i+9).padStart(2,"0")}:00`,events:Math.max(1,Math.round(logs.length/12 + Math.sin(i)*3)),threats:Math.max(0,Math.round(logs.filter(l=>l.severity!=="normal").length/12 + Math.cos(i)*2))}));
 const pie=Object.entries(counts).map(([name,value])=>({name,value}));
 const topIps=Object.entries(logs.reduce((a,l)=>(a[l.ip]=(a[l.ip]||0)+1,a),{})).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([ip,value])=>({ip,value}));
 return <div className="page">
  <div className="hero-row"><div><div className="eyebrow"><Activity size={14}/> SECURITY OPERATIONS CENTER</div><h2>Real-time Security Overview</h2><p>Monitor, analyze and investigate system activity as it happens.</p></div><button className={`monitor-btn ${monitoring?"on":""}`} onClick={onToggle}><span className="pulse"></span>{monitoring?"Monitoring Live":"Monitoring Paused"}</button></div>
  <div className="stats-grid">
   <Stat icon={Database} title="Total Logs" value={logs.length} sub="events analyzed" cls="blue"/>
   <Stat icon={ShieldCheck} title="Normal" value={counts.normal} sub={`${logs.length?((counts.normal/logs.length)*100).toFixed(1):0}% of traffic`} cls="green"/>
   <Stat icon={AlertTriangle} title="Suspicious" value={counts.medium+counts.high} sub={`${counts.medium+counts.high} medium/high`} cls="amber"/>
   <Stat icon={AlertTriangle} title="Critical" value={counts.critical} sub="requires attention" cls="red"/>
  </div>
  <div className="dashboard-grid">
   <section className="glass chart-card wide"><div className="card-head"><div><b>Event Activity</b><span>Live event volume and detected threats</span></div><div className="legend"><i></i> Events <i></i> Threats</div></div><ResponsiveContainer width="100%" height={270}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" opacity=".12"/><XAxis dataKey="time" stroke="#71809b"/><YAxis stroke="#71809b"/><Tooltip contentStyle={{background:"#101827",border:"1px solid #26344e",borderRadius:12}}/><Line type="monotone" dataKey="events" stroke="#52a8ff" strokeWidth={3} dot={false}/><Line type="monotone" dataKey="threats" stroke="#ff5d79" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></section>
   <section className="glass chart-card"><div className="card-head"><div><b>Severity Distribution</b><span>Current threat mix</span></div></div><ResponsiveContainer width="100%" height={230}><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={65} outerRadius={88} paddingAngle={3}>{pie.map(x=><Cell key={x.name} fill={severityColors[x.name]}/>)}</Pie><Tooltip contentStyle={{background:"#101827",border:"1px solid #26344e",borderRadius:12}}/></PieChart></ResponsiveContainer><div className="severity-legend">{pie.map(x=><span key={x.name}><i style={{background:severityColors[x.name]}}></i>{x.name}<b>{x.value}</b></span>)}</div></section>
   <section className="glass chart-card"><div className="card-head"><div><b>Top Source IPs</b><span>Events by origin</span></div></div><ResponsiveContainer width="100%" height={230}><BarChart data={topIps} layout="vertical"><CartesianGrid strokeDasharray="3 3" opacity=".08"/><XAxis type="number" stroke="#71809b"/><YAxis dataKey="ip" type="category" width={100} stroke="#71809b" tick={{fontSize:11}}/><Tooltip contentStyle={{background:"#101827",border:"1px solid #26344e",borderRadius:12}}/><Bar dataKey="value" fill="#52a8ff" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></section>
  </div>
  <section className="glass recent"><div className="card-head"><div><b>Live Event Stream</b><span>Most recent security events</span></div><span className="record-count">{logs.length} records</span></div><div className="table-wrap"><table><thead><tr><th>TIME</th><th>IP ADDRESS</th><th>EVENT</th><th>SEVERITY</th><th>DETAILS</th></tr></thead><tbody>{logs.slice(0,7).map(l=><tr key={l.id}><td className="mono">{l.time}</td><td className="mono strong">{l.ip}</td><td>{l.event}</td><td><SeverityBadge severity={l.severity}/></td><td className="muted">{l.details}</td></tr>)}</tbody></table></div></section>
 </div>
}
function Stat({icon:Icon,title,value,sub,cls}){return <div className="glass stat-card"><div className={`stat-icon ${cls}`}><Icon size={20}/></div><div><span>{title}</span><strong>{value.toLocaleString()}</strong><small>{sub}</small></div><TrendingUp size={16} className="stat-trend"/></div>}