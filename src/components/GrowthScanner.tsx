import { useState, useEffect, useRef } from 'react';
import { 
  Instagram, 
  Microscope, 
  Activity, 
  FlaskConical, 
  Dna, 
  Eye, 
  ClipboardList, 
  Download, 
  MessageCircle, 
  AlertCircle, 
  Beaker, 
  Maximize,
  CheckCircle2,
  XCircle,
  User,
  Layout,
  Megaphone,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import html2canvas from 'html2canvas';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface LabComponent {
  title: string;
  score: number;
  items: {
    text: string;
    status: 'success' | 'error';
  }[];
  type: string;
  icon: 'user' | 'layout' | 'megaphone';
}

interface LabResult {
  effectiveness: number;
  reaction: string;
  summary: string;
  components: LabComponent[];
  potentialText: string;
  profileName: string;
}

export default function GrowthScanner() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'results' | 'error'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<LabResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    "Inyectando reactivos...",
    "Analizando ADN de seguidores...",
    "Escaneando composición de Reels...",
    "Sintetizando diagnóstico AdsLab..."
  ];

  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const runLabTest = async () => {
    if (!username) return;
    
    setStatus('loading');
    setLoadingStep(0);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analiza el perfil de Instagram "${username}" como un experto de AdsLab Paraguay. 
        Genera un diagnóstico 100% personalizado y UNICO para este usuario. 
        No uses plantillas genéricas. Si el nombre sugiere un nicho (ej: fitness, comida, real estate), adapta el análisis a ese nicho en el contexto de Paraguay.
        
        El resultado debe ser un objeto JSON con:
        - effectiveness: un número de 0 a 100.
        - reaction: un texto corto (ej: "Regular", "Prometedor", "Crítico").
        - summary: un párrafo analítico que mencione el nombre @${username}.
        - potentialText: una frase motivadora sobre escalar con Ads.
        - profileName: el nombre de usuario con @.
        - components: un array de 3 objetos (Diagnóstico de Bio, Identidad Visual, Estrategia de Ads).
          Cada componente tiene:
          - title: nombre del componente.
          - score: puntuación de 0 a 100.
          - type: código (ej: COMP_BIO).
          - icon: uno de ["user", "layout", "megaphone"].
          - items: un array de 3-4 puntos de análisis, cada uno con "text" y "status" ('success' o 'error').`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              effectiveness: { type: Type.NUMBER },
              reaction: { type: Type.STRING },
              summary: { type: Type.STRING },
              potentialText: { type: Type.STRING },
              profileName: { type: Type.STRING },
              components: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    type: { type: Type.STRING },
                    icon: { type: Type.STRING, enum: ["user", "layout", "megaphone"] },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          status: { type: Type.STRING, enum: ["success", "error"] }
                        },
                        required: ["text", "status"]
                      }
                    }
                  },
                  required: ["title", "score", "type", "icon", "items"]
                }
              }
            },
            required: ["effectiveness", "reaction", "summary", "potentialText", "profileName", "components"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResults(data);
      
      setTimeout(() => {
        setStatus('results');
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Error en el laboratorio. Los reactivos han fallado.");
      setStatus('error');
    }
  };

  const downloadImage = async () => {
    if (resultsRef.current === null || isDownloading) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure animations are finished
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const canvas = await html2canvas(resultsRef.current, {
        useCORS: true,
        backgroundColor: '#000',
        scale: 3, // Ultra high quality
        logging: false,
        allowTaint: true,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `AdsLab-Scanner-${username || 'resultado'}.png`;
      link.href = dataUrl;
      link.target = '_blank'; // Some browsers need this in iframes
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Error al generar imagen:', err);
      setError("No se pudo generar la imagen. Intenta abrir la app en una pestaña nueva o toma un screenshot.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user': return <User className="w-5 h-5 text-adslab-cyan" />;
      case 'layout': return <Layout className="w-5 h-5 text-adslab-violet" />;
      case 'megaphone': return <Megaphone className="w-5 h-5 text-adslab-cyan" />;
      default: return <Dna className="w-5 h-5 text-adslab-cyan" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-adslab-cyan/30">
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'error' ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center pt-10 md:pt-20"
            >
              <div className="mb-12">
                <img 
                  src="https://drive.google.com/uc?export=view&id=1LI161PY0Wr8qlX3zPU3SzN4MTxricsua" 
                  alt="AdsLab Logo" 
                  className="h-16 md:h-24 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                <Beaker className="w-3.5 h-3.5 text-adslab-cyan" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Growth Scanner V1.0</span>
              </div>

              <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
                Escanea la Fórmula de tu <br />
                <span className="lab-text-gradient">Instagram</span>
              </h2>

              <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed px-4">
                Analizamos tu perfil, detectamos áreas de oportunidad y potenciamos tu escalabilidad digital.
              </p>

              <div className="relative group w-full max-w-2xl px-4">
                <div className="absolute -inset-1 bg-linear-to-r from-adslab-cyan/20 to-adslab-violet/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col md:flex-row items-center p-2 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.05)]">
                  <div className="flex-grow flex items-center px-4 w-full">
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="instagram.com/tuusuario" 
                      className="bg-transparent w-full py-4 outline-none text-white font-mono text-sm placeholder:text-slate-600"
                    />
                  </div>
                  <button 
                    onClick={runLabTest}
                    className="lab-gradient w-full md:w-auto px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98] cursor-pointer text-black"
                  >
                    <Maximize className="w-4 h-4" />
                    Iniciar Análisis
                  </button>
                </div>
              </div>
              
              {status === 'error' && (
                <div className="mt-6 flex items-center justify-center gap-2 text-red-400 font-mono text-sm">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              
              <div className="mt-24 opacity-20 pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500">AdsLab &copy; 2026 - Marketing Científico</p>
              </div>
            </motion.div>
          ) : status === 'loading' ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mb-10 relative">
                <div className="absolute inset-0 lab-gradient blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative glass-panel rounded-full w-full h-full flex items-center justify-center scan-anim">
                  <Activity className="w-10 h-10 md:w-12 md:h-12 text-adslab-cyan" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-mono px-4">
                {loadingSteps[loadingStep]}
              </h3>
              <p className="text-slate-500 text-sm">Procesando datos en los servidores de AdsLab...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div ref={resultsRef} className="w-full max-w-4xl bg-black p-4 md:p-8 rounded-3xl">
                {/* Header Results */}
                <div className="text-center mb-10">
                  <img 
                    src="https://drive.google.com/uc?export=view&id=1LI161PY0Wr8qlX3zPU3SzN4MTxricsua" 
                    alt="AdsLab Logo" 
                    className="h-10 w-auto mx-auto mb-6 object-contain"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-2">Resultados del Análisis</p>
                  <h3 className="text-3xl md:text-5xl font-bold">
                    Perfil: <span className="lab-text-gradient">{results?.profileName}</span>
                  </h3>
                </div>

                {/* Score Circle */}
                <div className="flex justify-center mb-12">
                  <div className="relative glass-panel p-8 rounded-3xl flex flex-col items-center w-64">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent"></circle>
                        <motion.circle 
                          cx="80" cy="80" r="70" 
                          stroke="url(#grad-res)" strokeWidth="10" fill="transparent" 
                          strokeDasharray="440" 
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (440 * (results?.effectiveness || 0)) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        ></motion.circle>
                        <defs>
                          <linearGradient id="grad-res" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#00d2ff' }} />
                            <stop offset="100%" style={{ stopColor: '#9d50bb' }} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold">{results?.effectiveness}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">/100</span>
                      </div>
                    </div>
                    <span className="mt-4 text-sm font-bold text-slate-300 uppercase tracking-widest">{results?.reaction}</span>
                  </div>
                </div>

                {/* Grid Components */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {results?.components.map((comp, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border-white/5">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            {getIcon(comp.icon)}
                          </div>
                          <h5 className="font-bold text-sm">{comp.title}</h5>
                        </div>
                        <span className="text-[10px] font-mono text-adslab-cyan">{comp.score}/100</span>
                      </div>
                      <div className="space-y-3">
                        {comp.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-start gap-2">
                            {item.status === 'success' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-adslab-cyan shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-500/50 shrink-0 mt-0.5" />
                            )}
                            <p className="text-[11px] text-slate-400 leading-tight">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Box */}
                <div className="glass-panel p-8 rounded-3xl border-white/5 mb-8">
                  <h5 className="text-adslab-cyan font-bold text-sm mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-adslab-cyan rounded-xs"></div> Resumen del Laboratorio
                  </h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {results?.summary}
                  </p>
                </div>

                {/* Potential CTA */}
                <div className="relative overflow-hidden p-8 md:p-12 rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-transparent text-center">
                  <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-adslab-cyan/5 to-adslab-violet/5 pointer-events-none"></div>
                  <h4 className="text-xl md:text-2xl font-bold mb-4 relative z-10">
                    Tu perfil tiene potencial para <span className="lab-text-gradient">escalar con Ads</span>
                  </h4>
                  <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto relative z-10">
                    Agenda una asesoría gratuita con nuestro equipo y descubrí la fórmula exacta para tu crecimiento.
                  </p>
                  <a 
                    href="https://api.whatsapp.com/send/?phone=595987145624&text=Hola%20AdsLab!%20Acabo%20de%20escanear%20mi%20perfil%20y%20quiero%20el%20ant%C3%ADdoto%20para%20crecer.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-adslab-cyan text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-tighter hover:brightness-110 transition-all relative z-10"
                  >
                    <MessageCircle className="w-4 h-4" /> Hablar con un Especialista
                  </a>
                </div>

                {/* Footer Results */}
                <div className="mt-12 text-center opacity-30">
                  <img 
                    src="https://drive.google.com/uc?export=view&id=1LI161PY0Wr8qlX3zPU3SzN4MTxricsua" 
                    alt="AdsLab Logo" 
                    className="h-6 w-auto mx-auto mb-4 object-contain grayscale"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <p className="text-[9px] uppercase tracking-[0.4em]">&copy; 2026 AdsLab • Marketing & Publicidad</p>
                </div>
              </div>

              {/* Action Buttons (Fixed or Bottom) */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-4xl px-4">
                <button 
                  onClick={downloadImage}
                  disabled={isDownloading}
                  className={`flex-grow flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-4 rounded-xl font-bold text-sm uppercase tracking-tighter transition-all cursor-pointer ${isDownloading ? 'opacity-50 cursor-wait' : 'hover:bg-white/10'}`}
                >
                  {isDownloading ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" /> Procesando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Descargar Imagen PNG
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-500 mt-2 text-center w-full">
                  Tip: Si la descarga no inicia, abre la app en una <a href={window.location.href} target="_blank" rel="noreferrer" className="text-adslab-cyan underline">pestaña nueva</a>.
                </p>
                <a 
                  href="https://api.whatsapp.com/send/?phone=595987145624&text=Hola%20AdsLab!%20Quiero%20agendar%20mi%20asesor%C3%ADa%20gratuita."
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow flex items-center justify-center gap-2 lab-gradient py-4 rounded-xl font-bold text-sm uppercase tracking-tighter text-black hover:brightness-110 transition-all"
                >
                  <Calendar className="w-4 h-4" /> Agendar Asesoría Gratuita
                </a>
              </div>

              <button 
                onClick={() => setStatus('idle')}
                className="mt-12 text-slate-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold cursor-pointer"
              >
                Analizar otra muestra
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
