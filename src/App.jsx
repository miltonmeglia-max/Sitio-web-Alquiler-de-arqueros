import FormularioModal from './FormularioModal';
import { useState, useEffect, useRef } from 'react'
import Registro from './Registro'

import emiliano from './assets/fotos-arqueros/emiliano.jpg'
import milton from './assets/fotos-arqueros/milton.png'
import rodrigo from './assets/fotos-arqueros/rodrigo.jpeg'
import jonathan from './assets/fotos-arqueros/jonathan.jpeg'

const arqueros = [
  { nombre: 'Milton', zona: 'Zona oeste', partidos: 8, foto: milton },
  { nombre: 'Emiliano', zona: 'Zona sur y CABA', partidos: 6, foto: emiliano },
  { nombre: 'Rodrigo', zona: 'CABA', partidos: 4, foto: rodrigo },
  { nombre: 'Jonathan', zona: 'CABA', partidos: 4, foto: jonathan },
]

const testimonios = [
  { texto: 'Pensé que iba a ser un quilombo conseguir arquero último momento. En 20 minutos tenía todo confirmado. Llegó puntual y atajó de diez.', nombre: 'Martín', zona: 'Palermo' },
  { texto: 'Lo usamos todos los martes para el fulbo del laburo. Siempre nos mandan arqueros copados y que saben atajar. No buscamos más.', nombre: 'Federico', zona: 'Caballito' },
  { texto: 'El arquero que nos tocó era mejor que varios jugadores del equipo. Se re comprometió, hasta dirigía la defensa. Volví a pedir.', nombre: 'Gonzalo', zona: 'San Isidro' },
]

