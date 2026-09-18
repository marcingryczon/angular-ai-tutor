/** Assertion helpers shared by the phase files. Every failure explains itself. */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';

export function fileExists(path) {
  if (!existsSync(path)) {
    throw new Error(`expected the file ${path} to exist`);
  }
  return readFileSync(path, 'utf8');
}

export function fileContains(path, needle, hint = '') {
  const content = fileExists(path);
  const found = needle instanceof RegExp ? needle.test(content) : content.includes(needle);
  if (!found) {
    throw new Error(`${path} does not contain ${needle}${hint ? ` — ${hint}` : ''}`);
  }
  return content;
}

export function fileMissing(path, hint = '') {
  if (existsSync(path)) {
    throw new Error(`${path} should be gone by now${hint ? ` — ${hint}` : ''}`);
  }
}

/**
 * Angular's config files are JSON with comments. Stripping those with a regex is a trap: an
 * asset glob such as the one in `angular.json` contains a slash-star sequence inside a string
 * literal, and a naive stripper swallows the rest of the file from there. This scanner tracks
 * whether it is inside a string, so only real comments are removed.
 */
function stripJsonComments(text) {
  let out = '';
  let inString = false;
  let inLine = false;
  let inBlock = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inLine) {
      if (char === '\n') {
        inLine = false;
        out += char;
      }
      continue;
    }
    if (inBlock) {
      if (char === '*' && next === '/') {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inString) {
      out += char;
      if (char === '\\') {
        out += text[++i] ?? '';
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      out += char;
      continue;
    }
    if (char === '/' && next === '/') {
      inLine = true;
      i++;
      continue;
    }
    if (char === '/' && next === '*') {
      inBlock = true;
      i++;
      continue;
    }
    out += char;
  }

  return out;
}

export function json(path) {
  const raw = fileExists(path);
  try {
    return JSON.parse(raw);
  } catch {
    try {
      return JSON.parse(stripJsonComments(raw));
    } catch (error) {
      throw new Error(`${path} is not valid JSON: ${error.message}`);
    }
  }
}

export function equals(actual, expected, what) {
  if (actual !== expected) {
    throw new Error(
      `${what}: expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`,
    );
  }
}

export function atLeast(actual, minimum, what) {
  if (!(actual >= minimum)) {
    throw new Error(`${what}: expected at least ${minimum}, found ${actual}`);
  }
}

export function truthy(actual, what) {
  if (!actual) {
    throw new Error(what);
  }
}

/** Walks a directory tree collecting files that match a predicate. */
export function walk(dir, predicate, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir)) {
    const full = `${dir}/${entry}`;
    if (statSync(full).isDirectory()) walk(full, predicate, found);
    else if (predicate(full)) found.push(full);
  }
  return found;
}
