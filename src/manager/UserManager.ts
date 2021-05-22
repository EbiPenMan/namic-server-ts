import UserModule from "../module/UserModule";

export default class UserManager {
    private static instance: UserManager;

    private userModuleList : UserModule[] = [];


    private constructor() {
        
    }

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }

        return UserManager.instance;
    }



}
