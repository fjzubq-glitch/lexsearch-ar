import React, { useState, useEffect, useRef } from 'react';
import GeminiRestService from '../services/GeminiRestService';

/**
 * VoiceTutor - LexSearch Gold Protocol
 * Implementación robusta con Web Speech API nativa.
 * Estética Azure Gold: Bordes 0.5px, Square Geometry, Zero Noise.
 */
const VoiceTutor = ({ isVisible, onClose, leyesIndex }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Listo');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (isVisible) {
      setStatus('Listo para la Cátedra');
    } else {
      stopAll();
    }
  }, [isVisible]);

  const stopAll = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (synthesisRef.current) synthesisRef.current.cancel();
    setIsListening(false);
  };

  useEffect(() => {
    // Inicialización de Speech Recognition (Asegurando compatibilidad Chrome/Edge)
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

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setStatus(`Error: ${event.error}`);
        } else {
          setStatus('No se detectó voz');
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setStatus('Navegador incompatible');
    }

    return () => stopAll();
  }, []);

  const processVoiceQuery = async (query) => {
    setStatus('Procesando Fallos...');
    
    // System Prompt: Profesor Adjunto UBA - Metodología Holding
    const systemPrompt = `Actúa como un Profesor Adjunto de la UBA, experto en Derecho Argentino. 
    Tu tono es académico, preciso y elegante. 
    REGLA DE ORO: Utiliza el método del "Holding" para explicar conceptos jurídicos basándote en: ${JSON.stringify(leyesIndex)}.
    Responde de forma concisa (máximo 3 párrafos cortos). No menciones que eres una IA.`;

    try {
      const response = await GeminiRestService.sendMessage(query, systemPrompt);
      setAiResponse(response);
      setStatus('Explicando...');
      
      // Síntesis de Voz Nativa
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'es-AR';
      utterance.rate = 0.92; // Velocidad académica
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setStatus('Listo');
      };

      synthesisRef.current.speak(utterance);
    } catch (error) {
      console.error('Error en processVoiceQuery:', error);
      setStatus('Error en la Consulta');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setAiResponse('');
      synthesisRef.current.cancel();
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Error al iniciar reconocimiento:", e);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[100] w-96 bg-white/95 backdrop-blur-3xl border-[0.5px] border-[#050505] flex flex-col p-8 gap-6 animate-in slide-in-from-bottom-10 duration-700 shadow-2xl">
      {/* Brand Identity Line */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#2563EB]" />

      {/* Header Section */}
      <div className="flex justify-between items-start border-b-[0.5px] border-[#050505]/10 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-sans uppercase tracking-[0.5em] text-[#2563EB] font-black flex items-center gap-2">
            <span className={`w-1.5 h-1.5 bg-[#2563EB] rounded-full ${isListening ? 'animate-ping' : ''}`} />
            Voice Protocol active
          </span>
          <h4 className="font-serif italic text-2xl text-[#050505] tracking-tight">Tutor de Voz</h4>
          <span className="text-[7px] font-sans uppercase tracking-[0.2em] text-[#050505]/40 italic">Profesor Adjunto UBA - LexSearch</span>
        </div>
        <button 
          onClick={onClose}
          className="hover:rotate-90 transition-transform duration-500 p-1"
        >
          <span className="material-symbols-outlined text-[18px] text-[#050505]">close</span>
        </button>
      </div>

      {/* Audio Visualizer Placeholder */}
      <div className="flex justify-center items-center h-24 bg-[#F0F7FF]/50 border-[0.5px] border-[#050505]/5 relative overflow-hidden">
        {isListening ? (
          <div className="flex gap-[4px] items-center">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="w-[2px] bg-[#2563EB] animate-pulse"
                style={{ 
                  height: `${20 + Math.random() * 60}%`,
                  animationDuration: `${0.4 + i * 0.05}s`
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-[7px] font-sans uppercase tracking-[0.8em] opacity-30">Waiting for query</div>
        )}
      </div>

      {/* Interaction Feed */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[300px] scrollbar-hide pr-2">
        <div className="space-y-1">
          <span className="text-[7px] font-sans uppercase tracking-[0.3em] text-[#050505]/30">Estatus</span>
          <p className="text-[9px] font-sans uppercase tracking-[0.2em] font-bold text-[#050505]">{status}</p>
        </div>

        {transcript && (
          <div className="bg-[#F0F7FF] p-5 border-[0.5px] border-[#050505]/10 animate-in fade-in slide-in-from-left-4 duration-500">
            <span className="text-[7px] font-sans uppercase tracking-[0.4em] text-[#050505]/30 block mb-2">Consulta:</span>
            <p className="font-serif text-[13px] text-[#050505] italic leading-relaxed">"{transcript}"</p>
          </div>
        )}

        {aiResponse && (
          <div className="bg-white p-6 border-[0.5px] border-[#2563EB]/20 shadow-[8px_8px_0px_rgba(37,99,235,0.03)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-[7px] font-sans uppercase tracking-[0.4em] text-[#2563EB] block mb-3 font-bold">Cátedra:</span>
            <p className="font-serif text-[13px] leading-relaxed text-[#050505]">{aiResponse}</p>
          </div>
        )}
      </div>

      {/* Main Action Call */}
      <div className="mt-auto pt-4 flex flex-col gap-4">
        <button 
          onClick={toggleListening}
          className={`w-full py-5 border-[0.5px] border-[#050505] text-[9px] font-sans uppercase tracking-[0.5em] transition-all duration-500 relative overflow-hidden group ${isListening ? 'bg-[#050505] text-white' : 'bg-transparent text-[#050505] hover:bg-[#050505] hover:text-white'}`}
        >
          <span className="relative z-10">
            {isListening ? 'Escuchando...' : 'Iniciar Consulta'}
          </span>
          <div className="absolute left-0 top-0 h-full w-[1px] bg-[#2563EB]/30" />
        </button>

        <div className="flex justify-between items-center opacity-30 text-[6px] font-sans uppercase tracking-[1em]">
          <span>LexSearch Gold v2.0</span>
          <span>Web Speech API</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceTutor;
