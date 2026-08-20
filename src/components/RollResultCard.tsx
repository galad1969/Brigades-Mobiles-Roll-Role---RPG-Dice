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
        className="p-4 bg-[#121820] rounded-md border border-dashed border-[#c5a059]/60 font-typewriter text-[#d1c7b7]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border border-[#c5a059]"
              style={{ backgroundColor: entry.author?.color || '#c5a059' }}
            />
            <span className="font-bold text-[#f4ecd8]">{entry.author?.name || 'Meneur de Jeu'}</span>
            <span className="text-xs px-2 py-0.5 bg-[#251f16] border border-[#c5a059]/60 rounded text-[#dfba73] font-cinzel">
              Jet Secret MJ
            </span>
          </div>
          <span className="text-xs text-[#a69d8d]">
            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <p className="mt-2 italic text-xs text-[#a69d8d]">
          [Confidentiel Sûreté — Résultat masqué pour les inspecteurs de terrain]
        </p>
      </div>
    );
  }

  const categoryIcons = {
    generic: <Scroll className="w-3.5 h-3.5 text-[#dfba73]" />,
    standard: <Scroll className="w-3.5 h-3.5 text-[#dfba73]" />,
    social: <MessageSquare className="w-3.5 h-3.5 text-[#60a5fa]" />,
    combat: <Swords className="w-3.5 h-3.5 text-[#f87171]" />,
    poursuite: <Footprints className="w-3.5 h-3.5 text-[#4ade80]" />,
    danger_mort: <Crosshair className="w-3.5 h-3.5 text-[#c084fc]" />,
  };

  const getDegreeIcon = () => {
    switch (entry.degree) {
      case 'reussite_majeure':
        return <Award className="w-4 h-4 text-purple-400" />;
      case 'reussite':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'ambivalent':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'echec':
        return <ShieldAlert className="w-4 h-4 text-orange-400" />;
      case 'echec_critique':
        return <Flame className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div
      id={`roll-entry-${entry.id}`}
      className={`p-4 transition-all shadow-md relative border rounded-md ${
        isLatest
          ? 'bg-[#151d27] border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.25)]'
          : 'bg-[#10151c] border-[#c5a059]/40'
      }`}
    >
      {/* Art Deco decorative corners on latest entry */}
      {isLatest && (
        <>
          <div className="artdeco-corner-tl" />
          <div className="artdeco-corner-tr" />
          <div className="artdeco-corner-bl" />
          <div className="artdeco-corner-br" />
        </>
      )}

      {/* Header with Author and Time */}
      <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full border border-[#c5a059] shadow-xs"
            style={{ backgroundColor: entry.author?.color || '#c5a059' }}
          />
          <span className="font-bold text-[#f4ecd8] font-cinzel text-xs tracking-wider">
            {entry.author?.name || 'Inspecteur'}
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-[#1e2837] border border-[#c5a059]/40 text-[#dfba73] flex items-center gap-1 font-cinzel uppercase tracking-wider">
            {categoryIcons[entry.category as keyof typeof categoryIcons] || categoryIcons.standard}
            {entry.category}
          </span>
          {entry.isSecret && (
            <span className="text-[10px] px-1.5 py-0.5 bg-red-950/80 border border-red-700 text-red-300 font-semibold uppercase font-cinzel">
              Confidentiel
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono text-[#a69d8d]">
          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* Action Title & Main Result */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-cinzel font-bold text-base text-[#f4ecd8] tracking-wide flex items-center gap-2">
            {entry.actionName}
          </h3>
          {entry.activePrivilege && (
            <p className="text-xs text-[#dfba73] font-marcellus mt-0.5">
              ⭐ Privilège d'archétype : <strong>{entry.activePrivilege.name} (+{entry.activePrivilege.bonus})</strong>
            </p>
          )}
        </div>

        {/* Degree Badge with Art Deco Stepped Look */}
        <div
          className={`px-3 py-1.5 border flex items-center gap-2 font-cinzel font-bold text-xs tracking-widest uppercase shadow-sm ${
            entry.degree === 'reussite_majeure'
              ? 'bg-[#2b1b3d] text-[#e9d5ff] border-[#a855f7]'
              : entry.degree === 'reussite'
              ? 'bg-[#132e20] text-[#bbf7d0] border-[#22c55e]'
              : entry.degree === 'ambivalent'
              ? 'bg-[#3b2d13] text-[#fef08a] border-[#eab308]'
              : entry.degree === 'echec'
              ? 'bg-[#3b1d14] text-[#fed7aa] border-[#f97316]'
              : 'bg-[#450a0a] text-[#fecaca] border-[#ef4444]'
          }`}
        >
          {getDegreeIcon()}
          <span>{desc.label}</span>
          <span className="ml-1 px-1.5 py-0.5 bg-black/40 border border-white/20 font-mono text-xs font-bold text-white">
            Score {entry.finalTotal}
          </span>
        </div>
      </div>

      {/* Arithmetic Breakdown in elegant dark box */}
      <div className="mt-2.5 p-2 bg-[#0d1117] border border-[#c5a059]/30 font-mono text-xs text-[#d1c7b7] flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-semibold text-[#dfba73] font-cinzel">Calcul :</span>
        <span className="px-1.5 py-0.5 bg-[#1a232f] text-[#f4ecd8] border border-[#c5a059]/40 font-bold">
          1D8 = {entry.d8Result}
        </span>
        <span>+</span>
        <span className="text-[#e6decb]">Rang {entry.rank}</span>
        {entry.difficultyMod !== 0 && (
          <>
            <span>+</span>
            <span className="text-[#e6decb]">Diff/Situation {entry.difficultyMod > 0 ? `+${entry.difficultyMod}` : entry.difficultyMod}</span>
          </>
        )}
        {entry.appliedAdvantage > 0 && (
          <>
            <span>+</span>
            <span className="text-emerald-400 font-bold">Avantage +{entry.appliedAdvantage}</span>
          </>
        )}
        {entry.appliedDisadvantage > 0 && (
          <>
            <span>-</span>
            <span className="text-amber-400 font-bold">Désavantage -{entry.appliedDisadvantage}</span>
          </>
        )}
        {entry.injuryMod !== 0 && (
          <>
            <span>-</span>
            <span className="text-red-400 font-bold">Blessure {entry.injuryMod}</span>
          </>
        )}
        <span className="text-[#c5a059] font-bold">= {entry.finalTotal}</span>
      </div>

      {/* Narrative Detail */}
      <p className="mt-2.5 text-xs sm:text-sm text-[#e6decb] font-marcellus leading-relaxed border-l-2 border-[#c5a059] pl-3 py-0.5 bg-[#141b24]/50">
        {entry.narrativeDetail}
      </p>

      {/* Trace / Investigation Consequence */}
      {entry.traceDetail && (
        <div className="mt-2 text-xs text-[#dfba73] italic font-serif flex items-center gap-1.5 bg-[#251f16]/60 p-2 border border-[#c5a059]/30">
          <span>⚖️</span>
          <span><strong>Conséquence d'enquête :</strong> {entry.traceDetail}</span>
        </div>
      )}
    </div>
  );
};
