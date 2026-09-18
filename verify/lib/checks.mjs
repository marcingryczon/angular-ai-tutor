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

/** Angular's config files are JSON with comments, so strip those first. */
export function json(path) {
  const raw = fileExists(path)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"'])\/\/.*$/gm, '$1');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
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
