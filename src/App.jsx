import React, { useState, useEffect, useRef } from 'react';
import GeminiLiveService from './services/GeminiLiveService';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leyes, setLeyes] = useState([]);
  const [filteredLeyes, setFilteredLeyes] = useState([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Inactivo');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Carga inicial del índice de leyes
    fetch('/master_leyes_index.json')
      .then(response => response.json())
      .then(data => {
        setLeyes(data.leyes || []);
        setFilteredLeyes(data.leyes || []);
      })
      .catch(error => console.error('Error cargando el índice:', error));

    // Configurar reconocimiento de voz (Web Speech API para captura simple)
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-AR';

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('User said:', transcript);
        await handleVoiceQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    const results = leyes.filter(ley => 
      ley.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ley.numero.includes(searchQuery) ||
      ley.materia.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLeyes(results);
  }, [searchQuery, leyes]);

  const toggleVoiceTutor = async () => {
    if (!isVoiceActive) {
      setVoiceStatus('Conectando...');
      const connected = await GeminiLiveService.connect(
        (msg) => console.log('Live Msg:', msg),
        (err) => setVoiceStatus(`Error: ${err}`)
      );
      if (connected) {
        setIsVoiceActive(true);
        setVoiceStatus('Tutor de Voz Activo');
      }
    } else {
      GeminiLiveService.disconnect();
      setIsVoiceActive(false);
      setVoiceStatus('Inactivo');
      setVoiceResponse('');
    }
  };

  const handleVoiceQuery = async (query) => {
    setVoiceStatus('Pensando...');
    const systemPrompt = `Actúa como un tutor jurídico experto en derecho argentino bajo el protocolo LexSearch Gold. 
    Tu objetivo es explicar las leyes de forma clara y académica. 
    Aquí tienes el índice de leyes disponibles: ${JSON.stringify(leyes)}. 
    Responde de forma concisa y premium.`;

    const response = await GeminiLiveService.sendMessage(query, systemPrompt);
    setVoiceResponse(response);
    setVoiceStatus('Tutor de Voz Activo');
    
    // Sintetizar voz (Web Speech API)
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = 'es-AR';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#050505] font-sans selection:bg-blue-200">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-[#F0F7FF]/80 backdrop-blur-md border-b-[0.5px] border-[#050505]/10">
        <div className="flex items-center gap-8 md:gap-12">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LexSearch Logo" className="h-8 w-auto grayscale" />
            <a className="text-2xl font-serif font-bold tracking-tighter text-[#050505]" href="#">LexSearch</a>
          </div>
          <div className="hidden md:flex gap-8">
            <a className="text-[#050505]/60 font-sans uppercase tracking-widest text-[10px] hover:text-[#050505] transition-colors duration-300" href="#">Mis Clases</a>
            <a className="text-[#050505]/60 font-sans uppercase tracking-widest text-[10px] hover:text-[#050505] transition-colors duration-300" href="#">Podcast</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleVoiceTutor}
            className={`text-[10px] font-sans uppercase tracking-widest px-6 py-2.5 transition-all active:scale-95 border-[0.5px] ${isVoiceActive ? 'bg-blue-600 text-[#F0F7FF] border-blue-600' : 'bg-transparent text-[#050505] border-[#050505]'}`}
          >
            {isVoiceActive ? 'Cerrar Tutor' : 'Activar Tutor'}
          </button>
          <button className="bg-[#050505] text-[#F0F7FF] text-[10px] font-sans uppercase tracking-widest px-6 py-2.5 hover:bg-[#333] transition-all active:scale-95">Admin</button>
        </div>
      </nav>

      <main className="pt-20">
        {/* Voice Tutor Interface */}
        {isVoiceActive && (
          <div className="fixed bottom-10 right-10 z-[100] w-80 bg-white/90 backdrop-blur-xl border-[0.5px] border-[#050505] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b-[0.5px] border-[#050505]/10 pb-4">
              <span className="text-[10px] font-sans uppercase tracking-widest text-blue-600 font-bold">Gemini 2.0 Flash Live</span>
              <div className="flex gap-2">
                <div className={`w-2 h-2 rounded-full ${voiceStatus.includes('Error') ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#050505]/40">{voiceStatus}</p>
              {voiceResponse && (
                <div className="bg-[#F0F7FF] p-4 border-[0.5px] border-[#050505]/5">
                  <p className="font-serif italic text-sm leading-relaxed text-[#050505]">{voiceResponse}</p>
                </div>
              )}
            </div>

            <button 
              onClick={startListening}
              disabled={isListening}
              className={`w-full py-4 border-[0.5px] border-[#050505] text-[10px] font-sans uppercase tracking-[0.3em] transition-all ${isListening ? 'bg-blue-600 text-white animate-pulse' : 'bg-white text-[#050505] hover:bg-[#050505] hover:text-white'}`}
            >
              {isListening ? 'Escuchando...' : 'Hablar con Tutor'}
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
            <h1 className="font-serif italic text-5xl md:text-7xl tracking-tighter text-[#050505] leading-tight">
              ¿Qué duda jurídica <br /> <span className="text-blue-600">resolvemos hoy?</span>
            </h1>
            
            <div className="w-full max-w-2xl mx-auto">
              <div className="relative group">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-transparent border-b-2 border-[#050505]/20 focus:border-[#050505] outline-none text-2xl md:text-3xl font-serif italic placeholder:text-[#050505]/20 px-2 transition-all"
                  placeholder="Ej: Ley de Procedimientos Administrativos..."
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#050505] p-2">
                  <span className="material-symbols-outlined text-4xl">search</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] font-sans uppercase tracking-[0.2em] text-[#050505]/50">
                <span>ADN Stitch Active</span>
                <span className="text-[#050505]">|</span>
                <span>Zero Noise Architecture</span>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
          {searchQuery && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl italic">Resultados para "{searchQuery}"</h2>
              <p className="text-xs uppercase tracking-widest text-[#050505]/40">{filteredLeyes.length} leyes encontradas</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLeyes.map((ley) => (
              <div key={ley.numero} className="group p-8 border-[0.5px] border-[#050505]/10 hover:border-[#050505] transition-all bg-white/50 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-sans uppercase tracking-widest px-2 py-1 bg-[#050505] text-[#F0F7FF]">{ley.materia}</span>
                  <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#050505]/30">Ley {ley.numero}</span>
                </div>
                <h3 className="font-serif text-xl mb-4 group-hover:italic transition-all">{ley.titulo}</h3>
                <div className="pt-6 border-t-[0.5px] border-[#050505]/5 flex justify-between items-center">
                  <a 
                    href={`http://servicios.infoleg.gob.ar/infolegInternet/anexos/${Math.floor(ley.id_infoleg/1000)}/${ley.id_infoleg}/norma.htm`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-sans uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                  >
                    Ver en InfoLeg <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {!searchQuery && leyes.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#050505]/30 italic">Explora la base de datos de ADN Stitch</p>
            </div>
          )}
        </section>

        {/* Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 mt-24 border-t-[0.5px] border-[#050505]/10">
          <div className="p-12 md:p-24 space-y-8 bg-white/30">
            <h4 className="font-sans uppercase text-xs tracking-[0.4em] text-blue-600">Zero Noise</h4>
            <h2 className="font-serif text-4xl md:text-5xl italic tracking-tighter leading-tight text-[#050505]">
              Arquitectura de <br /> Máxima Pureza.
            </h2>
            <p className="max-w-md text-[#050505]/60 leading-relaxed font-sans text-sm">
              Implementación limpia desde el núcleo Stitch. Diseñado para rendimiento crítico en entornos de despacho y educación legal.
            </p>
          </div>
          <div className="relative bg-[#050505] flex items-center justify-center p-12 text-center">
             <div className="space-y-4">
                <span className="material-symbols-outlined text-[#F0F7FF] text-6xl">verified</span>
                <h3 className="text-[#F0F7FF] font-serif italic text-2xl">Listo para Netbook</h3>
                <p className="text-[#F0F7FF]/40 text-[10px] font-sans uppercase tracking-widest">Sincronización ADN Stitch v2.0</p>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-area bg-[#F0F7FF] py-20 px-6 md:px-12 border-t-[0.5px] border-[#050505]/10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="space-y-6">
            <span className="text-2xl font-serif font-bold tracking-tighter text-[#050505]">LexSearch</span>
            <p className="text-xs text-[#050505]/40 max-w-xs leading-loose font-sans uppercase tracking-widest">
              PROTOCOLO DE RECONSTRUCCIÓN VIRGEN.<br />
              Zero Noise Architecture.<br />
              LexSearch Platinum Elite.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            <div className="space-y-4">
              <h5 className="font-sans uppercase text-[10px] tracking-[0.2em] text-[#050505]">Recursos</h5>
              <ul className="text-[10px] font-sans uppercase tracking-widest text-[#050505]/60 space-y-3">
                <li><a className="hover:text-blue-600 transition-colors" href="#">Leyes</a></li>
                <li><a className="hover:text-blue-600 transition-colors" href="#">Jurisprudencia</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t-[0.5px] border-[#050505]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-sans uppercase tracking-[0.3em] text-[#050505]/30">
          <span>© 2026 LexSearch Gold. ADN Stitch.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
