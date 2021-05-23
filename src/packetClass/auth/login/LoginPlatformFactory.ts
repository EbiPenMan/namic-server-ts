
import LoginPlatformBaseModule, {LoginPlatformType} from "./LoginPlatformBaseModule";
import LoginUserPassModule from "./LoginUserPassModule";

export default class LoginPlatformFactory {

    private static instance: LoginPlatformFactory;

    public loginPlatforms: LoginPlatformBaseModule[] = [];

    constructor() {
        this.initLoginPlatformList();
    }

    public static getInstance(): LoginPlatformFactory {
        if (!LoginPlatformFactory.instance) {
            LoginPlatformFactory.instance = new LoginPlatformFactory();
        }

        return LoginPlatformFactory.instance;
    }

    private initLoginPlatformList() {
        this.addLoginPlatform(new LoginUserPassModule());
    }

    public getLoginPlatformByType(loginPlatformType: LoginPlatformType): LoginPlatformBaseModule {
        return this.loginPlatforms.find(x => x.loginPlatformType === loginPlatformType);
    }

    public addLoginPlatform(loginPlatform: LoginPlatformBaseModule) {
        if (this.loginPlatforms.find(x => x.loginPlatformType === loginPlatform.loginPlatformType) == null)
            this.loginPlatforms.push(loginPlatform);
    }
}
