import {
  RollActionCategory,
  SkillRank,
  DifficultyTier,
  AdvantageType,
  DisadvantageType,
  InjuryStage,
  DegreeResult,
  WeaponCategory,
  SkillKey,
  DebtCurrency,
} from '../types';
import { DIFFICULTIES, WEAPONS, SKILLS, DEGREE_DESCRIPTIONS, DEBT_CURRENCIES } from '../data/rulesData';

export function determineDegree(total: number): DegreeResult {
  if (total <= 1) return 'echec_critique';
  if (total <= 3) return 'echec';
  if (total <= 6) return 'ambivalent';
  if (total <= 8) return 'reussite';
  return 'reussite_majeure';
}

export function calculateCircumstances(
  rawAdvantage: AdvantageType,
  rawDisadvantage: DisadvantageType,
  difficultyTier: DifficultyTier
): {
  appliedAdvantage: number;
  appliedDisadvantage: number;
  netCircumstance: number;
  halfRuleApplied: boolean;
} {
  const isExtremeOrNightmare = difficultyTier === 'extreme' || difficultyTier === 'cauchemardesque';
  let appliedAdvantage = rawAdvantage;

  if (isExtremeOrNightmare) {
    // Règle de la moitié : +2 devient +1, +1 devient 0 (arrondi à l'inférieur)
    appliedAdvantage = Math.floor(rawAdvantage / 2) as AdvantageType;
  }

  const appliedDisadvantage = rawDisadvantage;
  const netCircumstance = appliedAdvantage - appliedDisadvantage;

  return {
    appliedAdvantage: appliedAdvantage as number,
    appliedDisadvantage: appliedDisadvantage as number,
    netCircumstance,
    halfRuleApplied: isExtremeOrNightmare && rawAdvantage > 0,
  };
}

export function calculateInjuryModifier(
  injury: InjuryStage,
  isPhysicalAction: boolean
): number {
  switch (injury) {
    case 1: // Indemne
      return 0;
    case 2: // Éprouvé (-1 physique)
      return isPhysicalAction ? -1 : 0;
    case 3: // Blessé (-1 toutes actions)
      return -1;
    case 4: // Grièvement blessé (-2 toutes actions)
      return -2;
    case 5: // Hors de combat
      return -3;
    default:
      return 0;
  }
}

export function calculateStandardTestModifier(params: {
  rank: SkillRank;
  difficultyTier: DifficultyTier;
  rawAdvantage: AdvantageType;
  rawDisadvantage: DisadvantageType;
  injuryStage: InjuryStage;
  isPhysicalAction: boolean;
  privilegeBonus?: number;
}): {
  difficultyMod: number;
  appliedAdvantage: number;
  appliedDisadvantage: number;
  injuryMod: number;
  privilegeBonus: number;
  modifierTotal: number;
  halfRuleApplied: boolean;
  guaranteedFloor: DegreeResult;
} {
  const difficultyMod = DIFFICULTIES[params.difficultyTier].modifier;
  const circ = calculateCircumstances(
    params.rawAdvantage,
    params.rawDisadvantage,
    params.difficultyTier
  );
  const injuryMod = calculateInjuryModifier(params.injuryStage, params.isPhysicalAction);
  const privilegeBonus = params.privilegeBonus || 0;

  const modifierTotal =
    params.rank +
    difficultyMod +
    circ.netCircumstance +
    injuryMod +
    privilegeBonus;

  const guaranteedFloor = determineDegree(1 + modifierTotal);

  return {
    difficultyMod,
    appliedAdvantage: circ.appliedAdvantage,
    appliedDisadvantage: circ.appliedDisadvantage,
    injuryMod,
    privilegeBonus,
    modifierTotal,
    halfRuleApplied: circ.halfRuleApplied,
    guaranteedFloor,
  };
}

export function calculateSocialModifier(params: {
  rank: SkillRank;
  attitude: -1 | 0 | 1;
  personalLink: number; // -3 to +3
  demandWeight: -1 | 0 | 1; // -1 lourd, 0 ordinaire, +1 anodin
  injuryStage: InjuryStage;
  privilegeBonus?: number;
}): {
  injuryMod: number;
  privilegeBonus: number;
  modifierTotal: number;
  guaranteedFloor: DegreeResult;
} {
  const injuryMod = calculateInjuryModifier(params.injuryStage, false);
  const privilegeBonus = params.privilegeBonus || 0;

  const modifierTotal =
    params.rank +
    params.attitude +
    params.personalLink +
    params.demandWeight +
    injuryMod +
    privilegeBonus;

  const guaranteedFloor = determineDegree(1 + modifierTotal);

  return {
    injuryMod,
    privilegeBonus,
    modifierTotal,
    guaranteedFloor,
  };
}

export function resolveCombatExchange(
  degree: DegreeResult,
  playerWeapon: WeaponCategory,
  opponentWeapon: WeaponCategory
): {
  damageInflicted: number;
  damageTaken: number;
} {
  const playerW = WEAPONS[playerWeapon];
  const oppW = WEAPONS[opponentWeapon];

  switch (degree) {
    case 'reussite_majeure':
      return { damageInflicted: playerW.damageDoubled, damageTaken: 0 };
    case 'reussite':
      return { damageInflicted: playerW.damage, damageTaken: 0 };
    case 'ambivalent':
      return { damageInflicted: 0, damageTaken: 0 };
    case 'echec':
      return { damageInflicted: 0, damageTaken: oppW.damage };
    case 'echec_critique':
      return { damageInflicted: 0, damageTaken: oppW.damageDoubled };
  }
}

export function getNarrativeFeedback(
  category: RollActionCategory,
  degree: DegreeResult,
  skillKey?: SkillKey
): {
  title: string;
  detail: string;
  trace?: string;
} {
  const desc = DEGREE_DESCRIPTIONS[degree];
  let detail = desc.general;

  if (category === 'standard') {
    detail = desc.enquete;
  } else if (category === 'social') {
    detail = desc.social;
  } else if (category === 'combat') {
    detail = desc.physique;
  }

  let trace: string | undefined = undefined;
  if (category === 'social') {
    if (degree === 'reussite_majeure') {
      trace = "L'attitude monte d'un cran (+1) pour toute la Brigade & le Lien personnel gagne +1.";
    } else if (degree === 'reussite') {
      trace = 'Le Lien personnel gagne +1 (ou reste stable). Aucune rancune.';
    } else if (degree === 'ambivalent') {
      trace = 'Dette ou promesse contractée. Le Lien peut gagner ou perdre 1 selon ce qui a été négocié.';
    } else if (degree === 'echec') {
      trace = 'Le Lien personnel perd 1 ou laisse une trace narrative dans le carnet du policier.';
    } else if (degree === 'echec_critique') {
      trace = "L'attitude descend d'un cran (-1) pour toute la Brigade & le Lien personnel perd 1 (rupture/avocat).";
    }
  }

  return {
    title: desc.label,
    detail,
    trace,
  };
}
