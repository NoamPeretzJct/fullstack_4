export function addCharacter(textElements, char, currentStyle) {
  return [
    ...textElements,
    { id: crypto.randomUUID(), char, ...currentStyle },
  ]
}

export function deleteLastCharacter(textElements) {
  return textElements.slice(0, -1)
}

export function deleteLastWord(textElements) {
  const next = [...textElements]

  while (next.length > 0 && next[next.length - 1].char === ' ') {
    next.pop()
  }

  while (next.length > 0 && next[next.length - 1].char !== ' ') {
    next.pop()
  }

  return next
}

export function clearText() {
  return []
}

export function applyStyleToText(textElements, key, value) {
  return textElements.map((item) => ({ ...item, [key]: value }))
}

export function replaceCharacters(textElements, oldChar, newChar) {
  const hasMatch = textElements.some((item) => item.char === oldChar)
  if (!hasMatch) {
    return { success: false, textElements }
  }

  return {
    success: true,
    textElements: textElements.map((item) =>
      item.char === oldChar ? { ...item, char: newChar } : item,
    ),
  }
}
