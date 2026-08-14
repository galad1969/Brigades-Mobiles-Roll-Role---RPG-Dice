import React, { useState } from 'react';
import {
  NPCEntry,
  BrigadeBoard,
  RoomPlayer,
  DifficultyTier,
  RollHistoryAuthor,
  WeaponCategory,
  DegreeResult,
} from '../types';
import {
  DIFFICULTIES,
  PURSUIT_COMPLICATIONS,
  TIME_COST_ACTIONS,
  WEAPONS,
  DEBT_CURRENCIES,
} from '../data/rulesData';
import {
  ShieldAlert,
  Users,
  Calendar,
  Footprints,
  FileText,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  EyeOff,
  Dices,
  Sparkles,
  ChevronRight,
  Send,
  Skull,
} from 'lucide-react';

interface GMPanelProps {
  players: RoomPlayer[];
  board: BrigadeBoard;
  onUpdateBoard: (board: BrigadeBoard) => void;
  onGMSecretRoll: (actionName: string, modifier: number) => void;
}

export function GMPanel({
  players,
  board,
  onUpdateBoard,
  onGMSecretRoll,
}: GMPanelProps) {
  // PNJ List
  const [npcs, setNpcs] = useState<NPCEntry[]>([
    {
      id: '1',
      name: 'Mme Perreau (Logeuse des Batignolles)',
      attitude: -1,
      notes: 'Loue des chambres sans registre. Se méfie de la police.',
    },
    {
      id: '2',
      name: 'Le greffier du parquet',
      attitude: 1,
      notes: 'Aime qu\'on lui demande son avis.',
    },
    {
      id: '3',
      name: 'Homme de main du receleur',
      attitude: -1,
      hasPhysique: true,
      physique: 3,
      hasWeapon: true,
      weapon: 'legere',
      notes: 'Armé d\'un surin. Prêt à détaler.',
    },
  ]);

  // New NPC Form
  const [newNpcName, setNewNpcName] = useState('');
  const [newNpcAttitude, setNewNpcAttitude] = useState<-1 | 0 | 1>(0);
  const [newNpcHasPhysique, setNewNpcHasPhysique] = useState(false);
  const [newNpcPhysique, setNewNpcPhysique] = useState(2);
  const [newNpcHasWeapon, setNewNpcHasWeapon] = useState(false);
  const [newNpcWeapon, setNewNpcWeapon] = useState<WeaponCategory>('legere');
  const [newNpcNotes, setNewNpcNotes] = useState('');

  // Pursuit Assistant State
  const [activeObstacle, setActiveObstacle] = useState<{
    d8: number;
    title: string;
    desc: string;
  } | null>(null);

  // Secret Roll State
  const [secretActionName, setSecretActionName] = useState('Jet de perception adverse');
  const [secretModifier, setSecretModifier] = useState(0);

  // Board item inputs
  const [newFact, setNewFact] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');

  // Add NPC
  const handleAddNPC = () => {
    if (!newNpcName.trim()) return;
    const newEntry: NPCEntry = {
      id: crypto.randomUUID(),
      name: newNpcName.trim(),
      attitude: newNpcAttitude,
      hasPhysique: newNpcHasPhysique,
      physique: newNpcHasPhysique ? newNpcPhysique : undefined,
      hasWeapon: newNpcHasWeapon,
      weapon: newNpcHasWeapon ? newNpcWeapon : undefined,
      notes: newNpcNotes.trim(),
    };
    setNpcs(prev => [...prev, newEntry]);
    setNewNpcName('');
    setNewNpcNotes('');
    setNewNpcHasPhysique(false);
    setNewNpcHasWeapon(false);
  };

  const handleUpdateNpcAttitude = (id: string, delta: number) => {
    setNpcs(prev =>
      prev.map(npc => {
        if (npc.id === id) {
          const newAtt = Math.max(-1, Math.min(1, npc.attitude + delta)) as -1 | 0 | 1;
          return { ...npc, attitude: newAtt };
        }
        return npc;
      })
    );
  };

  const handleUpdateNpcPhysique = (id: string, delta: number) => {
    setNpcs(prev =>
      prev.map(npc => {
        if (npc.id === id && npc.physique !== undefined) {
          const newP = Math.max(0, Math.min(5, npc.physique + delta));
          return { ...npc, physique: newP };
        }
        return npc;
      })
    );
  };

  const handleDeleteNpc = (id: string) => {
    setNpcs(prev => prev.filter(n => n.id !== id));
  };

  // Roll Random Pursuit Complication
  const handleRollPursuitComplication = () => {
    const roll = Math.floor(Math.random() * 8) + 1;
    const comp = PURSUIT_COMPLICATIONS.find(c => c.d8 === roll);
    if (comp) setActiveObstacle(comp);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TABLEAU DE LA BRIGADE (L'Ardoise & Le Temps qui passe) */}
      <div className="bg-slate-900 text-stone-100 rounded-xl p-6 border-4 border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-cinzel font-bold text-amber-300">
                Tableau de la Brigade (Ardoise de l'Affaire)
              </h2>
              <p className="text-xs font-serif text-stone-300 italic">
                « L'adversaire d'une brigade mobile n'est pas le coupable : c'est le délai. » (Chapitre 10.4)
              </p>
            </div>
          </div>

          {/* Days Counter */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-xs font-cinzel uppercase text-stone-400">Journées restantes :</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.max(0, board.remainingDays - 1),
                  })
                }
                className="w-7 h-7 bg-red-900/80 hover:bg-red-800 rounded font-mono font-bold text-white flex items-center justify-center text-sm"
                title="Consommer 1 jour"
              >
                -1j
              </button>
              <span
                className={`text-lg font-mono font-bold px-3 py-0.5 rounded ${
                  board.remainingDays <= 1 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-950 text-amber-400'
                }`}
              >
                {board.remainingDays} / {board.totalDays}
              </span>
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.min(board.totalDays, board.remainingDays + 1),
                  })
                }
                className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded font-mono font-bold text-white flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Quick action time consumption */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="text-xs font-cinzel text-amber-400 font-bold block mb-2">
            Consommation rapide du temps selon l'acte entrepris :
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {TIME_COST_ACTIONS.slice(2, 6).map(act => (
              <button
                key={act.label}
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.max(0, board.remainingDays - act.days),
                  })
                }
                className="p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded border border-slate-700 text-stone-300 transition-colors"
              >
                <div className="font-semibold text-white">{act.label.split(':')[0]}</div>
                <div className="text-amber-400 font-mono mt-0.5">Coût : {act.days} journée(s)</div>
              </button>
            ))}
          </div>
        </div>

        {/* Facts & Hypotheses columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Faits établis */}
          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-cinzel font-bold text-emerald-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Faits établis (Vérifiés par 2 sources)
              </h4>
              <span className="text-[11px] text-stone-400 font-mono">{board.facts.length} faits</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-200 font-typewriter">
              {board.facts.map((fact, idx) => (
                <li key={idx} className="flex items-start justify-between gap-2 p-1.5 bg-slate-900 rounded">
                  <span>• {fact}</span>
                  <button
                    onClick={() =>
                      onUpdateBoard({
                        ...board,
                        facts: board.facts.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-stone-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFact}
                onChange={e => setNewFact(e.target.value)}
                placeholder="Ajouter un fait vérifié..."
                className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-stone-100 placeholder-stone-500 outline-none"
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
                className="px-2.5 py-1 bg-emerald-800 text-white rounded text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Hypothèses */}
          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-cinzel font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Hypothèses de travail
              </h4>
              <span className="text-[11px] text-stone-400 font-mono">{board.hypotheses.length} hypothèses</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-200 font-typewriter">
              {board.hypotheses.map((hypo, idx) => (
                <li key={idx} className="flex items-start justify-between gap-2 p-1.5 bg-slate-900 rounded">
                  <span>? {hypo}</span>
                  <button
                    onClick={() =>
                      onUpdateBoard({
                        ...board,
                        hypotheses: board.hypotheses.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-stone-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHypothesis}
                onChange={e => setNewHypothesis(e.target.value)}
                placeholder="Ajouter une piste / hypothèse..."
                className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-stone-100 placeholder-stone-500 outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newHypothesis.trim()) {
                    onUpdateBoard({ ...board, hypotheses: [...board.hypotheses, newHypothesis.trim()] });
                    setNewHypothesis('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newHypothesis.trim()) {
                    onUpdateBoard({ ...board, hypotheses: [...board.hypotheses, newHypothesis.trim()] });
                    setNewHypothesis('');
                  }
                }}
                className="px-2.5 py-1 bg-amber-700 text-white rounded text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GESTION DES PNJ & OPPOSANTS (1 ligne par PNJ - Chapitre 15) */}
      <div className="bg-white/80 dark:bg-stone-900/90 rounded-xl border-2 border-stone-300 dark:border-stone-700 shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-lg font-cinzel font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-800" />
              Répertoire des PNJ & Opposants de la scène
            </h3>
            <p className="text-xs text-stone-500 font-serif italic">
              « Tout le monde, dans ce jeu, tient sur une ligne. » (Chapitre 15)
            </p>
          </div>
        </div>

        {/* NPC List */}
        <div className="space-y-2.5">
          {npcs.map(npc => (
            <div
              key={npc.id}
              className="p-3 bg-stone-50 dark:bg-stone-800/80 rounded-lg border border-stone-300 dark:border-stone-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1">
                <div className="font-cinzel font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {npc.name}
                </div>
                {npc.notes && (
                  <p className="text-stone-600 dark:text-stone-400 italic text-[11px] mt-0.5">
                    {npc.notes}
                  </p>
                )}
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Attitude badge */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-cinzel text-stone-500">Attitude :</span>
                  <button
                    onClick={() => handleUpdateNpcAttitude(npc.id, -1)}
                    className="w-5 h-5 bg-stone-200 dark:bg-stone-700 rounded text-stone-700 dark:text-stone-200 font-bold"
                  >
                    -
                  </button>
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold ${
                      npc.attitude === -1
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : npc.attitude === 1
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {npc.attitude === -1 ? 'Hostile (-1)' : npc.attitude === 1 ? 'Loyal (+1)' : 'Neutre (0)'}
                  </span>
                  <button
                    onClick={() => handleUpdateNpcAttitude(npc.id, 1)}
                    className="w-5 h-5 bg-stone-200 dark:bg-stone-700 rounded text-stone-700 dark:text-stone-200 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Physique if fighter */}
                {npc.hasPhysique && npc.physique !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase font-cinzel text-stone-500">Physique :</span>
                    <button
                      onClick={() => handleUpdateNpcPhysique(npc.id, -1)}
                      className="w-5 h-5 bg-stone-200 dark:bg-stone-700 rounded text-stone-700 dark:text-stone-200 font-bold"
                    >
                      -
                    </button>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold ${
                        npc.physique === 0
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {npc.physique === 0 ? 'Hors de combat' : `Indice ${npc.physique}`}
                    </span>
                    <button
                      onClick={() => handleUpdateNpcPhysique(npc.id, 1)}
                      className="w-5 h-5 bg-stone-200 dark:bg-stone-700 rounded text-stone-700 dark:text-stone-200 font-bold"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Weapon */}
                {npc.hasWeapon && npc.weapon && (
                  <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-300 rounded font-mono">
                    Arme {WEAPONS[npc.weapon].name} ({WEAPONS[npc.weapon].damage})
                  </span>
                )}

                <button
                  onClick={() => handleDeleteNpc(npc.id)}
                  className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                  title="Supprimer le PNJ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add NPC form */}
        <div className="p-3 bg-stone-100/70 dark:bg-stone-800/50 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
          <span className="text-xs font-cinzel font-bold text-stone-800 dark:text-stone-200 block">
            + Ajouter un interlocuteur ou opposant
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newNpcName}
              onChange={e => setNewNpcName(e.target.value)}
              placeholder="Nom / Fonction (ex: Inspecteur de province, Témoin...)"
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
            />
            <select
              value={newNpcAttitude}
              onChange={e => setNewNpcAttitude(Number(e.target.value) as -1 | 0 | 1)}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-serif"
            >
              <option value="-1">Hostile (-1)</option>
              <option value="0">Neutre (0)</option>
              <option value="1">Loyal (+1)</option>
            </select>
            <input
              type="text"
              value={newNpcNotes}
              onChange={e => setNewNpcNotes(e.target.value)}
              placeholder="Note / Enjeu / Arme..."
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNpcHasPhysique}
                  onChange={e => setNewNpcHasPhysique(e.target.checked)}
                />
                <span>Indice Physique</span>
              </label>
              {newNpcHasPhysique && (
                <select
                  value={newNpcPhysique}
                  onChange={e => setNewNpcPhysique(Number(e.target.value))}
                  className="p-1 text-xs bg-white dark:bg-stone-800 border rounded"
                >
                  <option value="0">0 (Figurant)</option>
                  <option value="1">1 (Figurant / Sbire)</option>
                  <option value="2">2 (Sbire)</option>
                  <option value="3">3 (Sbire / Boss)</option>
                  <option value="4">4 (Boss)</option>
                  <option value="5">5 (Boss exceptionnel)</option>
                </select>
              )}

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNpcHasWeapon}
                  onChange={e => setNewNpcHasWeapon(e.target.checked)}
                />
                <span>Armé</span>
              </label>
              {newNpcHasWeapon && (
                <select
                  value={newNpcWeapon}
                  onChange={e => setNewNpcWeapon(e.target.value as WeaponCategory)}
                  className="p-1 text-xs bg-white dark:bg-stone-800 border rounded"
                >
                  <option value="legere">Légère (1)</option>
                  <option value="moyenne">Moyenne (2)</option>
                  <option value="lourde">Lourde (3)</option>
                </select>
              )}
            </div>

            <button
              onClick={handleAddNPC}
              className="px-3 py-1.5 bg-[#78350f] hover:bg-[#582609] text-white text-xs font-cinzel font-bold rounded shadow transition-all"
            >
              Enregistrer le PNJ
            </button>
          </div>
        </div>
      </div>

      {/* 3. ASSISTANT DE POURSUITE & COMPLICATIONS D8 (Chapitre 14) */}
      <div className="bg-white/80 dark:bg-stone-900/90 rounded-xl border-2 border-stone-300 dark:border-stone-700 shadow-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-lg font-cinzel font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Footprints className="w-5 h-5 text-emerald-700" />
              Assistant de Poursuite D8
            </h3>
            <p className="text-xs text-stone-500 font-serif italic">
              Tirage des obstacles imprévus (Table D8 officielle - Chapitre 14.2)
            </p>
          </div>

          <button
            onClick={handleRollPursuitComplication}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-cinzel font-bold text-xs shadow transition-all flex items-center gap-2"
          >
            <Dices className="w-4 h-4" />
            Tirer une complication D8
          </button>
        </div>

        {activeObstacle ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border-2 border-emerald-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel font-bold text-emerald-900 dark:text-emerald-300 uppercase">
                Obstacle D8 = {activeObstacle.d8} : {activeObstacle.title}
              </span>
            </div>
            <p className="font-newsreader italic text-sm text-stone-800 dark:text-stone-200">
              « {activeObstacle.desc} »
            </p>
          </div>
        ) : (
          <div className="p-3 bg-stone-100 dark:bg-stone-800/60 rounded text-xs text-stone-500 italic text-center">
            Cliquez sur « Tirer une complication D8 » pour générer un obstacle de parcours.
          </div>
        )}
      </div>

      {/* 4. JET SECRET DU MENEUR */}
      <div className="bg-stone-900 text-stone-100 rounded-xl p-6 border-2 border-stone-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-red-400" />
            <h3 className="font-cinzel font-bold text-base text-red-300">
              Jet Secret du Meneur (Huis clos)
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-serif italic">
            Les joueurs recevront un avis confidentiel sans voir le chiffre
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-cinzel text-stone-400 mb-1">
              Intitulé de l'action secrète
            </label>
            <input
              type="text"
              value={secretActionName}
              onChange={e => setSecretActionName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded text-stone-100"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel text-stone-400 mb-1">
              Modificateur total
            </label>
            <input
              type="number"
              value={secretModifier}
              onChange={e => setSecretModifier(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded text-stone-100 font-mono"
            />
          </div>
        </div>

        <button
          onClick={() => onGMSecretRoll(secretActionName, secretModifier)}
          className="w-full py-2.5 bg-red-900 hover:bg-red-800 text-white font-cinzel font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <EyeOff className="w-4 h-4" />
          Lancer le Dé Secret à Huis Clos
        </button>
      </div>

    </div>
  );
}
