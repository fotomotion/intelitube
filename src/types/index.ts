export interface VideoData {
    id: string;
    platform: 'youtube' | 'tiktok';
    title: string;
    link: string;
    postTime: Date;
    metrics: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
    };
    analytics: {
      viewsHistory: {
        date: Date;
        views: number;
      }[];
      engagement: number;
      retention?: number;
    };
    content: {
      category: string;
      tags: string[];
      format: string;
      performance: 'viral' | 'normal' | 'low';
    };
  }
  
  export interface NotificationSettings {
    userId: string;
    viralThreshold: number;
    emailNotifications: boolean;
    pushNotifications: boolean;
    metrics: {
      views: boolean;
      engagement: boolean;
      viral: boolean;
    };
  }
  
  export interface AnalyticsSnapshot {
    timestamp: Date;
    totalViews: number;
    avgEngagement: number;
    topVideos: string[];
    trending: {
      categories: string[];
      formats: string[];
    };
  }