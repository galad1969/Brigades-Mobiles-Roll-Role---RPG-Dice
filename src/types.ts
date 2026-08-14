export type PlayerRole = 'player' | 'gm';

export type RollActionCategory = 'standard' | 'social' | 'combat' | 'poursuite' | 'danger_mort';

export type CharacteristicKey = 'perception' | 'presence' | 'vigueur' | 'sang_froid';

export type SkillKey =
  // Perception
  | 'investigation'
  | 'medecine_legale'
  | 'erudition'
  | 'techniques_modernes'
  // Présence
  | 'interrogatoire'
  | 'persuasion'
  | 'reseau'
  // Vigueur
  | 'langues'
  | 'combat_armes'
  | 'poursuite_athletisme'
  | 'conduite_mecanique'
  // Sang-froid
  | 'filature_discretion'
  | 'couverture'
  | 'bureaucratie'
  | 'intuition';

export type SkillRank = 0 | 1 | 2 | 3 | 4;

export type DifficultyTier =
  | 'triviale'
  | 'facile'
  | 'moderee'
  | 'difficile'
  | 'extreme'
  | 'cauchemardesque';

export type AdvantageType = 0 | 1 | 2; // 0=Aucun, 1=Mineur (+1), 2=Majeur (+2)
export type DisadvantageType = 0 | 1 | 2; // 0=Aucun, 1=Mineur (-1), 2=Majeur (-2)

export type ArchetypeKey =
  | 'inspecteur_principal'
  | 'sous_inspecteur'
  | 'medecin_legiste'
  | 'secretaire_auxiliaire'
  | 'auxiliaire_terrain';

export interface Privilege {
  id: string;
  name: string;
  archetype: ArchetypeKey;
  type: 'metier' | 'appui';
  bonus: 1 | 2;
  targetSkills: SkillKey[];
  trigger: string;
  description: string;
}

export type DegreeResult =
  | 'echec_critique' // <= 1
  | 'echec'          // 2-3
  | 'ambivalent'     // 4-6
  | 'reussite'       // 7-8
  | 'reussite_majeure'; // >= 9

export type InjuryStage = 1 | 2 | 3 | 4 | 5;
// 1 = Indemne
// 2 = Éprouvé (-1 actions physiques)
// 3 = Blessé (-1 toutes actions)
// 4 = Grièvement blessé (-2 toutes actions)
// 5 = Hors de combat (Danger de mort)

export type WeaponCategory = 'legere' | 'moyenne' | 'lourde';

export type DebtCurrency = 'journee' | 'trace' | 'marque' | 'piece' | 'bruit';

export interface NPCEntry {
  id: string;
  name: string;
  attitude: -1 | 0 | 1; // Hostile -1, Neutre 0, Loyal +1
  hasPhysique?: boolean;
  physique?: number; // 0 to 5
  hasWeapon?: boolean;
  weapon?: WeaponCategory;
  notes?: string;
}

export interface BrigadeBoard {
  remainingDays: number;
  totalDays: number;
  deadlineConsequence: string;
  facts: string[];
  hypotheses: string[];
}

export interface PursuitObstacle {
  id: string;
  obstacleNumber: number;
  d8Roll: number;
  complicationTitle: string;
  complicationDesc: string;
  skillUsed?: SkillKey;
  totalScore?: number;
  degree?: DegreeResult;
  isSuccess: boolean;
  isAmbivalent?: boolean;
}

export interface PursuitSession {
  isActive: boolean;
  stage: 'engagement' | 'obstacles' | 'resolution';
  fuyardName: string;
  fuyardPhysique: number;
  engagementDegree?: DegreeResult;
  engagementBonus: number; // +1 if Reussite/Majeure, 0 if Ambivalent, -1 if Echec/Critique
  obstacles: PursuitObstacle[];
  targetObstaclesCount: number;
}

export interface RollHistoryAuthor {
  name: string;
  role: PlayerRole;
  color: string;
  peerId?: string;
}

export interface RollHistoryEntry {
  id: string;
  timestamp: number;
  category: RollActionCategory;
  actionName: string;
  skillKey?: SkillKey;
  rank: SkillRank;
  d8Result: number; // 1 to 8
  modifierTotal: number;
  finalTotal: number;
  degree: DegreeResult;
  guaranteedFloor: DegreeResult;
  
  // Breakdown
  difficultyTier?: DifficultyTier;
  difficultyMod: number;
  rawAdvantage: number;
  appliedAdvantage: number;
  rawDisadvantage: number;
  appliedDisadvantage: number;
  halfRuleApplied: boolean;
  injuryStage: InjuryStage;
  injuryMod: number;
  activePrivilege?: { name: string; bonus: number };

  // Social
  npcAttitude?: -1 | 0 | 1;
  personalLink?: number;
  demandWeight?: -1 | 0 | 1;
  burnedLink?: boolean;

  // Combat
  characterWeapon?: WeaponCategory;
  opponentPhysique?: number;
  opponentWeapon?: WeaponCategory;
  damageInflicted?: number;
  damageTaken?: number;
  opponentNewPhysique?: number;
  playerNewInjury?: InjuryStage;

  // Interpretations
  narrativeTitle: string;
  narrativeDetail: string;
  traceDetail?: string;

  // Costs
  costDecision?: {
    type: 'paid_now' | 'debt_token' | 'none';
    currency?: DebtCurrency;
    note?: string;
  };

  author?: RollHistoryAuthor;
  isSecret?: boolean;
  isRedacted?: boolean;
}

export interface RoomPlayer {
  peerId: string;
  name: string;
  role: PlayerRole;
  color: string;
  isSelf?: boolean;
  joinedAt?: number;
  debtTokens?: number;
  injury?: InjuryStage;
}
