import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/*
 * ============================================================
 * CONNECTION VALUES
 * ============================================================
 *
 * Shared by:
 * - SourceConnection
 * - TargetConnection
 * - ConnectionDialog
 * - create-session flow
 */
export interface ConnectionValues {
  source_type?: string;
  target_type?: string;

  // SQL Server
  host?: string;
  server?: string;
  database?: string;
  username?: string;
  password?: string;
  schema?: string;
  schemas?: string[];
  tables?: string[];
  auth_mode?: "windows" | "sql";

  // Generic/backend values
  port?: number | string;
  authentication?: string;
  driver?: string;
  odbc_extra?: string;
  role?: string;
  account?: string;

  // Snowflake
  account_identifier?: string;
  warehouse?: string;

  // SAP
  sap_host?: string;
  sap_port?: string;
  sap_username?: string;
  sap_password?: string;

  // Azure
  connection_string?: string;
  container?: string;

  // Fabric / OneLake
  tenant_id?: string;
  client_id?: string;
  client_secret?: string;
  workspace_name?: string;
  lakehouse_name?: string;

  // Databricks
  warehouse_id?: string;
  access_token?: string;
  catalog?: string;
}

/*
 * ============================================================
 * METADATA ANALYSIS TYPES
 * ============================================================
 */

export type TableRole =
  | "dimension"
  | "fact"
  | "bridge"
  | "unknown";

export interface AnalysisTable {
  schema: string;
  name: string;
  role: TableRole;
  grain: string;
  related_tables: string[];
  outgoing_fk_count: number;
  incoming_fk_count: number;
}

export interface AnalysisRelationship {
  from_table: string;
  from_columns: string[];
  to_table: string;
  to_columns: string[];
  constraint_name: string;
  cardinality: string;
}

export interface MetadataAnalysisResult {
  summary: string;
  tables: AnalysisTable[];
  relationships: AnalysisRelationship[];
  saved_to?: string;
}

export type SourceMetadata = MetadataAnalysisResult;
export type TargetMetadata = MetadataAnalysisResult;

/*
 * ============================================================
 * SHARED UI COMPONENTS
 * ============================================================
 */

export function StepHeader({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {title}
      </h1>

      <p className="text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}

export function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-3xl font-bold text-primary">
        {value}
      </div>

      <div className="mt-1 text-sm text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function Footer({
  onBack,
  onNext,
  nextLabel = "Continue",
  disabled,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
      {onBack ? (
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : (
        <span />
      )}

      {onNext && (
        <Button
          onClick={onNext}
          disabled={disabled}
          className="rounded-full"
        >
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function ConnectedBar({
  name,
  detail,
  onChange,
}: {
  name: string;
  detail: string;
  onChange: () => void;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
      <div className="flex h-6 w-6 items-center justify-center">
        ✓
      </div>

      <div className="flex-1">
        <div className="font-semibold text-foreground">
          Connected to {name}
        </div>

        <div className="text-sm text-muted-foreground">
          {detail}
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
      >
        Edit connection
      </button>
    </div>
  );
}