import { ICategory } from '@/model/interface/ICategory';
import { ICountry } from '@/model/interface/ICountry';
import { ISinger } from '@/model/interface/ISinger';

export interface ISong {
  id: string;
  name: string;
  release: Date;
  time: number;
  lyric: string;
  description: string;
  file_mp3: string;
  picture: string;
  categories: ICategory[];
  countries: ICountry[];
  singers: ISinger[];
}
