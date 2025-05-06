import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoachMessage, CoachConversation } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import PageTransition from '@/components/ui/PageTransition';
import { motion } from 'framer-motion';

export default function AiCoach() {
  const [message, setMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const { data: conversations, isLoading: isLoadingConversations } = useQuery<CoachConversation[]>({
    queryKey: ['/api/coach/conversations'],
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery<CoachMessage[]>({
    queryKey: ['/api/coach/messages', currentConversationId],
    queryFn: async () => {
      if (!currentConversationId) return [];
      const response = await fetch(`/api/coach/messages/${currentConversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: currentConversationId !== null,
  });

  const newConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/coach/conversations', {
        title: t.aiCoach.newChat
      });
      return response.json();
    },
    onSuccess: (data: CoachConversation) => {
      queryClient.invalidateQueries({ queryKey: ['/api/coach/conversations'] });
      setCurrentConversationId(data.id);
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentConversationId) {
        throw new Error('No active conversation');
      }
      
      const response = await apiRequest('POST', `/api/coach/conversations/${currentConversationId}/messages`, {
        message: content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coach/messages', currentConversationId] });
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    if (!currentConversationId) {
      newConversationMutation.mutate();
      // The message will be sent after the conversation is created
      return;
    }
    
    sendMessageMutation.mutate(message);
    setMessage('');
  };

  // When a new conversation is created, send the initial message
  useEffect(() => {
    if (newConversationMutation.isSuccess && message) {
      sendMessageMutation.mutate(message);
      setMessage('');
    }
  }, [newConversationMutation.isSuccess]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Select first non-test conversation when data loads
  useEffect(() => {
    if (conversations && conversations.length > 0 && !currentConversationId) {
      const nonTestConversations = conversations.filter(convo => !isTestConversation(convo.title));
      if (nonTestConversations.length > 0) {
        selectConversation(nonTestConversations[0].id);
      }
    }
  }, [conversations, currentConversationId]);

  const startNewConversation = () => {
    setCurrentConversationId(null);
  };

  const selectConversation = (id: number) => {
    setCurrentConversationId(id);
  };
  
  // Filter test conversations
  const isTestConversation = (title: string): boolean => {
    const lowerTitle = title.toLowerCase();
    return lowerTitle.includes('test') || 
           lowerTitle.includes('huggingface') ||
           lowerTitle.includes('gemini') ||
           lowerTitle.includes('api');
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <PageTransition className="pt-4 pb-4 flex flex-col h-[calc(100vh-144px)]">
      <h2 className="text-2xl font-semibold text-white mb-4">{t.aiCoach.title}</h2>
      
      <div className="flex flex-col h-full">
        {/* Conversation selector */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">{t.aiCoach.title}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={startNewConversation}
              className="text-xs"
            >
              <i className="ri-add-line mr-1"></i> {t.aiCoach.newChat}
            </Button>
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-2">
            {isLoadingConversations ? (
              <Skeleton className="h-9 w-32 rounded-full flex-shrink-0" />
            ) : (
              <>
                {conversations && conversations
                  .filter(convo => !isTestConversation(convo.title))
                  .map((convo) => (
                    <motion.div 
                      key={convo.id}
                      className={`rounded-full px-3 py-1 text-sm cursor-pointer flex-shrink-0 ${
                        currentConversationId === convo.id
                          ? 'bg-secondary text-gray-900' 
                          : 'bg-muted text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => selectConversation(convo.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {convo.title}
                    </motion.div>
                  ))}
              </>
            )}
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 bg-muted rounded-lg overflow-y-auto mb-3 p-3">
          {isLoadingMessages ? (
            <div className="space-y-3">
              <div className="max-w-[80%] flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
              <div className="max-w-[80%] ml-auto">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {!currentConversationId && (
                <motion.div 
                  className="text-center py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="text-5xl mb-3"
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <i className="ri-message-3-line text-secondary/50"></i>
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-medium text-white mb-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {t.aiCoach.startConversation}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-400 mb-3"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    {t.aiCoach.conversationPlaceholder}
                  </motion.p>
                </motion.div>
              )}
              
              {messages && messages.map((msg, index) => (
                <motion.div 
                  key={msg.id} 
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                  initial="initial"
                  animate="animate"
                  variants={messageVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  {msg.sender === 'coach' && (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <i className="ri-message-3-line text-secondary"></i>
                    </div>
                  )}
                  
                  <div 
                    className={`rounded-lg p-3 max-w-[80%] ${
                      msg.sender === 'user' 
                        ? 'bg-secondary/20 text-white' 
                        : 'bg-card text-white'
                    }`}
                  >
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {formatMessageTime(msg.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Message input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder={t.aiCoach.typeMessage}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-card text-white"
          />
          <Button 
            type="submit" 
            className="bg-secondary hover:bg-green-500 text-gray-900"
            disabled={sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <i className="ri-loader-4-line animate-spin"></i>
            ) : (
              <i className="ri-send-plane-fill"></i>
            )}
          </Button>
        </form>
      </div>
    </PageTransition>
  );
}
