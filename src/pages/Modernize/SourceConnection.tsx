import { useState } from "react";
import { Database, Table2 } from "lucide-react";
import { Card } from "@/components/ui/card";

import ConnectionDialog from "./ConnectionDialog";
import { FilePickerDialog } from "@/components/FilePickerDialog";

import {
  ConnectedBar,
  Footer,
  StepHeader,
  type ConnectionValues,
} from "./ModernizeShared";

import {
  SchemaPickerDialog,
  SchemaPickerTableOption,
} from "./SchemaPickerDialog";

import { toast } from "@/hooks/use-toast";
import { SqlServerCredentials, SqlServerPickerDialog, SqlServerTableOption } from "./SqlServerPickerDialog";

const SOURCES = [
  {
    id: "sqlserver",
    name: "SQL Server",
    sub: "On-prem / JDBC",
  },
  {
    id: "sap",
    name: "SAP",
    sub: "HANA / OData",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    sub: "Cloud Warehouse",
  },
  {
    id: "azure",
    name: "Azure Blob",
    sub: "Cloud Storage",
  },
];

/*
 * Connectors that use the schema-only picker (SchemaPickerDialog).
 * SQL Server has its own dedicated dialog. Azure keeps using the
 * existing FilePickerDialog unchanged, since it's blob storage and
 * has no schema/table concept.
 */
const SCHEMA_PICKER_SOURCES = new Set(["sap", "snowflake"]);

const SENSITIVE_CREDENTIAL_KEYS = new Set([
  "password",
  "sap_password",
  "client_secret",
  "access_token",
]);

const SOURCE_STORAGE_KEY = "modernize_source_connection";

interface SourceConnectionProps {
  value: ConnectionValues | null;
  onConnected: (config: ConnectionValues) => void;
  onNext: () => void;
}

