import React, { useState } from 'react';
import { X, Users, Crown, Shield, Share2, Check, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7EE] border-4 border-[#5C3A1D] rounded-xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-[#2B231D] font-serif">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#78350F]/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#6B1717] text-amber-100 rounded shadow-sm">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-xl font-cinzel font-bold text-[#6B1717]">
                Membres de la Brigade
              </h3>
              <p className="text-xs text-stone-600">
                Table : <span className="font-bold text-[#78350F] font-mono">{roomId}</span>
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

        {/* PLAYERS LIST */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {players.map((p) => (
            <div
              key={p.peerId}
              className={`p-3 rounded border flex items-center justify-between transition-all ${
                p.isSelf
                  ? 'bg-amber-50/80 border-[#6B1717] shadow-xs'
                  : 'bg-white/80 border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold font-mono text-xs shadow-xs relative"
                  style={{ backgroundColor: p.color }}
                >
                  {p.role === 'gm' ? <Crown size={14} /> : p.name.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
                </div>
                <div>
                  <div className="font-cinzel font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                    <span>{p.name}</span>
                    {p.isSelf && (
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-sans">
                        Vous
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-600 italic">
                    {p.role === 'gm' ? 'Meneur de Jeu (MJ)' : 'Inspecteur de la Brigade'}
                  </div>
                </div>
              </div>

              {p.isSelf ? (
                <button
                  onClick={() => onUpdateRole(p.role === 'gm' ? 'player' : 'gm')}
                  className="px-2 py-1 text-[11px] font-cinzel font-bold border border-stone-400 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer transition-colors"
                  title="Basculer de rôle"
                >
                  Passer {p.role === 'gm' ? 'Joueur' : 'MJ'}
                </button>
              ) : (
                <span className="text-[11px] text-stone-500 font-mono">En direct</span>
              )}
            </div>
          ))}
        </div>

        {/* SHARE LINK BUTTON */}
        <div className="pt-2 border-t border-[#78350F]/20 flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 bg-[#6B1717] hover:bg-[#521111] text-white font-cinzel font-bold text-xs sm:text-sm uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'Lien copié dans le presse-papier !' : "Copier le Lien d'invitation"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
