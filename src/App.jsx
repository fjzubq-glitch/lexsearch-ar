import React, { useState, useEffect, useRef } from 'react';
import GeminiRestService from './services/GeminiRestService';
import VoiceTutor from './components/VoiceTutor';
import DataIngestor from './logic/infra/data_ingestor';

/**
 * LexSearch Platinum - Azure Gold Protocol
 * Arquitectura de Interfaz Dashboard & Bóveda Académica.
 * Diseño Stitch Loop de Alta Fidelidad.
 */
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leyes, setLeyes] = useState([]);
  const [filteredLeyes, setFilteredLeyes] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('/master_leyes_index.json')
      .then(response => response.json())
      .then(data => {
        setLeyes(data.leyes || []);
        setFilteredLeyes(data.leyes || []);
      });

    fetch('/data/transcriptions_index.json')
      .then(res => res.json())
      .then(data => setTranscriptions(data || []));
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setFilteredLeyes(leyes);
        setExternalResults([]);
        return;
      }
      setIsSearching(true);
      
      const localResults = leyes.filter(ley => 
        ley.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ley.numero.includes(searchQuery) ||
        ley.materia.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeyes(localResults);

      try {
        const results = await DataIngestor.consultExternalRepositories(searchQuery);
        setExternalResults(results);
      } catch (err) {
        console.error("Error en minería:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, leyes]);

  const handlePlayAudio = (url, title) => {
    setCurrentAudio({ url, title });
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  return (
    <div className={`min-h-screen bg-[#F0F7FF] text-[#050505] transition-all duration-700 ${isVoiceActive ? 'pr-[400px]' : 'pr-0'}`}>
      
      {/* Premium Header */}
      <nav className="fixed top-0 left-0 w-full z-[100] h-24 glass-platinum px-10 flex justify-between items-center border-b-[0.5px] border-[#050505]/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#050505] flex items-center justify-center text-[#F0F7FF] font-serif italic text-xl">L</div>
          <h1 className="text-2xl font-serif font-black tracking-tighter">LexSearch <span className="text-[#2563EB]">Gold</span></h1>
        </div>
        
        <div className="flex items-center gap-8">
          <button onClick={() => setIsVoiceActive(!isVoiceActive)} className={`px-8 py-3 text-[10px] font-sans uppercase tracking-[0.4em] border-[0.5px] transition-all ${isVoiceActive ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'border-[#050505] text-[#050505] hover:bg-[#050505] hover:text-[#F0F7FF]'}`}>
            {isVoiceActive ? 'Cerrar Tutor' : 'Tutor de Voz'}
          </button>
          <div className="hidden md:flex flex-col items-end opacity-40">
            <span className="text-[7px] font-sans uppercase tracking-[0.3em]">Protocolo Sync Activo</span>
            <span className="text-[7px] font-sans uppercase tracking-[0.3em] font-bold">Netbook de Franklin</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-10 max-w-[1400px] mx-auto">
        
        {/* Search Hero */}
        <section className="py-20 text-center">
          <h2 className="font-serif italic text-7xl md:text-8xl tracking-tight leading-none mb-10">
            Inteligencia <span className="text-[#2563EB]">Soberana.</span>
          </h2>
          <div className="max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué ley o clase desea consultar?"
              className="w-full bg-transparent border-b-[0.5px] border-[#050505]/20 py-6 text-3xl font-serif italic text-center outline-none focus:border-[#2563EB] transition-all duration-700 placeholder:opacity-20"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#2563EB] transition-all duration-1000 group-focus-within:w-full" />
          </div>
        </section>

        {/* Dashboard: Bóveda Académica */}
        {!searchQuery && (
          <section className="mt-20 animate-in fade-in duration-1000">
            <div className="flex justify-between items-end mb-12 border-b-[0.5px] border-[#050505]/10 pb-6">
              <div>
                <span className="text-[9px] font-sans uppercase tracking-[0.5em] text-[#2563EB] font-bold">Bóveda Académica</span>
                <h3 className="font-serif italic text-4xl mt-2 text-[#050505]">Administrativo & Contratos</h3>
              </div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] opacity-30">10 Clases Magistrales Inyectadas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {transcriptions.map((clase) => (
                <div key={clase.id} className="group glass-platinum p-8 flex flex-col justify-between min-h-[300px] border-[0.5px] border-transparent hover:border-[#2563EB]/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.05)]">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] font-sans uppercase tracking-[0.3em] px-2 py-1 bg-[#2563EB] text-white">{clase.materia}</span>
                      <span className="text-[8px] font-sans text-[#050505]/40">{clase.fecha}</span>
                    </div>
                    <h4 className="font-serif italic text-xl leading-tight group-hover:text-[#2563EB] transition-colors">{clase.titulo}</h4>
                    <div className="flex flex-wrap gap-2 pt-2">
                       {clase.topics.slice(0, 3).map(t => (
                         <span key={t} className="text-[6px] font-sans uppercase tracking-widest text-[#050505]/30">#{t}</span>
                       ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePlayAudio(`/${clase.path.replace(/^public\//, '')}`, clase.titulo)}
                    className="w-full mt-8 py-4 border-[0.5px] border-[#050505]/10 text-[8px] font-sans uppercase tracking-[0.4em] group-hover:bg-[#050505] group-hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[12px]">mic</span>
                    Escuchar Cátedra
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Results Search */}
        {searchQuery && (
          <section className="mt-20 animate-in slide-in-from-bottom-10 duration-700">
             <div className="flex gap-10 mb-16 opacity-40 text-[9px] font-sans uppercase tracking-[0.5em] border-b-[0.5px] border-[#050505]/10 pb-6">
                <span>Encontrados: {filteredLeyes.length} Locales</span>
                <span className="text-[#2563EB]">{externalResults.length} Sovereign Extractions</span>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {externalResults.map(res => (
                  <div key={res.id} className="p-10 border-[0.5px] border-[#050505]/5 bg-white group hover:border-[#2563EB]/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[8px] font-sans uppercase tracking-[0.4em] py-1 border-b-[0.5px] border-[#2563EB] text-[#2563EB] italic font-black">{res.fuente}</span>
                       <span className="material-symbols-outlined text-lg opacity-20">{res.type === 'podcast' ? 'headphones' : 'article'}</span>
                    </div>
                    <h4 className="font-serif text-3xl mb-4 italic">{res.titulo}</h4>
                    <p className="font-sans text-xs opacity-60 leading-relaxed mb-8">{res.snippet}</p>
                    <a href={res.url} target="_blank" className="inline-block py-4 px-8 border-[0.5px] border-[#050505] text-[8px] font-sans uppercase tracking-[0.5em] hover:bg-[#050505] hover:text-white transition-all">Consultar Documento</a>
                  </div>
                ))}
             </div>
          </section>
        )}
      </main>

      <VoiceTutor isVisible={isVoiceActive} onClose={() => setIsVoiceActive(false)} leyesIndex={{ leyes }} externalContext={externalResults} />

      {/* Audio Player Azure Stitch */}
      {currentAudio && (
        <div className="fixed bottom-0 left-0 w-full z-[200] glass-platinum border-t-[0.5px] border-[#050505] p-8 animate-in slide-in-from-bottom-10 duration-1000">
           <div className="max-w-[1400px] mx-auto flex items-center justify-between">
              <div className="flex flex-col gap-1" style={{ maxWidth: '400px' }}>
                 <span className="text-[8px] font-sans uppercase tracking-[0.5em] text-[#2563EB] font-bold">Stitch Audio Engine Active</span>
                 <h5 className="font-serif italic text-2xl leading-none truncate">{currentAudio.title}</h5>
              </div>
              <div className="flex items-center gap-10">
                <audio ref={audioRef} controls className="audio-gold-filter">
                  <source src={currentAudio.url} type="audio/mpeg" />
                </audio>
                <button onClick={() => setCurrentAudio(null)} className="p-2 hover:rotate-90 transition-transform duration-500">
                   <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>
           </div>
           <style>{`.audio-gold-filter { filter: grayscale(1); height: 40px; opacity: 0.6; }`}</style>
        </div>
      )}

      <footer className="py-20 text-center opacity-20 mt-20 border-t-[0.5px] border-[#050505]/10">
         <p className="text-[8px] font-sans uppercase tracking-[1.5em]">LexSearch Gold Platinum / Franklin Netbook Edition</p>
      </footer>
    </div>
  );
};

export default App;
