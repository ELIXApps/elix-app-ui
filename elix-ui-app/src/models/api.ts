interface IApiRequest {
    type: ActionType,
    object: DataSourceObjects,
    data: any
}

interface IApiResponse {
    status: string,
    value: any,
    message?: string
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
    IApiRequest,
    IApiResponse
}