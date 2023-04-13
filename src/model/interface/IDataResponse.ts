export interface IDataResponse {
  data: any;
  total: number;
  limit: number;
  offset: number;
  message: string; //Success
  errors: IErrorResponse[];
  currentPage: number; //client only
  totalPage: number; //client only
  filter: {
    username: string;
    role_slug: string;
    status: string;
    target_username: string;
    search_name: string;
  };
}

export interface IErrorResponse {
  status: string;
  title: string;
  detail: string;
  source: IErrorSource;
}

export interface IErrorSource {
  field: string;
  error_code: string;
}
