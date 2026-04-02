import React, { useState, useEffect, useRef } from 'react';
import GeminiRestService from './services/GeminiRestService';
import VoiceTutor from './components/VoiceTutor';
import DataIngestor from './logic/infra/data_ingestor';

/**
 * LexSearch Platinum - Azure Gold Protocol
 * Arquitectura de Interfaz Bento Grid y Minería Soberana Activa.
 */
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leyes, setLeyes] = useState([]);
  const [filteredLeyes, setFilteredLeyes] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Carga inicial del índice local de leyes
    fetch('/master_leyes_index.json')
      .then(response => response.json())
      .then(data => {
        setLeyes(data.leyes || []);
        setFilteredLeyes(data.leyes || []);
      })
      .catch(error => console.error('Error cargando el índice:', error));
  }, []);

  // Orquestador de búsqueda híbrida (Local + Soberana)
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setFilteredLeyes(leyes);
        setExternalResults([]);
        return;
      }

      setIsSearching(true);
      
      // Búsqueda Local
      const localResults = leyes.filter(ley => 
        ley.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ley.numero.includes(searchQuery) ||
        ley.materia.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeyes(localResults);

      // Búsqueda Soberana (External)
      try {
        const results = await DataIngestor.consultExternalRepositories(searchQuery);
        setExternalResults(results);
      } catch (err) {
        console.error("Error en minería externa:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, leyes]);

  const toggleVoiceTutor = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#050505] font-sans selection:bg-blue-200">
      {/* TopNavBar Azure Platinum */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-6 md:px-12 h-20 bg-[#F0F7FF]/90 backdrop-blur-xl border-b-[0.5px] border-[#050505]/10 group">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#050505] flex items-center justify-center text-[#F0F7FF] font-serif text-lg italic">L</div>
             <a className="text-2xl font-serif font-black tracking-tighter text-[#050505]" href="#">LexSearch</a>
          </div>
          <div className="hidden lg:flex gap-10">
            {['Doctrina', 'Jurisprudencia', 'Minería Soberana'].map((item) => (
              <a 
                key={item}
                className="text-[#050505]/40 font-sans uppercase tracking-[0.3em] text-[8px] hover:text-[#2563EB] transition-all hover:tracking-[0.4em]" 
                href="#"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleVoiceTutor}
            className={`text-[9px] font-sans uppercase tracking-[0.4em] px-8 py-3 transition-all active:scale-95 border-[0.5px] relative overflow-hidden group/btn ${isVoiceActive ? 'bg-[#2563EB] text-[#F0F7FF] border-[#2563EB]' : 'bg-transparent text-[#050505] border-[#050505] hover:tracking-[0.5em]'}`}
          >
            <span className="relative z-10">{isVoiceActive ? 'Cerrar Tutor de Voz' : 'Tutor de Voz'}</span>
            {!isVoiceActive && <div className="absolute inset-0 bg-[#050505] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />}
          </button>
          <button className="bg-[#050505] text-[#F0F7FF] text-[9px] font-sans uppercase tracking-[0.4em] px-8 py-3 hover:opacity-80 transition-all border-[0.5px] border-[#050505]">Platinum Access</button>
        </div>
      </nav>

      <main className="pt-20">
        <VoiceTutor isVisible={isVoiceActive} onClose={() => setIsVoiceActive(false)} leyesIndex={{ leyes }} />

        {/* Search Hero Section */}
        <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-gradient-to-b from-white/50 to-transparent">
          <div className="relative z-10 w-full max-w-5xl text-center space-y-10 animate-in fade-in duration-1000">
            <h1 className="font-serif italic text-6xl md:text-8xl tracking-tighter text-[#050505] leading-tight">
               Consulta Jurídica <br /> <span className="text-[#2563EB]">Soberana.</span>
            </h1>
            
            <div className="w-full max-w-3xl mx-auto relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-20 bg-transparent border-b-[0.5px] border-[#050505]/20 focus:border-[#2563EB] outline-none text-3xl md:text-5xl font-serif italic placeholder:text-[#050505]/10 px-4 transition-all duration-700 text-center"
                placeholder="Busque por ley, número o tema..."
              />
              {isSearching && (
                 <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-[#2563EB] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* Bento Grid Results Section */}
        <section className="px-6 md:px-12 py-20 max-w-[1600px] mx-auto">
          {searchQuery && (
            <div className="flex justify-between items-end mb-16 border-b-[0.5px] border-[#050505]/10 pb-8">
              <div className="space-y-1">
                <h2 className="font-serif text-3xl italic">Hallazgos para "{searchQuery}"</h2>
                <div className="flex gap-4 items-center">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#050505]/40 font-bold">{filteredLeyes.length} Locales</span>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#2563EB] font-bold">{externalResults.length} Externos (Minería)</span>
                </div>
              </div>
            </div>
          )}

          {/* Combined Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[300px] gap-6">
            
            {/* Local Results First */}
            {filteredLeyes.map((ley, idx) => (
              <div 
                key={ley.numero} 
                className={`group p-8 border-[0.5px] border-[#050505]/10 hover:border-[#050505] transition-all duration-700 bg-white shadow-sm flex flex-col justify-between ${idx % 5 === 0 ? 'md:col-span-2 md:row-span-2 bg-[#F8FAFC]' : 'md:col-span-1'}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[8px] font-sans uppercase tracking-[0.5em] text-[#050505]/30">Ley {ley.numero}</span>
                    <span className="text-[7px] font-sans uppercase tracking-[0.3em] px-2 py-1 bg-[#050505] text-white">Local</span>
                  </div>
                  <h3 className={`font-serif text-[#050505] leading-tight group-hover:italic transition-all duration-500 ${idx % 5 === 0 ? 'text-4xl' : 'text-xl'}`}>
                    {ley.titulo}
                  </h3>
                </div>
                <div className="pt-8 border-t-[0.5px] border-[#050505]/5">
                   <p className="text-[10px] font-sans uppercase tracking-widest text-[#050505]/40 mb-4">{ley.materia}</p>
                   <a 
                    href={`http://servicios.infoleg.gob.ar/infolegInternet/anexos/${Math.floor(ley.id_infoleg/1000)}/${ley.id_infoleg}/norma.htm`}
                    target="_blank"
                    className="text-[8px] font-sans uppercase tracking-[0.6em] text-[#2563EB] font-bold flex items-center gap-3"
                   >
                     EXPEDIENTE <span className="material-symbols-outlined text-[10px]">arrow_outward</span>
                   </a>
                </div>
              </div>
            ))}

            {/* External/Mining Results - Asymmetric Bento Styling */}
            {externalResults.map((result, idx) => (
              <div 
                key={result.id} 
                className={`group p-8 border-[0.5px] border-[#2563EB]/20 hover:border-[#2563EB] transition-all duration-700 bg-[#F0F7FF] shadow-sm flex flex-col justify-between md:col-span-2 ${idx === 0 ? 'lg:col-span-3 lg:row-span-1' : 'lg:col-span-2'}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-sans uppercase tracking-[0.5em] text-[#2563EB] font-black italic">Minería Soberana Activa</span>
                    <span className="text-[7px] font-sans uppercase tracking-[0.3em] px-2 py-1 border-[0.5px] border-[#2563EB]/30 text-[#2563EB]">{result.fuente}</span>
                  </div>
                  <h3 className="font-serif italic text-2xl text-[#050505] leading-tight">{result.titulo}</h3>
                  <p className="font-sans text-[11px] leading-relaxed text-[#050505]/60 italic tracking-wide">
                    "{result.snippet}"
                  </p>
                </div>
                <div className="pt-6">
                  <a href={result.url} target="_blank" className="bg-[#050505] text-white py-3 px-6 text-[8px] font-sans uppercase tracking-[0.5em] inline-block hover:scale-105 transition-all">
                    Extraer Documento
                  </a>
                </div>
              </div>
            ))}
          </div>

          {!searchQuery && leyes.length > 0 && (
            <div className="mt-32 text-center space-y-4 opacity-30">
               <div className="h-px bg-[#050505] w-24 mx-auto" />
               <p className="text-[10px] font-sans uppercase tracking-[0.8em] italic">Protocolo de Búsqueda Platinum Elite</p>
            </div>
          )}
        </section>
      </main>

      {/* Luxury Footer Azure Gold */}
      <footer className="bg-white border-t-[0.5px] border-[#050505] mt-20 pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-8">
            <h5 className="text-3xl font-serif italic text-[#050505]">LexSearch Gold.</h5>
            <p className="text-[10px] font-sans uppercase tracking-[0.5em] text-[#050505]/40 leading-relaxed">
              Infraestructura Jurídica Global.<br />
              ADN Stitch v2.0 <br />
              Minería Soberana Integrada.
            </p>
          </div>
          <div className="flex gap-24">
             <div className="space-y-6">
               <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Protocolos</span>
               <ul className="text-[8px] font-sans uppercase tracking-[0.3em] space-y-4 text-[#050505]/60">
                 <li><a href="#" className="hover:text-[#2563EB]">Franklin (HernanCC)</a></li>
                 <li><a href="#" className="hover:text-[#2563EB]">Zero Noise</a></li>
                 <li><a href="#" className="hover:text-[#2563EB]">Azure Stitch</a></li>
               </ul>
             </div>
          </div>
        </div>
        <div className="mt-32 pt-8 border-t-[0.5px] border-[#050505]/5 flex justify-between items-center text-[7px] font-sans uppercase tracking-[0.6em] text-[#050505]/20">
          <span>© 2026 LexSearch - Todos los derechos reservados.</span>
          <span>Sincronizado Netbook / Franklin Engine</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
