interface ApiRequest {
    type: ActionType,
    object: DataSourceObjects,
    data: any
}

export enum ActionType {
    get = "get",
    getAll = "get-all",
    update = "update",
    create = "create"
}

export enum DataSourceObjects {
    customer = "customer"
}

export type {
    ApiRequest
}