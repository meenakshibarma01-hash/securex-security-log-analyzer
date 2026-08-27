export const severityColors = {
  normal: "#25d995",
  medium: "#f5bd45",
  high: "#ff914d",
  critical: "#ff4f6d"
};

const IP_POOL = [
  "192.168.1.20","203.0.113.5","198.51.100.23","192.168.1.33",
  "203.0.113.42","192.168.1.45","10.0.0.14","172.16.5.9"
];

const EVENTS = [
  ["Successful Login","normal","User authenticated successfully"],
  ["File Access","normal","Read access to shared resource"],
  ["Service Heartbeat","normal","Routine health check OK"],
  ["Session Started","normal","New session initialized"],
  ["System Warning","medium","Non-standard system response"],
  ["Port Scan Detected","medium","Multiple ports scanned from this host"],
  ["Access to Restricted File","high","Attempt to access a restricted resource"],
  ["Multiple Failed Login Attempts","high","Repeated authentication failures detected"],
  ["Privilege Escalation Attempt","critical","Elevated privileges requested"],
  ["Malicious Command Pattern","critical","Suspicious command sequence detected"]
];

export function randomIp() {
  return IP_POOL[Math.floor(Math.random() * IP_POOL.length)];
}

export function nowTime() {
  return new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"});
}

export function generateSynthetic(seq = 1) {
  const roll = Math.random();
  let index;
  if (roll < .50) index = Math.floor(Math.random()*4);
  else if (roll < .76) index = 4 + Math.floor(Math.random()*2);
  else if (roll < .93) index = 6 + Math.floor(Math.random()*2);
  else index = 8 + Math.floor(Math.random()*2);
  const [event, severity, details] = EVENTS[index];
  return {
    id: `${Date.now()}-${seq}`,
    time: nowTime(),
    ip: randomIp(),
    event, severity, details,
    raw: `${nowTime()} ${randomIp()} ${event}`
  };
}

export function classifyLine(line, failState = {}) {
  const ip = (line.match(/(\d{1,3}(?:\.\d{1,3}){3})/) || [])[1] || randomIp();
  const text = line.trim();
  const lower = text.toLowerCase();
  if (/sudo|privilege|escalat|root shell/.test(lower))
    return { ip, event:"Privilege Escalation Attempt", severity:"critical", details:"Elevated privileges requested", raw:text };
  if (/port.?scan|nmap|scanning/.test(lower))
    return { ip, event:"Port Scan Detected", severity:"medium", details:"Multiple ports scanned from this host", raw:text };
  if (/permission denied|\/etc\/shadow|restricted|unauthorized|access denied/.test(lower))
    return { ip, event:"Access to Restricted File", severity:"high", details:"Attempt to access a restricted resource", raw:text };
  if (/failed password|authentication failure|invalid user|login failed|failed login/.test(lower)) {
    failState[ip] = (failState[ip] || 0) + 1;
    const n = failState[ip];
    return {
      ip,
      event:"Multiple Failed Login Attempts",
      severity:n >= 5 ? "critical" : n >= 3 ? "high" : "medium",
      details:`${n} failed attempts detected for this host`,
      raw:text
    };
  }
  if (/accepted password|session opened|successful login|login successful|logged in/.test(lower))
    return { ip, event:"Successful Login", severity:"normal", details:"User authenticated successfully", raw:text };
  if (/error|denied|refused|warning/.test(lower))
    return { ip, event:"System Warning", severity:"medium", details:"Non-standard system response", raw:text };
  return { ip, event:"System Event", severity:"normal", details:text.slice(0,90) || "Routine log entry", raw:text };
}