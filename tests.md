# Casos de teste documentados

SUT: `hilbertsHotel(rooms, people, buses)` em `src/hilbertsHotel.js` (kata *Hilbert's Hotel*, Codewars, 7 kyu).
Convenção: infinito = `Infinity`. A saída é a lista de novos quartos, na ordem de `rooms`.

Duas famílias de técnicas, com IDs que aparecem no nome de cada teste em `/tests`:

| Técnica | Arquivo | IDs |
|---|---|---|
| Particionamento em classes de equivalência | `tests/example.test.js` | EP-01 … EP-12 |
| Análise de valor limite | `tests/example.test.js` | BV-01 … BV-11 |
| Teste baseado em propriedades (PBT, fast-check) | `tests/property.test.js` | PBT-01 … PBT-11 |

Oráculos independentes usados pelo PBT: `tests/oracle.js`.

---

## 1. Particionamento em classes de equivalência

Partições do domínio de entrada, derivadas das 4 regras do enunciado mais as classes inválidas e degeneradas.

| ID | Classe de equivalência | Entrada (exemplo) | Saída esperada |
|---|---|---|---|
| EP-01 | Pessoas finitas, ônibus finitos | `[1..8], 2, 2` | `[5..12]` (desloca `pessoas*ônibus` = 4) |
| EP-02 | Pessoas infinitas, ônibus finitos | `[1..8], ∞, 1` | `[2,4,…,16]` (× `ônibus+1`) |
| EP-02b | idem, outro representante | `[1,2,3], ∞, 3` | `[4,8,12]` |
| EP-03 | Pessoas finitas, ônibus infinitos | `[1..8], 1, ∞` | `[2,4,…,16]` |
| EP-03b | idem, outro representante | `[1,2,3], 3, ∞` | `[4,8,12]` (× `pessoas+1`) |
| EP-04 | Pessoas infinitas, ônibus infinitos | `[1..10], ∞, ∞` | `[1,3,6,10,15,21,28,36,45,55]` |
| EP-05 | Degenerado: 0 pessoas por ônibus | `[1,2,3], 0, 5` | `[1,2,3]` |
| EP-06 | Degenerado: 0 ônibus | `[1,2,3], 5, 0` | `[1,2,3]` |
| EP-07 / 07b | Degenerado: `∞` com `0` | `[1,2,3], ∞, 0` e `0, ∞` | `[1,2,3]` |
| EP-08 | Lista de quartos vazia | `[], 3, 3` e `[], ∞, ∞` | `[]` |
| EP-09 | `rooms` inválido (não é array) | `'1,2,3'`, `undefined`, `null` | `TypeError` |
| EP-10 | `people` inválido | `-1`, `1.5`, `'2'` | `RangeError` |
| EP-11 | `buses` inválido | `-1`, `NaN`, `-∞` | `RangeError` |
| EP-12 | Alias com o nome do kata | `hilberts_hotel` | mesma função |

## 2. Análise de valor limite

| ID | Fronteira | Entrada | Saída esperada |
|---|---|---|---|
| BV-01 | Menor tamanho de `rooms` (1 quarto) | `[1], 1, 1` / `[1], ∞, ∞` | `[2]` / `[1]` |
| BV-02 | Menor chegada não nula | `[1,2,3], 1, 1` | `[2,3,4]` |
| BV-03 | Fronteira 0 / 1 em `people` e `buses` | `[4], 0, 1` · `[4], 1, 1` · `[4], 1, 0` | `[4]` · `[5]` · `[4]` |
| BV-04 | Menor ônibus finito com infinitas pessoas | `[1..4], ∞, 1` | `[2,4,6,8]` |
| BV-05 | `rooms` que não começa em 1 | `[5,6,7], 2, 2` · `∞, 2` · `∞, ∞` | `[9,10,11]` · `[15,18,21]` · `[15,21,28]` |
| BV-06 | Primeiras diagonais de Cantor | `[1..5], ∞, ∞` | `[1,3,6,10,15]` |
| BV-07 | Quarto 0 e negativos | `[0]`, `[-1]`, `[1,2,0]` | `RangeError` |
| BV-08 | Quarto não inteiro, `NaN`, `Infinity` | `[1.5]`, `[NaN]`, `[∞]` | `RangeError` |
| BV-09 | Estouro do inteiro seguro (limite superior) | `[MAX_SAFE_INTEGER]` nos 4 casos | `RangeError` |
| BV-10 | Último valor que ainda cabe | `[MAX_SAFE_INTEGER-1], 1, 1` | `[MAX_SAFE_INTEGER]` |
| BV-11 | Entrada não é modificada | `[1,2,3], 2, 2` | `rooms` continua `[1,2,3]` |

## 3. Testes baseados em propriedades (PBT)

300 execuções por propriedade (`NUM_RUNS`). Geradores: intervalos de quartos `range(a, a+n)`, contagens finitas 0–25 ou `∞` (peso 3:1), e "hotel completo" `1..n`.

| ID | Categoria (Corgozinho et al., 2023) | Propriedade |
|---|---|---|
| PBT-01 | Invariante | Injetividade: dois hóspedes nunca ficam no mesmo quarto |
| PBT-02 | Saída dentro dos limites | Ninguém vai para quarto menor e a ordem relativa é preservada (saída estritamente crescente) |
| PBT-03 | Invariante | Mesmo tamanho da entrada; função pura (não altera a entrada; determinística) |
| PBT-04 | Oráculo | Caso 1: enumerando cada passageiro (ônibus × assento), o hóspede `i` cai no rótulo `G_i` |
| PBT-05 | Oráculo | Casos 2 e 3: hóspede `i` cai em `G_i`, rótulos de passageiros são únicos e há exatamente `n·k` quartos livres, sem buracos |
| PBT-06 | Oráculo | Caso 4: hóspede `i` cai em `G_i` na enumeração explícita das diagonais de Cantor |
| PBT-07 | Invariante | Caso 1 com quartos `1..n`: o primeiro quarto ocupado por hóspede é `pessoas·ônibus + 1` (livres = `1..pessoas·ônibus`) |
| PBT-08 | Metamórfica | Trocar `(∞, k)` por `(k, ∞)` não altera a saída |
| PBT-09 | Metamórfica | Duas chegadas finitas seguidas = uma chegada com `p1·b1 + p2·b2` |
| PBT-10 | Entradas inválidas | Qualquer valor inválido gera `RangeError`/`TypeError`, nunca um resultado |
| PBT-11 | Invariante | Com `people = 0` ou `buses = 0` a saída é idêntica à entrada |

## 4. Rastreabilidade: técnica → regra do kata → teste

| Requisito / regra do enunciado | EP | BV | PBT |
|---|---|---|---|
| 1º caso: finito/finito, deslocar `total` quartos | 01, 05, 06 | 01–03, 05 | 04, 07, 09, 11 |
| 2º caso: pessoas infinitas, × `(ônibus+1)` | 02, 02b, 07 | 04, 05 | 05, 08 |
| 3º caso: ônibus infinitos, × `(pessoas+1)` | 03, 03b, 07b | 05 | 05, 08 |
| 4º caso: pareamento diagonal de Cantor | 04 | 01, 05, 06 | 06 |
| "Cada hóspede recebe um quarto distinto" | todos | todos | 01, 04, 05, 06 |
| "Nenhum quarto fica vazio" | 01 | 02 | 05, 07 |
| Robustez de entrada (decisão de projeto, fora do kata) | 08–11 | 07–10 | 10 |

## 5. Decisões e interpretações do enunciado

- O kata foi publicado para Python, Java e Rust. Para JavaScript, `rooms` é um array de inteiros (como em Java) e infinito é `Infinity` (como `None` em Rust).
- O 3º caso do enunciado só mostra 1 pessoa por ônibus. Generalizamos para `quarto × (pessoas + 1)`, simétrico ao 2º caso. A propriedade PBT-08 verifica essa simetria.
- Se ninguém chega (`people = 0` ou `buses = 0`) ninguém se muda. Isso cai naturalmente nas fórmulas (soma 0 / multiplicação por 1).
- Resultados que excedem `Number.MAX_SAFE_INTEGER` lançam `RangeError` em vez de devolver um número impreciso.

## 6. Avaliação da eficácia dos testes (teste de mutação manual)

`scripts/mutation-check.sh` injeta 11 bugs, um por vez, e roda cada suíte separadamente.

| Mutante | Exemplos | Propriedades |
|---|---|---|
| M1 caso 1: soma → subtração | detecta | detecta |
| M2 caso 1: produto → soma | detecta | detecta |
| M3 caso 2: `ônibus+1` → `ônibus` | detecta | detecta |
| M4 caso 3: `pessoas+1` → `pessoas` | detecta | detecta |
| M5 caso 4: `n(n+1)/2` → `n(n-1)/2` | detecta | detecta |
| M6 caso 4: `/2` → `/3` | detecta | detecta |
| M7 `infinitePeople` invertido | detecta | detecta |
| M8 validação `r > 0` → `r >= 0` | detecta | **não detecta** |
| M9 `isCount` `>= 0` → `> 0` | detecta | detecta |
| M10 remove checagem de overflow | detecta | **não detecta** |
| M11 caso 2 usa `pessoas` no lugar de `ônibus` | detecta | detecta |

Achados:

1. As propriedades pegam todos os erros de fórmula, mas deixam passar M8 e M10: o gerador nunca produz quarto 0 nem números próximos de `MAX_SAFE_INTEGER`. Essas fronteiras só são cobertas porque os testes de valor limite existem. É a limitação de distribuição de geradores descrita por Goldstein et al. (2024).
2. Uma versão anterior tinha um ramo explícito "ninguém chega". Sua mutação (`||` → `&&`) sobreviveu. Era um mutante equivalente: o ramo era código morto, porque os casos degenerados já saem corretos das outras fórmulas. O ramo foi removido; EP-05 a EP-07 continuam garantindo o comportamento.
3. Cobertura: 100% de instruções, ramos, funções e linhas (`npm run test:coverage`, com limite mínimo de 100% no `package.json`).
