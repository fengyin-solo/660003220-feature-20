import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MoleculeData, ADMETProps } from '../types'

export const ATOM_COLORS: Record<string, string> = {
  H: '#ffffff',
  He: '#d9ffff',
  Li: '#cc80ff',
  Be: '#c2ff00',
  B: '#ffb5b5',
  C: '#6b7280',
  N: '#3b82f6',
  O: '#ef4444',
  F: '#90e050',
  Ne: '#b3e3f5',
  Na: '#ab5cf2',
  Mg: '#8aff00',
  Al: '#bfa6a6',
  Si: '#f0c8a0',
  P: '#ff8000',
  S: '#eab308',
  Cl: '#1ff01f',
  Ar: '#80d1e3',
  K: '#8f40d4',
  Ca: '#3dff00',
  Sc: '#e6e6e6',
  Ti: '#bfc2c7',
  V: '#a6a6ab',
  Cr: '#8a99c7',
  Mn: '#9c7ac7',
  Fe: '#e06633',
  Co: '#f090a0',
  Ni: '#50d050',
  Cu: '#c88033',
  Zn: '#7d80b0',
  Ga: '#c28f8f',
  Ge: '#668f8f',
  As: '#bd80e3',
  Se: '#ffa100',
  Br: '#a62929',
  Kr: '#5cb8d1',
  Rb: '#702eb0',
  Sr: '#00ff00',
  Y: '#94ffff',
  Zr: '#94e0e0',
  Nb: '#73c2c9',
  Mo: '#54b5b5',
  Tc: '#3b9e9e',
  Ru: '#248f8f',
  Rh: '#0a7d8c',
  Pd: '#006985',
  Ag: '#c0c0c0',
  Cd: '#ffd98f',
  In: '#a67573',
  Sn: '#668080',
  Sb: '#9e63b5',
  Te: '#d47a00',
  I: '#940094',
  Xe: '#429eb0',
  Cs: '#57178f',
  Ba: '#00c900',
  La: '#70d4ff',
  Ce: '#ffffc7',
  Pr: '#d9ffc7',
  Nd: '#c7ffc7',
  Pm: '#a3ffc7',
  Sm: '#8fffc7',
  Eu: '#61ffc7',
  Gd: '#45ffc7',
  Tb: '#30ffc7',
  Dy: '#1fffc7',
  Ho: '#00ff9c',
  Er: '#00e675',
  Tm: '#00d452',
  Yb: '#00bf38',
  Lu: '#00ab24',
  Hf: '#4dc2ff',
  Ta: '#4da6ff',
  W: '#2194d6',
  Re: '#267dab',
  Os: '#266696',
  Ir: '#175487',
  Pt: '#d0d0e0',
  Au: '#ffd123',
  Hg: '#b8b8d0',
  Tl: '#a6544d',
  Pb: '#575961',
  Bi: '#9e4fb5',
  Po: '#ab5c00',
  At: '#754f45',
  Rn: '#428296',
  Fr: '#420066',
  Ra: '#007d00',
  Ac: '#70abfa',
  Th: '#00baff',
  Pa: '#00a1ff',
  U: '#008fff'
}

