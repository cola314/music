import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as ytMusic from '@heavyrisem/ytmusic';
import { Model } from '@music/types';
import { Repository } from 'typeorm';

import { GetSearchMusicDto } from './dto/GetSearchMusic.dto';
import { MusicMeta } from './entity/musicMeta.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicMeta) private readonly musicMetaRepository: Repository<MusicMeta>,
  ) {}

  async searchMusic(getSearchMusicDto: GetSearchMusicDto): Promise<Model.MusicInfo[]> {
    const res = await ytMusic.searchMusics(getSearchMusicDto.query);

    return Promise.all(
      res
        .map((music) => {
          if (music.youtubeId === undefined)
            throw new InternalServerErrorException(`youtubeId 값이 비었습니다. ${music.youtubeId}`);
          if (music.title === undefined)
            throw new InternalServerErrorException(`title 값이 비었습니다. ${music.title}`);
          if (music.thumbnailUrl === undefined)
            throw new InternalServerErrorException(
              `thumbnailUrl 값이 비었습니다. ${music.thumbnailUrl}`,
            );
          if (music.artists === undefined)
            throw new InternalServerErrorException(`artists 값이 비었습니다. ${music.artists}`);
          if (music.album === undefined)
            throw new InternalServerErrorException(`album 값이 비었습니다. ${music.album}`);
          if (music.isExplicit === undefined)
            throw new InternalServerErrorException(
              `isExplicit 값이 비었습니다. ${music.isExplicit}`,
            );
          if (music.duration === undefined)
            throw new InternalServerErrorException(`duration 값이 비었습니다. ${music.duration}`);

          const result: Model.MusicInfo = {
            youtubeId: music.youtubeId,
            title: music.title,
            thumbnailUrl: music.thumbnailUrl,
            artist: music.artists.map((artist) => artist.name),
            album: music.album,
            isExplicit: music.isExplicit,
            duration: music.duration.totalSeconds,
          };
          return result;
        })
        .map(this.saveMusicMeta.bind(this)),
    );
  }

  async saveMusicMeta(musicInfo: Model.MusicInfo) {
    const existMeta = await this.musicMetaRepository.findOneBy({ youtubeId: musicInfo.youtubeId });
    if (existMeta) {
      existMeta.update(musicInfo);
      return await this.musicMetaRepository.save(existMeta);
    } else return this.musicMetaRepository.save(musicInfo);
  }
}
