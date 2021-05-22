import {LoginPlatformType} from "../../../../packetClass/auth/login/LoginPlatformBaseModule";


export class DM_I_USER_SING_IN {
    loginPlatformType: LoginPlatformType;
    loginPlatformData : DM_I_USER_SING_IN_loginPlatformData
}
export class DM_I_USER_SING_IN_loginPlatformData {
    userName: string;
    password : string;
}

export class DM_O_USER_SING_IN {
    data: any;
}
