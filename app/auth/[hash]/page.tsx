import { notFound } from 'next/navigation';
import EditPostsClient from '../EditPostsClient';

interface PageProps {
  params: Promise<{ hash: string }>;
}

export default async function AuthHashPage({ params }: PageProps) {
  const { hash } = await params;
  const decodedHash = decodeURIComponent(hash);

  console.log('Received hash param:', hash);
  console.log('Decoded hash param:', decodedHash);
  console.log('Expected AUTH_HASH from env:', process.env.AUTH_HASH);

  if (decodedHash !== process.env.AUTH_HASH && hash !== process.env.AUTH_HASH) {
    notFound();
  }

  return <EditPostsClient />;
}
