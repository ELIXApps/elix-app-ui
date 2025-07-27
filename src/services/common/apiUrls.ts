import { URLSearchParams } from "url";

const ServerBaseUrl = "https://nfqkh7w0bd.execute-api.ap-south-1.amazonaws.com/develop/"

export const AuthorizeAPIUrl = ServerBaseUrl + "auth/authorize";

export const ValidateTokenAPIUrl = ServerBaseUrl + "auth/validate";

export const ServiceAPIUrl = ServerBaseUrl + "api";

export const DesignImageAPIUrl = (params: URLSearchParams) => ServiceAPIUrl + "/design/image?" + params.toString();
