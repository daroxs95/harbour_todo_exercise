import { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import './globals.css';

export const metadata: Metadata = {
  title: 'TODOS',
  description: 'My TODO list app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" className="bg-gray-800">
        <body>
          <main>{children}</main>
        </body>
      </html>
    </ViewTransitions>
  );
}
