import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  SupportedLanguageCode, 
  VoiceAssistantMessage, 
  PossibleCondition,
  Facility
} from '../../types';
import { 
  SUPPORTED_LANGUAGES, 
  QUICK_ACTIONS_BY_LANG, 
  DEMO_SCENARIOS, 
  VoiceSpeechManager, 
  VoiceRecognitionManager,
  processRuralHealthConversation
} from '../../services/voiceAssistantEngine';
import { api } from '../../services/api';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Square, 
  Send, 
  RotateCcw, 
  Globe, 
  Keyboard, 
  Sparkles, 
  AlertTriangle, 
  PhoneCall, 
  Building2, 
  HelpCircle, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Clock,
  ShieldCheck,
  Play
} from 'lucide-react';

interface HealthVoiceAssistantProps {
  initialLanguage?: SupportedLanguageCode;
  initialPrompt?: string;
  isCompact?: boolean;
  onNavigateToScreening?: () => void;
}

export const HealthVoiceAssistant: React.FC<HealthVoiceAssistantProps> = ({
  initialLanguage = 'auto',
  initialPrompt,
  isCompact = false,
  onNavigateToScreening
}) => {
  const { facilities, selectedVillage, setSelectedVillage, setCurrentPage } = useAppState();

  // Voice & Speech Engines
  const speechManager = useMemo(() => new VoiceSpeechManager(), []);
  const recManager = useMemo(() => new VoiceRecognitionManager(), []);

  // Assistant State
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>(initialLanguage);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string>('demo_hi_fever');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [activeAudioMessageId, setActiveAudioMessageId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial welcome message based on language
  const getWelcomeMessage = (lang: SupportedLanguageCode): VoiceAssistantMessage => {
    let text = "Namaste! I am your AI Health Assistant. You can speak your symptoms in your own language or tap a topic below. How can I help you today?";
    let spoken = "Namaste! I am your AI Health Assistant. Please tap the microphone and speak what you are feeling.";

    if (lang === 'hi') {
      text = "नमस्ते! मैं आपका स्वास्थ्य सहायक (AI Health Assistant) हूँ।\n\nआप माइक का बटन दबाकर अपनी भाषा में परेशानी बता सकते हैं या नीचे दिए गए विकल्पों में से चुन सकते हैं। आज आपको क्या परेशानी महसूस हो रही है?";
      spoken = "नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। माइक दबाकर बताएं कि आपको क्या परेशानी हो रही है।";
    } else if (lang === 'mr') {
      text = "नमस्कार! मी आपला आरोग्य सहाय्यक (AI Health Assistant) आहे.\n\nतुम्ही माइकचे बटण दाबून तुमच्या भाषेत त्रास सांगू शकता किंवा खालील पर्यायांमधून निवडू शकता. आज तुम्हाला काय त्रास जाणवत आहे?";
      spoken = "नमस्कार! मी आपला आरोग्य सहाय्यक आहे. माइक दाबून सांगा तुम्हाला काय त्रास होत आहे.";
    }

    return {
      id: 'msg-welcome',
      sender: 'assistant',
      text,
      spokenAudioText: spoken,
      languageCode: lang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputMode: 'voice',
      quickResponses: lang === 'mr' ? ['ताप व अंगदुखी', 'खोकला व सर्दी', 'पोटदुखी', 'औषध माहिती'] : ['बुखार व बदन दर्द', 'खांसी व सर्दी', 'पेट दर्द', 'दवाइयों की जानकारी']
    };
  };

  const [messages, setMessages] = useState<VoiceAssistantMessage[]>([getWelcomeMessage(selectedLanguage)]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript, isThinking]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt) {
      handleUserMessage(initialPrompt, 'action');
    }
  }, [initialPrompt]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      speechManager.stop();
      recManager.stopListening();
    };
  }, [speechManager, recManager]);

  // Mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    speechManager.setMuted(nextMuted);
    if (nextMuted) {
      setIsSpeaking(false);
      setActiveAudioMessageId(null);
    }
  };

  // Replay speech for a message
  const playMessageAudio = (msg: VoiceAssistantMessage) => {
    if (isMuted) {
      toggleMute();
    }
    const textToSpeak = msg.spokenAudioText || msg.text;
    const lang = msg.languageCode || selectedLanguage;

    setActiveAudioMessageId(msg.id);
    setIsSpeaking(true);

    speechManager.speak(
      textToSpeak,
      lang,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        setActiveAudioMessageId(null);
      },
      () => {
        setIsSpeaking(false);
        setActiveAudioMessageId(null);
      }
    );
  };

  // Stop currently playing audio
  const stopAudio = () => {
    speechManager.stop();
    setIsSpeaking(false);
    setActiveAudioMessageId(null);
  };

  // Clear conversation
  const handleClearChat = () => {
    stopAudio();
    recManager.stopListening();
    setIsListening(false);
    setMessages([getWelcomeMessage(selectedLanguage)]);
    setErrorMessage(null);
  };

  // Switch language
  const handleLanguageChange = (code: SupportedLanguageCode) => {
    setSelectedLanguage(code);
    stopAudio();
    // Update welcome message if only 1 message
    if (messages.length <= 1) {
      setMessages([getWelcomeMessage(code)]);
    }
  };

  // Main message processor
  const handleUserMessage = async (userText: string, mode: 'voice' | 'text' | 'action') => {
    if (!userText.trim()) return;

    setErrorMessage(null);
    stopAudio();

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: VoiceAssistantMessage = {
      id: userMessageId,
      sender: 'user',
      text: userText.trim(),
      languageCode: selectedLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputMode: mode
    };

    setMessages(prev => [...prev, newUserMsg]);
    setTextInput('');
    setInterimTranscript('');
    setIsThinking(true);

    // Try backend AI endpoint first, fall back to offline clinical knowledge engine
    try {
      const backendRes = await api.sendVoiceAssistantMessage({
        message: userText,
        language_code: selectedLanguage,
        conversation_history: messages.map(m => ({ role: m.sender, text: m.text })),
        village_name: selectedVillage
      });

      const assistantMsgId = `asst-${Date.now()}`;
      const newAsstMsg: VoiceAssistantMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: backendRes.reply_text,
        spokenAudioText: backendRes.spoken_audio_text,
        languageCode: (backendRes.detected_language as SupportedLanguageCode) || selectedLanguage,
        detectedLanguage: backendRes.detected_language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        inputMode: mode,
        isRedFlagAlert: backendRes.is_red_flag,
        redFlagReason: backendRes.red_flag_reason,
        emergencyPhone: '108',
        possibleConditions: backendRes.possible_conditions as PossibleCondition[],
        suggestedFollowUpQuestions: backendRes.suggested_follow_up_questions,
        quickResponses: backendRes.quick_responses,
        isMedicineQuery: backendRes.is_medicine_query,
        medicineSafetyNote: backendRes.medicine_safety_note,
        showFacilityRecommendation: true
      };

      setMessages(prev => [...prev, newAsstMsg]);
      setIsThinking(false);

      // Speak response automatically if voice mode or if not muted
      if (!isMuted && mode === 'voice') {
        playMessageAudio(newAsstMsg);
      }
    } catch {
      // Offline / Fallback Clinical Engine
      const offlineResult = processRuralHealthConversation(userText, selectedLanguage, messages);

      const assistantMsgId = `asst-${Date.now()}`;
      const newAsstMsg: VoiceAssistantMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: offlineResult.replyText,
        spokenAudioText: offlineResult.spokenText,
        languageCode: selectedLanguage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        inputMode: mode,
        isRedFlagAlert: offlineResult.isRedFlag,
        redFlagReason: offlineResult.redFlagReason,
        emergencyPhone: '108',
        possibleConditions: offlineResult.possibleConditions,
        suggestedFollowUpQuestions: offlineResult.suggestedFollowUpQuestions,
        quickResponses: offlineResult.quickResponses,
        isMedicineQuery: offlineResult.isMedicineQuery,
        medicineSafetyNote: offlineResult.medicineSafetyNote,
        showFacilityRecommendation: offlineResult.showFacilityRecommendation
      };

      setMessages(prev => [...prev, newAsstMsg]);
      setIsThinking(false);

      if (!isMuted && mode === 'voice') {
        playMessageAudio(newAsstMsg);
      }
    }
  };

  // Start voice listening
  const handleStartListening = () => {
    stopAudio();
    setErrorMessage(null);
    setInterimTranscript('');

    if (!recManager.isSupported()) {
      setErrorMessage('Microphone is not supported in this browser. You can type your symptoms below.');
      setInputMode('text');
      return;
    }

    recManager.startListening(selectedLanguage, {
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setIsListening(false);
          setInterimTranscript('');
          handleUserMessage(transcript, 'voice');
        } else {
          setInterimTranscript(transcript);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMessage(err);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  // Stop voice listening manually
  const handleStopListening = () => {
    recManager.stopListening();
    setIsListening(false);
    if (interimTranscript.trim()) {
      handleUserMessage(interimTranscript.trim(), 'voice');
      setInterimTranscript('');
    }
  };

  // Trigger Demo Scenario
  const runDemoScenario = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId) || DEMO_SCENARIOS[0];
    setSelectedDemoId(scenario.id);
    setSelectedLanguage(scenario.languageCode);
    stopAudio();
    setErrorMessage(null);

    const userMsg: VoiceAssistantMessage = {
      id: `demo-u-${Date.now()}`,
      sender: 'user',
      text: scenario.userPrompt,
      languageCode: scenario.languageCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputMode: 'voice'
    };

    const combinedReply = scenario.assistantReplies.join('\n\n');
    const asstMsg: VoiceAssistantMessage = {
      id: `demo-a-${Date.now()}`,
      sender: 'assistant',
      text: scenario.isRedFlag 
        ? `⚠️ **URGENT MEDICAL ATTENTION (आपातकालीन सूचना)**\n\n${combinedReply}`
        : `🩺 **स्वास्थ्य सलाह (Health Guidance):**\n\n${combinedReply}`,
      spokenAudioText: scenario.assistantReplies.join(' '),
      languageCode: scenario.languageCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputMode: 'voice',
      isRedFlagAlert: scenario.isRedFlag,
      redFlagReason: scenario.isRedFlag ? 'Severe Shortness of breath / emergency' : undefined,
      emergencyPhone: '108',
      possibleConditions: scenario.conditions,
      suggestedFollowUpQuestions: scenario.isRedFlag ? ['108 पर कॉल करें', 'अस्पताल जाएं'] : ['नजदीकी PHC देखें', 'सावधानियां जानें'],
      quickResponses: scenario.sampleSymptoms,
      showFacilityRecommendation: true
    };

    setMessages([getWelcomeMessage(scenario.languageCode), userMsg, asstMsg]);

    if (!isMuted) {
      setTimeout(() => {
        playMessageAudio(asstMsg);
      }, 300);
    }
  };

  // Available quick action chips for current language
  const activeQuickActions = QUICK_ACTIONS_BY_LANG[selectedLanguage] || QUICK_ACTIONS_BY_LANG['hi'];

  // Facilities matching village
  const localFacilities = useMemo(() => {
    return facilities.filter(f => f.village === selectedVillage || f.type === 'PHC' || f.type === 'CHC').slice(0, 3);
  }, [facilities, selectedVillage]);

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-teal-100 shadow-xl overflow-hidden font-body transition-all ${
      isCompact ? 'max-w-xl mx-auto' : 'w-full'
    }`}>
      
      {/* 1. Header Bar: Assistant Identity + Language Selector + Demo Switch + Mute */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-4 sm:p-5 border-b border-teal-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                isListening ? 'bg-red-500 animate-ping' : isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg sm:text-xl font-black text-white">
                  Swasthya<span className="text-[#0F9D8B]">Voice</span>
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Rural AI
                </span>
                {isDemoMode && (
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <span>Multilingual Rural Health Voice Assistant</span>
                <span>·</span>
                <span className="text-teal-300 font-semibold">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}</span>
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 ml-auto">
            
            {/* Demo Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                isDemoMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-xs' 
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle Pre-Scripted Demo Mode"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Demo Mode</span>
            </button>

            {/* Mute/Unmute Audio Playback */}
            <button
              type="button"
              onClick={toggleMute}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isMuted 
                  ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                  : 'bg-slate-800 text-teal-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Audio Voice' : 'Mute Audio Voice'}
              aria-label={isMuted ? 'Unmute Voice' : 'Mute Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Clear Chat */}
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Clear Conversation"
              aria-label="Clear Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Language Selection Bar (13 Indian Languages + Auto-Detect) */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold shrink-0 pr-1">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Language:</span>
          </div>

          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F9D8B] text-white shadow-md shadow-teal-900/40 border border-teal-300 scale-105'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {lang.nativeName} {lang.code === 'auto' ? '🔍' : ''}
              </button>
            );
          })}
        </div>

        {/* Demo Scenario Selector (Shown when Demo Mode active) */}
        {isDemoMode && (
          <div className="mt-3 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">Preset Scenarios:</span>
              <span className="text-[11px] text-amber-200/80">Click any flow to test live:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {DEMO_SCENARIOS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => runDemoScenario(demo.id)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDemoId === demo.id
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-sm'
                      : 'bg-slate-900/80 text-amber-200 border-amber-500/40 hover:bg-slate-800'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{demo.title.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 2. Medical Trust & Non-Diagnosis Disclaimer */}
      <div className="bg-teal-50/80 px-4 py-2 text-[11px] sm:text-xs text-teal-900 border-b border-teal-100 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
        <p className="leading-tight">
          <strong>Medical Notice:</strong> This AI assistant provides general health guidance and possible conditions. It is not a replacement for a qualified doctor.
        </p>
      </div>

      {/* 3. Main Chat Conversation Stream */}
      <div className="flex-1 p-4 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto bg-slate-50/60">
        
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isPlayingThis = activeAudioMessageId === msg.id && isSpeaking;

          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2 animate-in fade-in duration-200`}
            >
              
              {/* Message Bubble Container */}
              <div className={`max-w-[90%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-xs transition-all ${
                isUser 
                  ? 'bg-gradient-to-br from-[#0F9D8B] to-teal-800 text-white rounded-tr-xs border border-teal-600' 
                  : msg.isRedFlagAlert
                    ? 'bg-red-50 text-slate-900 rounded-tl-xs border-2 border-red-500 shadow-md shadow-red-500/10'
                    : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200 shadow-sm'
              }`}>

                {/* Bubble Header (Badge & Controls) */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-black/10">
                  <div className="flex items-center gap-1.5">
                    {isUser ? (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-100 flex items-center gap-1">
                        {msg.inputMode === 'voice' ? '🎙️ Spoken Input' : '⌨️ Typed Input'}
                      </span>
                    ) : (
                      <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        msg.isRedFlagAlert ? 'text-red-700' : 'text-teal-700'
                      }`}>
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>SwasthyaNet Assistant</span>
                      </span>
                    )}
                  </div>

                  {/* Speaker Audio Replay Button */}
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => isPlayingThis ? stopAudio() : playMessageAudio(msg)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isPlayingThis 
                          ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                      title={isPlayingThis ? 'Stop Voice Output' : 'Play Voice Response'}
                    >
                      {isPlayingThis ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-mono hidden sm:inline">
                        {isPlayingThis ? 'Playing...' : 'Listen'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Message Body Content */}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-body font-normal">
                  {msg.text}
                </div>

                {/* Urgent Red-Flag Emergency Banner inside Assistant Bubble */}
                {msg.isRedFlagAlert && (
                  <div className="mt-4 p-4 rounded-2xl bg-red-600 text-white space-y-3 shadow-lg border border-red-700 animate-pulse">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
                      <div>
                        <h4 className="font-heading font-black text-base sm:text-lg text-white">
                          ⚠️ URGENT MEDICAL ATTENTION REQUIRED
                        </h4>
                        <p className="text-xs text-red-100 mt-0.5">
                          Potential high-risk clinical symptoms detected. Do not delay professional medical evaluation.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-500/80">
                      <a
                        href="tel:108"
                        className="bg-white text-red-700 hover:bg-red-50 active:scale-95 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4 fill-red-700 text-red-700 animate-bounce" />
                        <span>Call 108 Ambulance Now</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage('facilities');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-red-800 hover:bg-red-900 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Emergency Facilities</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Possible Conditions Guidance Section */}
                {msg.possibleConditions && msg.possibleConditions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#0F9D8B]" />
                        <span>Possible Causes / Conditions:</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Preliminary Possibilities</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {msg.possibleConditions.map((cond, idx) => (
                        <div 
                          key={cond.id || idx}
                          className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-2 text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-heading font-extrabold text-sm text-teal-950">
                              {idx + 1}. {cond.name}
                            </h5>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-teal-200 text-teal-800">
                              {cond.suggestedCareFacility || 'PHC'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 leading-normal">
                            {cond.explanation}
                          </p>

                          <div className="pt-1.5 border-t border-teal-100 flex flex-wrap items-center justify-between text-[11px] gap-2">
                            <span className="text-slate-600">
                              <strong>Common Signs:</strong> {cond.commonSymptoms.join(', ')}
                            </span>
                            <span className="text-teal-800 font-semibold">
                              🩺 {cond.whenToSeeDoctor}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      "These symptoms can occur with several conditions. A qualified healthcare professional can determine the actual cause."
                    </p>
                  </div>
                )}

                {/* Nearby Healthcare Facility Recommendation */}
                {msg.showFacilityRecommendation && !msg.isRedFlagAlert && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-700" />
                        <span>Recommended Nearby Facilities ({selectedVillage}):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage('facilities');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[11px] font-bold text-teal-700 hover:underline flex items-center gap-1"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {localFacilities.slice(0, 2).map((fac) => (
                        <div 
                          key={fac.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-1">{fac.name}</p>
                            <p className="text-[10px] text-slate-500">{fac.careLevelName} · {fac.operationalHours}</p>
                          </div>
                          <a
                            href={`tel:${fac.phone}`}
                            className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 shrink-0"
                            title={`Call ${fac.name}`}
                          >
                            <PhoneCall className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Quick Reply Suggestion Chips */}
                {msg.quickResponses && msg.quickResponses.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-black/10 flex flex-wrap gap-1.5">
                    {msg.quickResponses.map((qr, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleUserMessage(qr, 'action')}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          isUser
                            ? 'bg-teal-700/80 text-white border-teal-500 hover:bg-teal-600'
                            : 'bg-slate-100 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border-slate-300 hover:border-teal-300'
                        }`}
                      >
                        {qr} &rarr;
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* Timestamp */}
              <span className="text-[10px] font-mono text-slate-400 px-2">
                {msg.timestamp}
              </span>

            </div>
          );
        })}

        {/* Interim Speech Transcription Bubble */}
        {isListening && interimTranscript && (
          <div className="flex flex-col items-end space-y-1 animate-pulse">
            <div className="max-w-[80%] rounded-3xl p-4 bg-teal-100 text-teal-900 rounded-tr-xs border border-teal-300 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-teal-700 font-bold block mb-1">
                Listening in real-time...
              </span>
              <p className="text-sm font-medium">{interimTranscript}</p>
            </div>
          </div>
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 max-w-xs shadow-xs animate-in fade-in">
            <div className="w-2 h-2 rounded-full bg-[#0F9D8B] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#0F9D8B] animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-[#0F9D8B] animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs text-slate-600 font-medium">Assistant is thinking...</span>
          </div>
        )}

        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-800 border border-red-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-700 font-bold underline text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 4. Suggested Quick Action Buttons (Large Rural Friendly Cards) */}
      <div className="bg-slate-100/90 p-3 sm:p-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold">Quick Health Actions:</span>
          <span className="text-[11px] text-slate-500">Tap to start conversation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {activeQuickActions.slice(0, 4).map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleUserMessage(action.prompt, 'action')}
              className="p-2.5 rounded-2xl bg-white hover:bg-teal-50/80 border border-slate-200 hover:border-teal-300 text-left transition-all shadow-2xs group cursor-pointer flex items-center gap-2.5"
            >
              <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 group-hover:text-teal-900 truncate">
                  {action.label}
                </p>
                <p className="text-[10px] text-slate-500 truncate">Tap to consult</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Voice & Text Primary Input Bar (Large Rural-Friendly Controls) */}
      <div className="bg-white p-4 sm:p-6 border-t border-slate-200 space-y-4">
        
        {/* Large Prominent Microphone Centerpiece (Voice Mode) */}
        {inputMode === 'voice' ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            
            <div className="relative">
              {/* Outer Pulsing Wave Circles when listening */}
              {isListening && (
                <>
                  <span className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping" />
                  <span className="absolute -inset-8 rounded-full bg-red-500/10 animate-pulse" />
                </>
              )}

              {/* Main Microphone Button */}
              <button
                type="button"
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white shadow-red-600/30 scale-105 border-4 border-white'
                    : 'bg-gradient-to-tr from-[#0F9D8B] to-teal-500 text-white shadow-teal-700/30 hover:scale-103 border-4 border-teal-100'
                }`}
                aria-label={isListening ? 'Stop Speaking' : 'Start Speaking'}
              >
                {isListening ? (
                  <>
                    <Square className="w-8 h-8 fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">STOP</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 sm:w-9 sm:h-9 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">TAP & SPEAK</span>
                  </>
                )}
              </button>
            </div>

            {/* Instruction Label */}
            <div className="text-center space-y-0.5">
              <p className="text-sm font-extrabold text-slate-900">
                {isListening ? '🎙️ Listening... Speak your symptoms now' : '🎙️ "Tell me what you are feeling."'}
              </p>
              <p className="text-xs text-slate-500">
                Speak in Hindi, Marathi, English or your local language.
              </p>
            </div>

            {/* Switch to Keyboard input button */}
            <button
              type="button"
              onClick={() => {
                setInputMode('text');
                stopAudio();
              }}
              className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1.5 pt-1 cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
              <span>Or type your symptoms instead</span>
            </button>

          </div>
        ) : (
          /* Text Input Mode */
          <div className="space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserMessage(textInput, 'text');
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your symptoms here in any language (e.g. mujhe 2 din se fever hai)..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm font-medium text-slate-900 outline-none transition-all"
              />

              <button
                type="submit"
                disabled={!textInput.trim()}
                className="px-5 py-3 rounded-2xl bg-[#0F9D8B] hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                className="text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-teal-700" />
                <span>Switch back to Voice (Tap & Speak)</span>
              </button>

              <span className="text-[11px] text-slate-500">Supports Hindi, Marathi & English text</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
