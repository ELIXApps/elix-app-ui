import { ActionType, DataSourceObjects, IApiRequest, IApiResponse } from "@/models/api";
import { fetchApi } from "./fetchHelper";
import { ServiceAPIUrl } from "./apiUrls";

async function apiGet<TRequest>(
  dataSourceObject: DataSourceObjects,
  data: TRequest
): Promise<IApiResponse> {
  try {
    return await fetchApi<IApiResponse, IApiRequest>(
      ServiceAPIUrl,
      {
        method: 'POST',
        body: {
          type: ActionType.get,
          object: dataSourceObject,
          data,
        },
      }
    );
  } catch (error) {
    console.error(`apiGet error:`, error);    
  }
}

async function apiGetAll<TRequest>(
  dataSourceObject: DataSourceObjects,
  data?: TRequest
): Promise<IApiResponse> {
  try {
    return await fetchApi<IApiResponse, IApiRequest>(
      ServiceAPIUrl,
      {
        method: 'POST',
        body: {
          type: ActionType.getAll,
          object: dataSourceObject,
          data,
        },
      }
    );
  } catch (error) {
    console.error(`apiGetAll error:`, error);    
  }
}

async function apiCreate<TRequest>(
  dataSourceObject: DataSourceObjects,
  data?: TRequest
): Promise<IApiResponse> {
  try {
    return await fetchApi<IApiResponse, IApiRequest>(
      ServiceAPIUrl,
      {
        method: 'POST',
        body: {
          type: ActionType.create,
          object: dataSourceObject,
          data,
        },
      }
    );
  } catch (error) {
    console.error(`apiCreate error:`, error);    
  }
}

async function apiUpdate<TRequest>(
  dataSourceObject: DataSourceObjects,
  data?: TRequest
): Promise<IApiResponse> {
  try {
    return await fetchApi<IApiResponse, IApiRequest>(
      ServiceAPIUrl,
      {
        method: 'POST',
        body: {
          type: ActionType.update,
          object: dataSourceObject,
          data,
        },
      }
    );
  } catch (error) {
    console.error(`apiUpdate error:`, error);    
  }
}

export {
  apiGet,
  apiGetAll,
  apiCreate,
  apiUpdate
};
