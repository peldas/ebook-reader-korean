/**
 * @license BSD-3-Clause
 * Copyright (c) 2023, ッツ Reader Authors
 * All rights reserved.
 */

export enum LocalFont {
  BIZUDGOTHIC = 'BIZ UDGothic',
  BIZUDMINCHO = 'BIZ UDMincho',
  GENEI = 'Genei Koburi Mincho v5',
  KLEEONE = 'Klee One',
  KLEEONESEMIBOLD = 'Klee One SemiBold',
  NOTOSANSKR = 'Noto Sans KR',
  NOTOSERIFKR = 'Noto Serif KR',
  SHIPPORIMINCHO = 'Shippori Mincho'
}

export interface UserFont {
  name: string;
  path: string;
  fileName: string;
}

export const userFontsCacheName = 'ttu-userfonts';

export const reservedFontNames = new Set([
  'BIZ UDGothic',
  'BIZ UDMincho',
  'Genei Koburi Mincho v5',
  'Klee One',
  'Klee One SemiBold',
  'Noto Sans KR',
  'Noto Serif KR',
  'Shippori Mincho'
]);

export function isStoredFont(fontName: string, userFonts: UserFont[]) {
  return (
    reservedFontNames.has(fontName) || !!userFonts.find((userFont) => userFont.name === fontName)
  );
}
