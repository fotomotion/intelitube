"use client";

import { Eye, ThumbsUp, Share2, MessageCircle } from "lucide-react";

const recentVideos = [
  {
    id: "1",
    title: "você já parou no semafaro hoje?",
    views: 6222,
    likes: 6,
    comments: 0,
    shares: 0,
    platform: "tiktok",
  },
  {
    id: "2",
    title: "E vc, prefere eucalipto ou bambu?",
    views: 2712,
    likes: 20,
    comments: 0,
    shares: 2,
    platform: "tiktok",
  },
  {
    id: "3",
    title: "Você sabia!? Omelete.",
    views: 2049,
    likes: 23,
    comments: 3,
    shares: 3,
    platform: "tiktok",
  },
  {
    id: "4",
    title: "Gatos podem pular mais alto que casas.",
    views: 1171,
    likes: 2,
    comments: 0,
    shares: 0,
    platform: "tiktok",
  }
];

export function RecentVideos() {
  return (
    <div className="space-y-4">
      {recentVideos.map((video) => (
        <div
          key={video.id}
          className="flex items-start justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="space-y-1">
            <p className="font-medium line-clamp-1">{video.title}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {video.views.toLocaleString()}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {video.likes}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {video.comments}
              </span>
              <span className="flex items-center">
                <Share2 className="w-4 h-4 mr-1" />
                {video.shares}
              </span>
            </div>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {video.platform}
          </span>
        </div>
      ))}
    </div>
  );
}