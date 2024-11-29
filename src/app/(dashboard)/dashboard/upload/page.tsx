"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TikTokUpload } from "@/components/upload/tiktok-upload";
import { YouTubeConnect } from "@/components/upload/youtube-connect";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Importar Dados</h1>
      
      <Tabs defaultValue="tiktok" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tiktok">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Dados do TikTok</CardTitle>
              <CardDescription>
                Faça upload do arquivo CSV exportado do TikTok Analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TikTokUpload />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="youtube">
          <Card>
            <CardHeader>
              <CardTitle>Conectar YouTube</CardTitle>
              <CardDescription>
                Conecte sua conta do YouTube para importação automática de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YouTubeConnect />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}