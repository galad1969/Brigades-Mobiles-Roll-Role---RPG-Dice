/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Share2,
  BookOpen,
  Calendar,
  Award,
  Shield,
  Crown,
  Dices,
  RotateCcw,
  Sparkles,
  Check,
  HeartPulse,
  Flame,
  Swords,
  Scroll,
  MessageSquare,
  Footprints,
  Eye,
  EyeOff,
  Clock,
  Trash2,
} from 'lucide-react';
import {
  PlayerRole,
  RoomPlayer,
  RollHistoryEntry,
  BrigadeBoard,
  DegreeResult,
  WeaponCategory,
  DifficultyTier,
  AdvantageType,
  DisadvantageType,
  InjuryStage,
  SkillRank,
} from './types';
import { useMultiplayerRoom } from './hooks/useMultiplayerRoom';
import { RoomModal } from './components/RoomModal';
import { PlayersListModal } from './components/PlayersListModal';
import { BrigadeBoardModal } from './components/BrigadeBoardModal';
import { RulesReferenceModal } from './components/RulesReferenceModal';
import {
  DEGREE_DESCRIPTIONS,
  SKILL_RANKS,
  DIFFICULTIES,
  WEAPONS,
  TIME_COST_ACTIONS,
  XP_CHECKLIST,
  SKILL_XP_COSTS,
} from './data/rulesData';
import { determineDegree, calculateInjuryModifier } from './utils/diceRules';

type TabKey = 'generic' | 'action' | 'social' | 'pursuit' | 'combat' | 'end_case';

