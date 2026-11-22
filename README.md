[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/ariffforai/tiny-stack-vm-01/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/ariffforai/tiny-stack-vm-01/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

# Tiny Stack VM

A faithful interpreter of make.fun's tiny stack ISA, for the [tiny-stack-vm-01-run-20261122 bounty](https://make.fun/bounty/tiny-stack-vm-01-run-20261122).

`main.ts` (Node 22, stdlib only) runs all 40 programs of a set: 32-bit wrapping arithmetic (`Math.imul` for exact low-32 MUL), unsigned DIVU/MODU/LTU, shifts masked to 5 bits, PUSH8 sign extension, EXIT's low byte, and all 10 traps with their exact exit codes — a trap keeps the output written before it. Deterministic: no clock, no randomness.

Practice score 1,000,000 (40/40); house baseline plain-vm scores 670,000 on the same set.

## License

MIT — see LICENSE.
