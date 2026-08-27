export function downloadBlob(name, content, type="text/plain") {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(logs) {
  const header = "Time,IP Address,Event,Severity,Details\n";
  const body = logs.map(l =>
    [l.time,l.ip,l.event,l.severity,l.details].map(v => `"${String(v).replaceAll('"','""')}"`).join(",")
  ).join("\n");
  downloadBlob(`securex-logs-${Date.now()}.csv`, header + body, "text/csv");
}

export function exportJSON(logs) {
  downloadBlob(`securex-logs-${Date.now()}.json`, JSON.stringify(logs, null, 2), "application/json");
}

export function exportHTMLReport(logs) {
  const counts = {normal:0,medium:0,high:0,critical:0};
  logs.forEach(l => counts[l.severity]++);
  const esc = s => String(s ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  const rows = logs.slice(0,150).map(l =>
    `<tr><td>${esc(l.time)}</td><td>${esc(l.ip)}</td><td>${esc(l.event)}</td><td class="${l.severity}">${esc(l.severity.toUpperCase())}</td><td>${esc(l.details)}</td></tr>`
  ).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>SecureX Security Report</title>
  <style>
  body{font-family:Arial,sans-serif;background:#f5f7fb;color:#162033;padding:36px}
  .wrap{max-width:1100px;margin:auto;background:white;padding:32px;border-radius:16px}
  h1{margin:0 0 6px}.sub{color:#64748b;margin-bottom:24px}
  .cards{display:flex;gap:12px;margin:20px 0}.card{flex:1;border:1px solid #e5e7eb;border-radius:12px;padding:16px}
  .num{font-size:25px;font-weight:800}.label{color:#64748b;font-size:12px}
  table{width:100%;border-collapse:collapse;font-size:12px}th,td{text-align:left;padding:9px;border-bottom:1px solid #e5e7eb}
  th{color:#64748b}.normal{color:#16a34a}.medium{color:#ca8a04}.high{color:#ea580c}.critical{color:#dc2626;font-weight:700}
  @media print{body{background:white;padding:0}.wrap{box-shadow:none}}
  </style></head><body><div class="wrap">
  <h1>SecureX — Security Log Analysis Report</h1><div class="sub">Generated ${new Date().toLocaleString()}</div>
  <div class="cards">${Object.entries({total:logs.length,...counts}).map(([k,v])=>`<div class="card"><div class="num">${v}</div><div class="label">${k.toUpperCase()}</div></div>`).join("")}</div>
  <h2>Analyzed Events</h2><table><thead><tr><th>Time</th><th>IP</th><th>Event</th><th>Severity</th><th>Details</th></tr></thead><tbody>${rows}</tbody></table>
  </div><script>window.onload=()=>setTimeout(()=>window.print(),400)</script></body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); }
}