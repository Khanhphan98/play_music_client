import { IProfession } from '@/model/interface/IProfession';

export interface ISinger {
  id: string;
  name: string;
  birthday: string;
  address: string;
  description: string;
  avatar: string;
  professions: IProfession[] | [];
}
