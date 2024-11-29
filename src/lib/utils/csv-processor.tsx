interface RawTikTokData {
    Time: string;
    "Video title": string;
    "Video link": string;
    "Post time": string;
    "Total likes": string;
    "Total comments": string;
    "Total shares": string;
    "Total views": string;
  }
  
  interface ProcessedVideo {
    id: string;
    platform: 'tiktok';
    title: string;
    link: string;
    postTime: Date;
    metrics: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
    };
    updatedAt: Date;
  }
  
  export async function processCSVData(records: RawTikTokData[]): Promise<ProcessedVideo[]> {
    return records.map(record => {
      // Extrair ID do vídeo do link
      const videoId = record["Video link"].split("/").pop() || "";
  
      return {
        id: videoId,
        platform: 'tiktok',
        title: record["Video title"],
        link: record["Video link"],
        postTime: new Date(record["Post time"]),
        metrics: {
          views: parseInt(record["Total views"], 10) || 0,
          likes: parseInt(record["Total likes"], 10) || 0,
          comments: parseInt(record["Total comments"], 10) || 0,
          shares: parseInt(record["Total shares"], 10) || 0,
        },
        updatedAt: new Date(),
      };
    });
  }