function Navbar({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d1117]/95 backdrop-blur-md border-b border-[#30363d]' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tight">
            Alquiler de <span className="text-[#1DB954]">Arqueros</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#arqueros" className="hover:text-white transition-colors">Arqueros</a>
            <a href="#testimonios" className="hover:text-white transition-colors">Testimonios</a>
            <span className="flex items-center gap-1 text-gray-500 text-xs border border-[#30363d] rounded-full px-3 py-1">
              📍 CABA y GBA
            </span>
          </div>
          <button onClick={onOpenModal}
            className="hidden md:block bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105">
            Conseguir arquero
          </button>
          <button
            className="md:hidden flex flex-col gap-1 p-1.5"
            onClick={() => setMenuOpen(true)}
          >
            <span className="w-5 h-0.5 bg-white block" />
            <span className="w-5 h-0.5 bg-white block" />
            <span className="w-5 h-0.5 bg-white block" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0d1117]/95 backdrop-blur-md flex flex-col px-8 pt-20 pb-10">
          <button
            className="absolute top-5 right-6 text-gray-400 text-3xl"
            onClick={() => setMenuOpen(false)}
          >✕</button>
          <div className="flex flex-col gap-6 mt-8">
            <button
              onClick={() => { onOpenModal(); setMenuOpen(false) }}
              className="bg-[#1DB954] text-black font-bold text-xl px-6 py-5 rounded-2xl text-left"
            >
              💬 Conseguir arquero
              <p className="text-sm font-normal mt-1 text-black/70">Pedí uno para tu próximo partido</p>
            </button>
            <a href="/sumate-como-arquero"
              onClick={() => setMenuOpen(false)}
              className="border border-[#1DB954] text-[#1DB954] font-bold text-xl px-6 py-5 rounded-2xl"
            >
              🧤 Sumarme como arquero
              <p className="text-sm font-normal mt-1 text-gray-400">Generá ingresos atajando</p>
            </a>
            <a href="#como-funciona"
              onClick={() => setMenuOpen(false)}
              className="border border-[#30363d] text-white font-bold text-xl px-6 py-5 rounded-2xl"
            >
              ⚽ Cómo funciona
              <p className="text-sm font-normal mt-1 text-gray-400">El proceso en 3 pasos</p>
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function Hero({ onOpenModal }) {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 gradient-verde pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1DB954]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-16 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-full px-4 py-2 text-sm text-gray-400 mb-5 md:mb-8">
            <span className="w-2 h-2 bg-[#1DB954] rounded-full animate-pulse" />
            Arqueros disponibles ahora en CABA y GBA
          </div>
          <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tight mb-6">
            Tu partido<br />
            <span className="text-[#1DB954] glow-text">no puede</span><br />
            esperar
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10 max-w-lg leading-relaxed">
            Conseguí un arquero verificado para hoy.<br />
            <span className="text-white font-semibold">En menos de 1 hora te confirmamos.</span>
          </p>
          
<div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button onClick={onOpenModal}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 text-center glow-verde w-full sm:w-auto">
              💬 Quiero un arquero ahora →
            </button>
            <a href="/sumate-como-arquero"
              className="border border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10 font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-200 text-center w-full sm:w-auto">
              🤜 Soy arquero y me sumo
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2"><span className="text-[#1DB954]">🏆</span> +50 partidos organizados</span>
            <span className="flex items-center gap-2"><span className="text-[#1DB954]">⚡</span> Respuesta en menos de 1 hora</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Arqueros() {
  const ref = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const duplicated = [...arqueros, ...arqueros]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const interval = setInterval(() => {
      if (!isPaused) {
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        } else {
          el.scrollLeft += 1
        }
      }
    }, 20)
    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <section id="arqueros" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#1DB954] font-semibold text-sm uppercase tracking-widest mb-2">Arqueros reales</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-12">Gente que ataja<br />de verdad</h2>
        <div
          ref={ref}
          className="flex md:hidden gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'auto' }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {duplicated.map((a, idx) => (
            <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden flex-shrink-0 w-[75vw]">
              <img src={a.foto} alt={a.nombre} className="w-full h-56 object-cover object-top" />
              <div className="p-4">
                <p className="text-white font-bold text-lg">{a.nombre}</p>
                <p className="text-gray-400 text-sm">Disponible en {a.zona}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-gray-500 text-sm">{a.partidos} partidos</p>
                  <span className="bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:grid grid-cols-4 gap-4">
          {arqueros.map((a) => (
            <div key={a.nombre} className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden card-hover">
              <img src={a.foto} alt={a.nombre} className="w-full h-52 object-cover object-top" />
              <div className="p-4">
                <p className="text-white font-bold text-lg">{a.nombre}</p>
                <p className="text-gray-400 text-sm">Disponible en {a.zona}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-gray-500 text-sm">{a.partidos} partidos</p>
                  <span className="bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComoFunciona({ onOpenModal }) {
  const pasos = [
    { num: '01', icon: '💬', titulo: 'Mandanos un mensaje', desc: 'Contanos cancha, fecha y horario por WhatsApp. Tardás 30 segundos.' },
    { num: '02', icon: '🔍', titulo: 'Te asignamos el mejor', desc: 'Buscamos al arquero verificado más cercano a tu cancha.' },
    { num: '03', icon: '⚽', titulo: 'A jugar', desc: 'El arquero llega puntual, listo para atajar. Vos disfrutás el partido.' },
  ]
  return (
    <section id="como-funciona" className="py-24 bg-[#161b22] border-y border-[#30363d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#1DB954] text-sm font-semibold uppercase tracking-widest mb-3">Cómo funciona</p>
          <h2 className="text-4xl md:text-5xl font-black">Tan fácil como<br /><span className="text-[#1DB954]">pedir un Uber</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {pasos.map((p) => (
            <div key={p.num} className="card-hover bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden">
              <span className="absolute top-4 right-6 text-7xl font-black text-[#30363d] leading-none select-none">{p.num}</span>
              <div className="text-4xl mb-6">{p.icon}</div>
              <h3 className="font-bold text-xl mb-3">{p.titulo}</h3>
              <p className="text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={onOpenModal}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 inline-block">
            Empezar ahora →
          </button>
        </div>
      </div>
    </section>
  )
}

function PorQueElegirnos() {
  const items = [
    { icon: '🛡️', titulo: 'Verificados', desc: 'Cada arquero pasa por un proceso de validación antes de poder atajar.' },
    { icon: '⏰', titulo: 'Puntuales', desc: 'Si no llega a tiempo, te devolvemos el crédito. Sin vueltas.' },
    { icon: '📍', titulo: 'Cerca tuyo', desc: 'Solo te asignamos arqueros de tu zona para que lleguen rápido.' },
    { icon: '⚡', titulo: 'Respuesta rápida', desc: 'En menos de 1 hora te confirmamos. Ideal para partidos de último momento.' },
  ]
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black">No es solo un arquero.<br /><span className="text-[#1DB954]">Es tranquilidad.</span></h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.titulo} className="card-hover bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <div className="text-3xl mb-4">{i.icon}</div>
            <h3 className="font-bold text-lg mb-2">{i.titulo}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonios() {
  const ref = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const duplicated = [...testimonios, ...testimonios]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const interval = setInterval(() => {
      if (!isPaused) {
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        } else {
          el.scrollLeft += 1
        }
      }
    }, 20)
    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <section id="testimonios" className="py-24 bg-[#161b22] border-y border-[#30363d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#1DB954] text-sm font-semibold uppercase tracking-widest mb-3">Testimonios</p>
          <h2 className="text-4xl md:text-5xl font-black">Lo que dicen los que<br /><span className="text-[#1DB954]">ya jugaron</span></h2>
        </div>
        <div
          ref={ref}
          className="flex md:hidden gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'auto' }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {duplicated.map((t, idx) => (
            <div key={idx} className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 flex-shrink-0 w-[80vw]">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[#1DB954]">★</span>)}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">"{t.texto}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954] font-bold text-sm">
                  {t.nombre[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.nombre}</p>
                  <p className="text-gray-500 text-xs">{t.zona}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonios.map((t) => (
            <div key={t.nombre} className="card-hover bg-[#0d1117] border border-[#30363d] rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[#1DB954]">★</span>)}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">"{t.texto}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954] font-bold text-sm">
                  {t.nombre[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.nombre}</p>
                  <p className="text-gray-500 text-xs">{t.zona}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Precios() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div className="mb-12">
        <p className="text-[#1DB954] text-sm font-semibold uppercase tracking-widest mb-3">Precios</p>
        <h2 className="text-4xl md:text-5xl font-black">Sin letra chica.<br /><span className="text-[#1DB954]">Sin sorpresas.</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 md:p-8 text-center">
          <div className="text-2xl md:text-4xl mb-2 md:mb-4">👥</div>
          <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">El equipo paga</p>
          <p className="text-2xl md:text-5xl font-black text-white mb-1">$13k</p>
          <p className="text-gray-600 text-xs hidden md:block">por partido</p>
        </div>
        <div className="bg-[#161b22] border border-[#1DB954] rounded-2xl p-4 md:p-8 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-[#1DB954]/20 border border-[#1DB954]/40 rounded-full px-2 py-0.5 text-[#1DB954] text-xs font-bold">El arquero</div>
          <div className="text-2xl md:text-4xl mb-2 md:mb-4">🧤</div>
          <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">El arquero cobra</p>
          <p className="text-2xl md:text-5xl font-black text-[#1DB954] mb-1">$10k</p>
          <p className="text-white text-xs md:text-sm font-semibold">sin pagar la cancha</p>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 md:p-8 text-center">
  <div className="text-2xl md:text-4xl mb-2 md:mb-4">⚡</div>
              <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">La plataforma</p>
              <p className="text-2xl md:text-5xl font-black text-white mb-1">$3k</p>
              <p className="text-gray-600 text-xs">para sostener el servicio</p>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 md:p-6 text-xs md:text-sm text-gray-400 text-center">
            💡 El arquero no paga la cancha ni comisión aparte. Lo que ves es lo que es.
          </div>
        </section>
      )
    }

    function SeccionArquero() {
      return (
        <section className="py-24 bg-[#0d1f12] border-y border-[#1a3d20]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              ¿Atajás bien?<br />
              <span className="text-[#1DB954]">Empezá a cobrar por eso.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">Sumate a nuestra red de arqueros y generá ingresos extra cuando quieras.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['🕐 Vos elegís cuándo', '💵 Cobrás por partido', '📍 Solo cerca de tu casa'].map((chip) => (
                <span key={chip} className="bg-[#0A0A0A] border border-[#1a3d20] text-[#1DB954] rounded-full px-4 py-2 text-sm">{chip}</span>
              ))}
            </div>
            <a href="/sumate-como-arquero"
              className="bg-white hover:bg-gray-100 text-black font-bold text-base md:text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 inline-block">
              Quiero sumarme →
            </a>
          </div>
        </section>
      )
    }

    function Footer() {
      return (
        <footer className="py-12 border-t border-[#30363d]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="font-black text-lg">Alquiler de <span className="text-[#1DB954]">Arqueros</span></div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-500 text-center">
              <a href="https://instagram.com/alquilerdearqueros" className="hover:text-white transition-colors">@alquilerdearqueros</a>
              <a href="https://wa.me/5415491164861915" className="hover:text-white transition-colors whitespace-nowrap">+54 11 6486-1915</a>
            </div>
            <p className="text-gray-600 text-sm">© 2026 Alquiler de Arqueros</p>
          </div>
        </footer>
      )
    }

    export default function App() {
      const [modalOpen, setModalOpen] = useState(false)
      const isRegistro = window.location.pathname === '/sumate-como-arquero'

      if (isRegistro) return <Registro />

      return (
        <div className="min-h-screen bg-[#0d1117] text-white">
          <FormularioModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          <Navbar onOpenModal={() => setModalOpen(true)} />
          <Hero onOpenModal={() => setModalOpen(true)} />
          <Arqueros />
          <ComoFunciona onOpenModal={() => setModalOpen(true)} />
          <PorQueElegirnos />
          <Testimonios />
          <Precios />
          <SeccionArquero />
          <Footer />
        </div>
      )
    }
