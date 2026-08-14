import React, { useState } from 'react';
import { BrigadeBoard } from '../types';
import { TIME_COST_ACTIONS } from '../data/rulesData';
import { Calendar, FileText, AlertTriangle, X, Clock, Plus, Trash2, CheckSquare } from 'lucide-react';

interface BrigadeBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: BrigadeBoard;
  onUpdateBoard: (newBoard: BrigadeBoard) => void;
  isGM: boolean;
}

export function BrigadeBoardModal({
  isOpen,
  onClose,
  board,
  onUpdateBoard,
  isGM,
}: BrigadeBoardModalProps) {
  const [newFact, setNewFact] = useState('');
  const [newHypo, setNewHypo] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs font-serif">
      <div className="bg-[#FAF7EE] border-4 border-[#5C3A1D] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#2B231D]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#78350F]/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#6B1717] text-amber-100 rounded shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#6B1717]">
                Tableau de la Brigade (L'Ardoise)
              </h2>
              <p className="text-xs italic text-stone-600">
                « Une ardoise en bout de table : les faits établis, les hypothèses et les journées restantes. » (Chapitre 20.11)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:bg-stone-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Days remaining banner */}
        <div className="p-4 bg-white/80 rounded border border-[#78350F]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-cinzel font-bold text-[#78350F] uppercase tracking-wider block">
                Délai imparti & Pression du parquet (1 à 6+ Jours)
              </span>
              {isGM && (
                <div className="flex items-center gap-1 text-[11px] font-cinzel">
                  <span className="text-stone-600">Durée totale de l'enquête :</span>
                  <select
                    value={board.totalDays}
                    onChange={(e) => {
                      const newTotal = Number(e.target.value);
                      onUpdateBoard({
                        ...board,
                        totalDays: newTotal,
                        remainingDays: Math.min(board.remainingDays, newTotal),
                      });
                    }}
                    className="bg-[#FAF7EE] border border-stone-400 px-1.5 py-0.5 rounded font-bold text-[#6B1717] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
                      <option key={d} value={d}>
                        {d} {d > 1 ? 'Journées' : 'Journée'} {d === 4 ? '(Standard)' : d === 6 ? '(Affaire complexe)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {isGM ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-700 font-bold whitespace-nowrap">Échéance :</span>
                <input
                  type="text"
                  value={board.deadlineConsequence}
                  onChange={(e) => onUpdateBoard({ ...board, deadlineConsequence: e.target.value })}
                  placeholder="Conséquence fatidique de l'expiration du délai..."
                  className="flex-1 bg-[#FAF7EE] border border-stone-300 px-2 py-1 text-xs italic text-stone-800 focus:outline-none focus:border-[#6B1717]"
                />
              </div>
            ) : (
              <div className="text-xs sm:text-sm italic text-stone-700">
                Échéance fatidique : « {board.deadlineConsequence} »
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 bg-[#FAF7EE] p-2.5 rounded border border-stone-400 self-start md:self-auto">
            <Clock className="w-4 h-4 text-[#6B1717]" />
            <span className="text-xs font-cinzel font-bold text-stone-800">Compteur :</span>
            {isGM && (
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.max(0, board.remainingDays - 1),
                  })
                }
                className="w-7 h-7 bg-[#6B1717] hover:bg-[#521111] text-white rounded font-mono font-bold text-xs cursor-pointer transition-colors"
                title="Consommer 1 journée d'enquête"
              >
                -1j
              </button>
            )}
            <span
              className={`text-lg font-mono font-bold px-3 py-0.5 rounded border ${
                board.remainingDays <= 1
                  ? 'bg-red-700 text-white border-red-800 animate-pulse'
                  : 'bg-white text-[#6B1717] border-stone-300'
              }`}
            >
              {board.remainingDays} / {board.totalDays}j
            </span>
            {isGM && (
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.min(board.totalDays, board.remainingDays + 1),
                  })
                }
                className="w-7 h-7 bg-stone-700 hover:bg-stone-800 text-white rounded font-mono font-bold text-xs cursor-pointer transition-colors"
                title="Rétablir 1 journée"
              >
                +1j
              </button>
            )}
          </div>
        </div>

        {/* 2 Columns: Facts vs Hypotheses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Column 1: Facts */}
          <div className="bg-white/80 p-4 rounded border border-stone-300 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-stone-900 border-b border-stone-200 pb-2">
              <CheckSquare className="w-4 h-4 text-emerald-800" />
              <h3 className="font-cinzel font-bold text-sm tracking-wide text-[#6B1717]">
                Faits Établis & Preuves Matérielles
              </h3>
            </div>
            
            <ul className="space-y-2 text-xs sm:text-sm">
              {board.facts.map((fact, idx) => (
                <li
                  key={idx}
                  className="p-2.5 bg-[#FAF7EE] rounded border border-stone-300 flex items-start justify-between gap-2"
                >
                  <span className="leading-relaxed text-stone-800">• {fact}</span>
                  {isGM && (
                    <button
                      onClick={() =>
                        onUpdateBoard({
                          ...board,
                          facts: board.facts.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-stone-400 hover:text-red-700 transition-colors p-0.5 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isGM && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFact.trim()) {
                      onUpdateBoard({
                        ...board,
                        facts: [...board.facts, newFact.trim()],
                      });
                      setNewFact('');
                    }
                  }}
                  placeholder="Nouvel indice ou fait vérifié..."
                  className="flex-1 bg-[#FAF7EE] border border-stone-400 px-2.5 py-1.5 text-xs text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                />
                <button
                  onClick={() => {
                    if (newFact.trim()) {
                      onUpdateBoard({
                        ...board,
                        facts: [...board.facts, newFact.trim()],
                      });
                      setNewFact('');
                    }
                  }}
                  className="px-3 py-1.5 bg-[#6B1717] hover:bg-[#521111] text-white text-xs font-cinzel font-bold rounded cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Hypotheses */}
          <div className="bg-white/80 p-4 rounded border border-stone-300 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-stone-900 border-b border-stone-200 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h3 className="font-cinzel font-bold text-sm tracking-wide text-[#78350F]">
                Pistes & Hypothèses de Travail
              </h3>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm">
              {board.hypotheses.map((hypo, idx) => (
                <li
                  key={idx}
                  className="p-2.5 bg-[#FAF7EE] rounded border border-stone-300 flex items-start justify-between gap-2"
                >
                  <span className="leading-relaxed text-stone-800 italic">? {hypo}</span>
                  {isGM && (
                    <button
                      onClick={() =>
                        onUpdateBoard({
                          ...board,
                          hypotheses: board.hypotheses.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-stone-400 hover:text-red-700 transition-colors p-0.5 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isGM && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newHypo}
                  onChange={(e) => setNewHypo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newHypo.trim()) {
                      onUpdateBoard({
                        ...board,
                        hypotheses: [...board.hypotheses, newHypo.trim()],
                      });
                      setNewHypo('');
                    }
                  }}
                  placeholder="Nouvelle piste ou intuition..."
                  className="flex-1 bg-[#FAF7EE] border border-stone-400 px-2.5 py-1.5 text-xs text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                />
                <button
                  onClick={() => {
                    if (newHypo.trim()) {
                      onUpdateBoard({
                        ...board,
                        hypotheses: [...board.hypotheses, newHypo.trim()],
                      });
                      setNewHypo('');
                    }
                  }}
                  className="px-3 py-1.5 bg-[#78350F] hover:bg-[#5C3A1D] text-white text-xs font-cinzel font-bold rounded cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Time Cost Reference Guide */}
        <div className="p-3.5 bg-amber-50/70 border border-[#78350F]/20 rounded text-xs space-y-2">
          <div className="font-cinzel font-bold text-[#78350F] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Barème indicatif du temps d'enquête (Système D8) :</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-stone-700">
            {TIME_COST_ACTIONS.map((item, i) => (
              <div key={i} className="flex justify-between border-b border-stone-200 py-0.5">
                <span>{item.label}</span>
                <span className="font-bold text-[#6B1717]">{item.days}j</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
