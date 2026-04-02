import React, { useState, useEffect, useRef } from 'react';
import GeminiRestService from '../services/GeminiRestService';
import PodcastsRegistry from '../data/podcasts_registry.json';

/**
 * VoiceTutor - LexSearch Gold Protocol
 * Inteligencia de Cátedra con Streaming Sync.
 * Sincronización con Clases Magistrales (Cloudinary).
 */
const VoiceTutor = ({ isVisible, onClose, leyesIndex, externalContext }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Listo');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (isVisible) setStatus('Listo para la Cátedra');
    else stopAll();
  }, [isVisible]);

  const stopAll = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (synthesisRef.current) synthesisRef.current.cancel();
    setIsListening(false);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-AR';

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('Escuchando...');
      };

      recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        await processVoiceQuery(text);
      };

      recognition.onend = () => setIsListening(false);

      recognition.onerror = (event) => {
        setStatus(event.error === 'no-speech' ? 'No se detectó voz' : `Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else setStatus('Navegador incompatible');

    return () => stopAll();
  }, []);

  const processVoiceQuery = async (query) => {
    setStatus('Consultando Archivo Soberano y Clases...');
    
    const masterContext = {
      indicesLocales: leyesIndex,
      mineriaSoberana: externalContext || [],
      clasesGrabadas: PodcastsRegistry.podcasts || []
    };

    const systemPrompt = `Actúa como un Profesor Adjunto de la UBA, experto en Derecho Argentino.
    Tu misión es explicar conceptos jurídicos usando el método del "Holding".
    CONTEXTO MAESTRO DISPONIBLE: ${JSON.stringify(masterContext)}.
    
    REGLA DE STREAMING:
    Si el usuario pregunta sobre un tema tratado en una clase grabada (clasesGrabadas), DEBES citar la fecha e invitarlo a escuchar el audio. 
    Ejemplo: "Ese tema se trató en la clase de 'Decretos' del 16/03/2026. Aquí tenés el audio en la sección de resultados."
    
    Mantén un tono académico, elegante y preciso. Máximo 3 párrafos. No menciones ser una IA.`;

    try {
      const response = await GeminiRestService.sendMessage(query, systemPrompt);
      setAiResponse(response);
      setStatus('Explicando...');
      
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'es-AR';
      utterance.rate = 0.92;
      
      utterance.onend = () => setStatus('Listo');
      synthesisRef.current.speak(utterance);
    } catch (error) {
      console.error('Error en processVoiceQuery:', error);
      setStatus('Error en la Consulta');
    }
  };

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else {
      setTranscript('');
      setAiResponse('');
      synthesisRef.current.cancel();
      try { recognitionRef.current?.start(); } catch (e) {}
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[100] w-96 bg-white/95 backdrop-blur-3xl border-[0.5px] border-[#050505] flex flex-col p-8 gap-6 animate-in slide-in-from-bottom-10 duration-700 shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#2563EB]" />

      {/* Header */}
      <div className="flex justify-between items-start border-b-[0.5px] border-[#050505]/10 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-sans uppercase tracking-[0.5em] text-[#2563EB] font-black flex items-center gap-2">
            <span className={`w-1.5 h-1.5 bg-[#2563EB] rounded-full ${isListening ? 'animate-ping' : ''}`} />
            Streaming Room Active
          </span>
          <h4 className="font-serif italic text-2xl text-[#050505]">Tutor de Voz</h4>
          <span className="text-[7px] font-sans uppercase tracking-[0.2em] text-[#050505]/40 italic">UBA Adjunto - Master Context Sync</span>
        </div>
        <button onClick={onClose} className="hover:rotate-90 transition-transform duration-500">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Visualizer */}
      <div className="flex justify-center items-center h-24 bg-[#F0F7FF]/50 border-[0.5px] border-[#050505]/5 relative overflow-hidden">
        {isListening ? (
          <div className="flex gap-[4px] items-center">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-[2px] bg-[#2563EB] animate-pulse" style={{ height: `${20 + Math.random() * 60}%`, animationDuration: `${0.4 + i * 0.05}s` }} />
            ))}
          </div>
        ) : (
          <div className="text-[7px] font-sans uppercase tracking-[0.8em] opacity-30 text-center">Protocolo de Cátedra Activo</div>
        )}
      </div>

      {/* Feed */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[300px] scrollbar-hide pr-2">
        <div className="space-y-1">
          <span className="text-[7px] font-sans uppercase tracking-[0.3em] text-[#050505]/30">Estatus</span>
          <p className="text-[9px] font-sans uppercase tracking-[0.2em] font-bold text-[#2563EB]">{status}</p>
        </div>

        {transcript && (
          <div className="bg-[#F0F7FF] p-5 border-[0.5px] border-[#050505]/10 animate-in fade-in slide-in-from-left-4">
            <p className="font-serif text-[13px] italic leading-relaxed">"{transcript}"</p>
          </div>
        )}

        {aiResponse && (
          <div className="bg-white p-6 border-[0.5px] border-[#2563EB]/20 shadow-[8px_8px_0px_rgba(37,99,235,0.03)] animate-in fade-in slide-in-from-bottom-4">
            <p className="font-serif text-[13px] leading-relaxed text-[#050505]">{aiResponse}</p>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-auto pt-4 flex flex-col gap-4">
        <button onClick={toggleListening} className={`w-full py-5 border-[0.5px] border-[#050505] text-[9px] font-sans uppercase tracking-[0.5em] transition-all duration-500 group ${isListening ? 'bg-[#050505] text-white' : 'bg-transparent text-[#050505] hover:bg-[#050505] hover:text-white'}`}>
          <span className="relative z-10">{isListening ? 'Detectando...' : 'Preguntar a la Cátedra'}</span>
        </button>
        <div className="flex justify-between items-center opacity-30 text-[6px] font-sans uppercase tracking-[1em]">
          <span>LexSearch Gold v2.0</span>
          <span>Cloudinary Sync</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceTutor;
