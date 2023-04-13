import { reactive } from 'vue';
export const aclDataMock = reactive({
  addNewAcl: false,
  tableTh: [
    {
      title: 'Version Management',
      tdId: 'versionMng',
    },
    {
      title: 'User Management',
      tdId: 'userMng',
    },
    {
      title: 'Website Management',
      tdId: 'webMng',
    },
    {
      title: 'Package Management',
      tdId: 'packageMng',
    },
    {
      title: 'Database Management',
      tdId: 'dbMng',
    },
    {
      title: 'DNS Management',
      tdId: 'dnsMng',
    },
    {
      title: 'Email Management',
      tdId: 'emailMng',
    },
    {
      title: 'FTP Management',
      tdId: 'ftpMng',
    },
    {
      title: 'Backup Management',
      tdId: 'backupMng',
    },
    {
      title: 'SSL Management',
      tdId: 'sslMng',
    },
  ],
  tableTd: {
    versionMng: [
      {
        title: 'Version Management',
        active: true,
      },
    ],
    userMng: [
      {
        title: 'Create New User',
        active: true,
      },
      {
        title: 'List Users',
        active: false,
      },
      {
        title: 'Reseller Center',
        active: true,
      },
      {
        title: 'Delete User',
        active: false,
      },
      {
        title: 'Change User ACL',
        active: true,
      },
    ],
    webMng: [
      {
        title: 'Create Website',
        active: false,
      },
      {
        title: 'Modify Website',
        active: true,
      },
      {
        title: 'Suspend Website',
        active: true,
      },
      {
        title: 'Delete Website',
        active: false,
      },
    ],
    packageMng: [
      {
        title: 'Create Package',
        active: false,
      },
      {
        title: 'List Packages',
        active: true,
      },
      {
        title: 'Delete Package',
        active: true,
      },
      {
        title: 'Modify Package',
        active: false,
      },
    ],
    dbMng: [
      {
        title: 'Create Database',
        active: true,
      },
      {
        title: 'Delete Database',
        active: true,
      },
      {
        title: 'List Database',
        active: true,
      },
    ],
    dnsMng: [
      {
        title: 'Create Nameserver',
        active: false,
      },
      {
        title: 'Delete DNS Zone',
        active: true,
      },
      {
        title: 'Delete Zone',
        active: true,
      },
      {
        title: 'Add/Delete',
        active: true,
      },
    ],
    emailMng: [
      {
        title: 'Create Email',
        active: true,
      },
      {
        title: 'List Emails',
        active: true,
      },
      {
        title: 'Delete Email',
        active: true,
      },
      {
        title: 'Email Forwarding',
        active: true,
      },
      {
        title: 'Change Email Password',
        active: true,
      },
      {
        title: 'DKIM Manager',
        active: true,
      },
    ],
    ftpMng: [
      {
        title: 'Create FTP Account',
        active: true,
      },
      {
        title: 'Delete FTP Account',
        active: true,
      },
      {
        title: 'List FTP Accounts',
        active: true,
      },
    ],
    backupMng: [
      {
        title: 'Create Backup',
        active: true,
      },
      {
        title: 'Google Drive Backups',
        active: true,
      },
      {
        title: 'Restore Backup',
        active: true,
      },
      {
        title: 'Add/Delete Destination',
        active: true,
      },
      {
        title: 'Schedule Backup',
        active: true,
      },
      {
        title: 'Remote Backups',
        active: true,
      },
    ],
    sslMng: [
      {
        title: 'Manage SSL',
        active: true,
      },
      {
        title: 'Hostname SSL',
        active: false,
      },
      {
        title: 'MailServer SSL',
        active: false,
      },
    ],
  },
});
