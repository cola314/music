import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';

import { SliderInput } from '@/components/atoms/SliderInput';
import { PlayController } from '@/components/molecules/PlayController';
import { usePlayerContext } from '@/context/PlayerContext';
import { useMusicData } from '@/hooks/api/useMusicData';
import { MusicIcon } from '@/icons/MusicIcon';
import { usePlayerStore } from '@/store/playerStore';

export const MusicPlayer: React.FC = () => {
  const { musicInfo, paused, volume, progress, setVolume, setProgress, setPaused, skipMusic } =
    usePlayerContext();

  const handlePlayStateChange = useCallback(
    (playing: boolean) => {
      if (playing) setPaused(false);
      else setPaused(true);
    },
    [setPaused],
  );

  return (
    <div css={[tw`flex justify-between items-center gap-[8rem]`]}>
      <PlayController
        css={[tw`w-24`]}
        playing={musicInfo !== null && !paused}
        onStateChange={handlePlayStateChange}
        onNext={skipMusic}
      />
      <div css={[tw`w-[34rem] h-[3rem] bg-gray-200 bg-opacity-10 overflow-hidden`, tw`rounded-md`]}>
        {!musicInfo && (
          <div css={[tw`w-full h-full flex justify-center items-center`]}>
            <MusicIcon css={[tw`w-8 h-8 fill-gray-200 opacity-75`]} />
          </div>
        )}
        {musicInfo && (
          <div css={[tw`w-full h-full flex`]}>
            <Image src={musicInfo.thumbnailUrl} alt="" width={48} height={48} />
            <div css={[tw`flex flex-col flex-1 items-center justify-between pt-1`, tw`text-xs`]}>
              <div>{musicInfo.title}</div>
              <div>
                {musicInfo.artist} - {musicInfo.album}
              </div>
              <SliderInput
                css={[tw`mb-0`]}
                value={progress}
                onChange={setProgress}
                min={0}
                max={musicInfo.duration}
                debounceDelayMils={10}
              />
            </div>
          </div>
        )}
      </div>
      <div css={[tw`w-24 flex items-center`]}>
        <SliderInput
          value={volume}
          onChange={setVolume}
          min={0}
          max={100}
          cursorType="circle"
          showCursor
        />
      </div>
    </div>
  );
};
