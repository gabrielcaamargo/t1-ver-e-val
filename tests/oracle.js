'use strict';

/**
 * Oráculos independentes da implementação, usados nos testes de propriedade
 * (técnica "test oracle" / differential testing, Corgozinho et al. 2023;
 * Goldstein et al. 2024). Eles NÃO usam as fórmulas fechadas de src/:
 * constroem explicitamente a lista de quem ocupa cada quarto, como nos
 * desenhos do enunciado do kata.
 */

/** range(a, b) estilo Python: [a, a+1, ..., b-1] */
function range(a, b) {
  const out = [];
  for (let i = a; i < b; i++) out.push(i);
  return out;
}

/**
 * Caso 1 (finito/finito): enumera cada passageiro (ônibus x assento) e
 * monta a disposição dos quartos: primeiro os passageiros, depois os hóspedes.
 * Devolve os `length` primeiros rótulos de quarto.
 */
function arrangementFinite(people, buses, length) {
  const seats = [];
  for (let b = 1; b <= buses; b++) {
    for (let s = 1; s <= people; s++) seats.push(`B${b}S${s}`);
  }
  const layout = [...seats];
  for (let g = 1; layout.length < length; g++) layout.push(`G${g}`);
  return layout.slice(0, length);
}

/**
 * Caso 4 (infinito/infinito): enumera as diagonais de Cantor.
 * Diagonal d: B(d-1)S1, B(d-2)S2, ..., B1S(d-1), G_d
 */
function arrangementCantor(length) {
  const layout = [];
  for (let d = 1; layout.length < length; d++) {
    for (let k = d - 1; k >= 1; k--) layout.push(`B${k}S${d - k}`);
    layout.push(`G${d}`);
  }
  return layout.slice(0, length);
}

/**
 * Casos 2 e 3: a cada bloco de (k+1) quartos, o último é de um hóspede e os
 * k primeiros são de passageiros (um por "grupo" k). Rótulo do quarto `room`
 * (1-based) para k grupos de passageiros infinitos.
 */
function labelInterleaved(room, k) {
  const slot = room % (k + 1);
  const round = Math.floor((room - 1) / (k + 1)) + 1;
  return slot === 0 ? `G${room / (k + 1)}` : `P${slot}-${round}`;
}

module.exports = { range, arrangementFinite, arrangementCantor, labelInterleaved };
