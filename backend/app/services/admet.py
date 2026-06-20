import numpy as np
import re

VALID_ELEMENTS = {"H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu"}


def validate_smiles(smiles: str) -> tuple[bool, list[str], list[str]]:
    errors = []
    warnings = []

    if not smiles or not smiles.strip():
        errors.append("SMILES字符串不能为空")
        return False, errors, warnings

    valid_chars_pattern = r'^[A-Za-z0-9\-=#()\[\]@+.\s/\\]+$'
    if not re.match(valid_chars_pattern, smiles):
        errors.append("SMILES字符串包含无效字符")

    paren_stack = []
    bracket_stack = []
    for i, ch in enumerate(smiles):
        if ch == '(':
            paren_stack.append(i)
        elif ch == ')':
            if not paren_stack:
                errors.append(f"位置 {i}: 存在未匹配的右括号 ')'")
            else:
                paren_stack.pop()
        elif ch == '[':
            bracket_stack.append(i)
        elif ch == ']':
            if not bracket_stack:
                errors.append(f"位置 {i}: 存在未匹配的右方括号 ']'")
            else:
                bracket_stack.pop()
    if paren_stack:
        for pos in paren_stack:
            errors.append(f"位置 {pos}: 存在未匹配的左括号 '('")
    if bracket_stack:
        for pos in bracket_stack:
            errors.append(f"位置 {pos}: 存在未匹配的左方括号 '['")

    ring_counts = {}
    for ch in smiles:
        if ch.isdigit():
            ring_counts[ch] = ring_counts.get(ch, 0) + 1
    for digit, count in ring_counts.items():
        if count % 2 != 0:
            warnings.append(f"环编号 '{digit}' 出现 {count} 次，可能未正确配对")

    i = 0
    has_atom = False
    while i < len(smiles):
        ch = smiles[i]
        if ch.isupper():
            element = ch
            if i + 1 < len(smiles) and smiles[i + 1].islower():
                element += smiles[i + 1]
                i += 1
            if element not in VALID_ELEMENTS:
                errors.append(f"位置 {i - len(element) + 1}: 无效的元素符号 '{element}'")
            else:
                has_atom = True
        elif ch == '[':
            end = smiles.find(']', i)
            if end != -1:
                content = smiles[i + 1:end]
                if content:
                    elem_match = re.match(r'^([A-Z][a-z]?)', content)
                    if elem_match:
                        bracket_elem = elem_match.group(1)
                        if bracket_elem not in VALID_ELEMENTS:
                            errors.append(f"位置 {i}: 方括号内无效的元素符号 '{bracket_elem}'")
                        else:
                            has_atom = True
                    else:
                        errors.append(f"位置 {i}: 方括号内未找到有效的元素符号")
                i = end
        i += 1

    if not has_atom:
        errors.append("SMILES字符串中未找到任何原子")

    bond_symbols = {'=', '#', '-'}
    if smiles and smiles[-1] in bond_symbols:
        errors.append("SMILES字符串不能以键符号 (=, #, -) 结尾")

    consecutive_bonds = 0
    for ch in smiles:
        if ch in bond_symbols:
            consecutive_bonds += 1
            if consecutive_bonds > 2:
                warnings.append(f"存在 {consecutive_bonds} 个连续的键符号，可能有误")
                break
        else:
            consecutive_bonds = 0

    is_valid = len(errors) == 0
    return is_valid, errors, warnings


ATOM_COLORS = {"C": "#6b7280", "N": "#3b82f6", "O": "#ef4444", "S": "#eab308", "P": "#f97316", "H": "#e5e7eb", "F": "#22c55e", "Cl": "#16a34a"}
ATOM_RADII = {"C": 0.3, "N": 0.25, "O": 0.22, "S": 0.35, "P": 0.35, "H": 0.15, "F": 0.18, "Cl": 0.3}


def parse_smiles(smiles: str):
    atoms, bonds = [], []
    last_atom = -1
    pending_bond = 1
    i = 0
    while i < len(smiles):
        ch = smiles[i]
        if ch in '()[]':
            i += 1
            continue
        elif ch == '=':
            pending_bond = 2; i += 1; continue
        elif ch == '#':
            pending_bond = 3; i += 1; continue
        elif ch in '-+@':
            i += 1; continue
        elif ch.isupper():
            element = ch
            if i + 1 < len(smiles) and smiles[i + 1].islower():
                element += smiles[i + 1]; i += 1
            idx = len(atoms)
            atoms.append({
                "element": element,
                "x": float((idx % 3 - 1) * 1.5 + np.random.uniform(-0.3, 0.3)),
                "y": float((idx // 3 % 3 - 1) * 1.5 + np.random.uniform(-0.3, 0.3)),
                "z": float((idx // 9 - 1) * 1.5 + np.random.uniform(-0.3, 0.3)),
                "color": ATOM_COLORS.get(element, "#888888"),
                "radius": ATOM_RADII.get(element, 0.25)
            })
            if last_atom >= 0:
                bonds.append({"atom1": last_atom, "atom2": idx, "order": pending_bond})
            last_atom = idx
            pending_bond = 1
        i += 1
    return atoms, bonds


def compute_admet(mw: float, log_p: float, formula: str) -> dict:
    log_s = round(0.5 - 0.01 * (mw - 20) - log_p, 2)
    hbd = formula.count("O")
    hba = formula.count("N") + hbd
    violations = (1 if mw > 500 else 0) + (1 if log_p > 5 else 0) + (1 if hbd > 5 else 0) + (1 if hba > 10 else 0)
    toxicity = "高毒性风险" if log_p > 3 else "中等毒性" if log_p > 1 else "低毒性"
    protein_binding = min(99, max(10, round(log_p * 15 + 30)))
    metabolic_stability = "稳定" if mw < 300 else "中等" if mw < 450 else "不稳定"
    bioavailability = max(0, min(100, round(100 - log_p * 8 - mw * 0.05)))
    return {
        "logP": round(log_p, 2), "logS": log_s, "toxicity": toxicity,
        "proteinBinding": protein_binding, "metabolicStability": metabolic_stability,
        "bioavailability": bioavailability, "ruleOfFive": violations <= 1, "violations": violations
    }
