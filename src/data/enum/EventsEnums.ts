export enum EVENT_NAMES {

    USER_CREATE = "USER_CREATE",
    USER_UPDATE = "USER_UPDATE",
    USER_DELETE = "USER_DELETE",
    PLACE_CREATE = "PLACE_CREATE",
    PLACE_UPDATE = "PLACE_UPDATE",
    PLACE_DELETE = "PLACE_DELETE",
    ROLE_CREATE = "ROLE_CREATE",
    ROLE_UPDATE = "ROLE_UPDATE",
    ROLE_DELETE = "ROLE_DELETE",
    ROLE_ASSIGN = "ROLE_ASSIGN",
    ROLE_UNASSIGNED = "ROLE_UNASSIGNED",
    LAW_CREATE = "LAW_CREATE",
    LAW_UPDATE = "LAW_UPDATE",
    LAW_DELETE = "LAW_DELETE",

}

export enum EVENT_ACTION_TYPE {

    BEFORE = "BEFORE",
    AFTER = "AFTER",

}

export enum EVENT_LOGIC_TYPE {

    VERIFY = "VERIFY",
    MANIPULATE = "MANIPULATE",

}
