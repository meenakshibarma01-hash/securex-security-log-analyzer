import React from "react";
export default function SeverityBadge({severity}) {
  return <span className={`badge ${severity}`}>{severity}</span>;
}