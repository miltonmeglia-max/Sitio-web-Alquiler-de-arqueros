import { useState, useRef, useEffect } from 'react'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzG9-0cNHs1HDhmUXmSQa7elKlSWD1kyQm9IBdT1MuzpTh-vy5zp3Xq4EHntpgXu-4N/exec'
const CLOUDINARY_CLOUD = 'dlmqeunbv'
const CLOUDINARY_PRESET = 'web-alquiler-de-arqueros'

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

const subirACloudinary = async (archivo) => {
  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('upload_preset', CLOUDINARY_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  return data.secure_url
}

function ModalSalir({ onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancelar} />
      <div className="relative bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-black text-white mb-2">¿Salir del registro?</h3>
        <p className="text-gray-400 text-sm mb-8">
          Si volvés al inicio se van a borrar los datos que cargaste.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancelar} className="flex-1 border border-[#30363d] text-gray-300 font-bold py-3 rounded-full hover:border-white hover:text-white transition-all">
            Cancelar
          </button>
          <button onClick={onConfirmar} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-full transition-all">
            Sí, salir
          </button>
        </div>
      </div>
    </div>
  )
}

function SelectHora({ value, onChange, placeholder, opciones }) {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setAbierto(v => !v)}
        className={`w-full flex items-center justify-between bg-[#0d1117] border rounded-xl px-4 py-2.5 text-sm transition-colors ${abierto ? 'border-[#1DB954]' : 'border-[#30363d] hover:border-gray-500'} ${value ? 'text-white' : 'text-gray-500'}`}>
        <span>{value || placeholder}</span>
        <span className={`transition-transform duration-200 text-gray-500 ${abierto ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {abierto && (
        <div className="absolute z-20 mt-1 w-full bg-[#161b22] border border-[#1DB954]/40 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {opciones.map(h => (
              <button key={h} type="button" onClick={() => { onChange(h); setAbierto(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === h ? 'bg-[#1DB954]/20 text-[#1DB954] font-semibold' : 'text-gray-300 hover:bg-[#1DB954]/10 hover:text-white'}`}>
                {h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Registro() {
  const [paso, setPaso] = useState(1)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [mostrarModalSalir, setMostrarModalSalir] = useState(false)
  const [edadError, setEdadError] = useState('')
  const [progresoSubida, setProgresoSubida] = useState('')

  const [form, setForm] = useState({
    nombre: '', apellido: '',
    whatsapp: '',
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

  const whatsappValido = form.whatsapp.length === 10 && (form.whatsapp.startsWith('11') || form.whatsapp.startsWith('15'))

  const handleWhatsapp = (value) => {
    if (!/^\d*$/.test(value)) return
    if (value.length <= 10) setField('whatsapp', value)
  }

  const handleEdad = (value) => {
    setField('edad', value)
    const num = parseInt(value)
    if (value && (num < 18 || num > 50)) {
      setEdadError(num < 18 ? 'El servicio es solo para mayores de 18 años.' : 'La edad máxima es 50 años.')
    } else {
      setEdadError('')
    }
  }

  const toggleDia = (dia) => setForm(f => ({
    ...f,
    disponibilidad: { ...f.disponibilidad, [dia]: { ...f.disponibilidad[dia], activo: !f.disponibilidad[dia].activo, desde: '', hasta: '' } }
  }))

  const setHorario = (dia, campo, valor) => setForm(f => ({
    ...f,
    disponibilidad: { ...f.disponibilidad, [dia]: { ...f.disponibilidad[dia], [campo]: valor } }
  }))

  const toggleFormato = (f) => setForm(prev => ({
    ...prev,
    formatosArco: prev.formatosArco.includes(f) ? prev.formatosArco.filter(x => x !== f) : [...prev.formatosArco, f]
  }))

  const diaCompleto = (dia) => form.disponibilidad[dia].activo && form.disponibilidad[dia].desde && form.disponibilidad[dia].hasta

const disponibilidadValida = () =>
  diasSemana.some(dia => form.disponibilidad[dia].activo && form.disponibilidad[dia].desde && form.disponibilidad[dia].hasta)

  const puedeEnviar = () =>
    form.nombre &&
    form.apellido &&
    whatsappValido &&
    form.fotoDni &&
    form.fotosArquero.length > 0 &&
    disponibilidadValida() &&
    !edadError

  const enviar = async () => {
    setEnviando(true)
    try {
      let urlsFotos = []
      if (form.fotosArquero.length > 0) {
        setProgresoSubida(`Subiendo fotos (0/${form.fotosArquero.length})...`)
        for (let i = 0; i < form.fotosArquero.length; i++) {
          const url = await subirACloudinary(form.fotosArquero[i])
          urlsFotos.push(url)
          setProgresoSubida(`Subiendo fotos (${i + 1}/${form.fotosArquero.length})...`)
        }
      }

      let urlVideo = ''
      if (form.video) {
        setProgresoSubida('Subiendo video...')
        urlVideo = await subirACloudinary(form.video)
      }

      setProgresoSubida('Subiendo DNI...')
      const urlDni = await subirACloudinary(form.fotoDni)

      setProgresoSubida('Guardando registro...')
      const dispTexto = diasSemana.filter(d => form.disponibilidad[d].activo)
        .map(d => `${d}: ${form.disponibilidad[d].desde} a ${form.disponibilidad[d].hasta}`).join(' | ')

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          whatsapp: form.whatsapp,
          instagram: form.instagram,
          edad: form.edad,
          disponibilidad: dispTexto,
          formatos: form.formatosArco.join(', '),
          nivel: `${form.nivel} - ${niveles.find(n => n.valor === form.nivel)?.label}`,
          club: form.club,
          tipoClub: form.tipoClub,
          extraInfo: form.extraInfo,
          fotos: urlsFotos.join(' | '),
          video: urlVideo || 'No subió video',
          dni: urlDni,
        })
      })

      setEnviado(true)
    } catch (err) {
      console.error(err)
      alert('Hubo un error al subir los archivos. Intentá de nuevo.')
    }
    setEnviando(false)
    setProgresoSubida('')
  }

  const handleAtras = () => {
    if (paso === 1) {
      const tieneDatos = form.nombre || form.apellido || form.whatsapp || form.instagram || form.edad
      if (tieneDatos) { setMostrarModalSalir(true) } else { window.location.href = '/' }
    } else {
      setPaso(p => p - 1)
    }
  }

  const Chip = ({ label, activo, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activo ? 'bg-[#1DB954] border-[#1DB954] text-black' : 'bg-transparent border-[#30363d] text-gray-400 hover:border-[#1DB954] hover:text-white'}`}>
      {label}
    </button>
  )

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

  if (enviando) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6 animate-pulse">📤</div>
        <h2 className="text-2xl font-black mb-4">Enviando tu registro...</h2>
        <p className="text-[#1DB954] text-sm font-medium">{progresoSubida}</p>
        <p className="text-gray-600 text-xs mt-3">No cierres esta pantalla.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {mostrarModalSalir && (
        <ModalSalir
          onConfirmar={() => { window.location.href = '/' }}
          onCancelar={() => setMostrarModalSalir(false)}
        />
      )}

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

        {/* PASO 1 */}
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
              <input type="number" value={form.edad} onChange={e => handleEdad(e.target.value)} min={18} max={50}
                className={`w-32 bg-[#161b22] border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${edadError ? 'border-red-500 focus:border-red-400' : 'border-[#30363d] focus:border-[#1DB954]'}`} />
              {edadError
                ? <p className="text-red-400 text-xs mt-1.5">{edadError}</p>
                : <p className="text-gray-600 text-xs mt-1.5">Solo mayores de 18 años.</p>
              }
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                WhatsApp <span className="text-gray-600">(10 dígitos, sin código de área)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
             placeholder=""
                value={form.whatsapp}
                onChange={e => handleWhatsapp(e.target.value)}
                className={`w-full bg-[#161b22] border rounded-xl px-4 py-3 text-white text-lg tracking-widest focus:outline-none transition-colors ${
                  form.whatsapp.length === 10 && !whatsappValido
                    ? 'border-red-500 focus:border-red-400'
                    : whatsappValido
                    ? 'border-[#1DB954] focus:border-[#1DB954]'
                    : form.whatsapp.length > 0
                    ? 'border-yellow-500 focus:border-yellow-400'
                    : 'border-[#30363d] focus:border-[#1DB954]'
                }`}
              />
              {form.whatsapp.length === 10 && !whatsappValido
                ? <p className="text-red-400 text-xs mt-1.5">Número inválido — tiene que arrancar con 11 o 15</p>
                : form.whatsapp.length > 0 && form.whatsapp.length < 10
                ? <p className="text-yellow-500 text-xs mt-1.5">{form.whatsapp.length}/10 dígitos</p>
                : whatsappValido
                ? <p className="text-[#1DB954] text-xs mt-1.5">✓ Número válido</p>
                : <p className="text-gray-600 text-xs mt-1.5">10 dígitos, sin código de área</p>
              }
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

        {/* PASO 2 */}
        {paso === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-2">Disponibilidad</h2>
            <p className="text-gray-400 text-sm mb-2">Seleccioná los días que podés y el horario exacto.</p>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-xs text-yellow-500">
              ⚠️ Tenés que seleccionar al menos un día con horario completo para poder registrarte.
            </div>
            {diasSemana.map(dia => {
              const { activo, desde, hasta } = form.disponibilidad[dia]
              const completo = activo && desde && hasta
              return (
                <div key={dia}>
                  <button onClick={() => toggleDia(dia)}
                    className={`w-full flex items-center justify-between px-5 py-3 rounded-xl border transition-all ${completo ? 'border-[#1DB954] bg-[#0d1f12]' : activo ? 'border-[#1DB954]/40 bg-[#0d1f12]' : 'border-[#30363d] bg-[#161b22]'}`}>
                    <span className="font-medium">{dia}</span>
                    <span className={`text-sm ${completo ? 'text-[#1DB954]' : activo ? 'text-gray-500' : 'text-gray-600'}`}>
                      {completo ? '✓ Disponible' : activo ? '¿A qué hora?' : 'No disponible'}
                    </span>
                  </button>
                  {activo && (
                    <div className="flex gap-4 mt-2 px-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Desde</label>
                        <SelectHora value={desde}
                          onChange={v => { setHorario(dia, 'desde', v); if (hasta && hasta <= v) setHorario(dia, 'hasta', '') }}
                          placeholder="Desde" opciones={horasDisponibles} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
                        <SelectHora value={hasta} onChange={v => setHorario(dia, 'hasta', v)} placeholder="Hasta"
                          opciones={desde ? horasDisponibles.slice(horasDisponibles.indexOf(desde) + 4) : horasDisponibles} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Tu nivel como arquero</h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <p className="text-sm text-white font-medium">¿Con qué frecuencia atajás?</p>
              <p className="text-xs text-yellow-500 mt-1">No exageres — si no cumplís las expectativas, afecta tu reputación en la plataforma.</p>
            </div>

            <div className="bg-[#0d1f12] border border-[#1a3d20] rounded-xl px-4 py-3 text-sm text-[#1DB954]">
              💰 El pago se acredita dentro de las 48hs de que presentes el código de confirmación al alquilador. La no presentación implica expulsión de la plataforma.
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

        {/* PASO 4 */}
        {paso === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Fotos de arquero</h2>
            <p className="text-gray-400 text-sm">Subí 2-3 fotos vestido de arquero. Estas fotos las van a ver los alquiladores.</p>
            <div className="bg-[#161b22] border-2 border-dashed border-[#30363d] rounded-2xl p-10 text-center cursor-pointer hover:border-[#1DB954] transition-colors"
              onClick={() => document.getElementById('fotos-input').click()}>
              <div className="text-4xl mb-3">📸</div>
              <p className="text-white font-medium mb-1">Tocá para subir fotos</p>
              <p className="text-gray-500 text-sm">JPG o PNG — mínimo 1 foto <span className="text-red-400 font-semibold">*obligatorio</span></p>
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

        {/* PASO 5 */}
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

        {/* PASO 6 */}
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
              <p className="text-gray-500 text-sm">Frente del DNI — JPG o PNG <span className="text-red-400 font-semibold">*obligatorio</span></p>
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

        {/* PASO 7 */}
        {paso === 7 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-2">Confirmación</h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3">
              {[
                { label: 'Nombre', value: `${form.nombre} ${form.apellido}` },
                {
                  label: 'WhatsApp',
                  value: whatsappValido
                    ? form.whatsapp
                    : form.whatsapp.length < 10
                    ? `✗ Faltan dígitos (${form.whatsapp.length}/10)`
                    : '✗ Tiene que arrancar con 11 o 15'
                },
                { label: 'Edad', value: form.edad || '-' },
                { label: 'Edad', value: form.edad || '-' },
{ label: 'Días', value: diasSemana.filter(d => form.disponibilidad[d].activo && form.disponibilidad[d].desde && form.disponibilidad[d].hasta).map(d => d.slice(0, 3)).join(', ') || '✗ Falta al menos un día' },
                { label: 'Nivel', value: niveles.find(n => n.valor === form.nivel)?.label || '-' },
                { label: 'Club', value: form.tipoClub || '-' },
                { label: 'Formatos', value: form.formatosArco.join(', ') || '-' },
                { label: 'Fotos', value: form.fotosArquero.length > 0 ? `✓ ${form.fotosArquero.length} foto/s` : '✗ Falta subir' },
                { label: 'Video', value: form.video ? '✓ Subido' : 'No subió video' },
                { label: 'DNI', value: form.fotoDni ? '✓ Subido' : '✗ Falta subir' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b border-[#30363d] pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-medium text-right ${String(value).startsWith('✗') ? 'text-red-400' : 'text-white'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#1a0a0a] border border-red-900/50 rounded-xl px-4 py-4 text-sm text-gray-300 leading-relaxed">
              ⚠️ El alquilador recibe un código único antes del partido. <strong className="text-white">Pedíselo en persona al llegar</strong> — es la forma más rápida de confirmar tu presencia y cobrar dentro de las 48hs. Si por algún motivo no lo tiene, igual cobrás siempre que el alquilador lo confirme por otro medio. <strong className="text-red-400">No presentarte a un partido confirmado significa la expulsión inmediata de la plataforma</strong>, sin excepciones.
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-sm text-gray-400">
              📋 Vamos a analizar tu perfil. Si encaja con lo que buscamos, te contactamos por WhatsApp. <strong className="text-white">No todos los registros son aprobados.</strong>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="flex gap-4 mt-10">
          <button onClick={handleAtras}
            className="flex-1 border border-[#30363d] text-gray-400 font-bold py-4 rounded-full hover:border-white hover:text-white transition-all">
            ← Atrás
          </button>
          {paso < totalPasos ? (
            <button onClick={() => setPaso(p => p + 1)}
              className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-full transition-all">
              Continuar →
            </button>
          ) : (
            <button onClick={enviar} disabled={!puedeEnviar()}
              className="flex-1 bg-[#1DB954] text-black font-bold py-4 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1ed760]">
              {!puedeEnviar() ? 'Faltan completar datos' : '¡Registrarme!'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}