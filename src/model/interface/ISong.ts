import { ICategory } from '@/model/interface/ICategory';
import { ICountry } from '@/model/interface/ICountry';
import { ISinger } from '@/model/interface/ISinger';
import { IStatistik } from '@/model/interface/IStatistik';

export interface ISong {
  id: string;
  name: string;
  release: string;
  time: number;
  lyric: string;
  description: string;
  file_mp3: string;
  picture: string;
  categories: ICategory[] | [];
  countries: ICountry[] | [];
  singers: ISinger[] | [];
  statistik: IStatistik | number;
  created_at: string;
  updated_at: string;
}
