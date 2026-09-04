import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Plug,
  X,
} from "lucide-react";

import type {
  ConnectionValues,
} from "./ModernizeShared";

export type Field = {
  key: string;
  label: string;
  placeholder?: string;
  secret?: boolean;
  optional?: boolean;
};

export const FIELDS: Record<string, Field[]> = {
  sqlserver: [
    {
      key: "host",
      label: "Server / Host",
      placeholder: "XXXXXXX",
    },
    {
      key: "database",
      label: "Database",
      placeholder: "XXXX",
    },
    {
      key: "username",
      label: "Username",
      placeholder: "XXXX",
    },
    {
      key: "password",
      label: "Password",
      secret: true,
    },
  ],

  sap: [
    {
      key: "sap_host",
      label: "SAP Host",
      placeholder: "xxxxx.hana.ondemand.com",
    },
    {
      key: "sap_port",
      label: "Port",
      placeholder: "XXX",
    },
    {
      key: "sap_username",
      label: "Username",
      placeholder: "XXXXXX",
    },
    {
      key: "sap_password",
      label: "Password",
      secret: true,
    },
  ],

  snowflake: [
    {
      key: "account_identifier",
      label: "Account Identifier",
      placeholder: "XXXXXXX",
    },
    {
      key: "username",
      label: "Username",
    },
    {
      key: "password",
      label: "Password",
      secret: true,
    },
    {
      key: "warehouse",
      label: "Warehouse",
      placeholder: "XXXX",
    },
  ],

  azure: [
    {
      key: "connection_string",
      label: "Connection String",
      placeholder: "DefaultEndpointsProtocol=...",
      secret: true,
    },
  ],

  fabric: [
    {
      key: "tenant_id",
      label: "Tenant ID",
      placeholder: "XXXXXXX"
    },
    {
      key: "client_id",
      label: "Client ID",
      placeholder: "XXXXXXX"
    },
    {
      key: "client_secret",
      label: "Client Secret",
      secret: true,
    },
  ],

  databricks: [
    {
      key: "host",
      label: "Workspace Host",
      placeholder: "adb-1234.azuredatabricks.net",
    },
    {
      key: "warehouse_id",
      label: "XXXXX",
    },
    {
      key: "access_token",
      label: "Access Token",
      secret: true,
    },
  ],
};

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  connectionName: string;
  onConnect: (values: ConnectionValues) => void;
}

export default function ConnectionDialog({
  open,
  onOpenChange,
  connectionId,
  connectionName,
  onConnect,
}: ConnectionDialogProps) {
  const [values, setValues] =
    useState<ConnectionValues>({});

  const [reveal, setReveal] =
    useState<Record<string, boolean>>({});

  const [busy, setBusy] =
    useState(false);

  useEffect(() => {
    if (!open) {
      setValues({});
      setReveal({});
      setBusy(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const fields =
    FIELDS[connectionId] ?? [];

  const valid = fields.every(
    (field) =>
      field.optional ||
      (values[field.key] ?? "").trim() !== ""
  );

  const submit = () => {
    setBusy(true);

    /*
     * No API call here.
     *
     * ConnectionDialog is only responsible for
     * collecting the connector credentials.
     *
     * SourceConnection / TargetConnection will
     * handle the actual connector APIs.
     */
    window.setTimeout(() => {
      setBusy(false);

      onConnect(values);

      onOpenChange(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl">

        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            <Plug className="h-5 w-5" />
          </span>

          <div className="flex-1">
            <h2 className="font-semibold text-foreground">
              Connect to {connectionName}
            </h2>

            <p className="text-xs text-muted-foreground">
              Credentials are used only to read metadata.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">

          {fields.map((field) => (
            <div
              key={field.key}
              className="space-y-1.5"
            >
              <label
                htmlFor={field.key}
                className="text-sm font-medium text-foreground"
              >
                {field.label}

                {field.optional && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (optional)
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  id={field.key}
                  type={
                    field.secret &&
                    !reveal[field.key]
                      ? "password"
                      : "text"
                  }
                  value={
                    values[field.key] ?? ""
                  }
                  placeholder={
                    field.placeholder ?? ""
                  }
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]:
                        event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-11 text-sm text-foreground outline-none focus:border-primary"
                />

                {field.secret && (
                  <button
                    type="button"
                    onClick={() =>
                      setReveal((current) => ({
                        ...current,
                        [field.key]:
                          !current[field.key],
                      }))
                    }
                    aria-label={
                      reveal[field.key]
                        ? "Hide value"
                        : "Show value"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {reveal[field.key] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!valid || busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md disabled:opacity-50"
          >
            {busy && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {busy
              ? "Connecting..."
              : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}