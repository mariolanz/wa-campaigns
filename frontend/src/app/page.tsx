'use client';
import { useState } from 'react';

type UploadSummary = { total: number; valid: number; invalid: number; duplicates: number };

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('Hola {{nombre}}, ¡gracias por tu interés!');
  const [startAt, setStartAt] = useState('');
  const [intervalSec, setIntervalSec] = useState(60);
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null);
  const [sessionQR, setSessionQR] = useState<string | null>(null);
  const [instanceName, setInstanceName] = useState('octocom');

  const [mediaType, setMediaType] = useState<'image'|'video'|'document'|''>('');
  const [media, setMedia] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function startSession() {
    const res = await fetch(`${apiBase}/evolution/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceName })
    });
    const data = await res.json();
    setSessionQR(data.qr || data.base64 || null);
    alert(`Instancia creada/iniciada: ${data.instance || instanceName}`);
  }

  async function uploadContacts() {
    if (!file) return alert('Selecciona un CSV con columna "phone" y opcional "nombre"');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${apiBase}/contacts/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    setUploadSummary(data);
  }

  async function createCampaign() {
    if (!startAt) return alert('Define fecha/hora de inicio');
    const payload: any = {
      name: 'Campaña rápida',
      messageTemplate: message,
      startAt,
      intervalSec: Number(intervalSec)
    };
    if (mediaType && media) {
      payload.mediaType = mediaType;
      payload.media = media;
      if (mediaCaption) payload.mediaCaption = mediaCaption;
      if (mediaFileName) payload.mediaFileName = mediaFileName;
    }
    const res = await fetch(`${apiBase}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');
    alert('Campaña creada. ID: ' + data.id);
  }

  return (
    <div>
      <h1>WA Campaigns</h1>
      <p>Conecta tu WhatsApp con Evolution API, sube contactos, redacta un mensaje y programa envíos (mín 60s).</p>

      <section style={{marginTop:20}}>
        <h2>1) Conectar WhatsApp</h2>
        <label>Instance name</label>
        <input value={instanceName} onChange={(e)=> setInstanceName(e.target.value)} style={{width:220}} />
        <button onClick={startSession} style={{marginLeft:8}}>Iniciar sesión y obtener QR</button>
        {sessionQR && (
          <div>
            <p>Escanea este QR con WhatsApp:</p>
            <img src={sessionQR} alt="QR" style={{width:240,height:240}} />
          </div>
        )}
        <p className="small">Usa la instancia por defecto <b>octocom</b>.</p>
      </section>

      <section style={{marginTop:20}}>
        <h2>2) Subir contactos (CSV)</h2>
        <input type="file" accept=".csv" onChange={(e)=> setFile(e.target.files?.[0]||null)} />
        <button onClick={uploadContacts}>Subir</button>
        {uploadSummary && (
          <pre>{JSON.stringify(uploadSummary, null, 2)}</pre>
        )}
      </section>

      <section style={{marginTop:20}}>
        <h2>3) Crear campaña</h2>
        <label>Mensaje</label>
        <textarea value={message} onChange={(e)=> setMessage(e.target.value)} rows={5} style={{width:'100%', maxWidth:600}} />
        <label>Inicio (ISO, ej. 2025-08-12T14:30:00-04:00)</label>
        <input value={startAt} onChange={(e)=> setStartAt(e.target.value)} style={{width:320}} />
        <label>Intervalo (segundos, mínimo 60)</label>
        <input type="number" value={intervalSec} onChange={(e)=> setIntervalSec(Number(e.target.value))} min={60} />

        <hr />
        <h3>Media (opcional, igual para todos)</h3>
        <label>Tipo de media</label>
        <select value={mediaType} onChange={e=> setMediaType(e.target.value as any)}>
          <option value="">(ninguno)</option>
          <option value="image">Imagen</option>
          <option value="video">Video</option>
          <option value="document">Documento</option>
        </select>
        {mediaType && (
          <>
            <label>Media URL o base64</label>
            <input value={media} onChange={e=> setMedia(e.target.value)} style={{width:'100%', maxWidth:600}} />
            <label>Caption (opcional)</label>
            <input value={mediaCaption} onChange={e=> setMediaCaption(e.target.value)} style={{width:'100%', maxWidth:600}} />
            <label>Nombre de archivo (opcional; ej. oferta.pdf)</label>
            <input value={mediaFileName} onChange={e=> setMediaFileName(e.target.value)} style={{width:300}} />
          </>
        )}

        <div style={{marginTop:10}}>
          <button onClick={createCampaign}>Programar</button>
        </div>
      </section>
    </div>
  );
}