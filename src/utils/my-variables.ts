const backendServer = import.meta.env.VITE_BACKEND_SERVER;
export const env = {
  backendServer: backendServer,
};
//default limit per page request get
export const defaultLimitPerPage = 30;
export const rangePerPage = [2, 3, 5, 30, 50, 100];
export const defaultTimeoutSubmit = 1000;
export const validateUsername = /^[a-z_][a-z0-9_-]{0,16}$/;
export const validateDatabaseName = /^[a-zA-Z0-9_]{6,20}$/;
export const validateHostname = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/; //ít nhất 2 ký tự....
export const validatePassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,32}$/; //ít nhất 8 -  32 kí tự, 1 viết hoa , 1 số, 1 đặc biệt
export const mediumStrengthPassword =
  /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))$/;
export const validateIpAddress = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
