// Calming videos configuration
export interface CalmingVideo {
  id: string;
  title: string;
  videoId: string;
  params: string;
  description?: string;
}

export const calmingVideos: CalmingVideo[] = [
  {
    id: "meditation",
    title: "Meditation Music",
    videoId: "1ZYbU82GVz4",
    params: "si=wrpsvkyUxNgNGW-E",
    description: "Peaceful meditation music to help you focus and relax"
  },
  {
    id: "relaxing", 
    title: "Relaxing Sounds",
    videoId: "KxaZNW_4-hY",
    params: "si=_JunAG0gmzfcvr_6",
    description: "Soothing sounds for stress relief and relaxation"
  },
  {
    id: "nature",
    title: "Nature Sounds", 
    videoId: "-WSLcDgzHdM",
    params: "si=IbvQ9p_nzFcVJdHI",
    description: "Natural ambient sounds to connect with nature"
  }
];