const DEGREE_INFO: Record<DegreeResult, { label: string; summary: string; colorClass: string }> = {
  echec_critique: {
    label: 'Échec critique',
    summary: 'Conséquence dramatique & complication majeure',
    colorClass: 'text-[#8B0000] font-bold',
  },
  echec: {
    label: 'Échec',
    summary: "Pas d'avancement direct",
    colorClass: 'text-[#9A3412] font-bold',
  },
  ambivalent: {
    label: 'Ambivalent',
    summary: "« Vous l'obtenez, mais... »",
    colorClass: 'text-[#B45309] font-bold',
  },
  reussite: {
    label: 'Réussite',
    summary: 'Objectif atteint proprement',
    colorClass: 'text-[#15803D] font-bold',
  },
  reussite_majeure: {
    label: 'Réussite majeure',
    summary: 'Succès éclatant avec avantage net',
    colorClass: 'text-[#047857] font-bold',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('action');

  // Modals state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState<boolean>(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Roll history & state
  const [history, setHistory] = useState<RollHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('bm1910_roll_history_v6');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load roll history from localStorage', e);
    }
    return [];
  });
  const [lastRoll, setLastRoll] = useState<RollHistoryEntry | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isSecretRoll, setIsSecretRoll] = useState(false);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem('bm1910_roll_history_v6', JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.warn('Failed to save roll history to localStorage', e);
    }
  }, [history]);

  // Handle remote roll from Multiplayer P2P
  const handleRemoteRollReceived = useCallback((entry: RollHistoryEntry) => {
    setHistory((prev) => {
      if (prev.some((h) => h.id === entry.id)) return prev;
      return [entry, ...prev].slice(0, 30);
    });
    setLastRoll(entry);
  }, []);

  const getHistoryForSync = useCallback(() => history, [history]);

  // Multiplayer Hook
  const {
    roomId,
    isConnected,
    profile,
    players,
    board,
    updateProfile,
    joinRoom,
    leaveRoom,
    broadcastRoll,
    broadcastBoard,
  } = useMultiplayerRoom(handleRemoteRollReceived, getHistoryForSync);

  // Auto-join room from URL hash on load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/room/')) {
      const targetRoom = decodeURIComponent(hash.replace('#/room/', '')).trim();
      if (targetRoom && targetRoom !== roomId) {
        joinRoom(targetRoom);
      }
    }
  }, [joinRoom, roomId]);

  // Copy link helper
  const handleCopyInvitationLink = () => {
    if (!roomId) return;
    const url = `${window.location.origin}${window.location.pathname}#/room/${encodeURIComponent(roomId)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      })
      .catch(() => {
        prompt('Copiez ce lien pour inviter votre brigade :', url);
      });
  };

  // =========================================================================
  // TAB 0 : TEST GÉNÉRIQUE RAPIDE (SANS SE PRENDRE LA TÊTE)
  // =========================================================================
  const [genericRank, setGenericRank] = useState<SkillRank>(2); // 0, 1, 2, 3, 4
  const [genericDiffOrAttitude, setGenericDiffOrAttitude] = useState<number>(0); // Modificateur direct (-3 à +2)
  const [genericAdvantage, setGenericAdvantage] = useState<AdvantageType>(0); // 0, 1, 2
  const [genericDisadvantage, setGenericDisadvantage] = useState<DisadvantageType>(0); // 0, 1, 2
  const [genericHealthPenalty, setGenericHealthPenalty] = useState<number>(0); // 0, -1, -2, -3

  const genericTotalModifier =
    genericRank +
    genericDiffOrAttitude +
    genericAdvantage -
    genericDisadvantage +
    genericHealthPenalty;

  const genericGuaranteedFloor = determineDegree(1 + genericTotalModifier);

  // =========================================================================
  // TAB 1 : TEST D'ACTION / PHYSIQUE / ENQUÊTE (OFFICIAL D8 RULES)
  // =========================================================================
  const [actionRank, setActionRank] = useState<SkillRank>(2); // 0=Non formé, 1=Novice, 2=Correct, 3=Spécialiste, 4=Maître
  const [actionDifficultyTier, setActionDifficultyTier] = useState<DifficultyTier>('moderee');
  const [actionAdvantage, setActionAdvantage] = useState<AdvantageType>(0); // 0, 1, 2
  const [actionDisadvantage, setActionDisadvantage] = useState<DisadvantageType>(0); // 0, 1, 2
  const [actionSceneType, setActionSceneType] = useState<string>('investigation');
  const [actionInjury, setActionInjury] = useState<InjuryStage>(1); // 1=Indemne, 2=Éprouvé, 3=Blessé, 4=Grièvement blessé, 5=Hors de combat
  const [actionPrivilegeBonus, setActionPrivilegeBonus] = useState<number>(0); // 0, 1 (Métier), 2 (Appui)

  // Half-rule on extreme and nightmare difficulty
  const isActionExtremeOrNightmare =
    actionDifficultyTier === 'extreme' || actionDifficultyTier === 'cauchemardesque';
  const appliedActionAdvantage = isActionExtremeOrNightmare
    ? (Math.floor(actionAdvantage / 2) as AdvantageType)
    : actionAdvantage;

  // Injury calculation according to book:
  // 1: 0
  // 2 (Éprouvé): -1 on physical actions (physique, filature, mecanique), 0 otherwise
  // 3 (Blessé): -1 on ALL actions
  // 4 (Grièvement blessé): -2 on ALL actions
  // 5 (Hors de combat): -3 on ALL actions
  const isPhysicalAction = ['physique', 'mecanique'].includes(actionSceneType);
  const actionInjuryPenalty = calculateInjuryModifier(actionInjury, isPhysicalAction);

  const actionDifficultyMod = DIFFICULTIES[actionDifficultyTier].modifier;
  const actionTotalModifier =
    actionRank +
    actionDifficultyMod +
    appliedActionAdvantage -
    actionDisadvantage +
    actionInjuryPenalty +
    actionPrivilegeBonus;

  const actionGuaranteedFloor = determineDegree(1 + actionTotalModifier);

  // =========================================================================
  // TAB 2 : ÉCHANGE SOCIAL (OFFICIAL D8 RULES)
  // =========================================================================
  const [socialRank, setSocialRank] = useState<SkillRank>(2); // 0, 1, 2, 3, 4
  const [socialAttitude, setSocialAttitude] = useState<-1 | 0 | 1>(0); // Hostile (-1), Neutre (0), Favorable (+1)
  const [socialLink, setSocialLink] = useState<number>(0); // -3 to +3
  const [socialDemand, setSocialDemand] = useState<-1 | 0 | 1>(0); // Lourde (-1), Ordinaire (0), Anodine (+1)
  const [isBurnLink, setIsBurnLink] = useState<boolean>(false); // +2 (Brûler un Lien)
  const [socialAdvantage, setSocialAdvantage] = useState<AdvantageType>(0);
  const [socialDisadvantage, setSocialDisadvantage] = useState<DisadvantageType>(0);
  const [socialInjury, setSocialInjury] = useState<InjuryStage>(1);
  const [socialPrivilegeBonus, setSocialPrivilegeBonus] = useState<number>(0);

  const socialInjuryPenalty = calculateInjuryModifier(socialInjury, false);

  const socialTotalModifier =
    socialRank +
    socialAttitude +
    socialLink +
    socialDemand +
    (isBurnLink ? 2 : 0) +
    socialAdvantage -
    socialDisadvantage +
    socialInjuryPenalty +
    socialPrivilegeBonus;

  const socialGuaranteedFloor = determineDegree(1 + socialTotalModifier);

  // =========================================================================
  // TAB 3 : COURSE & POURSUITE (OFFICIAL D8 RULES)
  // =========================================================================
  const [pursuitRank, setPursuitRank] = useState<SkillRank>(2); // 0, 1, 2, 3, 4
  const [pursuitDistance, setPursuitDistance] = useState<number>(0); // Au contact (+1), Moyenne (0), Loin (-1), Nette avance (-2)
  const [pursuitOpponentSpeed, setPursuitOpponentSpeed] = useState<number>(0); // Lourd (+1), Ordinaire (0), Agile (-1), Exceptionnel (-2)
  const [pursuitEnvironment, setPursuitEnvironment] = useState<number>(0); // Dégagé (+1), Normal (0), Encombré (-1), Dédale (-2)
  const [pursuitAdvantage, setPursuitAdvantage] = useState<AdvantageType>(0);
  const [pursuitDisadvantage, setPursuitDisadvantage] = useState<DisadvantageType>(0);
  const [pursuitInjury, setPursuitInjury] = useState<InjuryStage>(1);
  const [pursuitProgress, setPursuitProgress] = useState<number>(1); // 1 = Contact visuel, 2 = Talonnement, 3 = Interpellation
  const [drawnComplication, setDrawnComplication] = useState<string | null>(null);

  const pursuitInjuryPenalty = calculateInjuryModifier(pursuitInjury, true);

  const pursuitTotalModifier =
    pursuitRank +
    pursuitDistance +
    pursuitOpponentSpeed +
    pursuitEnvironment +
    pursuitAdvantage -
    pursuitDisadvantage +
    pursuitInjuryPenalty;

  const pursuitGuaranteedFloor = determineDegree(1 + pursuitTotalModifier);

  // =========================================================================
  // TAB 4 : COMBAT & BLESSURES (OFFICIAL D8 RULES)
  // =========================================================================
  const [combatRank, setCombatRank] = useState<SkillRank>(2); // 0, 1, 2, 3, 4
  const [combatOpponentPhysique, setCombatOpponentPhysique] = useState<number>(0); // Figurant (+1), Sbire (0), Endurci (-1), Boss (-2), Légende (-3)
  const [combatCharWeapon, setCombatCharWeapon] = useState<WeaponCategory>('moyenne');
  const [combatOppWeapon, setCombatOppWeapon] = useState<WeaponCategory>('legere');
  const [combatAdvantage, setCombatAdvantage] = useState<AdvantageType>(0);
  const [combatDisadvantage, setCombatDisadvantage] = useState<DisadvantageType>(0);
  const [combatInjury, setCombatInjury] = useState<InjuryStage>(1);

  const combatInjuryPenalty = calculateInjuryModifier(combatInjury, true);

  const combatTotalModifier =
    combatRank +
    combatOpponentPhysique +
    combatAdvantage -
    combatDisadvantage +
    combatInjuryPenalty;

  const combatGuaranteedFloor = determineDegree(1 + combatTotalModifier);

  // =========================================================================
  // TAB 5 : FIN D'AFFAIRE & XP
  // =========================================================================
  const [xpChecks, setXpChecks] = useState<Record<string, boolean>>({
    participe: true,
    resolue: false,
    avance: false,
    personnage: false,
    trace: false,
  });

  const totalXpEarned = Object.entries(xpChecks).reduce(
    (sum, [key, checked]) => (checked ? sum + 1 : sum),
    0
  );

  // =========================================================================
  // PERFORM ROLL & MULTIPLAYER BROADCAST
  // =========================================================================
  const executeRoll = (categoryName: string, modifier: number, categoryKey: any) => {
    setIsRolling(true);
    const d8Result = Math.floor(Math.random() * 8) + 1;
    const finalTotal = d8Result + modifier;
    const degree = determineDegree(finalTotal);

    setTimeout(() => {
      const desc = DEGREE_DESCRIPTIONS[degree];
      let narrativeDetail = desc.general;
      let traceDetail: string | undefined = undefined;

      if (categoryKey === 'social') {
        narrativeDetail = desc.social;
        if (degree === 'reussite_majeure') {
          traceDetail =
            "L'attitude de l'interlocuteur monte d'un cran (+1) pour toute la Brigade & le Lien gagne +1.";
        } else if (degree === 'reussite') {
          traceDetail = 'Le Lien personnel gagne +1 (ou reste stable). Coopération nette.';
        } else if (degree === 'ambivalent') {
          traceDetail =
            'Dette, promesse ou compromission contractée. Le Lien peut évoluer selon la négociation.';
        } else if (degree === 'echec') {
          traceDetail = 'Refus temporaire. Le Lien personnel perd 1 ou trace narrative au carnet.';
        } else if (degree === 'echec_critique') {
          traceDetail =
            "Rupture ! L'attitude descend d'un cran (-1) et le Lien personnel perd 1 (alerte/avocat).";
        }
      } else if (categoryKey === 'combat') {
        narrativeDetail = desc.physique;
      } else if (categoryKey === 'standard') {
        narrativeDetail = desc.enquete;
      }

      // Combat damage calculation
      let dmgInflicted = 0;
      let dmgTaken = 0;
      if (categoryKey === 'combat') {
        const playerW = WEAPONS[combatCharWeapon];
        const oppW = WEAPONS[combatOppWeapon];
        if (degree === 'reussite_majeure') dmgInflicted = playerW.damageDoubled;
        else if (degree === 'reussite') dmgInflicted = playerW.damage;
        else if (degree === 'echec') dmgTaken = oppW.damage;
        else if (degree === 'echec_critique') dmgTaken = oppW.damageDoubled;
      }

      // Compute category-specific snapshot attributes cleanly
      let rollRank: SkillRank = actionRank;
      let rollDifficultyMod = 0;
      let rollRawAdvantage: AdvantageType = 0;
      let rollAppliedAdvantage: AdvantageType = 0;
      let rollRawDisadvantage: DisadvantageType = 0;
      let rollAppliedDisadvantage: DisadvantageType = 0;
      let rollHalfRuleApplied = false;
      let rollInjuryStage: InjuryStage = 1;
      let rollInjuryMod = 0;

      if (categoryKey === 'generic') {
        rollRank = genericRank;
        rollDifficultyMod = genericDiffOrAttitude;
        rollRawAdvantage = genericAdvantage;
        rollAppliedAdvantage = genericAdvantage;
        rollRawDisadvantage = genericDisadvantage;
        rollAppliedDisadvantage = genericDisadvantage;
        rollHalfRuleApplied = false;
        rollInjuryStage = 1;
        rollInjuryMod = genericHealthPenalty;
      } else if (categoryKey === 'action') {
        rollRank = actionRank;
        rollDifficultyMod = actionDifficultyMod;
        rollRawAdvantage = actionAdvantage;
        rollAppliedAdvantage = appliedActionAdvantage;
        rollRawDisadvantage = actionDisadvantage;
        rollAppliedDisadvantage = actionDisadvantage;
        rollHalfRuleApplied = isActionExtremeOrNightmare && actionAdvantage > 0;
        rollInjuryStage = actionInjury;
        rollInjuryMod = actionInjuryPenalty;
      } else if (categoryKey === 'social') {
        rollRank = socialRank;
        rollDifficultyMod = socialAttitude + socialDemand;
        rollRawAdvantage = socialAdvantage;
        rollAppliedAdvantage = socialAdvantage;
        rollRawDisadvantage = socialDisadvantage;
        rollAppliedDisadvantage = socialDisadvantage;
        rollHalfRuleApplied = false;
        rollInjuryStage = socialInjury;
        rollInjuryMod = socialInjuryPenalty;
      } else if (categoryKey === 'pursuit') {
        rollRank = pursuitRank;
        rollDifficultyMod = pursuitDistance + pursuitOpponentSpeed + pursuitEnvironment;
        rollRawAdvantage = pursuitAdvantage;
        rollAppliedAdvantage = pursuitAdvantage;
        rollRawDisadvantage = pursuitDisadvantage;
        rollAppliedDisadvantage = pursuitDisadvantage;
        rollHalfRuleApplied = false;
        rollInjuryStage = pursuitInjury;
        rollInjuryMod = pursuitInjuryPenalty;
      } else if (categoryKey === 'combat') {
        rollRank = combatRank;
        rollDifficultyMod = combatOpponentPhysique;
        rollRawAdvantage = combatAdvantage;
        rollAppliedAdvantage = combatAdvantage;
        rollRawDisadvantage = combatDisadvantage;
        rollAppliedDisadvantage = combatDisadvantage;
        rollHalfRuleApplied = false;
        rollInjuryStage = combatInjury;
        rollInjuryMod = combatInjuryPenalty;
      }

      const rollEntry: RollHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        category: categoryKey,
        actionName: categoryName,
        rank: rollRank,
        d8Result,
        modifierTotal: modifier,
        finalTotal,
        degree,
        guaranteedFloor: determineDegree(1 + modifier),
        difficultyMod: rollDifficultyMod,
        rawAdvantage: rollRawAdvantage,
        appliedAdvantage: rollAppliedAdvantage,
        rawDisadvantage: rollRawDisadvantage,
        appliedDisadvantage: rollAppliedDisadvantage,
        halfRuleApplied: rollHalfRuleApplied,
        injuryStage: rollInjuryStage,
        injuryMod: rollInjuryMod,
        characterWeapon: categoryKey === 'combat' ? combatCharWeapon : undefined,
        opponentWeapon: categoryKey === 'combat' ? combatOppWeapon : undefined,
        damageInflicted: dmgInflicted,
        damageTaken: dmgTaken,
        narrativeTitle: desc.label,
        narrativeDetail,
        traceDetail,
        isSecret: isSecretRoll && profile.role === 'gm',
        author: {
          name: profile.name,
          role: profile.role,
          color: profile.color,
        },
      };

      setLastRoll(rollEntry);
      setHistory((prev) => [rollEntry, ...prev].slice(0, 30));
      setIsRolling(false);

      // Broadcast to all peers in multiplayer
      broadcastRoll(rollEntry);

      // Update pursuit progress automatically if applicable
      if (categoryKey === 'pursuit') {
        if (degree === 'reussite_majeure' || degree === 'reussite') {
          setPursuitProgress((p) => Math.min(3, p + 1));
        } else if (degree === 'echec' || degree === 'echec_critique') {
          setPursuitProgress((p) => Math.max(0, p - 1));
        }
      }
    }, 150);
  };

  const drawComplication = () => {
    const list = [
      "1 - Porte cochère : Un attelage débouche brutalement d'une cour d'immeuble — sauter, rouler ou perdre trois secondes.",
      "2 - Étal renversé : Le fuyard renverse des cageots de légumes ; la foule ouvrière prend parti, pas forcément pour la police.",
      "3 - Sergent de ville zélé : Un sergent surgit et s'interpose… contre l'inspecteur en civil. Les papiers, vite !",
      "4 - Tramway en marche : Le fuyard saute sur le marchepied d'un tramway en marche. S'y hisser ou couper par la rue parallèle ?",
      "5 - Marché ou sortie d'église : Foule dense et compacte avalant tout le monde. L'intuition remplace la vue.",
      "6 - Escalier et toitures : Escalier de service, palissade de chantier — le terrain avantage le plus agile, pas le plus rapide.",
      "7 - Objet jeté : Le fuyard jette une sacoche dans une bouche d'égout. Marquer l'endroit ou poursuivre sans faiblir ?",
      "8 - Complice en embuscade : Il ne fuyait pas au hasard : au coin suivant, un complice armé attend.",
    ];
    const r = Math.floor(Math.random() * list.length);
    setDrawnComplication(list[r]);
  };

  const formatMod = (val: number) => (val >= 0 ? `+${val}` : `${val}`);

  return (
    <div className="min-h-screen bg-[#EDE7DB] py-4 sm:py-8 px-2 sm:px-4 font-serif text-[#2B231D] antialiased">
      
      {/* MAIN DOCUMENT CONTAINER WITH VINTAGE DOUBLE BORDER */}
      <div className="max-w-4xl mx-auto bg-[#FAF7EE] border-2 border-[#5C3A1D] p-3 sm:p-7 shadow-xl relative">
        
        {/* INNER BORDER */}
        <div className="border border-[#78350F]/40 p-3 sm:p-5 bg-white/40">

          {/* ========================================================= */}
          {/* MULTIPLAYER & TABLE STATUS BAR (VINTAGE BELLE ÉPOQUE) */}
          {/* ========================================================= */}
          <div className="bg-[#F4EFE2] border border-[#78350F]/30 p-2.5 sm:p-3 rounded mb-4 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            
            {/* Left: Connection Status & Profile */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold font-mono text-xs shadow-xs relative cursor-pointer"
                style={{ backgroundColor: profile.color }}
                onClick={() => setIsRoomModalOpen(true)}
                title="Modifier mon profil"
              >
                {profile.role === 'gm' ? <Crown size={15} /> : profile.name.charAt(0).toUpperCase()}
                {isConnected && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full animate-pulse" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel font-bold text-xs text-[#6B1717] tracking-wider">
                    {isConnected && roomId ? `BRIGADE : ${roomId}` : 'TABLE LOCALE / SOLO'}
                  </span>
                  {isConnected && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                      {players.length} agent{players.length > 1 ? 's' : ''} en direct
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-600 italic">
                  <span>{profile.name}</span> •{' '}
                  <span>{profile.role === 'gm' ? 'Meneur de Jeu (MJ)' : 'Inspecteur'}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-cinzel font-bold">
              {/* Join/Create Room button */}
              <button
                onClick={() => setIsRoomModalOpen(true)}
                className="px-2.5 py-1.5 bg-[#6B1717] hover:bg-[#521111] text-white rounded transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Créer ou Rejoindre une table en direct"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isConnected ? 'Gérer Table' : 'Table Multi'}</span>
              </button>

              {/* Copy invite link */}
              {isConnected && roomId && (
                <button
                  onClick={handleCopyInvitationLink}
                  className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded transition-colors flex items-center gap-1 border border-stone-400 cursor-pointer"
                  title="Copier le lien d'invitation direct"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Lien copié !' : 'Inviter'}</span>
                </button>
              )}

              {/* Connected Players list */}
              {isConnected && (
                <button
                  onClick={() => setIsPlayersModalOpen(true)}
                  className="px-2 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded transition-colors flex items-center gap-1 border border-stone-400 cursor-pointer"
                  title="Voir la liste des collègues connectés"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-900" />
                  <span>({players.length})</span>
                </button>
              )}

              {/* Ardoise / Brigade Board */}
              <button
                onClick={() => setIsBoardModalOpen(true)}
                className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded transition-colors flex items-center gap-1 border border-stone-400 cursor-pointer"
                title="Ouvrir l'Ardoise de la Brigade (Faits & Délais)"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-800" />
                <span>Ardoise ({board.remainingDays}j)</span>
              </button>

              {/* Rules reference */}
              <button
                onClick={() => setIsRulesModalOpen(true)}
                className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded transition-colors flex items-center gap-1 border border-stone-400 cursor-pointer"
                title="Consulter l'aide-mémoire officiel des règles D8"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#78350F]" />
                <span>Règles D8</span>
              </button>
            </div>

          </div>

          {/* HEADER */}
          <header className="text-center mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold tracking-wider text-[#6B1717]">
              BRIGADES MOBILES 1910
            </h1>
            <p className="mt-1 text-xs sm:text-sm italic text-stone-700">
              — Boîte à Outils Système D8 (Générique V6) —
            </p>
            <div className="w-full h-px bg-[#5C3A1D]/30 my-3" />
          </header>

          {/* HORIZONTAL NAVIGATION TABS */}
          <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 mb-4 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('generic')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'generic'
                  ? 'border border-[#6B1717] bg-[#6B1717] text-white font-bold shadow-xs'
                  : 'text-stone-800 hover:text-[#6B1717] font-semibold bg-stone-100/80 border border-stone-300'
              }`}
            >
              🎲 Test Générique (Rapide)
            </button>

            <button
              onClick={() => setActiveTab('action')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'action'
                  ? 'border border-[#6B1717] bg-white text-[#6B1717] font-bold shadow-xs'
                  : 'text-stone-700 hover:text-[#6B1717] font-medium'
              }`}
            >
              Test d'Action / Physique
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'social'
                  ? 'border border-[#6B1717] bg-white text-[#6B1717] font-bold shadow-xs'
                  : 'text-stone-700 hover:text-[#6B1717] font-medium'
              }`}
            >
              Échange Social
            </button>

            <button
              onClick={() => setActiveTab('pursuit')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'pursuit'
                  ? 'border border-[#6B1717] bg-white text-[#6B1717] font-bold shadow-xs'
                  : 'text-stone-700 hover:text-[#6B1717] font-medium'
              }`}
            >
              Course & Poursuite
            </button>

            <button
              onClick={() => setActiveTab('combat')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'combat'
                  ? 'border border-[#6B1717] bg-white text-[#6B1717] font-bold shadow-xs'
                  : 'text-stone-700 hover:text-[#6B1717] font-medium'
              }`}
            >
              Combat & Blessures
            </button>

            <button
              onClick={() => setActiveTab('end_case')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeTab === 'end_case'
                  ? 'border border-[#6B1717] bg-white text-[#6B1717] font-bold shadow-xs'
                  : 'text-stone-700 hover:text-[#6B1717] font-medium'
              }`}
            >
              Séquence de Fin d'Affaire
            </button>
          </nav>

          <div className="w-full h-px bg-[#5C3A1D]/20 mb-5" />

          {/* ======================================================== */}
          {/* TAB 0 : TEST GÉNÉRIQUE RAPIDE (SANS SE PRENDRE LA TÊTE) */}
          {/* ======================================================== */}
          {activeTab === 'generic' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-900/20 rounded text-xs text-stone-700">
                <span className="font-bold text-[#6B1717]">Lanceur Universel Immédiat :</span> Choisissez vos paramètres de base (Compétence, Difficulté/Attitude, Avantage, Désavantage, Malus de santé) et lancez le dé directement pour un résultat instantané synchronisé.
              </div>

              {/* CONTROLS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* RANG DE COMPÉTENCE */}
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    RANG DE COMPÉTENCE :
                  </label>
                  <select
                    value={genericRank}
                    onChange={(e) => setGenericRank(Number(e.target.value) as SkillRank)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    {SKILL_RANKS.map((r) => (
                      <option key={r.rank} value={r.rank}>
                        Rang {r.rank} : {r.label} (+{r.bonus})
                      </option>
                    ))}
                  </select>
                </div>

                {/* DIFFICULTÉ / ATTITUDE */}
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    DIFFICULTÉ / ATTITUDE :
                  </label>
                  <select
                    value={genericDiffOrAttitude}
                    onChange={(e) => setGenericDiffOrAttitude(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={2}>Triviale / Favorable (+2)</option>
                    <option value={1}>Facile / Amicale (+1)</option>
                    <option value={0}>Modérée / Neutre (0)</option>
                    <option value={-1}>Difficile / Réticente (-1)</option>
                    <option value={-2}>Extrême / Hostile (-2)</option>
                    <option value={-3}>Cauchemardesque (-3)</option>
                  </select>
                </div>

                {/* AVANTAGE */}
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    AVANTAGE :
                  </label>
                  <select
                    value={genericAdvantage}
                    onChange={(e) => setGenericAdvantage(Number(e.target.value) as AdvantageType)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={0}>Aucun (0)</option>
                    <option value={1}>Mineur (+1)</option>
                    <option value={2}>Majeur (+2)</option>
                  </select>
                </div>

                {/* DÉSAVANTAGE */}
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    DÉSAVANTAGE :
                  </label>
                  <select
                    value={genericDisadvantage}
                    onChange={(e) => setGenericDisadvantage(Number(e.target.value) as DisadvantageType)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={0}>Aucun (0)</option>
                    <option value={1}>Mineur (-1)</option>
                    <option value={2}>Majeur (-2)</option>
                  </select>
                </div>

                {/* MALUS DE SANTÉ (BASE 0) */}
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    MALUS DE SANTÉ :
                  </label>
                  <select
                    value={genericHealthPenalty}
                    onChange={(e) => setGenericHealthPenalty(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={0}>Base (0) — Indemne / Éprouvé</option>
                    <option value={-1}>Blessé (-1)</option>
                    <option value={-2}>Grièvement blessé (-2)</option>
                    <option value={-3}>Hors de combat (-3)</option>
                  </select>
                </div>
              </div>

              {/* MODIFIER BREAKDOWN & ESTIMATE */}
              <div className="p-3 bg-[#FAF7EE] border border-stone-300 text-xs text-stone-700 space-y-1">
                <div>
                  <strong>Modificateur de situation total :</strong>{' '}
                  <span className="font-mono font-bold text-sm text-[#6B1717]">
                    {formatMod(genericTotalModifier)}
                  </span>{' '}
                  (Compétence {formatMod(genericRank)}, Diff/Att {formatMod(genericDiffOrAttitude)}, Avantage {formatMod(genericAdvantage)}, Désavantage {formatMod(-genericDisadvantage)}, Santé {formatMod(genericHealthPenalty)})
                </div>
                <div>
                  <strong>Plancher garanti au pire résultat (D8 = 1) :</strong>{' '}
                  <span className={DEGREE_INFO[genericGuaranteedFloor].colorClass}>
                    {DEGREE_INFO[genericGuaranteedFloor].label}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-stone-600 italic">
                  Tirage calculé selon la table D8 officielle : ≤1 Critique, 2-3 Échec, 4-6 Ambivalent, 7-8 Réussite, 9+ Réussite majeure.
                </div>

                <button
                  onClick={() => executeRoll('Test Générique Rapide', genericTotalModifier, 'generic')}
                  disabled={isRolling}
                  className="px-6 py-3 bg-[#6B1717] hover:bg-[#521111] text-white font-cinzel font-bold text-sm tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>{isRolling ? 'LANCEMENT EN COURS...' : 'LANCER LE TEST GÉNÉRIQUE'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1 : TEST D'ACTION / PHYSIQUE (VERIFIED OFFICIAL D8) */}
          {/* ======================================================== */}
          {activeTab === 'action' && (
            <div className="space-y-4">
              
              {/* TOP 4 SELECTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    RANG DE COMPÉTENCE :
                  </label>
                  <select
                    value={actionRank}
                    onChange={(e) => setActionRank(Number(e.target.value) as SkillRank)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    {SKILL_RANKS.map((r) => (
                      <option key={r.rank} value={r.rank}>
                        Rang {r.rank} : {r.label} (+{r.bonus})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    DIFFICULTÉ DU TEST :
                  </label>
                  <select
                    value={actionDifficultyTier}
                    onChange={(e) => setActionDifficultyTier(e.target.value as DifficultyTier)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value="triviale">Triviale (+2 — Indice 0)</option>
                    <option value="facile">Facile (+1 — Indice 1)</option>
                    <option value="moderee">Modérée (0 — Difficulté de référence)</option>
                    <option value="difficile">Difficile (-1 — Indice 3)</option>
                    <option value="extreme">Extrême (-2 — Exploit / Règle moitié)</option>
                    <option value="cauchemardesque">Cauchemardesque (-3 — Hors norme / Règle moitié)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    CIRCONSTANCE FAVORABLE :
                  </label>
                  <select
                    value={actionAdvantage}
                    onChange={(e) => setActionAdvantage(Number(e.target.value) as AdvantageType)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={0}>Aucune (0)</option>
                    <option value={1}>Favorable (+1)</option>
                    <option value={2}>Très favorable (+2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    CIRCONSTANCE DÉFAVORABLE :
                  </label>
                  <select
                    value={actionDisadvantage}
                    onChange={(e) => setActionDisadvantage(Number(e.target.value) as DisadvantageType)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={0}>Aucune (0)</option>
                    <option value={1}>Défavorable (-1)</option>
                    <option value={2}>Très défavorable (-2)</option>
                  </select>
                </div>
              </div>

              {/* SECOND ROW : 3 SELECTS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    TYPE DE SCÈNE D'ACTION :
                  </label>
                  <select
                    value={actionSceneType}
                    onChange={(e) => setActionSceneType(e.target.value)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value="investigation">Investigation / Enquête générale</option>
                    <option value="physique">Action Physique / Athlétisme / Escalade</option>
                    <option value="filature">Filature / Discrétion & Surveillance</option>
                    <option value="mecanique">Conduite / Mécanique de terrain</option>
                    <option value="erudition">Érudition / Archives & Procédure</option>
                    <option value="techniques">Techniques modernes (Photo / Empreintes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    STATUT DES BLESSURES :
                  </label>
                  <select
                    value={actionInjury}
                    onChange={(e) => setActionInjury(Number(e.target.value) as InjuryStage)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={1}>Seuil 1 : Indemne (Aucun malus)</option>
                    <option value={2}>Seuil 2 : Éprouvé (-1 si action physique)</option>
                    <option value={3}>Seuil 3 : Blessé (-1 à toutes actions)</option>
                    <option value={4}>Seuil 4 : Grièvement blessé (-2 à toutes actions)</option>
                    <option value={5}>Seuil 5 : Hors de combat (-3 / Danger de mort)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    PRIVILÈGE D'ARCHÉTYPE :
                  </label>
                  <select
                    value={actionPrivilegeBonus}
                    onChange={(e) => setActionPrivilegeBonus(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={0}>Aucun (0)</option>
                    <option value={1}>Privilège de Métier (+1)</option>
                    <option value={2}>Privilège d'Appui (+2)</option>
                  </select>
                </div>
              </div>

              {/* CALCULATION & FLOOR BOX */}
              <div className="bg-[#F4EFE2] border-l-4 border-[#78350F] p-3 sm:p-4 text-xs sm:text-sm text-stone-800 space-y-1.5 mt-3">
                <div className="flex justify-between items-center">
                  <span>Modificateur de situation total :</span>
                  <span className="font-bold text-base text-[#6B1717]">
                    {formatMod(actionTotalModifier)}
                  </span>
                </div>
                <div>
                  <span>Plancher garanti au pire résultat (D8 = 1) : </span>
                  <span className={DEGREE_INFO[actionGuaranteedFloor].colorClass}>
                    {DEGREE_INFO[actionGuaranteedFloor].label} ({DEGREE_INFO[actionGuaranteedFloor].summary})
                  </span>
                </div>
                {isActionExtremeOrNightmare && actionAdvantage > 0 && (
                  <p className="text-[11px] italic text-amber-800 pt-0.5">
                    * Règle de la moitié active : L'avantage est réduit (+{actionAdvantage} → +{appliedActionAdvantage}).
                  </p>
                )}
              </div>

              {/* CENTERED BUTTON & SECRET OPTION FOR GM */}
              <div className="text-center pt-2 space-y-2">
                {profile.role === 'gm' && (
                  <label className="inline-flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSecretRoll}
                      onChange={(e) => setIsSecretRoll(e.target.checked)}
                      className="rounded text-[#6B1717]"
                    />
                    <span>Effectuer en Jet Secret (Voilé pour les joueurs)</span>
                  </label>
                )}

                <div>
                  <button
                    onClick={() => executeRoll("Test d'Action / Physique", actionTotalModifier, 'standard')}
                    disabled={isRolling}
                    className="px-8 py-3 bg-[#801818] hover:bg-[#661212] text-white font-cinzel font-bold text-sm sm:text-base tracking-wider transition-colors shadow-md rounded cursor-pointer active:translate-y-0.5"
                  >
                    {isRolling ? 'LANCEMENT DU DÉ...' : 'LANCER LE DÉ (1D8)'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2 : ÉCHANGE SOCIAL (VERIFIED OFFICIAL D8) */}
          {/* ======================================================== */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    RANG SOCIAL (0 À 4) :
                  </label>
                  <select
                    value={socialRank}
                    onChange={(e) => setSocialRank(Number(e.target.value) as SkillRank)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    {SKILL_RANKS.map((r) => (
                      <option key={r.rank} value={r.rank}>
                        Rang {r.rank} : {r.label} (+{r.bonus})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    ATTITUDE DE L'INTERLOCUTEUR :
                  </label>
                  <select
                    value={socialAttitude}
                    onChange={(e) => setSocialAttitude(Number(e.target.value) as -1 | 0 | 1)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={-1}>Hostile (-1 — Refus ou défiance)</option>
                    <option value={0}>Neutre (0 — Attentiste ou professionnel)</option>
                    <option value={1}>Favorable / Loyal (+1 — Bienveillant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    LIEN PERSONNEL (-3 À +3) :
                  </label>
                  <select
                    value={socialLink}
                    onChange={(e) => setSocialLink(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={-3}>-3 : Dette lourde / Rancune tenace</option>
                    <option value={-2}>-2 : Froid / Ressentiment</option>
                    <option value={-1}>-1 : Méfiance / Petite dette</option>
                    <option value={0}>0 : Inconnu / Relation neutre</option>
                    <option value={1}>+1 : Bon contact / Sympathie</option>
                    <option value={2}>+2 : Allié fiable / Complicité</option>
                    <option value={3}>+3 : Dévouement / Lien indéfectible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    POIDS DE LA DEMANDE :
                  </label>
                  <select
                    value={socialDemand}
                    onChange={(e) => setSocialDemand(Number(e.target.value) as -1 | 0 | 1)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={-1}>Lourde (-1 — Risquée ou compromettante)</option>
                    <option value={0}>Ordinaire (0 — Demande normale)</option>
                    <option value={1}>Anodine (+1 — Simple renseignement)</option>
                  </select>
                </div>
              </div>

              {/* SECOND ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    CIRCONSTANCES SOCIALES :
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={socialAdvantage}
                      onChange={(e) => setSocialAdvantage(Number(e.target.value) as AdvantageType)}
                      className="w-1/2 bg-[#FAF7EE] border border-stone-400 p-2 text-xs text-stone-900 rounded-none"
                    >
                      <option value={0}>Avantage: 0</option>
                      <option value={1}>Avantage: +1</option>
                      <option value={2}>Avantage: +2</option>
                    </select>
                    <select
                      value={socialDisadvantage}
                      onChange={(e) => setSocialDisadvantage(Number(e.target.value) as DisadvantageType)}
                      className="w-1/2 bg-[#FAF7EE] border border-stone-400 p-2 text-xs text-stone-900 rounded-none"
                    >
                      <option value={0}>Désavantage: 0</option>
                      <option value={1}>Désavantage: -1</option>
                      <option value={2}>Désavantage: -2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    STATUT DES BLESSURES :
                  </label>
                  <select
                    value={socialInjury}
                    onChange={(e) => setSocialInjury(Number(e.target.value) as InjuryStage)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={1}>Indemne / Éprouvé (0 malus)</option>
                    <option value={3}>Blessé (-1 général)</option>
                    <option value={4}>Grièvement blessé (-2 général)</option>
                    <option value={5}>Hors de combat (-3 général)</option>
                  </select>
                </div>

                {/* BURN LINK OPTION */}
                <div className="p-2.5 bg-amber-50/80 border border-[#78350F]/30 rounded">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#6B1717]">
                    <input
                      type="checkbox"
                      checked={isBurnLink}
                      onChange={(e) => setIsBurnLink(e.target.checked)}
                      className="rounded text-[#6B1717]"
                    />
                    <span>Brûler un Lien (+2 au jet)</span>
                  </label>
                  <p className="text-[10px] text-stone-600 italic mt-0.5">
                    Sacrifie 1 point de Lien personnel pour forcer la décision dans l'urgence.
                  </p>
                </div>
              </div>

              {/* CALCULATION & FLOOR BOX */}
              <div className="bg-[#F4EFE2] border-l-4 border-[#78350F] p-3 sm:p-4 text-xs sm:text-sm text-stone-800 space-y-1.5 mt-3">
                <div className="flex justify-between items-center">
                  <span>Modificateur d'Échange Social total :</span>
                  <span className="font-bold text-base text-[#6B1717]">
                    {formatMod(socialTotalModifier)}
                  </span>
                </div>
                <div>
                  <span>Plancher garanti au pire résultat (D8 = 1) : </span>
                  <span className={DEGREE_INFO[socialGuaranteedFloor].colorClass}>
                    {DEGREE_INFO[socialGuaranteedFloor].label} ({DEGREE_INFO[socialGuaranteedFloor].summary})
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => executeRoll('Échange Social', socialTotalModifier, 'social')}
                  disabled={isRolling}
                  className="px-8 py-3 bg-[#801818] hover:bg-[#661212] text-white font-cinzel font-bold text-sm sm:text-base tracking-wider transition-colors shadow-md rounded cursor-pointer active:translate-y-0.5"
                >
                  {isRolling ? 'LANCEMENT DU DÉ...' : 'LANCER LE DÉ (1D8)'}
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3 : COURSE & POURSUITE (VERIFIED OFFICIAL D8) */}
          {/* ======================================================== */}
          {activeTab === 'pursuit' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    RANG ATHLÉTISME (0 À 4) :
                  </label>
                  <select
                    value={pursuitRank}
                    onChange={(e) => setPursuitRank(Number(e.target.value) as SkillRank)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    {SKILL_RANKS.map((r) => (
                      <option key={r.rank} value={r.rank}>
                        Rang {r.rank} : {r.label} (+{r.bonus})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    DISTANCE DU FUYARD :
                  </label>
                  <select
                    value={pursuitDistance}
                    onChange={(e) => setPursuitDistance(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={1}>Au contact / Fuyard ralenti (+1)</option>
                    <option value={0}>Distance moyenne / Vue directe (0)</option>
                    <option value={-1}>Fuyard prend de l'avance (-1)</option>
                    <option value={-2}>Fuyard a une nette avance (-2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    VITESSE / PHYSIQUE DU FUYARD :
                  </label>
                  <select
                    value={pursuitOpponentSpeed}
                    onChange={(e) => setPursuitOpponentSpeed(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={1}>Lourd / Âgé / Encombré (+1)</option>
                    <option value={0}>Ordinaire / Vitesse moyenne (0)</option>
                    <option value={-1}>Agile / Vélo / Rapide (-1)</option>
                    <option value={-2}>Exceptionnel / Motorisé (-2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    ENVIRONNEMENT URBAIN :
                  </label>
                  <select
                    value={pursuitEnvironment}
                    onChange={(e) => setPursuitEnvironment(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={1}>Boulevards dégagés (+1)</option>
                    <option value={0}>Rues ordinaires (0)</option>
                    <option value={-1}>Marché / Gare / Encombré (-1)</option>
                    <option value={-2}>Dédale hostile / Toitures (-2)</option>
                  </select>
                </div>
              </div>

              {/* PROGRESSION TRACKER (3 STEPS) */}
              <div className="bg-white/80 border border-stone-300 p-3 rounded space-y-2">
                <div className="flex justify-between items-center text-xs font-cinzel font-bold text-stone-800">
                  <span>PROGRESSION DE LA POURSUITE (3 CRANS) :</span>
                  <span className="text-[#6B1717]">
                    {pursuitProgress === 3
                      ? 'Interpellation imminente !'
                      : pursuitProgress === 2
                      ? 'Talonnement étroit'
                      : pursuitProgress === 1
                      ? 'Contact visuel'
                      : 'Fuyard hors de vue'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() => setPursuitProgress(step)}
                      className={`flex-1 py-1.5 text-xs font-cinzel font-bold border transition-colors cursor-pointer ${
                        pursuitProgress >= step
                          ? 'bg-[#6B1717] text-white border-[#6B1717]'
                          : 'bg-[#FAF7EE] text-stone-600 border-stone-300'
                      }`}
                    >
                      Cran {step} {step === 3 ? '(Capture)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* CALCULATION & FLOOR BOX */}
              <div className="bg-[#F4EFE2] border-l-4 border-[#78350F] p-3 sm:p-4 text-xs sm:text-sm text-stone-800 space-y-1.5 mt-3">
                <div className="flex justify-between items-center">
                  <span>Modificateur de Poursuite total :</span>
                  <span className="font-bold text-base text-[#6B1717]">
                    {formatMod(pursuitTotalModifier)}
                  </span>
                </div>
                <div>
                  <span>Plancher garanti au pire résultat (D8 = 1) : </span>
                  <span className={DEGREE_INFO[pursuitGuaranteedFloor].colorClass}>
                    {DEGREE_INFO[pursuitGuaranteedFloor].label} ({DEGREE_INFO[pursuitGuaranteedFloor].summary})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => executeRoll('Course & Poursuite', pursuitTotalModifier, 'pursuit')}
                  disabled={isRolling}
                  className="px-8 py-3 bg-[#801818] hover:bg-[#661212] text-white font-cinzel font-bold text-sm sm:text-base tracking-wider transition-colors shadow-md rounded cursor-pointer active:translate-y-0.5"
                >
                  {isRolling ? 'LANCEMENT DU DÉ...' : 'LANCER LE DÉ (1D8)'}
                </button>

                <button
                  onClick={drawComplication}
                  className="px-4 py-3 bg-stone-200 hover:bg-stone-300 text-stone-900 font-cinzel font-bold text-xs sm:text-sm tracking-wider transition-colors border border-stone-400 rounded cursor-pointer"
                >
                  Tirer Complication D8
                </button>
              </div>

              {drawnComplication && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-950 italic">
                  <strong>Complication tirée :</strong> {drawnComplication}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4 : COMBAT & BLESSURES (VERIFIED OFFICIAL D8) */}
          {/* ======================================================== */}
          {activeTab === 'combat' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    RANG COMBAT (0 À 4) :
                  </label>
                  <select
                    value={combatRank}
                    onChange={(e) => setCombatRank(Number(e.target.value) as SkillRank)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    {SKILL_RANKS.map((r) => (
                      <option key={r.rank} value={r.rank}>
                        Rang {r.rank} : {r.label} (+{r.bonus})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    GABARIT DE L'ADVERSAIRE :
                  </label>
                  <select
                    value={combatOpponentPhysique}
                    onChange={(e) => setCombatOpponentPhysique(Number(e.target.value))}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={1}>Figurant / Fragile (+1)</option>
                    <option value={0}>Sbire ordinaire (0)</option>
                    <option value={-1}>Sbire endurci / Costaud (-1)</option>
                    <option value={-2}>Colosse / Boss dangereux (-2)</option>
                    <option value={-3}>Monstre / Légende du crime (-3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    ARME DU POLICIER :
                  </label>
                  <select
                    value={combatCharWeapon}
                    onChange={(e) => setCombatCharWeapon(e.target.value as WeaponCategory)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value="legere">Légère (Dégâts 1 / Maj 2 — Poing, matraque, surin)</option>
                    <option value="moyenne">Moyenne (Dégâts 2 / Maj 4 — Revolver, sabre)</option>
                    <option value="lourde">Lourde (Dégâts 3 / Maj 6 — Fusil, dynamite)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    ARME DE L'OPPOSANT :
                  </label>
                  <select
                    value={combatOppWeapon}
                    onChange={(e) => setCombatOppWeapon(e.target.value as WeaponCategory)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value="legere">Légère (Dégâts 1 / Crit 2 — Couteau, canne)</option>
                    <option value="moyenne">Moyenne (Dégâts 2 / Crit 4 — Arme à feu)</option>
                    <option value="lourde">Lourde (Dégâts 3 / Crit 6 — Carabine, explosif)</option>
                  </select>
                </div>
              </div>

              {/* SECOND ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    TACTIQUE / COUVERT & SURPRISE :
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={combatAdvantage}
                      onChange={(e) => setCombatAdvantage(Number(e.target.value) as AdvantageType)}
                      className="w-1/2 bg-[#FAF7EE] border border-stone-400 p-2 text-xs text-stone-900 rounded-none"
                    >
                      <option value={0}>Avantage: 0</option>
                      <option value={1}>Avantage: +1</option>
                      <option value={2}>Avantage: +2</option>
                    </select>
                    <select
                      value={combatDisadvantage}
                      onChange={(e) => setCombatDisadvantage(Number(e.target.value) as DisadvantageType)}
                      className="w-1/2 bg-[#FAF7EE] border border-stone-400 p-2 text-xs text-stone-900 rounded-none"
                    >
                      <option value={0}>Désavantage: 0</option>
                      <option value={1}>Désavantage: -1</option>
                      <option value={2}>Désavantage: -2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold tracking-wider text-stone-800 mb-1">
                    STATUT DES BLESSURES DE L'AGENT :
                  </label>
                  <select
                    value={combatInjury}
                    onChange={(e) => setCombatInjury(Number(e.target.value) as InjuryStage)}
                    className="w-full bg-[#FAF7EE] border border-stone-400 p-2 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  >
                    <option value={1}>Seuil 1 : Indemne (0 malus)</option>
                    <option value={2}>Seuil 2 : Éprouvé (-1 physique)</option>
                    <option value={3}>Seuil 3 : Blessé (-1 physique)</option>
                    <option value={4}>Seuil 4 : Grièvement blessé (-2 physique)</option>
                    <option value={5}>Seuil 5 : Hors de combat (-3 physique)</option>
                  </select>
                </div>
              </div>

              {/* CALCULATION & FLOOR BOX */}
              <div className="bg-[#F4EFE2] border-l-4 border-[#78350F] p-3 sm:p-4 text-xs sm:text-sm text-stone-800 space-y-1.5 mt-3">
                <div className="flex justify-between items-center">
                  <span>Modificateur de Combat total :</span>
                  <span className="font-bold text-base text-[#6B1717]">
                    {formatMod(combatTotalModifier)}
                  </span>
                </div>
                <div>
                  <span>Plancher garanti au pire résultat (D8 = 1) : </span>
                  <span className={DEGREE_INFO[combatGuaranteedFloor].colorClass}>
                    {DEGREE_INFO[combatGuaranteedFloor].label} ({DEGREE_INFO[combatGuaranteedFloor].summary})
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => executeRoll('Combat & Armes', combatTotalModifier, 'combat')}
                  disabled={isRolling}
                  className="px-8 py-3 bg-[#801818] hover:bg-[#661212] text-white font-cinzel font-bold text-sm sm:text-base tracking-wider transition-colors shadow-md rounded cursor-pointer active:translate-y-0.5"
                >
                  {isRolling ? 'LANCEMENT DU DÉ...' : 'LANCER LE DÉ (1D8)'}
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5 : FIN D'AFFAIRE & EXPÉRIENCE (OFFICIAL D8 RULES) */}
          {/* ======================================================== */}
          {activeTab === 'end_case' && (
            <div className="space-y-5">
              
              {/* XP CALCULATOR */}
              <div className="bg-white/80 border border-stone-300 p-4 rounded space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#6B1717]" />
                    <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#6B1717]">
                      Attribution des Points d'Expérience (XP)
                    </h3>
                  </div>
                  <span className="font-mono font-bold text-base sm:text-lg text-[#6B1717] bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Total : {totalXpEarned} XP
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  {XP_CHECKLIST.map((crit) => (
                    <label
                      key={crit.id}
                      className="flex items-start gap-2.5 p-2 rounded hover:bg-[#FAF7EE] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!xpChecks[crit.id]}
                        onChange={(e) =>
                          setXpChecks((prev) => ({ ...prev, [crit.id]: e.target.checked }))
                        }
                        className="mt-0.5 rounded text-[#6B1717]"
                      />
                      <span className="text-stone-800">{crit.label} (+1 XP)</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* XP ADVANCEMENT COSTS TABLE (BOOK CHAPTER 20.10) */}
              <div className="bg-white/80 border border-stone-300 p-4 rounded space-y-3 shadow-xs text-xs">
                <div className="font-cinzel font-bold text-stone-900 border-b border-stone-200 pb-1.5">
                  Coût en XP pour augmenter une compétence (selon Caractéristique associée) :
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center border border-stone-300">
                    <thead className="bg-stone-100 font-cinzel font-bold text-stone-800">
                      <tr>
                        <th className="p-1.5 border">Niveau de Caractéristique</th>
                        <th className="p-1.5 border">Rang 0 → 1</th>
                        <th className="p-1.5 border">Rang 1 → 2</th>
                        <th className="p-1.5 border">Rang 2 → 3</th>
                        <th className="p-1.5 border">Rang 3 → 4 (Maître)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 font-mono">
                      {[1, 2, 3, 4].map((caracLevel) => (
                        <tr key={caracLevel} className="hover:bg-amber-50/50">
                          <td className="p-1.5 border font-bold text-[#6B1717]">Caractéristique = {caracLevel}</td>
                          <td className="p-1.5 border">{SKILL_XP_COSTS[caracLevel][1]} XP</td>
                          <td className="p-1.5 border">{SKILL_XP_COSTS[caracLevel][2]} XP</td>
                          <td className="p-1.5 border">{SKILL_XP_COSTS[caracLevel][3]} XP</td>
                          <td className="p-1.5 border font-bold">{SKILL_XP_COSTS[caracLevel][4]} XP</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CONVALESCENCE RULES */}
              <div className="bg-amber-50/70 border border-[#78350F]/20 p-3.5 rounded text-xs space-y-1.5 text-stone-800">
                <div className="font-cinzel font-bold text-[#78350F] flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-[#6B1717]" />
                  <span>Règles de Convalescence & Soin des Blessures :</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700 italic">
                  <li><strong>Seuil 2 (Éprouvé)</strong> : Récupéré après une bonne nuit de sommeil ou un repas complet.</li>
                  <li><strong>Seuil 3 (Blessé)</strong> : Soigné en quelques jours de repos ou avec pansement médical.</li>
                  <li><strong>Seuil 4 (Grièvement blessé)</strong> : Nécessite une hospitalisation et 1 à 2 semaines d'arrêt de service.</li>
                  <li><strong>Seuil 5 (Hors de combat)</strong> : Test d'encaissement requis ; séquelles permanentes possibles.</li>
                </ul>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* LAST ROLL RESULT & ARCHIVE LOG (SYNCHRONIZED REAL-TIME) */}
          {/* ======================================================== */}
          {lastRoll && (
            <div className="mt-6 border-t-2 border-[#5C3A1D]/30 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-cinzel font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Dices className="w-4 h-4 text-[#6B1717]" />
                  <span>Résultat Officiel du Tirage :</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                    style={{ backgroundColor: lastRoll.author?.color || '#78350f' }}
                  />
                  <span className="font-bold">{lastRoll.author?.name}</span>
                  <span className="text-[11px] text-stone-500">
                    ({lastRoll.author?.role === 'gm' ? 'MJ' : 'Inspecteur'})
                  </span>
                </div>
              </div>

              {lastRoll.isSecret && profile.role !== 'gm' ? (
                <div className="p-4 bg-stone-100 border border-stone-300 rounded italic text-xs text-stone-600 text-center">
                  🔒 [Jet secret confidentiel effectué par le Meneur de Jeu — Les conséquences se dévoileront en jeu]
                </div>
              ) : (
                <div className="p-4 sm:p-5 bg-[#FAF7EE] border-2 border-[#6B1717] rounded-lg space-y-3 shadow-md">
                  
                  {/* HIGH VISIBILITY SCORE & DEGREE HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-3 sm:p-4 rounded border border-[#78350F]/20 shadow-xs">
                    
                    {/* Action & Breakdown */}
                    <div className="space-y-1">
                      <div className="font-cinzel font-bold text-sm sm:text-base text-[#6B1717] tracking-wide">
                        {lastRoll.actionName}
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-stone-700 flex items-center gap-2 flex-wrap">
                        <span className="bg-[#FAF7EE] px-2 py-0.5 rounded border border-stone-300">
                          Dé brut : <strong>{lastRoll.d8Result}</strong> (1D8)
                        </span>
                        <span>+</span>
                        <span className="bg-[#FAF7EE] px-2 py-0.5 rounded border border-stone-300">
                          Modificateur : <strong>{formatMod(lastRoll.modifierTotal)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* BIG TOTAL SCORE BADGE */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] font-cinzel font-bold text-stone-500 block uppercase tracking-wider">
                          Score Total
                        </span>
                        <div className={`text-xs sm:text-sm font-cinzel font-bold ${DEGREE_INFO[lastRoll.degree].colorClass}`}>
                          {DEGREE_INFO[lastRoll.degree].label}
                        </div>
                      </div>

                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex flex-col items-center justify-center border-2 shadow-inner ${
                          lastRoll.degree === 'reussite_majeure'
                            ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-400/40'
                            : lastRoll.degree === 'reussite'
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : lastRoll.degree === 'ambivalent'
                            ? 'bg-amber-600 text-white border-amber-700'
                            : lastRoll.degree === 'echec'
                            ? 'bg-[#9A3412] text-white border-red-800'
                            : 'bg-[#6B1717] text-white border-red-950 ring-2 ring-red-500/50 animate-pulse'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl font-mono font-black tracking-tighter leading-none">
                          {lastRoll.finalTotal}
                        </span>
                        <span className="text-[9px] uppercase font-cinzel tracking-widest opacity-90 -mt-0.5">
                          Total
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* NARRATIVE CONSEQUENCE */}
                  <div className="p-3 bg-[#FAF7EE] rounded border border-stone-300/80">
                    <p className="text-xs sm:text-sm text-stone-900 leading-relaxed font-serif">
                      {lastRoll.narrativeDetail}
                    </p>

                    {lastRoll.traceDetail && (
                      <p className="text-xs text-[#78350F] italic font-semibold pt-1.5 border-t border-stone-200 mt-2">
                        ⚖️ Conséquence d'enquête : {lastRoll.traceDetail}
                      </p>
                    )}
                  </div>

                  {/* COMBAT DAMAGE BOX */}
                  {lastRoll.category === 'combat' && (
                    <div className="text-xs font-mono font-bold flex flex-wrap gap-4 pt-1 text-stone-800 bg-white/60 p-2.5 rounded border border-stone-300">
                      {lastRoll.damageInflicted ? (
                        <span className="text-emerald-800 flex items-center gap-1">
                          ⚔️ Dégâts infligés à l'adversaire : <strong>{lastRoll.damageInflicted} seuil(s)</strong>
                        </span>
                      ) : null}
                      {lastRoll.damageTaken ? (
                        <span className="text-red-800 flex items-center gap-1">
                          🩸 Dégâts subis par l'agent : <strong>{lastRoll.damageTaken} seuil(s)</strong>
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* HISTORIQUE DES ARCHIVES RECENTES */}
          {history.length > 1 && (
            <div className="mt-5 border-t border-stone-300 pt-3 space-y-2">
              <div className="flex justify-between items-center text-xs font-cinzel font-bold text-stone-700">
                <span>Journal d'Archives Partagé ({history.length} jets) :</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] text-stone-500 hover:text-red-700 cursor-pointer"
                >
                  Effacer l'historique
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {history.slice(1, 10).map((h) => (
                  <div
                    key={h.id}
                    className="p-2 bg-white/70 border border-stone-300 rounded text-xs flex justify-between items-center gap-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: h.author?.color || '#78350f' }}
                      />
                      <span className="font-bold text-stone-800">{h.author?.name} :</span>
                      <span className="text-stone-600">{h.actionName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#6B1717]">
                        {h.isSecret && profile.role !== 'gm' ? '[Secret]' : `D8 (${h.d8Result}) ${formatMod(h.modifierTotal)} = ${h.finalTotal}`}
                      </span>
                      <span className={`font-bold ${DEGREE_INFO[h.degree].colorClass}`}>
                        {h.isSecret && profile.role !== 'gm' ? '' : DEGREE_INFO[h.degree].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        currentRoomId={roomId}
        profile={profile}
        onUpdateProfile={updateProfile}
        onJoinRoom={(newRoomId) => joinRoom(newRoomId)}
      />

      <PlayersListModal
        isOpen={isPlayersModalOpen}
        onClose={() => setIsPlayersModalOpen(false)}
        players={players}
        roomId={roomId}
        currentProfile={profile}
        onUpdateRole={(newRole) => updateProfile({ role: newRole })}
      />

      <BrigadeBoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        board={board}
        onUpdateBoard={(newBoard) => broadcastBoard(newBoard)}
        isGM={profile.role === 'gm'}
      />

      <RulesReferenceModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

    </div>
  );
}
