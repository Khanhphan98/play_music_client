export interface IIpAddress {
  id: string;
  ip: string;
  reason: string;
  deletable: boolean;
  is_primary: boolean;
  create_at: Date;
}
