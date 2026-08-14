import React, { useState } from 'react';
import { Users, Check, LogOut, Shield, Crown, Sparkles, Share2, Calendar, BookOpen, Award } from 'lucide-react';
import { PlayerRole, RoomPlayer } from '../types';

interface MultiplayerBarProps {
  roomId: string | null;
  isConnected: boolean;
  players: RoomPlayer[];
  profile: { name: string; role: PlayerRole; color: string };
  onOpenRoomModal: () => void;
  onOpenPlayersModal: () => void;
  onLeaveRoom: () => void;
  onUpdateRole: (role: PlayerRole) => void;
  onOpenRulesModal: () => void;
  onOpenEndOfCaseModal: () => void;
  onOpenBoardModal: () => void;
}

export const MultiplayerBar: React.FC<MultiplayerBarProps> = ({
  roomId,
  isConnected,
  players,
  profile,
  onOpenRoomModal,
  onOpenPlayersModal,
  onLeaveRoom,
  onUpdateRole,
  onOpenRulesModal,
  onOpenEndOfCaseModal,
  onOpenBoardModal,
}) => {
  const [copied, setCopied] = useState(false);

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
        prompt('Copiez ce lien pour inviter la brigade :', url);
      });
  };

  return (
    <div className="bg-[#F4EFE6] dark:bg-stone-900 border-2 border-[#78350f]/30 dark:border-stone-700 rounded-xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
      {/* Left section: connection status or connect button */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-900 dark:bg-amber-800 text-amber-100 flex items-center justify-center font-cinzel font-bold shadow-sm">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-xs text-[#78350f] dark:text-amber-400 uppercase tracking-wider">
              {isConnected && roomId ? `Table active : ${roomId}` : 'Table Locale / Solo'}
            </span>
            {isConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 font-serif">
            <span
              className="w-2.5 h-2.5 rounded-full border border-stone-500 inline-block"
              style={{ backgroundColor: profile.color }}
            />
            <span className="font-semibold">{profile.name}</span>
            <span className="text-[11px] opacity-75">
              ({profile.role === 'gm' ? 'Meneur de Jeu' : 'Inspecteur'})
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Rules button */}
        <button
          onClick={onOpenRulesModal}
          className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 transition-colors border border-stone-300 dark:border-stone-600 shadow-xs"
          title="Consulter les règles et tables de jeu"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
          <span>Règles D8</span>
        </button>

        {/* Board button */}
        <button
          onClick={onOpenBoardModal}
          className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 transition-colors border border-stone-300 dark:border-stone-600 shadow-xs"
          title="Voir le Tableau de la Brigade (Faits & Délais)"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-800 dark:text-blue-400" />
          <span>Ardoise</span>
        </button>

        {/* End of Case button */}
        <button
          onClick={onOpenEndOfCaseModal}
          className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 transition-colors border border-amber-300 dark:border-amber-800 shadow-xs"
          title="Calculer l'expérience (2-5 XP) et la convalescence"
        >
          <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>Fin d'Affaire (XP)</span>
        </button>

        {/* Role toggle */}
        <button
          onClick={() => onUpdateRole(profile.role === 'gm' ? 'player' : 'gm')}
          className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg text-xs font-cinzel font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 transition-colors shadow-xs"
          title="Changer de vue (Inspecteur / Meneur de Jeu)"
        >
          {profile.role === 'gm' ? (
            <Crown className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>{profile.role === 'gm' ? 'Vue MJ' : 'Vue Inspecteur'}</span>
        </button>

        {/* Join / Invite / Leave */}
        {isConnected && roomId ? (
          <>
            <button
              onClick={onOpenPlayersModal}
              className="px-2.5 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-xs font-mono font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{players.length}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Inviter'}</span>
            </button>

            <button
              onClick={onLeaveRoom}
              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-950 rounded-lg border border-red-200 dark:border-red-900 transition-colors"
              title="Quitter la table multijoueur"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={onOpenRoomModal}
            className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Rejoindre une Table P2P</span>
          </button>
        )}
      </div>
    </div>
  );
};
