import FactoryController from "../controller/FactoryController";
import BaseController from "../controller/BaseController";

export function RegisterController() {
    return function(target: object) {
        FactoryController.getInstance().addController(target as BaseController);
    };
}
