'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChatWindow from '@/components/chat/ChatWindow';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="">
      <ChatWindow />
    </div>
  );
}