// import { useState, useRef, useEffect } from 'react';

// import { DataFile } from '@/components/types/dashboard';

// import { 

//   ArrowLeft,

//   Send,

//   FileText,

//   Table,

//   FileJson,

//   User,

//   Bot,

//   Save,

//   Sparkles

// } from 'lucide-react';

// import { cn } from '@/lib/utils';

// import { Button } from '@/components/ui/button';

// import { Input } from '@/components/ui/input';

// import { ScrollArea } from '@/components/ui/scroll-area';
 
// interface ChatbotInterfaceProps {

//   file: DataFile;

//   onGenerateDashboard: (query: string) => void;

//   onBack: () => void;

//   isLoading: boolean;

// }
 
// interface Message {

//   id: string;

//   role: 'user' | 'assistant';

//   content: string;

// }
 
// const fileIcons = {

//   csv: FileText,

//   excel: Table,

//   json: FileJson,

// };
 
// const fileColors = {

//   csv: 'text-emerald-400',

//   excel: 'text-green-400',

//   json: 'text-amber-400',

// };
 
 
// const assistantResponses = [

//   "I understand you want to analyze that. I can create visualizations showing trends, comparisons, and key metrics for this data.",

//   "Great choice! I'll prepare charts and KPIs to help you understand this better.",

//   "I can build that dashboard for you. It will include relevant charts and performance indicators.",

//   "Excellent request! I'll create interactive visualizations to display this information clearly.",

// ];
 
// export function ChatbotInterface({ file, onGenerateDashboard, onBack, isLoading }: ChatbotInterfaceProps) {

//   const [query, setQuery] = useState('');

//   const [messages, setMessages] = useState<Message[]>([]);

//   const scrollRef = useRef<HTMLDivElement>(null);
 
//   const Icon = fileIcons[file.type];

//   const iconColor = fileColors[file.type];
 
//   useEffect(() => {

//     if (scrollRef.current) {

//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

//     }

//   }, [messages]);
 
//   const handleSubmit = (e?: React.FormEvent) => {

//     e?.preventDefault();

//     if (!query.trim() || isLoading) return;

//     const userMessage: Message = {

//       id: Date.now().toString(),

//       role: 'user',

//       content: query.trim()

//     };

//     setMessages(prev => [...prev, userMessage]);

//     // Simulate assistant response

//     setTimeout(() => {

//       const assistantMessage: Message = {

//         id: (Date.now() + 1).toString(),

//         role: 'assistant',

//         content: assistantResponses[Math.floor(Math.random() * assistantResponses.length)]

//       };

//       setMessages(prev => [...prev, assistantMessage]);

//     }, 500);

//     setQuery('');

//   };
 
//   const handleSuggestionClick = (suggestion: string) => {

//     setQuery(suggestion);

//   };
 
//   const handleSaveAndGenerate = () => {

//     if (messages.length === 0) return;

//     const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);

//     onGenerateDashboard(userMessages.join('; '));

//   };
 
//   return (
// <div className="flex-1 flex flex-col h-full">

//       {/* Header */}
// <div className="p-4 border-b border-border/50 flex items-center justify-between">
// <Button 

//           variant="ghost" 

//           size="sm" 

//           onClick={onBack} 

//           className="gap-2 text-muted-foreground hover:text-foreground"
// >
// <ArrowLeft className="w-4 h-4" />

//           Back to Recommendations
// </Button>
// <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
// <Icon className={cn('w-4 h-4', iconColor)} />

//           {file.name}
// </div>
// </div>
 
//       {/* Chat Area */}
// <div className="flex-1 flex flex-col overflow-hidden">

//         {messages.length === 0 ? (

//           /* Empty State */
// <div className="flex-1 flex flex-col items-center justify-center p-8 -mt-20">
// <div className="w-full max-w-3xl space-y-8 animate-fade-in text-center">
// <div className="space-y-2">
// <h1 className="text-2xl font-bold text-foreground">

