'use client';

import { useSearchParams } from 'next/navigation';
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { useState, useEffect, Suspense } from "react";
import PayPage from '@/components/maskedDiv';

export const dynamic = 'force-dynamic';

const loadingStates = [
  {
    text: "Welcome",
  },
  {
    text: "Loading Data",
  },
  {
    text: "Everything is Good",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    amount: '',
    receiver: '',
    key: '',
    sender: ''
  });

  useEffect(() => {
    const amount = searchParams.get('amount') || '';
    const receiver = searchParams.get('receiver') || '';
    const key = searchParams.get('key') || '';
    const sender = searchParams.get('sender') || '';

    setQueryParams({
      amount,
      receiver,
      key,
      sender
    });
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
      <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={2000} />
        <PayPage params={queryParams} />
      </Suspense>
    </main>
  );
}