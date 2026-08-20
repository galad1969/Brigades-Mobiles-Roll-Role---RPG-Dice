import React, { useState } from 'react';
import { BrigadeBoard } from '../types';
import { TIME_COST_ACTIONS } from '../data/rulesData';
import { Calendar, AlertTriangle, X, Clock, Trash2, CheckSquare } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-serif animate-in fade-in duration-200">
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6 text-[#f4ecd8] relative">
        
        {/* CORNERS */}
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c5a059]/40 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1a232f] border border-[#dfba73] text-[#dfba73] shadow-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel-deco font-bold text-gold-gradient">
                Tableau de la Brigade (L'Ardoise)
              </h2>
              <p className="text-xs text-[#a69d8d] font-marcellus">
                « Une ardoise en bout de table : les faits établis, les hypothèses et les journées restantes. » (Chapitre 20.11)
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

        {/* Days remaining banner */}
        <div className="p-4 bg-[#0d1117] border border-[#c5a059]/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-cinzel font-bold text-[#dfba73] uppercase tracking-widest block">
                Délai imparti & Pression du parquet (1 à 6+ Jours)
              </span>
              {isGM && (
                <div className="flex items-center gap-1.5 text-[11px] font-cinzel">
                  <span className="text-[#a69d8d]">Durée totale :</span>
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
                    className="bg-[#161d26] border border-[#c5a059]/50 px-2 py-0.5 font-bold text-[#dfba73] cursor-pointer focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
                      <option key={d} value={d} className="bg-[#121820] text-[#f4ecd8]">
                        {d} {d > 1 ? 'Journées' : 'Journée'} {d === 4 ? '(Standard)' : d === 6 ? '(Affaire complexe)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {isGM ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#dfba73] font-cinzel font-bold whitespace-nowrap uppercase">Échéance :</span>
                <input
                  type="text"
                  value={board.deadlineConsequence}
                  onChange={(e) => onUpdateBoard({ ...board, deadlineConsequence: e.target.value })}
                  placeholder="Conséquence fatidique de l'expiration du délai..."
                  className="flex-1 bg-[#161d26] border border-[#c5a059]/40 px-2.5 py-1 text-xs italic text-[#f4ecd8] focus:outline-none focus:border-[#dfba73]"
                />
              </div>
            ) : (
              <div className="text-xs sm:text-sm italic text-[#d1c7b7] font-marcellus">
                Échéance fatidique : « {board.deadlineConsequence} »
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 bg-[#161d26] p-2.5 border border-[#c5a059]/40 self-start md:self-auto">
            <Clock className="w-4 h-4 text-[#dfba73]" />
            <span className="text-xs font-cinzel font-bold text-[#f4ecd8] uppercase tracking-wider">Compteur :</span>
            {isGM && (
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.max(0, board.remainingDays - 1),
                  })
                }
                className="w-7 h-7 bg-[#3b1d14] hover:bg-[#521111] text-[#fed7aa] border border-[#f97316]/50 font-mono font-bold text-xs cursor-pointer transition-colors"
                title="Consommer 1 journée d'enquête"
              >
                -1j
              </button>
            )}
            <span
              className={`text-lg font-mono font-bold px-3 py-0.5 border ${
                board.remainingDays <= 1
                  ? 'bg-[#450a0a] text-[#fecaca] border-red-500 animate-pulse'
                  : 'bg-[#0d1117] text-[#dfba73] border-[#c5a059]/50'
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
                className="w-7 h-7 bg-[#1a232f] hover:bg-[#253243] text-[#dfba73] border border-[#c5a059]/50 font-mono font-bold text-xs cursor-pointer transition-colors"
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
          <div className="bg-[#0d1117] p-4 border border-[#c5a059]/40 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 border-b border-[#c5a059]/30 pb-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="font-cinzel font-bold text-sm tracking-widest text-[#dfba73] uppercase">
                Faits Établis & Preuves
              </h3>
            </div>
            
            <ul className="space-y-2 text-xs sm:text-sm">
              {board.facts.map((fact, idx) => (
                <li
                  key={idx}
                  className="p-2.5 bg-[#161d26] border border-[#c5a059]/30 flex items-start justify-between gap-2"
                >
                  <span className="leading-relaxed text-[#f4ecd8] font-marcellus">• {fact}</span>
                  {isGM && (
                    <button
                      onClick={() =>
                        onUpdateBoard({
                          ...board,
                          facts: board.facts.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-[#a69d8d] hover:text-red-400 transition-colors p-0.5 cursor-pointer"
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
                  className="flex-1 bg-[#161d26] border border-[#c5a059]/40 px-2.5 py-1.5 text-xs text-[#f4ecd8] focus:outline-none focus:border-[#dfba73]"
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
                  className="px-3 py-1.5 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] text-[#0d1117] text-xs font-cinzel font-bold cursor-pointer uppercase tracking-wider border border-[#f3e5ab]"
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Hypotheses */}
          <div className="bg-[#0d1117] p-4 border border-[#c5a059]/40 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 border-b border-[#c5a059]/30 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-cinzel font-bold text-sm tracking-widest text-[#dfba73] uppercase">
                Pistes & Hypothèses
              </h3>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm">
              {board.hypotheses.map((hypo, idx) => (
                <li
                  key={idx}
                  className="p-2.5 bg-[#161d26] border border-[#c5a059]/30 flex items-start justify-between gap-2"
                >
                  <span className="leading-relaxed text-[#d1c7b7] font-marcellus italic">? {hypo}</span>
                  {isGM && (
                    <button
                      onClick={() =>
                        onUpdateBoard({
                          ...board,
                          hypotheses: board.hypotheses.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-[#a69d8d] hover:text-red-400 transition-colors p-0.5 cursor-pointer"
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
                  className="flex-1 bg-[#161d26] border border-[#c5a059]/40 px-2.5 py-1.5 text-xs text-[#f4ecd8] focus:outline-none focus:border-[#dfba73]"
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
                  className="px-3 py-1.5 bg-[#1a232f] hover:bg-[#253243] text-[#dfba73] border border-[#c5a059]/50 text-xs font-cinzel font-bold cursor-pointer uppercase tracking-wider"
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Time Cost Reference Guide */}
        <div className="p-3.5 bg-[#0d1117] border border-[#c5a059]/40 text-xs space-y-2">
          <div className="font-cinzel font-bold text-[#dfba73] flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Barème indicatif du temps d'enquête (Système D8) :</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[#d1c7b7] font-marcellus">
            {TIME_COST_ACTIONS.map((item, i) => (
              <div key={i} className="flex justify-between border-b border-[#c5a059]/20 py-0.5">
                <span>{item.label}</span>
                <span className="font-bold text-[#dfba73] font-mono">{item.days}j</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