export const ATOM_RADII: Record<string, number> = {
  H: 0.31,
  He: 0.28,
  Li: 1.28,
  Be: 0.96,
  B: 0.84,
  C: 0.76,
  N: 0.71,
  O: 0.66,
  F: 0.57,
  Ne: 0.58,
  Na: 1.66,
  Mg: 1.41,
  Al: 1.21,
  Si: 1.11,
  P: 1.07,
  S: 1.05,
  Cl: 1.02,
  Ar: 1.06,
  K: 2.03,
  Ca: 1.76,
  Sc: 1.70,
  Ti: 1.60,
  V: 1.53,
  Cr: 1.39,
  Mn: 1.39,
  Fe: 1.32,
  Co: 1.26,
  Ni: 1.24,
  Cu: 1.32,
  Zn: 1.22,
  Ga: 1.22,
  Ge: 1.20,
  As: 1.19,
  Se: 1.20,
  Br: 1.20,
  Kr: 1.16,
  Rb: 2.20,
  Sr: 1.95,
  Y: 1.90,
  Zr: 1.75,
  Nb: 1.64,
  Mo: 1.54,
  Tc: 1.47,
  Ru: 1.46,
  Rh: 1.42,
  Pd: 1.39,
  Ag: 1.45,
  Cd: 1.44,
  In: 1.42,
  Sn: 1.39,
  Sb: 1.39,
  Te: 1.38,
  I: 1.39,
  Xe: 1.40,
  Cs: 2.44,
  Ba: 2.15,
  La: 2.07,
  Ce: 2.04,
  Pr: 2.03,
  Nd: 2.01,
  Pm: 1.99,
  Sm: 1.98,
  Eu: 1.98,
  Gd: 1.96,
  Tb: 1.94,
  Dy: 1.92,
  Ho: 1.92,
  Er: 1.89,
  Tm: 1.90,
  Yb: 1.87,
  Lu: 1.87,
  Hf: 1.75,
  Ta: 1.70,
  W: 1.62,
  Re: 1.51,
  Os: 1.44,
  Ir: 1.41,
  Pt: 1.36,
  Au: 1.36,
  Hg: 1.32,
  Tl: 1.45,
  Pb: 1.46,
  Bi: 1.48,
  Po: 1.40,
  At: 1.50,
  Rn: 1.50,
  Fr: 2.60,
  Ra: 2.21,
  Ac: 2.15,
  Th: 2.06,
  Pa: 2.00,
  U: 1.96,
  Np: 1.90,
  Pu: 1.87
}

