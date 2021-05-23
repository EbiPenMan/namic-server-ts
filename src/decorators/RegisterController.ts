import ControllerFactory from "../controller/ControllerFactory";
import BaseController from "../controller/BaseController";

export function RegisterController() {
    return function(target: object) {
        ControllerFactory.getInstance().addController(target as BaseController);
    };
}
