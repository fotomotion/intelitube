import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { YouTubeAPI } from '@/lib/youtube/api';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const api = new YouTubeAPI();

interface YouTubeConnection {
  connected: boolean;
  channelId?: string;
  accessToken?: string;
}

/**
 * Hook para gerenciar os vídeos do YouTube
 */
export function useYouTube() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<YouTubeConnection | null>(null);

  // Monitorar o status da conexão com YouTube
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(
      doc(db, 'youtube_connections', user.uid),
      (doc) => {
        if (doc.exists()) {
          setConnection({
            connected: doc.data().connected,
            channelId: doc.data().channelId,
            accessToken: doc.data().accessToken
          });
        } else {
          setConnection(null);
        }
      },
      (error) => {
        console.error('Error fetching YouTube connection:', error);
        setError('Erro ao verificar conexão com YouTube');
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const refreshVideos = async () => {
    if (!user?.uid) {
      setError('Usuário não autenticado');
      return;
    }

    if (!connection?.connected || !connection?.accessToken) {
      setError('YouTube não está conectado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedVideos = await api.getChannelVideos(user.uid);
      setVideos(fetchedVideos);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar vídeos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar vídeos automaticamente quando estiver conectado
  useEffect(() => {
    if (user?.uid && connection?.connected) {
      refreshVideos();
    }
  }, [user?.uid, connection?.connected]);

  return {
    videos,
    loading,
    error,
    refreshVideos,
    isConnected: !!connection?.connected
  };
}