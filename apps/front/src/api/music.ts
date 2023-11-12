export interface MusicSearchResult {
  title: string;
  artist: string;
  album: string;
  thumbnailUrl: string;
  duration: number;
}

const thumbnailUrl =
  'https://lh3.googleusercontent.com/bm0WFPaXBYSnv9g0qNffrErNV8yn_9dkRneuKEjynUUjy9giC6E6zZZ7Op4jWLGDlkHRCk5M68aWlLp9=w60-h60-l90-rj';
export const getSearchMusic = async (q: string) => {
  const mockData: MusicSearchResult[] = [
    { title: '제목-1', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-2', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-3', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-4', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-5', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-6', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-7', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-8', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-9', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-10', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-11', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-12', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-13', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-14', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
    { title: '제목-15', artist: '가수', album: '앨범', thumbnailUrl, duration: 244 },
  ];
  return mockData;
};
