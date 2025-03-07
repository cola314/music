import { PlayIcon } from '@heroicons/react/24/solid';
import { Model } from '@music/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { FaShuffle } from 'react-icons/fa6';
import tw from 'twin.macro';

import { MusicLayout } from '@/Layout/Music';
import { uploadImage } from '@/api/image';
import { getPlaylistDetail } from '@/api/playlist';
import { Button } from '@/components/atoms/Button';
import { Image } from '@/components/atoms/Image';
import { MusicListTable } from '@/components/templates/MusicListTable';
import { PlaylistEditModal } from '@/components/templates/PlaylistEditModal';
import { usePlayerContext } from '@/context/PlayerContext';
import { useUpdatePlaylistMutation } from '@/hooks/api/useUpdatePlaylistMutation';
import { useUserPlaylist } from '@/hooks/api/useUserPlaylist';
import { useMusicAction } from '@/hooks/useMusicAction';
import { useAuthStore } from '@/store/authStore';

const playButtonStyle = [tw`flex items-center gap-2 text-sm`];

const PlayListPage = () => {
  const router = useRouter();
  const playlistId = useMemo(() => Number(router.query?.id), [router.query?.id]);

  const { setMusic, clearQueue, appendQueue } = usePlayerContext();

  const { user } = useAuthStore();
  const { data: userPlaylist, isLoading: playlistLoading } = useUserPlaylist();
  const { musicActionHandler, MusicActionModalRenderer } = useMusicAction();

  const { mutate: updatePlaylisltMutation } = useUpdatePlaylistMutation({
    onSuccess: () => setEditModalOpen(false),
  });

  const { data: playlistDetail, isLoading: playlistDetailLoading } = useQuery({
    queryKey: [getPlaylistDetail.name, playlistId],
    queryFn: () => getPlaylistDetail({ id: playlistId! }),
    enabled: typeof playlistId === 'number' && !isNaN(playlistId),
  });

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleSubmitEdit = useCallback(
    async (editData: Model.PlaylistInfo, image?: File) => {
      const editedPlaylistDetail = { ...editData };
      if (image) {
        const thumbnail = await uploadImage({ file: image });
        editedPlaylistDetail.thumbnail = thumbnail.url;
      }

      updatePlaylisltMutation(editedPlaylistDetail);
    },
    [updatePlaylisltMutation],
  );

  const handleClickPlay = useCallback(() => {
    if (playlistDetail) {
      clearQueue();
      appendQueue(playlistDetail.musicList);
    }
  }, [appendQueue, clearQueue, playlistDetail]);

  return (
    <MusicLayout css={[tw`flex flex-col`]}>
      {playlistDetail && (
        <>
          <div css={[tw`flex w-full`]}>
            <Image
              src={playlistDetail.thumbnail}
              width={256}
              height={256}
              alt=""
              css={[tw`rounded-lg`, tw`w-64 h-64`]}
              unoptimized
            />
            <div css={[tw`flex flex-col justify-between p-4 flex-1`]}>
              <div>
                <div css={[tw`text-gray-200 text-opacity-60 font-bold text-3xl`]}>
                  {playlistDetail.name}
                </div>
                <div css={[[tw`text-gray-200 text-opacity-40 text-2xl`]]}>
                  {playlistDetail.author.displayName}
                </div>
              </div>
              <div>{playlistDetail.description}</div>
              <div css={[tw`flex justify-between`]}>
                <div css={[tw`flex gap-2`]}>
                  <Button css={[playButtonStyle]} bgStyle onClick={handleClickPlay}>
                    <PlayIcon css={[tw`h-4 w-4`]} />
                    재생
                  </Button>
                  <Button css={[playButtonStyle]} bgStyle>
                    <FaShuffle />
                    셔플 재생
                  </Button>
                </div>
                {playlistDetail.author.id === user?.id && (
                  <Button css={[playButtonStyle]} onClick={() => setEditModalOpen(true)} bgStyle>
                    수정
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div css={[tw`flex-1 py-2`]}>
            <MusicListTable
              data={playlistDetail.musicList}
              isLoading={playlistLoading || playlistDetailLoading}
              userPlaylist={userPlaylist}
              onMusicAction={musicActionHandler}
              onMusicPlayClick={setMusic}
              onDoubleClickRow={setMusic}
            />
          </div>

          <MusicActionModalRenderer />
          {editModalOpen && (
            <PlaylistEditModal
              playlistDetail={playlistDetail}
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSubmit={handleSubmitEdit}
            />
          )}
        </>
      )}
    </MusicLayout>
  );
};

export default PlayListPage;
