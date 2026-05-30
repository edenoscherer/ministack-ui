import React from 'react';
import Link from 'next/link';

export default function HomePage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-8 relative overflow-hidden select-none">
      {/* Background soft ambient glowing circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Premium Header */}
      <header className="flex justify-between items-center max-w-7xl w-full mx-auto py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-400 via-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            M
          </div>
          <span className="text-sm font-bold tracking-wider text-white">MINISTACK</span>
        </div>
        <div className="flex gap-4">
          <span className="text-xs text-zinc-500 border border-zinc-800 rounded-full px-3 py-1 bg-zinc-900/50 backdrop-blur-sm">
            v1.0.0-beta
          </span>
        </div>
      </header>

      {/* Main hero section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-12 z-10">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/20 bg-sky-950/20 backdrop-blur-md text-sky-400 text-xs font-semibold mb-6 shadow-[0_0_15px_rgba(56,189,248,0.05)]">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          Observabilidade Local de Alta Performance
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
          <span className="bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Seu Painel de Controle{' '}
          </span>
          <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            MiniStack & LocalStack
          </span>
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Inspecione logs estruturados, verifique barramentos de mensageria (SNS/SQS), monitore
          buckets S3 e gerencie seus recursos locais de forma totalmente visual e integrada.
        </p>

        {/* Call to action button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/logs"
            className="group px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer duration-300"
          >
            Acessar Runtime Inspector
            <span className="text-zinc-400 group-hover:text-zinc-950 transition-colors transform group-hover:translate-x-1 duration-300">
              →
            </span>
          </Link>
          <a
            href="/storybook"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300 hover:text-white font-semibold text-sm tracking-wide backdrop-blur-md transition-all duration-300"
          >
            Abrir Component Storybook
          </a>
        </div>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 max-w-5xl">
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md text-left flex flex-col justify-between hover:border-zinc-850 transition-colors">
            <div>
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-white text-base mb-2">Logs em Tempo Real</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Visualização estruturada com alta vazão, filtros de severidade, busca textual e
                expansor de árvore JSON sem latência.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md text-left flex flex-col justify-between hover:border-zinc-850 transition-colors">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-white text-base mb-2">Segurança Hardened</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Mecanismos de proteção contra ReDoS com tempo de execução linear O(N) e geradores de
                ID criptográficos seguros.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md text-left flex flex-col justify-between hover:border-zinc-850 transition-colors">
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-white text-base mb-2">Multi-Provedor</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Suporta alternância dinâmica instantânea entre o emulador leve MiniStack e
                containers LocalStack locais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-zinc-900/50 max-w-7xl w-full mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600 z-10">
        <span>© {new Date().getFullYear()} MiniStack UI. Todos os direitos reservados.</span>
        <div className="flex gap-4">
          <Link href="/logs" className="hover:text-zinc-400 transition-colors">
            Inspector
          </Link>
          <a
            href="/storybook"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            Storybook
          </a>
        </div>
      </footer>
    </main>
  );
}
