import BaseController from "./BaseController";
import {PACKET_CLASS_TYPES} from "../data/model/packet/PacketClassType";
import UserController from "./user/UserController";

export default class ControllerFactory {
    private static instance: ControllerFactory;

    public controllers: BaseController[] = [];

    constructor() {
        this.initControllerList();
    }

    public static getInstance(): ControllerFactory {
        if (!ControllerFactory.instance) {
            ControllerFactory.instance = new ControllerFactory();
        }

        return ControllerFactory.instance;
    }

    private initControllerList() {
        this.addController(new UserController());
    }

    public getControllerByType(classType: PACKET_CLASS_TYPES): BaseController {
        return this.controllers.find(x => x.classType === classType);
    }

    public addController(controller: BaseController) {
        if (this.controllers.find(x => x.classType === controller.classType) == null)
            this.controllers.push(controller);
    }

}
