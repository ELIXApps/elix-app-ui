import { IApiResponse } from "@/models/api";
import { fetchApi } from "./common/fetchHelper";
import { DesignImageAPIUrl } from "./common/apiUrls";

async function getImages(designId: string): Promise<object> {
  try {
    var params = new URLSearchParams();
    params.append("designId", designId);
    var response = await fetchApi<IApiResponse<object>>(
      DesignImageAPIUrl(params),
      {
        method: "GET",
      }
    );
    return response.value;
  } catch (error) {
    console.error(`get Images error:`, error);
  }
}

async function uploadImages(designId: string, formData: FormData): Promise<any> {
  try {
    var params = new URLSearchParams();
    params.append("designId", designId);
    var response = await fetchApi<IApiResponse<any>>(DesignImageAPIUrl(params), {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error(`upload Images error:`, error);
  }
}


async function deleteImages(designId: string, fileName: string): Promise<any> {
  try {
    var params = new URLSearchParams();
    params.append("designId", designId);
    params.append("fileName", fileName);
    var response = await fetchApi<IApiResponse<any>>(DesignImageAPIUrl(params), {
      method: "DELETE"
    });
    return response;
  } catch (error) {
    console.error(`delete Images error:`, error);
  }
}

export { getImages, uploadImages, deleteImages };
