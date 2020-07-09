/** @format */

import generate from "nanoid/generate";
export function genNum(size: number) {
  const numbers = "1234567890";
  return generate(numbers, size);
}

export function genSmallAlpha(size: number) {
  const smallAlpha = "qazxswedcvfrtgbnhyujmkiolp";
  return generate(smallAlpha, size);
}

export function genCapAlpha(size: number) {
  const capAlpha = "QAZXSWEDCVFRTGBNHYUJMKIOLP";
  return generate(capAlpha, size);
}

export function genSym(size: number) {
  const sym = "!@#$%&*=?";
  return generate(sym, size);
}

export function genId(size: number, all?: boolean) {
  if (all) {
    const alphaNum =
      "AQZ01aqWSXz2MPLNKO3wsxCDE4cRFVdBHUe5rfv6bgt7GTyhn8uYUIjm9kilop";
    return generate(alphaNum, size);
  } else return genNum(8);
}

export function genPass(type: string) {
  if (type === "mngr")
    return (
      genSmallAlpha(1) +
      genCapAlpha(1) +
      genSym(1) +
      genSmallAlpha(2) +
      genNum(1) +
      genCapAlpha(2) +
      genNum(1) +
      genSym(1)
    );
  else if (type === "admin")
    return (
      genCapAlpha(2) +
      genSym(1) +
      genNum(2) +
      genSmallAlpha(2) +
      genNum(2) +
      genSym(1)
    );
  else return genId(8);
}
