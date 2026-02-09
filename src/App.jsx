import React, { useState, useRef } from 'react';
import {
  Download, Plus, Trash2, Layout, FileText, User, Type,
  Info, AlignLeft, List, Grid, Image as ImageIcon,
  ChevronUp, ChevronDown, School, BookOpen, Upload, FileJson, CheckCircle2,
  Sparkles, Monitor, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const App = () => {
  const [coverType, setCoverType] = useState('full');
  const [importStatus, setImportStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // editor | preview
  const fileInputRef = useRef(null);

  const [docData, setDocData] = useState({
    institution: 'INGENIERÍA EN SISTEMAS COMPUTACIONALES (ISC)',
    subject: 'Administración de Redes',
    professor: 'Profra. Ana Cecilia Segundo',
    semester: 'OCTAVO SEMESTRE',
    title: 'CONCEPTOS WAN',
    subtitle: 'Actividad Packet Tracer 7.6.1 - Cuadro Comparativo',
    author: 'JOSE DE JESUS VEGA ORTIZ',
    date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    email: 'jose.vega@tecnologico.edu.mx',
    sections: [
      {
        id: 'init-1',
        type: 'text',
        title: 'Introducción',
        content: 'Bienvenido al generador automático. Puedes editar estos campos o importar un archivo HTML para llenar el reporte en segundos.'
      }
    ]
  });

  // --- LÓGICA DE IMPORTACIÓN ---
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      const newSections = [];

      // Intentar extraer metadatos
      const metaAuthor = doc.querySelector('meta[name="author"]')?.content;
      const metaSubject = doc.querySelector('meta[name="subject"]')?.content;
      const h1 = doc.querySelector('h1')?.innerText;
      const h2 = doc.querySelector('h2')?.innerText;

      // Procesar nodos del cuerpo
      const bodyElements = doc.body.children;
      Array.from(bodyElements).forEach((el, idx) => {
        const id = `import-${idx}-${Math.random().toString(36).substr(2, 5)}`;

        if (el.tagName === 'P') {
          newSections.push({ id, type: 'text', title: 'Información', content: el.innerText });
        } else if (el.tagName === 'UL' || el.tagName === 'OL') {
          const items = Array.from(el.querySelectorAll('li')).map(li => li.innerText);
          newSections.push({ id, type: 'list', title: 'Puntos Clave', items });
        } else if (el.tagName === 'TABLE') {
          const headers = Array.from(el.querySelectorAll('th')).map(th => th.innerText);
          const rows = Array.from(el.querySelectorAll('tr'))
            .filter(tr => tr.querySelector('td'))
            .map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText));
          newSections.push({
            id,
            type: 'table',
            title: 'Cuadro Comparativo',
            headers: headers.length ? headers : (rows[0]?.map((_, i) => `Col ${i + 1}`) || []),
            rows
          });
        } else if (el.tagName === 'IMG') {
          newSections.push({ id, type: 'image', url: el.src, caption: el.alt || 'Imagen importada', ref: 'Fuente: Archivo' });
        }
      });

      setDocData(prev => ({
        ...prev,
        title: h1 || prev.title,
        subtitle: h2 || prev.subtitle,
        author: metaAuthor || prev.author,
        subject: metaSubject || prev.subject,
        sections: newSections.length ? newSections : prev.sections
      }));

      setImportStatus('success');
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  // --- GESTIÓN DE SECCIONES MANUAL ---
  const addSection = (type) => {
    const newSection = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: 'Nueva Sección',
      ...(type === 'text' && { content: 'Contenido...' }),
      ...(type === 'table' && { headers: ['Encabezado 1', 'Encabezado 2'], rows: [['Dato A', 'Dato B']] }),
      ...(type === 'list' && { items: ['Nuevo ítem'] }),
      ...(type === 'image' && { url: '', caption: '', ref: '' })
    };
    setDocData({ ...docData, sections: [...docData.sections, newSection] });
  };

  const updateSection = (id, newData) => {
    setDocData({
      ...docData,
      sections: docData.sections.map(s => s.id === id ? { ...s, ...newData } : s)
    });
  };

  return (
    <div className="h-screen w-full bg-[#020617] text-slate-200 flex font-sans overflow-hidden selection:bg-indigo-500/30">

      {/* SIDEBAR DE CONTROL - GLASSMORPHISM */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-[450px] min-w-[450px] h-screen glass-panel flex flex-col z-20 print:hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-indigo-900/20 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
                <School size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">Edu<span className="text-indigo-400">Draft</span> PRO</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Smart AI Engine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

          {/* Import / Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" /> Actions
            </h3>

            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full relative group overflow-hidden rounded-2xl glass-button p-6 border-dashed border-2 flex flex-col items-center justify-center gap-3 transition-all hover:border-indigo-500/50 hover:bg-slate-800/80"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Upload className="text-slate-400 group-hover:text-indigo-400" size={20} />
              </div>
              <div className="text-center z-10">
                <p className="text-sm font-bold text-white mb-1">Import HTML File</p>
                <p className="text-[10px] text-slate-500">Supports .html, .htm extraction</p>
              </div>
              {importStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-emerald-900/90 flex items-center justify-center gap-2 text-emerald-200 font-bold backdrop-blur-sm"
                >
                  <CheckCircle2 size={18} /> Successfully Imported!
                </motion.div>
              )}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".html,.htm,.txt" className="hidden" />
          </div>

          {/* Data Inputs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
              <BookOpen size={14} className="text-indigo-400" /> Course Details
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="glass-input-group">
                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block pl-1">Institution</label>
                <input className="w-full glass-input rounded-xl p-3 text-xs" value={docData.institution} onChange={(e) => setDocData({ ...docData, institution: e.target.value })} />
              </div>
              <div className="glass-input-group">
                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block pl-1">Subject</label>
                <input className="w-full glass-input rounded-xl p-3 text-xs" value={docData.subject} onChange={(e) => setDocData({ ...docData, subject: e.target.value })} />
              </div>
              <div className="glass-input-group">
                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block pl-1">Title</label>
                <input className="w-full glass-input rounded-xl p-3 text-xs font-bold text-white/90" value={docData.title} onChange={(e) => setDocData({ ...docData, title: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block pl-1">Author</label>
                  <input className="w-full glass-input rounded-xl p-3 text-xs" value={docData.author} onChange={(e) => setDocData({ ...docData, author: e.target.value })} />
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block pl-1">Date</label>
                  <input className="w-full glass-input rounded-xl p-3 text-xs" value={docData.date} onChange={(e) => setDocData({ ...docData, date: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Components Builder */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <Palette size={14} className="text-indigo-400" /> Builder
              </h3>
              <div className="glass-panel rounded-full p-1 flex gap-1">
                <button onClick={() => setCoverType('full')} className={clsx("px-3 py-1 text-[9px] font-black rounded-full transition-all", coverType === 'full' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-white')}>FULL</button>
                <button onClick={() => setCoverType('rapid')} className={clsx("px-3 py-1 text-[9px] font-black rounded-full transition-all", coverType === 'rapid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-white')}>RAPID</button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { t: 'text', i: AlignLeft, l: 'Text' },
                { t: 'table', i: Grid, l: 'Table' },
                { t: 'list', i: List, l: 'List' },
                { t: 'image', i: ImageIcon, l: 'Image' }
              ].map(b => (
                <button key={b.t} onClick={() => addSection(b.t)} className="flex flex-col items-center gap-2 p-3 glass-button hover:bg-indigo-600/20 hover:border-indigo-500/30 rounded-2xl group transition-all">
                  <b.i size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase text-slate-500 group-hover:text-white">{b.l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section List */}
          <div className="space-y-3 pb-20">
            <AnimatePresence>
              {docData.sections.map((sec, idx) => (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-panel rounded-2xl p-4 group hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md">{idx + 1}. {sec.type}</span>
                    <button onClick={() => setDocData({ ...docData, sections: docData.sections.filter(s => s.id !== sec.id) })} className="text-slate-600 hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                  </div>
                  <input
                    className="w-full bg-transparent border-b border-transparent focus:border-indigo-500/50 pb-1 text-sm font-bold text-white mb-2 outline-none transition-all placeholder-slate-600"
                    value={sec.title}
                    onChange={(e) => updateSection(sec.id, { title: e.target.value })}
                    placeholder="Section Title"
                  />

                  {sec.type === 'text' && (
                    <textarea className="w-full glass-input p-3 text-xs rounded-xl h-24 outline-none resize-none" value={sec.content} onChange={(e) => updateSection(sec.id, { content: e.target.value })} />
                  )}
                  {sec.type === 'list' && (
                    <div className="space-y-2">
                      {sec.items.map((it, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                          <input className="w-full glass-input p-2 text-xs rounded-lg border-none" value={it} onChange={(e) => {
                            const newItems = [...sec.items]; newItems[i] = e.target.value; updateSection(sec.id, { items: newItems });
                          }} />
                        </div>
                      ))}
                      <button className="text-[9px] text-indigo-400 font-bold hover:text-indigo-300 ml-3.5" onClick={() => updateSection(sec.id, { items: [...sec.items, ''] })}>+ Add Item</button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Generate Button */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-30 print:hidden">
          <button onClick={() => window.print()} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 transform transition-all active:scale-95 group">
            <Download size={20} className="group-hover:animate-bounce" /> GENERATE PDF REPORT
          </button>
        </div>
      </motion.aside>

      {/* PREVIEW AREA */}
      <main className="flex-1 bg-[#020617] overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Toolbar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 z-10 mx-6 mt-4 glass-panel rounded-full print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full">
              <Monitor size={12} /> 100% Zoom
            </div>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 overflow-y-auto p-12 flex justify-center items-start custom-scrollbar z-0 print:p-0">
          <div id="pdf-content" className="bg-white text-slate-800 shadow-2xl shadow-black/50 w-[8.5in] min-h-[11in] relative overflow-hidden print:m-0 print:shadow-none print:w-full transition-transform duration-300 origin-top">

            {/* --- PDF DESIGN --- */}
            {/* PORTADA COMPLETA */}
            {coverType === 'full' && (
              <section className="h-[11in] relative p-12 flex flex-col justify-between page-break bg-slate-50">
                <div className="absolute inset-0 main-gradient geometric-mask h-[60%] z-0" />

                <div className="relative z-10 text-center text-white mt-10">
                  <p className="text-xs font-black tracking-[0.4em] uppercase opacity-70 mb-4 border-b border-white/20 pb-4 inline-block">{docData.institution}</p>
                  <h1 className="text-6xl font-black uppercase tracking-tight leading-[0.9] mb-6 drop-shadow-2xl">
                    {docData.title}
                  </h1>
                  <div className="w-24 h-2 bg-indigo-400 mx-auto mb-6" />
                  <p className="text-lg font-light text-indigo-100 italic max-w-xl mx-auto">{docData.subtitle}</p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-10 border-t border-slate-200 pt-10">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest mb-1 flex items-center gap-2"><BookOpen size={12} /> Subject</p>
                      <p className="text-xl font-bold text-slate-900 leading-tight">{docData.subject}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest mb-1">Professor</p>
                      <p className="text-sm text-slate-500 font-medium">{docData.professor}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-4">
                    <div>
                      <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest mb-1">Presented By</p>
                      <p className="text-xl font-black text-slate-900">{docData.author}</p>
                      <p className="text-sm text-slate-500 font-semibold mt-1">{docData.semester}</p>
                      <div className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
                        {docData.date}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* CUERPO DEL INFORME */}
            <main className="p-14 relative min-h-[11in] bg-white">

              {/* Cabecera Rápida */}
              {coverType === 'rapid' && (
                <div className="mb-16 border-b-2 border-slate-100 pb-10 relative">
                  <div className="absolute -top-20 -left-20 -right-20 h-48 main-gradient geometric-mask opacity-10" />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="max-w-[70%]">
                      <h2 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">{docData.subject}</h2>
                      <h1 className="text-4xl font-black text-slate-900 uppercase leading-none">{docData.title}</h1>
                      <p className="text-sm text-slate-400 font-medium mt-2 italic">{docData.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-900 uppercase">{docData.author}</p>
                      <p className="text-[10px] font-bold text-indigo-500">{docData.date}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECCIONES DINÁMICAS */}
              <div className="space-y-16">
                {docData.sections.map((section) => (
                  <div key={section.id} className="relative group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                      <h3 className="text-xl font-black uppercase tracking-widest text-slate-800">{section.title}</h3>
                      <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>

                    {section.type === 'text' && (
                      <p className="text-sm text-slate-600 leading-relaxed text-justify whitespace-pre-wrap pl-6 border-l-2 border-indigo-50">
                        {section.content}
                      </p>
                    )}

                    {section.type === 'table' && (
                      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm ml-6">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              {section.headers.map((h, i) => (
                                <th key={i} className="p-4 text-[10px] font-black uppercase text-indigo-700 tracking-tight">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.rows.map((row, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-indigo-50/10 transition-colors">
                                {row.map((cell, j) => (
                                  <td key={j} className={`p-4 text-[11px] leading-snug ${j === 0 ? 'font-bold text-slate-800 bg-slate-50/50' : 'text-slate-600'}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {section.type === 'list' && (
                      <div className="grid grid-cols-1 gap-3 pl-8">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'image' && (
                      <div className="ml-6 space-y-4">
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                          <img src={section.url || 'https://via.placeholder.com/800x400?text=Importar+URL+Imagen'} className="w-full object-cover max-h-[350px]" alt="preview" />
                        </div>
                        <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] italic text-slate-400 font-medium">Fig. {Math.floor(Math.random() * 10)}: {section.caption}</span>
                          <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{section.ref}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer Institucional */}
              <div className="absolute bottom-10 left-20 right-20 flex flex-col items-center gap-4 border-t border-slate-100 pt-8 mt-20">
                <div className="flex items-center gap-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
                  <span>{docData.author}</span>
                  <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full" />
                  <span>ISC 2026</span>
                </div>
                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em] text-center">
                  Generated by EduDraft Pro AI Engine
                </p>
              </div>

            </main>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
