import { useState } from 'react'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0GJQAdlO9nJ_W97GCtCcqeUbuebLKh5cx8CVZ1hi8SIaSNmepiSlRDADXpxXGeKt9/exec'

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const niveles = [
  { valor: 1, label: 'Juego menos de una vez por semana con amigos' },
  { valor: 2, label: 'Juego una vez por semana con amigos' },
  { valor: 3, label: 'Atajo 3 o más veces por semana con amigos' },
  { valor: 4, label: 'Ex arquero de fútsal o fútbol 11' },
  { valor: 5, label: 'Arquero activo en un club' },
]
const formatos = ['Fútbol 5', 'Fútbol 7', 'Fútbol 8', 'Fútbol 9', 'Fútbol 11']
const totalPasos = 7

const horasDisponibles = Array.from({ length: 29 }, (_, i) => {
  const hora = Math.floor(i / 2) + 9
  const minutos = i % 2 === 0 ? '00' : '30'
  return `${hora.toString().padStart(2, '0')}:${minutos}`
})

export default function Registro() {
  const [paso, setPaso] = useState(1)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '',
    whatsapp: Array(10).fill(''),
    instagram: '', edad: '',
    disponibilidad: diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: { activo: false, desde: '', hasta: '' } }), {}),
    formatosArco: [],
    nivel: null,
    club: '',
    tipoClub: '',
    extraInfo: '',
    fotosArquero: [],
    video: null,
    fotoDni: null,
  })

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleWhatsapp = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const nuevo = [...form.whatsapp]
    nuevo[index] = value.slice(-1)
    setField('whatsapp', nuevo)
    if (value && index < 9) document.getElementById(`wa-${index + 1}`)?.focus()
  }

  const handleWhatsappKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !form.whatsapp[index] && index > 0)
      document.getElementById(`wa-${index - 1}`)?.focus()
  }

  const toggleDia = (dia) => setForm(f => ({
    ...f,
    disponibilidad: { ...f.disponibilidad, [dia]: { ...f.disponibilidad[dia], activo: !f.disponibilidad[dia].activo } }
  }))

  const setHorario = (dia, campo, valor) => setForm(f => ({
    ...f,
    disponibilidad: { ...f.disponibilidad, [dia]: { ...f.disponibilidad[dia], [campo]: valor } }
  }))

  const toggleFormato = (f) => setForm(prev => ({
    ...prev,
    formatosArco: prev.formatosArco.includes(f) ? prev.formatosArco.filter(x => x !== f) : [...prev.formatosArco, f]
  }))

  const puedeEnviar = () => form.nombre && form.apellido && form.whatsapp.every(d => d !== '') && form.fotoDni

  const enviar = async () => {
    setEnviando(true)
    const dispTexto = diasSemana.filter(d => form.disponibilidad[d].activo)
      .map(d => `${d}: ${form.disponibilidad[d].desde} a ${form.disponibilidad[d].hasta}`).join(' | ')
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre, apellido: form.apellido,
          whatsapp: form.whatsapp.join(''), instagram: form.instagram, edad: form.edad,
          disponibilidad: dispTexto, formatos: form.formatosArco.join(', '),
          nivel: `${form.nivel} - ${niveles.find(n => n.valor === form.nivel)?.label}`,
          club: form.club, tipoClub: form.tipoClub, extraInfo: form.extraInfo,
          fotosDrive: 'Pendiente de revisión',
        })
      })
      setEnviado(true)
    } catch { alert('Hubo un error, intentá de nuevo') }
    setEnviando(false)
  }

  const Chip = ({ label, activo, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activo ? 'bg-[#1DB954] border-[#1DB954] text-black' : 'bg-transparent border-[#30363d] text-gray-400 hover:border-[#1DB954] hover:text-white'}`}>
      {label}
    </button>
  )

  const SelectHora = ({ value, onChange, placeholder, minHora }) => {
  const opciones = minHora
    ? horasDisponibles.filter(h => h > minHora)
    : horasDisponibles
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:border-[#1DB954] focus:outline-none transition-colors">
      <option value="">{placeholder}</option>
      {opciones.map(h => <option key={h} value={h}>{h}</option>)}
    </select>
  )
}







  if (enviado) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🧤</div>
        <h2 className="text-4xl font-black mb-4">¡Recibimos tu registro!</h2>
        <p className="text-gray-400 text-lg mb-4">Vamos a analizar tus datos y si tu perfil encaja, te contactamos por WhatsApp.</p>
        <p className="text-gray-600 text-sm mb-8">No todos los registros son aprobados — buscamos arqueros comprometidos y con experiencia real.</p>
        <a href="/" className="bg-[#1DB954] text-black font-bold px-8 py-4 rounded-full inline-block hover:bg-[#1ed760] transition-all">Volver al inicio</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          
          <h1 className="text-4xl font-black mt-6 mb-2">Sumate como arquero</h1>
          <p className="text-gray-400">Completá todo — si tu perfil encaja, te contactamos.</p>
        </div>
        <div className="flex gap-1.5 mb-2">
          {Array.from({ length: totalPasos }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < paso ? 'bg-[#1DB954]' : 'bg-[#30363d]'}`} />
          ))}
        </div>
        <p className="text-gray-600 text-xs mb-10">Paso {paso} de {totalPasos}</p>

        {paso === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-6">Datos personales</h2>
            <div className="grid grid-cols-2 gap-4">
              {[{ key: 'nombre', label: 'Nombre' }, { key: 'apellido', label: 'Apellido' }].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-sm text-gray-400 mb-1 block">{label}</label>
                  <input type="text" value={form[key]} onChange={e => setField(key, e.target.value)}
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors" />
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Edad</label>
              <input type="number" value={form.edad} onChange={e => setField('edad', e.target.value)}
                className="w-32 bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-3 block">WhatsApp <span className="text-gray-600">(sin código de área)</span></label>
              <div className="flex gap-2">
                {form.whatsapp.map((digit, i) => (
                  <input key={i} id={`wa-${i}`} type="text" inputMode="numeric" value={digit} maxLength={1}
                    onChange={e => handleWhatsapp(i, e.target.value)} onKeyDown={e => handleWhatsappKeyDown(i, e)}
                    className="w-9 h-12 text-center bg-[#161b22] border border-[#30363d] rounded-lg text-white text-lg font-bold focus:border-[#1DB954] focus:outline-none transition-colors" />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Instagram <span className="text-gray-600">(sin @, opcional)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">@</span>
                <input type="text" value={form.instagram} onChange={e => setField('instagram', e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-8 pr-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors" />
              </div>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-2">Disponibilidad</h2>
            <p className="text-gray-400 text-sm mb-6">Seleccioná los días que podés y el horario exacto.</p>
            {diasSemana.map(dia => (
              <div key={dia}>
                <button onClick={() => toggleDia(dia)}
                  className={`w-full flex items-center justify-between px-5 py-3 rounded-xl border transition-all ${form.disponibilidad[dia].activo ? 'border-[#1DB954] bg-[#0d1f12]' : 'border-[#30363d] bg-[#161b22]'}`}>
                  <span className="font-medium">{dia}</span>
                  <span className={`text-sm ${form.disponibilidad[dia].activo ? 'text-[#1DB954]' : 'text-gray-600'}`}>
                    {form.disponibilidad[dia].activo ? '✓ Disponible' : 'No disponible'}
                  </span>
                </button>
                {form.disponibilidad[dia].activo && (
                  <div className="flex gap-4 mt-2 px-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Desde</label>
                      <SelectHora value={form.disponibilidad[dia].desde} onChange={v => setHorario(dia, 'desde', v)} placeholder="Desde" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
                      
                      <SelectHora value={form.disponibilidad[dia].hasta} onChange={v => setHorario(dia, 'hasta', v)} placeholder="Hasta"
  minHora={form.disponibilidad[dia].desde
    ? horasDisponibles[horasDisponibles.indexOf(form.disponibilidad[dia].desde) + 2] ?? '23:30'
    : undefined}
/>

                   
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {paso === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Tu nivel como arquero</h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <p className="text-sm text-white font-medium">¿Con qué frecuencia atajás?</p>
              <p className="text-xs text-yellow-500 mt-1">No exageres — si no cumplís las expectativas, afecta tu reputación en la plataforma.</p>
            </div>
            <div className="space-y-3">
              {niveles.map(n => (
                <button key={n.valor} onClick={() => setField('nivel', n.valor)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${form.nivel === n.valor ? 'border-[#1DB954] bg-[#0d1f12]' : 'border-[#30363d] bg-[#161b22] hover:border-gray-500'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-black ${form.nivel === n.valor ? 'text-[#1DB954]' : 'text-gray-600'}`}>{n.valor}</span>
                    <span className="text-sm">{n.label}</span>
                  </div>
                  {n.valor === 1 && form.nivel === 1 && <p className="text-xs text-red-400 mt-2 ml-10">⚠️ Buscamos arqueros con experiencia regular.</p>}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-3 block">Formatos en los que atajás</label>
              <div className="flex flex-wrap gap-2">
                {formatos.map(f => <Chip key={f} label={f} activo={form.formatosArco.includes(f)} onClick={() => toggleFormato(f)} />)}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-3 block">¿Atajás en algún club? <span className="text-gray-600">(amateur o profesional)</span></label>
              <div className="flex gap-3 flex-wrap">
                {['No', 'Fútbol 11', 'Fútsal'].map(op => (
                  <Chip key={op} label={op} activo={form.tipoClub === op} onClick={() => setField('tipoClub', op)} />
                ))}
              </div>
              {form.tipoClub && form.tipoClub !== 'No' && (
                <input type="text" placeholder="Nombre del club (opcional)" value={form.club} onChange={e => setField('club', e.target.value)}
                  className="w-full mt-3 bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors" />
              )}
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">¿Algo más que nos quieras contar? <span className="text-gray-600">(opcional)</span></label>
              <textarea value={form.extraInfo} onChange={e => setField('extraInfo', e.target.value)}
                rows={3} placeholder="Contanos lo que quieras..."
                className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors resize-none" />
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Fotos de arquero</h2>
            <p className="text-gray-400 text-sm">Subí 2-3 fotos vestido de arquero. Estas fotos las van a ver los alquiladores.</p>
            <div className="bg-[#161b22] border-2 border-dashed border-[#30363d] rounded-2xl p-10 text-center cursor-pointer hover:border-[#1DB954] transition-colors"
              onClick={() => document.getElementById('fotos-input').click()}>
              <div className="text-4xl mb-3">📸</div>
              <p className="text-white font-medium mb-1">Tocá para subir fotos</p>
              <p className="text-gray-500 text-sm">JPG o PNG — mínimo 1 foto</p>
              <input id="fotos-input" type="file" accept="image/*" multiple className="hidden"
                onChange={e => setField('fotosArquero', Array.from(e.target.files))} />
            </div>
            {form.fotosArquero.length > 0 && (
              <div className="space-y-2">
                {form.fotosArquero.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#161b22] border border-[#1DB954]/40 rounded-xl px-4 py-3">
                    <span className="text-[#1DB954]">✓</span>
                    <span className="text-sm text-gray-300 truncate">{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {paso === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Video atajando <span className="text-gray-500 text-lg font-normal">(opcional)</span></h2>
            <p className="text-gray-400 text-sm">Subí un video propio atajando. Tiene que ser tuyo — no vale YouTube ni clips de otros.</p>
            <div className="bg-[#161b22] border-2 border-dashed border-[#30363d] rounded-2xl p-10 text-center cursor-pointer hover:border-[#1DB954] transition-colors"
              onClick={() => document.getElementById('video-input').click()}>
              <div className="text-4xl mb-3">🎥</div>
              <p className="text-white font-medium mb-1">Tocá para subir un video</p>
              <p className="text-gray-500 text-sm">MP4 — máximo 50MB — opcional</p>
              <input id="video-input" type="file" accept="video/mp4,video/quicktime" className="hidden"
                onChange={e => setField('video', e.target.files[0])} />
            </div>
            {form.video && (
              <div className="flex items-center gap-3 bg-[#161b22] border border-[#1DB954]/40 rounded-xl px-4 py-3">
                <span className="text-[#1DB954]">✓</span>
                <span className="text-sm text-gray-300 truncate">{form.video.name}</span>
              </div>
            )}
          </div>
        )}

        {paso === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Foto de tu DNI</h2>
            <div className="bg-[#0d1f12] border border-[#1a3d20] rounded-xl p-4 text-sm text-[#1DB954]">
              🔒 Esto es solo para verificar que sos vos. Tus datos están seguros y no se comparten con nadie.
            </div>
            <div className="bg-[#161b22] border-2 border-dashed border-[#30363d] rounded-2xl p-10 text-center cursor-pointer hover:border-[#1DB954] transition-colors"
              onClick={() => document.getElementById('dni-input').click()}>
              <div className="text-4xl mb-3">🪪</div>
              <p className="text-white font-medium mb-1">Tocá para subir la foto del DNI</p>
              <p className="text-gray-500 text-sm">Frente del DNI — JPG o PNG</p>
              <input id="dni-input" type="file" accept="image/*" className="hidden"
                onChange={e => setField('fotoDni', e.target.files[0])} />
            </div>
            {form.fotoDni && (
              <div className="flex items-center gap-3 bg-[#161b22] border border-[#1DB954]/40 rounded-xl px-4 py-3">
                <span className="text-[#1DB954]">✓</span>
                <span className="text-sm text-gray-300 truncate">{form.fotoDni.name}</span>
              </div>
            )}
          </div>
        )}

        {paso === 7 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Confirmación</h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3">
              {[
                { label: 'Nombre', value: `${form.nombre} ${form.apellido}` },
                { label: 'WhatsApp', value: form.whatsapp.join('') },
                { label: 'Edad', value: form.edad },
                { label: 'Nivel', value: niveles.find(n => n.valor === form.nivel)?.label || '-' },
                { label: 'Club', value: form.tipoClub || '-' },
                { label: 'Formatos', value: form.formatosArco.join(', ') || '-' },
                { label: 'Fotos', value: `${form.fotosArquero.length} foto/s` },
                { label: 'DNI', value: form.fotoDni ? '✓ Subido' : '✗ Falta subir' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b border-[#30363d] pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-white font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-sm text-gray-400">
              📋 Vamos a analizar tu perfil. Si encaja con lo que buscamos, te contactamos por WhatsApp. <strong className="text-white">No todos los registros son aprobados.</strong>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-10">
     
{paso === 1 ? (
  <button
    onClick={() => {
      const tieneDatos = form.nombre || form.apellido || form.whatsapp.some(d => d !== '') || form.instagram || form.edad
      if (tieneDatos) {
        const confirmar = window.confirm('¿Salir del registro?\n\nSi volvés al inicio se van a borrar los datos que cargaste.')
        if (confirmar) window.location.href = '/'
      } else {
        window.location.href = '/'
      }
    }}
    className="flex-1 border border-[#30363d] text-gray-400 font-bold py-4 rounded-full hover:border-white hover:text-white transition-all">
    ← Atrás
  </button>
) : (
  <button onClick={() => setPaso(p => p - 1)}
    className="flex-1 border border-[#30363d] text-gray-400 font-bold py-4 rounded-full hover:border-white hover:text-white transition-all">
    ← Atrás
  </button>
)}




          {paso < totalPasos ? (
            <button onClick={() => setPaso(p => p + 1)}
              className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-full transition-all">
              Continuar →
            </button>
          ) : (
            <button onClick={enviar} disabled={enviando || !puedeEnviar()}
              className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-full transition-all disabled:opacity-50">
              {enviando ? 'Enviando...' : '¡Registrarme!'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}