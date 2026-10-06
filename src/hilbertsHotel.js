'use strict';

/**
 * Hilbert's Hotel (Codewars kata 690743bd39f83ecf66068522)
 *
 * Todos os quartos estão ocupados. Chegam novos hóspedes e os atuais precisam
 * se mudar para abrir espaço. A função devolve, para cada quarto atual
 * (na mesma ordem de `rooms`), o número do quarto para onde o hóspede deve ir.
 *
 * Convenção: "infinito" é representado por `Infinity`.
 *
 * Casos:
 *  1) pessoas finitas  e ônibus finitos  -> quarto + (pessoas * ônibus)
 *  2) pessoas infinitas e ônibus finitos -> quarto * (ônibus + 1)
 *  3) pessoas finitas  e ônibus infinitos -> quarto * (pessoas + 1)
 *  4) pessoas infinitas e ônibus infinitos -> pareamento diagonal de Cantor:
 *     o hóspede G_n vai para o quarto n(n+1)/2
 *
 * Casos degenerados (pessoas = 0 ou ônibus = 0) caem naturalmente nas regras
 * acima e ninguém se muda: soma 0 no caso 1 e multiplicação por 1 nos casos
 * 2 e 3. (Um ramo explícito "ninguém chega" seria código morto: foi o mutante
 * equivalente M7 do teste de mutação que revelou isso.)
 *
 * @param {number[]} rooms  quartos atuais (inteiros positivos)
 * @param {number} people   pessoas por ônibus (inteiro >= 0 ou Infinity)
 * @param {number} buses    quantidade de ônibus (inteiro >= 0 ou Infinity)
 * @returns {number[]} novos quartos, na mesma ordem de `rooms`
 */
function hilbertsHotel(rooms, people, buses) {
  validate(rooms, people, buses);

  const infinitePeople = people === Infinity;
  const infiniteBuses = buses === Infinity;

  let move;
  if (infinitePeople && infiniteBuses) {
    move = (room) => (room * (room + 1)) / 2;
  } else if (infinitePeople) {
    move = (room) => room * (buses + 1);
  } else if (infiniteBuses) {
    move = (room) => room * (people + 1);
  } else {
    const shift = people * buses;
    move = (room) => room + shift;
  }

  return rooms.map((room) => {
    const next = move(room);
    if (!Number.isSafeInteger(next)) {
      throw new RangeError(`Novo quarto para ${room} excede o inteiro seguro`);
    }
    return next;
  });
}

function isCount(value) {
  return value === Infinity || (Number.isInteger(value) && value >= 0);
}

function validate(rooms, people, buses) {
  if (!Array.isArray(rooms)) {
    throw new TypeError('rooms deve ser um array');
  }
  if (!rooms.every((r) => Number.isInteger(r) && r > 0)) {
    throw new RangeError('rooms deve conter apenas inteiros positivos');
  }
  if (!isCount(people)) {
    throw new RangeError('people deve ser inteiro >= 0 ou Infinity');
  }
  if (!isCount(buses)) {
    throw new RangeError('buses deve ser inteiro >= 0 ou Infinity');
  }
}

module.exports = { hilbertsHotel, hilberts_hotel: hilbertsHotel };
