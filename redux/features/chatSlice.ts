import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uploadFile, createChat, clearChatHistory } from '@/libs/api';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  files?: { name: string; type: string }[];
}

interface ChatState {
  messages: ChatMessage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null,
};

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ email, prompt }: { email: string; prompt: string }, { rejectWithValue }) => {
    try {
      const response = await createChat(email, prompt);
      return response.responses; // Array of response strings
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const uploadChatFile = createAsyncThunk(
  'chat/uploadFile',
  async ({ email, file }: { email: string; file: File }, { rejectWithValue }) => {
    try {
      const response = await uploadFile(email, file);
      return response.message;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const clearUserChatHistory = createAsyncThunk(
  'chat/clearHistory',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await clearChatHistory(email);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.status = 'succeeded';
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          content: action.payload.join('\n'), // Join array of responses
          timestamp: new Date().toISOString(),
        };
        state.messages.push(botMessage);
        state.error = null;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(uploadChatFile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadChatFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(uploadChatFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(clearUserChatHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearUserChatHistory.fulfilled, (state) => {
        state.status = 'succeeded';
        state.messages = [];
        state.error = null;
      })
      .addCase(clearUserChatHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;