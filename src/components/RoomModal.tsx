import React, { useState } from 'react';
import { X, Sparkles, LogIn, Crown, Shield, Dices, Check, Copy } from 'lucide-react';
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
  const [tab, setTab] = useState<'create' | 'join'>('create');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7EE] border-4 border-[#5C3A1D] rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-[#2B231D] max-h-[90vh] overflow-y-auto font-serif">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#78350F]/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#6B1717] text-amber-100 rounded shadow-sm">
              <Dices size={24} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#6B1717]">
                Table Multijoueur P2P
              </h3>
              <p className="text-xs italic text-stone-600">
                Connexion directe WebRTC sécurisée • Sans serveur externe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROFILE SECTION */}
        <div className="space-y-4 bg-white/70 p-4 border border-[#78350F]/20 rounded">
          <h4 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#78350F]">
            1. Fiche d'identification de l'agent
          </h4>

          {/* PSEUDO */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-stone-800 mb-1">
              Nom & Titre de l'Inspecteur :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ex: Inspecteur Valentin..."
                className="flex-1 bg-[#FAF7EE] border border-stone-400 px-3 py-1.5 text-xs sm:text-sm text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
              />
              <button
                type="button"
                onClick={handleRandomizeName}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-cinzel font-bold transition-colors cursor-pointer"
                title="Générer un nom aléatoire d'époque"
              >
                🎲 Aléatoire
              </button>
            </div>
          </div>

          {/* ROLE SELECTOR */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-stone-800 mb-1">
              Rôle à la Table :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoleInput('player')}
                className={`p-2.5 border text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  roleInput === 'player'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-[#FAF7EE] text-stone-700 border-stone-300 hover:border-stone-500'
                }`}
              >
                <Shield size={16} />
                <span>Inspecteur (Joueur)</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleInput('gm')}
                className={`p-2.5 border text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  roleInput === 'gm'
                    ? 'bg-[#6B1717] text-white border-[#6B1717] shadow-xs'
                    : 'bg-[#FAF7EE] text-stone-700 border-stone-300 hover:border-stone-500'
                }`}
              >
                <Crown size={16} />
                <span>Meneur de Jeu (MJ)</span>
              </button>
            </div>
          </div>

          {/* COLOR SELECTOR */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-stone-800 mb-1.5">
              Sceau & Couleur d'archivage :
            </label>
            <div className="flex flex-wrap gap-2">
              {PLAYER_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColorInput(c.hex)}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center cursor-pointer ${
                    colorInput === c.hex
                      ? 'scale-110 ring-2 ring-[#5C3A1D] ring-offset-2'
                      : 'hover:scale-105 opacity-80'
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
          <div className="flex border-b border-[#78350F]/30">
            <button
              onClick={() => setTab('create')}
              className={`flex-1 py-2 font-cinzel font-bold text-xs sm:text-sm border-b-2 -mb-[1px] transition-colors cursor-pointer ${
                tab === 'create'
                  ? 'border-[#6B1717] text-[#6B1717]'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              Créer une Brigade / Salle
            </button>
            <button
              onClick={() => setTab('join')}
              className={`flex-1 py-2 font-cinzel font-bold text-xs sm:text-sm border-b-2 -mb-[1px] transition-colors cursor-pointer ${
                tab === 'join'
                  ? 'border-[#6B1717] text-[#6B1717]'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              Rejoindre une Table existante
            </button>
          </div>

          {tab === 'create' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-cinzel font-bold text-stone-800 mb-1">
                  Nom ou Code de la Brigade :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedRoom}
                    onChange={(e) => setGeneratedRoom(e.target.value)}
                    className="flex-1 bg-[#FAF7EE] border border-stone-400 px-3 py-2 text-xs sm:text-sm font-mono text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                  />
                  <button
                    type="button"
                    onClick={handleRandomizeRoom}
                    className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-cinzel font-bold transition-colors cursor-pointer"
                  >
                    🎲 Changer
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApplyProfileAndJoin(generatedRoom)}
                disabled={!generatedRoom.trim()}
                className="w-full py-3 bg-[#6B1717] hover:bg-[#521111] text-white font-cinzel font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Sparkles size={18} />
                Ouvrir la Table de la Brigade
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-cinzel font-bold text-stone-800 mb-1">
                  Entrez le code ou collez le lien de la table :
                </label>
                <input
                  type="text"
                  value={targetRoomInput}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.includes('#/room/')) {
                      val = val.split('#/room/')[1]?.split('?')[0] || val;
                    }
                    setTargetRoomInput(val);
                  }}
                  placeholder="Ex: brigade-paris-42 ou lien partagé"
                  className="w-full bg-[#FAF7EE] border border-stone-400 px-3 py-2 text-xs sm:text-sm font-mono text-stone-900 rounded-none focus:outline-none focus:border-[#6B1717]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleApplyProfileAndJoin(targetRoomInput)}
                disabled={!targetRoomInput.trim()}
                className="w-full py-3 bg-[#6B1717] hover:bg-[#521111] text-white font-cinzel font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <LogIn size={18} />
                Rejoindre la Brigade en Direct
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
