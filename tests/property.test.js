'use strict';

/**
 * Testes baseados em propriedades (fast-check), IDs PBT-xx.
 *
 * Categorias de propriedade (Corgozinho et al., 2023; Goldstein et al., 2024):
 *  - test oracle / differential: PBT-04, PBT-05, PBT-06
 *  - invariantes ("some things never change"): PBT-01, PBT-03
 *  - saídas dentro de limites esperados:        PBT-02
 *  - metamórficas:                              PBT-08, PBT-09
 *  - falhas catastróficas / entradas inválidas: PBT-10
 */

const fc = require('fast-check');
const { hilbertsHotel } = require('../src/hilbertsHotel');
const { range, arrangementFinite, arrangementCantor, labelInterleaved } = require('./oracle');

const INF = Infinity;
const NUM_RUNS = 300; // mantém a suíte rápida (OB3 de Goldstein et al.)

// Geradores (strategies)
const finiteCount = fc.integer({ min: 0, max: 25 });
const count = fc.oneof({ weight: 3, arbitrary: finiteCount }, { weight: 1, arbitrary: fc.constant(INF) });
const positiveFinite = fc.integer({ min: 1, max: 25 });
const roomsRange = fc
  .tuple(fc.integer({ min: 1, max: 500 }), fc.integer({ min: 0, max: 40 }))
  .map(([start, len]) => range(start, start + len));
// Quartos 1..n: hotel "completo" a partir do quarto 1, como no enunciado
const fullRooms = fc.integer({ min: 1, max: 40 }).map((n) => range(1, n + 1));

describe('Propriedades de PBT', () => {
  test('PBT-01 injetividade: dois hóspedes nunca vão para o mesmo quarto', () => {
    fc.assert(
      fc.property(roomsRange, count, count, (rooms, p, b) => {
        const out = hilbertsHotel(rooms, p, b);
        return new Set(out).size === out.length;
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-02 limites: ninguém vai para um quarto menor e a ordem relativa é preservada', () => {
    fc.assert(
      fc.property(roomsRange, count, count, (rooms, p, b) => {
        const out = hilbertsHotel(rooms, p, b);
        const noOneMovesBack = out.every((room, i) => room >= rooms[i]);
        const orderKept = out.every((room, i) => i === 0 || room > out[i - 1]);
        return noOneMovesBack && orderKept;
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-03 o resultado tem o mesmo tamanho da entrada e a função é pura', () => {
    fc.assert(
      fc.property(roomsRange, count, count, (rooms, p, b) => {
        const copy = [...rooms];
        const out = hilbertsHotel(rooms, p, b);
        const again = hilbertsHotel(rooms, p, b);
        return out.length === rooms.length && rooms.every((r, i) => r === copy[i]) && out.every((r, i) => r === again[i]);
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-04 oráculo (caso 1): cada hóspede cai no rótulo G_i da disposição enumerada passageiro a passageiro', () => {
    fc.assert(
      fc.property(fullRooms, finiteCount, finiteCount, (rooms, p, b) => {
        const out = hilbertsHotel(rooms, p, b);
        const layout = arrangementFinite(p, b, Math.max(...out));
        // todo quarto abaixo de total+1 é de passageiro e cada hóspede i está em G_i
        return out.every((room, i) => layout[room - 1] === `G${rooms[i]}`);
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-05 oráculo (casos 2 e 3): hóspede i cai em G_i e não sobra quarto vazio', () => {
    fc.assert(
      fc.property(fullRooms, positiveFinite, fc.boolean(), (rooms, k, infinitePeople) => {
        const [p, b] = infinitePeople ? [INF, k] : [k, INF];
        const out = hilbertsHotel(rooms, p, b);
        const lastRoom = out[out.length - 1];
        const labels = range(1, lastRoom + 1).map((r) => labelInterleaved(r, k));
        const guestsOk = out.every((room, i) => labels[room - 1] === `G${rooms[i]}`);
        // nenhum rótulo de passageiro repetido => nenhum quarto atribuído duas vezes
        const passengerLabels = labels.filter((l) => l.startsWith('P'));
        const passengersUnique = new Set(passengerLabels).size === passengerLabels.length;
        // entre 1 e lastRoom: n hóspedes + n*k passageiros, sem buracos
        const freeRooms = lastRoom - out.length;
        return guestsOk && passengersUnique && freeRooms === rooms.length * k;
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-06 oráculo (caso 4): hóspede i cai em G_i na enumeração das diagonais de Cantor', () => {
    fc.assert(
      fc.property(fullRooms, (rooms) => {
        const out = hilbertsHotel(rooms, INF, INF);
        const layout = arrangementCantor(Math.max(...out));
        return out.every((room, i) => layout[room - 1] === `G${rooms[i]}`);
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-07 sem buracos (caso 1, rooms 1..n): os quartos livres são exatamente 1..pessoas*ônibus', () => {
    fc.assert(
      fc.property(fullRooms, finiteCount, finiteCount, (rooms, p, b) => {
        const out = hilbertsHotel(rooms, p, b);
        return Math.min(...out) === p * b + 1;
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-08 metamórfica: trocar (∞ pessoas, k ônibus) por (k pessoas, ∞ ônibus) não muda o resultado', () => {
    fc.assert(
      fc.property(roomsRange, positiveFinite, (rooms, k) => {
        const a = hilbertsHotel(rooms, INF, k);
        const b = hilbertsHotel(rooms, k, INF);
        return a.every((r, i) => r === b[i]);
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-09 metamórfica: duas chegadas finitas seguidas equivalem a uma chegada com o total somado', () => {
    fc.assert(
      fc.property(roomsRange, finiteCount, finiteCount, finiteCount, finiteCount, (rooms, p1, b1, p2, b2) => {
        const twice = hilbertsHotel(hilbertsHotel(rooms, p1, b1), p2, b2);
        const once = hilbertsHotel(rooms, 1, p1 * b1 + p2 * b2);
        return twice.every((r, i) => r === once[i]);
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-10 entradas inválidas sempre lançam erro de tipo/faixa e nunca devolvem lixo', () => {
    const invalidCount = fc.oneof(
      fc.integer({ min: -1000, max: -1 }),
      fc.double({ noInteger: true, noNaN: true, noDefaultInfinity: true }),
      fc.constant(NaN),
      fc.constant(-Infinity),
      fc.string()
    );
    fc.assert(
      fc.property(roomsRange, invalidCount, count, fc.boolean(), (rooms, bad, ok, badFirst) => {
        const args = badFirst ? [bad, ok] : [ok, bad];
        try {
          hilbertsHotel(rooms, ...args);
          return false;
        } catch (e) {
          return e instanceof RangeError || e instanceof TypeError;
        }
      }),
      { numRuns: NUM_RUNS }
    );
  });

  test('PBT-11 sem chegadas (people=0 ou buses=0) a saída é idêntica à entrada', () => {
    fc.assert(
      fc.property(roomsRange, count, fc.boolean(), (rooms, other, zeroPeople) => {
        const out = zeroPeople ? hilbertsHotel(rooms, 0, other) : hilbertsHotel(rooms, other, 0);
        return out.length === rooms.length && out.every((r, i) => r === rooms[i]);
      }),
      { numRuns: NUM_RUNS }
    );
  });
});