export const VALID_ELEMENTS = new Set([
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
  'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
  'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
  'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
  'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
  'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
  'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
  'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
  'Pa', 'U', 'Np', 'Pu'
])

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateSMILES(smiles: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const trimmed = smiles.trim()

  if (!trimmed) {
    errors.push('SMILES 字符串不能为空')
    return { valid: false, errors, warnings }
  }

  if (trimmed.length > 1000) {
    errors.push('SMILES 字符串过长（超过1000个字符）')
  }

  if (trimmed.length < 1) {
    errors.push('SMILES 字符串过短')
  }

  const validCharsRegex = /^[A-Za-z0-9\-=#()\[\]@+.\s/\\]*$/
  if (!validCharsRegex.test(trimmed)) {
    const invalidChars: string[] = []
    for (const ch of trimmed) {
      if (!/[A-Za-z0-9\-=#()\[\]@+.\s/\\]/.test(ch) && !invalidChars.includes(ch)) {
        invalidChars.push(ch)
      }
    }
    errors.push(`包含无效字符: ${invalidChars.join(', ')}`)
  }

  let parenDepth = 0
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]
    if (ch === '(') parenDepth++
    if (ch === ')') {
      parenDepth--
      if (parenDepth < 0) {
        errors.push('括号不匹配：存在多余的右括号')
        break
      }
    }
  }
  if (parenDepth > 0) {
    errors.push(`括号不匹配：缺少 ${parenDepth} 个右括号`)
  }

  let bracketDepth = 0
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]
    if (ch === '[') bracketDepth++
    if (ch === ']') {
      bracketDepth--
      if (bracketDepth < 0) {
        errors.push('方括号不匹配：存在多余的右方括号')
        break
      }
    }
  }
  if (bracketDepth > 0) {
    errors.push(`方括号不匹配：缺少 ${bracketDepth} 个右方括号`)
  }

  const ringMap = new Map<number, number>()
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]
    if (/\d/.test(ch)) {
      const ringNum = parseInt(ch, 10)
      if (ringMap.has(ringNum)) {
        ringMap.set(ringNum, ringMap.get(ringNum)! + 1)
      } else {
        ringMap.set(ringNum, 1)
      }
    }
  }
  for (const [ringNum, count] of ringMap.entries()) {
    if (count % 2 !== 0) {
      warnings.push(`环编号 ${ringNum} 未正确配对`)
    }
  }

  const twoLetterElements = [
    'He', 'Li', 'Be', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'Cl', 'Ar',
    'Ca', 'Sc', 'Ti', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Zr', 'Nb',
    'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb',
    'Te', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm',
    'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf',
    'Ta', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi',
    'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'Np', 'Pu'
  ]
  const singleLetterElements = ['H', 'B', 'C', 'N', 'O', 'F', 'P', 'S', 'K', 'V', 'Y', 'I', 'W', 'U']

  let i = 0
  while (i < trimmed.length) {
    const ch = trimmed[i]
    if (ch === '[') {
      const end = trimmed.indexOf(']', i)
      if (end === -1) break
      const bracketContent = trimmed.substring(i + 1, end)
      let elem = ''
      let j = 0
      while (j < bracketContent.length && /[A-Za-z]/.test(bracketContent[j])) {
        elem += bracketContent[j]
        j++
      }
      if (elem) {
        const capitalized = elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase()
        if (!VALID_ELEMENTS.has(capitalized)) {
          errors.push(`无效的元素符号: ${elem}`)
        }
      }
      i = end + 1
    } else if (/[A-Z]/.test(ch)) {
      if (i + 1 < trimmed.length && /[a-z]/.test(trimmed[i + 1])) {
        const twoElem = ch + trimmed[i + 1]
        if (!twoLetterElements.includes(twoElem)) {
          errors.push(`无效的双字母元素符号: ${twoElem}`)
        }
        i += 2
      } else {
        if (!singleLetterElements.includes(ch)) {
          errors.push(`无效的单字母元素符号: ${ch}`)
        }
        i++
      }
    } else if (/[a-z]/.test(ch)) {
      i++
    } else {
      i++
    }
  }

  const bondSymbols = ['=', '#', '-']
  for (const sym of bondSymbols) {
    if (trimmed.endsWith(sym)) {
      errors.push(`键符号 '${sym}' 不能出现在 SMILES 末尾`)
    }
  }

  let hasAtom = false
  for (const ch of trimmed) {
    if (/[A-Za-z]/.test(ch)) {
      hasAtom = true
      break
    }
  }
  if (!hasAtom) {
    errors.push('SMILES 必须至少包含一个原子')
  }

  for (let idx = 0; idx < trimmed.length - 1; idx++) {
    const cur = trimmed[idx]
    const next = trimmed[idx + 1]
    if (bondSymbols.includes(cur) && bondSymbols.includes(next)) {
      warnings.push(`连续键符号 '${cur}${next}' 可能不正确`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export interface ParseResult {
  atoms: Array<{ element: string; x: number; y: number; z: number; color: string; radius: number }>
  bonds: Array<{ atom1: number; atom2: number; order: number }>
}

export function parseSMILES(smiles: string): ParseResult {
  const atoms: ParseResult['atoms'] = []
  const bonds: ParseResult['bonds'] = []
  const trimmed = smiles.trim()

  const stack: number[] = []
  const ringClosures: Map<number, number> = new Map()
  let prevAtom: number | null = null
  let currentBondOrder = 1

  const twoLetterElems = [
    'He', 'Li', 'Be', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'Cl', 'Ar',
    'Ca', 'Sc', 'Ti', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Zr', 'Nb',
    'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb',
    'Te', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm',
    'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf',
    'Ta', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi',
    'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'Np', 'Pu'
  ]
  const aromaticAtoms = new Set(['b', 'c', 'n', 'o', 'p', 's'])

  const addAtom = (element: string, aromatic: boolean = false) => {
    const normalized = aromatic ? element.toUpperCase() : element
    const color = ATOM_COLORS[normalized] || '#cccccc'
    const radius = ATOM_RADII[normalized] || 1.0

    const idx = atoms.length
    let x = 0, y = 0, z = 0

    if (idx === 0) {
      x = 0; y = 0; z = 0
    } else {
      const parent = prevAtom ?? 0
      const parentAtom = atoms[parent]
      const angle = (idx * 109.5 * Math.PI) / 180
      x = parentAtom.x + Math.cos(angle) * (parentAtom.radius + radius + 0.3)
      y = parentAtom.y + Math.sin(angle) * (parentAtom.radius + radius + 0.3)
      z = parentAtom.z + (Math.random() - 0.5) * 0.1
    }

    atoms.push({ element: normalized, x, y, z, color, radius })
    const atomIdx = atoms.length - 1

    if (prevAtom !== null) {
      bonds.push({ atom1: prevAtom, atom2: atomIdx, order: aromatic ? 1.5 : currentBondOrder })
    }

    prevAtom = atomIdx
    currentBondOrder = 1
    return atomIdx
  }

  let i = 0
  while (i < trimmed.length) {
    const ch = trimmed[i]

    if (ch === '=') {
      currentBondOrder = 2
      i++
    } else if (ch === '#') {
      currentBondOrder = 3
      i++
    } else if (ch === '-') {
      currentBondOrder = 1
      i++
    } else if (ch === '(') {
      stack.push(prevAtom ?? 0)
      i++
    } else if (ch === ')') {
      if (stack.length > 0) {
        prevAtom = stack.pop()!
      }
      i++
    } else if (ch === '[') {
      const end = trimmed.indexOf(']', i)
      if (end === -1) {
        i++
        continue
      }
      const content = trimmed.substring(i + 1, end)
      let elem = ''
      let j = 0
      while (j < content.length && /[A-Za-z]/.test(content[j])) {
        elem += content[j]
        j++
      }
      if (elem) {
        const capitalized = elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase()
        addAtom(capitalized, false)
      }
      i = end + 1
    } else if (/\d/.test(ch)) {
      const ringNum = parseInt(ch, 10)
      if (ringClosures.has(ringNum)) {
        const other = ringClosures.get(ringNum)!
        if (prevAtom !== null) {
          bonds.push({ atom1: other, atom2: prevAtom, order: currentBondOrder })
        }
        ringClosures.delete(ringNum)
      } else {
        ringClosures.set(ringNum, prevAtom ?? 0)
      }
      currentBondOrder = 1
      i++
    } else if (/[A-Z]/.test(ch)) {
      if (i + 1 < trimmed.length && /[a-z]/.test(trimmed[i + 1])) {
        const twoElem = ch + trimmed[i + 1]
        if (twoLetterElems.includes(twoElem)) {
          addAtom(twoElem, false)
          i += 2
        } else {
          addAtom(ch, false)
          i++
        }
      } else {
        addAtom(ch, false)
        i++
      }
    } else if (aromaticAtoms.has(ch)) {
      addAtom(ch, true)
      i++
    } else {
      i++
    }
  }

  return { atoms, bonds }
}

export function estimateFormulaFromAtoms(atoms: ParseResult['atoms']): string {
  const counts: Record<string, number> = {}
  for (const atom of atoms) {
    const elem = atom.element
    counts[elem] = (counts[elem] || 0) + 1
  }

  const order = ['C', 'H', 'N', 'O', 'S', 'P', 'F', 'Cl', 'Br', 'I']
  const parts: string[] = []

  for (const elem of order) {
    if (counts[elem]) {
      parts.push(counts[elem] === 1 ? elem : `${elem}${counts[elem]}`)
      delete counts[elem]
    }
  }

  const remaining = Object.keys(counts).sort()
  for (const elem of remaining) {
    parts.push(counts[elem] === 1 ? elem : `${elem}${counts[elem]}`)
  }

  return parts.join('')
}

export function estimateMW(formula: string): number {
  const atomicWeights: Record<string, number> = {
    H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.011,
    N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
    Al: 26.982, Si: 28.086, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948,
    K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
    Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
    Ga: 69.723, Ge: 72.63, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
    Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95,
    Tc: 98, Ru: 101.07, Rh: 102.906, Pd: 106.42, Ag: 107.868, Cd: 112.414,
    In: 114.818, Sn: 118.71, Sb: 121.76, Te: 127.6, I: 126.904, Xe: 131.293,
    Cs: 132.905, Ba: 137.327, La: 138.905, Ce: 140.116, Pr: 140.908, Nd: 144.242,
    Pm: 145, Sm: 150.36, Eu: 151.964, Gd: 157.25, Tb: 158.925, Dy: 162.5,
    Ho: 164.93, Er: 167.259, Tm: 168.934, Yb: 173.045, Lu: 174.967, Hf: 178.486,
    Ta: 180.948, W: 183.84, Re: 186.207, Os: 190.23, Ir: 192.217, Pt: 195.084,
    Au: 196.967, Hg: 200.592, Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209,
    At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.038, Pa: 231.036,
    U: 238.029, Np: 237, Pu: 244
  }

  let mw = 0
  const regex = /([A-Z][a-z]?)(\d*)/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(formula)) !== null) {
    const elem = match[1]
    const count = match[2] ? parseInt(match[2], 10) : 1
    const weight = atomicWeights[elem] || 0
    mw += weight * count
  }
  return Math.round(mw * 100) / 100
}

export function estimateLogP(atoms: ParseResult['atoms']): number {
  const contributions: Record<string, number> = {
    C: 0.5, H: 0.0, N: -1.0, O: -1.0, S: 0.0,
    P: 0.0, F: 0.5, Cl: 0.5, Br: 1.0, I: 1.5
  }
  let logP = 0
  for (const atom of atoms) {
    logP += contributions[atom.element] ?? 0
  }
  return Math.round(logP * 100) / 100
}

export const MOCK_MOLECULES: MoleculeData[] = [
  {
    id: 1, name: '阿司匹林 (Aspirin)', smiles: 'CC(=O)Oc1ccccc1C(=O)O', formula: 'C9H8O4', mw: 180.16, logP: 1.2, category: '解热镇痛',
    atoms: [
      { element: 'C', x: 0, y: 0, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'C', x: 1.5, y: 0, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'O', x: 2.2, y: 1, z: 0, color: ATOM_COLORS.O, radius: ATOM_RADII.O },
      { element: 'O', x: 2.2, y: -1, z: 0, color: ATOM_COLORS.O, radius: ATOM_RADII.O },
      { element: 'O', x: 0, y: 1.5, z: 0, color: ATOM_COLORS.O, radius: ATOM_RADII.O },
      { element: 'C', x: -1.5, y: 1.5, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'C', x: -2.3, y: 0.5, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'C', x: -3.7, y: 0.5, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'C', x: -4.5, y: 1.5, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'C', x: -3.7, y: 2.5, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'C', x: -2.3, y: 2.5, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'C', x: -1.5, y: 3.5, z: 0, color: ATOM_COLORS.C, radius: ATOM_RADII.C },
      { element: 'O', x: -0.5, y: 3.5, z: 0, color: ATOM_COLORS.O, radius: ATOM_RADII.O },
      { element: 'O', x: -2.2, y: 4.5, z: 0, color: ATOM_COLORS.O, radius: ATOM_RADII.O },
      { element: 'H', x: -1.8, y: -0.3, z: 0.6, color: ATOM_COLORS.H, radius: ATOM_RADII.H },
      { element: 'H', x: -4.3, y: -0.3, z: 0.6, color: ATOM_COLORS.H, radius: ATOM_RADII.H },
      { element: 'H', x: -5.5, y: 1.5, z: 0.6, color: ATOM_COLORS.H, radius: ATOM_RADII.H },
      { element: 'H', x: -4.3, y: 3.3, z: 0.6, color: ATOM_COLORS.H, radius: ATOM_RADII.H },
      { element: 'H', x: -0.5, y: 5.2, z: 0, color: ATOM_COLORS.H, radius: ATOM_RADII.H },
      { element: 'H', x: 0, y: -0.8, z: 0.6, color: ATOM_COLORS.H, radius: ATOM_RADII.H },
      { element: 'H', x: 0.8, y: -0.8, z: -0.6, color: ATOM_COLORS.H, radius: ATOM_RADII.H },
      { element: 'H', x: -0.8, y: -0.8, z: -0.6, color: ATOM_COLORS.H, radius: ATOM_RADII.H }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 }, { atom1: 1, atom2: 2, order: 2 }, { atom1: 1, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 }, { atom1: 4, atom2: 5, order: 1 }, { atom1: 5, atom2: 6, order: 1 },
      { atom1: 6, atom2: 7, order: 2 }, { atom1: 7, atom2: 8, order: 1 }, { atom1: 8, atom2: 9, order: 2 },
      { atom1: 9, atom2: 10, order: 1 }, { atom1: 10, atom2: 5, order: 2 }, { atom1: 10, atom2: 11, order: 1 },
      { atom1: 11, atom2: 12, order: 1 }, { atom1: 11, atom2: 13, order: 2 },
      { atom1: 13, atom2: 18, order: 1 },
      { atom1: 0, atom2: 19, order: 1 }, { atom1: 0, atom2: 20, order: 1 }, { atom1: 0, atom2: 21, order: 1 },
      { atom1: 6, atom2: 15, order: 1 }, { atom1: 7, atom2: 16, order: 1 }, { atom1: 8, atom2: 17, order: 1 }
    ]
  },
  {
    id: 2, name: '对乙酰氨基酚 (Paracetamol)', smiles: 'CC(=O)Nc1ccc(O)cc1', formula: 'C8H9NO2', mw: 151.16, logP: 0.5, category: '解热镇痛',
    atoms: [], bonds: []
  },
  {
    id: 3, name: '布洛芬 (Ibuprofen)', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O', formula: 'C13H18O2', mw: 206.28, logP: 3.5, category: '解热镇痛',
    atoms: [], bonds: []
  },
  {
    id: 4, name: '咖啡因 (Caffeine)', smiles: 'Cn1c(=O)c2c(ncn2C)n(C)c1=O', formula: 'C8H10N4O2', mw: 194.19, logP: -0.1, category: '中枢兴奋',
    atoms: [], bonds: []
  },
  {
    id: 5, name: '青霉素G (Penicillin G)', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C', formula: 'C16H18N2O4S', mw: 334.39, logP: 1.8, category: '抗生素',
    atoms: [], bonds: []
  },
  {
    id: 6, name: '阿莫西林 (Amoxicillin)', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C', formula: 'C16H19N3O5S', mw: 365.4, logP: 0.9, category: '抗生素',
    atoms: [], bonds: []
  },
  {
    id: 7, name: '甲硝唑 (Metronidazole)', smiles: 'C1=CC(=O)N(C1=CN=C[N+](=O)[O-])CCO', formula: 'C6H9N3O3', mw: 171.15, logP: -0.1, category: '抗菌药',
    atoms: [], bonds: []
  },
  {
    id: 8, name: '二甲双胍 (Metformin)', smiles: 'CN(C)C(=N)NC(=N)N', formula: 'C4H11N5', mw: 129.17, logP: -2.0, category: '降糖药',
    atoms: [], bonds: []
  },
  {
    id: 9, name: '阿托伐他汀 (Atorvastatin)', smiles: 'CC(C)c1cc(c2c(c1C)C(=O)OC(C)(C)C)CC(C)Cc1ccc(cc1)C(O)(C(F)(F)F)C(O)(c1cc(OC)c(OC)cc1)C1CCCCC1', formula: 'C33H35FN2O5', mw: 558.64, logP: 4.7, category: '降脂药',
    atoms: [], bonds: []
  },
  {
    id: 10, name: '奥美拉唑 (Omeprazole)', smiles: 'CC1=CN=C(C(=C1OC)C)SCC2=NC3=CC=CC=C3N2[O-]', formula: 'C17H19N3O3S', mw: 345.42, logP: 2.2, category: '胃药',
    atoms: [], bonds: []
  },
  {
    id: 11, name: '地西泮 (Diazepam)', smiles: 'CN1C(=O)CN=C(c2ccccc2Cl)c3cc(Cl)ccc13', formula: 'C16H13ClN2O', mw: 284.74, logP: 2.9, category: '镇静催眠',
    atoms: [], bonds: []
  },
  {
    id: 12, name: '氯雷他定 (Loratadine)', smiles: 'CCOC(=O)C1CCN(CC1)C2=CC=C(C=C2)C3=CC=NC4=CC=CC=C34', formula: 'C22H23ClN2O2', mw: 382.89, logP: 5.0, category: '抗过敏',
    atoms: [], bonds: []
  },
  {
    id: 13, name: '美托洛尔 (Metoprolol)', smiles: 'CC(C)NCC(O)COC1=CC=C(C=C1)COCC', formula: 'C15H25NO3', mw: 267.37, logP: 1.9, category: '心血管',
    atoms: [], bonds: []
  },
  {
    id: 14, name: '硝酸甘油 (Nitroglycerin)', smiles: 'C(CO[N+](=O)[O-])(O[N+](=O)[O-])CO[N+](=O)[O-]', formula: 'C3H5N3O9', mw: 227.09, logP: 0.2, category: '心血管',
    atoms: [], bonds: []
  },
  {
    id: 15, name: '西地那非 (Sildenafil)', smiles: 'CCCC1=NN(C2=C1N=C(NC2=O)C3=C(C=CC(=C3)S(=O)(=O)N4CCN(CC4)C)OCC)C', formula: 'C22H30N6O4S', mw: 474.58, logP: 1.5, category: '心血管',
    atoms: [], bonds: []
  },
  {
    id: 16, name: '他莫昔芬 (Tamoxifen)', smiles: 'CC(=C(C1=CC=CC=C1)C2=CC=C(C=C2)OCCN(C)C)C3=CC=CC=C3', formula: 'C26H29NO', mw: 371.51, logP: 7.1, category: '抗肿瘤',
    atoms: [], bonds: []
  },
  {
    id: 17, name: '顺铂 (Cisplatin)', smiles: '[NH3].[NH3].Cl[Pt]Cl', formula: 'Cl2H6N2Pt', mw: 300.05, logP: -2.2, category: '抗肿瘤',
    atoms: [], bonds: []
  },
  {
    id: 18, name: '伊马替尼 (Imatinib)', smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5', formula: 'C29H31N7O', mw: 493.6, logP: 3.1, category: '抗肿瘤',
    atoms: [], bonds: []
  },
  {
    id: 19, name: '左旋多巴 (Levodopa)', smiles: 'C1=CC(=C(C=C1CN)C(=O)O)O', formula: 'C9H11NO4', mw: 197.19, logP: -1.8, category: '抗帕金森',
    atoms: [], bonds: []
  },
  {
    id: 20, name: '苯妥英钠 (Phenytoin)', smiles: 'C1=CC=C(C=C1)C2(NC(=O)NC2=O)C3=CC=CC=C3', formula: 'C15H11N2NaO2', mw: 274.25, logP: 2.5, category: '抗癫痫',
    atoms: [], bonds: []
  }
]