//                   Build Your Own Dashboard
// </h1>
// <p className="text-muted-foreground">

//                   Describe what insights you want to see
// </p>
// </div>

//               {/* Input in empty state */}
// <form onSubmit={handleSubmit} className="relative">
// <Input

//                   value={query}

//                   onChange={(e) => setQuery(e.target.value)}

//                   placeholder="e.g., Show me sales by region over the past year..."

//                   disabled={isLoading}

//                   className="h-14 pl-5 pr-14 text-base rounded-xl border-2 border-border bg-card/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

//                 />
// <Button

//                   type="submit"

//                   disabled={!query.trim() || isLoading}

//                   variant="glow"

//                   size="icon"

//                   className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
// >
// <Send className="w-4 h-4" />
// </Button>
// </form>
// </div>
// </div>

//         ) : (

//           /* Messages */
// <ScrollArea className="flex-1 p-4" ref={scrollRef}>
// <div className="max-w-3xl mx-auto space-y-4">

//               {messages.map((message) => (
// <div

//                   key={message.id}

//                   className={cn(

//                     "flex gap-3 animate-fade-in",

//                     message.role === 'user' ? 'justify-end' : 'justify-start'

//                   )}
// >

//                   {message.role === 'assistant' && (
// <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
// <Bot className="w-4 h-4 text-primary" />
// </div>

//                   )}
// <div

//                     className={cn(

//                       "max-w-[80%] px-4 py-3 rounded-2xl",

//                       message.role === 'user'

//                         ? 'bg-primary text-primary-foreground rounded-br-md'

//                         : 'bg-secondary/80 text-foreground rounded-bl-md'

//                     )}
// >
// <p className="text-sm">{message.content}</p>
// </div>

//                   {message.role === 'user' && (
// <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
// <User className="w-4 h-4 text-muted-foreground" />
// </div>

//                   )}
// </div>

//               ))}
// </div>
// </ScrollArea>

//         )}
 
//         {/* Input Area - Fixed at bottom (only shown when there are messages) */}

//         {messages.length > 0 && (
// <div className="border-t border-border/50 p-4 bg-background/80 backdrop-blur-sm">
// <div className="max-w-3xl mx-auto space-y-3">
// <form onSubmit={handleSubmit} className="relative">
// <Input

//                   value={query}

//                   onChange={(e) => setQuery(e.target.value)}

//                   placeholder="e.g., Show me sales by region over the past year..."

//                   disabled={isLoading}

//                   className="h-14 pl-5 pr-14 text-base rounded-xl border-2 border-border bg-card/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

//                 />
// <Button

//                   type="submit"

//                   disabled={!query.trim() || isLoading}

//                   variant="glow"

//                   size="icon"

//                   className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
// >
// <Send className="w-4 h-4" />
// </Button>
// </form>
 
//               {/* Save and Generate Dashboard Button */}
// <div className="flex justify-end pt-2">
// <Button

//                   onClick={handleSaveAndGenerate}

//                   disabled={isLoading}

//                   className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
// >

//                   {isLoading ? (
// <>
// <Sparkles className="w-4 h-4 animate-pulse" />

//                       Generating...
// </>

//                   ) : (
// <>
// <Save className="w-4 h-4" />

//                       Save and Generate Dashboard
// </>

//                   )}
// </Button>
// </div>
// </div>
// </div>

//         )}
// </div>
// </div>

//   );

// }

import { useState, useRef, useEffect } from 'react';
import { DataFile, KPI } from '@/components/types/dashboard';
import { sendMessage,downloadChat,deleteThread, deleteAllFilesFromAgent } from '../api/api';

import { 

  ArrowLeft,

  Send,

  FileText,

  Table,

  FileJson,

  User,

  Bot,

  Save,

  Sparkles

} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { ScrollArea } from '@/components/ui/scroll-area';
 
interface ChatbotInterfaceProps {

  file: DataFile;

  onGenerateDashboard: (query: string) => void;

  onBack: () => void;

  isLoading: boolean;

}
 
