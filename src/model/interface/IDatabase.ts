export interface IDatabase {
  id: number;
  owner: string;
  database_name: string;
  users: IUserDatabase[];
  charset: string; //client only
}

export interface IActionDatabase {
  database_id: number;
  database_name: string;
  database_user: string;
  password: string;
  privileges: string[];
  charset: string;
  remote_ip: string;
  new_remote_ip: string;
}

export interface IUserDatabase {
  id: number;
  host: string;
  user: string;
  password: string; //client only
  privileges: IPrivileges;
}

export interface IActionUserDatabase {
  database_id: number;
  database_user_id: number;
  database_user: string;
  host: string;
  new_host: string;
  password: string;
  privileges: string[];
}

export interface IPrivileges {
  data: string[];
  structure: string[];
}
