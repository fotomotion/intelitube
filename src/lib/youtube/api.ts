import { getYouTubeToken } from './auth';

interface YouTubeVideoStats {
  id: string;
  title: string;
  publishedAt: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
  };
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
}

export class YouTubeAPI {
  private async fetchWithAuth(endpoint: string, userId: string, params: Record<string, string> = {}) {
    const accessToken = await getYouTubeToken(userId);

    const queryParams = new URLSearchParams(params);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/${endpoint}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('YouTube API Error:', error);
        
        // Tratamento específico para erros comuns
        if (response.status === 401) {
          throw new Error('Token de acesso expirado ou inválido. Por favor, reconecte sua conta do YouTube.');
        } else if (response.status === 403) {
          throw new Error('Sem permissão para acessar este recurso. Verifique se você concedeu todas as permissões necessárias.');
        } else if (response.status === 404) {
          throw new Error('Recurso não encontrado. Verifique se o canal do YouTube existe.');
        }
        
        throw new Error(error.error?.message || 'Erro ao acessar a API do YouTube');
      }

      return response.json();
    } catch (err) {
      console.error('YouTube API Request Error:', err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Erro inesperado ao acessar a API do YouTube');
    }
  }

  async getChannelVideos(userId: string): Promise<YouTubeVideoStats[]> {
    try {
      // Primeiro, obtemos o ID do canal do usuário
      const channelResponse = await this.fetchWithAuth('channels', userId, {
        part: 'id',
        mine: 'true'
      });

      const channelId = channelResponse.items?.[0]?.id;
      if (!channelId) {
        throw new Error('Canal do YouTube não encontrado');
      }

      // Depois, pegamos os IDs dos vídeos do canal
      const searchResponse = await this.fetchWithAuth('search', userId, {
        part: 'id,snippet',
        channelId,
        type: 'video',
        order: 'date',
        maxResults: '50'
      });

      const videoIds = searchResponse.items
        ?.map((item: any) => item.id.videoId)
        .filter(Boolean);

      if (!videoIds?.length) {
        return [];
      }

      // Por fim, obtemos as estatísticas dos vídeos
      const statsResponse = await this.fetchWithAuth('videos', userId, {
        part: 'statistics',
        id: videoIds.join(',')
      });

      return searchResponse.items.map((video: any) => {
        const stats = statsResponse.items?.find(
          (stat: any) => stat.id === video.id?.videoId
        );

        return {
          id: video.id?.videoId || '',
          title: video.snippet?.title || '',
          publishedAt: video.snippet?.publishedAt || '',
          thumbnails: video.snippet?.thumbnails || {},
          metrics: {
            views: Number(stats?.statistics?.viewCount || 0),
            likes: Number(stats?.statistics?.likeCount || 0),
            comments: Number(stats?.statistics?.commentCount || 0)
          }
        };
      });
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      throw error;
    }
  }

  async getVideoAnalytics(videoId: string, userId: string) {
    const response = await this.fetchWithAuth('youtubeAnalytics/v2/reports', userId, {
      ids: `channel==MINE`,
      metrics: 'estimatedMinutesWatched,averageViewDuration,averageViewPercentage',
      dimensions: 'video',
      filters: `video==${videoId}`,
      startDate: '2020-01-01',
      endDate: '2024-12-31'
    });

    return response;
  }
}