import React from 'react';
import { RollHistoryEntry, DebtCurrency } from '../types';
import { DEGREE_DESCRIPTIONS, DEBT_CURRENCIES, SKILLS } from '../data/rulesData';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Clock,
  User,
  Coins,
  Swords,
  Scroll,
  MessageSquare,
  Crosshair,
  Footprints,
} from 'lucide-react';

interface RollResultCardProps {
  entry?: RollHistoryEntry;
  roll?: RollHistoryEntry;
  onSelectCost?: (rollId: string, type: 'paid_now' | 'debt_token', currency?: DebtCurrency) => void;
  isLatest?: boolean;
}

export const RollResultCard: React.FC<RollResultCardProps> = ({
  entry: propEntry,
  roll,
  onSelectCost,
  isLatest = false,
}) => {
  const entry = propEntry || roll;
  if (!entry) return null;

  const desc = DEGREE_DESCRIPTIONS[entry.degree];

  if (entry.isRedacted) {
    return (
      <div
        id={`roll-entry-${entry.id}`}
        className="p-5 bg-stone-100 dark:bg-stone-900 rounded-lg border-2 border-dashed border-stone-400 dark:border-stone-700 font-typewriter text-stone-700 dark:text-stone-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.author?.color || '#78350f' }}
            />
            <span className="font-bold">{entry.author?.name || 'Meneur de Jeu'}</span>
            <span className="text-xs px-2 py-0.5 bg-amber-200 dark:bg-amber-900/60 rounded text-amber-900 dark:text-amber-200 font-sans">
              Jet Secret
            </span>
          </div>
          <span className="text-xs opacity-60">
            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <p className="mt-3 italic text-sm">
          [Confidentiel Sûreté — Résultat masqué pour les agents non autorisés]
        </p>
      </div>
    );
  }

  const categoryIcons = {
    standard: <Scroll className="w-4 h-4 text-amber-800 dark:text-amber-400" />,
    social: <MessageSquare className="w-4 h-4 text-blue-800 dark:text-blue-400" />,
    combat: <Swords className="w-4 h-4 text-red-800 dark:text-red-400" />,
    poursuite: <Footprints className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />,
    danger_mort: <Crosshair className="w-4 h-4 text-purple-800 dark:text-purple-400" />,
  };

  const getDegreeIcon = () => {
    switch (entry.degree) {
      case 'reussite_majeure':
        return <Award className="w-5 h-5 text-purple-700 dark:text-purple-400" />;
      case 'reussite':
        return <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case 'ambivalent':
        return <AlertTriangle className="w-5 h-5 text-blue-700 dark:text-blue-400" />;
      case 'echec':
        return <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400" />;
      case 'echec_critique':
        return <Flame className="w-5 h-5 text-red-700 dark:text-red-400" />;
    }
  };

  const isCostEligible = (entry.degree === 'ambivalent' || entry.degree === 'echec') && !entry.costDecision;

  return (
    <div
      id={`roll-entry-${entry.id}`}
      className={`p-5 rounded-lg border-2 transition-all shadow-sm ${
        isLatest
          ? 'bg-amber-50/90 dark:bg-stone-900 border-[#78350f] dark:border-amber-600 shadow-md'
          : 'bg-stone-50 dark:bg-stone-900/90 border-stone-300 dark:border-stone-700'
      }`}
    >
      {/* Header with Author and Time */}
      <div className="flex items-center justify-between border-b border-stone-300 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-stone-500"
            style={{ backgroundColor: entry.author?.color || '#78350f' }}
          />
          <span className="font-bold text-stone-900 dark:text-stone-100 font-cinzel text-sm">
            {entry.author?.name || 'Inspecteur'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1">
            {categoryIcons[entry.category]}
            {entry.category.toUpperCase()}
          </span>
          {entry.isSecret && (
            <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 rounded font-semibold">
              Confidentiel
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* Action Title & Main Result */}
      <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-playfair font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
            {entry.actionName}
          </h3>
          {entry.activePrivilege && (
            <p className="text-xs text-amber-800 dark:text-amber-400 font-sans mt-0.5">
              ⭐ Privilège appliqué : <strong>{entry.activePrivilege.name} (+{entry.activePrivilege.bonus})</strong>
            </p>
          )}
        </div>

        {/* Degree Stamp Badge */}
        <div
          className={`px-3.5 py-1.5 rounded-md border-2 flex items-center gap-2 font-cinzel font-bold text-sm tracking-wide ${desc.bgBadge} ${desc.colorBadge} ${desc.borderBadge}`}
        >
          {getDegreeIcon()}
          <span>{desc.label.toUpperCase()}</span>
          <span className="ml-1 px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono text-xs">
            Total {entry.finalTotal}
          </span>
        </div>
      </div>

      {/* Arithmetic Breakdown */}
      <div className="mt-3 p-2.5 bg-stone-200/70 dark:bg-stone-800/80 rounded border border-stone-300 dark:border-stone-700 font-mono text-xs text-stone-800 dark:text-stone-300 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-semibold text-amber-900 dark:text-amber-300 font-cinzel">Calcul :</span>
        <span className="px-1.5 py-0.5 bg-white dark:bg-stone-900 rounded font-bold border border-stone-300 dark:border-stone-700">
          1D8 = {entry.d8Result}
        </span>
        <span>+</span>
        <span>Rang {entry.rank}</span>
        {entry.difficultyMod !== 0 && (
          <>
            <span>+</span>
            <span>Diff ({entry.difficultyMod > 0 ? `+${entry.difficultyMod}` : entry.difficultyMod})</span>
          </>
        )}
        {entry.appliedAdvantage > 0 && (
          <>
            <span>+</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              Avantage (+{entry.appliedAdvantage}
              {entry.halfRuleApplied ? ' ½' : ''})
            </span>
          </>
        )}
        {entry.appliedDisadvantage > 0 && (
          <>
            <span>−</span>
            <span className="text-red-700 dark:text-red-400">
              Désavantage (−{entry.appliedDisadvantage})
            </span>
          </>
        )}
        {entry.injuryMod !== 0 && (
          <>
            <span>−</span>
            <span className="text-red-700 dark:text-red-400">
              Blessure ({entry.injuryMod})
            </span>
          </>
        )}
        {entry.activePrivilege && (
          <>
            <span>+</span>
            <span className="text-amber-700 dark:text-amber-400">
              Privilège (+{entry.activePrivilege.bonus})
            </span>
          </>
        )}
        {entry.personalLink !== undefined && entry.personalLink !== 0 && (
          <>
            <span>+</span>
            <span>Lien ({entry.personalLink > 0 ? `+${entry.personalLink}` : entry.personalLink})</span>
          </>
        )}
        {entry.npcAttitude !== undefined && entry.npcAttitude !== 0 && (
          <>
            <span>+</span>
            <span>Attitude ({entry.npcAttitude > 0 ? `+${entry.npcAttitude}` : entry.npcAttitude})</span>
          </>
        )}
        <span>=</span>
        <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
          {entry.finalTotal}
        </span>
        <span className="ml-auto text-stone-500 dark:text-stone-400 italic">
          Plancher annoncé : {DEGREE_DESCRIPTIONS[entry.guaranteedFloor].label}
        </span>
      </div>

      {/* Narrative Output */}
      <div className="mt-3 p-3 bg-white/70 dark:bg-stone-950/60 rounded border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-sm">
        <p className="font-newsreader italic text-base leading-relaxed">
          « {entry.narrativeDetail} »
        </p>
        {entry.traceDetail && (
          <p className="mt-2 text-xs font-mono font-medium text-amber-800 dark:text-amber-300 border-t border-stone-200 dark:border-stone-800 pt-2">
            📌 <strong>Conséquence / Trace :</strong> {entry.traceDetail}
          </p>
        )}
        {entry.category === 'combat' && (entry.damageInflicted !== undefined || entry.damageTaken !== undefined) && (
          <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              ⚔️ Dégâts infligés à l'adversaire : {entry.damageInflicted || 0}
            </span>
            <span className="text-red-700 dark:text-red-400 font-bold">
              🩸 Dégâts subis par l'inspecteur : {entry.damageTaken || 0}
            </span>
          </div>
        )}
      </div>

      {/* Cost Resolution Section (Chapter 10) */}
      {entry.costDecision ? (
        <div className="mt-3 p-2.5 bg-stone-200/90 dark:bg-stone-800/90 rounded border border-stone-400 dark:border-stone-700 text-xs font-mono text-stone-800 dark:text-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span>
              {entry.costDecision.type === 'debt_token'
                ? '📦 Choix : Jeton de dette contracté (payable plus tard selon le Meneur)'
                : `💰 Prix payé immédiatement : ${
                    entry.costDecision.currency
                      ? DEBT_CURRENCIES[entry.costDecision.currency].name
                      : 'Payé sur-le-champ'
                  }`}
            </span>
          </div>
        </div>
      ) : isCostEligible && onSelectCost ? (
        <div className="mt-3 p-3 bg-amber-100/80 dark:bg-amber-950/40 rounded-lg border border-amber-300 dark:border-amber-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Coins className="w-4 h-4" />
              Règlement du coût (Chapitre 10) :
            </span>
            <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80 italic">
              Payer maintenant ou prendre une dette
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              id={`pay-debt-token-${entry.id}`}
              onClick={() => onSelectCost(entry.id, 'debt_token')}
              className="px-2.5 py-1 text-xs bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors font-mono font-medium shadow-sm"
            >
              +1 Jeton de dette
            </button>
            <span className="text-xs text-stone-500 font-serif">ou payer sur le champ :</span>
            {(['journee', 'trace', 'marque', 'piece', 'bruit'] as DebtCurrency[]).map(curr => (
              <button
                key={curr}
                id={`pay-${curr}-${entry.id}`}
                onClick={() => onSelectCost(entry.id, 'paid_now', curr)}
                className="px-2 py-1 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors font-sans"
                title={DEBT_CURRENCIES[curr].desc}
              >
                {DEBT_CURRENCIES[curr].name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