for (let idx = 1; idx < MOCK_MOLECULES.length; idx++) {
  const mol = MOCK_MOLECULES[idx]
  if (mol.atoms.length === 0) {
    const parsed = parseSMILES(mol.smiles)
    mol.atoms = parsed.atoms
    mol.bonds = parsed.bonds
    if (mol.atoms.length > 0) {
      mol.formula = estimateFormulaFromAtoms(mol.atoms)
      mol.mw = estimateMW(mol.formula)
      mol.logP = estimateLogP(mol.atoms)
    }
  }
}

export function computeADMET(mol: { mw: number; logP: number; formula: string; atoms?: any[] }): ADMETProps {
  const { mw, logP: molLogP, formula, atoms = [] } = mol

  const logP = molLogP ?? estimateLogP(atoms)

  let logS = 0
  const hBondDonors = formula.match(/[OH]/g)?.length ?? 0
  const hBondAcceptors = formula.match(/[NOS]/g)?.length ?? 0
  logS = -0.01 * mw + 0.5 * hBondDonors - 0.3 * logP - 1
  logS = Math.round(logS * 100) / 100

  let toxicity = '低'
  const heavyAtoms = atoms.length > 0 ? atoms.filter(a => a.element !== 'H').length : 0
  const hasHeavyMetals = atoms.length > 0 ? atoms.some(a => ['As', 'Cd', 'Hg', 'Pb', 'Tl'].includes(a.element)) : false
  if (hasHeavyMetals || mw > 600) {
    toxicity = '高'
  } else if (logP > 4 || heavyAtoms > 35) {
    toxicity = '中'
  }

  let proteinBinding = 80 + logP * 5
  if (proteinBinding < 20) proteinBinding = 20
  if (proteinBinding > 99) proteinBinding = 99
  proteinBinding = Math.round(proteinBinding)

  let metabolicStability = '稳定'
  if (logP > 4.5 || hBondDonors > 5) {
    metabolicStability = '不稳定'
  } else if (logP > 3 || hBondAcceptors > 8) {
    metabolicStability = '中等'
  }

  let bioavailability = 70
  bioavailability -= logP > 3 ? (logP - 3) * 10 : 0
  bioavailability -= mw > 500 ? (mw - 500) * 0.1 : 0
  bioavailability += hBondDonors < 3 ? 10 : 0
  if (bioavailability < 5) bioavailability = 5
  if (bioavailability > 95) bioavailability = 95
  bioavailability = Math.round(bioavailability)

  let violations = 0
  if (mw > 500) violations++
  if (logP > 5) violations++
  if (hBondDonors > 5) violations++
  if (hBondAcceptors > 10) violations++

  return {
    logP,
    logS,
    toxicity,
    proteinBinding,
    metabolicStability,
    bioavailability,
    ruleOfFive: violations <= 1,
    violations
  }
}

