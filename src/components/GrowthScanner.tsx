import { useState, useEffect, useRef } from 'react';
import { 
  Instagram, 
  Microscope, 
  Activity, 
  FlaskConical, 
  Dna, 
  Eye, 
  ClipboardList, 
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
import { motion, AnimatePresence } from 'framer-motion';

import Logo from './Logo';

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
      // Simulate analysis time
      await new Promise(resolve => setTimeout(resolve, 6000));

      let extractedUsername = username.trim();
      // Handle full URLs if pasted
      if (extractedUsername.includes('instagram.com/')) {
        extractedUsername = extractedUsername.split('instagram.com/')[1].split('/')[0].split('?')[0];
      }
      
      const cleanUsername = extractedUsername.startsWith('@') ? extractedUsername : `@${extractedUsername}`;
      const score = Math.floor(Math.random() * 40) + 50; // 50-90
      
      const mockResult: LabResult = {
        effectiveness: score,
        reaction: score > 80 ? "Prometedor" : score > 65 ? "Regular" : "Crítico",
        summary: `El perfil ${cleanUsername} presenta una estructura con potencial, pero detectamos fugas de rendimiento en la conversión de audiencia. La fórmula actual requiere un ajuste en la frecuencia de impacto y optimización de creativos para maximizar el ROI en el mercado paraguayo.`,
        potentialText: "Tu perfil tiene la base necesaria para escalar con pauta publicitaria científica.",
        profileName: cleanUsername,
        components: [
          {
            title: "Diagnóstico de Bio",
            score: Math.floor(Math.random() * 30) + 60,
            type: "COMP_BIO",
            icon: "user",
            items: [
              { text: "Claridad en la propuesta de valor", status: Math.random() > 0.3 ? 'success' : 'error' },
              { text: "Optimización de Call to Action", status: Math.random() > 0.5 ? 'success' : 'error' },
              { text: "Uso de palabras clave estratégicas", status: Math.random() > 0.4 ? 'success' : 'error' }
            ]
          },
          {
            title: "Identidad Visual",
            score: Math.floor(Math.random() * 30) + 60,
            type: "COMP_VISUAL",
            icon: "layout",
            items: [
              { text: "Coherencia cromática en el feed", status: Math.random() > 0.3 ? 'success' : 'error' },
              { text: "Calidad técnica de Reels", status: Math.random() > 0.4 ? 'success' : 'error' },
              { text: "Jerarquía visual en portadas", status: Math.random() > 0.5 ? 'success' : 'error' }
            ]
          },
          {
            title: "Estrategia de Ads",
            score: Math.floor(Math.random() * 30) + 50,
            type: "COMP_ADS",
            icon: "megaphone",
            items: [
              { text: "Segmentación por intereses locales", status: Math.random() > 0.6 ? 'success' : 'error' },
              { text: "Estructura de embudo de ventas", status: Math.random() > 0.7 ? 'success' : 'error' },
              { text: "Píxel de seguimiento configurado", status: Math.random() > 0.8 ? 'success' : 'error' }
            ]
          }
        ]
      };

      setResults(mockResult);
      setStatus('results');

    } catch (err) {
      console.error(err);
      setError("Error en el laboratorio. Los reactivos han fallado.");
      setStatus('error');
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
                <Logo className="h-20" />
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
                <div className="absolute -inset-1 bg-linear-to-r from-adslab-cyan/30 to-adslab-violet/30 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex flex-col md:flex-row items-center p-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                  <div className="flex-grow flex items-center px-4 w-full">
                    <Instagram className="w-5 h-5 text-adslab-cyan/50 mr-3" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingresa tu @usuario o link de perfil" 
                      className="bg-transparent w-full py-4 outline-none text-white font-medium text-base placeholder:text-slate-600"
                    />
                  </div>
                  <button 
                    onClick={runLabTest}
                    className="lab-gradient w-full md:w-auto px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all active:scale-[0.97] cursor-pointer text-black group/btn whitespace-nowrap"
                  >
                    <span>Iniciar Análisis</span>
                    <Maximize className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
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
              <div className="w-full max-w-4xl bg-black p-4 md:p-8 rounded-3xl">
                {/* Header Results */}
                <div className="text-center mb-10 flex flex-col items-center">
                  <Logo className="h-12 mb-6" showText={false} />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-2">Resultados del Análisis</p>
                  <h3 className="text-3xl md:text-5xl font-bold">
                    Perfil: <span className="lab-text-gradient">{results?.profileName || username}</span>
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
                        <span className="text-4xl font-bold">{results?.effectiveness || 0}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">/100</span>
                      </div>
                    </div>
                    <span className="mt-4 text-sm font-bold text-slate-300 uppercase tracking-widest">{results?.reaction || 'Análisis'}</span>
                  </div>
                </div>

                {/* Grid Components */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {results?.components?.map((comp, idx) => (
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
                        {comp.items?.map((item, iIdx) => (
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
                <div className="relative overflow-hidden p-8 md:p-12 rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-transparent text-center mb-8">
                  <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-adslab-cyan/5 to-adslab-violet/5 pointer-events-none"></div>
                  <h4 className="text-xl md:text-2xl font-bold mb-4 relative z-10">
                    Tu perfil tiene potencial para <span className="lab-text-gradient">escalar con Ads</span>
                  </h4>
                  <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto relative z-10">
                    Habla con nuestro equipo y descubrí la fórmula exacta para tu crecimiento.
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
                <div className="mt-12 text-center opacity-30 flex flex-col items-center">
                  <Logo className="h-8 mb-4 grayscale" showText={true} />
                  <p className="text-[9px] uppercase tracking-[0.4em]">&copy; 2026 AdsLab • Marketing & Publicidad</p>
                </div>
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
