import { IApiRequest, IApiResponse } from "@/models/api";
import { fetchApi } from "./fetchHelper";
import { DesignImageUrl } from "./apiUrls";

async function getImages(designNo: string): Promise<any> {
  try {
    var params = new URLSearchParams();
    params.append("designId", designNo);
    var response = await fetchApi<IApiResponse<any>>(
      DesignImageUrl(params),
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    console.error(`get Images error:`, error);
  }
}

async function uploadImages(designNo: string, formData: FormData): Promise<any> {
  try {
    var params = new URLSearchParams();
    params.append("designId", designNo);
    var response = await fetchApi<IApiResponse<any>>(DesignImageUrl(params), {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error(`upload Images error:`, error);
  }
}


async function deleteImages(designNo: string, fileName: string): Promise<any> {
  try {
    var params = new URLSearchParams();
    params.append("designId", designNo);
    params.append("fileName", fileName);
    var response = await fetchApi<IApiResponse<any>>(DesignImageUrl(params), {
      method: "DELETE"
    });
    return response;
  } catch (error) {
    console.error(`delete Images error:`, error);
  }
}

export { getImages, uploadImages, deleteImages };
