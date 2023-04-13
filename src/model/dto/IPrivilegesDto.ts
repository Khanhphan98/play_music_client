export interface IPrivilegesDto {
  data: IPrivilegesDetailDto;
  structure: IPrivilegesDetailDto;
}
export interface IPrivilegesDetailDto {
  name: string;
  checkAll: boolean;
  indeterminate: boolean;
  role: IPrivilegesRoleDto[];
}
export interface IPrivilegesRoleDto {
  name: string;
  active: boolean;
}
