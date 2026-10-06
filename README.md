# Hilbert's Hotel — Trabalho T1 (Verificação e Validação, PUCRS 2026/I)

![CI](https://github.com/gabrielcaamargo/t1-ver-e-val/actions/workflows/ci.yml/badge.svg)
![Cobertura](https://img.shields.io/badge/cobertura-100%25-brightgreen)
![Testes](https://img.shields.io/badge/testes-37%20passando-brightgreen)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933)

Kata: [Hilbert's Hotel](https://www.codewars.com/kata/690743bd39f83ecf66068522) (Codewars, 7 kyu).
Linguagem: JavaScript (Node 18+). Testes: Jest + [fast-check](https://github.com/dubzzz/fast-check).

## O problema

Um hotel com infinitos quartos está lotado. Chegam novos hóspedes (em ônibus, finitos ou infinitos, com pessoas finitas ou infinitas por ônibus) e os atuais precisam se mudar para liberar quartos. `hilbertsHotel(rooms, people, buses)` devolve o novo quarto de cada hóspede atual.

| Caso | Regra de mudança |
|---|---|
| pessoas finitas, ônibus finitos | `quarto + pessoas·ônibus` |
| pessoas infinitas, ônibus finitos | `quarto · (ônibus + 1)` |
| pessoas finitas, ônibus infinitos | `quarto · (pessoas + 1)` |
| pessoas infinitas, ônibus infinitos | `n(n+1)/2` (diagonais de Cantor) |

Infinito é `Infinity`.

```js
const { hilbertsHotel } = require('./src/hilbertsHotel');
hilbertsHotel([1, 2, 3, 4], 2, 2);            // [5, 6, 7, 8]
hilbertsHotel([1, 2, 3, 4], Infinity, 1);     // [2, 4, 6, 8]
hilbertsHotel([1, 2, 3, 4], Infinity, Infinity); // [1, 3, 6, 10]
```

## Estrutura

```
src/hilbertsHotel.js        solução do kata
tests/example.test.js       classes de equivalência (EP) e valor limite (BV)
tests/property.test.js      testes baseados em propriedades (PBT, fast-check)
tests/oracle.js             oráculos independentes usados pelo PBT
tests.md                    casos de teste documentados + rastreabilidade técnica→teste
scripts/mutation-check.sh   teste de mutação manual (avalia a eficácia dos testes)
docs/resenha.pdf            resenha crítica (2–4 páginas)
.github/workflows/ci.yml    integração contínua (bônus)
```

## Como rodar

```bash
npm install
npm test                  # todas as suítes
npm run test:coverage     # com cobertura (exige 100%)
./scripts/mutation-check.sh   # injeta 11 bugs e verifica se os testes os detectam
```

## Técnicas aplicadas

1. Particionamento em classes de equivalência (EP-xx)
2. Análise de valor limite (BV-xx)
3. Teste baseado em propriedades com oráculos, invariantes e propriedades metamórficas (PBT-xx)
4. Teste de mutação manual para avaliar a qualidade da suíte (bônus)

O mapeamento completo está em [`tests.md`](tests.md).

## Contribuições

| Integrante | Contribuição |
|---|---|
| Gabriel Bittencourt | Código |
| Henrique Bueno | Resenha |
| Mateus Neubarth | Resenha |

Todos os integrantes participaram da leitura dos artigos, da escrita da resenha e da revisão dos testes.

## Artigos resenhados

1. A. L. Corgozinho, M. T. Valente, H. Rocha. *How Developers Implement Property-Based Tests*. ICSME 2023 (NIER).
2. H. Goldstein, J. W. Cutler, D. Dickstein, B. C. Pierce, A. Head. *Property-Based Testing in Practice*. ICSE 2024.
3. B. K. Aichernig, R. Schumi. *Property-based testing of web services by deriving properties from business-rule models*. Software & Systems Modeling 18, 2019.
