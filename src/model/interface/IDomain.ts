export interface IDomain {
  id: number;
  website_id: number;
  owner: string;
  domain: string;
  type: string;
  php_version: string;
  path: string;
  created_at: Date;
  updated_at: Date;
  ssl_type: string;
  not_before: Date;
  not_after: Date;
  ip: string;
}
