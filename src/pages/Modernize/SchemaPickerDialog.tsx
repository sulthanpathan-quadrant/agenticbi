import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Folder, ArrowLeft, Search } from "lucide-react";

import {
  getOneLakeWorkspaces,
  getOneLakeLakehouses,
  getOneLakeTables,
  OneLakeCredentials,
  getDatabricksCatalogs,
  getDatabricksSchemas,
  getDatabricksTables,
  DatabricksCredentials,
  getSnowflakeDatabases,
  getSnowflakeSchemas,
  getSnowflakeTables,
  SnowflakeCredentials,
  getSapSchemas,
  getSapTables,
  SapCredentials,
} from "@/components/api/api";

import { toast } from "@/hooks/use-toast";

/*
 * ---------------------------------------------------------------
 * SchemaPickerDialog
 * ---------------------------------------------------------------
 * A self-contained replacement flow for connectors that expose a
 * schema-like grouping (Snowflake, Databricks, SAP, Fabric/OneLake).
 *
 * There is no table review/checkbox step. Picking the final
 * "schema" level (schema / lakehouse) immediately fetches every
 * table inside it, hands them to the caller via onSelect, and
 * closes the dialog. This file is intentionally separate from
 * FilePickerDialog.tsx so that component (used elsewhere) is
 * never touched.
 * ---------------------------------------------------------------
 */

export type SchemaConnectorType =
  | "snowflake"
  | "databricks"
  | "sap"
  | "fabric";

export interface SchemaPickerTableOption {
  id: string;
  name: string;
  fullPath: string;
  size: string;
  rows: string;
}

type AnyCredentials =
  | SnowflakeCredentials
  | DatabricksCredentials
  | SapCredentials
  | OneLakeCredentials;

interface SchemaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectorType: SchemaConnectorType;
  connectorLabel: string; // e.g. "Snowflake", "Databricks", "SAP", "Fabric"
  credentials: AnyCredentials | null;
  onSelect: (
    tables: SchemaPickerTableOption[],
    credentials?: Record<string, unknown>
  ) => void;
}

/*
 * Each connector type has either 1 or 2 navigation levels before
 * the schema/lakehouse pick that auto-confirms:
 *   snowflake  -> database  -> schema     (confirm)
 *   databricks -> catalog   -> schema     (confirm)
 *   sap        ->             schema      (confirm)
 *   fabric     -> workspace -> lakehouse  (confirm)
 */
const HAS_PRIMARY_LEVEL: Record<SchemaConnectorType, boolean> = {
  snowflake: true,
  databricks: true,
  sap: false,
  fabric: true,
};

const PRIMARY_LABEL: Record<SchemaConnectorType, string> = {
  snowflake: "Database",
  databricks: "Catalog",
  sap: "",
  fabric: "Workspace",
};

const SECONDARY_LABEL: Record<SchemaConnectorType, string> = {
  snowflake: "Schema",
  databricks: "Schema",
  sap: "Schema",
  fabric: "Lakehouse",
};

