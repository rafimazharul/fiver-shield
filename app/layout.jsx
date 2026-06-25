import './globals.css';

export const metadata = {
  title: 'FiverShield ft. BDT',
  description: 'Protect your Fiverr messages from policy violations',
  icons: {
    icon: '/icon_images/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
