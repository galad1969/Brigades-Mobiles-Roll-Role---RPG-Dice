import React, { useState } from 'react';
import { X, Sparkles, LogIn, Crown, Shield, Dices, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] max-w-lg w-full p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-5 text-[#f4ecd8] max-h-[90vh] overflow-y-auto font-serif relative">
        
        {/* CORNERS */}
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1a232f] border border-[#dfba73] text-[#dfba73] shadow-xs">
              <Dices size={24} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-cinzel-deco font-bold text-gold-gradient">
                Table Multijoueur P2P
              </h3>
              <p className="text-xs text-[#a69d8d] font-marcellus">
                Connexion directe WebRTC chiffrée • 1910 Sûreté Nationale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1a232f] text-[#dfba73] border border-transparent hover:border-[#c5a059]/50 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROFILE SECTION */}
        <div className="space-y-4 bg-[#0d1117] p-4 border border-[#c5a059]/40 relative">
          <h4 className="text-xs font-cinzel font-bold uppercase tracking-widest text-[#dfba73]">
            ★ 1. Fiche d'identification de l'agent ★
          </h4>

          {/* PSEUDO */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-[#d1c7b7] mb-1 tracking-wider uppercase">
              Nom & Titre de l'Inspecteur :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ex: Inspecteur Valentin..."
                className="flex-1 bg-[#161d26] border border-[#c5a059]/50 px-3 py-1.5 text-xs sm:text-sm text-[#f4ecd8] focus:outline-none focus:border-[#dfba73] font-marcellus"
              />
              <button
                type="button"
                onClick={handleRandomizeName}
                className="px-3 py-1.5 bg-[#1a232f] hover:bg-[#253243] text-[#dfba73] border border-[#c5a059]/50 text-xs font-cinzel font-bold transition-colors cursor-pointer uppercase tracking-wider"
                title="Générer un nom aléatoire d'époque"
              >
                🎲 Aléatoire
              </button>
            </div>
          </div>

          {/* ROLE SELECTOR */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-[#d1c7b7] mb-1 tracking-wider uppercase">
              Rôle à la Table :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoleInput('player')}
                className={`p-2.5 border text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-all cursor-pointer tracking-wider ${
                  roleInput === 'player'
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#172554] text-[#93c5fd] border-[#60a5fa] shadow-[0_0_10px_rgba(96,165,250,0.3)]'
                    : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]'
                }`}
              >
                <Shield size={16} />
                <span>Inspecteur (Joueur)</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleInput('gm')}
                className={`p-2.5 border text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-all cursor-pointer tracking-wider ${
                  roleInput === 'gm'
                    ? 'bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] text-[#0d1117] border-[#f3e5ab] shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                    : 'bg-[#161d26] text-[#a69d8d] border-[#c5a059]/30 hover:border-[#c5a059]'
                }`}
              >
                <Crown size={16} />
                <span>Meneur de Jeu (MJ)</span>
              </button>
            </div>
          </div>

          {/* COLOR SELECTOR */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-[#d1c7b7] mb-1.5 tracking-wider uppercase">
              Sceau & Couleur d'archivage :
            </label>
            <div className="flex flex-wrap gap-2">
              {PLAYER_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColorInput(c.hex)}
                  className={`w-7 h-7 border border-[#c5a059]/60 transition-transform flex items-center justify-center cursor-pointer ${
                    colorInput === c.hex
                      ? 'scale-110 ring-2 ring-[#dfba73] ring-offset-2 ring-offset-[#0d1117]'
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
          <div className="flex border-b border-[#c5a059]/40">
            <button
              onClick={() => setTab('create')}
              className={`flex-1 py-2 font-cinzel font-bold text-xs sm:text-sm border-b-2 -mb-[1px] transition-colors cursor-pointer uppercase tracking-wider ${
                tab === 'create'
                  ? 'border-[#dfba73] text-[#dfba73]'
                  : 'border-transparent text-[#a69d8d] hover:text-[#f4ecd8]'
              }`}
            >
              Créer une Brigade
            </button>
            <button
              onClick={() => setTab('join')}
              className={`flex-1 py-2 font-cinzel font-bold text-xs sm:text-sm border-b-2 -mb-[1px] transition-colors cursor-pointer uppercase tracking-wider ${
                tab === 'join'
                  ? 'border-[#dfba73] text-[#dfba73]'
                  : 'border-transparent text-[#a69d8d] hover:text-[#f4ecd8]'
              }`}
            >
              Rejoindre une Table
            </button>
          </div>

          {tab === 'create' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-cinzel font-bold text-[#d1c7b7] mb-1 tracking-wider uppercase">
                  Nom ou Code de la Brigade :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedRoom}
                    onChange={(e) => setGeneratedRoom(e.target.value)}
                    className="flex-1 bg-[#161d26] border border-[#c5a059]/50 px-3 py-2 text-xs sm:text-sm font-mono text-[#dfba73] focus:outline-none focus:border-[#dfba73]"
                  />
                  <button
                    type="button"
                    onClick={handleRandomizeRoom}
                    className="px-3 py-2 bg-[#1a232f] hover:bg-[#253243] text-[#dfba73] border border-[#c5a059]/50 text-xs font-cinzel font-bold transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    🎲 Changer
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApplyProfileAndJoin(generatedRoom)}
                disabled={!generatedRoom.trim()}
                className="w-full py-3 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] hover:brightness-110 text-[#0d1117] font-cinzel font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer border border-[#f3e5ab]"
              >
                <Sparkles size={18} />
                Ouvrir la Table de la Brigade
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-cinzel font-bold text-[#d1c7b7] mb-1 tracking-wider uppercase">
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
                  className="w-full bg-[#161d26] border border-[#c5a059]/50 px-3 py-2 text-xs sm:text-sm font-mono text-[#dfba73] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleApplyProfileAndJoin(targetRoomInput)}
                disabled={!targetRoomInput.trim()}
                className="w-full py-3 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] hover:brightness-110 text-[#0d1117] font-cinzel font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer border border-[#f3e5ab]"
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
