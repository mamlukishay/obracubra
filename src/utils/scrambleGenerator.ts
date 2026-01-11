/**
 * Standard 3x3 Rubik's Cube move notation
 */
const FACES = ['R', 'L', 'U', 'D', 'F', 'B'] as const
const MODIFIERS = ['', "'", '2'] as const

/**
 * Opposite faces - moves on opposite faces can be in any order
 * but we avoid them consecutively for cleaner scrambles
 */
const OPPOSITE_FACES: Record<string, string> = {
  R: 'L',
  L: 'R',
  U: 'D',
  D: 'U',
  F: 'B',
  B: 'F',
}

/**
 * Generate a random 3x3 scramble following standard notation
 * @param length Number of moves (default: 20, standard for 3x3)
 * @returns Scramble string like "R U2 F' B L D2 R' F U B'"
 */
export function generateScramble(length: number = 20): string {
  const moves: string[] = []
  let lastFace = ''
  let secondLastFace = ''

  for (let i = 0; i < length; i++) {
    // Filter out invalid faces
    const validFaces = FACES.filter((face) => {
      // Cannot be same as last move's face
      if (face === lastFace) return false

      // If last two moves were on same axis (opposite faces),
      // this move cannot be on that axis (avoids R L R sequences)
      if (
        secondLastFace &&
        OPPOSITE_FACES[lastFace] === secondLastFace &&
        (face === lastFace || face === secondLastFace)
      ) {
        return false
      }

      return true
    })

    // Pick random face and modifier
    const face = validFaces[Math.floor(Math.random() * validFaces.length)]
    const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)]

    moves.push(face + modifier)
    secondLastFace = lastFace
    lastFace = face
  }

  return moves.join(' ')
}
