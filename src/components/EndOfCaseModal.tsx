import React, { useState } from 'react';
import { XP_CHECKLIST } from '../data/rulesData';
import { ArchetypeKey } from '../types';
import { Award, X, Sparkles, BookOpen, Heart } from 'lucide-react';

interface EndOfCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  archetype: ArchetypeKey;
}

export function EndOfCaseModal({ isOpen, onClose, archetype }: EndOfCaseModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    participe: true,
    resolue: true,
  });

  const [vigueurLevel, setVigueurLevel] = useState<number>(2);
  const [currentInjury, setCurrentInjury] = useState<number>(3);
  const [isPlaieSouillee, setIsPlaieSouillee] = useState<boolean>(false);

  if (!isOpen) return null;

  const rawXP = Object.entries(checkedItems).filter(([_, v]) => v).length;
  const finalXP = Math.max(2, Math.min(5, rawXP)); // Plancher à 2, plafond à 5

  const healedInjury = isPlaieSouillee
    ? Math.max(1, currentInjury - 1)
    : Math.max(1, currentInjury - vigueurLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-serif animate-in fade-in duration-200">
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6 text-[#f4ecd8] relative">
        
        {/* CORNERS */}
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c5a059]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1a232f] border border-[#dfba73] text-[#dfba73]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-cinzel-deco font-bold text-gold-gradient">
                Fin d'Affaire & Progression
              </h2>
              <p className="text-xs font-marcellus text-[#a69d8d] italic">
                Six étapes, dans cet ordre, en un quart d'heure (Chapitre 19)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1a232f] text-[#dfba73] border border-transparent hover:border-[#c5a059]/50 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 1. CALCUL DU GAIN D'XP (Chapitre 18.1) */}
        <div className="p-4 bg-[#0d1117] border border-[#c5a059]/40 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-2">
            <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#dfba73] flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#dfba73]" />
              1. Feuille de gain d'Expérience (2 à 5 XP)
            </h3>
            <div className="px-3 py-1 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] text-[#0d1117] font-cinzel font-bold text-xs uppercase tracking-wider border border-[#f3e5ab]">
              {finalXP} XP Gagnés
            </div>
          </div>

          <div className="space-y-2">
            {XP_CHECKLIST.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-2.5 bg-[#161d26] border border-[#c5a059]/30 cursor-pointer hover:border-[#dfba73] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.id]}
                  onChange={e =>
                    setCheckedItems(prev => ({ ...prev, [item.id]: e.target.checked }))
                  }
                  className="mt-1 w-4 h-4 rounded text-[#c5a059] focus:ring-[#c5a059]"
                />
                <div className="flex-1 text-xs font-marcellus text-[#f4ecd8]">
                  {item.label}
                </div>
                <span className="text-xs font-mono font-bold text-[#dfba73]">
                  +{item.xp} XP
                </span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-[#a69d8d] font-marcellus italic">
            * Plancher garanti à 2 XP (on ne punit jamais une séance discrète), plafond à 5 XP.
          </p>
        </div>

        {/* 2. CONVALESCENCE & SOINS (Chapitre 16.2) */}
        <div className="p-4 bg-[#0d1117] border border-[#c5a059]/40 space-y-3 shadow-md">
          <h3 className="font-cinzel font-bold text-sm sm:text-base text-red-400 flex items-center gap-2 uppercase tracking-wider">
            <Heart className="w-4 h-4 text-red-400" />
            2. Convalescence entre deux affaires
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-marcellus">
            <div>
              <label className="block text-[#dfba73] font-cinzel uppercase text-[11px] mb-1">
                Blessure de départ :
              </label>
              <select
                value={currentInjury}
                onChange={e => setCurrentInjury(Number(e.target.value))}
                className="w-full p-2 bg-[#161d26] border border-[#c5a059]/40 text-[#f4ecd8] focus:outline-none"
              >
                <option value="1" className="bg-[#121820]">1 — Indemne</option>
                <option value="2" className="bg-[#121820]">2 — Éprouvé</option>
                <option value="3" className="bg-[#121820]">3 — Blessé</option>
                <option value="4" className="bg-[#121820]">4 — Grièvement blessé</option>
              </select>
            </div>

            <div>
              <label className="block text-[#dfba73] font-cinzel uppercase text-[11px] mb-1">
                Vigueur de l'agent :
              </label>
              <select
                value={vigueurLevel}
                onChange={e => setVigueurLevel(Number(e.target.value))}
                className="w-full p-2 bg-[#161d26] border border-[#c5a059]/40 text-[#f4ecd8] focus:outline-none"
              >
                <option value="1" className="bg-[#121820]">1 — Frêle (récupère 1 cran)</option>
                <option value="2" className="bg-[#121820]">2 — Robuste (récupère 2 crans)</option>
                <option value="3" className="bg-[#121820]">3 — Endurant (récupère 3 crans)</option>
                <option value="4" className="bg-[#121820]">4 — Increvable (récupère 4 crans)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPlaieSouillee}
                  onChange={e => setIsPlaieSouillee(e.target.checked)}
                  className="rounded text-[#c5a059]"
                />
                <span className="text-[11px] text-red-400 font-semibold">
                  Plaie souillée (sans soin à 4)
                </span>
              </label>
              <div className="p-2 bg-[#161d26] border border-[#c5a059]/40 font-mono font-bold text-center text-emerald-400">
                État final : {healedInjury} ({healedInjury === 1 ? 'Indemne' : healedInjury === 2 ? 'Éprouvé' : healedInjury === 3 ? 'Blessé' : 'Grave'})
              </div>
            </div>
          </div>
        </div>

        {/* 3. BARÈME DE DÉPENSE D'XP (Chapitre 18.2) */}
        <div className="p-4 bg-[#0d1117] border border-[#c5a059]/40 space-y-3 shadow-md">
          <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#dfba73] flex items-center gap-2 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#dfba73]" />
            3. Barème des dépenses d'XP
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#c5a059]/40 font-marcellus">
              <thead className="bg-[#161d26] font-cinzel text-[#dfba73] uppercase tracking-wider">
                <tr>
                  <th className="p-2 border border-[#c5a059]/30">Caractéristique</th>
                  <th className="p-2 border border-[#c5a059]/30">0 → 1</th>
                  <th className="p-2 border border-[#c5a059]/30">1 → 2</th>
                  <th className="p-2 border border-[#c5a059]/30">2 → 3</th>
                  <th className="p-2 border border-[#c5a059]/30">3 → 4</th>
                  <th className="p-2 border border-[#c5a059]/30">Plafond</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[#d1c7b7]">
                <tr>
                  <td className="p-2 border border-[#c5a059]/20 font-sans font-semibold text-[#dfba73]">1 — Débutant</td>
                  <td className="p-2 border border-[#c5a059]/20">3 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">4 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">6 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">12 XP</td>
                  <td className="p-2 border border-[#c5a059]/20 font-bold text-[#dfba73]">2 (Correct)</td>
                </tr>
                <tr>
                  <td className="p-2 border border-[#c5a059]/20 font-sans font-semibold text-[#dfba73]">2 — Normal</td>
                  <td className="p-2 border border-[#c5a059]/20">2 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">3 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">5 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">11 XP</td>
                  <td className="p-2 border border-[#c5a059]/20 font-bold text-[#dfba73]">3 (Spécialiste)</td>
                </tr>
                <tr>
                  <td className="p-2 border border-[#c5a059]/20 font-sans font-semibold text-[#dfba73]">3 — Professionnel</td>
                  <td className="p-2 border border-[#c5a059]/20">1 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">2 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">4 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">10 XP</td>
                  <td className="p-2 border border-[#c5a059]/20 font-bold text-[#dfba73]">4 (Maître)</td>
                </tr>
                <tr>
                  <td className="p-2 border border-[#c5a059]/20 font-sans font-semibold text-[#dfba73]">4 — Maître</td>
                  <td className="p-2 border border-[#c5a059]/20">1 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">1 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">3 XP</td>
                  <td className="p-2 border border-[#c5a059]/20">8 XP</td>
                  <td className="p-2 border border-[#c5a059]/20 font-bold text-[#dfba73]">4 (Maître)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 font-marcellus">
            <div className="p-2.5 bg-[#161d26] border border-[#c5a059]/30">
              <span className="font-cinzel font-bold block text-[#dfba73] uppercase tracking-wider">
                Monter une Caractéristique (+1 pt)
              </span>
              <span className="font-mono font-bold text-amber-300">10 XP</span>
              <p className="text-[11px] text-[#a69d8d] mt-0.5">
                Relève le plafond et réduit le coût de toutes ses compétences.
              </p>
            </div>
            <div className="p-2.5 bg-[#161d26] border border-[#c5a059]/30">
              <span className="font-cinzel font-bold block text-[#dfba73] uppercase tracking-wider">
                Débloquer un Privilège
              </span>
              <span className="font-mono font-bold text-purple-300">10 XP</span>
              <p className="text-[11px] text-[#a69d8d] mt-0.5">
                Nécessite d'avoir traversé sa condition narrative en affaire.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
