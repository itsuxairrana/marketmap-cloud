import Form from '@/app/form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MarketMap - Find Your Perfect Marketing Strategy',
  description: 'Discover personalized marketing strategies based on your business type and situation.',
};

export default function Home() {
  return (
    <>
      <Form />
    </>
  );
}