export default function SourceConnection({
  value,
  onConnected,
  onNext,
}: SourceConnectionProps) {
  const [source, setSource] = useState<string | null>(
    value?.source_type ?? null
  );

  const [connected, setConnected] = useState<string | null>(
    value?.source_type ?? null
  );

  const [creds, setCreds] = useState<ConnectionValues>(
    value ?? {}
  );

  const [dialogFor, setDialogFor] =
    useState<string | null>(null);

  const [filePickerOpen, setFilePickerOpen] =
    useState(false);

  const [sqlServerPickerOpen, setSqlServerPickerOpen] =
    useState(false);

  const [schemaPickerOpen, setSchemaPickerOpen] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const sourceName =
    SOURCES.find(
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
      source_type: connectorType,
    };

    setCreds(config);
    setConnected(connectorType);
    setError(null);

    /*
     * Store credentials immediately.
     *
     * They remain in sessionStorage until the
     * /sessions API succeeds (handled in the
     * target step).
     */
    sessionStorage.setItem(
      SOURCE_STORAGE_KEY,
      JSON.stringify(config)
    );

    onConnected(config);

    setDialogFor(null);

    const connectedName =
      SOURCES.find((item) => item.id === connectorType)?.name ??
      connectorType;

    if (connectorType === "sqlserver") {
      /*
       * No "connected" card for SQL Server — a toast
       * confirms the connection instead, then the schema
       * picker opens.
       */
      toast({
        title: "Connected to SQL Server",
        description: "Select a schema to load its tables.",
      });

      setSqlServerPickerOpen(true);
    } else if (SCHEMA_PICKER_SOURCES.has(connectorType)) {
      /*
       * SAP / Snowflake: schema-only picker, same no-card /
       * toast treatment as SQL Server.
       */
      toast({
        title: `Connected to ${connectedName}`,
        description: "Select a schema to load its tables.",
      });

      setSchemaPickerOpen(true);
    } else {
      /*
       * Azure Blob: unchanged, still uses FilePickerDialog
       * and the ConnectedBar card.
       */
      setFilePickerOpen(true);
    }
  };

  /*
   * ---------------------------------------------------------
   * SAVE SOURCE CONFIGURATION
   * ---------------------------------------------------------
   */
  const saveSourceConfiguration = (
    extra: Partial<ConnectionValues> = {}
  ) => {
    const config: ConnectionValues = {
      ...creds,
      source_type: connected ?? "",
      tables:
        extra.tables ??
        creds.tables ??
        [],
      ...extra,
    };

    setCreds(config);

    sessionStorage.setItem(
      SOURCE_STORAGE_KEY,
      JSON.stringify(config)
    );

    onConnected(config);
  };

  /*
   * ---------------------------------------------------------
   * FILE PICKER SELECTION (Azure only now)
   * ---------------------------------------------------------
   *
   * Do NOT recreate this logic. FilePicker already owns
   * these APIs.
   */
  const handleFilePickerSelect = (
    files: Array<{
      id: string;
      name: string;
      fullPath?: string;
      size: string;
      rows: string;
    }>,
    pickerCredentials?: unknown
  ) => {
    const selectedNames = files.map(
      (file) =>
        file.fullPath ??
        file.name ??
        file.id
    );

    const returnedCredentials =
      pickerCredentials &&
      typeof pickerCredentials === "object"
        ? (pickerCredentials as Record<string, unknown>)
        : {};

    const extra: Partial<ConnectionValues> = {
      tables: selectedNames,
    };

    if (
      typeof returnedCredentials.database ===
      "string"
    ) {
      extra.database =
        returnedCredentials.database;
    }

    if (
      typeof returnedCredentials.schema ===
      "string"
    ) {
      extra.schema =
        returnedCredentials.schema;
    }

    Object.entries(returnedCredentials).forEach(
      ([key, val]) => {
        if (
          typeof val === "string" &&
          !SENSITIVE_CREDENTIAL_KEYS.has(key)
        ) {
          (extra as Record<string, string>)[key] =
            val;
        }
      }
    );

    saveSourceConfiguration(extra);
    setFilePickerOpen(false);
  };

  /*
   * ---------------------------------------------------------
   * SQL SERVER PICKER SELECTION
   * ---------------------------------------------------------
   *
   * Every table returned here belongs to the schema the user
   * picked — there was no per-table selection step.
   */
  const handleSqlServerSelect = (
    tables: SqlServerTableOption[],
    pickerCredentials?: SqlServerCredentials & {
      schema?: string | null;
    }
  ) => {
    const extra: Partial<ConnectionValues> = {
      tables: tables.map((table) => table.fullPath),
    };

    if (pickerCredentials?.schema) {
      extra.schema = pickerCredentials.schema;
    }

    saveSourceConfiguration(extra);
    setSqlServerPickerOpen(false);
  };

  /*
   * ---------------------------------------------------------
   * SCHEMA PICKER SELECTION (SAP / Snowflake)
   * ---------------------------------------------------------
   *
   * Every table returned here belongs to the schema the user
   * picked — there is no per-table selection step.
   */
  const handleSchemaPickerSelect = (
    tables: SchemaPickerTableOption[],
    pickerCredentials?: Record<string, unknown>
  ) => {
    const extra: Partial<ConnectionValues> = {
      tables: tables.map((table) => table.fullPath),
    };

    if (pickerCredentials) {
      Object.entries(pickerCredentials).forEach(([key, val]) => {
        if (
          typeof val === "string" &&
          !SENSITIVE_CREDENTIAL_KEYS.has(key)
        ) {
          (extra as Record<string, string>)[key] = val;
        }
      });
    }

    saveSourceConfiguration(extra);
    setSchemaPickerOpen(false);
  };

  /*
   * ---------------------------------------------------------
   * SOURCE CARD CLICK
   * ---------------------------------------------------------
   */
  const handleSourceClick = (
    sourceId: string
  ) => {
    setSource(sourceId);
    setConnected(null);
    setDialogFor(sourceId);
    setFilePickerOpen(false);
    setSqlServerPickerOpen(false);
    setSchemaPickerOpen(false);
    setError(null);

    sessionStorage.removeItem(
      SOURCE_STORAGE_KEY
    );
  };

  /*
   * ---------------------------------------------------------
   * CONTINUE
   * ---------------------------------------------------------
   */
  const handleNext = () => {
    if (!connected) return;

    onNext();
  };

  /*
   * SAP / Snowflake credentials shape expected by the schema
   * picker's underlying api.ts calls.
   */
  const schemaPickerConnectorType =
    connected === "sap"
      ? "sap"
      : connected === "snowflake"
      ? "snowflake"
      : null;

  const schemaPickerCredentials =
    connected === "snowflake"
      ? {
          account_identifier: creds.account_identifier ?? "",
          username: creds.username ?? "",
          password: creds.password ?? "",
          warehouse: creds.warehouse ?? "",
        }
      : connected === "sap"
      ? {
          sap_host: creds.sap_host ?? "",
          sap_port: Number(creds.sap_port ?? 0),
          sap_username: creds.sap_username ?? "",
          sap_password: creds.sap_password ?? "",
        }
      : null;

  return (
    <section>
      <StepHeader
        title="Connect to the Data Source"
        desc="Connect the system you are migrating from, then continue to connect the target UDM."
      />

      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Select a Source
      </h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SOURCES.map((item) => {
          const isSelected =
            source === item.id;

          return (
            <Card
              key={item.id}
              className={`cursor-pointer border border-border p-6 transition-colors group ${
                isSelected
                  ? "border-primary bg-accent/30"
                  : "hover:bg-accent/30"
              }`}
              onClick={() =>
                handleSourceClick(item.id)
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
       * SQL Server, SAP, and Snowflake all skip the "connected"
       * card — a toast confirms the connection instead (see
       * handleConnect above). Azure keeps the card.
       */}
      {connected && connected === "azure" && (
        <ConnectedBar
          name={sourceName}
          detail="Metadata access only — no rows are read from the source."
          onChange={() =>
            setDialogFor(connected)
          }
        />
      )}

      {/*
       * -------------------------------------------------------
       * SELECTED TABLES — list view (replaces the old chip/pill
       * layout). Renders as soon as the schema picker (or the
       * Azure file picker) resolves tables, right after the
       * corresponding modal closes.
       * -------------------------------------------------------
       */}
      {connected &&
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
       * SQL SERVER PICKER (dedicated, schema-only)
       * -------------------------------------------------------
       */}
      {connected === "sqlserver" && (
        <SqlServerPickerDialog
          open={sqlServerPickerOpen}
          onOpenChange={setSqlServerPickerOpen}
          credentials={{
            host: creds.host ?? "",
            database: creds.database ?? "",
            username: creds.username ?? "",
            password: creds.password ?? "",
          }}
          onSelect={handleSqlServerSelect}
        />
      )}

      {/*
       * -------------------------------------------------------
       * SAP / SNOWFLAKE PICKER (schema-only, new component —
       * FilePickerDialog is left completely unmodified)
       * -------------------------------------------------------
       */}
      {schemaPickerConnectorType && (
        <SchemaPickerDialog
          open={schemaPickerOpen}
          onOpenChange={setSchemaPickerOpen}
          connectorType={schemaPickerConnectorType}
          connectorLabel={sourceName}
          credentials={schemaPickerCredentials}
          onSelect={handleSchemaPickerSelect}
        />
      )}

      {/*
       * -------------------------------------------------------
       * AZURE FILE PICKER
       * -------------------------------------------------------
       *
       * Unchanged — still uses the original FilePickerDialog.
       * Do NOT recreate this logic here.
       * -------------------------------------------------------
       */}
      {connected === "azure" && (
        <FilePickerDialog
          open={filePickerOpen}
          onOpenChange={setFilePickerOpen}
          sourceName={sourceName}
          files={[]}
          onSelect={handleFilePickerSelect}
          azureCredentials={{
            connection_string: creds.connection_string ?? "",
          } as any}
          isAzure
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
          SOURCES.find(
            (item) =>
              item.id === dialogFor
          )?.name ?? ""
        }
        onConnect={handleConnect}
      />

      <Footer
        onNext={handleNext}
        disabled={!connected}
        nextLabel="Continue to target"
      />
    </section>
  );
}
