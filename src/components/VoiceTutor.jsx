import React, { useState, useEffect, useRef } from 'react';
import GeminiRestService from '../services/GeminiRestService';
import apiRotator from '../services/apiRotator';
import PodcastsRegistry from '../data/podcasts_registry.json';

/**
 * VoiceTutor Lateral - LexSearch Gold Protocol
 * Integración Lateral con Visualizador de Rotación de APIs.
 */
const VoiceTutor = ({ isVisible, onClose, leyesIndex, externalContext }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Listo');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [activeApiIndex, setActiveApiIndex] = useState(apiRotator.getCurrentIndex());
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (isVisible) setStatus('Listo para la Cátedra');
    else stopAll();
  }, [isVisible]);

  // Actualizar el índice de la API visualmente
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveApiIndex(apiRotator.getCurrentIndex());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    setStatus('Consultando Archivo Soberano...');
    setActiveApiIndex(apiRotator.getCurrentIndex()); // Update visual on call
    
    const masterContext = {
      indicesLocales: leyesIndex,
      mineriaSoberana: externalContext || [],
      clasesGrabadas: PodcastsRegistry.podcasts || [],
      transcripcionesInyectadas: externalContext?.filter(c => c.type === 'transcription') || []
    };

    const systemPrompt = `Actúa como un Profesor Adjunto de la UBA, experto en Derecho Argentino.
    Explica conceptos jurídicos usando el método del "Holding".
    CONTEXTO: ${JSON.stringify(masterContext)}.
    
    REGLA:
    1. Cita 'transcripcionesInyectadas' como lo literal de clase.
    2. Usa 'clasesGrabadas' para invitar a escuchar audios.
    Estética Gold: Académico, elegante y breve.`;

    try {
      const response = await GeminiRestService.sendMessage(query, systemPrompt);
      setAiResponse(response);
      setStatus('Explicando...');
      
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'es-AR';
      utterance.rate = 0.95;
      
      utterance.onend = () => setStatus('Listo');
      synthesisRef.current.speak(utterance);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error en Pool');
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
    <div className={`fixed top-0 right-0 h-full z-[150] w-[400px] bg-white border-l-[0.5px] border-[#050505] flex flex-col p-10 transform transition-transform duration-700 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full shadow-2xl'}`}>
      
      {/* Header Sidebar */}
      <div className="flex justify-between items-start border-b-[0.5px] border-[#050505]/10 pb-10">
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-sans uppercase tracking-[0.5em] text-[#2563EB] font-black">VoiceTutor Platinum</span>
          <h4 className="font-serif italic text-3xl text-[#050505]">Tutoría en Vivo</h4>
        </div>
        <button onClick={onClose} className="hover:rotate-90 transition-transform duration-500">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      {/* API Pool Visualization */}
      <div className="mt-8 mb-4">
        <span className="text-[7px] font-sans uppercase tracking-[0.5em] text-[#050505]/40 block mb-4">Google AI Rotator Pool</span>
        <div className="flex justify-between items-center bg-[#F0F7FF] p-4 border-[0.5px] border-[#2563EB]/10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full border-[0.5px] border-[#050505]/20 ${activeApiIndex === i ? 'bg-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-white'}`} />
              <span className={`text-[6px] font-sans font-bold ${activeApiIndex === i ? 'text-[#2563EB]' : 'text-[#050505]/20'}`}>API {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto mt-6 flex flex-col gap-8 scrollbar-hide pr-2">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-[#2563EB] animate-ping' : 'bg-[#050505]/20'}`} />
            <span className="text-[8px] font-sans uppercase tracking-[0.4em] font-bold">{status}</span>
          </div>

          {transcript && (
            <div className="bg-[#F0F7FF] p-6 border-[0.5px] border-[#2563EB]/10">
              <p className="font-serif text-sm italic leading-relaxed text-[#050505]/70">"{transcript}"</p>
            </div>
          )}

          {aiResponse && (
            <div className="bg-white p-8 border-[0.5px] border-[#050505]/10 shadow-[20px_20px_40px_rgba(0,0,0,0.02)]">
              <p className="font-serif text-[15px] leading-relaxed text-[#050505]">{aiResponse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Action */}
      <div className="mt-auto pt-10">
        <button onClick={toggleListening} className={`w-full py-6 border-[0.5px] border-[#050505] text-[10px] font-sans uppercase tracking-[0.6em] transition-all duration-700 ${isListening ? 'bg-[#050505] text-[#F0F7FF]' : 'bg-transparent text-[#050505] hover:bg-[#050505] hover:text-[#F0F7FF]'}`}>
          {isListening ? 'Escuchando Voz' : 'Iniciar Tutoría'}
        </button>
      </div>
    </div>
  );
};

export default VoiceTutor;
