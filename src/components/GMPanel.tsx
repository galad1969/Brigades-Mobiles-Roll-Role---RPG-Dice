import React, { useState } from 'react';
import {
  NPCEntry,
  BrigadeBoard,
  RoomPlayer,
  WeaponCategory,
} from '../types';
import {
  PURSUIT_COMPLICATIONS,
  TIME_COST_ACTIONS,
  WEAPONS,
} from '../data/rulesData';
import {
  Users,
  Calendar,
  Footprints,
  FileText,
  Trash2,
  AlertTriangle,
  EyeOff,
  Dices,
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
      notes: "Aime qu'on lui demande son avis.",
    },
    {
      id: '3',
      name: 'Homme de main du receleur',
      attitude: -1,
      hasPhysique: true,
      physique: 3,
      hasWeapon: true,
      weapon: 'legere',
      notes: "Armé d'un surin. Prêt à détaler.",
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
    <div className="space-y-6 font-serif">
      
      {/* 1. TABLEAU DE LA BRIGADE (L'Ardoise & Le Temps qui passe) */}
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] p-6 shadow-[0_0_25px_rgba(0,0,0,0.6)] space-y-6 text-[#f4ecd8] relative">
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c5a059]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1a232f] border border-[#dfba73] text-[#dfba73]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-cinzel-deco font-bold text-gold-gradient">
                Tableau de la Brigade (Ardoise de l'Affaire)
              </h2>
              <p className="text-xs font-marcellus text-[#a69d8d] italic">
                « L'adversaire d'une brigade mobile n'est pas le coupable : c'est le délai. » (Chapitre 10.4)
              </p>
            </div>
          </div>

          {/* Days Counter */}
          <div className="flex items-center gap-3 bg-[#0d1117] p-2.5 border border-[#c5a059]/50">
            <span className="text-xs font-cinzel uppercase tracking-wider text-[#dfba73]">Jours restants :</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onUpdateBoard({
                    ...board,
                    remainingDays: Math.max(0, board.remainingDays - 1),
                  })
                }
                className="w-7 h-7 bg-[#3b1d14] hover:bg-[#521111] border border-[#f97316]/50 font-mono font-bold text-[#fed7aa] flex items-center justify-center text-xs cursor-pointer transition-colors"
                title="Consommer 1 jour"
              >
                -1j
              </button>
              <span
                className={`text-lg font-mono font-bold px-3 py-0.5 border ${
                  board.remainingDays <= 1 ? 'bg-[#450a0a] text-[#fecaca] border-red-500 animate-pulse' : 'bg-[#161d26] text-[#dfba73] border-[#c5a059]/40'
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
                className="w-7 h-7 bg-[#1a232f] hover:bg-[#253243] border border-[#c5a059]/50 font-mono font-bold text-[#dfba73] flex items-center justify-center text-xs cursor-pointer transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Quick action time consumption */}
        <div className="bg-[#0d1117] p-3.5 border border-[#c5a059]/40">
          <span className="text-xs font-cinzel text-[#dfba73] font-bold block mb-2 uppercase tracking-wider">
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
                className="p-2.5 bg-[#161d26] hover:bg-[#1a232f] text-left border border-[#c5a059]/30 text-[#d1c7b7] transition-colors cursor-pointer group"
              >
                <div className="font-cinzel font-bold text-[#f4ecd8] group-hover:text-[#dfba73]">{act.label.split(':')[0]}</div>
                <div className="text-[#dfba73] font-mono mt-0.5">Coût : {act.days} journée(s)</div>
              </button>
            ))}
          </div>
        </div>

        {/* Facts & Hypotheses columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Faits établis */}
          <div className="bg-[#0d1117] p-4 border border-[#c5a059]/40 space-y-3">
            <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-2">
              <h4 className="text-sm font-cinzel font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                Faits établis (Vérifiés)
              </h4>
              <span className="text-[11px] text-[#a69d8d] font-mono">{board.facts.length} faits</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#f4ecd8] font-marcellus">
              {board.facts.map((fact, idx) => (
                <li key={idx} className="flex items-start justify-between gap-2 p-2 bg-[#161d26] border border-[#c5a059]/30">
                  <span>• {fact}</span>
                  <button
                    onClick={() =>
                      onUpdateBoard({
                        ...board,
                        facts: board.facts.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-[#a69d8d] hover:text-red-400 cursor-pointer font-bold"
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
                className="flex-1 px-2.5 py-1 text-xs bg-[#161d26] border border-[#c5a059]/40 text-[#f4ecd8] placeholder-[#a69d8d]/50 focus:outline-none focus:border-[#dfba73]"
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
                className="px-3 py-1 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] text-[#0d1117] font-bold text-xs cursor-pointer uppercase border border-[#f3e5ab]"
              >
                +
              </button>
            </div>
          </div>

          {/* Hypothèses */}
          <div className="bg-[#0d1117] p-4 border border-[#c5a059]/40 space-y-3">
            <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-2">
              <h4 className="text-sm font-cinzel font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Hypothèses de travail
              </h4>
              <span className="text-[11px] text-[#a69d8d] font-mono">{board.hypotheses.length} pistes</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#d1c7b7] font-marcellus italic">
              {board.hypotheses.map((hypo, idx) => (
                <li key={idx} className="flex items-start justify-between gap-2 p-2 bg-[#161d26] border border-[#c5a059]/30">
                  <span>? {hypo}</span>
                  <button
                    onClick={() =>
                      onUpdateBoard({
                        ...board,
                        hypotheses: board.hypotheses.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-[#a69d8d] hover:text-red-400 cursor-pointer font-bold"
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
                className="flex-1 px-2.5 py-1 text-xs bg-[#161d26] border border-[#c5a059]/40 text-[#f4ecd8] placeholder-[#a69d8d]/50 focus:outline-none focus:border-[#dfba73]"
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
                className="px-3 py-1 bg-[#1a232f] hover:bg-[#253243] text-[#dfba73] border border-[#c5a059]/50 font-bold text-xs cursor-pointer uppercase"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GESTION DES PNJ & OPPOSANTS */}
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] shadow-[0_0_25px_rgba(0,0,0,0.6)] p-6 space-y-6 text-[#f4ecd8] relative">
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        <div className="flex items-center justify-between border-b border-[#c5a059]/40 pb-3">
          <div>
            <h3 className="text-lg font-cinzel-deco font-bold text-gold-gradient flex items-center gap-2">
              <Users className="w-5 h-5 text-[#dfba73]" />
              Répertoire des PNJ & Opposants
            </h3>
            <p className="text-xs text-[#a69d8d] font-marcellus italic">
              « Tout le monde, dans ce jeu, tient sur une ligne. » (Chapitre 15)
            </p>
          </div>
        </div>

        {/* NPC List */}
        <div className="space-y-2.5">
          {npcs.map(npc => (
            <div
              key={npc.id}
              className="p-3 bg-[#0d1117] border border-[#c5a059]/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1">
                <div className="font-cinzel font-bold text-[#f4ecd8] text-sm">
                  {npc.name}
                </div>
                {npc.notes && (
                  <p className="text-[#a69d8d] italic text-[11px] font-marcellus mt-0.5">
                    {npc.notes}
                  </p>
                )}
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Attitude badge */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-cinzel text-[#a69d8d]">Attitude :</span>
                  <button
                    onClick={() => handleUpdateNpcAttitude(npc.id, -1)}
                    className="w-5 h-5 bg-[#161d26] border border-[#c5a059]/30 text-[#dfba73] font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span
                    className={`px-2 py-0.5 border font-mono font-bold ${
                      npc.attitude === -1
                        ? 'bg-[#3b1d14] text-[#fed7aa] border-[#f97316]/50'
                        : npc.attitude === 1
                        ? 'bg-[#132e20] text-[#bbf7d0] border-[#22c55e]/50'
                        : 'bg-[#161d26] text-[#dfba73] border-[#c5a059]/30'
                    }`}
                  >
                    {npc.attitude === -1 ? 'Hostile (-1)' : npc.attitude === 1 ? 'Loyal (+1)' : 'Neutre (0)'}
                  </span>
                  <button
                    onClick={() => handleUpdateNpcAttitude(npc.id, 1)}
                    className="w-5 h-5 bg-[#161d26] border border-[#c5a059]/30 text-[#dfba73] font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Physique if fighter */}
                {npc.hasPhysique && npc.physique !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase font-cinzel text-[#a69d8d]">Physique :</span>
                    <button
                      onClick={() => handleUpdateNpcPhysique(npc.id, -1)}
                      className="w-5 h-5 bg-[#161d26] border border-[#c5a059]/30 text-[#dfba73] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span
                      className={`px-2 py-0.5 border font-mono font-bold ${
                        npc.physique === 0
                          ? 'bg-red-700 text-white border-red-800'
                          : 'bg-[#1a232f] text-[#dfba73] border-[#c5a059]/40'
                      }`}
                    >
                      {npc.physique === 0 ? 'Hors de combat' : `Indice ${npc.physique}`}
                    </span>
                    <button
                      onClick={() => handleUpdateNpcPhysique(npc.id, 1)}
                      className="w-5 h-5 bg-[#161d26] border border-[#c5a059]/30 text-[#dfba73] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Weapon */}
                {npc.hasWeapon && npc.weapon && (
                  <span className="px-2 py-0.5 bg-[#161d26] border border-[#c5a059]/30 text-[#d1c7b7] font-mono">
                    Arme {WEAPONS[npc.weapon].name} ({WEAPONS[npc.weapon].damage})
                  </span>
                )}

                <button
                  onClick={() => handleDeleteNpc(npc.id)}
                  className="p-1 text-[#a69d8d] hover:text-red-400 transition-colors cursor-pointer"
                  title="Supprimer le PNJ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add NPC form */}
        <div className="p-4 bg-[#0d1117] border border-[#c5a059]/40 space-y-3">
          <span className="text-xs font-cinzel font-bold text-[#dfba73] uppercase tracking-wider block">
            + Ajouter un interlocuteur ou opposant
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={newNpcName}
              onChange={e => setNewNpcName(e.target.value)}
              placeholder="Nom / Fonction (ex: Témoin, Indic...)"
              className="px-2.5 py-1.5 text-xs bg-[#161d26] border border-[#c5a059]/40 text-[#f4ecd8] focus:outline-none focus:border-[#dfba73]"
            />
            <select
              value={newNpcAttitude}
              onChange={e => setNewNpcAttitude(Number(e.target.value) as -1 | 0 | 1)}
              className="px-2.5 py-1.5 text-xs bg-[#161d26] border border-[#c5a059]/40 text-[#dfba73] focus:outline-none"
            >
              <option value="-1" className="bg-[#121820]">Hostile (-1)</option>
              <option value="0" className="bg-[#121820]">Neutre (0)</option>
              <option value="1" className="bg-[#121820]">Loyal (+1)</option>
            </select>
            <input
              type="text"
              value={newNpcNotes}
              onChange={e => setNewNpcNotes(e.target.value)}
              placeholder="Note / Enjeu / Arme..."
              className="px-2.5 py-1.5 text-xs bg-[#161d26] border border-[#c5a059]/40 text-[#f4ecd8] focus:outline-none focus:border-[#dfba73]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 text-xs font-marcellus">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNpcHasPhysique}
                  onChange={e => setNewNpcHasPhysique(e.target.checked)}
                  className="rounded text-[#c5a059]"
                />
                <span>Indice Physique</span>
              </label>
              {newNpcHasPhysique && (
                <select
                  value={newNpcPhysique}
                  onChange={e => setNewNpcPhysique(Number(e.target.value))}
                  className="p-1 text-xs bg-[#161d26] border border-[#c5a059]/40 text-[#dfba73]"
                >
                  <option value="0" className="bg-[#121820]">0 (Figurant)</option>
                  <option value="1" className="bg-[#121820]">1 (Figurant / Sbire)</option>
                  <option value="2" className="bg-[#121820]">2 (Sbire)</option>
                  <option value="3" className="bg-[#121820]">3 (Sbire / Boss)</option>
                  <option value="4" className="bg-[#121820]">4 (Boss)</option>
                  <option value="5" className="bg-[#121820]">5 (Boss exceptionnel)</option>
                </select>
              )}

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNpcHasWeapon}
                  onChange={e => setNewNpcHasWeapon(e.target.checked)}
                  className="rounded text-[#c5a059]"
                />
                <span>Armé</span>
              </label>
              {newNpcHasWeapon && (
                <select
                  value={newNpcWeapon}
                  onChange={e => setNewNpcWeapon(e.target.value as WeaponCategory)}
                  className="p-1 text-xs bg-[#161d26] border border-[#c5a059]/40 text-[#dfba73]"
                >
                  <option value="legere" className="bg-[#121820]">Légère (1)</option>
                  <option value="moyenne" className="bg-[#121820]">Moyenne (2)</option>
                  <option value="lourde" className="bg-[#121820]">Lourde (3)</option>
                </select>
              )}
            </div>

            <button
              onClick={handleAddNPC}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] text-[#0d1117] text-xs font-cinzel font-bold uppercase tracking-wider cursor-pointer border border-[#f3e5ab]"
            >
              Enregistrer le PNJ
            </button>
          </div>
        </div>
      </div>

      {/* 3. ASSISTANT DE POURSUITE & COMPLICATIONS D8 */}
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] shadow-[0_0_25px_rgba(0,0,0,0.6)] p-6 space-y-4 text-[#f4ecd8] relative">
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c5a059]/40 pb-3">
          <div>
            <h3 className="text-lg font-cinzel-deco font-bold text-gold-gradient flex items-center gap-2">
              <Footprints className="w-5 h-5 text-emerald-400" />
              Assistant de Poursuite D8
            </h3>
            <p className="text-xs text-[#a69d8d] font-marcellus italic">
              Tirage des obstacles imprévus (Table D8 officielle - Chapitre 14.2)
            </p>
          </div>

          <button
            onClick={handleRollPursuitComplication}
            className="px-4 py-2 bg-[#1a232f] hover:bg-[#253243] text-[#dfba73] border border-[#c5a059]/60 font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            Tirer une complication D8
          </button>
        </div>

        {activeObstacle ? (
          <div className="p-4 bg-[#0d1117] border border-emerald-500/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel font-bold text-emerald-400 uppercase tracking-wider">
                Obstacle D8 = {activeObstacle.d8} : {activeObstacle.title}
              </span>
            </div>
            <p className="font-marcellus italic text-sm text-[#f4ecd8]">
              « {activeObstacle.desc} »
            </p>
          </div>
        ) : (
          <div className="p-3 bg-[#0d1117] border border-[#c5a059]/30 text-xs text-[#a69d8d] italic text-center font-marcellus">
            Cliquez sur « Tirer une complication D8 » pour générer un obstacle de parcours.
          </div>
        )}
      </div>

      {/* 4. JET SECRET DU MENEUR */}
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] shadow-[0_0_25px_rgba(0,0,0,0.6)] p-6 space-y-4 text-[#f4ecd8] relative">
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        <div className="flex items-center justify-between border-b border-[#c5a059]/40 pb-3">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-red-400" />
            <h3 className="font-cinzel font-bold text-base text-red-400 uppercase tracking-wider">
              Jet Secret du Meneur (Huis clos)
            </h3>
          </div>
          <span className="text-xs text-[#a69d8d] font-marcellus italic">
            Les joueurs recevront un avis confidentiel sans voir le score
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-cinzel text-[#dfba73] mb-1 uppercase tracking-wider">
              Intitulé de l'action secrète
            </label>
            <input
              type="text"
              value={secretActionName}
              onChange={e => setSecretActionName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#c5a059]/40 text-[#f4ecd8] focus:outline-none focus:border-[#dfba73]"
            />
          </div>
          <div>
            <label className="block text-xs font-cinzel text-[#dfba73] mb-1 uppercase tracking-wider">
              Modificateur total
            </label>
            <input
              type="number"
              value={secretModifier}
              onChange={e => setSecretModifier(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs bg-[#0d1117] border border-[#c5a059]/40 text-[#dfba73] font-mono focus:outline-none focus:border-[#dfba73]"
            />
          </div>
        </div>

        <button
          onClick={() => onGMSecretRoll(secretActionName, secretModifier)}
          className="w-full py-2.5 bg-[#3b1d14] hover:bg-[#521111] text-[#fed7aa] border border-[#f97316]/50 font-cinzel font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <EyeOff className="w-4 h-4" />
          Lancer le Dé Secret à Huis Clos
        </button>
      </div>

    </div>
  );
}
