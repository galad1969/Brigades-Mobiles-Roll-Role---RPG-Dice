import React, { useState } from 'react';
import { XP_CHECKLIST, SKILL_XP_COSTS, ARCHETYPES } from '../data/rulesData';
import { ArchetypeKey } from '../types';
import { Award, CheckCircle, X, ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FDFCF0] dark:bg-stone-900 border-4 border-[#78350f] dark:border-amber-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-stone-900 dark:text-stone-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-300 dark:border-stone-700 pb-4">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-800 dark:text-amber-400" />
            <div>
              <h2 className="text-2xl font-cinzel font-bold text-[#78350f] dark:text-amber-400">
                Séquence de Fin d'Affaire & Progression
              </h2>
              <p className="text-xs font-serif text-stone-600 dark:text-stone-400 italic">
                Six étapes, dans cet ordre, en un quart d'heure (Chapitre 19)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 1. CALCUL DU GAIN D'XP (Chapitre 18.1) */}
        <div className="p-4 bg-amber-50 dark:bg-stone-800/80 rounded-xl border border-amber-300 dark:border-amber-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel font-bold text-base text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              1. Feuille de gain d'Expérience (2 à 5 XP)
            </h3>
            <div className="px-3 py-1 bg-amber-800 text-white rounded-lg font-mono font-bold text-sm shadow">
              {finalXP} XP Gagnés
            </div>
          </div>

          <div className="space-y-2">
            {XP_CHECKLIST.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-amber-100/40 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.id]}
                  onChange={e =>
                    setCheckedItems(prev => ({ ...prev, [item.id]: e.target.checked }))
                  }
                  className="mt-1 w-4 h-4 rounded text-amber-800 focus:ring-amber-800"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  +{item.xp} XP
                </span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
            * Plancher garanti à 2 XP (on ne punit jamais une séance discrète), plafond à 5 XP.
          </p>
        </div>

        {/* 2. CONVALESCENCE & SOINS (Chapitre 16.2) */}
        <div className="p-4 bg-red-50/70 dark:bg-stone-800/80 rounded-xl border border-red-200 dark:border-red-900 space-y-3">
          <h3 className="font-cinzel font-bold text-base text-red-950 dark:text-red-200 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-700" />
            2. Convalescence entre deux affaires
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                Blessure de départ :
              </label>
              <select
                value={currentInjury}
                onChange={e => setCurrentInjury(Number(e.target.value))}
                className="w-full p-2 bg-white dark:bg-stone-900 border rounded"
              >
                <option value="1">1 — Indemne</option>
                <option value="2">2 — Éprouvé</option>
                <option value="3">3 — Blessé</option>
                <option value="4">4 — Grièvement blessé</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                Vigueur de l'inspecteur :
              </label>
              <select
                value={vigueurLevel}
                onChange={e => setVigueurLevel(Number(e.target.value))}
                className="w-full p-2 bg-white dark:bg-stone-900 border rounded"
              >
                <option value="1">1 — Frêle (récupère 1 cran)</option>
                <option value="2">2 — Robuste (récupère 2 crans)</option>
                <option value="3">3 — Endurant (récupère 3 crans)</option>
                <option value="4">4 — Increvable (récupère 4 crans)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPlaieSouillee}
                  onChange={e => setIsPlaieSouillee(e.target.checked)}
                />
                <span className="text-[11px] text-red-800 dark:text-red-300 font-semibold">
                  Plaie souillée (sans soin à 4)
                </span>
              </label>
              <div className="p-2 bg-white dark:bg-stone-900 border border-red-300 rounded font-mono font-bold text-center text-emerald-700">
                État à l'affaire suivante : {healedInjury} ({healedInjury === 1 ? 'Indemne' : healedInjury === 2 ? 'Éprouvé' : healedInjury === 3 ? 'Blessé' : 'Grave'})
              </div>
            </div>
          </div>
        </div>

        {/* 3. BARÈME DE DÉPENSE D'XP (Chapitre 18.2) */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-300 dark:border-stone-700 space-y-3">
          <h3 className="font-cinzel font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            3. Barème des dépenses d'XP
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-stone-300 dark:border-stone-700">
              <thead className="bg-stone-200 dark:bg-stone-700 font-cinzel">
                <tr>
                  <th className="p-2 border">Caractéristique liée</th>
                  <th className="p-2 border">0 → 1</th>
                  <th className="p-2 border">1 → 2</th>
                  <th className="p-2 border">2 → 3</th>
                  <th className="p-2 border">3 → 4</th>
                  <th className="p-2 border">Plafond</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr>
                  <td className="p-2 border font-sans font-semibold">1 — Débutant</td>
                  <td className="p-2 border">3 XP</td>
                  <td className="p-2 border">4 XP</td>
                  <td className="p-2 border">6 XP</td>
                  <td className="p-2 border">12 XP</td>
                  <td className="p-2 border font-bold">2 (Correct)</td>
                </tr>
                <tr>
                  <td className="p-2 border font-sans font-semibold">2 — Normal</td>
                  <td className="p-2 border">2 XP</td>
                  <td className="p-2 border">3 XP</td>
                  <td className="p-2 border">5 XP</td>
                  <td className="p-2 border">11 XP</td>
                  <td className="p-2 border font-bold">3 (Spécialiste)</td>
                </tr>
                <tr>
                  <td className="p-2 border font-sans font-semibold">3 — Professionnel</td>
                  <td className="p-2 border">1 XP</td>
                  <td className="p-2 border">2 XP</td>
                  <td className="p-2 border">4 XP</td>
                  <td className="p-2 border">10 XP</td>
                  <td className="p-2 border font-bold">4 (Maître)</td>
                </tr>
                <tr>
                  <td className="p-2 border font-sans font-semibold">4 — Maître</td>
                  <td className="p-2 border">1 XP</td>
                  <td className="p-2 border">1 XP</td>
                  <td className="p-2 border">3 XP</td>
                  <td className="p-2 border">8 XP</td>
                  <td className="p-2 border font-bold">4 (Maître)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
            <div className="p-2.5 bg-white dark:bg-stone-900 rounded border border-stone-300 dark:border-stone-700">
              <span className="font-cinzel font-bold block text-stone-900 dark:text-stone-100">
                Monter une Caractéristique (+1 point)
              </span>
              <span className="font-mono font-bold text-amber-700">10 XP</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Relève immédiatement le plafond et diminue le coût de toutes ses compétences liées.
              </p>
            </div>
            <div className="p-2.5 bg-white dark:bg-stone-900 rounded border border-stone-300 dark:border-stone-700">
              <span className="font-cinzel font-bold block text-stone-900 dark:text-stone-100">
                Débloquer un Privilège d'archétype
              </span>
              <span className="font-mono font-bold text-purple-700">10 XP</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Nécessite d'avoir traversé sa condition narrative durant une affaire.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
