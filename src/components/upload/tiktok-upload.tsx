"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle2, XCircle } from "lucide-react";
import { parse } from 'csv-parse/sync';
import { processCSVData } from "@/lib/utils/csv-processor";
import { saveToFirestore } from "@/lib/firebase/db";

export function TikTokUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setProgress(10);

      // Ler o arquivo
      const text = await file.text();
      setProgress(30);

      // Fazer o parse do CSV
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true
      });
      setProgress(50);

      // Processar os dados
      const processedData = await processCSVData(records);
      setProgress(70);

      // Salvar no Firestore
      await saveToFirestore('tiktok_videos', processedData);
      setProgress(100);

      toast({
        title: "Upload concluído",
        description: `${processedData.length} vídeos importados com sucesso.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
      toast({
        title: "Erro no upload",
        description: "Não foi possível processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
          disabled={isUploading}
        />
        
        {!isUploading && !error && progress !== 100 && (
          <>
            <Upload className="h-12 w-12 text-muted-foreground" />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Selecionar Arquivo CSV
            </label>
          </>
        )}

        {isUploading && (
          <div className="w-full space-y-4">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Processando arquivo...
            </p>
          </div>
        )}

        {progress === 100 && !error && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 />
            <span>Upload concluído</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <h4 className="font-medium mb-2">Formato esperado do CSV:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Time</li>
          <li>Video title</li>
          <li>Video link</li>
          <li>Post time</li>
          <li>Total likes</li>
          <li>Total comments</li>
          <li>Total shares</li>
          <li>Total views</li>
        </ul>
      </div>
    </div>
  );
}