import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  RollActionCategory,
  SkillKey,
  SkillRank,
  DifficultyTier,
  AdvantageType,
  DisadvantageType,
  InjuryStage,
  ArchetypeKey,
  Privilege,
  WeaponCategory,
  DebtCurrency,
  RollHistoryEntry,
  RollHistoryAuthor,
  DegreeResult,
  BrigadeBoard,
} from '../types';
import { SKILLS, DIFFICULTIES, ARCHETYPES, WEAPONS } from '../data/rulesData';
import {
  determineDegree,
  calculateStandardTestModifier,
  calculateSocialModifier,
  resolveCombatExchange,
  getNarrativeFeedback,
} from '../utils/diceRules';

export function useBrigadesRoller() {
  // Active Roll Configuration
  const [category, setCategory] = useState<RollActionCategory>('standard');
  const [selectedSkill, setSelectedSkill] = useState<SkillKey>('investigation');
  const [rank, setRank] = useState<SkillRank>(2); // Default to Correct (+2)
  const [difficultyTier, setDifficultyTier] = useState<DifficultyTier>('moderee');
  
  // Circumstances
  const [rawAdvantage, setRawAdvantage] = useState<AdvantageType>(0);
  const [rawDisadvantage, setRawDisadvantage] = useState<DisadvantageType>(0);
  
  // Character status
  const [archetype, setArchetype] = useState<ArchetypeKey>('sous_inspecteur');
  const [activePrivilegeId, setActivePrivilegeId] = useState<string | null>(null);
  const [injuryStage, setInjuryStage] = useState<InjuryStage>(1); // 1 = Indemne
  const [debtTokens, setDebtTokens] = useState<number>(0);
  
  // Social specific
  const [npcAttitude, setNpcAttitude] = useState<-1 | 0 | 1>(0);
  const [personalLink, setPersonalLink] = useState<number>(0);
  const [demandWeight, setDemandWeight] = useState<-1 | 0 | 1>(0);
  
  // Combat specific
  const [characterWeapon, setCharacterWeapon] = useState<WeaponCategory>('moyenne');
  const [opponentPhysique, setOpponentPhysique] = useState<number>(2);
  const [opponentWeapon, setOpponentWeapon] = useState<WeaponCategory>('legere');

  // History & Shared State
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [lastRoll, setLastRoll] = useState<RollHistoryEntry | null>(null);

  // Brigade Board State (Ardoise)
  const [board, setBoard] = useState<BrigadeBoard>({
    totalDays: 4,
    remainingDays: 4,
    deadlineConsequence: 'Le juge d\'instruction dessaisit la brigade mobile au profit de la gendarmerie locale.',
    facts: [
      'La victime a été vue vivante pour la dernière fois à 22h au café de la Gare.',
      'L\'empreinte retrouvée sur le coffre ne correspond à aucun membre du personnel.',
    ],
    hypotheses: [
      'Le suspect aurait pris le train de nuit pour Rouen.',
      'Un complice interne a fourni les clés du vestibule.',
    ],
  });

  const updateBoard = useCallback((newBoard: BrigadeBoard) => {
    setBoard(newBoard);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('bm1910_roll_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedState = localStorage.getItem('bm1910_character_state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.archetype) setArchetype(parsed.archetype);
        if (parsed.injuryStage) setInjuryStage(parsed.injuryStage);
        if (parsed.debtTokens !== undefined) setDebtTokens(parsed.debtTokens);
      }
    } catch (e) {}
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bm1910_roll_history', JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  // Save character state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'bm1910_character_state',
        JSON.stringify({ archetype, injuryStage, debtTokens })
      );
    } catch (e) {}
  }, [archetype, injuryStage, debtTokens]);

  // Get active privilege object
  const activePrivilege = activePrivilegeId
    ? ARCHETYPES[archetype].privileges.find(p => p.id === activePrivilegeId)
    : undefined;

  // Active privilege bonus
  const privilegeBonus = activePrivilege ? activePrivilege.bonus : 0;

  // Compute live current calculation & guaranteed floor
  const isPhysicalAction =
    category === 'combat' ||
    category === 'poursuite' ||
    SKILLS[selectedSkill]?.isPhysical;

  const standardCalculation = calculateStandardTestModifier({
    rank,
    difficultyTier,
    rawAdvantage,
    rawDisadvantage,
    injuryStage,
    isPhysicalAction,
    privilegeBonus,
  });

  const socialCalculation = calculateSocialModifier({
    rank,
    attitude: npcAttitude,
    personalLink,
    demandWeight,
    injuryStage,
    privilegeBonus,
  });

  const combatCalculation = calculateStandardTestModifier({
    rank,
    difficultyTier:
      opponentPhysique === 0
        ? 'triviale'
        : opponentPhysique === 1
        ? 'facile'
        : opponentPhysique === 2
        ? 'moderee'
        : opponentPhysique === 3
        ? 'difficile'
        : opponentPhysique === 4
        ? 'extreme'
        : 'cauchemardesque',
    rawAdvantage,
    rawDisadvantage,
    injuryStage,
    isPhysicalAction: true,
    privilegeBonus,
  });

  // Pick current total modifier and guaranteed floor based on category
  const currentModifier =
    category === 'social'
      ? socialCalculation.modifierTotal
      : category === 'combat'
      ? combatCalculation.modifierTotal
      : standardCalculation.modifierTotal;

  const currentGuaranteedFloor =
    category === 'social'
      ? socialCalculation.guaranteedFloor
      : category === 'combat'
      ? combatCalculation.guaranteedFloor
      : standardCalculation.guaranteedFloor;

  // Execute D8 Roll
  const rollD8 = useCallback(
    (author?: RollHistoryAuthor, isSecret = false): RollHistoryEntry => {
      const d8Result = Math.floor(Math.random() * 8) + 1;
      const finalTotal = d8Result + currentModifier;
      const degree = determineDegree(finalTotal);

      // Feedback
      const narrative = getNarrativeFeedback(category, degree, selectedSkill);

      // Combat resolution if applicable
      let damageInflicted = 0;
      let damageTaken = 0;
      let opponentNewPhysique = opponentPhysique;
      let playerNewInjury = injuryStage;

      if (category === 'combat') {
        const combatResult = resolveCombatExchange(degree, characterWeapon, opponentWeapon);
        damageInflicted = combatResult.damageInflicted;
        damageTaken = combatResult.damageTaken;

        opponentNewPhysique = Math.max(0, opponentPhysique - damageInflicted);
        playerNewInjury = Math.min(5, (injuryStage + damageTaken) as InjuryStage) as InjuryStage;
        
        // Update local state for immediate response
        setOpponentPhysique(opponentNewPhysique);
        if (damageTaken > 0) {
          setInjuryStage(playerNewInjury);
        }
      }

      // Confetti on Réussite majeure
      if (degree === 'reussite_majeure') {
        try {
          confetti({
            particleCount: 55,
            spread: 70,
            origin: { y: 0.65 },
          });
        } catch (e) {}
      }

      const newEntry: RollHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        category,
        actionName:
          category === 'social'
            ? `Scène Sociale — ${SKILLS[selectedSkill]?.name || 'Social'}`
            : category === 'combat'
            ? `Échange de Combat — Arme ${WEAPONS[characterWeapon].name}`
            : category === 'poursuite'
            ? `Poursuite — ${SKILLS[selectedSkill]?.name || 'Action'}`
            : category === 'danger_mort'
            ? 'Mise en Danger de Mort (Stabilisation)'
            : `Test — ${SKILLS[selectedSkill]?.name || 'Investigation'}`,
        skillKey: selectedSkill,
        rank,
        d8Result,
        modifierTotal: currentModifier,
        finalTotal,
        degree,
        guaranteedFloor: currentGuaranteedFloor,
        difficultyTier,
        difficultyMod: DIFFICULTIES[difficultyTier].modifier,
        rawAdvantage,
        appliedAdvantage: standardCalculation.appliedAdvantage,
        rawDisadvantage,
        appliedDisadvantage: standardCalculation.appliedDisadvantage,
        halfRuleApplied: standardCalculation.halfRuleApplied,
        injuryStage,
        injuryMod: standardCalculation.injuryMod,
        activePrivilege: activePrivilege
          ? { name: activePrivilege.name, bonus: activePrivilege.bonus }
          : undefined,
        npcAttitude: category === 'social' ? npcAttitude : undefined,
        personalLink: category === 'social' ? personalLink : undefined,
        demandWeight: category === 'social' ? demandWeight : undefined,
        characterWeapon: category === 'combat' ? characterWeapon : undefined,
        opponentPhysique: category === 'combat' ? opponentPhysique : undefined,
        opponentWeapon: category === 'combat' ? opponentWeapon : undefined,
        damageInflicted: category === 'combat' ? damageInflicted : undefined,
        damageTaken: category === 'combat' ? damageTaken : undefined,
        opponentNewPhysique: category === 'combat' ? opponentNewPhysique : undefined,
        playerNewInjury: category === 'combat' ? playerNewInjury : undefined,
        narrativeTitle: narrative.title,
        narrativeDetail: narrative.detail,
        traceDetail: narrative.trace,
        author,
        isSecret,
        isRedacted: false,
      };

      setLastRoll(newEntry);
      setHistory(prev => [newEntry, ...prev.filter(e => e.id !== newEntry.id)].slice(0, 50));
      return newEntry;
    },
    [
      category,
      selectedSkill,
      rank,
      currentModifier,
      currentGuaranteedFloor,
      difficultyTier,
      rawAdvantage,
      rawDisadvantage,
      standardCalculation,
      injuryStage,
      activePrivilege,
      npcAttitude,
      personalLink,
      demandWeight,
      characterWeapon,
      opponentPhysique,
      opponentWeapon,
    ]
  );

  // Quick Action: "Brûler un Lien" (Chapter 12.4)
  const burnLink = useCallback(
    (author?: RollHistoryAuthor): RollHistoryEntry | null => {
      if (personalLink <= 0) return null;

      // Sacrifice 1 link
      const newLink = personalLink - 1;
      setPersonalLink(newLink);

      const entry: RollHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        category: 'social',
        actionName: 'Brûler un Lien (Succès automatique)',
        skillKey: selectedSkill,
        rank,
        d8Result: 8,
        modifierTotal: 0,
        finalTotal: 8,
        degree: 'reussite',
        guaranteedFloor: 'reussite',
        difficultyMod: 0,
        rawAdvantage: 0,
        appliedAdvantage: 0,
        rawDisadvantage: 0,
        appliedDisadvantage: 0,
        halfRuleApplied: false,
        injuryStage,
        injuryMod: 0,
        burnedLink: true,
        personalLink: newLink,
        narrativeTitle: 'Lien Sacrifié — Succès Automatique',
        narrativeDetail:
          'Le joueur a sacrifié 1 point de Lien positif pour obtenir sans aucun jet ce que la personne peut donner. Une fois par scène.',
        traceDetail: `Lien diminué de 1 (reste +${newLink}). La personne a agi contre son propre intérêt.`,
        author,
        isSecret: false,
        isRedacted: false,
      };

      setLastRoll(entry);
      setHistory(prev => [entry, ...prev].slice(0, 50));
      return entry;
    },
    [personalLink, selectedSkill, rank, injuryStage]
  );

  // Quick Action: "Option de Confort Maître + Triviale" (Chapter 8.2)
  const applyComfortSuccess = useCallback(
    (author?: RollHistoryAuthor): RollHistoryEntry => {
      const entry: RollHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        category: 'standard',
        actionName: `Option de Confort (Maître + Triviale) — ${SKILLS[selectedSkill]?.name}`,
        skillKey: selectedSkill,
        rank: 4,
        d8Result: 8,
        modifierTotal: 6,
        finalTotal: 14,
        degree: 'reussite',
        guaranteedFloor: 'reussite',
        difficultyTier: 'triviale',
        difficultyMod: 2,
        rawAdvantage: 0,
        appliedAdvantage: 0,
        rawDisadvantage: 0,
        appliedDisadvantage: 0,
        halfRuleApplied: false,
        injuryStage,
        injuryMod: 0,
        narrativeTitle: 'Réussite Automatique de Confort',
        narrativeDetail:
          'Action Triviale menée par un Maître sans enjeu dramatique : le geste est validé sans lancer de dé.',
        author,
        isSecret: false,
        isRedacted: false,
      };

      setLastRoll(entry);
      setHistory(prev => [entry, ...prev].slice(0, 50));
      return entry;
    },
    [selectedSkill, injuryStage]
  );

  // Add remote roll from network
  const addRemoteRoll = useCallback((remoteEntry: RollHistoryEntry) => {
    if (!remoteEntry.isRedacted && remoteEntry.degree === 'reussite_majeure') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch (e) {}
    }

    setHistory(prev => {
      if (prev.some(e => e.id === remoteEntry.id)) {
        return prev.map(e => (e.id === remoteEntry.id ? remoteEntry : e));
      }
      return [remoteEntry, ...prev].slice(0, 50);
    });
  }, []);

  // Update cost decision on a roll (e.g. payer maintenant vs dette)
  const updateRollCostDecision = useCallback(
    (rollId: string, decision: { type: 'paid_now' | 'debt_token'; currency?: DebtCurrency; note?: string }) => {
      if (decision.type === 'debt_token') {
        setDebtTokens(prev => Math.min(3, prev + 1));
      }
      setHistory(prev =>
        prev.map(item => (item.id === rollId ? { ...item, costDecision: decision } : item))
      );
      if (lastRoll?.id === rollId) {
        setLastRoll(prev => (prev ? { ...prev, costDecision: decision } : null));
      }
    },
    [lastRoll]
  );

  // Execute GM Secret Roll
  const executeGMSecretRoll = useCallback(
    (actionName: string, modifier: number, author?: RollHistoryAuthor): RollHistoryEntry => {
      const d8Result = Math.floor(Math.random() * 8) + 1;
      const finalTotal = d8Result + modifier;
      const degree = determineDegree(finalTotal);

      const narrative = getNarrativeFeedback('standard', degree);

      const entry: RollHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        category: 'standard',
        actionName: `[Confidentiel] ${actionName}`,
        rank: 0,
        d8Result,
        modifierTotal: modifier,
        finalTotal,
        degree,
        guaranteedFloor: determineDegree(1 + modifier),
        difficultyMod: 0,
        rawAdvantage: 0,
        appliedAdvantage: 0,
        rawDisadvantage: 0,
        appliedDisadvantage: 0,
        halfRuleApplied: false,
        injuryStage: 1,
        injuryMod: 0,
        narrativeTitle: `Résultat Confidentiel — ${narrative.title}`,
        narrativeDetail: narrative.detail,
        author,
        isSecret: true,
        isRedacted: false,
      };

      setLastRoll(entry);
      setHistory(prev => [entry, ...prev].slice(0, 50));
      return entry;
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setLastRoll(null);
  }, []);

  return {
    category,
    setCategory,
    selectedSkill,
    setSelectedSkill,
    rank,
    setRank,
    difficultyTier,
    setDifficultyTier,
    rawAdvantage,
    setRawAdvantage,
    rawDisadvantage,
    setRawDisadvantage,
    archetype,
    setArchetype,
    activePrivilegeId,
    setActivePrivilegeId,
    injuryStage,
    setInjuryStage,
    debtTokens,
    setDebtTokens,
    npcAttitude,
    setNpcAttitude,
    personalLink,
    setPersonalLink,
    demandWeight,
    setDemandWeight,
    characterWeapon,
    setCharacterWeapon,
    opponentPhysique,
    setOpponentPhysique,
    opponentWeapon,
    setOpponentWeapon,
    currentModifier,
    currentGuaranteedFloor,
    standardCalculation,
    socialCalculation,
    combatCalculation,
    board,
    updateBoard,
    history,
    lastRoll,
    rollD8,
    executeRoll: rollD8,
    executeGMSecretRoll,
    burnLink,
    applyComfortSuccess,
    addRemoteRoll,
    updateRollCostDecision,
    clearHistory,
  };
}
