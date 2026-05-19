export const TICKERS = ["GME", "AMC", "NOK", "BB", "PLTR", "AAL", "SPY", "QQQ", "SLV"];


export const generateNotifications = (ticker) => [
  {
    id: `${ticker}-1`,
    ticker,
    title: "Significant Sentiment Shift Detected",
    summary: "AI Analysis: Community sentiment shifted from bearish (-0.35) to strongly bullish (+0.72) over 48 hours. Key drivers include positive earnings speculation and increased institutional interest mentioned in 847 posts.",
    time: "2h ago",
    severity: "high",
    type: "sentiment",
    sources: ["Reddit r/wallstreetbets", "Reddit r/stocks", "Twitter"]
  },
  {
    id: `${ticker}-2`,
    ticker,
    title: "Unusual Volume Spike",
    summary: "AI Summary: Reddit activity increased 340% above 30-day average. Top themes: 'short squeeze potential' (mentioned 234 times), 'upcoming catalyst' (189 mentions), 'technical breakout' (156 mentions).",
    time: "5h ago",
    severity: "medium",
    type: "volume",
    sources: ["Reddit", "Social Media"]
  },
  {
    id: `${ticker}-3`,
    ticker,
    title: "Key News & Sentiment Analysis",
    summary: "LLM Digest: Multiple sources reporting Q4 earnings beat expectations. Community reaction: 78% positive sentiment. Key phrase analysis shows 'undervalued', 'growth potential', and 'strong fundamentals' trending in discussions.",
    time: "1d ago",
    severity: "info",
    type: "news",
    sources: ["News APIs", "SEC Filings", "Reddit"]
  }
];


export function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n === 0 || n !== y.length) return NaN;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX, dy = y[i] - meanY;
    num += dx * dy; denX += dx * dx; denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  if (den === 0) return NaN;
  return num / den;
}

export function computeSentimentReturnCorrelation(rows) {
  if (!rows || rows.length < 3) return NaN;
  const returns = [], sentiments = [];
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1].Close;
    const curr = rows[i].Close;
    if (!prev || !curr) continue;
    const ret = (curr - prev) / prev;
    const senti = rows[i].avg_sentiment;
    if (typeof senti === "number" && !Number.isNaN(senti)) { 
      returns.push(ret); 
      sentiments.push(senti); 
    }
  }
  if (returns.length < 2) return NaN;
  return pearsonCorrelation(sentiments, returns);
}

export function sentimentLabel(v) {
  if (v > 0.3) return "Strongly Bullish";
  if (v > 0.1) return "Bullish";
  if (v < -0.3) return "Strongly Bearish";
  if (v < -0.1) return "Bearish";
  return "Neutral";
}

export function sentimentColor(v) {
  if (v > 0.3) return "text-emerald-400";
  if (v > 0.1) return "text-green-400";
  if (v < -0.3) return "text-rose-400";
  if (v < -0.1) return "text-red-400";
  return "text-slate-400";
}