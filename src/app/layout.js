import './globals.css'

export const metadata = {
  title: 'Crypto Swap',
  description: 'Swap your crypto tokens easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}