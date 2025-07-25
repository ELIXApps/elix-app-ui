import { ActionType, DataSourceObjects, IApiRequest, IApiResponse } from "@/models/api";
import { fetchApi } from "./fetchHelper";
import { ServiceAPIUrl } from "./apiUrls";

async function apiGet<TResponse>(
  dataSourceObject: DataSourceObjects,
  data: any
): Promise<TResponse> {
  try {
    var response = await fetchApi<IApiResponse<TResponse>, IApiRequest>(
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
    return response.value
  } catch (error) {
    console.error(`apiGet error:`, error);    
  }
}

async function apiGetAll<TResponse>(
  dataSourceObject: DataSourceObjects,
  data?: any
): Promise<TResponse> {
  try {
    var response = await fetchApi<IApiResponse<TResponse>, IApiRequest>(
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
    return response.value;
  } catch (error) {
    console.error(`apiGetAll error:`, error);    
  }
}

async function apiCreate(
  dataSourceObject: DataSourceObjects,
  data?: any
): Promise<IApiResponse<any>> {
  try {
    return await fetchApi<IApiResponse<any>, IApiRequest>(
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

async function apiUpdate(
  dataSourceObject: DataSourceObjects,
  data?: any
): Promise<IApiResponse<any>> {
  try {
    return await fetchApi<IApiResponse<any>, IApiRequest>(
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
