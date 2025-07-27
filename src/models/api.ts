interface IApiRequest {
  type: ActionType;
  object: DataSourceObjects;
  data: any;
}

interface IApiResponse<TValue> {
  status: "ok" | "error";
  value: TValue;
  message?: string;
  id?: string;
}

export enum ActionType {
  get = "get",
  getAll = "get-all",
  update = "update",
  create = "create",
}

export enum DataSourceObjects {
  customer = "customer",
  design = "design",
  order = "order",
}

export type { IApiRequest, IApiResponse };
