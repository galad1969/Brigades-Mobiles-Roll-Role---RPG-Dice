import React, { useState } from 'react';
import { X, Users, Crown, Shield, Share2, Check } from 'lucide-react';
import { RoomPlayer, PlayerRole } from '../types';

interface PlayersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: RoomPlayer[];
  roomId: string | null;
  currentProfile: { name: string; role: PlayerRole; color: string };
  onUpdateRole: (role: PlayerRole) => void;
}

export const PlayersListModal: React.FC<PlayersListModalProps> = ({
  isOpen,
  onClose,
  players,
  roomId,
  currentProfile,
  onUpdateRole,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!roomId) return;
    const url = `${window.location.origin}${window.location.pathname}#/room/${encodeURIComponent(roomId)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        prompt('Copiez ce lien pour inviter vos collègues :', url);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] max-w-md w-full p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-5 text-[#f4ecd8] font-serif relative">
        
        {/* CORNERS */}
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1a232f] light:bg-[#f2e7d3] border border-[#dfba73] light:border-[#8c6010] text-[#dfba73] light:text-[#523400] shadow-xs">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-xl font-cinzel-deco font-bold text-gold-gradient">
                Membres de la Brigade
              </h3>
              <p className="text-xs text-[#a69d8d] font-marcellus">
                Table : <span className="font-bold text-[#dfba73] font-mono">{roomId}</span>
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

        {/* PLAYERS LIST */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {players.map((p) => (
            <div
              key={p.peerId}
              className={`p-3 border flex items-center justify-between transition-all rounded-md ${
                p.isSelf
                  ? 'bg-[#1a232f] border-[#dfba73] shadow-xs'
                  : 'bg-[#0d1117] border-[#c5a059]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 border-2 border-[#c5a059] bg-[#121820] rounded flex items-center justify-center text-[#dfba73] font-bold font-cinzel text-xs relative shrink-0"
                  style={{ borderColor: p.color || '#c5a059' }}
                >
                  {p.role === 'gm' ? <Crown size={14} className="text-[#dfba73]" /> : p.name.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border border-[#121820] rounded-full" />
                </div>
                <div>
                  <div className="font-cinzel font-bold text-xs sm:text-sm text-[#f4ecd8] flex items-center gap-2">
                    <span>{p.name}</span>
                    {p.isSelf && (
                      <span className="text-[10px] bg-[#121820] text-[#dfba73] border border-[#c5a059]/60 px-1.5 py-0.5 uppercase font-mono font-bold tracking-wider rounded">
                        Vous
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#a69d8d] font-marcellus">
                    {p.role === 'gm' ? 'Meneur de Jeu (MJ)' : 'Inspecteur de la Sûreté'}
                  </div>
                </div>
              </div>

              {p.isSelf ? (
                <button
                  onClick={() => onUpdateRole(p.role === 'gm' ? 'player' : 'gm')}
                  className="px-2.5 py-1.5 text-[11px] font-cinzel font-bold border border-[#c5a059]/60 bg-[#161d26] hover:bg-[#253243] text-[#dfba73] cursor-pointer transition-colors uppercase tracking-wider rounded shadow-xs"
                  title="Basculer de rôle"
                >
                  Passer {p.role === 'gm' ? 'Joueur' : 'MJ'}
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 font-mono font-bold">En direct</span>
              )}
            </div>
          ))}
        </div>

        {/* SHARE LINK BUTTON */}
        <div className="pt-2 border-t border-[#c5a059]/40 flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] hover:brightness-110 text-[#0d1117] font-cinzel font-bold text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer border border-[#f3e5ab] rounded"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'Lien copié dans le presse-papier !' : "Copier le Lien d'invitation"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