export const useMoleculeStore = defineStore('molecule', () => {
  const molecules = ref<MoleculeData[]>([])
  const currentMolecule = ref<MoleculeData | null>(null)
  const admet = ref<ADMETProps | null>(null)
  const searchQuery = ref('')
  const searchResults = ref<MoleculeData[]>([])
  const isLoading = ref(false)
  const customMoleculeCounter = ref(1)

  const filteredMolecules = computed(() => {
    if (!searchQuery.value.trim()) {
      return molecules.value
    }
    const q = searchQuery.value.toLowerCase()
    return molecules.value.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.smiles.toLowerCase().includes(q) ||
      m.formula.toLowerCase().includes(q)
    )
  })

  const similarMolecules = computed<Array<MoleculeData & { similarity: number }>>(() => {
    if (!currentMolecule.value) return []
    const current = currentMolecule.value
    const results: Array<MoleculeData & { similarity: number }> = []

    for (const mol of molecules.value) {
      if (mol.id === current.id) continue
      const similarity = computeTanimoto(current, mol)
      if (similarity > 5) {
        results.push({
          ...mol,
          similarity
        })
      }
    }

    results.sort((a, b) => b.similarity - a.similarity)
    return results.slice(0, 5)
  })

  function computeTanimoto(mol1: MoleculeData, mol2: MoleculeData): number {
    const fp1 = getFingerprint(mol1)
    const fp2 = getFingerprint(mol2)

    let intersection = 0
    let union = 0

    const allKeys = new Set([...Object.keys(fp1), ...Object.keys(fp2)])
    for (const key of allKeys) {
      const v1 = fp1[key] ?? 0
      const v2 = fp2[key] ?? 0
      intersection += Math.min(v1, v2)
      union += Math.max(v1, v2)
    }

    return union === 0 ? 0 : Math.round((intersection / union) * 100)
  }

  function getFingerprint(mol: MoleculeData): Record<string, number> {
    const fp: Record<string, number> = {}

    for (const atom of mol.atoms) {
      fp[atom.element] = (fp[atom.element] ?? 0) + 1
    }

    let singleBonds = 0, doubleBonds = 0, tripleBonds = 0, aromaticBonds = 0
    for (const bond of mol.bonds) {
      if (bond.order === 1) singleBonds++
      else if (bond.order === 2) doubleBonds++
      else if (bond.order === 3) tripleBonds++
      else if (bond.order === 1.5) aromaticBonds++
    }
    fp['_single'] = singleBonds
    fp['_double'] = doubleBonds
    fp['_triple'] = tripleBonds
    fp['_aromatic'] = aromaticBonds
    fp['_heavy'] = mol.atoms.filter(a => a.element !== 'H').length
    fp['_ring'] = mol.bonds.length - mol.atoms.length + 1

    if (fp['C'] && fp['O']) fp['_CO'] = 1
    if (fp['C'] && fp['N']) fp['_CN'] = 1
    if (fp['C'] && fp['S']) fp['_CS'] = 1

    return fp
  }

  function loadMolecules() {
    isLoading.value = true
    setTimeout(() => {
      molecules.value = [...MOCK_MOLECULES]
      searchResults.value = molecules.value
      isLoading.value = false
      if (molecules.value.length > 0) {
        selectMolecule(molecules.value[0])
      }
    }, 100)
  }

  function selectMolecule(mol: MoleculeData) {
    currentMolecule.value = mol
    admet.value = computeADMET({ mw: mol.mw, logP: mol.logP, formula: mol.formula, atoms: mol.atoms })
  }

  function searchMolecules(query: string) {
    searchQuery.value = query
  }

  function parseCustomSMILES(smiles: string): boolean {
    const validation = validateSMILES(smiles)
    if (!validation.valid) {
      return false
    }

    const parsed = parseSMILES(smiles)
    if (parsed.atoms.length === 0) {
      return false
    }

    const formula = estimateFormulaFromAtoms(parsed.atoms)
    const mw = estimateMW(formula)
    const logP = estimateLogP(parsed.atoms)

    const newId = 100000 + customMoleculeCounter.value
    customMoleculeCounter.value++

    const newMolecule: MoleculeData = {
      id: newId,
      name: `自定义分子-${customMoleculeCounter.value - 1}`,
      smiles,
      formula,
      mw,
      logP,
      category: '自定义',
      atoms: parsed.atoms,
      bonds: parsed.bonds
    }

    molecules.value.unshift(newMolecule)
    searchResults.value = molecules.value

    selectMolecule(newMolecule)

    return true
  }

  return {
    molecules,
    currentMolecule,
    admet,
    searchQuery,
    searchResults,
    isLoading,
    customMoleculeCounter,
    filteredMolecules,
    similarMolecules,
    loadMolecules,
    selectMolecule,
    searchMolecules,
    parseCustomSMILES,
    computeTanimoto
  }
})
