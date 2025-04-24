
import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API_URL } from '@/config/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatDialog() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input } as Message;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Updated to use the correct endpoint path
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-potato-600 hover:bg-potato-700"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Potato Expert Assistant</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6 pt-0">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">
                  Ask me anything about potatoes! I can help with diseases, cultivation, and more.
                </p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-potato-600 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="border-t p-4 flex gap-4">
            <Textarea
              placeholder="Ask a question about potatoes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[60px] resize-none"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading}
              className="bg-potato-600 hover:bg-potato-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
