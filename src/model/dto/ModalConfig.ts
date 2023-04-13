export interface ModalConfig {
  size: string;
  title: string;
  close: boolean;
  footer: boolean | string;
  template: string;
  staticModal: boolean;
}

export enum TemplateModal {
  DEL = 'del',
  CONFIRM = 'confirm',
}

export enum ModalSize {
  XL = 'xl',
  MD = 'md',
}
