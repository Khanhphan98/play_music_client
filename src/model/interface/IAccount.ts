import { IPackage } from '@/model/interface/IPackage';
import { IDomain } from '@/model/interface/IDomain';

export interface IAccount {
  hostname: string;
  username: string;
  password: string;
  email: string;
  role_slug: string;
  child_role_slug: string;
  acl_name: string;
  status: string;
  owner: string;
  unix_user: string; //hostname
  ip: string;
  package: IPackage; //Interface package
  primary_domain: IDomain; //Interface domain
  package_id: number; //Create/Edit user
  created_at: Date;
  access_token: string;
  refresh_token: string;
  suspend: boolean; //client only
}

export interface IActionAccount {
  new_package_id: number; //change package
  usernames: string[]; //action suspend, resume, etc....
}

export enum RoleUser {
  ROOT = 'root',
  ADMIN = 'admin',
  RESELLER = 'reseller',
  END_USER = 'end_user',
}

export enum StatusUser {
  ACTIVED = 'activated',
  DISABLED = 'disabled',
  ADMIN_DISABLED = 'admin_disabled',
}
