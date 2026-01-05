import { useState } from 'react';
import { DataFile, KPI } from '@/components/types/dashboard';
import { 
  ArrowLeft,
  Sparkles,
  Send,
  FileText,
  Table,
  FileJson
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatbotInterfaceProps {
  file: DataFile;
  onGenerateDashboard: (query: string) => void;
  onBack: () => void;
  isLoading: boolean;
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

const suggestions = [
  'Show monthly sales trends',
  'Compare product categories',
  'Top performing regions',
  'Quarterly growth analysis',
];

export function ChatbotInterface({ file, onGenerateDashboard, onBack, isLoading }: ChatbotInterfaceProps) {
  const [query, setQuery] = useState('');

  const Icon = fileIcons[file.type];
  const iconColor = fileColors[file.type];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;
    onGenerateDashboard(query.trim());
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Simple Header */}
      <div className="p-4 border-b border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recommendations
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8 animate-fade-in">
          {/* Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
              <Icon className={cn('w-4 h-4', iconColor)} />
              {file.name}
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Build Your Own Dashboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Describe what insights you want to see, and we'll generate a custom dashboard for you
            </p>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
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
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Generating your dashboard...
              </div>
            )}
          </form>

          {/* Quick Suggestions */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Quick suggestions</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    "bg-secondary/50 text-muted-foreground border-border",
                    "hover:bg-secondary hover:text-foreground hover:border-primary/50",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Example queries */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center mb-3">Examples of what you can ask:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
                <span className="text-primary">•</span>
                "Show me sales by region over time"
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
                <span className="text-primary">•</span>
                "Compare product categories by revenue"
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
                <span className="text-primary">•</span>
                "Analyze customer trends with key metrics"
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
                <span className="text-primary">•</span>
                "Display quarterly growth with YoY comparison"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
