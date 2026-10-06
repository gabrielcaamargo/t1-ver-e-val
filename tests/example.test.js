'use strict';

/**
 * Testes baseados em exemplos.
 *  - Particionamento em classes de equivalência: IDs EP-xx
 *  - Análise de valor limite:                   IDs BV-xx
 * Rastreabilidade técnica -> teste em /tests.md
 */

const { hilbertsHotel, hilberts_hotel } = require('../src/hilbertsHotel');
const { range } = require('./oracle');

const INF = Infinity;

describe('Particionamento em classes de equivalência (EP)', () => {
  test('EP-01 finito/finito: 2 ônibus x 2 pessoas empurra 4 quartos (exemplo do kata)', () => {
    expect(hilbertsHotel(range(1, 9), 2, 2)).toEqual([5, 6, 7, 8, 9, 10, 11, 12]);
  });

  test('EP-02 pessoas infinitas, ônibus finito: quarto * (ônibus + 1) (exemplo do kata)', () => {
    expect(hilbertsHotel(range(1, 9), INF, 1)).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
  });

  test('EP-02b pessoas infinitas, 3 ônibus: multiplica por 4', () => {
    expect(hilbertsHotel([1, 2, 3], INF, 3)).toEqual([4, 8, 12]);
  });

  test('EP-03 pessoas finitas, ônibus infinitos: 1 pessoa por ônibus dobra o quarto (exemplo do kata)', () => {
    expect(hilbertsHotel(range(1, 9), 1, INF)).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
  });

  test('EP-03b pessoas finitas, ônibus infinitos: 3 pessoas por ônibus multiplica por 4', () => {
    expect(hilbertsHotel([1, 2, 3], 3, INF)).toEqual([4, 8, 12]);
  });

  test('EP-04 infinito/infinito: pareamento diagonal de Cantor (exemplo do kata)', () => {
    expect(hilbertsHotel(range(1, 11), INF, INF)).toEqual([1, 3, 6, 10, 15, 21, 28, 36, 45, 55]);
  });

  test('EP-05 ninguém chega (0 pessoas por ônibus): ninguém se muda', () => {
    expect(hilbertsHotel([1, 2, 3], 0, 5)).toEqual([1, 2, 3]);
  });

  test('EP-06 ninguém chega (0 ônibus): ninguém se muda', () => {
    expect(hilbertsHotel([1, 2, 3], 5, 0)).toEqual([1, 2, 3]);
  });

  test('EP-07 pessoas infinitas mas 0 ônibus: ninguém chega, ninguém se muda', () => {
    expect(hilbertsHotel([1, 2, 3], INF, 0)).toEqual([1, 2, 3]);
  });

  test('EP-07b 0 pessoas e infinitos ônibus: ninguém chega, ninguém se muda', () => {
    expect(hilbertsHotel([1, 2, 3], 0, INF)).toEqual([1, 2, 3]);
  });

  test('EP-08 lista de quartos vazia devolve lista vazia', () => {
    expect(hilbertsHotel([], 3, 3)).toEqual([]);
    expect(hilbertsHotel([], INF, INF)).toEqual([]);
  });

  test('EP-09 rooms inválido (não é array) lança TypeError', () => {
    expect(() => hilbertsHotel('1,2,3', 1, 1)).toThrow(TypeError);
    expect(() => hilbertsHotel(undefined, 1, 1)).toThrow(TypeError);
    expect(() => hilbertsHotel(null, 1, 1)).toThrow(TypeError);
  });

  test('EP-10 people inválido lança RangeError', () => {
    expect(() => hilbertsHotel([1], -1, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([1], 1.5, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([1], '2', 1)).toThrow(RangeError);
  });

  test('EP-11 buses inválido lança RangeError', () => {
    expect(() => hilbertsHotel([1], 1, -1)).toThrow(RangeError);
    expect(() => hilbertsHotel([1], 1, NaN)).toThrow(RangeError);
    expect(() => hilbertsHotel([1], 1, -Infinity)).toThrow(RangeError);
  });

  test('EP-12 alias hilberts_hotel (nome do kata) aponta para a mesma função', () => {
    expect(hilberts_hotel).toBe(hilbertsHotel);
  });
});

describe('Análise de valor limite (BV)', () => {
  test('BV-01 um único quarto (limite inferior do tamanho de rooms)', () => {
    expect(hilbertsHotel([1], 1, 1)).toEqual([2]);
    expect(hilbertsHotel([1], INF, INF)).toEqual([1]);
  });

  test('BV-02 menor chegada não nula: 1 pessoa em 1 ônibus empurra 1 quarto', () => {
    expect(hilbertsHotel([1, 2, 3], 1, 1)).toEqual([2, 3, 4]);
  });

  test('BV-03 fronteira 0/1 em people e em buses', () => {
    expect(hilbertsHotel([4], 0, 1)).toEqual([4]);
    expect(hilbertsHotel([4], 1, 1)).toEqual([5]);
    expect(hilbertsHotel([4], 1, 0)).toEqual([4]);
  });

  test('BV-04 1 ônibus com infinitas pessoas dobra o quarto (menor ônibus finito possível)', () => {
    expect(hilbertsHotel([1, 2, 3, 4], INF, 1)).toEqual([2, 4, 6, 8]);
  });

  test('BV-05 intervalo de rooms que não começa em 1', () => {
    expect(hilbertsHotel(range(5, 8), 2, 2)).toEqual([9, 10, 11]);
    expect(hilbertsHotel(range(5, 8), INF, 2)).toEqual([15, 18, 21]);
    expect(hilbertsHotel(range(5, 8), INF, INF)).toEqual([15, 21, 28]);
  });

  test('BV-06 primeiras diagonais de Cantor (quartos 1 a 5)', () => {
    expect(hilbertsHotel([1, 2, 3, 4, 5], INF, INF)).toEqual([1, 3, 6, 10, 15]);
  });

  test('BV-07 quarto 0 e negativos são inválidos (fronteira inferior de rooms)', () => {
    expect(() => hilbertsHotel([0], 1, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([-1], 1, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([1, 2, 0], 1, 1)).toThrow(RangeError);
  });

  test('BV-08 quarto não inteiro ou NaN é inválido', () => {
    expect(() => hilbertsHotel([1.5], 1, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([NaN], 1, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([Infinity], 1, 1)).toThrow(RangeError);
  });

  test('BV-09 estouro do inteiro seguro lança RangeError (limite superior)', () => {
    const big = Number.MAX_SAFE_INTEGER;
    expect(() => hilbertsHotel([big], 1, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([big], INF, 1)).toThrow(RangeError);
    expect(() => hilbertsHotel([big], 1, INF)).toThrow(RangeError);
    expect(() => hilbertsHotel([big], INF, INF)).toThrow(RangeError);
  });

  test('BV-10 último valor que ainda cabe no inteiro seguro', () => {
    const last = Number.MAX_SAFE_INTEGER - 1;
    expect(hilbertsHotel([last], 1, 1)).toEqual([Number.MAX_SAFE_INTEGER]);
  });

  test('BV-11 a entrada não é modificada', () => {
    const rooms = [1, 2, 3];
    hilbertsHotel(rooms, 2, 2);
    expect(rooms).toEqual([1, 2, 3]);
  });
});
