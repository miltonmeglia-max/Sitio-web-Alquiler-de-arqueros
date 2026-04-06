import { useState } from 'react'

export default function Formulario() {
  const [form, setForm] = useState({
    zona: '', fecha: '', horario: '', cancha: '', direccion: ''
  })

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const puedeEnviar = () => form.zona && form.fecha && form.horario

  const enviar = () => {
    
    
    const mensaje = `Hola! Necesito un arquero
- Zona: ${form.zona}
- Fecha: ${form.fecha}
- Horario: ${form.horario}${form.cancha ? `\n- Cancha: ${form.cancha}` : ''}${form.direccion ? `\n- Dirección: ${form.direccion}` : ''}`
    window.open(`https://wa.me/545491164861915?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="mb-10">
          <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Volver</a>
          <h1 className="text-4xl font-black mt-6 mb-2">Conseguir arquero</h1>
          <p className="text-gray-400">Completá los datos y te respondemos en menos de 1 hora.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Zona o barrio <span className="text-red-400">*</span></label>
            <input type="text" value={form.zona} onChange={e => setField('zona', e.target.value)}
              placeholder="Ej: Palermo, San Isidro, Caballito..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#1DB954] focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Fecha del partido <span className="text-red-400">*</span></label>
            <input type="date" value={form.fecha} onChange={e => setField('fecha', e.target.value)}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Horario <span className="text-red-400">*</span></label>
            <input type="time" value={form.horario} onChange={e => setField('horario', e.target.value)}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Nombre de la cancha <span className="text-gray-600">(opcional)</span></label>
            <input type="text" value={form.cancha} onChange={e => setField('cancha', e.target.value)}
              placeholder="Ej: Palermo Sport"
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#1DB954] focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Dirección <span className="text-gray-600">(opcional)</span></label>
            <input type="text" value={form.direccion} onChange={e => setField('direccion', e.target.value)}
              placeholder="Ej: Av. Santa Fe 1234"
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#1DB954] focus:outline-none transition-colors" />
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-sm text-gray-400">
            💬 Al tocar el botón se abre WhatsApp con tus datos listos. Sin tener que escribir nada.
          </div>

          <button onClick={enviar} disabled={!puedeEnviar()}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg py-4 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {puedeEnviar() ? '💬 Hablar por WhatsApp →' : 'Completá zona, fecha y horario'}
          </button>
        </div>
      </div>
    </div>
  )
}