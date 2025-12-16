// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Database,X } from "lucide-react";
// import { useState } from "react";

// interface DatabaseConnectionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onConnect: (config: any) => void;
// }

// export function DatabaseConnectionDialog({ open, onOpenChange, onConnect }: DatabaseConnectionDialogProps) {
//   const [dataSource, setDataSource] = useState("Database");
//   const [username, setUsername] = useState("Demouser01@gmail.com");
//   const [password, setPassword] = useState("••••••••••");
//   const [connectionString, setConnectionString] = useState("");
//   const [portNumber, setPortNumber] = useState("");
//   const [databaseName, setDatabaseName] = useState("");

//   const handleConnect = () => {
//     onConnect({
//       dataSource,
//       username,
//       password,
//       connectionString,
//       portNumber,
//       databaseName
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">Data Source</DialogTitle>
//           <DialogDescription>
//             Select and configure your data source
//           </DialogDescription>
          
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-0 top-0 h-8 w-8 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//             onClick={() => onOpenChange(false)}
//           >
//             <X className="h-5 w-5" />
//             <span className="sr-only">Close</span>
//           </Button>

//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Data Source Selector */}
//           <div className="space-y-2">
//             <Label htmlFor="datasource">Data Source</Label>
//             <Select value={dataSource} onValueChange={setDataSource}>
//               <SelectTrigger id="datasource" className="w-full">
//                 <div className="flex items-center gap-2">
//                   <Database className="h-4 w-4" />
//                   <SelectValue />
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Database">Database</SelectItem>
//                 <SelectItem value="MySQL">MySQL</SelectItem>
//                 <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
//                 <SelectItem value="SQL Server">SQL Server</SelectItem>
//                 <SelectItem value="Oracle">Oracle</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Username and Password */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="bg-muted/30"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="bg-muted/30"
//               />
//             </div>
//           </div>

//           {/* Connection String and Port */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="connectionString">Connection String</Label>
//               <Input
//                 id="connectionString"
//                 placeholder="Enter connection string"
//                 value={connectionString}
//                 onChange={(e) => setConnectionString(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="port">Port No</Label>
//               <Input
//                 id="port"
//                 placeholder="Enter port number"
//                 value={portNumber}
//                 onChange={(e) => setPortNumber(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Database Name */}
//           <div className="space-y-2">
//             <Label htmlFor="databaseName">Database Name</Label>
//             <Input
//               id="databaseName"
//               placeholder="Enter database name"
//               value={databaseName}
//               onChange={(e) => setDatabaseName(e.target.value)}
//             />
//           </div>

//           {/* Connect Button */}
//           <Button 
//             onClick={handleConnect} 
//             className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
//           >
//             <Database className="h-5 w-5 mr-2" />
//             Connect to Database
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Database } from "lucide-react";
// import { useState } from "react";

// interface DatabaseConnectionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onConnect: (config: {
//     server: string;
//     database: string;
//     username: string;
//     password: string;
//   }) => void;
// }

// export function DatabaseConnectionDialog({
//   open,
//   onOpenChange,
//   onConnect,
// }: DatabaseConnectionDialogProps) {
//   const [server, setServer] = useState("");
//   const [database, setDatabase] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleConnect = () => {
//     onConnect({ server, database, username, password });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">Database Connection</DialogTitle>
//           <DialogDescription>
//             Enter your database connection details
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Row 1 */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="server">Server</Label>
//               <Input
//                 id="server"
//                 placeholder="agenticbisql.database.windows.net"
//                 value={server}
//                 onChange={(e) => setServer(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="database">Database</Label>
//               <Input
//                 id="database"
//                 placeholder="ecommerce-agenticBI"
//                 value={database}
//                 onChange={(e) => setDatabase(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 placeholder="agenticbi"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Footer Buttons */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>

//             <Button onClick={handleConnect}>
//               <Database className="h-4 w-4 mr-2" />
//               Connect to Database
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Database, Loader2 } from "lucide-react";
// import { useState } from "react";
// import { listDatabaseTables } from "@/components/api/api";
// import { useToast } from "@/hooks/use-toast";

// interface DatabaseConnectionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function DatabaseConnectionDialog({
//   open,
//   onOpenChange,
// }: DatabaseConnectionDialogProps) {
//   const { toast } = useToast();

//   const [server, setServer] = useState("");
//   const [database, setDatabase] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleConnect = async () => {
//     try {
//       setLoading(true);

//       const res = await listDatabaseTables({
//         server,
//         database,
//         username,
//         password,
//       });

      
//     toast({
//       title: "Connected successfully",
//       description: `Found ${res.tables?.length || 0} tables`,
//     });

//       onOpenChange(false);
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: "Connection Failed",
//         description: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">Database Connection</DialogTitle>
//           <DialogDescription>
//             Enter your database connection details
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Row 1 */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Server</Label>
//               <Input
//                 placeholder="agenticbisql.database.windows.net"
//                 value={server}
//                 onChange={(e) => setServer(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Database</Label>
//               <Input
//                 placeholder="ecommerce-agenticBI"
//                 value={database}
//                 onChange={(e) => setDatabase(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Username</Label>
//               <Input
//                 placeholder="agenticbi"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>

//             <Button onClick={handleConnect} disabled={loading}>
//               {loading ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <Database className="h-4 w-4 mr-2" />
//               )}
//               Connect to Database
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Loader2 } from "lucide-react";
import { useState } from "react";
import { listDatabaseTables } from "@/components/api/api";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface DatabaseConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (data: {
    server: string;
    database: string;
    username: string;
    selectedTables: string[];
  }) => void;
}

export function DatabaseConnectionDialog({
  open,
  onOpenChange,
  onConnect,
}: DatabaseConnectionDialogProps) {
  const { toast } = useToast();

  const [server, setServer] = useState("");
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const res = await listDatabaseTables({
        server,
        database,
        username,
        password,
      });

      setTables(res.tables || []);
      setConnected(true);

      toast({
        title: "Connected",
        description: "Select tables to continue",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = (table: string) => {
    setSelectedTables((prev) =>
      prev.includes(table)
        ? prev.filter((t) => t !== table)
        : [...prev, table]
    );
  };

  const handleConfirm = () => {
    onConnect({
      server,
      database,
      username,
      selectedTables,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Database Connection</DialogTitle>
          <DialogDescription>
            Connect and select tables
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
  {!connected && (
    <>
      {/* Credentials */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Server</Label>
          <Input
            value={server}
            onChange={(e) => setServer(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Database</Label>
          <Input
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>

        <Button onClick={handleConnect} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Database className="h-4 w-4 mr-2" />
          )}
          Connect
        </Button>
      </div>
    </>
     )}



          {connected && (
            <>
              {/* Table Selection */}
              <div className="space-y-3">
                <Label>Select Tables</Label>

                <div className="max-h-60 overflow-auto border rounded-md p-3 space-y-2">
                  {tables.map((table) => (
                    <div
                      key={table}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        checked={selectedTables.includes(table)}
                        onCheckedChange={() => toggleTable(table)}
                      />
                      <span className="text-sm">{table}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setConnected(false)}
                >
                  Back
                </Button>

                <Button
                  onClick={handleConfirm}
                  disabled={selectedTables.length === 0}
                >
                 Add Files ({selectedTables.length})
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
