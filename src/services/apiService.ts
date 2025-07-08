import { ActionType, DataSourceObjects, IApiRequest, IApiResponse } from "@/models/api"
import { fetchApi } from "./fetchHelper"
import { serverUrl } from "./constants"

async function apiGet<TRequest>(
  dataSourceObject: DataSourceObjects,
  data: TRequest
): Promise<IApiResponse> {

  return await fetchApi<IApiResponse, IApiRequest>(
    serverUrl,
    {
      method: 'POST',
      body: {
        type: ActionType.get,
        object: dataSourceObject,
        data,
      },
    }
  );
}


async function apiGetAll<TRequest>(
  dataSourceObject: DataSourceObjects,
  data?: TRequest
): Promise<IApiResponse> {
  return await fetchApi<IApiResponse, IApiRequest>(
    serverUrl,
    {
      method: 'POST',
      body: {
        type: ActionType.getAll,
        object: dataSourceObject,
        data,
      },
    }
  );
}

async function apiCreate<TRequest>(
  dataSourceObject: DataSourceObjects,
  data?: TRequest
): Promise<IApiResponse> {
  return await fetchApi<IApiResponse, IApiRequest>(
    serverUrl,
    {
      method: 'POST',
      body: {
        type: ActionType.create,
        object: dataSourceObject,
        data,
      },
    }
  );
}

async function apiUpdate<TRequest>(
  dataSourceObject: DataSourceObjects,
  data?: TRequest
): Promise<IApiResponse> {
  return await fetchApi<IApiResponse, IApiRequest>(
    serverUrl,
    {
      method: 'POST',
      body: {
        type: ActionType.update,
        object: dataSourceObject,
        data,
      },
    }
  );
}

export {
    apiGet,
    apiGetAll,
    apiCreate,
    apiUpdate
}