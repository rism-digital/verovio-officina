Do not inspect or read these directories unless the task explicitly requires them:

- node_modules/
- dist/
- build/
- junkyard/
- .git/


Prefer targeted searches over directory-wide reads.

When a task concerns a specific component or module, stay within that
module first. Expand to other directories only when imports, references,
or dependencies require it.

Never read large generated files merely to understand project structure.