export function SchemaPickerDialog({
  open,
  onOpenChange,
  connectorType,
  connectorLabel,
  credentials,
  onSelect,
}: SchemaPickerDialogProps) {
  const [primaryItems, setPrimaryItems] = useState<string[]>([]);
  const [currentPrimary, setCurrentPrimary] = useState<string | null>(null);

  const [secondaryItems, setSecondaryItems] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [pendingSecondary, setPendingSecondary] = useState<string | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");

  const hasPrimary = HAS_PRIMARY_LEVEL[connectorType];

  useEffect(() => {
    if (!open || !credentials) return;

    if (hasPrimary) {
      loadPrimaryItems();
    } else {
      loadSecondaryItems(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setSearchQuery("");
  }, [currentPrimary]);

  const matchesSearch = (name: string) =>
    name.toLowerCase().includes(searchQuery.toLowerCase());

  /*
   * -------------------------------------------------------------
   * LOAD: primary level (database / catalog / workspace)
   * -------------------------------------------------------------
   */
  const loadPrimaryItems = async () => {
    if (!credentials) return;

    setIsLoading(true);

    try {
      let list: string[] = [];

      if (connectorType === "snowflake") {
        list = await getSnowflakeDatabases(
          credentials as SnowflakeCredentials
        );
      } else if (connectorType === "databricks") {
        list = await getDatabricksCatalogs(
          credentials as DatabricksCredentials
        );
      } else if (connectorType === "fabric") {
        list = await getOneLakeWorkspaces(
          credentials as OneLakeCredentials
        );
      }

      setPrimaryItems(list);
    } catch (error: any) {
      toast({
        title: `Failed to Load ${PRIMARY_LABEL[connectorType]}s`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * -------------------------------------------------------------
   * LOAD: secondary level (schema / lakehouse)
   * -------------------------------------------------------------
   */
  const loadSecondaryItems = async (primaryValue: string | null) => {
    if (!credentials) return;

    setIsLoading(true);
    setCurrentPrimary(primaryValue);

    try {
      let list: string[] = [];

      if (connectorType === "snowflake" && primaryValue) {
        list = await getSnowflakeSchemas(
          primaryValue,
          credentials as SnowflakeCredentials
        );
      } else if (connectorType === "databricks" && primaryValue) {
        list = await getDatabricksSchemas(
          primaryValue,
          credentials as DatabricksCredentials
        );
      } else if (connectorType === "fabric" && primaryValue) {
        list = await getOneLakeLakehouses(
          primaryValue,
          credentials as OneLakeCredentials
        );
      } else if (connectorType === "sap") {
        list = await getSapSchemas(credentials as SapCredentials);
      }

      setSecondaryItems(list);
    } catch (error: any) {
      toast({
        title: `Failed to Load ${SECONDARY_LABEL[connectorType]}s`,
        description: error.message,
        variant: "destructive",
      });
      setCurrentPrimary(null);
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * -------------------------------------------------------------
   * SELECT SCHEMA / LAKEHOUSE — fetches every table inside it,
   * hands them to the caller, and closes the dialog. There is
   * no intermediate table review screen.
   * -------------------------------------------------------------
   */
  const handleSecondarySelect = async (secondaryValue: string) => {
    if (!credentials || isConfirming) return;

    setIsConfirming(true);
    setPendingSecondary(secondaryValue);

    try {
      let list: string[] = [];

      if (connectorType === "snowflake" && currentPrimary) {
        list = await getSnowflakeTables(
          currentPrimary,
          secondaryValue,
          credentials as SnowflakeCredentials
        );
      } else if (connectorType === "databricks" && currentPrimary) {
        list = await getDatabricksTables(
          currentPrimary,
          secondaryValue,
          credentials as DatabricksCredentials
        );
      } else if (connectorType === "fabric" && currentPrimary) {
        const response = await getOneLakeTables(
          currentPrimary,
          secondaryValue,
          credentials as OneLakeCredentials
        );
        list = (response.tables || []).map((table: any) =>
          typeof table === "string"
            ? table
            : table.name || table.displayName || String(table)
        );
      } else if (connectorType === "sap") {
        list = await getSapTables(
          secondaryValue,
          credentials as SapCredentials
        );
      }

      if (list.length === 0) {
        toast({
          title: "No Tables Found",
          description: `No tables were found in ${secondaryValue}.`,
          variant: "destructive",
        });
        return;
      }

      const selected: SchemaPickerTableOption[] = list.map((table) => {
        let fullPath = table;

        if (connectorType === "snowflake" && currentPrimary) {
          fullPath = `${currentPrimary}/${secondaryValue}/${table}`;
        }

        return {
          id: table,
          name: table,
          fullPath,
          size: `${connectorLabel} Table`,
          rows: "Table",
        };
      });

      const returnedCredentials: Record<string, unknown> = {
        ...(credentials as unknown as Record<string, unknown>),
      };

      if (connectorType === "snowflake") {
        returnedCredentials.database = currentPrimary;
        returnedCredentials.schema = secondaryValue;
      } else if (connectorType === "databricks") {
        returnedCredentials.catalog = currentPrimary;
        returnedCredentials.schema = secondaryValue;
      } else if (connectorType === "sap") {
        returnedCredentials.schema = secondaryValue;
      } else if (connectorType === "fabric") {
        returnedCredentials.workspace_name = currentPrimary;
        returnedCredentials.lakehouse_name = secondaryValue;
      }

      onSelect(selected, returnedCredentials);
      resetAndClose();
    } catch (error: any) {
      toast({
        title: "Failed to Load Tables",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
      setPendingSecondary(null);
    }
  };

  /*
   * -------------------------------------------------------------
   * NAVIGATION
   * -------------------------------------------------------------
   */
  const handleBack = () => {
    if (hasPrimary && currentPrimary) {
      setCurrentPrimary(null);
      setSecondaryItems([]);
    }
  };

  const resetAndClose = () => {
    setPrimaryItems([]);
    setCurrentPrimary(null);
    setSecondaryItems([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleClose = resetAndClose;

  /*
   * -------------------------------------------------------------
   * LEVEL 1 — primary (database / catalog / workspace)
   * -------------------------------------------------------------
   */
  if (hasPrimary && !currentPrimary) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Select {PRIMARY_LABEL[connectorType]} - {connectorLabel}
            </DialogTitle>
          </DialogHeader>

          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {primaryItems.filter(matchesSearch).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => loadSecondaryItems(item)}
                  >
                    <Folder className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  /*
   * -------------------------------------------------------------
   * LEVEL 2 — secondary (schema / lakehouse). Clicking an item
   * fetches its tables and immediately confirms + closes; there
   * is no table review screen.
   * -------------------------------------------------------------
   */
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {hasPrimary ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  disabled={isConfirming}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select {SECONDARY_LABEL[connectorType]}
                {currentPrimary ? ` in ${currentPrimary}` : ""}
              </div>
            ) : (
              `Select ${SECONDARY_LABEL[connectorType]} - ${connectorLabel}`
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            disabled={isConfirming}
          />
        </div>

        {isConfirming ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading tables in {pendingSecondary}…
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-4">
              {secondaryItems.filter(matchesSearch).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => handleSecondarySelect(item)}
                >
                  <Folder className="h-5 w-5 text-green-500" />
                  <p className="font-medium">{item}</p>
                </div>
              ))}

              {secondaryItems.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No {SECONDARY_LABEL[connectorType].toLowerCase()}s found.
                </p>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
