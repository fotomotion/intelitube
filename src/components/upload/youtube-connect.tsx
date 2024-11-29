"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Youtube, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import { connectYouTubeChannel } from "@/lib/youtube/auth";
import { useYouTube } from "@/lib/hooks/useYoutube";
import { useAuth } from "@/lib/firebase/auth";

export function YouTubeConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { videos, loading, error, refreshVideos, isConnected } = useYouTube();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Erro na conexão",
        description: "Você precisa estar autenticado para conectar sua conta do YouTube.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const credential = await connectYouTubeChannel();
      
      if (!credential?.accessToken) {
        throw new Error('Não foi possível obter acesso ao YouTube');
      }

      await refreshVideos();
      
      toast({
        title: "YouTube conectado",
        description: "Sua conta do YouTube foi conectada com sucesso.",
      });
    } catch (err) {
      console.error('Error connecting YouTube:', err);
      toast({
        title: "Erro na conexão",
        description: err instanceof Error ? err.message : "Não foi possível conectar sua conta do YouTube.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 space-y-4">
          <Youtube className="h-12 w-12 text-red-500 opacity-50" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Faça login para continuar</h3>
            <p className="text-sm text-gray-500 mt-1">
              Você precisa estar autenticado para conectar sua conta do YouTube
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 space-y-4">
        {loading ? (
          <div className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            <span>Carregando dados...</span>
          </div>
        ) : isConnected ? (
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-center space-x-2 text-green-500">
              <CheckCircle2 className="h-6 w-6" />
              <span>YouTube conectado</span>
            </div>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4">
                    <img 
                      src={video.thumbnails.medium} 
                      alt={video.title}
                      className="w-full rounded-lg"
                    />
                    <h3 className="mt-2 font-semibold">{video.title}</h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <div>Views: {video.metrics.views}</div>
                      <div>Likes: {video.metrics.likes}</div>
                      <div>Comments: {video.metrics.comments}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Nenhum vídeo encontrado
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={refreshVideos}
              disabled={loading}
              className="w-full"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar vídeos
            </Button>
          </div>
        ) : (
          <>
            <Youtube className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Conecte seu canal do YouTube</h3>
              <p className="text-sm text-gray-500 mt-1">
                Conecte sua conta do YouTube para importar seus vídeos
              </p>
            </div>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full sm:w-auto"
            >
              {isConnecting ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Youtube className="h-4 w-4 mr-2" />
                  Conectar YouTube
                </>
              )}
            </Button>
          </>
        )}
        
        {error && (
          <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-2 rounded-lg">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}