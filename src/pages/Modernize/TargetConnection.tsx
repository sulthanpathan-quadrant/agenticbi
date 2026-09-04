import { useState } from "react";
import { Database, Loader2, Table2 } from "lucide-react";
import { Card } from "@/components/ui/card";

import ConnectionDialog from "./ConnectionDialog";

import {
  Footer,
  StepHeader,
  type ConnectionValues,
} from "./ModernizeShared";
import {
  SchemaPickerDialog,
  SchemaPickerTableOption,
  SchemaConnectorType,
} from "./SchemaPickerDialog";

import { toast } from "@/hooks/use-toast";

const TARGETS = [
  {
    id: "fabric",
    name: "Fabric (OneLake)",
    sub: "Lakehouse UDM",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    sub: "Cloud Warehouse",
  },
  {
    id: "databricks",
    name: "Databricks",
    sub: "Unity Catalog",
  },
];

const SENSITIVE_CREDENTIAL_KEYS = new Set([
  "password",
  "sap_password",
  "client_secret",
  "access_token",
]);

const SOURCE_STORAGE_KEY = "modernize_source_connection";
const TARGET_STORAGE_KEY = "modernize_target_connection";

interface TargetConnectionProps {
  value: ConnectionValues | null;
  sourceConfig: ConnectionValues | null;
  onConnected: (config: ConnectionValues) => void;
  onSessionCreated: (sessionId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

interface CreateSessionPayload {
  source: Record<string, unknown>;
  target: Record<string, unknown>;
  env_file: string;
  llm: {
    provider: string;
    model: string;
    max_retries: number;
    request_timeout_s: number;
  };
  use_demo_data: boolean;
}

export default function TargetConnection({
  value,
  sourceConfig,
  onConnected,
  onSessionCreated,
  onBack,
  onNext,
}: TargetConnectionProps) {
  const [target, setTarget] = useState<string | null>(
    value?.target_type ?? null
  );

  const [connected, setConnected] = useState<string | null>(
    value?.target_type ?? null
  );

  const [creds, setCreds] = useState<ConnectionValues>(
    value ?? {}
  );

  const [dialogFor, setDialogFor] =
    useState<string | null>(null);

  const [schemaPickerOpen, setSchemaPickerOpen] =
    useState(false);

  const [creatingSession, setCreatingSession] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const targetName =
    TARGETS.find(
      (item) => item.id === connected
    )?.name ?? "";

  /*
   * ---------------------------------------------------------
   * CONNECTION SUCCESS
   * ---------------------------------------------------------
   */
  const handleConnect = (
    values: ConnectionValues
  ) => {
    if (!dialogFor) {
      return;
    }

    const connectorType = dialogFor;

    const config: ConnectionValues = {
      ...values,
      target_type: connectorType,
    };

    setCreds(config);
    setConnected(connectorType);
    setError(null);

    sessionStorage.setItem(
      TARGET_STORAGE_KEY,
      JSON.stringify(config)
    );

    onConnected(config);

    setDialogFor(null);

    const connectedName =
      TARGETS.find((item) => item.id === connectorType)?.name ??
      connectorType;

    toast({
      title: `Connected to ${connectedName}`,
      description: "Select a schema to load its tables.",
    });

    /*
     * All three targets (Fabric, Snowflake, Databricks) use the
     * schema-only picker: pick a schema/lakehouse, every table
     * inside it is included automatically.
     */
    setSchemaPickerOpen(true);
  };

  /*
   * ---------------------------------------------------------
   * SCHEMA PICKER SELECTION
   * ---------------------------------------------------------
   */
  const handleSchemaPickerSelect = (
    tables: SchemaPickerTableOption[],
    pickerCredentials?: Record<string, unknown>
  ) => {
    const selectedTables = tables.map((table) => table.fullPath);

    const config: ConnectionValues = {
      ...creds,
      target_type: connected ?? "",
      tables: selectedTables,
    };

    if (pickerCredentials) {
      Object.entries(pickerCredentials).forEach(([key, val]) => {
        if (
          typeof val === "string" &&
          !SENSITIVE_CREDENTIAL_KEYS.has(key)
        ) {
          config[key] = val;
        }
      });
    }

    setCreds(config);

    sessionStorage.setItem(
      TARGET_STORAGE_KEY,
      JSON.stringify(config)
    );

    onConnected(config);

    setSchemaPickerOpen(false);
  };

  /*
   * ---------------------------------------------------------
   * CREATE SESSION
   * ---------------------------------------------------------
   */
  const createSession = async () => {
    if (!connected) {
      return;
    }

    setCreatingSession(true);
    setError(null);

    try {
      /*
       * Always read the latest source configuration
       * from sessionStorage.
       *
       * This guarantees that the credentials collected
       * in SourceConnection are available here.
       */
      const storedSource =
        sessionStorage.getItem(
          SOURCE_STORAGE_KEY
        );

      const storedTarget =
        sessionStorage.getItem(
          TARGET_STORAGE_KEY
        );

      const source =
        storedSource
          ? JSON.parse(storedSource)
          : sourceConfig;

      const targetConfig =
        storedTarget
          ? JSON.parse(storedTarget)
          : creds;

      if (!source) {
        throw new Error(
          "Source connection details are missing."
        );
      }

      if (!targetConfig) {
        throw new Error(
          "Target connection details are missing."
        );
      }

      /*
       * -----------------------------------------------------
       * SOURCE PAYLOAD
       * -----------------------------------------------------
       *
       * Backend /sessions expects:
       *
       * source.type
       * source.host
       * source.port
       * source.database
       * source.schemas
       * source.authentication
       * source.driver
       * source.odbc_extra
       * source.username
       * source.password
       */
      const sourcePayload: Record<string, unknown> = {
        type:
          source.source_type ?? "",
        host:
          source.host ?? source.server ?? "",
        port:
          source.port
            ? Number(source.port)
            : 1433,
        database:
          source.database ?? "",
        schemas:
          source.schemas ??
          (source.schema
            ? [source.schema]
            : []),
        authentication:
          source.auth_mode ?? "sql",
        driver:
          source.driver ??
          "ODBC Driver 17 for SQL Server",
        odbc_extra:
          source.odbc_extra ??
          "Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30",
        username:
          source.username ?? "",
        password:
          source.password ?? "",
      };

      /*
       * -----------------------------------------------------
       * TARGET PAYLOAD
       * -----------------------------------------------------
       *
       * Backend /sessions expects:
       *
       * target.type
       * target.account
       * target.database
       * target.schema
       * target.warehouse
       * target.role
       * target.username
       * target.password
       */
      const targetPayload: Record<string, unknown> = {
        type:
          targetConfig.target_type ?? "",
        account:
          targetConfig.account ??
          targetConfig.account_identifier ??
          "",
        database:
          targetConfig.database ?? "",
        schema:
          targetConfig.schema ?? "",
        warehouse:
          targetConfig.warehouse ?? "",
        role:
          targetConfig.role ??
          "ACCOUNTADMIN",
        username:
          targetConfig.username ?? "",
        password:
          targetConfig.password ?? "",
      };

      const payload: CreateSessionPayload = {
        source: sourcePayload,
        target: targetPayload,

        /*
         * Keep these values aligned with the backend
         * /sessions contract you provided.
         */
        env_file: ".env",

        llm: {
          provider: "anthropic",
          model: "claude-sonnet-4-5",
          max_retries: 3,
          request_timeout_s: 120,
        },

        use_demo_data: false,
      };

      console.log(
        "Creating migration session:",
        {
          ...payload,
          source: {
            ...sourcePayload,
            password: "***",
          },
          target: {
            ...targetPayload,
            password: "***",
          },
        }
      );

      /*
       * -----------------------------------------------------
       * CALL BACKEND
       * -----------------------------------------------------
       */
      const response = await fetch(
        "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
          result?.message ||
          "Failed to create migration session."
        );
      }

      if (!result?.session_id) {
        throw new Error(
          "Session was created but no session_id was returned."
        );
      }

      /*
       * -----------------------------------------------------
       * SUCCESS
       * -----------------------------------------------------
       */

      const newSessionId =
        String(result.session_id);

      /*
       * Pass session ID to ModernizeData.
       */
      onSessionCreated(newSessionId);

      /*
       * IMPORTANT:
       * Only clear credentials AFTER /sessions succeeds.
       */
      sessionStorage.removeItem(
        SOURCE_STORAGE_KEY
      );

      sessionStorage.removeItem(
        TARGET_STORAGE_KEY
      );

      /*
       * Continue to Metadata Analysis.
       */
      onNext();
    } catch (err) {
      console.error(
        "Create session failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create migration session."
      );
    } finally {
      setCreatingSession(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * TARGET CARD CLICK
   * ---------------------------------------------------------
   */
  const handleTargetClick = (
    targetId: string
  ) => {
    setTarget(targetId);
    setConnected(null);
    setDialogFor(targetId);
    setSchemaPickerOpen(false);
    setError(null);

    /*
     * Previous target configuration is no longer valid.
     */
    sessionStorage.removeItem(
      TARGET_STORAGE_KEY
    );
  };

  /*
   * ---------------------------------------------------------
   * CONTINUE
   * ---------------------------------------------------------
   */
  const handleNext = () => {
    if (
      connected === null ||
      creatingSession
    ) {
      return;
    }

    /*
     * Create the backend session first.
     */
    void createSession();
  };

  /*
   * Credentials shape expected by the schema picker's
   * underlying api.ts calls, per target connector.
   */
  const schemaPickerConnectorType: SchemaConnectorType | null =
    connected === "fabric"
      ? "fabric"
      : connected === "snowflake"
      ? "snowflake"
      : connected === "databricks"
      ? "databricks"
      : null;

  const schemaPickerCredentials =
    connected === "fabric"
      ? {
          tenant_id: creds.tenant_id ?? "",
          client_id: creds.client_id ?? "",
          client_secret: creds.client_secret ?? "",
        }
      : connected === "snowflake"
      ? {
          account_identifier: creds.account_identifier ?? "",
          username: creds.username ?? "",
          password: creds.password ?? "",
          warehouse: creds.warehouse ?? "",
        }
      : connected === "databricks"
      ? {
          host: creds.host ?? "",
          warehouse_id: creds.warehouse_id ?? "",
          access_token: creds.access_token ?? "",
        }
      : null;

  return (
    <section>
      <StepHeader
        title="Connect the Target UDM"
        desc="Pick the platform holding your UDM and connect to it before reviewing source and target metadata."
      />

      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Select a Target
      </h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {TARGETS.map((item) => {
          const isSelected =
            target === item.id;

          return (
            <Card
              key={item.id}
              className={`group cursor-pointer border border-border p-6 transition-colors ${
                isSelected
                  ? "border-primary bg-accent/30"
                  : "hover:bg-accent/30"
              }`}
              onClick={() =>
                handleTargetClick(item.id)
              }
            >
              <div className="flex flex-col items-center space-y-3 text-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card group-hover:border-primary"
                  }`}
                >
                  <Database
                    className={`h-6 w-6 transition-colors ${
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.sub}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/*
       * -------------------------------------------------------
       * SELECTED TABLES — list view (replaces the old chip/pill
       * layout). Renders as soon as the schema picker resolves
       * tables, right after the modal closes.
       * -------------------------------------------------------
       */}
      {connected !== null &&
        creds.tables &&
        creds.tables.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {creds.schema ? `${creds.schema} — ` : ""}
              Selected tables ({creds.tables.length})
            </p>

            <div className="overflow-hidden rounded-xl border border-border divide-y divide-border">
              {creds.tables.map((table) => (
                <div
                  key={table}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground"
                >
                  <Table2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{table}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {error && (
        <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/*
       * -------------------------------------------------------
       * SCHEMA PICKER (schema-only, new component — replaces
       * FilePickerDialog for all three targets)
       * -------------------------------------------------------
       */}
      {schemaPickerConnectorType && (
        <SchemaPickerDialog
          open={schemaPickerOpen}
          onOpenChange={setSchemaPickerOpen}
          connectorType={schemaPickerConnectorType}
          connectorLabel={targetName}
          credentials={schemaPickerCredentials}
          onSelect={handleSchemaPickerSelect}
        />
      )}

      <ConnectionDialog
        open={dialogFor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialogFor(null);
          }
        }}
        connectionId={
          dialogFor ?? ""
        }
        connectionName={
          TARGETS.find(
            (item) =>
              item.id === dialogFor
          )?.name ?? ""
        }
        onConnect={handleConnect}
      />

      <Footer
        onBack={onBack}
        onNext={handleNext}
        disabled={
          connected === null ||
          creatingSession
        }
        nextLabel={
          creatingSession
            ? "Creating session..."
            : "Continue to metadata analysis"
        }
      />

      {creatingSession && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating migration session...
        </div>
      )}
    </section>
  );
}
