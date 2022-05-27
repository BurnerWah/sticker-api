/**
 * Given a character name, return a promise that resolves to the character's alias, or null if the
 * character has no alias.
 * @param {string} character - The character to get the alias for.
 * @returns A promise that resolves to a string or null.
 */
export function getCharacterAlias(character: string): Promise<string | null> {
  return NAME_ALIASES.get(character)
}

/**
 * It returns a promise that resolves to the sticker alias for the given character and sticker, or null
 * if there is no alias
 * @param {string} character - The character name.
 * @param {string} sticker - The name of the sticker.
 * @returns A Promise that resolves to a string or null.
 */
export function getStickerAlias(
  character: string,
  sticker: string,
): Promise<string | null> {
  return STICKER_ALIASES.get(`${character}:${sticker}`)
}
