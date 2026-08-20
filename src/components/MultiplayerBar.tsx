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
    <div className="bg-[#121820] text-[#f4ecd8] border-2 border-[#c5a059] p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 relative">
      {/* Art Deco geometric corners */}
      <div className="artdeco-corner-tl" />
      <div className="artdeco-corner-tr" />
      <div className="artdeco-corner-bl" />
      <div className="artdeco-corner-br" />

      {/* Left section: connection status & user profile */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-[#c5a059] bg-[#1a232f] text-[#dfba73] flex items-center justify-center font-cinzel font-bold shadow-inner">
          <Users className="w-5 h-5 text-[#c5a059]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel-deco font-bold text-xs text-[#dfba73] uppercase tracking-widest">
              {isConnected && roomId ? `Table Active : ${roomId}` : 'Table Locale / Solo'}
            </span>
            {isConnected && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-200 animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#d1c7b7] font-marcellus">
            <span
              className="w-3 h-3 rounded-full border border-[#c5a059] inline-block shadow-xs"
              style={{ backgroundColor: profile.color }}
            />
            <span className="font-semibold text-[#f4ecd8]">{profile.name}</span>
            <span className="text-[11px] text-[#a69d8d]">
              ({profile.role === 'gm' ? 'Meneur de Jeu' : 'Inspecteur de la Sûreté'})
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons with Art Deco styling */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Rules button */}
        <button
          onClick={onOpenRulesModal}
          className="px-3 py-1.5 bg-[#1a232f] hover:bg-[#253243] text-[#f4ecd8] border border-[#c5a059]/60 hover:border-[#dfba73] text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          title="Consulter les règles et tables de jeu"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#dfba73]" />
          <span>Règles D8</span>
        </button>

        {/* Board button */}
        <button
          onClick={onOpenBoardModal}
          className="px-3 py-1.5 bg-[#1a232f] hover:bg-[#253243] text-[#f4ecd8] border border-[#c5a059]/60 hover:border-[#dfba73] text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          title="Voir le Tableau de la Brigade (Faits & Délais)"
        >
          <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Ardoise</span>
        </button>

        {/* End of Case button */}
        <button
          onClick={onOpenEndOfCaseModal}
          className="px-3 py-1.5 bg-[#251f16] hover:bg-[#382e1e] text-[#f8e3a1] border border-[#c5a059] text-xs font-cinzel font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          title="Calculer l'expérience (2-5 XP) et la convalescence"
        >
          <Award className="w-3.5 h-3.5 text-[#dfba73]" />
          <span>Fin d'Affaire (XP)</span>
        </button>

        {/* Role toggle */}
        <button
          onClick={() => onUpdateRole(profile.role === 'gm' ? 'player' : 'gm')}
          className="px-3 py-1.5 bg-[#161d26] hover:bg-[#202a37] border border-[#c5a059]/70 text-xs font-cinzel font-semibold tracking-wider text-[#e6decb] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          title="Changer de vue (Inspecteur / Meneur de Jeu)"
        >
          {profile.role === 'gm' ? (
            <Crown className="w-3.5 h-3.5 text-[#dfba73]" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
          )}
          <span>{profile.role === 'gm' ? 'Vue MJ' : 'Vue Inspecteur'}</span>
        </button>

        {/* Join / Invite / Leave */}
        {isConnected && roomId ? (
          <>
            <button
              onClick={onOpenPlayersModal}
              className="px-2.5 py-1.5 bg-[#1a232f] border border-[#c5a059]/60 text-xs font-mono font-bold text-[#dfba73] flex items-center gap-1 cursor-pointer"
              title="Inspecteurs connectés"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{players.length}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-[#1a4430] hover:bg-[#23583f] text-[#bbf7d0] border border-[#4ade80]/50 text-xs font-cinzel font-bold tracking-wider flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Inviter'}</span>
            </button>

            <button
              onClick={onLeaveRoom}
              className="p-1.5 text-red-300 hover:bg-red-950/80 border border-red-800/80 transition-colors cursor-pointer"
              title="Quitter la table multijoueur"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={onOpenRoomModal}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] hover:brightness-110 text-[#0d1117] text-xs font-cinzel font-bold tracking-widest flex items-center gap-1.5 shadow-md border border-[#f3e5ab] transition-transform active:scale-95 cursor-pointer uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#121820]" />
            <span>Rejoindre une Table</span>
          </button>
        )}
      </div>
    </div>
  );
};
