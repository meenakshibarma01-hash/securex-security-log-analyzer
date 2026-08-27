import React,{useEffect,useMemo,useState} from "react";
import {Routes,Route,Navigate,useLocation} from "react-router-dom";
import Sidebar from "./components/Sidebar"; import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard"; import UploadLogs from "./pages/UploadLogs"; import Logs from "./pages/Logs"; import Alerts from "./pages/Alerts"; import IPAnalysis from "./pages/IPAnalysis"; import Users from "./pages/Users"; import Reports from "./pages/Reports"; import Settings from "./pages/Settings"; import About from "./pages/About";
import {generateSynthetic} from "./utils/analyzer";

const titles={dashboard:["Dashboard","Live overview of your security logs"],upload:["Upload Logs","Ingest a raw log file for analysis"],logs:["View Logs","Browse and filter every parsed record"],alerts:["Alerts","Everything flagged as suspicious or worse"],ip:["IP Analysis","Source IPs ranked by volume and risk"],users:["User Activity","Authentication activity grouped by source"],reports:["Reports","Export your findings"],settings:["Settings","Configure monitoring behaviour"],about:["About","Project information"]};

function Login({onLogin}){const [u,setU]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");const submit=e=>{e.preventDefault();if(!u||!p){setErr("Enter username and password.");return}localStorage.setItem("securex_user",u);onLogin(u)};return <div className="login-page"><div className="login-orb one"></div><div className="login-orb two"></div><div className="login-box glass"><div className="brand center"><div className="brand-icon"><span>✓</span></div><div><b>SecureX</b><small>SECURITY OPERATIONS CENTER</small></div></div><h1>Welcome back</h1><p className="login-sub">Sign in to access your security monitoring dashboard.</p><form onSubmit={submit}><label>Username<input value={u} onChange={e=>setU(e.target.value)} placeholder="Security analyst"/></label><label>Password<input type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••"/></label>{err&&<div className="form-error">{err}</div>}<button className="primary-btn full">Sign in to SecureX</button></form><div className="demo-hint">Demo mode · Any non-empty credentials are accepted</div></div></div>}

export default function App(){
 const [user,setUser]=useState(()=>localStorage.getItem("securex_user")||"");
 const [logs,setLogs]=useState(()=>{try{return JSON.parse(localStorage.getItem("securex_logs")||"null")||Array.from({length:55},(_,i)=>generateSynthetic(i))}catch{return []}});
 const [monitoring,setMonitoring]=useState(true); const [query,setQuery]=useState("");
 useEffect(()=>localStorage.setItem("securex_logs",JSON.stringify(logs.slice(0,5000))),[logs]);
 useEffect(()=>{if(!monitoring)return;const id=setInterval(()=>setLogs(prev=>[generateSynthetic(prev.length+1),...prev].slice(0,5000)),1500);return()=>clearInterval(id)},[monitoring]);
 const logout=()=>{localStorage.removeItem("securex_user");setUser("")};
 const analyze=(newLogs,name)=>setLogs(prev=>[...newLogs,...prev].slice(0,5000));
 if(!user)return <Login onLogin={setUser}/>;
 return <div className="app-shell"><Sidebar onLogout={logout}/><main className="main"><Topbar title={titles[useLocation().pathname.split("/")[1]||"dashboard"]?.[0]||"Dashboard"} subtitle={titles[useLocation().pathname.split("/")[1]||"dashboard"]?.[1]||""} user={user} onSearch={setQuery}/><Routes>
 <Route path="/" element={<Navigate to="/dashboard" replace/>}/><Route path="/dashboard" element={<Dashboard logs={logs} monitoring={monitoring} onToggle={()=>setMonitoring(v=>!v)}/>}/><Route path="/upload" element={<UploadLogs onAnalyze={analyze}/>}/><Route path="/logs" element={<Logs logs={logs} query={query}/>}/><Route path="/alerts" element={<Alerts logs={logs}/>}/><Route path="/ip" element={<IPAnalysis logs={logs}/>}/><Route path="/users" element={<Users logs={logs}/>}/><Route path="/reports" element={<Reports logs={logs}/>}/><Route path="/settings" element={<Settings monitoring={monitoring} onToggle={()=>setMonitoring(v=>!v)} onClear={()=>setLogs([])}/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/>
 </Routes></main></div>
}