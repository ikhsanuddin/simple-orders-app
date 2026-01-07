import '@/styles/globals.css';

export const metadata = {
  title: 'Simple Order App',
  description: 'Order management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
