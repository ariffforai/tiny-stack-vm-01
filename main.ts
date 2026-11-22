// Faithful interpreter of make.fun's tiny stack ISA (kit: generator/subject/ISA.md).
// Node 22, builtins only, no clock, no randomness. Reads MAKEFUN_INPUT_DIR /
// MAKEFUN_OUTPUT_DIR (defaults /input, /output); answers every instance i001..i040.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const IN = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function run(p: Uint8Array, input: Uint8Array): { out: Uint8Array; code: number } {
  const n = p.length;
  const D = new Int32Array(256);
  const C = new Int32Array(64);
  const M = new Int32Array(256);
  const B = new Uint8Array(65536);
  let sp = 0, cp = 0, pc = 0, steps = 0, len = 0, ip = 0;
  const end = (code: number) => ({ out: B.slice(0, len), code });
  const binary = (op: number) => op >= 0x10 && op <= 0x22 && op !== 0x17 && op !== 0x1b && op !== 0x1f;

  for (;;) {
    if (steps === 1000000) return end(10);
    if (pc < 0 || pc >= n) return end(9);
    const op = p[pc];
    const bin = binary(op); // two-operand arithmetic / logic / compare
    let imm = 0, pops = 0, pushes = 0;
    if (op === 0x01) { imm = 1; pushes = 1; }
    else if (op === 0x02) { imm = 4; pushes = 1; }
    else if (op === 0x03 || op === 0x50 || op === 0x51 || op === 0x53) pops = 1;
    else if (op === 0x04) { pops = 1; pushes = 2; }
    else if (op === 0x05) { pops = 2; pushes = 2; }
    else if (op === 0x06) { pops = 2; pushes = 3; }
    else if (op === 0x07) { pops = 3; pushes = 3; }
    else if (bin) { pops = 2; pushes = 1; }
    else if (op === 0x17 || op === 0x1b) { pops = 1; pushes = 1; }
    else if (op === 0x30 || op === 0x33) imm = 2;
    else if (op === 0x31 || op === 0x32) { imm = 2; pops = 1; }
    else if (op === 0x40) { pops = 1; pushes = 1; }
    else if (op === 0x41) pops = 2;
    else if (op === 0x52) pushes = 1;
    else if (op !== 0x00 && op !== 0x34) return end(5);
    if (pc + 1 + imm > n) return end(9);
    steps++;
    if (sp < pops) return end(2);
    if (sp - pops + pushes > 256) return end(3);
    const next = pc + 1 + imm;
    pc = next;

    if (bin) {
      const b = D[sp - 1], a = D[sp - 2];
      let r: number;
      switch (op) {
        case 0x10: r = (a + b) | 0; break;
        case 0x11: r = (a - b) | 0; break;
        case 0x12: r = Math.imul(a, b); break;
        case 0x13: if (b === 0) return end(4); r = (a / b) | 0; break;
        case 0x14: if (b === 0) return end(4); r = a % b; break;
        case 0x15: if (b === 0) return end(4); r = ((a >>> 0) / (b >>> 0)) | 0; break;
        case 0x16: if (b === 0) return end(4); r = ((a >>> 0) % (b >>> 0)) | 0; break;
        case 0x18: r = a & b; break;
        case 0x19: r = a | b; break;
        case 0x1a: r = a ^ b; break;
        case 0x1c: r = a << (b & 31); break;
        case 0x1d: r = a >> (b & 31); break;
        case 0x1e: r = (a >>> (b & 31)) | 0; break;
        case 0x20: r = a === b ? 1 : 0; break;
        case 0x21: r = a < b ? 1 : 0; break;
        default: r = (a >>> 0) < (b >>> 0) ? 1 : 0; break;
      }
      sp -= 2;
      D[sp++] = r;
      continue;
    }
    switch (op) {
      case 0x00: return end(0);
      case 0x01: D[sp++] = (p[next - 1] << 24) >> 24; break;
      case 0x02: D[sp++] = p[next - 4] | (p[next - 3] << 8) | (p[next - 2] << 16) | (p[next - 1] << 24); break;
      case 0x03: sp--; break;
      case 0x04: D[sp] = D[sp - 1]; sp++; break;
      case 0x05: { const t = D[sp - 1]; D[sp - 1] = D[sp - 2]; D[sp - 2] = t; break; }
      case 0x06: D[sp] = D[sp - 2]; sp++; break;
      case 0x07: { const a = D[sp - 3]; D[sp - 3] = D[sp - 2]; D[sp - 2] = D[sp - 1]; D[sp - 1] = a; break; }
      case 0x17: D[sp - 1] = (-D[sp - 1]) | 0; break;
      case 0x1b: D[sp - 1] = ~D[sp - 1]; break;
      case 0x30: case 0x31: case 0x32: {
        const rel = ((p[next - 2] | (p[next - 1] << 8)) << 16) >> 16;
        let take = true;
        if (op !== 0x30) { const v = D[--sp]; take = op === 0x31 ? v === 0 : v !== 0; }
        if (take) pc = next + rel;
        break;
      }
      case 0x33:
        if (cp === 64) return end(7);
        C[cp++] = next;
        pc = p[next - 2] | (p[next - 1] << 8);
        break;
      case 0x34:
        if (cp === 0) return end(8);
        pc = C[--cp];
        break;
      case 0x40: {
        const addr = D[sp - 1];
        if (addr < 0 || addr > 255) return end(6);
        D[sp - 1] = M[addr];
        break;
      }
      case 0x41: {
        const addr = D[sp - 1], v = D[sp - 2];
        if (addr < 0 || addr > 255) return end(6);
        sp -= 2;
        M[addr] = v;
        break;
      }
      case 0x50: {
        const text = String(D[sp - 1]);
        if (len + text.length > 65536) return end(11);
        sp--;
        for (let i = 0; i < text.length; i++) B[len++] = text.charCodeAt(i);
        break;
      }
      case 0x51:
        if (len + 1 > 65536) return end(11);
        B[len++] = D[--sp] & 255;
        break;
      case 0x52: D[sp++] = ip < input.length ? input[ip++] : -1; break;
      case 0x53: return end(D[--sp] & 255);
    }
  }
}

for (const id of readdirSync(IN).sort()) {
  const { out, code } = run(readFileSync(join(IN, id, 'program.bin')), readFileSync(join(IN, id, 'input.bin')));
  mkdirSync(join(OUT, id), { recursive: true });
  writeFileSync(join(OUT, id, 'stdout.bin'), out);
  writeFileSync(join(OUT, id, 'exit.txt'), `${code}\n`);
}