interface Message {

  id: string;

  role: 'user' | 'assistant';

  content: string;

}
 
const fileIcons = {

  csv: FileText,

  excel: Table,

  json: FileJson,

};
 
const fileColors = {

  csv: 'text-emerald-400',

  excel: 'text-green-400',

  json: 'text-amber-400',

};
 
 
// const assistantResponses = [

//   "I understand you want to analyze that. I can create visualizations showing trends, comparisons, and key metrics for this data.",

//   "Great choice! I'll prepare charts and KPIs to help you understand this better.",

//   "I can build that dashboard for you. It will include relevant charts and performance indicators.",

//   "Excellent request! I'll create interactive visualizations to display this information clearly.",

// ];
 
export function ChatbotInterface({ file, onGenerateDashboard, onBack, isLoading }: ChatbotInterfaceProps) {

  const [query, setQuery] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
 
  const Icon = fileIcons[file.type];

  const iconColor = fileColors[file.type];
 
  useEffect(() => {

    if (scrollRef.current) {

      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

    }

  }, [messages]);
 
const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();
  if (!query.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: query.trim()
  };

  setMessages(prev => [...prev, userMessage]);
  const currentQuery = query.trim();
  setQuery('');

  // Get thread_id from localStorage
  const threadId = localStorage.getItem('thread_id');
  
  if (!threadId) {
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Error: No thread ID found. Please try refreshing the page.'
    };
    setMessages(prev => [...prev, errorMessage]);
    return;
  }

  // Add typing indicator
  const typingId = (Date.now() + 1).toString();
  const typingMessage: Message = {
    id: typingId,
    role: 'assistant',
    content: '...'
  };
  setMessages(prev => [...prev, typingMessage]);

  try {
    // Call the API
    const response = await sendMessage({
      thread_id: threadId,
      question: currentQuery
    });

    // Remove typing indicator and add real response
    setMessages(prev => {
      const filtered = prev.filter(m => m.id !== typingId);
      
      // Extract content from responses array
      const content = response.responses && response.responses.length > 0
        ? response.responses.map(r => r.content).join('\n')
        : 'No response received.';

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: content
      };

      return [...filtered, assistantMessage];
    });
  } catch (error) {
    // Remove typing indicator and show error
    setMessages(prev => {
      const filtered = prev.filter(m => m.id !== typingId);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message. Please try again.'}`
      };

      return [...filtered, errorMessage];
    });
  }
};
 
  const handleSuggestionClick = (suggestion: string) => {

    setQuery(suggestion);

  };
 
  const handleSaveAndGenerate = async () => {
  if (messages.length === 0) return;

  const threadId = localStorage.getItem('thread_id');
  
  if (!threadId) {
    alert('No thread ID found.');
    return;
  }

  try {
    // First, call delete_thread API
    const deleteThreadResult = await deleteThread(threadId);
    console.log('Thread deleted:', deleteThreadResult);

    // Then, call delete_all_files_from_agent API
    const deleteFilesResult = await deleteAllFilesFromAgent();
    console.log('Files deleted:', deleteFilesResult);

    // After both APIs succeed, proceed with dashboard generation
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    onGenerateDashboard(userMessages.join('; '));

  } catch (error) {
    console.error('Error during cleanup:', error);
    alert(`Failed to cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

 const handleDownload = async () => {
  const threadId = localStorage.getItem('thread_id');
  
  if (!threadId) {
    alert('No thread ID found. Please start a conversation first.');
    return;
  }

  try {
    // Call the API to get the file blob
    const blob = await downloadChat(threadId);
    
    // Extract filename from response or create default
    const filename = `chat_${threadId}_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    
    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    alert(`Failed to download chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

  return (
<div className="flex-1 flex flex-col h-full">

      {/* Header */}
<div className="p-4 border-b border-border/50 flex items-center justify-between">
<Button 

          variant="ghost" 

          size="sm" 

          onClick={onBack} 

          className="gap-2 text-muted-foreground hover:text-foreground"
>
<ArrowLeft className="w-4 h-4" />

          Back to Recommendations
</Button>

<div className='flex gap-3'>
<button 
  onClick={handleDownload}
  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={messages.length === 0}
>
  Download
</button>
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
  
<Icon className={cn('w-4 h-4', iconColor)} />

          {file.name}
</div>

</div>
   
</div>
 
      {/* Chat Area */}
<div className="flex-1 flex flex-col overflow-hidden">

        {messages.length === 0 ? (

          /* Empty State */
<div className="flex-1 flex flex-col items-center justify-center p-8 -mt-20">
<div className="w-full max-w-3xl space-y-8 animate-fade-in text-center">
<div className="space-y-2">
<h1 className="text-2xl font-bold text-foreground">

                  Build Your Own Dashboard
</h1>
<p className="text-muted-foreground">

                  Describe what insights you want to see
</p>
</div>

              {/* Input in empty state */}
<form onSubmit={handleSubmit} className="relative">
<Input

                  value={query}

                  onChange={(e) => setQuery(e.target.value)}

                  placeholder="e.g., Show me sales by region over the past year..."

                  disabled={isLoading}

                  className="h-14 pl-5 pr-14 text-base rounded-xl border-2 border-border bg-card/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

                />
<Button

                  type="submit"

                  disabled={!query.trim() || isLoading}

                  variant="glow"

                  size="icon"

                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
>
<Send className="w-4 h-4" />
</Button>
</form>
</div>
</div>

        ) : (

          /* Messages */
<ScrollArea className="flex-1 p-4" ref={scrollRef}>
<div className="max-w-3xl mx-auto space-y-4">

              {messages.map((message) => (
<div

                  key={message.id}

                  className={cn(

                    "flex gap-3 animate-fade-in",

                    message.role === 'user' ? 'justify-end' : 'justify-start'

                  )}
>

                  {message.role === 'assistant' && (
<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
<Bot className="w-4 h-4 text-primary" />
</div>

                  )}
<div

                    className={cn(

                      "max-w-[80%] px-4 py-3 rounded-2xl",

                      message.role === 'user'

                        ? 'bg-primary text-primary-foreground rounded-br-md'

                        : 'bg-secondary/80 text-foreground rounded-bl-md'

                    )}
>
<p className="text-sm">
  {message.content === '...' ? (
    <span className="flex gap-1">
      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
    </span>
  ) : (
    message.content
  )}
</p></div>

                  {message.role === 'user' && (
<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
<User className="w-4 h-4 text-muted-foreground" />
</div>

                  )}
</div>

              ))}
</div>
</ScrollArea>

        )}
 
        {/* Input Area - Fixed at bottom (only shown when there are messages) */}

        {messages.length > 0 && (
<div className="border-t border-border/50 p-4 bg-background/80 backdrop-blur-sm">
<div className="max-w-3xl mx-auto space-y-3">
<form onSubmit={handleSubmit} className="relative">
<Input

                  value={query}

                  onChange={(e) => setQuery(e.target.value)}

                  placeholder="e.g., Show me sales by region over the past year..."

                  disabled={isLoading}

                  className="h-14 pl-5 pr-14 text-base rounded-xl border-2 border-border bg-card/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

                />
<Button

                  type="submit"

                  disabled={!query.trim() || isLoading}

                  variant="glow"

                  size="icon"

                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg"
>
<Send className="w-4 h-4" />
</Button>
</form>
 
              {/* Save and Generate Dashboard Button */}
<div className="flex justify-end pt-2">
<Button

                  onClick={handleSaveAndGenerate}

                  disabled={isLoading}

                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
>

                  {isLoading ? (
<>
<Sparkles className="w-4 h-4 animate-pulse" />

                      Generating...
</>

                  ) : (
<>
<Save className="w-4 h-4" />

                       Generate Dashboard
</>

                  )}
</Button>
</div>
</div>
</div>

        )}
</div>
</div>

  );

}
