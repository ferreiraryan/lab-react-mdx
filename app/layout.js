import Link from "next/link";
import { Pirata_One, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const pirata = Pirata_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

export const metadata = {
  title: { default: "HEXXED", template: "%s · HEXXED" },
  description: "Vestuário oversized de edição limitada. Marca fictícia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${pirata.variable} ${mono.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <header>
          <nav className="container" aria-label="Principal">
            <Link href="/" className="header__logo">
              <img src="/images/marca/logo.jpeg" alt="HEXXED" />
            </Link>
            <ul className="header__nav">
              <li><Link href="/">Início</Link></li>
              <li><Link href="/#produtos">Produtos</Link></li>
              <li><Link href="/#equipe">Equipe</Link></li>
            </ul>
          </nav>
        </header>
        <main id="conteudo" className="container">{children}</main>
        <footer className="container">
          <p>© 2026 HEXXED</p>
          <p>Marca fictícia · Exercício de arquitetura de conteúdo</p>
        </footer>
      </body>
    </html>
  );
}
