import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";


import {
  S3Credentials,
  AzureCredentials,
  OneLakeCredentials,
  DatabricksCredentials,
  SnowflakeCredentials,
} from "@/components/api/api";

interface SourceCredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  sourceId: string;
  onProceed: (credentials: S3Credentials | AzureCredentials | OneLakeCredentials | DatabricksCredentials | SnowflakeCredentials) => void;
}

export function SourceCredentialDialog({
  open,
  onOpenChange,
  sourceName,
  sourceId,
  onProceed,
}: SourceCredentialDialogProps) {
  const [isValidating, setIsValidating] = useState(false);


  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("us-east-1");


  const [connectionString, setConnectionString] = useState("");


  const [tenantId, setTenantId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const [host, setHost] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [warehouse, setWarehouse] = useState("");



  const handleProceed = async () => {
    setIsValidating(true);


    await new Promise(resolve => setTimeout(resolve, 800));

    if (sourceId === "s3") {
      const credentials: S3Credentials = {
        aws_access_key_id: accessKeyId,
        aws_secret_access_key: secretAccessKey,
        region,
      };
      onProceed(credentials);
    }

    else if (sourceId === "azure") {
      const credentials: AzureCredentials = {
        connection_string: connectionString,
      };
      onProceed(credentials);
    }

    else if (sourceId === "onelake") {
  const credentials: OneLakeCredentials = {
    tenant_id: tenantId,
    client_id: clientId,
    client_secret: clientSecret,
  };
  onProceed(credentials);
}

else if (sourceId === "databricks") {
  const credentials: DatabricksCredentials = {
    host: host,
    warehouse_id: warehouseId,
    access_token: accessToken,
  };
  onProceed(credentials);
}
else if (sourceId === "snowflake") {  // ADD
  const credentials: SnowflakeCredentials = {
    account_identifier: accountIdentifier,
    username: username,
    password: password,
    warehouse: warehouse,
  };
  onProceed(credentials);
}


    setIsValidating(false);
    onOpenChange(false);
  };


  const handleClose = () => {
    setAccessKeyId("");
    setSecretAccessKey("");
    setRegion("us-east-1");

    setConnectionString("");

    setTenantId("");
    setClientId("");
    setClientSecret("");

    setHost("");
    setWarehouseId("");
    setAccessToken("");


    setAccountIdentifier("");
    setUsername("");
    setPassword("");
    setWarehouse("");

    onOpenChange(false);
  };


  const isFormValid = () => {
    if (sourceId === "s3") {
      return accessKeyId && secretAccessKey && region;
    }
    if (sourceId === "azure") {
      return connectionString.trim() !== "";
    }
    if (sourceId === "onelake") {
      return tenantId && clientId && clientSecret;
    }
    if (sourceId === "databricks") {
      return host && warehouseId && accessToken;
    }
    if (sourceId === "snowflake") { 
      return accountIdentifier && username && password && warehouse;
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to {sourceName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">


          {sourceId === "s3" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accessKeyId">AWS Access Key ID</Label>
                <Input
                  id="accessKeyId"
                  type="password"
                  placeholder="XXXXXXXXX"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretAccessKey">AWS Secret Access Key</Label>
                <Input
                  id="secretAccessKey"
                  type="password"
                  placeholder="XXXXXXXXXXX"
                  value={secretAccessKey}
                  onChange={(e) => setSecretAccessKey(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  type="text"
                  placeholder="XXXXXX"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  disabled={isValidating}
                />
              </div>
            </>
          )}


          {sourceId === "azure" && (
            <div className="space-y-2">
              <Label htmlFor="connectionString">Connection String</Label>
              <Input
                id="connectionString"
                type="password"
                placeholder="XXXXXXXX"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                disabled={isValidating}
              />
              <p className="text-xs text-muted-foreground">
                Format: DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=...
              </p>
            </div>
          )}

          {/* ---------------------- */}
          {/* OneLake Credentials */}
          {/* ---------------------- */}
          {sourceId === "onelake" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant ID</Label>
                <Input
                  id="tenantId"
                  type="password"
                  placeholder="xxxxxxxx"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  type="password"
                  placeholder="xxxxxxx"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Enter your client secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  disabled={isValidating}
                />
              </div>
            </>
          )}
          {/* Databricks Credentials */}
          {sourceId === "databricks" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  type="text"
                  placeholder="XXXXXXXXX"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouseId">Warehouse ID</Label>
                <Input
                  id="warehouseId"
                  type="text"
                  placeholder="XXXXXXXXX"
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="********"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  disabled={isValidating}
                />
              </div>
            </>
          )}

          {/* Snowflake Credentials */}
          {sourceId === "snowflake" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accountIdentifier">Account Identifier</Label>
                <Input
                  id="accountIdentifier"
                  type="text"
                  placeholder="XXXXXXXX"
                  value={accountIdentifier}
                  onChange={(e) => setAccountIdentifier(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="XXXXXXX"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isValidating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Input
                  id="warehouse"
                  type="text"
                  placeholder="XXXXXXXX"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  disabled={isValidating}
                />
              </div>
            </>
          )}
          {!["s3", "azure", "onelake", "databricks", "snowflake"].includes(sourceId) && (
            <div className="text-center py-4 text-muted-foreground">
              Credentials configuration for {sourceName} coming soon.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isValidating}>
            Cancel
          </Button>

          <Button onClick={handleProceed} disabled={!isFormValid() || isValidating}>
            {isValidating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isValidating ? "Validating..." : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

