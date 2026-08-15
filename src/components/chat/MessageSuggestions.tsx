
import React from 'react';
import { MessageSuggestion } from '@/types/chat';

interface MessageSuggestionsProps {
  suggestions: MessageSuggestion[] | string[];
  onSelect?: (suggestion: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const MessageSuggestions: React.FC<MessageSuggestionsProps> = ({
  suggestions,
  onSelect,
  onSuggestionClick,
}) => {
  // Return empty fragment - no suggestions will be displayed
  return <></>;
};

export default MessageSuggestions;
