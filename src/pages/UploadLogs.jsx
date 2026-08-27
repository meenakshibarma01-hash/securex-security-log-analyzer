import React,{useRef,useState} from "react";
import { UploadCloud, FileText, CheckCircle2, X } from "lucide-react";
import { classifyLine } from "../utils/analyzer";
export default function UploadLogs({onAnalyze}) {
 const ref=useRef(); const [file,setFile]=useState(null); const [status,setStatus]=useState(""); const [preview,setPreview]=useState([]);
 const choose=(f)=>{if(!f)return;setFile(f);setStatus("Ready to analyze");const reader=new FileReader();reader.onload=e=>setPreview(e.target.result.split(/\r?\n/).filter(Boolean).slice(0,8));reader.readAsText(f)};
 const analyze=()=>{if(!file)return;setStatus("Analyzing…");const reader=new FileReader();reader.onload=e=>{const state={};const logs=e.target.result.split(/\r?\n/).filter(Boolean).slice(0,5000).map((line,i)=>({id:`file-${i}-${Date.now()}`,...classifyLine(line,state),time:new Date().toLocaleTimeString()}));onAnalyze(logs,file.name);setStatus(`Analysis complete — ${logs.length} lines processed`)};reader.readAsText(file)};
 return <div className="page"><div className="section-heading"><div><h2>Upload Security Logs</h2><p>Ingest a raw server or system log and run pattern-based threat detection.</p></div></div>
 <div className="upload-grid"><section className="glass upload-card"><div className="dropzone" onClick={()=>ref.current.click()}><input ref={ref} type="file" accept=".log,.txt,.csv" hidden onChange={e=>choose(e.target.files[0])}/><div className="upload-circle"><UploadCloud size={30}/></div><h3>Drop your log file here</h3><p>or click to browse from your computer</p><small>Supported: .log, .txt, .csv · Up to 5,000 lines</small></div>
 {file&&<div className="file-selected"><FileText/><div><b>{file.name}</b><small>{(file.size/1024).toFixed(1)} KB · {status}</small></div><button onClick={()=>{setFile(null);setPreview([])}}><X/></button></div>}
 <button className="primary-btn full" disabled={!file} onClick={analyze}><CheckCircle2 size={18}/> Analyze Log File</button></section>
 <section className="glass preview-card"><div className="card-head"><div><b>Preview</b><span>First parsed lines</span></div></div>{preview.length?<pre>{preview.join("\n")}</pre>:<div className="empty"><FileText size={34}/><p>Select a log file to preview its contents.</p></div>}</section></div></div>
}