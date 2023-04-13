// TODO: hobv@inet.vn - Tạo file quản lý role hiển thị theo router

const roleList = ['admin', 'reseller', 'end_user']; // Root đã để mặc định có ở tất cả route nên ko đưa vào đây

const i18nMenuKey: any = {
  dasboard: roleList,
};
// menu User Account
i18nMenuKey.users = roleList.filter((_it) => _it !== 'end_user');
i18nMenuKey.newaccount = i18nMenuKey.listaccount = i18nMenuKey.listacl = i18nMenuKey.users;
// menu Packages | packages_list
i18nMenuKey.packages = i18nMenuKey.packagelist = i18nMenuKey.users;
// menu SQL Services
i18nMenuKey.sqlservices = roleList;
i18nMenuKey.mysqlmanager = roleList;

export default i18nMenuKey;
