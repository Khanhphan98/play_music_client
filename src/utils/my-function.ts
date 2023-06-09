import { getCurrentInstance } from 'vue';
import { MyStore } from '@/stores/my-store';
import { env } from '@/utils/my-variables';
import { UserStore } from '@/stores/user-store';
import axios from 'axios';
import MediaService from '@/model/service/media-service';

export function useEmitter() {
  const internalInstance = getCurrentInstance();
  if (internalInstance) {
    return internalInstance.appContext.config.globalProperties.emitter;
  } else {
    return '';
  }
}
export function getNestedPropValue(obj: any, propPath: string): any {
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  const propNames = propPath.split('.');
  let nestedObj = obj;

  for (const propName of propNames) {
    // eslint-disable-next-line no-prototype-builtins
    if (nestedObj.hasOwnProperty(propName)) {
      nestedObj = nestedObj[propName];
      // eslint-disable-next-line no-prototype-builtins
    } else if (Array.isArray(nestedObj) && nestedObj.length > 0 && nestedObj[0].hasOwnProperty(propName)) {
      nestedObj = nestedObj[0][propName];
    } else {
      return undefined;
    }
  }

  return nestedObj;
}
export function handleExceptionError(e: any) {
  const myStore = MyStore();
  if (getNestedPropValue(e, 'response.data.errors')) {
    myStore.showToastMessage(undefined, true, e.response.data.errors);
  } else {
    myStore.showToastMessage(undefined, true);
  }
}
export function genPassword() {
  const length = 10;
  const string = 'abcdefghijklmnopqrstuvwxyz';
  const numeric = '0123456789';
  const punctuation = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let character = '';
  let password = '';
  while (password.length < length) {
    const entity1 = Math.ceil(string.length * Math.random() * Math.random());
    const entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
    const entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
    let hold = string.charAt(entity1);
    hold = password.length % 2 === 0 ? hold.toUpperCase() : hold;
    character += hold;
    character += numeric.charAt(entity2);
    character += punctuation.charAt(entity3);
    password = character;
  }
  password = password
    .split('')
    .sort(() => {
      return 0.5 - Math.random();
    })
    .join('');
  return password.substr(0, length);
}

export async function tryCallRequest(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e: any) {
    console.log(e.response);
  }
}

export function handleUploadFile(file: any) {
  const userStore = UserStore();
  const access_token = userStore.myUser.access_token;

  const formData = new FormData();
  formData.append('file', file);

  return MediaService.upload(access_token, formData);
}

export function toHHMMSS (secs: string) {
  const sec_num = parseInt(secs, 10)
  const hours   = Math.floor(sec_num / 3600)
  const minutes = Math.floor(sec_num / 60) % 60
  const seconds = sec_num % 60

  return [hours,minutes,seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v,i) => v !== "00" || i > 0)
    .join(":")
}

export function randomDarkColorRgb() {
  const red = Math.floor((Math.random() * 256) / 0.8);
  const green = Math.floor((Math.random() * 256) / 2.5);
  const blue = Math.floor((Math.random() * 256) / 0.8);
  return red + ', ' + green + ', ' + blue;
}

export function removeDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function percentUsed(used: number, total: number) {
  //truong hop total unlimit
  if (total <= 0) {
    return -1;
  } else if (used <= 0 && total > 0) {
    return 0;
  } else {
    const percent = (used / total) * 100;
    if (percent >= 100) {
      return 100;
    } else {
      return Number.isSafeInteger(percent) ? percent : percent.toFixed(2);
    }
  }
}
