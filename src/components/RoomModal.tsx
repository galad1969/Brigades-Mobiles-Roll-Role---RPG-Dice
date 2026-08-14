import React, { useState } from 'react';
import { X, Sparkles, LogIn, Crown, Shield, Dice5, Check } from 'lucide-react';
import { PlayerRole } from '../types';
import { PLAYER_COLORS, generateRandomPlayerName, generateRandomRoomId } from '../utils/playerPresets';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomId: string | null;
  profile: { name: string; role: PlayerRole; color: string };
  onUpdateProfile: (updates: Partial<{ name: string; role: PlayerRole; color: string }>) => void;
  onJoinRoom: (roomId: string) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  currentRoomId,
  profile,
  onUpdateProfile,
  onJoinRoom,
}) => {
  const [tab, setTab] = useState<'join' | 'create'>('create');
  const [targetRoomInput, setTargetRoomInput] = useState('');
  const [generatedRoom, setGeneratedRoom] = useState(generateRandomRoomId);

  const [nameInput, setNameInput] = useState(profile.name);
  const [roleInput, setRoleInput] = useState<PlayerRole>(profile.role);
  const [colorInput, setColorInput] = useState(profile.color);

  if (!isOpen) return null;

  const handleApplyProfileAndJoin = (roomIdToJoin: string) => {
    const finalName = nameInput.trim() || generateRandomPlayerName();
    onUpdateProfile({
      name: finalName,
      role: roleInput,
      color: colorInput,
    });
    onJoinRoom(roomIdToJoin);
    onClose();
  };

  const handleRandomizeName = () => {
    setNameInput(generateRandomPlayerName());
  };

  const handleRandomizeRoom = () => {
    setGeneratedRoom(generateRandomRoomId());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#4B3B36] dark:border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#4B3B36] dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#4B3B36]/20 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
              <Dice5 size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black font-serif">Table Multijoueur</h3>
              <p className="text-xs font-mono text-[#4B3B36]/70 dark:text-slate-400">
                P2P en direct • Aucun compte requis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROFILE SECTION */}
        <div className="space-y-4 bg-white dark:bg-slate-800/80 p-5 rounded-2xl border-2 border-[#4B3B36]/10 dark:border-slate-700 shadow-sm">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            1. Votre Profil de Table
          </h4>

          {/* PSEUDO */}
          <div>
            <label className="block text-xs font-mono font-bold mb-1 opacity-80">Votre Pseudo :</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Ex: Gandalf, Thorin..."
                className="flex-1 bg-[#FDFCF0] dark:bg-slate-900 border-2 border-[#4B3B36]/30 dark:border-slate-600 rounded-xl px-3.5 py-2 font-mono font-bold text-sm outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleRandomizeName}
                className="px-3 py-2 bg-black/5 dark:bg-slate-700 hover:bg-black/10 rounded-xl text-xs font-mono font-bold transition-colors"
                title="Nom aléatoire"
              >
                🎲 Aléatoire
              </button>
            </div>
          </div>

          {/* ROLE SELECTOR */}
          <div>
            <label className="block text-xs font-mono font-bold mb-1.5 opacity-80">Votre Rôle :</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoleInput('player')}
                className={`p-3 rounded-xl border-2 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  roleInput === 'player'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-[#FDFCF0] dark:bg-slate-900 border-[#4B3B36]/20 dark:border-slate-700 hover:border-blue-500'
                }`}
              >
                <Shield size={16} />
                <span>Joueur 🛡️</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleInput('gm')}
                className={`p-3 rounded-xl border-2 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  roleInput === 'gm'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-[#FDFCF0] dark:bg-slate-900 border-[#4B3B36]/20 dark:border-slate-700 hover:border-amber-500'
                }`}
              >
                <Crown size={16} />
                <span>Maître du Jeu (MJ) 🧙‍♂️</span>
              </button>
            </div>
          </div>

          {/* COLOR SELECTOR */}
          <div>
            <label className="block text-xs font-mono font-bold mb-1.5 opacity-80">Couleur d'avatar :</label>
            <div className="flex flex-wrap gap-2">
              {PLAYER_COLORS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColorInput(c.hex)}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                    colorInput === c.hex ? 'scale-125 ring-2 ring-[#4B3B36] dark:ring-white ring-offset-2' : 'hover:scale-110 opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {colorInput === c.hex && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABS: CREATE / JOIN */}
        <div className="space-y-4">
          <div className="flex border-b-2 border-[#4B3B36]/20 dark:border-slate-800">
            <button
              onClick={() => setTab('create')}
              className={`flex-1 py-2.5 font-mono font-black text-sm border-b-4 -mb-[2px] transition-colors ${
                tab === 'create'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              Créer une Salle
            </button>
            <button
              onClick={() => setTab('join')}
              className={`flex-1 py-2.5 font-mono font-black text-sm border-b-4 -mb-[2px] transition-colors ${
                tab === 'join'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              Rejoindre une Salle
            </button>
          </div>

          {tab === 'create' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold mb-1 opacity-80">
                  Nom ou Code de la Salle :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedRoom}
                    onChange={e => setGeneratedRoom(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-800 border-2 border-[#4B3B36]/30 dark:border-slate-600 rounded-xl px-3.5 py-2.5 font-mono font-bold text-sm outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleRandomizeRoom}
                    className="px-3 py-2.5 bg-black/5 dark:bg-slate-800 hover:bg-black/10 border-2 border-[#4B3B36]/20 dark:border-slate-700 rounded-xl text-xs font-mono font-bold transition-colors"
                  >
                    🎲 Changer
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApplyProfileAndJoin(generatedRoom)}
                disabled={!generatedRoom.trim()}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base uppercase rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 font-mono"
              >
                <Sparkles size={20} />
                Lancer la Table
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold mb-1 opacity-80">
                  Entrez le code ou collez le lien de la salle :
                </label>
                <input
                  type="text"
                  value={targetRoomInput}
                  onChange={e => {
                    let val = e.target.value;
                    if (val.includes('#/room/')) {
                      val = val.split('#/room/')[1]?.split('?')[0] || val;
                    }
                    setTargetRoomInput(val);
                  }}
                  placeholder="Ex: donjon-ombre-102 ou lien partagé"
                  className="w-full bg-white dark:bg-slate-800 border-2 border-[#4B3B36]/30 dark:border-slate-600 rounded-xl px-3.5 py-2.5 font-mono font-bold text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="button"
                onClick={() => handleApplyProfileAndJoin(targetRoomInput)}
                disabled={!targetRoomInput.trim()}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base uppercase rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 font-mono"
              >
                <LogIn size={20} />
                Rejoindre la Table
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
