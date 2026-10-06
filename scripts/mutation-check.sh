#!/usr/bin/env bash
# Teste de mutação manual e leve (sem dependências extras).
# Aplica um bug por vez em src/hilbertsHotel.js, roda cada suíte separadamente
# e informa se algum teste detectou ("killed") ou não ("SURVIVED") o bug.
# Motivação: OB6 de Goldstein et al. (2024) — testes que passam não provam nada
# se ninguém verifica se eles conseguem falhar.
set -u
cd "$(dirname "$0")/.."
SRC=src/hilbertsHotel.js
ORIG="$(mktemp)"
cp "$SRC" "$ORIG"
trap 'cp "$ORIG" "$SRC"; rm -f "$ORIG"' EXIT

passes() { npx jest "$1" 2>&1 | grep -q "^PASS"; }

mutant() {
  local desc="$1" expr="$2"
  cp "$ORIG" "$SRC"
  sed -i -E "$expr" "$SRC"
  if cmp -s "$SRC" "$ORIG"; then echo "NOOP     | $desc"; return; fi
  local ex pb result
  passes tests/example.test.js && ex=passa || ex=FALHA
  passes tests/property.test.js && pb=passa || pb=FALHA
  result=SURVIVED
  if [ "$ex" = FALHA ] || [ "$pb" = FALHA ]; then result=killed; fi
  printf '%-8s | exemplos:%-5s props:%-5s | %s\n' "$result" "$ex" "$pb" "$desc"
}

mutant "M1  caso 1: soma -> subtração"            's/room \+ shift/room - shift/'
mutant "M2  caso 1: produto -> soma"              's/people \* buses;/people + buses;/'
mutant "M3  caso 2: (ônibus+1) -> ônibus"         's/room \* \(buses \+ 1\)/room * buses/'
mutant "M4  caso 3: (pessoas+1) -> pessoas"       's/room \* \(people \+ 1\)/room * people/'
mutant "M5  caso 4: n(n+1)/2 -> n(n-1)/2"         's/room \* \(room \+ 1\)\) \/ 2/room * (room - 1)) \/ 2/'
mutant "M6  caso 4: /2 -> /3"                     's/\(room \* \(room \+ 1\)\) \/ 2/(room * (room + 1)) \/ 3/'
mutant "M7  infinitePeople: === -> !=="           's/const infinitePeople = people === Infinity/const infinitePeople = people !== Infinity/'
mutant "M8  validação rooms: r > 0 -> r >= 0"     's/r > 0\)/r >= 0)/'
mutant "M9  isCount: >= 0 -> > 0"                 's/value >= 0\)/value > 0)/'
mutant "M10 remove checagem de overflow"          's/!Number.isSafeInteger\(next\)/false/'
mutant "M11 caso 2 usa pessoas em vez de ônibus"  's/room \* \(buses \+ 1\)/room * (people + 1)/'
