import React, { useState } from 'react';
import { BrigadeBoard } from '../types';
import { TIME_COST_ACTIONS } from '../data/rulesData';
import { Calendar, FileText, AlertTriangle, X, Clock, Plus, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border-4 border-stone-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-stone-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="text-2xl font-cinzel font-bold text-amber-300">
                Tableau de la Brigade (L'Ardoise)
              </h2>
              <p className="text-xs font-serif text-stone-300 italic">
                « Une ardoise en bout de table, trois colonnes : les faits établis, les hypothèses, et les journées restantes. » (Chapitre 20.11)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Days remaining banner */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-cinzel text-stone-400 uppercase tracking-wider block">
              Délai de l'affaire en cours
            </span>
            <div className="text-sm font-newsreader italic text-stone-300 mt-1">
              Échéance fatidique : « {board.deadlineConsequence} »
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-cinzel uppercase text-stone-300">Journées :</span>
            {isGM && (
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.max(0, board.remainingDays - 1),
                  })
                }
                className="w-7 h-7 bg-red-900/80 hover:bg-red-800 text-white rounded font-mono font-bold text-xs"
              >
                -1j
              </button>
            )}
            <span
              className={`text-xl font-mono font-bold px-3 py-0.5 rounded ${
                board.remainingDays <= 1 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-950 text-amber-400'
              }`}
            >
              {board.remainingDays} / {board.totalDays}
            </span>
            {isGM && (
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.min(board.totalDays, board.remainingDays + 1),
                  })
                }
                className="w-7 h-7 bg-slate-700 hover:bg-slate-600 text-white rounded font-mono font-bold text-xs"
              >
                +
              </button>
            )}
          </div>
        </div>

        {/* Actions and times guide */}
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs">
          <span className="text-amber-400 font-cinzel font-bold block mb-1.5">
            Barème officiel du temps qui passe (Chapitre 21.4) :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
            <div>• Télégramme à l'identité judiciaire : <strong>0 jour</strong> (réponse le jour même)</div>
            <div>• Dossier complet, sommiers, casier : <strong>1 jour</strong></div>
            <div>• Analyse courante (empreintes, taches de sang) : <strong>1 jour</strong></div>
            <div>• Analyse lourde (toxicologie, balistique, expertises) : <strong>2 jours</strong></div>
            <div>• Expertise de traces (poussières, boue, fibres) : <strong>3 jours</strong></div>
            <div>• Déplacement vers un autre ressort / planque : <strong>1 jour</strong></div>
          </div>
        </div>

        {/* Facts & Hypotheses columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Faits établis */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-base font-cinzel font-bold text-emerald-400 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Faits Établis (Vérifiés par 2 sources)
            </h3>
            <p className="text-[11px] text-stone-400 font-serif italic">
              « On ne promeut une hypothèse en fait que sur deux sources indépendantes. »
            </p>

            <ul className="space-y-2 text-xs font-typewriter">
              {board.facts.map((fact, idx) => (
                <li
                  key={idx}
                  className="p-2 bg-slate-900 rounded border border-slate-800 flex items-start justify-between gap-2 text-stone-200"
                >
                  <span>• {fact}</span>
                  <button
                    onClick={() =>
                      onUpdateBoard({
                        ...board,
                        facts: board.facts.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-stone-500 hover:text-red-400 font-bold"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newFact}
                onChange={e => setNewFact(e.target.value)}
                placeholder="Nouveau fait vérifié..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-stone-100 outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newFact.trim()) {
                    onUpdateBoard({ ...board, facts: [...board.facts, newFact.trim()] });
                    setNewFact('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newFact.trim()) {
                    onUpdateBoard({ ...board, facts: [...board.facts, newFact.trim()] });
                    setNewFact('');
                  }
                }}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-bold font-cinzel"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Column 2: Hypothèses */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-base font-cinzel font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Hypothèses de la Brigade
            </h3>
            <p className="text-[11px] text-stone-400 font-serif italic">
              « Effacer une fausse piste d'un revers de manche est un coup de théâtre à part entière. »
            </p>

            <ul className="space-y-2 text-xs font-typewriter">
              {board.hypotheses.map((hypo, idx) => (
                <li
                  key={idx}
                  className="p-2 bg-slate-900 rounded border border-slate-800 flex items-start justify-between gap-2 text-stone-200"
                >
                  <span>? {hypo}</span>
                  <button
                    onClick={() =>
                      onUpdateBoard({
                        ...board,
                        hypotheses: board.hypotheses.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-stone-500 hover:text-red-400 font-bold"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newHypo}
                onChange={e => setNewHypo(e.target.value)}
                placeholder="Nouvelle piste / hypothèse..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-stone-100 outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newHypo.trim()) {
                    onUpdateBoard({ ...board, hypotheses: [...board.hypotheses, newHypo.trim()] });
                    setNewHypo('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newHypo.trim()) {
                    onUpdateBoard({ ...board, hypotheses: [...board.hypotheses, newHypo.trim()] });
                    setNewHypo('');
                  }
                }}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-white rounded text-xs font-bold font-cinzel"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
