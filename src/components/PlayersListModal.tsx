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
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      prompt('Copiez ce lien pour inviter vos amis :', url);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFCF0] dark:bg-slate-900 border-4 border-[#4B3B36] dark:border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#4B3B36] dark:text-slate-100">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#4B3B36]/20 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black font-serif">Joueurs à la Table</h3>
              <p className="text-xs font-mono text-[#4B3B36]/70 dark:text-slate-400">
                Salle : <span className="font-bold text-emerald-700 dark:text-emerald-400">{roomId}</span>
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

        {/* PLAYERS LIST */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {players.map(p => (
            <div
              key={p.peerId}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                p.isSelf
                  ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-500/50 shadow-sm'
                  : 'bg-white dark:bg-slate-800/60 border-[#4B3B36]/10 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold font-mono text-sm shadow-sm relative"
                  style={{ backgroundColor: p.color }}
                >
                  {p.role === 'gm' ? <Crown size={18} /> : p.name.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5 font-mono">
                    <span>{p.name}</span>
                    {p.isSelf && (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                        Vous
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono opacity-70 flex items-center gap-1 mt-0.5">
                    {p.role === 'gm' ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <Crown size={12} /> Maître du Jeu
                      </span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                        <Shield size={12} /> Joueur
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {p.isSelf && (
                <button
                  onClick={() => onUpdateRole(currentProfile.role === 'gm' ? 'player' : 'gm')}
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-[#4B3B36]/20 dark:border-slate-600 hover:bg-black/5 dark:hover:bg-slate-700 transition-colors"
                  title="Changer mon rôle"
                >
                  Changer rôle
                </button>
              )}
            </div>
          ))}
        </div>

        {/* INVITE BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleCopyLink}
            className={`w-full py-3.5 rounded-2xl font-mono font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all shadow-md active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-800 border-[#4B3B36]/20 dark:border-slate-700 text-[#4B3B36] dark:text-slate-100 hover:border-emerald-600'
            }`}
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            <span>{copied ? 'Lien d\'invitation copié !' : 'Copier le lien d\'invitation'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
