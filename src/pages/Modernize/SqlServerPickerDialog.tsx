import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Folder, Search } from "lucide-react";

import { toast } from "@/hooks/use-toast";

/*
 * SQL Server does not have a helper in api.ts yet, so this
 * dialog calls the local backend directly — the same
 * endpoints used previously in SourceConnection.tsx.
 */
const SQL_API_BASE_URL = "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net";

export interface SqlServerCredentials {
  host: string;
  database: string;
  username: string;
  password: string;
}

export interface SqlServerTableOption {
  id: string;
  name: string;
  fullPath: string;
  size: string;
  rows: string;
}

interface SqlServerPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: SqlServerCredentials | null;
  onSelect: (
    tables: SqlServerTableOption[],
    credentials?: SqlServerCredentials & { schema?: string | null }
  ) => void;
}

/*
 * Mirrors FilePickerDialog's UI/UX (search bar, folder rows)
 * but is self-contained so FilePickerDialog.tsx doesn't need
 * to change.
 *
 * NOTE: table selection is not per-table. Choosing a schema
 * immediately fetches every table in it, hands them to the
 * caller via onSelect, and closes the dialog — there is no
 * intermediate table review screen.
 */
export function SqlServerPickerDialog({
  open,
  onOpenChange,
  credentials,
  onSelect,
}: SqlServerPickerDialogProps) {
  const [schemas, setSchemas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [pendingSchema, setPendingSchema] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!open) return;

    if (credentials) {
      loadSchemas();
    }
  }, [open]);

  const loadSchemas = async () => {
    if (!credentials) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${SQL_API_BASE_URL}/list-schemas-sql`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            server: credentials.host,
            database: credentials.database,
            username: credentials.username,
            password: credentials.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to list schemas (${response.status})`
        );
      }

      const data = await response.json();

      const schemaList = Array.isArray(data.schemas)
        ? data.schemas.map((schema: unknown) => String(schema))
        : [];

      setSchemas(schemaList);
    } catch (error: any) {
      toast({
        title: "Failed to Load Schemas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const matchesSearch = (name: string) =>
    name.toLowerCase().includes(searchQuery.toLowerCase());

  const resetAndClose = () => {
    setSchemas([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleClose = resetAndClose;

  /*
   * Selecting a schema fetches every table in it and immediately
   * confirms + closes — there is no per-table checkbox step and
   * no review screen.
   */
  const handleSchemaSelect = async (schema: string) => {
    if (!credentials || isConfirming) return;

    setIsConfirming(true);
    setPendingSchema(schema);

    try {
      const response = await fetch(
        `${SQL_API_BASE_URL}/list-tables-sql`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            server: credentials.host,
            database: credentials.database,
            username: credentials.username,
            password: credentials.password,
            schema,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to list tables (${response.status})`
        );
      }

      const data = await response.json();

      const tableList: string[] = Array.isArray(data.tables)
        ? data.tables.map((table: unknown) => String(table))
        : [];

      if (tableList.length === 0) {
        toast({
          title: "No Tables Found",
          description: `No tables were found in ${schema}.`,
          variant: "destructive",
        });
        return;
      }

      const selected: SqlServerTableOption[] = tableList.map(
        (table) => ({
          id: table,
          name: table,
          fullPath: `${schema}.${table}`,
          size: "SQL Server Table",
          rows: "Table",
        })
      );

      onSelect(selected, { ...credentials, schema });
      resetAndClose();
    } catch (error: any) {
      toast({
        title: "Failed to Load Tables",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
      setPendingSchema(null);
    }
  };

  /*
   * ---------------------------------------------------------
   * SCHEMA SELECTION — the only level. Clicking a schema
   * fetches its tables and immediately confirms + closes.
   * ---------------------------------------------------------
   */
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Schema - SQL Server</DialogTitle>
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
              Loading tables in {pendingSchema}…
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-4">
              {schemas.filter(matchesSearch).map((schema) => (
                <div
                  key={schema}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => handleSchemaSelect(schema)}
                >
                  <Folder className="h-5 w-5 text-blue-500" />
                  <p className="font-medium">{schema}</p>
                </div>
              ))}

              {schemas.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No schemas found.
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
