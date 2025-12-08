
function isPrimitive(value: any): boolean {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function getCommonKeys(arr: any[]): string[] | null {
  if (arr.length === 0) return null;
  const firstKeys = Object.keys(arr[0]).sort();
  const firstKeysStr = JSON.stringify(firstKeys);

  for (let i = 1; i < arr.length; i++) {
    const keys = Object.keys(arr[i]).sort();
    if (JSON.stringify(keys) !== firstKeysStr) {
      return null;
    }
  }
  return firstKeys;
}

function isArrayOfPrimitives(arr: any[]): boolean {
  return arr.every(isPrimitive);
}

export function encode(data: any, indentLevel = 0): string {
  const indent = '  '.repeat(indentLevel);

  if (data === null) return '';
  if (typeof data !== 'object') return String(data);

  if (Array.isArray(data)) {
    return '';
  }

  let lines: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;

    if (isPrimitive(value)) {
      lines.push(`${indent}${key}: ${value}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${indent}${key}[0]:`);
      } else if (isArrayOfPrimitives(value)) {
        lines.push(`${indent}${key}[${value.length}]: ${value.join(',')}`);
      } else {
        const commonKeys = getCommonKeys(value);
        const allValuesPrimitive = value.every(obj => Object.values(obj).every(v => isPrimitive(v) || v === null));

        if (commonKeys && allValuesPrimitive) {
          lines.push(`${indent}${key}[${value.length}]{${commonKeys.join(',')}}:`);
          for (const item of value) {
            const row = commonKeys.map(k => item[k]).join(',');
            lines.push(`${indent}  ${row}`);
          }
        } else {
          lines.push(`${indent}${key}[${value.length}]:`);
          for (const item of value) {
            const itemEncoded = encode(item, 0);
            const itemLines = itemEncoded.split('\n');
            if (itemLines.length > 0) {
                lines.push(`${indent}  - ${itemLines[0]}`);
                for (let i = 1; i < itemLines.length; i++) {
                    lines.push(`${indent}    ${itemLines[i]}`);
                }
            }
          }
        }
      }
    } else {
      lines.push(`${indent}${key}:`);
      lines.push(encode(value, indentLevel + 1));
    }
  }

  return lines.join('\n');
}

export function decode(toon: string): any {
  if (!toon.trim()) return {};

  const lines = toon.split(/\r?\n/);

  let lineIdx = 0;

  function parseBlock(minIndent: number): any {
    const result: any = {};

    while (lineIdx < lines.length) {
      const line = lines[lineIdx];
      if (!line.trim()) {
        lineIdx++;
        continue;
      }

      const indent = line.search(/\S|$/);
      if (indent < minIndent) {
        break;
      }

      const content = line.trim();

      const tableMatch = content.match(/^([^\[]+)\[(\d+)\]\{([^}]+)\}:$/);
      if (tableMatch) {
          const key = tableMatch[1];
          const cols = tableMatch[3].split(',');

          const arr: any[] = [];
          lineIdx++;

          while (lineIdx < lines.length) {
              const nextLine = lines[lineIdx];
              const nextIndent = nextLine.search(/\S|$/);
              if (nextIndent <= indent) break;

              const vals = nextLine.trim().split(',');
              const obj: any = {};
              cols.forEach((col, i) => {
                  obj[col] = parseValue(vals[i]);
              });
              arr.push(obj);
              lineIdx++;
          }

          result[key] = arr;
          continue;
      }

      const arrayMatch = content.match(/^([^\[]+)\[(\d+)\]:\s*(.*)$/);
      if (arrayMatch) {
          const key = arrayMatch[1];
          const trail = arrayMatch[3];

          if (trail) {
              const vals = trail.split(',').map(parseValue);
              result[key] = vals;
              lineIdx++;
          } else {
              lineIdx++;
              const items = parseList(indent + 1);
              result[key] = items;
          }
          continue;
      }

      const keyMatch = content.match(/^([^:]+):\s*(.*)$/);
      if (keyMatch) {
          const key = keyMatch[1];
          const valStr = keyMatch[2];

          if (valStr) {
              result[key] = parseValue(valStr);
              lineIdx++;
          } else {
              lineIdx++;
              result[key] = parseBlock(indent + 1);
          }
          continue;
      }

      lineIdx++;
    }

    return result;
  }

  function parseList(minIndent: number): any[] {
      const arr: any[] = [];

      while (lineIdx < lines.length) {
          const line = lines[lineIdx];
          if (!line.trim()) {
              lineIdx++;
              continue;
          }

          const indent = line.search(/\S|$/);
          if (indent < minIndent) break;

          const content = line.trim();
          if (content.startsWith('- ')) {
              const itemIndent = indent + 2;
              const rest = content.substring(2);
              const firstKV = parseLineKV(rest);

              lineIdx++;
              const restObj = parseBlock(itemIndent);

              const fullObj = { ...firstKV, ...restObj };
              arr.push(fullObj);
          } else {
              break;
          }
      }
      return arr;
  }

  function parseLineKV(str: string): any {
      const match = str.match(/^([^:]+):\s*(.*)$/);
      if (match) {
          const k = match[1];
          const v = match[2];
          if (v) return { [k]: parseValue(v) };
      }
      return {};
  }

  function parseValue(val: string): any {
      if (val === undefined || val === null) return null;
      val = val.trim();
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (!isNaN(Number(val)) && val !== '') return Number(val);
      return val;
  }

  return parseBlock(0);
}
