import { useState, useEffect } from 'react';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function getHoyIndex() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1; // Lun=0 ... Dom=6
}

function getFecha(semana, diaIndex) {
  const hoy = new Date();
  const hoyIndex = getHoyIndex();
  const diff = semana === 'esta' ? diaIndex - hoyIndex : (7 - hoyIndex) + diaIndex;
  const fecha = new Date(hoy);
  fecha.setDate(hoy.getDate() + diff);
  return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' });
}

export default function FormularioModal({ isOpen, onClose }) {
  const [semana, setSemana] = useState(null);
  const [dia, setDia] = useState(null);
  const [horario, setHorario] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [cancha, setCancha] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [errors, setErrors] = useState({});

  const hoyIndex = getHoyIndex();

  const diasDisponibles = semana === 'esta'
    ? DIAS.map((d, i) => ({ label: d, index: i })).filter(d => d.index >= hoyIndex)
    : DIAS.map((d, i) => ({ label: d, index: i }));

  useEffect(() => {
    if (!isOpen) {
      setSemana(null); setDia(null); setHorario('');
      setUbicacion(''); setCancha(null); setEnviado(false); setErrors({});
    }
  }, [isOpen]);

  useEffect(() => { setDia(null); }, [semana]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validate = () => {
    const e = {};
    if (!semana || dia === null) e.dia = true;
    if (!horario.trim()) e.horario = true;
    if (!ubicacion.trim()) e.ubicacion = true;
    if (!cancha) e.cancha = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEnviar = () => {
    if (!validate()) return;
    const fecha = getFecha(semana, dia);
    const diaNombre = DIAS[dia];
    const semanaLabel = semana === 'esta' ? 'esta semana' : 'la próxima semana';
    const msg = `Hola! Quiero reservar un arquero 🧤\n📅 ${diaNombre} ${fecha} (${semanaLabel})\n⏰ ${horario}hs\n📍 ${ubicacion}\n⚽ Fútbol ${cancha}`;
    window.open(`https://wa.me/1164861915?text=${encodeURIComponent(msg)}`, '_blank');
    setEnviado(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#30363d] bg-[#0d1117] overflow-hidden"
        style={{ boxShadow: '0 0 0 1px #30363d, 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(29,185,84,0.07)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Barra verde superior */}
        <div className="h-1 w-full bg-[#1DB954]" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#30363d]">
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Conseguí tu arquero</h2>
            <p className="text-sm text-gray-500 mt-0.5">Completá los datos y te conectamos por WhatsApp</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-300 transition-colors text-lg leading-none mt-0.5 ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {!enviado ? (
          <div className="px-6 py-5 space-y-5">

            {/* DÍA */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-300">¿Para cuándo?</label>
                {errors.dia && <span className="text-red-400 text-xs">Seleccioná un día</span>}
              </div>

              {/* Chips semana */}
              <div className="flex gap-2 mb-3">
                {[
                  { val: 'esta', label: 'Esta semana' },
                  { val: 'proxima', label: 'Próxima semana' }
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setSemana(val)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                      semana === val
                        ? 'bg-[#1DB954] border-[#1DB954] text-black'
                        : 'border-[#30363d] text-gray-400 hover:border-[#1DB954]/60 hover:text-white bg-[#161b22]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Chips días */}
              {semana && (
                <div className="flex flex-wrap gap-2">
                  {diasDisponibles.map(({ label, index }) => (
                    <button
                      key={index}
                      onClick={() => setDia(index)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                        dia === index
                          ? 'bg-[#1DB954] border-[#1DB954] text-black'
                          : 'border-[#30363d] text-gray-400 hover:border-[#1DB954]/60 hover:text-white bg-[#161b22]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* HORARIO */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-300">Horario</label>
                {errors.horario && <span className="text-red-400 text-xs">Requerido</span>}
              </div>
              <input
                type="text"
                placeholder="Ej: 21hs"
                value={horario}
                onChange={e => setHorario(e.target.value)}
                className={`w-full bg-[#161b22] border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-colors duration-150 ${
                  errors.horario
                    ? 'border-red-500/70 focus:border-red-400'
                    : 'border-[#30363d] focus:border-[#1DB954]'
                }`}
              />
            </div>

            {/* UBICACIÓN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-300">Ubicación</label>
                {errors.ubicacion && <span className="text-red-400 text-xs">Requerido</span>}
              </div>
              <input
                type="text"
                placeholder="Ej: Cancha Los Pinos, Flores / Av. Rivadavia 5200"
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
                className={`w-full bg-[#161b22] border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none transition-colors duration-150 ${
                  errors.ubicacion
                    ? 'border-red-500/70 focus:border-red-400'
                    : 'border-[#30363d] focus:border-[#1DB954]'
                }`}
              />
            </div>

            {/* TIPO DE CANCHA */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-300">Tipo de cancha</label>
                {errors.cancha && <span className="text-red-400 text-xs">Requerido</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {['5', '7', '8', '9', '11'].map(f => (
                  <button
                    key={f}
                    onClick={() => setCancha(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                      cancha === f
                        ? 'bg-[#1DB954] border-[#1DB954] text-black'
                        : 'border-[#30363d] text-gray-400 hover:border-[#1DB954]/60 hover:text-white bg-[#161b22]'
                    }`}
                  >
                    F{f}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleEnviar}
              className="w-full bg-[#1DB954] hover:bg-[#1aab4d] active:scale-[0.98] text-black font-bold py-3.5 rounded-full transition-all duration-150 text-sm mt-1"
            >
              💬 Enviar por WhatsApp →
            </button>

            <p className="text-center text-xs text-gray-600 pb-1">
              Te confirmamos en menos de 1 hora 🧤
            </p>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-5xl mb-4">🧤</div>
            <h3 className="text-xl font-bold text-white mb-2">¡Listo!</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Te estamos redirigiendo a WhatsApp.<br />
              En menos de 1 hora te confirmamos tu arquero.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}