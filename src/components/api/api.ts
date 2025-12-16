const API_BASE_URL = "http://4.227.238.34:8000";
export const API_BASE = API_BASE_URL;

const safeJsonParse = async (response: Response) => {
  const text = await response.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------------- AUTH ----------------
export interface SignupData { name: string; email: string; password: string; }
export interface LoginData { email: string; password: string; }
export interface AuthResponse { message?: string; access_token?: string; token_type?: string; user?: any; }

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(data),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || result.message || "Signup failed");
  return result;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(data),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || result.message || "Login failed");
  if (result.access_token) localStorage.setItem("access_token", result.access_token);
  return result;
};

export const logout = () => localStorage.removeItem("access_token");


// ---------------- S3 ----------------
export interface S3Credentials {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  region: string;
}

export interface S3Bucket {
  name: string;
}

export interface S3Object {
  key: string;
  size: number;
  last_modified: string;
}

export interface S3ObjectsResponse {
  folders: string[];
  files: string[];
}

export const getS3Buckets = async (credentials: S3Credentials): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/buckets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(credentials),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch buckets");
  return result;
};

export const getS3Objects = async (
  bucketName: string,
  credentials: S3Credentials & { prefix?: string }
): Promise<S3ObjectsResponse> => {
  const res = await fetch(`${API_BASE}/buckets/${encodeURIComponent(bucketName)}/objects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(credentials),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch objects");
  return result;
};

export const getS3File = async (
  bucketName: string,
  key: string,
  credentials: S3Credentials
): Promise<{ s3_path: string }> => {
  const res = await fetch(`${API_BASE}/buckets/${bucketName}/file?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(credentials),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch file");
  return result;
};


// ---------------- AZURE BLOB ----------------
export interface AzureCredentials {
  connection_string: string;
}

export interface AzureBlobsResponse {
  folders: string[];
  files: string[];
}

export const getAzureContainers = async (credentials: AzureCredentials): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/containers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(credentials),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch containers");
  return result;
};

export const getAzureBlobs = async (
  containerName: string,
  credentials: AzureCredentials & { prefix?: string }
): Promise<AzureBlobsResponse> => {
  const res = await fetch(`${API_BASE}/containers/${encodeURIComponent(containerName)}/blobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({
      ...credentials,
      container_name: containerName,
      prefix: credentials.prefix || ""
    }),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch blobs");
  return result;
};

export const getAzureBlobFile = async (
  containerName: string,
  blobName: string,
  credentials: AzureCredentials
): Promise<{ azure_path: string }> => {
  const res = await fetch(`${API_BASE}/containers/${encodeURIComponent(containerName)}/file?blob_name=${encodeURIComponent(blobName)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(credentials),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch blob file");
  return result;
};

export const getOneLakeWorkspaces = async (credentials: OneLakeCredentials): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/workspaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(credentials),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch workspaces");
    return result.workspaces ? result.workspaces.map((ws: any) => ws.name) : [];

};

export const getOneLakeLakehouses = async (
  workspaceName: string,
  credentials: OneLakeCredentials
): Promise<string[]> => {
  const res = await fetch(`${API_BASE}/workspaces/lakehouses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({
      ...credentials,
      workspace_name: workspaceName,
      lakehouse_name: "",   
      path: "Files"         
    }),
  });
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch lakehouses");
  
  
  return result.lakehouses ? result.lakehouses.map((lh: any) => lh.name) : [];
};

export const getOneLakeFolderContents = async (
  workspaceName: string,
  lakehouseName: string,
  credentials: OneLakeCredentials & { path?: string }
): Promise<OneLakeFolderContents> => {
  const res = await fetch(
    `${API_BASE}/workspaces/${encodeURIComponent(workspaceName)}/lakehouses/${encodeURIComponent(lakehouseName)}/contents`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        ...credentials,
        workspace_name: workspaceName,
        lakehouse_name: lakehouseName,
        path: credentials.path || "Files",
      }),
    }
  );
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch folder contents");
  return result;
};

export const navigateBack = async (
  workspaceName: string,
  lakehouseName: string,
  currentPath: string,
  credentials: OneLakeCredentials
): Promise<OneLakeFolderContents> => {
  const res = await fetch(
    `${API_BASE}/workspaces/${encodeURIComponent(workspaceName)}/lakehouses/${encodeURIComponent(lakehouseName)}/navigate-back?current_path=${encodeURIComponent(currentPath)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(credentials),
    }
  );
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to navigate back");
  return result;
};


// ---------------- ONELAKE ----------------
export interface OneLakeCredentials {
  tenant_id: string;
  client_id: string;
  client_secret: string;
}

export interface OneLakeFolderContents {
  folders: string[];
  files: Array<{ [key: string]: string }>;
  current_path: string;
}

export const getOneLakeTables = async (
  workspaceName: string,
  lakehouseName: string,
  credentials: OneLakeCredentials
): Promise<{
  success: boolean;
  message: string;
  tables: Array<{ [key: string]: string }>;
  current_path: string;
}> => {
  const res = await fetch(
    `${API_BASE}/workspaces/${encodeURIComponent(workspaceName)}/lakehouses/${encodeURIComponent(lakehouseName)}/tables`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(credentials),
    }
  );
  const result = await safeJsonParse(res);
  if (!res.ok) throw new Error(result.detail || "Failed to fetch tables");
  return result;
};

// ---------------- DATABASE ----------------

export interface DatabaseCredentials {
  server: string;
  database: string;
  username: string;
  password: string;
}

export interface ListTablesResponse {
  success?: boolean;
  tables?: string[];
  message?: string;
}

export const listDatabaseTables = async (
  credentials: DatabaseCredentials
): Promise<ListTablesResponse> => {
  const res = await fetch(`${API_BASE}/list-tables-sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(credentials),
  });

  const result = await safeJsonParse(res);
  if (!res.ok) {
    throw new Error(result.detail || "Failed to list tables");
  }

  return result;
};
