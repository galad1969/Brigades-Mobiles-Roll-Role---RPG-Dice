import { useState, useEffect, useRef, useCallback } from 'react';
import { joinRoom, selfId, Room } from 'trystero';
import { PlayerRole, RoomPlayer, RollHistoryEntry, BrigadeBoard, DifficultyTier } from '../types';
import { generateRandomPlayerName, getRandomColor } from '../utils/playerPresets';

const APP_ID = 'brigades-mobiles-1910-v1';

interface UserProfile {
  name: string;
  role: PlayerRole;
  color: string;
  debtTokens: number;
}

export function useMultiplayerRoom(
  onRemoteRollReceived: (entry: RollHistoryEntry) => void,
  getHistoryForSync: () => RollHistoryEntry[],
  onBoardUpdated?: (board: BrigadeBoard) => void
) {
  // Local profile in localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('bm1910_player_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.role && parsed.color) {
          return {
            ...parsed,
            debtTokens: parsed.debtTokens || 0,
          };
        }
      }
    } catch (e) {}
    return {
      name: generateRandomPlayerName(),
      role: 'player',
      color: getRandomColor(),
      debtTokens: 0,
    };
  });

  const [roomId, setRoomId] = useState<string | null>(null);
  const [remotePlayers, setRemotePlayers] = useState<Record<string, RoomPlayer>>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [peerCount, setPeerCount] = useState<number>(0);
  const [board, setBoard] = useState<BrigadeBoard>({
    remainingDays: 4,
    totalDays: 4,
    deadlineConsequence: 'Le suspect quitte la région et Beauvau rappelle la Brigade.',
    facts: ['Corps découvert à l\'aube près des voies de chemin de fer.', 'Montre à gousset brisée arrêtée à 23h15.'],
    hypotheses: ['Le meurtrier connaissait les horaires de nuit.'],
  });

  const roomRef = useRef<Room | null>(null);
  const presenceActionRef = useRef<{ send: (data: any, options?: any) => Promise<void> } | null>(null);
  const rollActionRef = useRef<{ send: (data: any, options?: any) => Promise<void> } | null>(null);
  const redactedRollActionRef = useRef<{ send: (data: any, options?: any) => Promise<void> } | null>(null);
  const historyActionRef = useRef<{ send: (data: any, options?: any) => Promise<void> } | null>(null);
  const requestHistoryActionRef = useRef<{ send: (data: any, options?: any) => Promise<void> } | null>(null);
  const boardActionRef = useRef<{ send: (data: any, options?: any) => Promise<void> } | null>(null);
  const gmAnnouncementActionRef = useRef<{ send: (data: any, options?: any) => Promise<void> } | null>(null);

  // Keep latest profile and callbacks in refs
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const onRemoteRollReceivedRef = useRef(onRemoteRollReceived);
  onRemoteRollReceivedRef.current = onRemoteRollReceived;
  const getHistoryForSyncRef = useRef(getHistoryForSync);
  getHistoryForSyncRef.current = getHistoryForSync;
  const onBoardUpdatedRef = useRef(onBoardUpdated);
  onBoardUpdatedRef.current = onBoardUpdated;
  const boardRef = useRef(board);
  boardRef.current = board;

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('bm1910_player_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      // Broadcast presence if in room
      if (presenceActionRef.current) {
        try {
          presenceActionRef.current.send({
            name: updated.name,
            role: updated.role,
            color: updated.color,
            debtTokens: updated.debtTokens,
            joinedAt: Date.now(),
          });
        } catch (err) {
          console.warn('Failed to broadcast updated presence', err);
        }
      }
      return updated;
    });
  }, []);

  const leaveRoom = useCallback(() => {
    if (roomRef.current) {
      try {
        roomRef.current.leave();
      } catch (e) {}
      roomRef.current = null;
    }
    presenceActionRef.current = null;
    rollActionRef.current = null;
    redactedRollActionRef.current = null;
    historyActionRef.current = null;
    requestHistoryActionRef.current = null;
    boardActionRef.current = null;
    gmAnnouncementActionRef.current = null;

    setRoomId(null);
    setRemotePlayers({});
    setIsConnected(false);
    setPeerCount(0);

    if (window.location.hash.startsWith('#/room')) {
      window.location.hash = '#/';
    }
  }, []);

  const broadcastBoard = useCallback((newBoard: BrigadeBoard) => {
    setBoard(newBoard);
    if (boardActionRef.current) {
      boardActionRef.current.send(newBoard as any);
    }
  }, []);

  const joinRoomById = useCallback((targetRoomId: string) => {
    const cleanRoomId = targetRoomId.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (!cleanRoomId) return;

    if (roomRef.current) {
      try {
        roomRef.current.leave();
      } catch (e) {}
      roomRef.current = null;
    }

    setRoomId(cleanRoomId);
    setRemotePlayers({});
    setIsConnected(true);

    try {
      const room = joinRoom({ appId: APP_ID }, cleanRoomId);
      roomRef.current = room;

      // Setup actions
      const presenceAction = room.makeAction('presence');
      const rollAction = room.makeAction('dice_roll');
      const redactedRollAction = room.makeAction('redacted_roll');
      const historyAction = room.makeAction('history_sync');
      const requestHistoryAction = room.makeAction('request_history');
      const boardAction = room.makeAction('brigade_board');
      const gmAnnouncementAction = room.makeAction('gm_announcement');

      presenceActionRef.current = presenceAction;
      rollActionRef.current = rollAction;
      redactedRollActionRef.current = redactedRollAction;
      historyActionRef.current = historyAction;
      requestHistoryActionRef.current = requestHistoryAction;
      boardActionRef.current = boardAction;
      gmAnnouncementActionRef.current = gmAnnouncementAction;

      // Peer join
      room.onPeerJoin = (peerId: string) => {
        presenceAction.send(
          {
            name: profileRef.current.name,
            role: profileRef.current.role,
            color: profileRef.current.color,
            debtTokens: profileRef.current.debtTokens,
            joinedAt: Date.now(),
          },
          { target: peerId }
        );

        // If we are GM, share the board
        if (profileRef.current.role === 'gm') {
          boardAction.send(boardRef.current as any, { target: peerId });
        }

        const peers = room.getPeers();
        setPeerCount(peers ? Object.keys(peers).length : 0);
      };

      // Peer leave
      room.onPeerLeave = (peerId: string) => {
        setRemotePlayers(prev => {
          const next = { ...prev };
          delete next[peerId];
          return next;
        });
        const peers = room.getPeers();
        setPeerCount(peers ? Object.keys(peers).length : 0);
      };

      // Presence message
      presenceAction.onMessage = (data: any, { peerId }: { peerId: string }) => {
        setRemotePlayers(prev => ({
          ...prev,
          [peerId]: {
            peerId,
            name: data.name || 'Inspecteur',
            role: data.role || 'player',
            color: data.color || '#1e3a8a',
            debtTokens: data.debtTokens || 0,
            joinedAt: data.joinedAt || Date.now(),
            isSelf: false,
          },
        }));
      };

      // Roll message
      rollAction.onMessage = (data: any, { peerId }: { peerId: string }) => {
        const rollEntry = data as RollHistoryEntry;
        const enrichedEntry: RollHistoryEntry = {
          ...rollEntry,
          author: {
            name: rollEntry.author?.name || 'Inspecteur',
            role: rollEntry.author?.role || 'player',
            color: rollEntry.author?.color || '#1e3a8a',
            peerId,
          },
        };
        onRemoteRollReceivedRef.current(enrichedEntry);
      };

      // Redacted secret roll message
      redactedRollAction.onMessage = (redactedData: any) => {
        if (profileRef.current.role !== 'gm') {
          const redactedEntry: RollHistoryEntry = {
            id: redactedData.id,
            timestamp: redactedData.timestamp,
            category: 'standard',
            actionName: 'Jet Secret du Meneur de Jeu',
            rank: 2,
            d8Result: 0,
            modifierTotal: 0,
            finalTotal: 0,
            degree: 'ambivalent',
            guaranteedFloor: 'ambivalent',
            difficultyMod: 0,
            rawAdvantage: 0,
            appliedAdvantage: 0,
            rawDisadvantage: 0,
            appliedDisadvantage: 0,
            halfRuleApplied: false,
            injuryStage: 1,
            injuryMod: 0,
            narrativeTitle: 'Jet Secret en cours...',
            narrativeDetail: 'Le Meneur de Jeu a lancé un dé à huis clos.',
            author: redactedData.author,
            isSecret: true,
            isRedacted: true,
          };
          onRemoteRollReceivedRef.current(redactedEntry);
        }
      };

      // Board update
      boardAction.onMessage = (data: any) => {
        const newBoard = data as BrigadeBoard;
        if (newBoard && Array.isArray(newBoard.facts)) {
          setBoard(newBoard);
          if (onBoardUpdatedRef.current) {
            onBoardUpdatedRef.current(newBoard);
          }
        }
      };

      // Sync request
      requestHistoryAction.onMessage = (_: any, { peerId }: { peerId: string }) => {
        const hist = getHistoryForSyncRef.current();
        if (hist.length > 0) {
          const cleanHistory: RollHistoryEntry[] = hist.slice(0, 30).map(entry => {
            if (entry.isSecret && !entry.isRedacted && entry.author?.peerId !== peerId) {
              return {
                ...entry,
                isRedacted: true,
                d8Result: 0,
                finalTotal: 0,
              };
            }
            return entry;
          });
          historyAction.send(cleanHistory as any, { target: peerId });
        }
      };

      historyAction.onMessage = (data: any) => {
        const historyList = data as RollHistoryEntry[];
        if (Array.isArray(historyList) && historyList.length > 0) {
          historyList.forEach(entry => {
            onRemoteRollReceivedRef.current(entry);
          });
        }
      };

      setTimeout(() => {
        if (presenceActionRef.current) {
          presenceActionRef.current.send({
            name: profileRef.current.name,
            role: profileRef.current.role,
            color: profileRef.current.color,
            debtTokens: profileRef.current.debtTokens,
            joinedAt: Date.now(),
          });
        }
        if (requestHistoryActionRef.current) {
          requestHistoryActionRef.current.send({ timestamp: Date.now() });
        }
      }, 600);

      window.location.hash = `#/room/${cleanRoomId}`;
    } catch (err) {
      console.error('Error joining room', err);
      setIsConnected(false);
    }
  }, []);

  const broadcastRoll = useCallback(
    (entry: RollHistoryEntry, isSecret: boolean = false) => {
      if (!roomRef.current || !rollActionRef.current) return;

      const author = {
        name: profile.name,
        role: profile.role,
        color: profile.color,
        peerId: selfId,
      };

      const fullEntry: RollHistoryEntry = {
        ...entry,
        author,
        isSecret,
        isRedacted: false,
      };

      if (!isSecret) {
        rollActionRef.current.send(fullEntry as any);
      } else {
        const gmPeerIds = (Object.values(remotePlayers) as RoomPlayer[])
          .filter(p => p.role === 'gm')
          .map(p => p.peerId);

        const regularPlayerPeerIds = (Object.values(remotePlayers) as RoomPlayer[])
          .filter(p => p.role !== 'gm')
          .map(p => p.peerId);

        if (gmPeerIds.length > 0) {
          rollActionRef.current.send(fullEntry as any, { target: gmPeerIds });
        }

        if (redactedRollActionRef.current && regularPlayerPeerIds.length > 0) {
          const payload = {
            id: entry.id,
            timestamp: entry.timestamp,
            author,
            isSecret: true,
            isRedacted: true,
          };
          redactedRollActionRef.current.send(payload, { target: regularPlayerPeerIds });
        }
      }
    },
    [profile, remotePlayers]
  );

  const allPlayers: RoomPlayer[] = [
    {
      peerId: selfId || 'local-self',
      name: profile.name,
      role: profile.role,
      color: profile.color,
      debtTokens: profile.debtTokens,
      isSelf: true,
      joinedAt: Date.now(),
    },
    ...(Object.values(remotePlayers) as RoomPlayer[]),
  ];

  return {
    profile,
    updateProfile,
    roomId,
    isConnected,
    peerCount,
    players: allPlayers,
    joinRoom: joinRoomById,
    leaveRoom,
    broadcastRoll,
    board,
    broadcastBoard,
    myPeerId: selfId,
  };
}
