import React from 'react';
import {
  RollActionCategory,
  SkillKey,
  SkillRank,
  DifficultyTier,
  AdvantageType,
  DisadvantageType,
  InjuryStage,
  ArchetypeKey,
  WeaponCategory,
} from '../types';
import {
  SKILLS,
  SKILL_RANKS,
  DIFFICULTIES,
  ARCHETYPES,
  WEAPONS,
  DEGREE_DESCRIPTIONS,
} from '../data/rulesData';
import {
  Dices,
  Heart,
  Coins,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';

interface DiceRollerPanelProps {
  roller?: any;
  category?: RollActionCategory;
  setCategory?: (c: RollActionCategory) => void;
  selectedSkill?: SkillKey;
  setSelectedSkill?: (s: SkillKey) => void;
  rank?: SkillRank;
  setRank?: (r: SkillRank) => void;
  difficultyTier?: DifficultyTier;
  setDifficultyTier?: (d: DifficultyTier) => void;
  rawAdvantage?: AdvantageType;
  setRawAdvantage?: (a: AdvantageType) => void;
  rawDisadvantage?: DisadvantageType;
  setRawDisadvantage?: (d: DisadvantageType) => void;
  archetype?: ArchetypeKey;
  setArchetype?: (a: ArchetypeKey) => void;
  activePrivilegeId?: string | null;
  setActivePrivilegeId?: (id: string | null) => void;
  injuryStage?: InjuryStage;
  setInjuryStage?: (i: InjuryStage) => void;
  debtTokens?: number;
  setDebtTokens?: (t: number) => void;
  npcAttitude?: -1 | 0 | 1;
  setNpcAttitude?: (a: -1 | 0 | 1) => void;
  personalLink?: number;
  setPersonalLink?: (l: number) => void;
  demandWeight?: -1 | 0 | 1;
  setDemandWeight?: (w: -1 | 0 | 1) => void;
  characterWeapon?: WeaponCategory;
  setCharacterWeapon?: (w: WeaponCategory) => void;
  opponentPhysique?: number;
  setOpponentPhysique?: (p: number) => void;
  opponentWeapon?: WeaponCategory;
  setOpponentWeapon?: (w: WeaponCategory) => void;
  currentModifier?: number;
  currentGuaranteedFloor?: string;
  isRolling?: boolean;
  onRoll: () => void;
  onBurnLink?: () => void;
  onComfortSuccess?: () => void;
}

export function DiceRollerPanel(props: DiceRollerPanelProps) {
  const r = props.roller || props;
  const category = r.category;
  const setCategory = r.setCategory;
  const selectedSkill = r.selectedSkill;
  const setSelectedSkill = r.setSelectedSkill;
  const rank = r.rank;
  const setRank = r.setRank;
  const difficultyTier = r.difficultyTier;
  const setDifficultyTier = r.setDifficultyTier;
  const rawAdvantage = r.rawAdvantage;
  const setRawAdvantage = r.setRawAdvantage;
  const rawDisadvantage = r.rawDisadvantage;
  const setRawDisadvantage = r.setRawDisadvantage;
  const archetype = r.archetype;
  const setArchetype = r.setArchetype;
  const activePrivilegeId = r.activePrivilegeId;
  const setActivePrivilegeId = r.setActivePrivilegeId;
  const injuryStage = r.injuryStage;
  const setInjuryStage = r.setInjuryStage;
  const debtTokens = r.debtTokens;
  const setDebtTokens = r.setDebtTokens;
  const npcAttitude = r.npcAttitude;
  const setNpcAttitude = r.setNpcAttitude;
  const personalLink = r.personalLink;
  const setPersonalLink = r.setPersonalLink;
  const demandWeight = r.demandWeight;
  const setDemandWeight = r.setDemandWeight;
  const characterWeapon = r.characterWeapon;
  const setCharacterWeapon = r.setCharacterWeapon;
  const opponentPhysique = r.opponentPhysique;
  const setOpponentPhysique = r.setOpponentPhysique;
  const opponentWeapon = r.opponentWeapon;
  const setOpponentWeapon = r.setOpponentWeapon;
  const currentModifier = r.currentModifier;
  const currentGuaranteedFloor = r.currentGuaranteedFloor;

  const onRoll = props.onRoll || r.rollD8 || r.executeRoll;
  const onBurnLink = props.onBurnLink || r.burnLink;
  const onComfortSuccess = props.onComfortSuccess || r.applyComfortSuccess;
  const isRolling = props.isRolling || false;

  const currentArchetypeData = ARCHETYPES[archetype];
  const floorDesc = DEGREE_DESCRIPTIONS[currentGuaranteedFloor as keyof typeof DEGREE_DESCRIPTIONS] || DEGREE_DESCRIPTIONS.ambivalent;

  // Check if comfort option (Maître + Triviale) is available
  const isComfortEligible = rank === 4 && difficultyTier === 'triviale' && category === 'standard';

  return (
    <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] shadow-[0_0_25px_rgba(0,0,0,0.6)] p-6 space-y-6 text-[#f4ecd8] font-serif relative">
      
      {/* Art Deco Geometric Corners */}
      <div className="artdeco-corner-tl" />
      <div className="artdeco-corner-tr" />
      <div className="artdeco-corner-bl" />
      <div className="artdeco-corner-br" />

      {/* 1. PILLAR / MODE SELECTOR */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-widest">
            1. Scène & Nature de l'action
          </label>
          <span className="text-xs text-[#a69d8d] font-marcellus italic">
            {category === 'standard' && 'Enquête & Geste technique'}
            {category === 'social' && 'Social : Un seul jet sans circonstance'}
            {category === 'combat' && 'Physique & Échange de combat'}
            {category === 'poursuite' && 'Poursuite en 3 temps'}
            {category === 'danger_mort' && 'Stabilisation d\'urgence'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { key: 'standard', label: 'Enquête / Test', desc: 'Indices, fouille, technique' },
            { key: 'social', label: 'Scène Sociale', desc: 'Témoin, suspect, PNJ' },
            { key: 'combat', label: 'Combat / Physique', desc: 'Rixe, arrestation, coups' },
            { key: 'poursuite', label: 'Poursuite', desc: 'Course, fuyard, obstacles' },
          ].map(tab => (
            <button
              key={tab.key}
              id={`mode-tab-${tab.key}`}
              onClick={() => {
                setCategory(tab.key as RollActionCategory);
                if (tab.key === 'social' && !['interrogatoire', 'persuasion', 'reseau', 'intuition', 'langues', 'couverture'].includes(selectedSkill)) {
                  setSelectedSkill('interrogatoire');
                } else if (tab.key === 'combat') {
                  setSelectedSkill('combat_armes');
                } else if (tab.key === 'poursuite') {
                  setSelectedSkill('poursuite_athletisme');
                }
              }}
              className={`p-2.5 border text-left transition-all cursor-pointer ${
                category === tab.key
                  ? 'bg-[#1a232f] border-[#dfba73] text-[#f4ecd8] shadow-[0_0_10px_rgba(197,160,89,0.25)]'
                  : 'bg-[#0d1117] border-[#c5a059]/30 text-[#a69d8d] hover:border-[#c5a059]/60 hover:text-[#f4ecd8]'
              }`}
            >
              <div className="font-cinzel font-bold text-sm leading-tight text-[#dfba73]">{tab.label}</div>
              <div className="text-[11px] opacity-80 mt-0.5 truncate font-marcellus">{tab.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. SKILL & RANK SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#c5a059]/30">
        <div>
          <label className="block text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-widest mb-2">
            2. Compétence engagée
          </label>
          <select
            id="select-skill"
            value={selectedSkill}
            onChange={e => setSelectedSkill(e.target.value as SkillKey)}
            className="w-full p-2.5 bg-[#0d1117] border border-[#c5a059]/50 font-marcellus text-sm text-[#f4ecd8] focus:border-[#dfba73] outline-none"
          >
            <optgroup label="— Perception —" className="bg-[#121820] text-[#dfba73]">
              <option value="investigation">Investigation (Scène de crime, fouille, traces)</option>
              <option value="medecine_legale">Médecine légale (Corps, autopsie, poisons)</option>
              <option value="erudition">Érudition (Archives, droit, codes et chiffres)</option>
              <option value="techniques_modernes">Techniques modernes (Photos, empreintes, TSF)</option>
            </optgroup>
            <optgroup label="— Présence —" className="bg-[#121820] text-[#dfba73]">
              <option value="interrogatoire">Interrogatoire (Témoin, suspect, notable)</option>
              <option value="persuasion">Persuasion / Charme (Convaincre, négocier)</option>
              <option value="reseau">Réseau (Indicateurs, journalistes, milieu)</option>
            </optgroup>
            <optgroup label="— Vigueur —" className="bg-[#121820] text-[#dfba73]">
              <option value="combat_armes">Combat et armes (Rixe, maîtrise, revolver)</option>
              <option value="poursuite_athletisme">Poursuite / Athlétisme (Courir, grimper, forcer)</option>
              <option value="conduite_mecanique">Conduite et mécanique (Automobile, réparations)</option>
              <option value="langues">Langues (Étrangères, argots de métier)</option>
            </optgroup>
            <optgroup label="— Sang-froid —" className="bg-[#121820] text-[#dfba73]">
              <option value="filature_discretion">Filature / Discrétion (Suivre, planque, discrétion)</option>
              <option value="couverture">Couverture (Composer une identité, rôle)</option>
              <option value="bureaucratie">Bureaucratie (Procédure, réquisitions, greffe)</option>
              <option value="intuition">Intuition (Flairer le mensonge, anomalie)</option>
            </optgroup>
          </select>
          <p className="mt-1.5 text-xs text-[#a69d8d] font-marcellus italic">
            {SKILLS[selectedSkill]?.domain}
          </p>
        </div>

        {/* Rang (0 à 4) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-widest">
              Rang de compétence
            </label>
            <span className="text-xs font-mono font-bold text-[#dfba73]">
              Bonus : +{rank}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {SKILL_RANKS.map(item => (
              <button
                key={item.rank}
                id={`rank-btn-${item.rank}`}
                onClick={() => setRank(item.rank as SkillRank)}
                className={`py-2 px-1 border text-center transition-all cursor-pointer ${
                  rank === item.rank
                    ? 'bg-[#1a232f] border-[#dfba73] text-[#dfba73] font-bold shadow-[0_0_8px_rgba(197,160,89,0.3)]'
                    : 'bg-[#0d1117] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60 hover:text-[#f4ecd8]'
                }`}
              >
                <div className="text-xs font-cinzel">{item.label}</div>
                <div className="text-xs font-mono font-bold">+{item.bonus}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ARCHETYPE & PRIVILEGES */}
      <div className="pt-4 border-t border-[#c5a059]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-widest">
            3. Archétype & Privilège de l'Inspecteur
          </label>
          <select
            id="select-archetype"
            value={archetype}
            onChange={e => {
              setArchetype(e.target.value as ArchetypeKey);
              setActivePrivilegeId(null);
            }}
            className="text-xs p-1.5 bg-[#0d1117] border border-[#c5a059]/50 font-marcellus text-[#dfba73] font-semibold focus:outline-none"
          >
            {Object.values(ARCHETYPES).map(a => (
              <option key={a.key} value={a.key} className="bg-[#121820]">
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {currentArchetypeData.privileges.map(priv => {
            const isActive = activePrivilegeId === priv.id;
            const isRelevantForSkill = priv.targetSkills.includes(selectedSkill);

            return (
              <button
                key={priv.id}
                id={`privilege-toggle-${priv.id}`}
                onClick={() => setActivePrivilegeId(isActive ? null : priv.id)}
                className={`p-2.5 border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1a232f] border-[#dfba73] text-[#f4ecd8] ring-1 ring-[#dfba73] shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                    : isRelevantForSkill
                    ? 'bg-[#0d1117] border-[#c5a059]/60 hover:bg-[#161d26]'
                    : 'bg-[#0d1117] border-[#c5a059]/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-cinzel font-bold text-xs text-[#dfba73] truncate">
                    {priv.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 border font-mono font-bold ${
                      priv.type === 'metier'
                        ? 'bg-[#132e20] text-[#bbf7d0] border-[#22c55e]/40'
                        : 'bg-[#2e1065] text-[#e9d5ff] border-[#a855f7]/40'
                    }`}
                  >
                    +{priv.bonus} {priv.type === 'metier' ? 'Métier' : 'Appui'}
                  </span>
                </div>
                <p className="text-[11px] text-[#a69d8d] font-marcellus mt-1 line-clamp-2 leading-snug">
                  {priv.trigger}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MODE SPECIFIC CONFIGURATIONS */}
      {category === 'social' ? (
        /* SOCIAL SCENE CONFIG */
        <div className="p-4 bg-[#0d1117] border border-[#c5a059]/40 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-2">
            <h4 className="font-cinzel font-bold text-sm text-[#dfba73] flex items-center gap-2 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-[#dfba73]" />
              Paramètres du Jet Social (Formule en 1 ligne)
            </h4>
            <span className="text-xs text-[#a69d8d] italic font-marcellus">
              Aucune circonstance : le Lien remplace tout
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Attitude du PNJ */}
            <div>
              <label className="block text-xs font-cinzel text-[#dfba73] uppercase tracking-wider mb-1">
                Attitude envers la police
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { value: -1, label: 'Hostile (-1)' },
                  { value: 0, label: 'Neutre (0)' },
                  { value: 1, label: 'Loyal (+1)' },
                ].map(att => (
                  <button
                    key={att.value}
                    id={`att-btn-${att.value}`}
                    onClick={() => setNpcAttitude(att.value as -1 | 0 | 1)}
                    className={`py-1.5 text-xs font-medium border text-center transition-all cursor-pointer ${
                      npcAttitude === att.value
                        ? 'bg-[#1a232f] border-[#dfba73] text-[#dfba73] font-bold shadow-[0_0_8px_rgba(197,160,89,0.3)]'
                        : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                    }`}
                  >
                    {att.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lien Personnel */}
            <div>
              <label className="block text-xs font-cinzel text-[#dfba73] uppercase tracking-wider mb-1">
                Lien personnel (-3 à +3)
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPersonalLink(Math.max(-3, personalLink - 1))}
                  className="px-2.5 py-1 bg-[#161d26] border border-[#c5a059]/40 text-[#dfba73] font-mono font-bold cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center py-1 bg-[#161d26] border border-[#c5a059]/40 font-mono font-bold text-sm text-[#f4ecd8]">
                  {personalLink > 0 ? `+${personalLink}` : personalLink}
                </div>
                <button
                  onClick={() => setPersonalLink(Math.min(3, personalLink + 1))}
                  className="px-2.5 py-1 bg-[#161d26] border border-[#c5a059]/40 text-[#dfba73] font-mono font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Poids de la demande */}
            <div>
              <label className="block text-xs font-cinzel text-[#dfba73] uppercase tracking-wider mb-1">
                Poids de la demande
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { value: -1, label: 'Lourde (-1)' },
                  { value: 0, label: 'Ordinaire (0)' },
                  { value: 1, label: 'Anodine (+1)' },
                ].map(dem => (
                  <button
                    key={dem.value}
                    id={`demand-btn-${dem.value}`}
                    onClick={() => setDemandWeight(dem.value as -1 | 0 | 1)}
                    className={`py-1.5 text-xs font-medium border text-center transition-all cursor-pointer ${
                      demandWeight === dem.value
                        ? 'bg-[#1a232f] border-[#dfba73] text-[#dfba73] font-bold shadow-[0_0_8px_rgba(197,160,89,0.3)]'
                        : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                    }`}
                  >
                    {dem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Option: Brûler un Lien */}
          {personalLink > 0 && (
            <div className="pt-2 border-t border-[#c5a059]/30 flex items-center justify-between">
              <span className="text-xs text-[#a69d8d] font-marcellus">
                Sacrifice d'un point de Lien positif (+{personalLink})
              </span>
              <button
                id="burn-link-button"
                onClick={onBurnLink}
                className="px-3 py-1 bg-[#3b1d14] hover:bg-[#521111] text-[#fed7aa] border border-[#f97316]/50 text-xs font-cinzel font-bold transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Brûler 1 Lien (Succès auto)
              </button>
            </div>
          )}
        </div>
      ) : category === 'combat' ? (
        /* COMBAT CONFIG */
        <div className="p-4 bg-[#0d1117] border border-[#c5a059]/40 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-2">
            <h4 className="font-cinzel font-bold text-sm text-red-400 uppercase tracking-wider">
              Paramètres de Confrontation Physique
            </h4>
            <span className="text-xs text-[#a69d8d] italic font-marcellus">
              Indice adverse = Difficulté et Réserve de PV
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Indice Physique de l'adversaire */}
            <div>
              <label className="block text-xs font-cinzel text-[#dfba73] uppercase tracking-wider mb-1">
                Indice Opposant (0 à 5)
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOpponentPhysique(Math.max(0, opponentPhysique - 1))}
                  className="px-2.5 py-1 bg-[#161d26] border border-[#c5a059]/40 text-[#dfba73] font-mono font-bold cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center py-1 bg-[#161d26] border border-[#c5a059]/40 font-mono font-bold text-sm text-[#f4ecd8]">
                  Indice {opponentPhysique} ({DIFFICULTIES[
                    opponentPhysique === 0 ? 'triviale' : opponentPhysique === 1 ? 'facile' : opponentPhysique === 2 ? 'moderee' : opponentPhysique === 3 ? 'difficile' : opponentPhysique === 4 ? 'extreme' : 'cauchemardesque'
                  ].label})
                </div>
                <button
                  onClick={() => setOpponentPhysique(Math.min(5, opponentPhysique + 1))}
                  className="px-2.5 py-1 bg-[#161d26] border border-[#c5a059]/40 text-[#dfba73] font-mono font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Arme de l'Inspecteur */}
            <div>
              <label className="block text-xs font-cinzel text-[#dfba73] uppercase tracking-wider mb-1">
                Arme de l'Inspecteur
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['legere', 'moyenne', 'lourde'] as WeaponCategory[]).map(wKey => (
                  <button
                    key={wKey}
                    id={`player-weapon-${wKey}`}
                    onClick={() => setCharacterWeapon(wKey)}
                    className={`py-1.5 text-xs font-medium border text-center transition-all cursor-pointer ${
                      characterWeapon === wKey
                        ? 'bg-[#1a232f] border-[#dfba73] text-[#dfba73] font-bold shadow-[0_0_8px_rgba(197,160,89,0.3)]'
                        : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                    }`}
                  >
                    {WEAPONS[wKey].name} ({WEAPONS[wKey].damage})
                  </button>
                ))}
              </div>
            </div>

            {/* Arme de l'Adversaire */}
            <div>
              <label className="block text-xs font-cinzel text-[#dfba73] uppercase tracking-wider mb-1">
                Arme de l'Adversaire
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['legere', 'moyenne', 'lourde'] as WeaponCategory[]).map(wKey => (
                  <button
                    key={wKey}
                    id={`opp-weapon-${wKey}`}
                    onClick={() => setOpponentWeapon(wKey)}
                    className={`py-1.5 text-xs font-medium border text-center transition-all cursor-pointer ${
                      opponentWeapon === wKey
                        ? 'bg-[#3b1d14] border-red-500 text-red-300 font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                        : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                    }`}
                  >
                    {WEAPONS[wKey].name} ({WEAPONS[wKey].damage})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD & ENQUÊTE DIFFICULTY & CIRCUMSTANCES */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#c5a059]/30">
          {/* Difficulté */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-widest">
                Difficulté annoncée
              </label>
              <span className="text-xs font-mono font-bold text-[#dfba73]">
                {DIFFICULTIES[difficultyTier].modifier > 0
                  ? `+${DIFFICULTIES[difficultyTier].modifier}`
                  : DIFFICULTIES[difficultyTier].modifier}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(DIFFICULTIES) as DifficultyTier[]).map(dTier => {
                const dData = DIFFICULTIES[dTier];
                return (
                  <button
                    key={dTier}
                    id={`diff-btn-${dTier}`}
                    onClick={() => setDifficultyTier(dTier)}
                    className={`py-1.5 px-2 border text-left transition-all cursor-pointer ${
                      difficultyTier === dTier
                        ? 'bg-[#1a232f] border-[#dfba73] text-[#dfba73] font-bold shadow-[0_0_8px_rgba(197,160,89,0.3)]'
                        : 'bg-[#0d1117] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60 hover:text-[#f4ecd8]'
                    }`}
                  >
                    <div className="text-xs font-cinzel leading-tight">{dData.label}</div>
                    <div className="text-[10px] font-mono opacity-80">
                      {dData.modifier > 0 ? `+${dData.modifier}` : dData.modifier}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-[#a69d8d] font-marcellus italic">
              {DIFFICULTIES[difficultyTier].feel}
            </p>
          </div>

          {/* Circonstances */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-widest mb-2">
              Circonstances
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Avantage */}
              <div>
                <span className="text-[11px] font-cinzel uppercase text-emerald-400 block mb-1">
                  Avantage
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: '0' },
                    { val: 1, label: '+1' },
                    { val: 2, label: '+2' },
                  ].map(a => (
                    <button
                      key={a.val}
                      id={`adv-btn-${a.val}`}
                      onClick={() => setRawAdvantage(a.val as AdvantageType)}
                      className={`py-1 text-xs font-mono font-bold border transition-all cursor-pointer ${
                        rawAdvantage === a.val
                          ? 'bg-[#132e20] text-[#bbf7d0] border-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                          : 'bg-[#0d1117] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Désavantage */}
              <div>
                <span className="text-[11px] font-cinzel uppercase text-red-400 block mb-1">
                  Désavantage
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: '0' },
                    { val: 1, label: '-1' },
                    { val: 2, label: '-2' },
                  ].map(d => (
                    <button
                      key={d.val}
                      id={`disadv-btn-${d.val}`}
                      onClick={() => setRawDisadvantage(d.val as DisadvantageType)}
                      className={`py-1 text-xs font-mono font-bold border transition-all cursor-pointer ${
                        rawDisadvantage === d.val
                          ? 'bg-[#3b1d14] text-[#fed7aa] border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                          : 'bg-[#0d1117] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(difficultyTier === 'extreme' || difficultyTier === 'cauchemardesque') && rawAdvantage > 0 && (
              <p className="mt-1.5 text-xs text-[#dfba73] font-marcellus italic">
                ⚖️ Règle de la moitié appliquée sur {DIFFICULTIES[difficultyTier].label} (+{rawAdvantage} → +{Math.floor(rawAdvantage / 2)})
              </p>
            )}
          </div>
        </div>
      )}

      {/* 5. CHARACTER STATUS */}
      <div className="p-3.5 bg-[#0d1117] border border-[#c5a059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Blessure */}
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-wider block">
              Gradation de blessure
            </span>
            <div className="flex items-center gap-1 mt-1">
              {[
                { stage: 1, label: '1. Indemne (0)' },
                { stage: 2, label: '2. Éprouvé (-1 phys)' },
                { stage: 3, label: '3. Blessé (-1 tout)' },
                { stage: 4, label: '4. Grave (-2 tout)' },
                { stage: 5, label: '5. Hors combat' },
              ].map(s => (
                <button
                  key={s.stage}
                  id={`injury-stage-${s.stage}`}
                  onClick={() => setInjuryStage(s.stage as InjuryStage)}
                  className={`px-2.5 py-1 text-[11px] font-medium border transition-all cursor-pointer ${
                    injuryStage === s.stage
                      ? 'bg-[#3b1d14] text-[#fed7aa] border-red-500 font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                      : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                  }`}
                >
                  {s.stage}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jetons de Dette */}
        <div className="flex items-center gap-3">
          <Coins className="w-5 h-5 text-[#dfba73] shrink-0" />
          <div>
            <span className="text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-wider block">
              Jetons de dette ({debtTokens}/3 max)
            </span>
            <div className="flex items-center gap-1 mt-1">
              {[0, 1, 2, 3].map(t => (
                <button
                  key={t}
                  id={`debt-token-${t}`}
                  onClick={() => setDebtTokens(t)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold border transition-all cursor-pointer ${
                    debtTokens === t
                      ? 'bg-[#1a232f] text-[#dfba73] border-[#dfba73] shadow-[0_0_8px_rgba(197,160,89,0.3)]'
                      : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. GUARANTEED FLOOR & LAUNCH SECTION */}
      <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-[#c5a059]/40">
        {/* Guaranteed floor indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a232f] border-2 border-[#dfba73] flex items-center justify-center font-cinzel font-bold text-[#dfba73] shadow-[0_0_10px_rgba(197,160,89,0.3)]">
            D8
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#a69d8d]">
                Plancher garanti :
              </span>
              <span
                className={`text-xs font-cinzel font-bold px-2 py-0.5 border ${floorDesc.bgBadge} ${floorDesc.colorBadge} ${floorDesc.borderBadge}`}
              >
                {floorDesc.label}
              </span>
            </div>
            <div className="text-xs font-mono text-[#a69d8d] mt-0.5">
              Modificateur total calculé : <strong className="text-[#dfba73]">{currentModifier > 0 ? `+${currentModifier}` : currentModifier}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Comfort button if eligible */}
          {isComfortEligible && (
            <button
              id="comfort-success-btn"
              onClick={onComfortSuccess}
              className="px-4 py-3 bg-[#132e20] hover:bg-[#1a402d] text-[#bbf7d0] border-2 border-[#22c55e] font-cinzel font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(34,197,94,0.3)]"
            >
              <Sparkles className="w-4 h-4 text-[#86efac]" />
              Réussite auto (Maître)
            </button>
          )}

          {/* Roll 1D8 Button */}
          <button
            id="roll-d8-main-button"
            disabled={isRolling}
            onClick={onRoll}
            className={`flex-1 md:flex-none px-8 py-3.5 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] hover:from-[#b3882b] hover:via-[#dfba73] hover:to-[#b3882b] text-[#0d1117] font-cinzel font-bold text-base uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-2 border-[#f3e5ab] cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(197,160,89,0.5)] ${
              isRolling ? 'opacity-80 animate-pulse' : 'hover:scale-[1.02]'
            }`}
          >
            <Dices className={`w-6 h-6 text-[#0d1117] ${isRolling ? 'animate-spin' : ''}`} />
            <span>LANCER 1D8</span>
            <span className="text-xs px-2 py-0.5 bg-black/20 rounded font-mono font-bold">
              {currentModifier >= 0 ? `+${currentModifier}` : currentModifier}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
