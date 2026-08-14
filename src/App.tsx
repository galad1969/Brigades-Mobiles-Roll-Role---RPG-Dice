/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useBrigadesRoller } from './hooks/useBrigadesRoller';
import { useMultiplayerRoom } from './hooks/useMultiplayerRoom';
import { PlayerRole, BrigadeBoard } from './types';
import { MultiplayerBar } from './components/MultiplayerBar';
import { RoomModal } from './components/RoomModal';
import { PlayersListModal } from './components/PlayersListModal';
import { RollResultCard } from './components/RollResultCard';
import { DiceRollerPanel } from './components/DiceRollerPanel';
import { GMPanel } from './components/GMPanel';
import { RulesReferenceModal } from './components/RulesReferenceModal';
import { EndOfCaseModal } from './components/EndOfCaseModal';
import { BrigadeBoardModal } from './components/BrigadeBoardModal';
import {
  Sun,
  Moon,
  History,
  RotateCcw,
  Shield,
  Crown,
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  Scroll,
  Dices,
} from 'lucide-react';

export default function App() {
  const roller = useBrigadesRoller();

  const getHistoryForSync = useCallback(() => roller.history, [roller.history]);
  const getBoardForSync = useCallback(() => roller.board, [roller.board]);

  const {
    profile,
    updateProfile,
    roomId,
    isConnected,
    players,
    joinRoom,
    leaveRoom,
    broadcastRoll,
    broadcastBoard,
  } = useMultiplayerRoom(roller.addRemoteRoll, getHistoryForSync, getBoardForSync);

  // UI state
  const [currentView, setCurrentView] = useState<'roller' | 'gm'>('roller');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isEndOfCaseModalOpen, setIsEndOfCaseModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  // Sync board updates with multiplayer
  const handleUpdateBoard = (newBoard: BrigadeBoard) => {
    roller.updateBoard(newBoard);
    if (isConnected) {
      broadcastBoard(newBoard);
    }
  };

  // Sync role switch
  const handleUpdateRole = (role: PlayerRole) => {
    updateProfile({ role });
    if (role === 'gm') {
      setCurrentView('gm');
    }
  };

  // Listen to URL hash change for direct room join links (e.g. #/room/brigade-14)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/room/')) {
        const targetRoom = decodeURIComponent(hash.replace('#/room/', '').split('?')[0]);
        if (targetRoom && targetRoom !== roomId) {
          joinRoom(targetRoom);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [joinRoom, roomId]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  // Handle dice rolling
  const handleRoll = () => {
    const rollAuthor = {
      name: profile.name,
      role: profile.role,
      color: profile.color,
    };

    const rollResult = roller.executeRoll(rollAuthor);
    if (rollResult && isConnected) {
      broadcastRoll(rollResult);
    }
  };

  // Handle GM Secret roll
  const handleGMSecretRoll = (actionName: string, modifier: number) => {
    const rollAuthor = {
      name: profile.name,
      role: 'gm' as PlayerRole,
      color: profile.color,
    };

    const rollResult = roller.executeGMSecretRoll(actionName, modifier, rollAuthor);
    if (rollResult && isConnected) {
      broadcastRoll(rollResult);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans overflow-x-hidden transition-colors antialiased">
      
      {/* THEME TOGGLE */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 bg-white/80 dark:bg-stone-800/80 backdrop-blur rounded-full border-2 border-[#78350f] dark:border-stone-700 hover:scale-110 transition-transform shadow-md"
          title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#78350f]" />}
        </button>
      </div>

      {/* HEADER / BANNER */}
      <header className="pt-8 pb-4 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <div className="border-b-4 border-[#78350f] dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-[#78350f] text-[#FDFCF0] text-[11px] font-cinzel font-bold tracking-widest uppercase rounded">
                Système Officiel D8
              </span>
              <span className="text-xs font-serif text-stone-600 dark:text-stone-400 italic">
                République Française • Ministère de l'Intérieur
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-cinzel font-black tracking-tight text-[#78350f] dark:text-amber-400 leading-none">
              BRIGADES MOBILES 1910
            </h1>
            <p className="mt-2 font-serif text-sm sm:text-base text-stone-700 dark:text-stone-300 max-w-2xl">
              Lanceur d'actions avec planchers garantis, gestion de l'Ardoise, délais d'enquête et résolution P2P en temps réel.
            </p>
          </div>

          {/* VIEW SELECTOR BUTTONS */}
          <div className="flex items-center gap-2 bg-stone-200/80 dark:bg-stone-900 p-1.5 rounded-xl border border-stone-300 dark:border-stone-700">
            <button
              onClick={() => setCurrentView('roller')}
              className={`px-4 py-2 rounded-lg text-xs font-cinzel font-bold flex items-center gap-2 transition-all ${
                currentView === 'roller'
                  ? 'bg-[#78350f] text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Panneau Inspecteur</span>
            </button>
            <button
              onClick={() => setCurrentView('gm')}
              className={`px-4 py-2 rounded-lg text-xs font-cinzel font-bold flex items-center gap-2 transition-all ${
                currentView === 'gm'
                  ? 'bg-red-950 text-amber-300 shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Panneau Meneur (MJ)</span>
            </button>
          </div>
        </div>

        {/* MULTIPLAYER / STATUS BAR */}
        <MultiplayerBar
          roomId={roomId}
          isConnected={isConnected}
          players={players}
          profile={profile}
          onOpenRoomModal={() => setIsRoomModalOpen(true)}
          onOpenPlayersModal={() => setIsPlayersModalOpen(true)}
          onLeaveRoom={leaveRoom}
          onUpdateRole={handleUpdateRole}
          onOpenRulesModal={() => setIsRulesModalOpen(true)}
          onOpenEndOfCaseModal={() => setIsEndOfCaseModalOpen(true)}
          onOpenBoardModal={() => setIsBoardModalOpen(true)}
        />
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-4 pb-20">
        
        {currentView === 'roller' ? (
          /* INSPECTOR VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Roller */}
            <div className="lg:col-span-7 space-y-6">
              <DiceRollerPanel roller={roller} onRoll={handleRoll} />
            </div>

            {/* Right: Roll History */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-cinzel font-bold text-[#78350f] dark:text-amber-400 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  <span>Procès-Verbaux des Jets</span>
                  {isConnected && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      Direct P2P
                    </span>
                  )}
                </h2>

                {roller.history.length > 0 && (
                  <button
                    onClick={roller.clearHistory}
                    className="px-2.5 py-1 text-xs font-cinzel text-stone-600 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                    title="Effacer le registre local"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Vider</span>
                  </button>
                )}
              </div>

              {/* History list */}
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {roller.history.length === 0 ? (
                  <div className="p-8 text-center bg-stone-100/70 dark:bg-stone-900/60 rounded-xl border border-dashed border-stone-300 dark:border-stone-800 text-stone-500 font-serif italic space-y-2">
                    <Dices className="w-8 h-8 mx-auto opacity-40 text-stone-400" />
                    <p>Aucun procès-verbal pour le moment.</p>
                    <p className="text-xs">Configurez votre action et lancez le D8 ci-contre.</p>
                  </div>
                ) : (
                  roller.history.map(roll => (
                    <RollResultCard key={roll.id} roll={roll} />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* GM VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <GMPanel
                players={players}
                board={roller.board}
                onUpdateBoard={handleUpdateBoard}
                onGMSecretRoll={handleGMSecretRoll}
              />
            </div>

            {/* Right: Roll History for GM */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-cinzel font-bold text-[#78350f] dark:text-amber-400 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  <span>Journal de la Table</span>
                </h2>
                {roller.history.length > 0 && (
                  <button
                    onClick={roller.clearHistory}
                    className="text-xs font-cinzel text-stone-500 hover:text-red-600"
                  >
                    Vider
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {roller.history.length === 0 ? (
                  <div className="p-6 text-center bg-stone-100/60 dark:bg-stone-900/60 rounded-xl border border-dashed text-xs text-stone-500 italic">
                    En attente des premiers jets de la brigade...
                  </div>
                ) : (
                  roller.history.map(roll => (
                    <RollResultCard key={roll.id} roll={roll} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        currentRoomId={roomId}
        profile={profile}
        onUpdateProfile={updateProfile}
        onJoinRoom={joinRoom}
      />

      <PlayersListModal
        isOpen={isPlayersModalOpen}
        onClose={() => setIsPlayersModalOpen(false)}
        players={players}
        roomId={roomId}
        currentProfile={profile}
        onUpdateRole={handleUpdateRole}
      />

      <RulesReferenceModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <EndOfCaseModal
        isOpen={isEndOfCaseModalOpen}
        onClose={() => setIsEndOfCaseModalOpen(false)}
        archetype={roller.archetype}
      />

      <BrigadeBoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        board={roller.board}
        onUpdateBoard={handleUpdateBoard}
        isGM={profile.role === 'gm'}
      />

    </div>
  );
}
