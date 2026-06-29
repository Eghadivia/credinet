import PaymentSuccess from '@/features/payment-success/payment-success';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}