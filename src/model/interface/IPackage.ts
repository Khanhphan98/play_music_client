export interface IPackage {
    id: number;
    name: string;
    owner: string;
    disk_space: number;
    bandwidth: number;
    db: number; // Database
    ftp: number;
    domains: number;
    ips: string[];
    created_at: Date;
    updated_at: Date;
    is_default: boolean;
    speed: number;
    pmem: number;
    io: number;
    iops: number;
    ep: number;
    nproc: number;
    inodes_soft: number;
    inodes_hard: number;
    ip_pool: number;
    num_users: number;
    changePackage: boolean; //client only
    packageIdChanged: number;  //client only
}
