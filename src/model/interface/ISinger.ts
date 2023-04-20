import { IProfession } from '@/model/interface/IProfession';
import { IStatistik } from '@/model/interface/IStatistik';

export interface ISinger {
  id: string;
  name: string;
  birthday: string;
  address: string;
  description: string;
  avatar: string;
  professions: IProfession[] | [];
  statistik: IStatistik | number;
}
