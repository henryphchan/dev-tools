import React, { useMemo, useState } from 'react';

const TOOL_LIST = [
  {
    id: 'json',
    name: 'JSON Formatter',
    icon: '🧩',
    description: 'Pretty-print and validate JSON with instant error feedback.',
  },
  {
    id: 'xml',
    name: 'XML Formatter',
    icon: '🪶',
    description: 'Normalize and indent XML for quick readability.',
  },
  {
    id: 'sql',
    name: 'SQL Beautifier',
    icon: '🗄️',
    description: 'Space out keywords, newlines, and tidy up your queries.',
  },
  {
    id: 'codec',
    name: 'Encoders & Decoders',
    icon: '🧬',
    description: 'Base64 and URL encode/decode helpers.',
  },
  {
    id: 'timezone',
    name: 'Timezone Converter',
    icon: '🕰️',
    description: 'Convert timestamps between popular timezones.',
  },
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Singapore',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
];

function formatJson(input) {
  if (!input.trim()) return '';
  return JSON.stringify(JSON.parse(input), null, 2);
}

function formatXml(xml) {
  if (!xml.trim()) return '';
  const PADDING = '  ';
  const reg = /(>)(<)(\/*)/g;
  let xmlString = xml.replace(reg, '$1\n$2$3');
  let pad = 0;
  return xmlString
    .split('\n')
    .map((node) => {
      if (node.match(/^<\/\w/)) pad -= 1;
      const line = `${PADDING.repeat(Math.max(pad, 0))}${node}`;
      if (node.match(/^<[^!?][^>]*[^/]>/)) pad += 1;
      return line;
    })
    .join('\n');
}

function formatSql(sql) {
  if (!sql.trim()) return '';
  const keywords = [
    'select',
    'from',
    'where',
    'group by',
    'order by',
    'inner join',
    'left join',
    'right join',
    'join',
    'on',
    'and',
    'or',
    'limit',
    'insert into',
    'values',
    'update',
    'set',
    'delete from',
  ];

  let output = sql;
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    output = output.replace(regex, `\n${kw.toUpperCase()}`);
  });
  return output
    .replace(/\n{2,}/g, '\n')
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
}

function JsonTool() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');

  const handleFormat = () => {
    try {
      setError('');
      setOutput(formatJson(input));
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  return (
    <div className="tool-grid">
      <div className="panel">
        <div className="tool-meta">
          <h3>Input</h3>
          <div className="chips">
            <span className="chip">CTRL + V friendly</span>
            <span className="chip">Supports comments? Not yet</span>
          </div>
        </div>
        <textarea
          spellCheck="false"
          placeholder="Paste your JSON here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="actions">
          <button className="button primary" onClick={handleFormat}>
            Format JSON
          </button>
          <button
            className="button"
            onClick={() => {
              setInput('');
              setOutput('');
            }}
          >
            Clear
          </button>
        </div>
        {error && <div className="chip" style={{ color: 'var(--danger)' }}>{error}</div>}
      </div>
      <div className="panel">
        <div className="tool-meta">
          <h3>Pretty JSON</h3>
          <span className="chip">2-space indentation</span>
        </div>
        <div className="output">{output}</div>
      </div>
    </div>
  );
}

function XmlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div className="tool-grid">
      <div className="panel">
        <div className="tool-meta">
          <h3>XML</h3>
          <span className="chip">Adds new lines and spacing</span>
        </div>
        <textarea
          spellCheck="false"
          placeholder="Paste XML here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="actions">
          <button className="button primary" onClick={() => setOutput(formatXml(input))}>
            Format XML
          </button>
          <button
            className="button"
            onClick={() => {
              setInput('');
              setOutput('');
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="panel">
        <div className="tool-meta">
          <h3>Result</h3>
          <span className="chip">Read-only</span>
        </div>
        <div className="output">{output}</div>
      </div>
    </div>
  );
}

function SqlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div className="tool-grid">
      <div className="panel">
        <div className="tool-meta">
          <h3>SQL</h3>
          <span className="chip">Quick beautify</span>
        </div>
        <textarea
          spellCheck="false"
          placeholder="SELECT * FROM users WHERE active = true ORDER BY created_at DESC"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="actions">
          <button className="button primary" onClick={() => setOutput(formatSql(input))}>
            Beautify SQL
          </button>
          <button
            className="button"
            onClick={() => {
              setInput('');
              setOutput('');
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="panel">
        <div className="tool-meta">
          <h3>Result</h3>
          <span className="chip">Keyword aware</span>
        </div>
        <div className="output">{output}</div>
      </div>
    </div>
  );
}

function CodecTool() {
  const [input, setInput] = useState('');
  const [base64, setBase64] = useState('');
  const [urlEncoded, setUrlEncoded] = useState('');
  const [error, setError] = useState('');

  const encodeBase64 = () => {
    try {
      setError('');
      setBase64(btoa(input));
    } catch (err) {
      setError(err.message);
    }
  };

  const decodeBase64 = () => {
    try {
      setError('');
      setBase64(atob(input));
    } catch (err) {
      setError(err.message);
    }
  };

  const encodeUrl = () => {
    setUrlEncoded(encodeURIComponent(input));
  };

  const decodeUrl = () => {
    try {
      setError('');
      setUrlEncoded(decodeURIComponent(input));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tool-grid">
      <div className="panel">
        <div className="tool-meta">
          <h3>Raw Input</h3>
          <span className="chip">Encode / Decode</span>
        </div>
        <textarea
          spellCheck="false"
          placeholder="Enter text to transform"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="actions">
          <button className="button primary" onClick={encodeBase64}>
            Base64 Encode
          </button>
          <button className="button" onClick={decodeBase64}>
            Base64 Decode
          </button>
          <button className="button" onClick={encodeUrl}>
            URL Encode
          </button>
          <button className="button" onClick={decodeUrl}>
            URL Decode
          </button>
        </div>
        {error && <div className="chip" style={{ color: 'var(--danger)' }}>{error}</div>}
      </div>
      <div className="panel">
        <div className="two-column">
          <div>
            <h3>Base64 Output</h3>
            <div className="output">{base64}</div>
          </div>
          <div>
            <h3>URL Output</h3>
            <div className="output">{urlEncoded}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimezoneTool() {
  const [datetime, setDatetime] = useState(() => new Date().toISOString().slice(0, 16));
  const [fromZone, setFromZone] = useState('UTC');
  const [toZone, setToZone] = useState('America/New_York');

  const result = useMemo(() => {
    const date = new Date(datetime);
    if (Number.isNaN(date.getTime())) return '';

    const format = (tz) =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);

    return `${format(fromZone)}  →  ${format(toZone)}`;
  }, [datetime, fromZone, toZone]);

  return (
    <div className="tool-grid">
      <div className="panel">
        <div className="tool-meta">
          <h3>Datetime</h3>
          <span className="chip">Local to any zone</span>
        </div>
        <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
        <div className="two-column" style={{ marginTop: 12 }}>
          <div>
            <label className="chip" htmlFor="fromZone">
              From
            </label>
            <select id="fromZone" value={fromZone} onChange={(e) => setFromZone(e.target.value)}>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="chip" htmlFor="toZone">
              To
            </label>
            <select id="toZone" value={toZone} onChange={(e) => setToZone(e.target.value)}>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="tool-meta">
          <h3>Converted Time</h3>
          <span className="chip">Using Intl APIs</span>
        </div>
        <div className="output">{result}</div>
      </div>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState('json');

  const renderTool = () => {
    switch (selected) {
      case 'json':
        return <JsonTool />;
      case 'xml':
        return <XmlTool />;
      case 'sql':
        return <SqlTool />;
      case 'codec':
        return <CodecTool />;
      case 'timezone':
        return <TimezoneTool />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <section className="hero">
        <div>
          <div className="badge">Dev Tools · Purpose-built utilities for busy engineers</div>
          <h1>Sharper everyday tools for developers</h1>
          <p>
            Dev Tools bundles the most requested daily helpers into one fast, minimal surface. Format,
            convert, and sanity-check your data without switching tabs.
          </p>
          <div className="cta-row">
            <button className="button primary" onClick={() => setSelected('json')}>
              Start formatting
            </button>
            <button className="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              Explore tools ↓
            </button>
          </div>
        </div>
        <div className="metrics-grid">
          <div className="metric-card">
            <strong>5 tools</strong>
            <span>Curated for day-to-day debugging</span>
          </div>
          <div className="metric-card">
            <strong>Keyboard friendly</strong>
            <span>Paste, format, copy — frictionless</span>
          </div>
          <div className="metric-card">
            <strong>Zero sign-up</strong>
            <span>Instant results, client-side only</span>
          </div>
        </div>
      </section>

      <section className="tools-shell" id="tools">
        <div className="tool-tabs">
          {TOOL_LIST.map((tool) => (
            <button
              key={tool.id}
              className={`tool-tab ${selected === tool.id ? 'active' : ''}`}
              onClick={() => setSelected(tool.id)}
            >
              <span>{tool.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{tool.name}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{tool.description}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="tool-content">{renderTool()}</div>
      </section>

      <footer className="footer">Built for the small wins — keep shipping. </footer>
    </div>
  );
}

export default App;
