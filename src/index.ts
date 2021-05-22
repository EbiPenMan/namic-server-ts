import MetricsManager from "./manager/MetricsManager";
import ServerManager from "./manager/ServerManager";
import SocketManager from "./manager/SocketManager";
import DbManager from "./manager/DbManager";
import PlaceManager from "./manager/PlaceManager";
import RoleManager from "./manager/RoleManager";
import EventManager from "./manager/EventManager";
import LawManager from "./manager/LawManager";




MetricsManager.getInstance();

ServerManager.getInstance();
SocketManager.getInstance();
DbManager.getInstance();
PlaceManager.getInstance();
RoleManager.getInstance();
LawManager.getInstance();
EventManager.getInstance();

ServerManager.getInstance().init();
