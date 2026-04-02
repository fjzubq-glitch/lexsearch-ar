import React, { useState, useEffect, useRef } from 'react';
import GeminiRestService from './services/GeminiRestService';
import VoiceTutor from './components/VoiceTutor';
import DataIngestor from './logic/infra/data_ingestor';

/**
 * LexSearch Platinum - Azure Gold Protocol
 * Arquitectura de Interfaz Bento Grid y Bóveda Académica.
 */
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leyes, setLeyes] = useState([]);
  const [filteredLeyes, setFilteredLeyes] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estado para el Reproductor de Audio (Azure Stitch)
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('/master_leyes_index.json')
      .then(response => response.json())
      .then(data => {
        setLeyes(data.leyes || []);
        setFilteredLeyes(data.leyes || []);
      })
      .catch(error => console.error('Error cargando el índice:', error));
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
    <div className="min-h-screen bg-[#F0F7FF] text-[#050505] font-sans selection:bg-blue-200">
      {/* NavBar */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-6 md:px-12 h-20 bg-[#F0F7FF]/90 backdrop-blur-xl border-b-[0.5px] border-[#050505]/10 group">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#050505] flex items-center justify-center text-[#F0F7FF] font-serif text-lg italic">L</div>
             <a className="text-2xl font-serif font-black tracking-tighter text-[#050505]" href="#">LexSearch</a>
          </div>
          <div className="hidden lg:flex gap-10">
            {['Doctrina', 'Jurisprudencia', 'Minería Soberana'].map((item) => (
              <a key={item} className="text-[#050505]/40 font-sans uppercase tracking-[0.3em] text-[8px] hover:text-[#2563EB] transition-all" href="#">{item}</a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsVoiceActive(!isVoiceActive)} className={`text-[9px] font-sans uppercase tracking-[0.4em] px-8 py-3 transition-all border-[0.5px] ${isVoiceActive ? 'bg-[#2563EB] text-white' : 'bg-transparent text-[#050505] border-[#050505]'}`}>
            {isVoiceActive ? 'Cerrar Tutor' : 'Tutor de Voz'}
          </button>
          <button className="bg-[#050505] text-[#F0F7FF] text-[9px] font-sans uppercase tracking-[0.4em] px-8 py-3 border-[0.5px] border-[#050505]">Platinum Access</button>
        </div>
      </nav>

      <main className="pt-20">
        <VoiceTutor isVisible={isVoiceActive} onClose={() => setIsVoiceActive(false)} leyesIndex={{ leyes }} externalContext={externalResults} />

        {/* Hero */}
        <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-6 bg-gradient-to-b from-white/50 to-transparent">
          <h1 className="font-serif italic text-6xl md:text-8xl tracking-tighter text-[#050505] leading-tight text-center">
             Consulta Jurídica <br /> <span className="text-[#2563EB]">Soberana.</span>
          </h1>
          <div className="w-full max-w-3xl mx-auto mt-10 relative">
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-20 bg-transparent border-b-[0.5px] border-[#050505]/20 focus:border-[#2563EB] outline-none text-3xl md:text-5xl font-serif italic text-center transition-all duration-700" 
              placeholder="Busque leyes, podcasts o transcripciones..."
            />
          </div>
        </section>

        {/* Bento Results */}
        <section className="px-6 md:px-12 py-20 max-w-[1600px] mx-auto">
          {searchQuery && (
             <div className="flex gap-4 items-center mb-16 opacity-40">
                <span className="text-[9px] uppercase tracking-[0.4em]">{filteredLeyes.length} Locales</span>
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#2563EB]">{externalResults.length} Sovereign Data</span>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[300px] gap-6">
            {/* Local Results */}
            {filteredLeyes.map((ley, idx) => (
              <div key={ley.numero} className={`group p-8 border-[0.5px] border-[#050505]/10 bg-white flex flex-col justify-between ${idx % 5 === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'}`}>
                <div className="space-y-4">
                  <span className="text-[7px] font-sans uppercase tracking-[0.4em] text-[#050505]/30">Ley {ley.numero}</span>
                  <h3 className="font-serif text-2xl leading-tight group-hover:italic transition-all">{ley.titulo}</h3>
                </div>
                <div className="pt-6 border-t-[0.5px] border-[#050505]/5">
                  <p className="text-[9px] font-sans uppercase tracking-widest text-[#050505]/40 mb-3">{ley.materia}</p>
                </div>
              </div>
            ))}

            {/* External / Vault Results */}
            {externalResults.map((result, idx) => (
              <div key={result.id} className={`group p-8 border-[0.5px] border-[#2563EB]/20 bg-[#F0F7FF] flex flex-col justify-between md:col-span-2 ${result.type === 'podcast' ? 'lg:row-span-1 bg-white border-[#2563EB]' : ''}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-sans uppercase tracking-[0.4em] text-[#2563EB] font-black italic">{result.fuente}</span>
                    <span className="text-[7px] px-2 py-1 border-[0.5px] border-[#2563EB]/20">{result.type}</span>
                  </div>
                  <h3 className="font-serif italic text-2xl leading-tight">{result.titulo}</h3>
                  <p className="font-sans text-[11px] leading-relaxed opacity-60 italic">{result.snippet}</p>
                </div>
                <div className="pt-6 flex gap-4">
                   {result.type === 'podcast' ? (
                     <button onClick={() => handlePlayAudio(result.url, result.titulo)} className="bg-[#050505] text-white py-3 px-6 text-[8px] font-sans uppercase tracking-[0.4em] hover:scale-105 transition-all">Reproducir Clase</button>
                   ) : (
                     <a href={result.url} target="_blank" className="border-[0.5px] border-[#2563EB] text-[#2563EB] py-3 px-6 text-[8px] font-sans uppercase tracking-[0.4em] hover:bg-[#2563EB] hover:text-white transition-all">Extraer Tx</a>
                   )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Audio Player Azure Stitch */}
      {currentAudio && (
        <div className="fixed bottom-0 left-0 w-full z-[200] bg-white/80 backdrop-blur-3xl border-t-[0.5px] border-[#050505] animate-in slide-in-from-bottom-10 duration-700 p-6">
           <div className="max-w-[1600px] mx-auto flex items-center justify-between">
              <div className="flex flex-col gap-1">
                 <span className="text-[7px] font-sans uppercase tracking-[0.4em] text-[#2563EB] font-bold">Now Playing Protocol</span>
                 <h5 className="font-serif italic text-lg leading-none">{currentAudio.title}</h5>
              </div>
              <audio ref={audioRef} controls className="audio-platinum-filter">
                <source src={currentAudio.url} type="audio/mpeg" />
              </audio>
              <button onClick={() => setCurrentAudio(null)} className="p-2 hover:rotate-90 transition-transform">
                 <span className="material-symbols-outlined text-lg">close</span>
              </button>
           </div>
           <style>{`
             .audio-platinum-filter {
               filter: grayscale(1) invert(0);
               height: 32px;
               opacity: 0.8;
             }
           `}</style>
        </div>
      )}

      <footer className="bg-white border-t-[0.5px] border-[#050505] mt-20 pt-24 pb-12 px-6 md:px-12 text-center opacity-40">
        <p className="text-[7px] font-sans uppercase tracking-[1em]">Academic Vault Infrastructure active / Franklin Synchronized</p>
      </footer>
    </div>
  );
};

export default App;
