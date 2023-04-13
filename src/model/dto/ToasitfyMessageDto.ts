import { IErrorResponse } from '@/model/interface/IDataResponse';

export class ToasitfyMessageDto {
  title = '';
  content = '';
  type = '';
  class = '';
  details: IErrorResponse[] = [];
  alert = {
    class: {
      success: 'success',
      danger: 'danger',
      warning: 'warning',
    },
  };
}
