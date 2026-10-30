import { 
  SupportedLanguageCode, 
  LanguageOption, 
  VoiceAssistantMessage, 
  PossibleCondition, 
  DemoScenario 
} from '../types';

// ---------------------------------------------------------------------------
// 1. Language Definitions (13 Indian Languages + Auto-Detect)
// ---------------------------------------------------------------------------

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto Detect', nativeName: 'ऑटो डिटेक्ट', scriptLabel: 'Auto', speechCode: 'hi-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', scriptLabel: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', scriptLabel: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', scriptLabel: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', scriptLabel: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', scriptLabel: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', scriptLabel: 'ગુજરાતી', speechCode: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', scriptLabel: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', scriptLabel: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', scriptLabel: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', scriptLabel: 'ଓଡ଼ିଆ', speechCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', scriptLabel: 'অসমীয়া', speechCode: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', scriptLabel: 'اردو', speechCode: 'ur-IN' },
  { code: 'en', name: 'English', nativeName: 'English', scriptLabel: 'English', speechCode: 'en-IN' }
];

export const QUICK_ACTIONS_BY_LANG: Record<SupportedLanguageCode, Array<{ id: string; label: string; icon: string; prompt: string }>> = {
  hi: [
    { id: 'describe', label: 'लक्षण बताएं', icon: '🎙️', prompt: 'मुझे अपनी बीमारी और लक्षणों के बारे में बताना है।' },
    { id: 'fever', label: 'बुखार', icon: '🌡️', prompt: 'मुझे बुखार और कंपकंपी महसूस हो रही है।' },
    { id: 'cold', label: 'सर्दी और खांसी', icon: '🤧', prompt: 'मुझे पिछले दो दिनों से सर्दी, खांसी और गले में खराश है।' },
    { id: 'pain', label: 'बदन व सिर दर्द', icon: '🤕', prompt: 'मुझे सिर और पूरे शरीर में तेज दर्द हो रहा है।' },
    { id: 'stomach', label: 'पेट की समस्या', icon: '🤢', prompt: 'मुझे पेट में दर्द और उल्टी जैसा लग रहा है।' },
    { id: 'skin', label: 'त्वचा के चकत्ते', icon: '🩹', prompt: 'त्वचा पर खुजली और लाल दाने निकल आए हैं।' },
    { id: 'medicine', label: 'दवाइयों की जानकारी', icon: '💊', prompt: 'सामान्य बुखार और दर्द की दवाओं के बारे में सही सलाह क्या है?' },
    { id: 'facilities', label: 'नजदीकी अस्पताल', icon: '🏥', prompt: 'मेरे गांव के पास कौन सा प्राथमिक स्वास्थ्य केंद्र (PHC) उपलब्ध है?' }
  ],
  mr: [
    { id: 'describe', label: 'लक्षणे सांगा', icon: '🎙️', prompt: 'मला माझ्या तब्येतीची लक्षणे सांगायची आहेत.' },
    { id: 'fever', label: 'ताप', icon: '🌡️', prompt: 'मला कालपासून ताप आणि अंगदुखी आहे.' },
    { id: 'cold', label: 'सर्दी आणि खोकला', icon: '🤧', prompt: 'मला खोकला, सर्दी आणि घसा दुखत आहे.' },
    { id: 'pain', label: 'अंगदुखी / डोकेदुखी', icon: '🤕', prompt: 'माझे डोके आणि अंग खूप दुखत आहे.' },
    { id: 'stomach', label: 'पोटाचे विकार', icon: '🤢', prompt: 'मला पोटात दुखत असून उलटीसारखे वाटते.' },
    { id: 'skin', label: 'त्वचेच्या समस्या', icon: '🩹', prompt: 'त्वचेवर लाल पुरळ आणि खाज येत आहे.' },
    { id: 'medicine', label: 'औषध माहिती', icon: '💊', prompt: 'सामान्य आजारांमधील औषधोपचारांची प्राथमिक माहिती काय आहे?' },
    { id: 'facilities', label: 'जवळचे रुग्णालय', icon: '🏥', prompt: 'माझ्या गावाजवळ प्राथमिक आरोग्य केंद्र (PHC) कुठे आहे?' }
  ],
  en: [
    { id: 'describe', label: 'Describe Symptoms', icon: '🎙️', prompt: 'I want to describe my symptoms and how I feel.' },
    { id: 'fever', label: 'Fever', icon: '🌡️', prompt: 'I have had a fever and body aches for two days.' },
    { id: 'cold', label: 'Cold & Cough', icon: '🤧', prompt: 'I have a sore throat, runny nose, and continuous cough.' },
    { id: 'pain', label: 'Headache & Pain', icon: '🤕', prompt: 'I have a throbbing headache and body pain.' },
    { id: 'stomach', label: 'Stomach Issues', icon: '🤢', prompt: 'I have stomach cramps, nausea, and loose motion.' },
    { id: 'skin', label: 'Skin Problems', icon: '🩹', prompt: 'I have skin rashes with redness and itching.' },
    { id: 'medicine', label: 'Medicine Safety', icon: '💊', prompt: 'What is the safe medical advice regarding fever medicines?' },
    { id: 'facilities', label: 'Find Healthcare', icon: '🏥', prompt: 'Where is the nearest Primary Health Centre or clinic?' }
  ],
  auto: [
    { id: 'describe', label: 'Describe Symptoms / लक्षण बताएं', icon: '🎙️', prompt: 'मुझे बुखार और खांसी है।' },
    { id: 'fever', label: 'Fever / ताप / बुखार', icon: '🌡️', prompt: 'मुझे बुखार आ रहा है।' },
    { id: 'cold', label: 'Cold & Cough / सर्दी खोकला', icon: '🤧', prompt: 'सर्दी और खांसी हो रही है।' },
    { id: 'pain', label: 'Body Pain / अंगदुखी', icon: '🤕', prompt: 'शरीर में दर्द और सिरदर्द है।' },
    { id: 'stomach', label: 'Stomach / पेट दर्द', icon: '🤢', prompt: 'पेट खराब है और उल्टी जैसा लग रहा है।' },
    { id: 'skin', label: 'Skin / त्वचा', icon: '🩹', prompt: 'त्वचा पर लाल दाने हैं।' },
    { id: 'medicine', label: 'Medicine / दवाएं', icon: '💊', prompt: 'दवाइयों की सही जानकारी क्या है?' },
    { id: 'facilities', label: 'Nearby PHC / अस्पताल', icon: '🏥', prompt: 'नजदीकी स्वास्थ्य केंद्र कहां है?' }
  ],
  bn: [
    { id: 'describe', label: 'লক্ষণ বলুন', icon: '🎙️', prompt: 'আমি আমার উপসর্গের কথা জানাতে চাই।' },
    { id: 'fever', label: 'জ্বর', icon: '🌡️', prompt: 'আমার জ্বর এবং শরীর ব্যথা করছে।' },
    { id: 'cold', label: 'সর্দি ও কাশি', icon: '🤧', prompt: 'আমার সর্দি, কাশি এবং গলা ব্যথা আছে।' },
    { id: 'pain', label: 'মাথা ও শরীর ব্যথা', icon: '🤕', prompt: 'আমার খুব মাথা ব্যথা এবং শরীরে দুর্বলতা আছে।' },
    { id: 'stomach', label: 'পেটের সমস্যা', icon: '🤢', prompt: 'আমার পেটে ব্যথা ও বমি ভাব হচ্ছে।' },
    { id: 'skin', label: 'চর্মরোগ', icon: '🩹', prompt: 'ত্বকে চুলকানি ও লাল দাগ হয়েছে।' },
    { id: 'medicine', label: 'ওষুধের তথ্য', icon: '💊', prompt: 'জ্বর ও ব্যথার প্রাথমিক ওষুধের সতর্কতা কী?' },
    { id: 'facilities', label: 'নিকটবর্তী হাসপাতাল', icon: '🏥', prompt: 'আমার কাছের স্বাস্থ্যকেন্দ্র কোথায়?' }
  ],
  te: [
    { id: 'describe', label: 'లక్షణాలు చెప్పండి', icon: '🎙️', prompt: 'నేను నా ఆరోగ్య లక్షణాలను తెలియజేయాలనుకుంటున్నాను.' },
    { id: 'fever', label: 'జ్వరం', icon: '🌡️', prompt: 'నాకు రెండు రోజులుగా జ్వరం మరియు ఒళ్ళు నొప్పులు ఉన్నాయి.' },
    { id: 'cold', label: 'జలుబు & దగ్గు', icon: '🤧', prompt: 'నాకు గొంతు నొప్పి, జలుబు మరియు దగ్గు ఉంది.' },
    { id: 'pain', label: 'నొప్పులు', icon: '🤕', prompt: 'నాకు తీవ్రమైన తలనొప్పి మరియు నీరసం ఉంది.' },
    { id: 'stomach', label: 'కడుపు సమస్యలు', icon: '🤢', prompt: 'నాకు కడుపునొప్పి మరియు వాంతులుగా ఉంది.' },
    { id: 'skin', label: 'చర్మ సమస్యలు', icon: '🩹', prompt: 'చర్మంపై దద్దుర్లు మరియు దురద ఉన్నాయి.' },
    { id: 'medicine', label: 'మందుల సమాచారం', icon: '💊', prompt: 'సాధారణ మందుల వాడకంలో జాగ్రత్తలు ఏమిటి?' },
    { id: 'facilities', label: 'దగ్గరి ఆసుపత్రి', icon: '🏥', prompt: 'సమీప ప్రాథమిక ఆరోగ్య కేంద్రం ఎక్కడ ఉంది?' }
  ],
  ta: [
    { id: 'describe', label: 'அறிகுறிகள்', icon: '🎙️', prompt: 'எனது உடல்நல அறிகுறிகளைப் பற்றி கூற விரும்புகிறேன்.' },
    { id: 'fever', label: 'காய்ச்சல்', icon: '🌡️', prompt: 'எனக்கு காய்ச்சலும் உடல் வலியும் உள்ளது.' },
    { id: 'cold', label: 'சளி & இருமல்', icon: '🤧', prompt: 'எனக்கு இருமல், சளி மற்றும் தொண்டை வலி உள்ளது.' },
    { id: 'pain', label: 'தலைவலி & வலி', icon: '🤕', prompt: 'எனக்கு கடுமையான தலைவலியும் சோர்வும் உள்ளது.' },
    { id: 'stomach', label: 'வயிற்றுப் பிரச்சனை', icon: '🤢', prompt: 'வயிற்று வலி மற்றும் குமட்டல் உள்ளது.' },
    { id: 'skin', label: 'தோல் பிரச்சனை', icon: '🩹', prompt: 'தோலில் அரிப்பு மற்றும் சிவப்பு தடிப்புகள் உள்ளன.' },
    { id: 'medicine', label: 'மருந்து தகவல்', icon: '💊', prompt: 'மருந்து பயன்பாட்டின் பாதுகாப்பு வழிகாட்டுதல்கள் என்ன?' },
    { id: 'facilities', label: 'அருகிலுள்ள மருத்துவமனை', icon: '🏥', prompt: 'அருகிலுள்ள ஆரம்ப சுகாதார நிலையம் எங்குள்ளது?' }
  ],
  gu: [
    { id: 'describe', label: 'લક્ષણો જણાવો', icon: '🎙️', prompt: 'હું મારા સ્વાસ્થ્યના લક્ષણો જણાવવા માંગુ છું.' },
    { id: 'fever', label: 'તાવ', icon: '🌡️', prompt: 'મને બે દિવસથી તાવ અને શરીરનો દુખાવો છે.' },
    { id: 'cold', label: 'શરદી અને ખાંસી', icon: '🤧', prompt: 'મને ગળામાં દુખાવો, શરદી અને ખાંસી છે.' },
    { id: 'pain', label: 'માથાનો દુખાવો', icon: '🤕', prompt: 'મને તીવ્ર માથાનો દુખાવો અને નબળાઈ છે.' },
    { id: 'stomach', label: 'પેટની તકલીફ', icon: '🤢', prompt: 'મને પેટમાં દુખાવો અને ઉલટી જેવું થાય છે.' },
    { id: 'skin', label: 'ચામડીની સમસ્યા', icon: '🩹', prompt: 'ચામડી પર ખંજવાળ અને લાલ ચકામા છે.' },
    { id: 'medicine', label: 'દવાની માહિતી', icon: '💊', prompt: 'દવાઓ લેવા બાબતે સાચી સલાહ શું છે?' },
    { id: 'facilities', label: 'નજીકનું દવાખાનું', icon: '🏥', prompt: 'નજીકનું પ્રાથમિક આરોગ્ય કેન્દ્ર ક્યાં છે?' }
  ],
  kn: [
    { id: 'describe', label: 'ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿ', icon: '🎙️', prompt: 'ನನ್ನ ರೋಗ ಲಕ್ಷಣಗಳನ್ನು ಹೇಳಲು ಬಯಸುತ್ತೇನೆ.' },
    { id: 'fever', label: 'ಜ್ವರ', icon: '🌡️', prompt: 'ನನಗೆ ಎರಡು ದಿನಗಳಿಂದ ಜ್ವರ ಮತ್ತು ಮೈಕೈ ನೋವಿದೆ.' },
    { id: 'cold', label: 'ನೆಗಡಿ ಮತ್ತು ಕೆಮ್ಮು', icon: '🤧', prompt: 'ನನಗೆ ಗಂಟಲು ನೋವು, ಕೆಮ್ಮು ಮತ್ತು ನೆಗಡಿ ಇದೆ.' },
    { id: 'pain', label: 'ತಲೆನೋವು & ನೋವು', icon: '🤕', prompt: 'ನನಗೆ ತೀವ್ರ ತಲೆನೋವು ಮತ್ತು ಆಯಾಸವಿದೆ.' },
    { id: 'stomach', label: 'ಹೊಟ್ಟೆಯ ಸಮಸ್ಯೆ', icon: '🤢', prompt: 'ಹೊಟ್ಟೆ ನೋವು ಮತ್ತು ವಾಂತಿ ಬರುತ್ತಿದೆ.' },
    { id: 'skin', label: 'ಚರ್ಮದ ಸಮಸ್ಯೆ', icon: '🩹', prompt: 'ಚರ್ಮದಲ್ಲಿ ತುರಿಕೆ ಮತ್ತು ದದ್ದುಗಳು ಉಂಟಾಗಿವೆ.' },
    { id: 'medicine', label: 'ಔಷಧಿ ಮಾಹಿತಿ', icon: '💊', prompt: 'ಔಷಧಿಗಳ ಬಳಕೆಯ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶನವೇನು?' },
    { id: 'facilities', label: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ', icon: '🏥', prompt: 'ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?' }
  ],
  ml: [
    { id: 'describe', label: 'ലക്ഷണങ്ങൾ പറയുക', icon: '🎙️', prompt: 'എന്റെ രോഗലക്ഷണങ്ങൾ വിവരിക്കാൻ ആഗ്രഹിക്കുന്നു.' },
    { id: 'fever', label: 'പനി', icon: '🌡️', prompt: 'എനിക്ക് പനിയും കഠിനമായ ശരീരവേദനയും ഉണ്ട്.' },
    { id: 'cold', label: 'ചുമയും ജലദോഷവും', icon: '🤧', prompt: 'എനിക്ക് തൊണ്ടവേദനയും ചുമയും ജലദോഷവും ഉണ്ട്.' },
    { id: 'pain', label: 'തലവേദന & ക്ഷീണം', icon: '🤕', prompt: 'എനിക്ക് കഠിനമായ തലവേദനയും ക്ഷീണവും അനുഭവപ്പെടുന്നു.' },
    { id: 'stomach', label: 'വയറുവേദന', icon: '🤢', prompt: 'വയറുവേദനയും ഛർദ്ദിയും അനുഭവപ്പെടുന്നു.' },
    { id: 'skin', label: 'ത്വക്ക് രോഗങ്ങൾ', icon: '🩹', prompt: 'ശരീരത്തിൽ ചൊറിച്ചിലും ചുവന്ന പാടുകളും ഉണ്ട്.' },
    { id: 'medicine', label: 'മരുന്ന് വിവരങ്ങൾ', icon: '💊', prompt: 'മരുന്നുകൾ കഴിക്കുമ്പോൾ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ എന്തൊക്കെയാണ്?' },
    { id: 'facilities', label: 'അടുത്തുള്ള ആശുപത്രി', icon: '🏥', prompt: 'ഏറ്റവും അടുത്തുള്ള ആരോഗ്യ കേന്ദ്രം എവിടെയാണ്?' }
  ],
  pa: [
    { id: 'describe', label: 'ਲੱਛਣ ਦੱਸੋ', icon: '🎙️', prompt: 'ਮੈਂ ਆਪਣੀ ਬਿਮਾਰੀ ਦੇ ਲੱਛਣ ਦੱਸਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।' },
    { id: 'fever', label: 'ਬੁਖ਼ਾਰ', icon: '🌡️', prompt: 'ਮੈਨੂੰ ਦੋ ਦਿਨਾਂ ਤੋਂ ਬੁਖ਼ਾਰ ਅਤੇ ਸਰੀਰ ਦਰਦ ਹੈ।' },
    { id: 'cold', label: 'ਖੰਘ ਤੇ ਜ਼ੁਕਾਮ', icon: '🤧', prompt: 'ਮੈਨੂੰ ਗਲੇ ਵਿੱਚ ਦਰਦ, ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ ਹੈ।' },
    { id: 'pain', label: 'ਸਿਰਦਰਦ ਤੇ ਕਮਜ਼ੋਰੀ', icon: '🤕', prompt: 'ਮੈਨੂੰ ਬਹੁਤ ਤੇਜ਼ ਸਿਰਦਰਦ ਅਤੇ ਥਕਾਵਟ ਹੈ।' },
    { id: 'stomach', label: 'ਪੇਟ ਦੀ ਤਕਲੀਫ਼', icon: '🤢', prompt: 'ਪੇਟ ਵਿੱਚ ਦਰਦ ਅਤੇ ਉਲਟੀ ਆ ਰਹੀ ਹੈ।' },
    { id: 'skin', label: 'ਚਮੜੀ ਦੀ ਸਮੱਸਿਆ', icon: '🩹', prompt: 'ਚਮੜੀ ਤੇ ਖਾਰਸ਼ ਅਤੇ ਲਾਲ ਦਾਣੇ ਹਨ।' },
    { id: 'medicine', label: 'ਦਵਾਈ ਜਾਣਕਾਰੀ', icon: '💊', prompt: 'ਆਮ ਦਵਾਈਆਂ ਲੈਣ ਸਬੰਧੀ ਜ਼ਰੂਰੀ ਸਲਾਹ ਕੀ ਹੈ?' },
    { id: 'facilities', label: 'ਨੇੜਲਾ ਹਸਪਤਾਲ', icon: '🏥', prompt: 'ਮੇਰੇ ਪਿੰਡ ਨੇੜੇ ਸਿਹਤ ਕੇਂਦਰ ਕਿੱਥੇ ਹੈ?' }
  ],
  or: [
    { id: 'describe', label: 'ଲକ୍ଷଣ କୁହନ୍ତୁ', icon: '🎙️', prompt: 'ମୁଁ ମୋର ରୋଗ ଲକ୍ଷଣ ବିଷୟରେ ଜଣାଇବାକୁ ଚାହୁଁଛି।' },
    { id: 'fever', label: 'ଜ୍ୱର', icon: '🌡️', prompt: 'ମୋତେ ଦୁଇ ଦିନ ହେବ ଜ୍ୱର ଓ ଶରୀର ଯନ୍ତ୍ରଣା ହେଉଛି।' },
    { id: 'cold', label: 'ଥଣ୍ଡା ଓ କାଶ', icon: '🤧', prompt: 'ମୋର କାଶ, ଥଣ୍ଡା ଏବଂ ଗଳା ଯନ୍ତ୍ରଣା ହେଉଛି।' },
    { id: 'pain', label: 'ମୁଣ୍ଡବିନ୍ଧା', icon: '🤕', prompt: 'ମୋର ପ୍ରବଳ ମୁଣ୍ଡବିନ୍ଧା ଓ ଦୁର୍ବଳତା ଲାଗୁଛି।' },
    { id: 'stomach', label: 'ପେଟ ସମସ୍ୟା', icon: '🤢', prompt: 'ପେଟରେ ଯନ୍ତ୍ରଣା ଓ ବାନ୍ତି ଲାଗୁଛି।' },
    { id: 'skin', label: 'ଚର୍ମ ରୋଗ', icon: '🩹', prompt: 'ଚର୍ମରେ କୁଣ୍ଡେଇ ହେବା ଓ ଲାଲ ଚିହ୍ନ ହୋଇଛି।' },
    { id: 'medicine', label: 'ଔଷଧ ସୂଚନା', icon: '💊', prompt: 'ଔଷଧ ବ୍ୟବହାର ବିଷୟରେ ସଠିକ୍ ପରାମର୍ଶ କଣ?' },
    { id: 'facilities', label: 'ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା', icon: '🏥', prompt: 'ନିକଟସ୍ଥ ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର କେଉଁଠାରେ ଅଛି?' }
  ],
  as: [
    { id: 'describe', label: 'লক্ষণ কওক', icon: '🎙️', prompt: 'মই মোৰ স্বাস্থ্যৰ লক্ষণসমূহ ক’ব বিচাৰোঁ।' },
    { id: 'fever', label: 'জ্বৰ', icon: '🌡️', prompt: 'মোৰ দুদিন ধৰি জ্বৰ আৰু গাত বিষ হৈ আছে।' },
    { id: 'cold', label: 'চৰ্দি আৰু কাহ', icon: '🤧', prompt: 'মোৰ ডিঙিৰ বিষ, কাহ আৰু চৰ্দি হৈছে।' },
    { id: 'pain', label: 'মূৰৰ বিষ', icon: '🤕', prompt: 'মোৰ অতিপাত মূৰৰ বিষ আৰু দুৰ্বলতা লাগিছে।' },
    { id: 'stomach', label: 'পেটৰ সমস্যা', icon: '🤢', prompt: 'পেটৰ বিষ আৰু বমি ভাৱ হৈছে।' },
    { id: 'skin', label: 'ছালৰ সমস্যা', icon: '🩹', prompt: 'ছালত খজুৱতি আৰু ৰঙা দাগ ওলাইছে।' },
    { id: 'medicine', label: 'ঔষধৰ তথ্য', icon: '💊', prompt: 'সাধাৰণ ঔষধ গ্ৰহণৰ ক্ষেত্ৰত সতৰ্কতা কি?' },
    { id: 'facilities', label: 'ওচৰৰ চিকিৎসালয়', icon: '🏥', prompt: 'ওচৰৰ স্বাস্থ্য কেন্দ্ৰটো ক’ত আছে?' }
  ],
  ur: [
    { id: 'describe', label: 'علامات بتائیں', icon: '🎙️', prompt: 'میں اپنی بیماری کی علامات بتانا چاہتا ہوں۔' },
    { id: 'fever', label: 'بخار', icon: '🌡️', prompt: 'मुझे दो दिन से بخार और جسم میں درد ہے۔' },
    { id: 'cold', label: 'نزلہ اور کھانسی', icon: '🤧', prompt: 'مجھے گلے میں درد، کھانسی اور نزلہ ہے۔' },
    { id: 'pain', label: 'سر درد و کمزوری', icon: '🤕', prompt: 'مجھے شدید سر درد اور جسم میں تھکن محسوس ہو رہی ہے۔' },
    { id: 'stomach', label: 'پیٹ کے مسائل', icon: '🤢', prompt: 'پیٹ میں درد اور متلی کی شکایت ہے۔' },
    { id: 'skin', label: 'جلد کی الرجی', icon: '🩹', prompt: 'جلد پر خارش اور لال نشانات ہو گئے ہیں۔' },
    { id: 'medicine', label: 'ادویات کی رہنمائی', icon: '💊', prompt: 'عام بیماریوں میں ادویات سے متعلق محفوظ ہدایات کیا ہیں؟' },
    { id: 'facilities', label: 'قریبی اسپتال', icon: '🏥', prompt: 'قریبی پرائمری ہیلتھ سینٹر کہاں واقع ہے؟' }
  ]
};

// ---------------------------------------------------------------------------
// 2. Red-Flag Emergency Keywords (Multilingual & Code-Mixed)
// ---------------------------------------------------------------------------

const RED_FLAG_KEYWORDS = [
  'severe breathing', 'difficulty breathing', 'breathless', 'saans lene me takleef', 'saans fulna', 
  'shwas ghenyala tras', 'shwas lagne', 'dum ghutna', 'dam lagna', 'oxygen', 'neela', 'blue lips',
  'सांस लेने में दिक्कत', 'सांस फूलना', 'श्वास घेण्यास त्रास', 'दम लागणे', 'শ্বাসের কষ্ট', 'శ్వాస తీసుకోవడంలో ఇబ్బంది',
  'chest pain', 'severe chest', 'dil me dard', 'chhati me dard', 'chhatit vedna', 'heart attack',
  'chhati dabaav', 'chaati tezz dard', 'छाती में तेज दर्द', 'छातीत तीव्र वेदना', 'বুক ব্যথা', 'ఛాతీ నొప్పి',
  'unconscious', 'fainted', 'behosh', 'bheshuddh', 'chakkar aakar girna', 'paralysis', 'lakwa',
  'ardhangvayu', 'slurred speech', 'bolne me dikkat', 'bolayla tras', 'ek side sunn', 'fit aana',
  'mirgi', 'seizure', 'बेहोश', 'बेशुद्ध', 'लकवा', 'अर्धांगवायू', 'খিঁচুনি', 'మూర్ఛ',
  'heavy bleeding', 'khoon behna', 'raktsrav', 'raktasrav', 'severe hemorrhage', 'vomiting blood',
  'khoon ki ulti', 'raktachi ulti', 'भारी रक्तस्राव', 'खून की उल्टी', 'রক্তপাত', 'తీవ్ర రక్తస్రావం',
  'infant high fever', 'newborn fever', 'navjaat sishu', 'baalala teevra tap', 'bachha dudh nahi pi raha',
  'baal doodh peet nahi', 'severe dehydration', 'gambhir dehydration', 'peshab band', 'urine stopped'
];

export function detectRedFlag(text: string): { isRedFlag: boolean; reason?: string } {
  const lower = text.toLowerCase();
  for (const keyword of RED_FLAG_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      if (keyword.includes('breath') || keyword.includes('saans') || keyword.includes('shwas') || keyword.includes('सांस')) {
        return { isRedFlag: true, reason: 'Severe difficulty breathing / acute respiratory distress' };
      }
      if (keyword.includes('chest') || keyword.includes('chhati') || keyword.includes('dil') || keyword.includes('छाती')) {
        return { isRedFlag: true, reason: 'Severe chest pain / possible cardiac emergency' };
      }
      if (keyword.includes('unconscious') || keyword.includes('behosh') || keyword.includes('bheshuddh') || keyword.includes('lakwa') || keyword.includes('बेहोश')) {
        return { isRedFlag: true, reason: 'Altered consciousness / neurological warning sign' };
      }
      if (keyword.includes('blood') || keyword.includes('khoon') || keyword.includes('rakt') || keyword.includes('bleeding')) {
        return { isRedFlag: true, reason: 'Severe or unexpected bleeding / hemorrhage' };
      }
      return { isRedFlag: true, reason: 'High-priority clinical warning sign' };
    }
  }
  return { isRedFlag: false };
}

// ---------------------------------------------------------------------------
// 3. Language Detection Heuristics
// ---------------------------------------------------------------------------

export function detectLanguageFromText(text: string): SupportedLanguageCode {
  if (/[\u0900-\u097F]/.test(text)) {
    if (/\b(आहे|आहेत|नाही|झाला|झाली|होत|आणि|कालपासून|मला|माझे|दुखत|वाटत|सांगा|कधी|कसं|गावात|घरी)\b/i.test(text)) {
      return 'mr';
    }
    return 'hi';
  }
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or';
  if (/[\u0600-\u06FF]/.test(text)) return 'ur';

  const lower = text.toLowerCase();
  if (/\b(mala|kalpasun|ahe|aahe|ani|khokla|thakva|angdukhi|tap|dokeydukhi|vatate|vichara)\b/.test(lower)) {
    return 'mr';
  }
  if (/\b(mujhe|mera|meri|hai|hain|ho|raha|rahi|se|ka|ki|ke|bukhar|dard|khansi|sar|gala|pet|dast|kamzori|ulti)\b/.test(lower)) {
    return 'hi';
  }
  if (/\b(amar|hochhe|aache|jwor|kashi|matha|batha|pet|durbol)\b/.test(lower)) {
    return 'bn';
  }
  if (/\b(naaku|undi|jwaram|thalanoppi|daggu|kadupunopi)\b/.test(lower)) {
    return 'te';
  }
  if (/\b(enakku|irukku|kaichal|irumal|thalaivali|valikithu)\b/.test(lower)) {
    return 'ta';
  }

  return 'en';
}

// ---------------------------------------------------------------------------
// 4. Conversational Clinical Guidance Engine
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 4. Comprehensive Multilingual Clinical AI Engine
// ---------------------------------------------------------------------------

interface ClinicalEvaluation {
  replyText: string;
  spokenText: string;
  isRedFlag: boolean;
  redFlagReason?: string;
  possibleConditions: PossibleCondition[];
  suggestedFollowUpQuestions: string[];
  quickResponses: string[];
  isMedicineQuery: boolean;
  medicineSafetyNote?: string;
  showFacilityRecommendation: boolean;
}

export function processRuralHealthConversation(
  userText: string,
  selectedLanguage: SupportedLanguageCode,
  history: VoiceAssistantMessage[]
): ClinicalEvaluation {
  const activeLang = selectedLanguage === 'auto' ? detectLanguageFromText(userText) : selectedLanguage;
  const redFlag = detectRedFlag(userText);
  const lower = userText.toLowerCase();

  // 1. Emergency Red-Flag Trigger
  if (redFlag.isRedFlag) {
    if (activeLang === 'hi') {
      return {
        replyText: `⚠️ **अत्यंत जरूरी चिकित्सा चेतावनी (EMERGENCY WARNING)**\n\nआपके बताए गए लक्षण (${redFlag.reason}) तुरंत आपातकालीन देखभाल की मांग करते हैं।\n\n🚨 **तुरंत यह कदम उठाएं:**\n1. तुरंत **108 नंबर** पर कॉल करके एम्बुलेंस बुलाएं।\n2. मरीज को शांत रखें, आरामदायक स्थिति में बैठाएं और भीड़ न लगने दें।\n3. खुद से कोई दवा या ठोस आहार न दें। सीधे नजदीकी 24x7 **सामुदायिक स्वास्थ्य केंद्र (CHC)** या **जिला अस्पताल** पहुंचे।`,
        spokenText: 'चेतावनी! आपके लक्षण गंभीर हो सकते हैं। कृपया तुरंत 108 नंबर पर फोन करके एम्बुलेंस बुलाएं या नजदीकी अस्पताल पहुंचें।',
        isRedFlag: true,
        redFlagReason: redFlag.reason,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['108 पर कॉल करें', 'नजदीकी अस्पताल देखें'],
        quickResponses: ['एम्बुलेंस बुलाएं (108)', 'अस्पताल का पता बताएं'],
        isMedicineQuery: false,
        showFacilityRecommendation: true
      };
    } else if (activeLang === 'mr') {
      return {
        replyText: `⚠️ **तातडीची वैद्यकीय मदत आवश्यक (EMERGENCY WARNING)**\n\nतुम्ही सांगितलेली लक्षणे (${redFlag.reason}) अत्यंत गंभीर असू शकतात.\n\n🚨 **तातडीने पुढील पावले उचला:**\n1. ताबडतोब **108 क्रमांकावर** संपर्क साधून रुग्णवाहिका बोलवा.\n2. रुग्णाला शांत ठेवा, हवेशीर जागी बसवा.\n3. स्वतःहून कोणतेही औषध देऊ नका. थेट जवळच्या ग्रामीण रुग्णालय किंवा जिल्हा रुग्णालयात जा.`,
        spokenText: 'सावधान! तुमची लक्षणे गंभीर असू शकतात. कृपया त्वरित 108 वर फोन करा किंवा जवळच्या सरकारी रुग्णालयात जा.',
        isRedFlag: true,
        redFlagReason: redFlag.reason,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['108 वर कॉल करा', 'जवळचे रुग्णालय शोधा'],
        quickResponses: ['रुग्णवाहिका बोलवा (108)', 'जवळचे रुग्णालय दाखवा'],
        isMedicineQuery: false,
        showFacilityRecommendation: true
      };
    } else {
      return {
        replyText: `⚠️ **URGENT MEDICAL ATTENTION REQUIRED**\n\nThe symptoms you described (${redFlag.reason}) indicate a potential medical emergency.\n\n🚨 **Immediate Action Plan:**\n1. Call **108 Emergency Helpline** immediately for an ambulance.\n2. Keep the person calm, seated comfortably in a well-ventilated space.\n3. Do not give unprescribed solid foods or medicines. Head directly to the nearest Community Health Centre (CHC) or District Hospital.`,
        spokenText: 'Warning. Your symptoms may require immediate medical attention. Please call 108 for an ambulance or visit the nearest hospital right away.',
        isRedFlag: true,
        redFlagReason: redFlag.reason,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['Call 108 Emergency', 'Find Nearest Hospital'],
        quickResponses: ['Call 108 Ambulance', 'Show Nearest Hospital'],
        isMedicineQuery: false,
        showFacilityRecommendation: true
      };
    }
  }

  // 2. Medicine Inquiry & Safety
  const isMedicineQuestion = /\b(medicine|dawa|davai|dawai|aushadh|tablet|paracetamol|combiflam|crocin|goli|dose|dosage|दवा|दवाई|औषध|औषधे|गोळी|ঔষধ|మందులు|மருந்து|દવા)\b/i.test(lower);
  if (isMedicineQuestion) {
    if (activeLang === 'hi') {
      return {
        replyText: `💊 **दवाइयों से संबंधित सुरक्षित सलाह:**\n\n* **SwasthyaNet** कानूनी व चिकित्सीय सुरक्षा के लिए सीधे दवा की पर्ची (prescription) या खुराक नहीं देता है।\n* सामान्य बुखार में ओआरएस (ORS) या पर्याप्त पानी पिएं और आराम करें।\n* गर्भवती महिलाएं, बच्चे या बीपी/शुगर के मरीज बिना डॉक्टर की सलाह के कोई भी पेनकिलर या एंटीबायोटिक न लें।\n* सही खुराक के लिए अपने गांव के **प्राथमिक स्वास्थ्य केंद्र (PHC)** या **आशा दीदी** से संपर्क करें।`,
        spokenText: 'दवाइयों की सही खुराक के लिए कृपया अपने नजदीकी प्राथमिक स्वास्थ्य केंद्र के डॉक्टर या आशा दीदी से परामर्श लें। खुद से एंटीबायोटिक या पेनकिलर न लें।',
        isRedFlag: false,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['डॉक्टर से परामर्श लें', 'नजदीकी PHC देखें'],
        quickResponses: ['मेरे लक्षण जांचें', 'नजदीकी स्वास्थ्य केंद्र खोजें'],
        isMedicineQuery: true,
        medicineSafetyNote: 'सुरक्षा सूचना: कोई भी दवा केवल अधिकृत डॉक्टर या स्वास्थ्य कार्यकर्ता की देखरेख में लें।',
        showFacilityRecommendation: true
      };
    } else if (activeLang === 'mr') {
      return {
        replyText: `💊 **औषध सुरक्षेबाबत आवश्यक माहिती:**\n\n* **SwasthyaNet** कोणत्याही औषधाचे प्रमाण किंवा प्रिस्क्रिप्शन परस्पर देत नाही.\n* ताप असल्यास भरपूर पाणी प्यावे, विश्रांती घ्यावी व ओआरएस (ORS) घ्यावे.\n* गरोदर माता, लहान मुले आणि वृद्ध व्यक्तींनी डॉक्टरांच्या सल्ल्याशिवाय पेनकिलर किंवा अँटीबायोटिक्स घेऊ नयेत.\n* योग्य उपचारांसाठी जवळच्या प्राथमिक आरोग्य केंद्रातील (PHC) डॉक्टरांशी संपर्क साधा.`,
        spokenText: 'औषधांच्या योग्य प्रमाणासाठी कृपया तुमच्या जवळच्या प्राथमिक आरोग्य केंद्रातील डॉक्टर किंवा आशा ताईंशी संपर्क साधा. स्वतःहून औषध घेऊ नका.',
        isRedFlag: false,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['डॉक्टरांचा सल्ला घ्या', 'जवळचे PHC पहा'],
        quickResponses: ['माझी लक्षणे तपासा', 'जवळचे आरोग्य केंद्र शोधा'],
        isMedicineQuery: true,
        medicineSafetyNote: 'औषधांचा योग्य वापर केवळ वैद्यकीय सल्ल्यानुसारच करावा.',
        showFacilityRecommendation: true
      };
    } else {
      return {
        replyText: `💊 **Medicine Safety & Educational Guidance:**\n\n* SwasthyaNet does not prescribe medications or specific dosages.\n* For mild fever or weakness, drink plenty of fluids (boiled water/ORS) and rest.\n* Pregnant women, children, and elderly patients must strictly avoid self-medicating with antibiotics or painkillers.\n* Please consult a qualified medical officer at your local Primary Health Centre (PHC).`,
        spokenText: 'For proper medicine prescriptions and safe dosages, please consult a qualified doctor or your local primary health centre.',
        isRedFlag: false,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['Consult Doctor', 'Find Nearby PHC'],
        quickResponses: ['Check My Symptoms', 'Find Nearby Clinic'],
        isMedicineQuery: true,
        medicineSafetyNote: 'Prescription medicines should only be taken under direct medical supervision.',
        showFacilityRecommendation: true
      };
    }
  }

  // 3. Facility Finder Question
  const isFacilityQuestion = /\b(hospital|clinic|phc|chc|hwc|doctor|aspatal|dawakhana|rujnalay|aarogya kendra|नजदीकी अस्पताल|आरोग्य केंद्र|दवाखाना|अस्पताल)\b/i.test(lower);
  if (isFacilityQuestion) {
    if (activeLang === 'hi') {
      return {
        replyText: `🏥 **आपके नजदीकी सरकारी स्वास्थ्य केंद्र:**\n\n* **आरोग्य मंदिर / HWC (रामपुर):** प्राथमिक जांच, बीपी/शुगर जांच और सामान्य दवाइयां (दूरी: ~1.2 किमी).\n* **प्राथमिक स्वास्थ्य केंद्र / PHC (सीतापुर):** ओपीडी, डॉक्टर परामर्श, सामान्य प्रसव व प्रयोगशाला जांच (दूरी: ~4.5 किमी).\n* **सामुदायिक स्वास्थ्य केंद्र / CHC:** 24x7 आपातकालीन सेवा, विशेषज्ञ डॉक्टर व एम्बुलेंस 108 सुविधा.\n\n👉 नीचे दिए गए मानचित्र में आप लाइव बेड उपलब्धता और दूरी देख सकते हैं।`,
        spokenText: 'आपके गांव के पास रामपुर आरोग्य मंदिर और सीतापुर प्राथमिक स्वास्थ्य केंद्र उपलब्ध हैं। अधिक जानकारी नीचे मानचित्र में देखें।',
        isRedFlag: false,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['PHC का समय क्या है?', '108 एम्बुलेंस बुलाएं'],
        quickResponses: ['नजदीकी अस्पताल दिखाएं', 'लक्षणों की जांच करें'],
        isMedicineQuery: false,
        showFacilityRecommendation: true
      };
    } else if (activeLang === 'mr') {
      return {
        replyText: `🏥 **तुमच्या जवळची शासकीय आरोग्य केंद्रे:**\n\n* **आरोग्य वर्धिनी केंद्र / HWC:** प्राथमिक तपासणी, रक्तदाब/मधुमेह चाचणी व औषधे (अंतर: ~१.२ किमी).\n* **प्राथमिक आरोग्य केंद्र / PHC:** वैद्यकीय अधिकारी, प्रयोगशाळा तपासणी व प्रसूती सेवा (अंतर: ~४.५ किमी).\n* **ग्रामीण रुग्णालय / CHC:** २४x७ आपत्कालीन विभाग व १०८ रुग्णवाहिका सुविधा.\n\n👉 खालील नकाशात तुम्ही थेट अंतर आणि खाटांची उपलब्धता पाहू शकता.`,
        spokenText: 'तुमच्या गावाजवळ प्राथमिक आरोग्य केंद्र आणि आरोग्य वर्धिनी केंद्र उपलब्ध आहेत. नकाशात संपूर्ण माहिती उपलब्ध आहे.',
        isRedFlag: false,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['आरोग्य केंद्राची वेळ काय आहे?', '१०८ वर कॉल करा'],
        quickResponses: ['नकाशा पहा', 'लक्षणे तपासा'],
        isMedicineQuery: false,
        showFacilityRecommendation: true
      };
    } else {
      return {
        replyText: `🏥 **Nearby Government Health Facilities:**\n\n* **Health & Wellness Centre (HWC):** Basic triage, BP/Sugar screening, first-aid & essential medicines (~1.2 km).\n* **Primary Health Centre (PHC):** Medical Officer OPD, diagnostics, maternal care (~4.5 km).\n* **Community Health Centre (CHC):** 24x7 emergency admissions, specialist doctors & 108 ambulance link.\n\n👉 Check the live facility directory and interactive map below.`,
        spokenText: 'Your nearest primary health centre and wellness clinics are available with live bed occupancy details shown below.',
        isRedFlag: false,
        possibleConditions: [],
        suggestedFollowUpQuestions: ['PHC Timings', 'Call 108 Ambulance'],
        quickResponses: ['Show Nearby Facilities', 'Screen My Symptoms'],
        isMedicineQuery: false,
        showFacilityRecommendation: true
      };
    }
  }

  // 4. Clinical Symptom Pattern Recognizers (Covers 15+ Distinct Categories)
  const isFever = /\b(fever|tap|bukhar|taap|garam|shivering|thandi|chills|ताप|बुखार|জ্বর|జ్వరం|காய்ச்சல்|તાવ|ಜ್ವರ|പനി)\b/i.test(lower);
  const isCoughCold = /\b(cough|cold|khansi|khokla|sardi|gala|sore throat|runny nose|congestion|phlegm|balgam|खोकला|सर्दी|खांसी|कफ|গলা ব্যথা|কাশি|దగ్గు|இருமல்|ખાંસી)\b/i.test(lower);
  const isHeadache = /\b(headache|sar dard|dokedukhi|sir dard|matha betha|thalanoppi|thalaivali|doke|migraine|सिर दर्द|डोकेदुखी|माथा|తలనొప్పి)\b/i.test(lower);
  const isStomach = /\b(stomach|pet|pot|vomit|vomiting|loose motion|dast|dast lagna|shouch|chul|nausea|gas|acidity|अपच|उल्टी|दस्त|पोटात|पेट दर्द|पोटदुखी|ବାନ୍ତି|కడుపునొప్పి)\b/i.test(lower);
  const isBodyPain = /\b(body pain|angdukhi|badan dard|thakan|weakness|thakva|tired|exhaustion|अंगदुखी|बदन दर्द|थकान|कमजोरी|অস্থিরতা)\b/i.test(lower);
  const isSkin = /\b(skin|rash|rashes|itching|khujli|khaj|daane|redness|fungal|allergy|त्वचा|दाने|खुजली|पुरळ|खाज|চর্ম|దద్దుర్లు)\b/i.test(lower);
  const isJointBack = /\b(joint|knee|ghutna|kamar|back pain|sandhi|sprain|moch|sujan|swelling|jodo me dard|घुटने|कमर दर्द|सांधेदुखी|मोच|सूजन|కీళ్ల నొప్పులు)\b/i.test(lower);
  const isEye = /\b(eye|aankh|dole|vision|aankho me jalan|red eye|watery eye|aankh lal|aankh aana|आंख|डोळे|लाल डोळे|कंजंक्टिवाइटिस)\b/i.test(lower);
  const isDentalEar = /\b(tooth|teeth|daanth|daat|ear|kaan|kan|daant dard|kaan dard|दांत|दात|कान दर्द|दंत)\b/i.test(lower);
  const isTraumaBurn = /\b(burn|jal gaya|cut|wound|chot|injury|jhaat|dog bite|kutte|snake|saanp|chot lagna|जख्म|घाव|जलना|कुत्ता|काटना|इंजरी)\b/i.test(lower);
  const isDizziness = /\b(dizziness|chakkar|faint|giddiness|dehydration|loo lagna|sun stroke|चक्कर|भोवळ|उन्हाचा त्रास|गश)\b/i.test(lower);
  const isChronic = /\b(diabetes|sugar|bp|blood pressure|hypertension|thyroid|sugar ki bimari|मधुमेह|शुगर|रक्तदाब|बीपी)\b/i.test(lower);
  const isMaternal = /\b(pregnant|pregnancy|garbhvati|delivery|maternity|period|mahasul|maasik dharm|गर्भवती|प्रसूती|मासिक पाळी)\b/i.test(lower);

  const conditions: PossibleCondition[] = [];
  let replyMarkdown = '';
  let spokenAudio = '';
  let followUps: string[] = [];
  let quickReplies: string[] = [];

  // -------------------------------------------------------------------------
  // CATEGORY A: FEVER & INFECTIONS
  // -------------------------------------------------------------------------
  if (isFever) {
    if (activeLang === 'mr') {
      conditions.push({
        id: 'mr_viral_fever',
        name: 'सामान्य व्हायरल ताप (Viral Fever)',
        explanation: 'हवामानातील बदलामुळे होणारा ताप व अंगदुखी, जो विश्रांती आणि भरपूर पाण्याने बरा होतो.',
        commonSymptoms: ['ताप', 'अंगदुखी', 'डोकेदुखी', 'अशक्तपणा'],
        whyRelevant: 'तुमच्या तापाच्या आणि अंगदुखीच्या लक्षणांशी थेट सुसंगत.',
        whenToSeeDoctor: 'ताप १०२°F पेक्षा जास्त असल्यास किंवा ३ दिवसांपेक्षा जास्त राहिल्यास PHC ला भेट द्या.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      if (isCoughCold) {
        conditions.push({
          id: 'mr_flu_respiratory',
          name: 'फ्लू सदृश आजार (Flu-like Upper Respiratory Infection)',
          explanation: 'श्वसनसंस्थेचा संसर्ग, ज्यामध्ये ताप, खोकला, सर्दी आणि घसा खवखवणे जाणवते.',
          commonSymptoms: ['ताप', 'खोकला', 'सर्दी', 'घसा दुखणे'],
          whyRelevant: 'ताप आणि खोकला एकत्र असल्यामुळे फ्लूची दाट शक्यता.',
          whenToSeeDoctor: 'श्वास घेण्यास त्रास किंवा छातीत घरघर झाल्यास त्वरित तपासणी करा.',
          severityLevel: 'moderate',
          suggestedCareFacility: 'PHC'
        });
      }
      conditions.push({
        id: 'mr_vector_borne',
        name: 'डेंग्यू / मलेरिया तपासणी (Vector-Borne Evaluation)',
        explanation: 'डासांच्या चाव्यामुळे होणारा ताप, ज्याची रक्त तपासणी करून खात्री करणे आवश्यक असते.',
        commonSymptoms: ['तीव्र ताप', 'डोळ्यांच्या मागे दुखणे', 'अंगावर बारीक दाणे', 'उलट्या'],
        whyRelevant: 'पावसाळ्यानंतर किंवा ग्रामीण भागात तापाचे कारण निश्चित करण्यासाठी.',
        whenToSeeDoctor: 'अशक्तपणा खूप वाढल्यास प्राथमिक आरोग्य केंद्रात रक्त तपासणी करा.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **आरोग्य सल्ला: ताप आणि अंगदुखी**\n\nतुमच्या लक्षणांवरून हे **व्हायरल ताप किंवा मौसमी संसर्ग** असण्याची शक्यता आहे.\n\n💧 **तातडीची घरगुती काळजी:**\n* उकळलेले कोमट पाणी, लिंबू पाणी किंवा ओआरएस (ORS) भरपूर प्या.\n* कपाळावर सामान्य पाण्याच्या पट्ट्या ठेवून ताप कमी करा.\n* हलका व पचणारा आहार (पेज, मऊ भात) घ्या आणि पूर्ण विश्रांती घ्या.\n* **सावधान:** ताप ३ दिवसांपेक्षा जास्त राहिल्यास रक्त तपासणीसाठी जवळच्या **प्राथमिक आरोग्य केंद्रात (PHC)** जा.`;
      spokenAudio = 'तुमच्या लक्षणांवरून हे सामान्य व्हायरल ताप असू शकते. भरपूर पाणी प्या, विश्रांती घ्या आणि कपाळावर पाण्याच्या पट्ट्या ठेवा. ताप तीन दिवसांपेक्षा जास्त राहिल्यास प्राथमिक आरोग्य केंद्रात डॉक्टरांना दाखवा.';
      followUps = ['ताप किती दिवस आहे?', 'थंडी वाजून येते का?', 'नजदीकी PHC कुठे आहे?'];
      quickReplies = ['कालपासून आहे', '३ दिवसांपेक्षा जास्त', 'खोकला पण आहे', 'जवळचे आरोग्य केंद्र'];
    } else if (activeLang === 'hi') {
      conditions.push({
        id: 'hi_viral_fever',
        name: 'सामान्य वायरल बुखार (Viral Fever)',
        explanation: 'मौसम में बदलाव या हल्के संक्रमण से होने वाला बुखार जो पर्याप्त आराम और तरल पदार्थों से ठीक होता है।',
        commonSymptoms: ['बुखार', 'बदन दर्द', 'कमजोरी', 'हल्का सिरदर्द'],
        whyRelevant: 'आपके बताए गए बुखार और शरीर दर्द से पूरी तरह मेल खाता है।',
        whenToSeeDoctor: 'यदि बुखार 102°F से अधिक हो या 3 दिन से ज्यादा चले, तो तुरंत डॉक्टर को दिखाएं।',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      if (isCoughCold) {
        conditions.push({
          id: 'hi_flu_uri',
          name: 'मौसमी फ्लू एवं श्वसन संक्रमण (Flu-like URI)',
          explanation: 'गले, नाक और फेफड़ों का मौसमी संक्रमण, जिसमें खांसी, जुकाम और बदन दर्द होता है।',
          commonSymptoms: ['खांसी', 'सर्दी', 'गले में खराश', 'बुखार'],
          whyRelevant: 'बुखार के साथ खांसी-जुकाम होने पर फ्लू की संभावना अधिक होती है।',
          whenToSeeDoctor: 'सांस लेने में तकलीफ या गहरा कफ होने पर चिकित्सीय जांच कराएं।',
          severityLevel: 'moderate',
          suggestedCareFacility: 'PHC'
        });
      }
      conditions.push({
        id: 'hi_dengue_malaria',
        name: 'मलेरिया / डेंगू जांच योग्य बुखार (Vector-Borne Evaluation)',
        explanation: 'मच्छर जनित बुखार जिसकी पुष्टि प्राथमिक स्वास्थ्य केंद्र में रक्त जांच (CBC/MP) से की जाती है।',
        commonSymptoms: ['तेज कंपकंपी', 'आंखों के पीछे दर्द', 'भूख न लगना', 'उल्टी'],
        whyRelevant: 'ग्रामीण क्षेत्रों में बुखार के सही कारण की पुष्टि के लिए जांच जरूरी है।',
        whenToSeeDoctor: 'प्लेटलेट्स या अत्यधिक कमजोरी की स्थिति में तुरंत PHC/CHC जाएं।',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **स्वास्थ्य सलाह: बुखार और बदन दर्द**\n\nआपके बताए गए लक्षणों से यह **सामान्य वायरल बुखार या मौसमी संक्रमण** हो सकता है।\n\n💧 **प्राथमिक देखभाल के उपाय:**\n* पर्याप्त मात्रा में उबला पानी, ओआरएस या नारियल पानी पिएं ताकि शरीर में पानी की कमी न हो।\n* माथे पर सामान्य ताजे पानी की पट्टियां रखकर बुखार कम करने में मदद करें।\n* हल्का व सुपाच्य भोजन (दलिया, खिचड़ी) लें और पूरा आराम करें।\n* **चेतावनी:** यदि बुखार 3 दिन से अधिक रहे या तेज चढ़े, तो रामपुर **प्राथमिक स्वास्थ्य केंद्र (PHC)** में खून की जांच कराएं।`;
      spokenAudio = 'आपके लक्षणों से यह सामान्य वायरल बुखार हो सकता है। पर्याप्त मात्रा में उबला पानी पिएं, आराम करें और माथे पर ताजे पानी की पट्टियां रखें। यदि बुखार तीन दिन से अधिक रहे तो प्राथमिक स्वास्थ्य केंद्र में जांच कराएं।';
      followUps = ['बुखार कितने दिन से है?', 'क्या कंपकंपी छूटती है?', 'नजदीकी PHC कहां है?'];
      quickReplies = ['1-2 दिन से है', '3 दिन से ज्यादा', 'खांसी भी है', 'नजदीकी स्वास्थ्य केंद्र'];
    } else {
      conditions.push({
        id: 'en_viral_fever',
        name: 'Acute Viral Syndrome / Seasonal Fever',
        explanation: 'Common seasonal viral infection causing elevated temperature and fatigue.',
        commonSymptoms: ['Fever', 'Body aches', 'Fatigue', 'Shivering'],
        whyRelevant: 'Directly reflects your reported fever and general discomfort.',
        whenToSeeDoctor: 'If fever exceeds 102°F or persists beyond 3 days, seek medical consultation.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      if (isCoughCold) {
        conditions.push({
          id: 'en_flu_uri',
          name: 'Upper Respiratory Tract Infection (Flu)',
          explanation: 'Viral infection of the upper airway presenting with cough, nasal congestion, and fever.',
          commonSymptoms: ['Cough', 'Cold', 'Sore throat', 'Fever'],
          whyRelevant: 'Cough combined with fever strongly suggests seasonal respiratory flu.',
          whenToSeeDoctor: 'Seek medical care if breathing difficulty or wheezing develops.',
          severityLevel: 'moderate',
          suggestedCareFacility: 'PHC'
        });
      }
      conditions.push({
        id: 'en_vector_borne',
        name: 'Vector-Borne Infection (Malaria/Dengue)',
        explanation: 'Mosquito-transmitted febrile illness needing blood test confirmation.',
        commonSymptoms: ['High fever with chills', 'Retro-orbital headache', 'Nausea'],
        whyRelevant: 'Important differential diagnosis for rural endemic fevers.',
        whenToSeeDoctor: 'Visit your PHC for rapid diagnostic blood tests if fever is severe.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **Clinical Assessment: Fever & Body Aches**\n\nBased on what you described, this is likely a **viral fever or seasonal infection**.\n\n💧 **Immediate Home Care & First Steps:**\n* Stay well hydrated by drinking boiled water, electrolytes (ORS), or clear soups.\n* Apply room-temperature damp cloth sponges on forehead to relieve high temperature.\n* Eat light, nutritious meals and get complete bed rest.\n* **Caution:** If fever continues beyond 3 days or reaches >102°F, visit your nearest **Primary Health Centre (PHC)** for a quick blood test.`;
      spokenAudio = 'I understand you are experiencing fever and body aches. Please stay hydrated with boiled water and ORS, take complete rest, and apply damp cloth compresses. If it lasts more than three days, please visit your nearest health centre.';
      followUps = ['How many days of fever?', 'Any chills or shivering?', 'Find nearest PHC'];
      quickReplies = ['1-2 days', 'More than 3 days', 'With cough & cold', 'Show Nearby PHC'];
    }
  }

  // -------------------------------------------------------------------------
  // CATEGORY B: STOMACH, DIARRHEA, VOMITING & ACIDITY
  // -------------------------------------------------------------------------
  else if (isStomach) {
    if (activeLang === 'mr') {
      conditions.push({
        id: 'mr_gastro',
        name: 'पोटाचा संसर्ग / गॅस्ट्रो (Acute Gastroenteritis)',
        explanation: 'अस्वच्छ पाणी किंवा अन्नामुळे पचनसंस्थेला झालेला संसर्ग, ज्यामध्ये जुलाब आणि उलट्या होतात.',
        commonSymptoms: ['पोटदुखी', 'उलट्या', 'पातळ शौच', 'अशक्तपणा'],
        whyRelevant: 'पोटदुखी आणि उलट्या/जुलाब या लक्षणांशी सुसंगत.',
        whenToSeeDoctor: 'लघवीचे प्रमाण कमी झाल्यास किंवा सतत उलट्या झाल्यास लगेच डॉक्टरांकडे जा.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });
      conditions.push({
        id: 'mr_gastritis',
        name: 'अॅसिडिटी व अपचन (Acute Gastritis / Indigestion)',
        explanation: 'पोटातील पित्त किंवा अपचनामुळे होणारी जळजळ आणि पोटात मुरडा.',
        commonSymptoms: ['छातीत/पोटात जळजळ', 'मळमळ', 'पोट फुगणे'],
        whyRelevant: 'मसालेदार अन्न किंवा जेवणाच्या अनियमित वेळेमुळे.',
        whenToSeeDoctor: 'वेदना असह्य झाल्यास डॉक्टरांचा सल्ला घ्या.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **आरोग्य सल्ला: पोटाचा त्रास आणि उलट्या/जुलाब**\n\nतुम्ही सांगितलेल्या लक्षणांवरून हे **पोटाचा संसर्ग (Gastroenteritis) किंवा अपचन** असण्याची शक्यता आहे.\n\n💧 **तातडीचे घरगुती उपाय:**\n* **ओआरएस (ORS) किंवा ताक, लिंबू पाणी:** शरीरातील पाण्याचे प्रमाण टिकवण्यासाठी प्रत्येक शौचानंतर १ कप ओआरएस पाणी हळूहळू प्या.\n* तेलकट, तिखट किंवा शिळे अन्न पूर्णपणे टाळा. मऊ भात, मुगाची डाळ किंवा केळी खा.\n* **धोक्याची घंटा:** लघवी थांबल्यास, शौचातून रक्त आल्यास किंवा सतत उलट्या होऊन पाणी टिकत नसल्यास तात्काळ **प्राथमिक आरोग्य केंद्रात (PHC)** जा.`;
      spokenAudio = 'पोटाचा त्रास आणि जुलाब असल्यास सर्वात महत्त्वाचे म्हणजे शरीरात पाणी टिकवून ठेवणे. ओआरएसचे पाणी वारंवार प्या, हलका आहार घ्या आणि उलट्या न थांबल्यास लगेच जवळच्या आरोग्य केंद्रात जा.';
      followUps = ['उलट्या किंवा जुलाब किती वेळा झाले?', 'लघवीचे प्रमाण सामान्य आहे का?'];
      quickReplies = ['२-३ वेळा झाले', 'पाणी टिकत नाही', 'ओआरएस कसे घ्यावे?', 'जवळचे रुग्णालय'];
    } else if (activeLang === 'hi') {
      conditions.push({
        id: 'hi_gastro',
        name: 'पेट का संक्रमण / गैस्ट्रोएंटेराइटिस (Acute Gastroenteritis)',
        explanation: 'दूषित पानी या भोजन से आंतों में होने वाला संक्रमण, जिसमें ओआरएस (ORS) घोल अत्यंत जरूरी है।',
        commonSymptoms: ['पेट में मरोड़', 'उल्टी', 'दस्त', 'शरीर में पानी की कमी'],
        whyRelevant: 'पेट दर्द, उल्टी या दस्त की समस्या से पूरी तरह मेल खाता है।',
        whenToSeeDoctor: 'यदि पेशाब बहुत कम आए, अत्यधिक चक्कर आएं या उल्टी न रुके तो तुरंत अस्पताल जाएं।',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });
      conditions.push({
        id: 'hi_gastritis',
        name: 'अम्लता एवं अपच (Gastritis & Indigestion)',
        explanation: 'पेट में गैस, एसिडिटी या भारी भोजन के कारण होने वाली जलन और भारीपन।',
        commonSymptoms: ['पेट में भारीपन', 'खट्टी डकारें', 'सीने में जलन', 'हल्की मतली'],
        whyRelevant: 'अपच या खाली पेट रहने से भी यह समस्या हो सकती है।',
        whenToSeeDoctor: 'यदि पेट दर्द असहनीय हो जाए तो चिकित्सीय सलाह लें।',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **स्वास्थ्य सलाह: पेट दर्द, उल्टी और दस्त**\n\nआपके बताए गए लक्षणों से यह **पेट का संक्रमण (Gastroenteritis) या अपच** हो सकता है।\n\n💧 **प्राथमिक देखभाल के उपाय:**\n* **ओआरएस (ORS) का घोल:** सबसे जरूरी है शरीर में पानी की कमी (Dehydration) न होने देना। हर बार दस्त या उल्टी के बाद 1 गिलास ओआरएस या उबला पानी घूंट-घूंट पिएं।\n* तला-भुना, मिर्च-मसालेदार खाना बिल्कुल न खाएं। केवल खिचड़ी, दही-चावल, केला या उबले आलू लें।\n* **खतरे के लक्षण:** यदि पेशाब आना बंद हो जाए, मुंह सूखने लगे, या दस्त में खून दिखे तो तुरंत **प्राथमिक स्वास्थ्य केंद्र (PHC)** जाएं।`;
      spokenAudio = 'पेट खराब होने पर सबसे महत्वपूर्ण है ओआरएस का घोल पीना ताकि शरीर में पानी की कमी न हो। हल्का भोजन जैसे खिचड़ी लें। यदि लगातार उल्टी हो रही हो तो तुरंत प्राथमिक स्वास्थ्य केंद्र जाएं।';
      followUps = ['उल्टी या दस्त कितनी बार हुए?', 'क्या पेट में तेज मरोड़ है?'];
      quickReplies = ['2-3 बार हुआ', 'पानी नहीं पच रहा', 'ORS की विधि बताएं', 'नजदीकी PHC'];
    } else {
      conditions.push({
        id: 'en_gastro',
        name: 'Acute Gastroenteritis / Stomach Infection',
        explanation: 'Infection of the gastrointestinal tract commonly linked to water or food contamination.',
        commonSymptoms: ['Stomach cramps', 'Diarrhea', 'Nausea/Vomiting', 'Dehydration'],
        whyRelevant: 'Directly corresponds to reported abdominal pain and gastrointestinal upset.',
        whenToSeeDoctor: 'Seek emergency clinic care if unable to retain fluids or signs of severe dehydration appear.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });
      conditions.push({
        id: 'en_gastritis',
        name: 'Acute Gastritis / Acid Dyspepsia',
        explanation: 'Stomach lining irritation causing burning pain, bloating, and nausea.',
        commonSymptoms: ['Epigastric burning', 'Bloating', 'Acid reflux', 'Nausea'],
        whyRelevant: 'Common with irregular meals, stress, or spicy food intake.',
        whenToSeeDoctor: 'Consult a healthcare officer if pain is unrelenting.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **Clinical Guidance: Stomach Discomfort & Digestion**\n\nBased on your symptoms, this is indicative of **Acute Gastroenteritis (stomach bug) or Gastric Irritation**.\n\n💧 **Crucial Home Care Steps:**\n* **Oral Rehydration Salts (ORS):** Preventing dehydration is top priority. Sip ORS or boiled water with a pinch of salt & sugar after every loose motion or vomiting episode.\n* Eat light, bland foods (khichdi, bananas, boiled rice). Avoid dairy, fried, or spicy items.\n* **Warning Signs:** If you experience dry mouth, inability to pass urine, extreme dizziness, or blood in stool, visit your nearest **Primary Health Centre (PHC)** immediately.`;
      spokenAudio = 'For stomach issues and diarrhea, the most critical step is staying hydrated with ORS solution. Eat light bland foods like boiled rice and avoid spicy food. If vomiting persists, please visit the nearest health centre.';
      followUps = ['How many loose motions today?', 'Can you keep fluids down?'];
      quickReplies = ['2-3 times today', 'Cannot keep water down', 'How to make ORS', 'Show Nearby PHC'];
    }
  }

  // -------------------------------------------------------------------------
  // CATEGORY C: HEADACHE & NEUROLOGICAL
  // -------------------------------------------------------------------------
  else if (isHeadache) {
    if (activeLang === 'mr') {
      conditions.push({
        id: 'mr_tension_headache',
        name: 'ताणतणावजन्य डोकेदुखी (Tension Headache / Fatigue)',
        explanation: 'उन्हाचा त्रास, अपुरी झोप किंवा मानसिक ताणामुळे दोन्ही बाजूने डोके जड होणे.',
        commonSymptoms: ['डोक्यात जडपणा', 'कपाळावर दाब', 'मानेत ताण'],
        whyRelevant: 'थकवा आणि डोकेदुखीच्या लक्षणांशी सुसंगत.',
        whenToSeeDoctor: 'जर डोकेदुखी अचानक अतिशय तीव्र झाली तर तात्काळ तपासणी करा.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'mr_migraine',
        name: 'मायग्रेन / अर्धशिशी (Migraine)',
        explanation: 'एका बाजूला होणारी तीव्र ठसठस, सोबत प्रकाश किंवा आवाजाचा त्रास आणि मळमळ.',
        commonSymptoms: ['एका बाजूला डोकेदुखी', 'उजेडाचा त्रास', 'मळमळ'],
        whyRelevant: 'डोक्यात ठसठस आणि उलट्यासारखे वाटत असल्यास.',
        whenToSeeDoctor: 'वारंवार त्रास होत असल्यास डॉक्टरांकडून उपचार घ्या.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **आरोग्य सल्ला: डोकेदुखी आणि थकवा**\n\nतुमच्या लक्षणांवरून हे **ताणतणावजन्य डोकेदुखी (Tension Headache), उन्हाचा त्रास किंवा मायग्रेन** असण्याची शक्यता आहे.\n\n💧 **काळजीचे उपाय:**\n* शांत आणि अंधाऱ्या खोलीत डोळे मिटून विश्रांती घ्या.\n* भरपूर पाणी प्या (कधीकधी शरीरात पाणी कमी पडल्यामुळे डोकेदुखी होते).\n* कपाळावर किंवा मानेवर थंड पाण्याची पट्टी ठेवा.\n* **धोक्याची लक्षणे:** जर डोकेदुखी अचानक असह्य झाली, चक्कर येऊन तोल गेला, किंवा दृष्टी अंधुक झाली, तर तातडीने **रुग्णालयात** जा.`;
      spokenAudio = 'डोकेदुखी असल्यास शांत खोलीत विश्रांती घ्या, भरपूर पाणी प्या आणि कपाळावर थंड पाण्याची घडी ठेवा. जर डोकेदुखी अचानक खूप तीव्र झाली तर त्वरित डॉक्टरांना दाखवा.';
      followUps = ['डोके एका बाजूला दुखते की दोन्ही?', 'उजेडाचा त्रास होतो का?'];
      quickReplies = ['संपूर्ण डोके जड आहे', 'एका बाजूला ठसठस आहे', 'उन्हामुळे त्रास झाला'];
    } else if (activeLang === 'hi') {
      conditions.push({
        id: 'hi_tension_headache',
        name: 'तनाव व थकान जनित सिरदर्द (Tension Headache)',
        explanation: 'धूप में रहने, कम नींद या थकान की वजह से सिर में भारीपन और खिंचाव होना।',
        commonSymptoms: ['माथे पर दबाव', 'सिर में भारीपन', 'गर्दन में जकड़न'],
        whyRelevant: 'थकान और सामान्य सिरदर्द से पूरी तरह मेल खाता है।',
        whenToSeeDoctor: 'यदि सिरदर्द लगातार कई दिनों तक रहे तो डॉक्टर को दिखाएं।',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'hi_migraine',
        name: 'माइग्रेन / अधकपारी (Migraine)',
        explanation: 'सिर के एक हिस्से में तेज धड़कने वाला दर्द, जिसके साथ रोशनी और आवाज से परेशानी होती है।',
        commonSymptoms: ['एक तरफा तेज दर्द', 'रोशनी से चिढ़', 'जी मिचलाना'],
        whyRelevant: 'यदि सिर के एक तरफ तेज टीस उठ रही हो।',
        whenToSeeDoctor: 'बार-बार होने पर प्राथमिक स्वास्थ्य केंद्र से उचित दवा लें।',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **स्वास्थ्य सलाह: सिरदर्द और भारीपन**\n\nआपके बताए गए लक्षणों से यह **थकान जनित सिरदर्द (Tension Headache), धूप का असर या माइग्रेन** हो सकता है।\n\n💧 **प्राथमिक देखभाल के उपाय:**\n* शांत और हवादार कमरे में लेटकर आराम करें और पर्याप्त पानी पिएं।\n* माथे और गर्दन के पीछे ठंडे पानी की पट्टी रखने से आराम मिलता है।\n* चाय-कॉफी का अत्यधिक सेवन न करें और समय पर भोजन लें।\n* **खतरे के लक्षण:** यदि सिरदर्द अचानक बिजली जैसा तेज हो, चक्कर आकर बेहोशी लगे या उल्टी आए, तो तुरंत **अस्पताल** जाएं।`;
      spokenAudio = 'सिरदर्द होने पर शांत कमरे में आराम करें, भरपूर पानी पिएं और माथे पर ठंडे पानी की पट्टी रखें। यदि दर्द अचानक बहुत तेज हो जाए या चक्कर आएं तो तुरंत डॉक्टर को दिखाएं।';
      followUps = ['क्या सिर के एक हिस्से में दर्द है?', 'क्या जी मिचला रहा है?'];
      quickReplies = ['पूरे सिर में भारीपन है', 'एक तरफ तेज दर्द है', 'धूप में जाने से हुआ'];
    } else {
      conditions.push({
        id: 'en_tension_headache',
        name: 'Tension-Type Headache / Dehydration',
        explanation: 'Dull, aching head pain and tightness caused by fatigue, heat, or mild dehydration.',
        commonSymptoms: ['Band-like pressure around forehead', 'Neck tightness', 'Fatigue'],
        whyRelevant: 'Matches reported headache and generalized tiredness.',
        whenToSeeDoctor: 'Seek medical care if headache is recurrent or accompanied by vision changes.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'en_migraine',
        name: 'Migraine Headache',
        explanation: 'Throbbing, pulsing headache usually on one side of head, often with light sensitivity.',
        commonSymptoms: ['One-sided throbbing', 'Sensitivity to light/sound', 'Nausea'],
        whyRelevant: 'Likely if headache pulses or is accompanied by nausea.',
        whenToSeeDoctor: 'Visit clinic if episodes are severe or unresponsive to rest.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **Clinical Assessment: Headache & Fatigue**\n\nYour symptoms suggest a **Tension Headache, Dehydration-induced headache, or Migraine episode**.\n\n💧 **Immediate Supportive Care:**\n* Rest in a quiet, dimly lit room and close your eyes.\n* Drink 2-3 glasses of clean water (headaches are frequently triggered by mild dehydration).\n* Apply a cold damp cloth or ice pack wrapped in a towel over forehead and temples.\n* **Warning Signs:** If this is the "worst headache of your life", comes on like a thunderclap, or causes stiff neck/confusion, seek emergency care immediately.`;
      spokenAudio = 'For your headache, please rest in a quiet dark room, drink plenty of water, and place a cool damp cloth on your forehead. If the headache is sudden and exceptionally severe, visit a hospital immediately.';
      followUps = ['Is the pain on one side or all over?', 'Any sensitivity to bright light?'];
      quickReplies = ['All over forehead', 'One-sided throbbing', 'After being in sun'];
    }
  }

  // -------------------------------------------------------------------------
  // CATEGORY D: SKIN RASHES, ALLERGIES & ITCHING
  // -------------------------------------------------------------------------
  else if (isSkin) {
    if (activeLang === 'mr') {
      conditions.push({
        id: 'mr_dermatitis',
        name: 'त्वचा ॲलर्जी / पुरळ (Contact Dermatitis / Urticaria)',
        explanation: 'धूळ, वनस्पती किंवा साबणामुळे त्वचेवर होणारी खाज आणि लाल पुरळ.',
        commonSymptoms: ['लाल पुरळ', 'खाज', 'जळजळ'],
        whyRelevant: 'त्वचेवरील खाज आणि लाल डागांशी सुसंगत.',
        whenToSeeDoctor: 'पुरळ संपूर्ण अंगावर पसरल्यास डॉक्टरांना दाखवा.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'mr_fungal',
        name: 'बुरशीजन्य संसर्ग / गजकर्ण (Fungal Infection)',
        explanation: 'घामामुळे किंवा ओलेपणामुळे त्वचेच्या घड्यांमध्ये होणारा संसर्ग.',
        commonSymptoms: ['गोल लाल डाग', 'कडांना तीव्र खाज'],
        whyRelevant: 'ग्रामीण भागात आणि दमट हवामानात आढळणारा सामान्य संसर्ग.',
        whenToSeeDoctor: 'PHC मधील डॉक्टरांकडून मलम व औषधे घ्या.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **आरोग्य सल्ला: त्वचेची खाज आणि लाल पुरळ**\n\nतुमच्या लक्षणांवरून हे **त्वचेची ॲलर्जी (Allergic Rash) किंवा बुरशीजन्य संसर्ग (Fungal Infection)** असण्याची शक्यता आहे.\n\n💧 **काळजीचे उपाय:**\n* खाजवणे टाळा, कारण नखांमुळे संसर्ग पसरू शकतो.\n* ती जागा स्वच्छ थंड पाण्याने धुऊन कोरडी ठेवा. सैल आणि सुती कपडे वापरा.\n* तीव्र साबण किंवा घरगुती केमिकल्स लावू नका.\n* **आरोग्य केंद्र भेट:** योग्य मलम आणि तपासणीसाठी तुमच्या गावातील **आरोग्य वर्धिनी केंद्रातील (HWC) सीएचओ** किंवा **प्राथमिक आरोग्य केंद्रातील (PHC)** डॉक्टरांना दाखवा.`;
      spokenAudio = 'त्वचेवर खाज आणि पुरळ असल्यास नखांनी खाजवू नका. जागा स्वच्छ पाण्याने धुवून कोरडी ठेवा आणि सुती कपडे वापरा. योग्य मलमासाठी जवळच्या आरोग्य केंद्रात दाखवा.';
      followUps = ['खाज किती दिवसांपासून आहे?', 'अंगावर कुठे कुठे पसरले आहे?'];
      quickReplies = ['१-२ दिवस झाले', 'अंगावर पसरत आहे', 'पावसामुळे झाले'];
    } else if (activeLang === 'hi') {
      conditions.push({
        id: 'hi_dermatitis',
        name: 'त्वचा की एलर्जी / पित्ती (Allergic Dermatitis / Urticaria)',
        explanation: 'धूल, साबण या किसी चीज के संपर्क में आने से त्वचा पर लाल चकत्ते और खुजली होना।',
        commonSymptoms: ['लाल दाने', 'खुजली', 'हल्की सूजन'],
        whyRelevant: 'आपकी बताई गई खुजली और दानों से मेल खाता है।',
        whenToSeeDoctor: 'यदि खुजली पूरे शरीर पर फैले या चेहरे पर सूजन आए तो तुरंत दिखाएं।',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'hi_fungal',
        name: 'फंगल इन्फेक्शन / दाद (Fungal Skin Infection)',
        explanation: 'पसीने और नमी के कारण होने वाला संक्रमण जिसमें गोल घेरेदार खुजली होती है।',
        commonSymptoms: ['गोल लाल चकत्ते', 'तेज खुजली', 'त्वचा का छिलना'],
        whyRelevant: 'ग्रामीण व उमस भरे मौसम में दाद की समस्या काफी आम है।',
        whenToSeeDoctor: 'सही एंटीफंगल क्रीम के लिए प्राथमिक स्वास्थ्य केंद्र पर दिखाएं।',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **स्वास्थ्य सलाह: त्वचा की खुजली और लाल दाने**\n\nआपके बताए गए लक्षणों से यह **त्वचा की एलर्जी (Allergic Dermatitis) या फंगल संक्रमण (दाद)** हो सकता है।\n\n💧 **प्राथमिक देखभाल के उपाय:**\n* नाखूनों से बिल्कुल न खुरचें, इससे इन्फेक्शन फैलने और घाव बनने का खतरा रहता है।\n* प्रभावित हिस्से को साफ ताजे पानी से धोकर साफ सूती कपड़े से सुखाएं। ढीले सूती कपड़े पहनें।\n* बिना डॉक्टर की सलाह के कोई भी तेज स्टेरॉयड क्रीम न लगाएं।\n* **स्वास्थ्य केंद्र परामर्श:** सही दवा और लोशन के लिए अपने गांव के **आरोग्य मंदिर (HWC)** या **PHC** में जांच कराएं।`;
      spokenAudio = 'त्वचा पर खुजली और दाने होने पर नाखूनों से न खुजलाएं। साफ पानी से धोकर सूखा रखें और ढीले सूती कपड़े पहनें। सही दवा के लिए अपने नजदीकी स्वास्थ्य केंद्र पर दिखाएं।';
      followUps = ['खुजली कितने दिनों से है?', 'क्या यह शरीर पर फैल रही है?'];
      quickReplies = ['1-2 दिन से है', 'दाने गोल घेरे में हैं', 'नजदीकी HWC कहां है?'];
    } else {
      conditions.push({
        id: 'en_dermatitis',
        name: 'Allergic Contact Dermatitis / Urticaria',
        explanation: 'Hypersensitivity reaction causing localized red hives and severe itching.',
        commonSymptoms: ['Red itchy bumps', 'Swelling', 'Dry patch'],
        whyRelevant: 'Directly reflects your skin rash and irritation symptoms.',
        whenToSeeDoctor: 'Seek care if rash spreads rapidly or involves lips/face.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'en_fungal',
        name: 'Cutaneous Fungal Infection (Tinea)',
        explanation: 'Fungal skin overgrowth common in humid conditions with circular itching borders.',
        commonSymptoms: ['Ring-shaped red patches', 'Flaking', 'Intense itching'],
        whyRelevant: 'Very frequent in warm, active rural environments.',
        whenToSeeDoctor: 'Consult clinic for appropriate topical antifungal cream.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **Clinical Guidance: Skin Rashes & Itching**\n\nYour symptoms indicate an **Allergic Dermatitis reaction or Superficial Fungal Infection (Ringworm)**.\n\n💧 **Home Care & Precautions:**\n* Avoid scratching with fingernails to prevent secondary bacterial skin infections.\n* Wash gently with cool, clean water and pat dry with a clean cloth. Wear loose cotton clothes.\n* Do not apply harsh steroids or unverified chemical pastes.\n* **Clinic Visit:** Visit your nearest **Health & Wellness Centre (HWC)** or **PHC** for a soothing topical lotion.`;
      spokenAudio = 'For skin rashes and itching, please do not scratch. Keep the area clean and dry with loose cotton clothing, and visit your local health centre for the appropriate soothing cream.';
      followUps = ['How long have you had the rash?', 'Is it spreading across the body?'];
      quickReplies = ['1-2 days', 'Ring shaped patches', 'Show Nearby Clinic'];
    }
  }

  // -------------------------------------------------------------------------
  // CATEGORY E: JOINT, BACK, SPRAIN & MUSCULOSKELETAL PAIN
  // -------------------------------------------------------------------------
  else if (isJointBack) {
    if (activeLang === 'mr') {
      conditions.push({
        id: 'mr_sprain_strain',
        name: 'स्नायूंची दुखापत / लचक (Muscle Strain / Acute Sprain)',
        explanation: 'जड काम, वाकणे किंवा पाय मुरगळल्यामुळे स्नायूंना झालेली दुखापत व सूज.',
        commonSymptoms: ['सांध्यात वेदना', 'हालचाली करताना त्रास', 'हळुवार सूज'],
        whyRelevant: 'सांधेदुखी आणि लचक भरण्याच्या तक्रारींशी सुसंगत.',
        whenToSeeDoctor: 'पाय जमिनीवर टेकवता येत नसेल तर एक्स-रे साठी CHC ला जा.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'mr_arthritis',
        name: 'सांधेदुखी / संधिवात (Osteoarthritis / Arthralgia)',
        explanation: 'वयपरत्वे किंवा जुन्या त्रासामुळे गुडघ्यात किंवा कंबरेत होणारी दुखणी.',
        commonSymptoms: ['सकाळी सांधे ताठरणे', 'गुडघे दुखणे', 'कट-कट आवाज'],
        whyRelevant: 'गुडघे आणि कंबर दुखण्याच्या तक्रारींमध्ये आढळणारा सामान्य त्रास.',
        whenToSeeDoctor: 'प्राथमिक आरोग्य केंद्रातील डॉक्टरांचा सल्ला घ्या.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **आरोग्य सल्ला: सांधेदुखी, कंबरदुखी आणि लचक (Sprain)**\n\nतुमच्या लक्षणांवरून हे **स्नायूंची दुखापत (Muscle Strain), लचक किंवा सांधेदुखी** असण्याची शक्यता आहे.\n\n💧 **तातडीचे प्रथमोपचार:**\n* **विश्रांती:** दुखणाऱ्या सांध्याला आराम द्या आणि जड वजन उचलणे टाळा.\n* **थंड शेक (पहिल्या २४ तासांत):** सूज असल्यास कापडात बर्फ किंवा थंड पाण्याची पिशवी १०-१५ मिनिटे लावा.\n* गरम तेलाने जोरात चोळू नका, यामुळे सूज वाढू शकते.\n* **धोक्याची घंटा:** पाय टेकवता येत नसल्यास किंवा फ्रॅक्चरची शंका असल्यास **ग्रामीण रुग्णालयात (CHC)** एक्स-रे करून घ्या.`;
      spokenAudio = 'सांधेदुखी किंवा लचक भरली असल्यास सांध्याला विश्रांती द्या, जोरात मालिश करू नका आणि सूज असल्यास बर्फाचा थंड शेक द्या. त्रास जास्त असल्यास आरोग्य केंद्रात डॉक्टरांना दाखवा.';
      followUps = ['पाय मुरगळला का?', 'सूज आली आहे का?'];
      quickReplies = ['पाय मुरगळला आहे', 'गुडघ्यात खूप दुखत आहे', 'कंबरदुखी आहे'];
    } else if (activeLang === 'hi') {
      conditions.push({
        id: 'hi_sprain_strain',
        name: 'मांसपेशियों का खिंचाव / मोच (Acute Sprain / Strain)',
        explanation: 'भारी वजन उठाने, पैर मुड़ने या गलत तरीके से बैठने से मांसपेशियों में खिंचाव व सूजन।',
        commonSymptoms: ['हिलने-डुलने में दर्द', 'जोड़ों में सूजन', 'छूने पर दर्द'],
        whyRelevant: 'आपके बताए गए दर्द और मोच के लक्षणों से पूरी तरह मेल खाता है।',
        whenToSeeDoctor: 'यदि पैर पर खड़ा न हुआ जा सके या हड्डी में तेज दर्द हो तो एक्स-रे कराएं।',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'hi_arthritis',
        name: 'गठिया / जोड़ों का दर्द (Arthritis / Joint Pain)',
        explanation: 'उम्र या काम की अधिकता के कारण घुटनों व कमर के जोड़ों में होने वाला पुराना दर्द।',
        commonSymptoms: ['सुबह जोड़ों में जकड़न', 'घुटनों में दर्द', 'चलने में तकलीफ'],
        whyRelevant: 'घुटनों व कमर दर्द की समस्या में बहुत आम है।',
        whenToSeeDoctor: 'उचित व्यायाम व फिजियोथेरेपी सलाह के लिए PHC जाएं।',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **स्वास्थ्य सलाह: जोड़ों का दर्द, कमर दर्द और मोच (Sprain)**\n\nआपके बताए गए लक्षणों से यह **मांसपेशियों का खिंचाव (Muscle Strain), मोच या जोड़ों का दर्द** हो सकता है।\n\n💧 **प्राथमिक देखभाल के नियम:**\n* **आराम (Rest):** दर्द वाले जोड़ को पूरा आराम दें, भारी सामान उठाने या झुकने से बचें।\n* **ठंडी सिकाई:** यदि हाल ही में चोट लगी है या सूजन है, तो कपड़े में बर्फ लपेटकर 10-15 मिनट लगाएं।\n* तेज मालिश करने से बचें, क्योंकि इससे अंदरूनी सूजन बढ़ सकती है।\n* **अस्पताल जांच:** यदि पैर पर वजन न दिया जा रहा हो या फ्रैक्चर का संदेह हो, तो **CHC / जिला अस्पताल** में एक्स-रे कराएं।`;
      spokenAudio = 'जोड़ों में दर्द या मोच होने पर उस अंग को आराम दें, जोर से मालिश न करें और सूजन पर ठंडी सिकाई करें। यदि पैर जमीन पर नहीं रखा जा रहा हो तो एक्स-रे के लिए अस्पताल जाएं।';
      followUps = ['क्या पैर मुड़ा या झटका लगा?', 'क्या सूजन आ गई है?'];
      quickReplies = ['पैर में मोच आई है', 'घुटने में दर्द है', 'कमर में तेज दर्द है'];
    } else {
      conditions.push({
        id: 'en_sprain_strain',
        name: 'Acute Musculoskeletal Sprain / Strain',
        explanation: 'Ligament stretch or muscle fiber micro-tear from twisting, lifting, or sudden strain.',
        commonSymptoms: ['Localized pain on motion', 'Mild swelling', 'Tenderness'],
        whyRelevant: 'Matches reported joint tenderness and physical discomfort.',
        whenToSeeDoctor: 'Get an X-ray at the Community Health Centre if unable to bear weight.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });
      conditions.push({
        id: 'en_osteoarthritis',
        name: 'Joint Degeneration / Osteoarthritis',
        explanation: 'Chronic cartilage wear causing knee, hip, or lower back stiffness and aching.',
        commonSymptoms: ['Morning stiffness', 'Knee crepitus', 'Aching after walking'],
        whyRelevant: 'Common in active rural work environments.',
        whenToSeeDoctor: 'Consult Medical Officer for physiotherapy exercises and joint protection.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      });

      replyMarkdown = `🩺 **Clinical Assessment: Joint Pain, Backache & Sprains**\n\nYour symptoms are consistent with an **Acute Muscle Strain / Joint Sprain or Arthralgia**.\n\n💧 **R.I.C.E. First-Aid Protocol:**\n* **Rest:** Avoid putting heavy load or straining the injured joint.\n* **Ice/Cold pack:** Apply cold damp cloth or wrapped ice for 10-15 minutes to reduce inflammation.\n* Avoid vigorous hot massage immediately after an acute injury as it increases swelling.\n* **Medical Attention:** If you cannot put weight on the limb or suspect a bone fracture, visit the **Community Health Centre (CHC)** for an X-ray.`;
      spokenAudio = 'For joint sprains or muscle strains, rest the limb, avoid aggressive massage, and apply a cool ice pack to soothe swelling. If you cannot bear weight, please visit your local clinic for an X-ray.';
      followUps = ['Did you twist or slip?', 'Is there visible swelling?'];
      quickReplies = ['Twisted ankle/knee', 'Severe back pain', 'Show Nearby Clinic'];
    }
  }

  // -------------------------------------------------------------------------
  // CATEGORY F: GENERAL / OTHER DISTINCT CONDITIONS
  // -------------------------------------------------------------------------
  else {
    if (activeLang === 'mr') {
      conditions.push({
        id: 'mr_general_eval',
        name: 'प्राथमिक आरोग्य मूल्यांकन (Clinical Evaluation)',
        explanation: 'तुमच्या लक्षणांवरून प्राथमिक तपासणी आणि विश्रांतीची गरज दिसून येते.',
        commonSymptoms: ['थकवा', 'अस्वस्थता', 'अंगदुखी'],
        whyRelevant: 'तुम्ही सांगितलेल्या लक्षणांवर आधारित प्राथमिक वैद्यकीय मार्गदर्शन.',
        whenToSeeDoctor: '२-३ दिवसांत फरक न पडल्यास आरोग्य केंद्रात जा.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **आरोग्य सल्ला व मार्गदर्शन:**\n\nतुम्ही सांगितलेली लक्षणे मी समजून घेतली आहेत.\n\n💧 **प्राथमिक काळजी व पुढील पावले:**\n* भरपूर उकळलेले कोमट पाणी प्या आणि पुरेशी विश्रांती घ्या.\n* वेळेवर हलका व पोषक आहार घ्या.\n* **तपासणी:** अधिक स्पष्ट निदानासाठी तुमच्या गावातील **आशा ताई** किंवा **प्राथमिक आरोग्य केंद्रातील (PHC)** डॉक्टरांचा सल्ला घ्या.`;
      spokenAudio = 'मी तुमची लक्षणे समजून घेतली आहेत. पुरेसे पाणी प्या, विश्रांती घ्या आणि योग्य तपासणीसाठी तुमच्या गावातील आरोग्य केंद्रातील डॉक्टरांशी संपर्क साधा.';
      followUps = ['हा त्रास कधीपासून आहे?', 'सोबत इतर काही लक्षणे आहेत का?'];
      quickReplies = ['कालपासून आहे', '२-३ दिवस झाले', 'औषध माहिती हवी', 'जवळचे रुग्णालय'];
    } else if (activeLang === 'hi') {
      conditions.push({
        id: 'hi_general_eval',
        name: 'प्राथमिक स्वास्थ्य मूल्यांकन (General Health Assessment)',
        explanation: 'आपकी बताई गई स्थिति के आधार पर सही देखभाल और आराम आवश्यक है।',
        commonSymptoms: ['कमजोरी', 'अस्वस्थता', 'हल्का दर्द'],
        whyRelevant: 'आपके बताए गए लक्षणों के अनुसार प्रारंभिक स्वास्थ्य जानकारी।',
        whenToSeeDoctor: 'लक्षणों में सुधार न होने पर नजदीकी प्राथमिक स्वास्थ्य केंद्र पर दिखाएं।',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **स्वास्थ्य सलाह एवं मार्गदर्शन:**\n\nमैंने आपकी बताई गई समस्या को समझ लिया है।\n\n💧 **प्राथमिक देखभाल के सुझाव:**\n* पर्याप्त मात्रा में स्वच्छ उबला पानी पिएं और शरीर को पूरा आराम दें।\n* पौष्टिक और सुपाच्य भोजन समय पर लें।\n* **चिकित्सीय परामर्श:** सटीक जांच और मार्गदर्शन के लिए अपने गांव के **आरोग्य मंदिर (HWC)** या **प्राथमिक स्वास्थ्य केंद्र (PHC)** में डॉक्टर को दिखाएं।`;
      spokenAudio = 'मैंने आपकी समस्या समझ ली है। पर्याप्त पानी पिएं, आराम करें और सही जांच के लिए नजदीकी प्राथमिक स्वास्थ्य केंद्र में डॉक्टर से मिलें।';
      followUps = ['यह परेशानी कितने समय से है?', 'क्या साथ में कोई अन्य लक्षण भी है?'];
      quickReplies = ['1-2 दिन से है', '3 दिन से ज्यादा', 'दवाइयों की जानकारी', 'नजदीकी अस्पताल'];
    } else {
      conditions.push({
        id: 'en_general_eval',
        name: 'General Health Assessment',
        explanation: 'Preliminary clinical guidance based on the health symptoms you shared.',
        commonSymptoms: ['Fatigue', 'Discomfort'],
        whyRelevant: 'Personalized evaluation based on your symptom description.',
        whenToSeeDoctor: 'Consult your local primary health centre if symptoms persist.',
        severityLevel: 'low',
        suggestedCareFacility: 'HWC'
      });

      replyMarkdown = `🩺 **Health Guidance & Care Assessment:**\n\nI have evaluated the symptoms you described.\n\n💧 **Recommended Next Steps:**\n* Drink plenty of clean fluids and allow your body adequate rest.\n* Eat light, balanced meals and avoid strenuous exertion.\n* **Clinical Evaluation:** For a complete physical exam and tailored advice, please visit your local **Primary Health Centre (PHC)** or **Community Health Worker**.`;
      spokenAudio = 'I have noted your symptoms. Please drink plenty of fluids, rest well, and visit your local health centre for a personalized clinical checkup.';
      followUps = ['How long have you had this?', 'Any other symptoms present?'];
      quickReplies = ['Since 1-2 days', 'More than 3 days', 'Find Nearby Clinic', 'Check Another Symptom'];
    }
  }

  return {
    replyText: replyMarkdown,
    spokenText: spokenAudio,
    isRedFlag: false,
    possibleConditions: conditions,
    suggestedFollowUpQuestions: followUps,
    quickResponses: quickReplies,
    isMedicineQuery: false,
    showFacilityRecommendation: true
  };
}

// ---------------------------------------------------------------------------
// 5. Preset Interactive Demo Scenarios
// ---------------------------------------------------------------------------

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo_hi_fever',
    title: 'Hindi: बुखार और बदन दर्द (Fever & Body Ache)',
    languageCode: 'hi',
    languageName: 'हिन्दी (Hindi)',
    userPrompt: 'मुझे दो दिन से तेज बुखार है और पूरे शरीर में बहुत दर्द हो रहा है।',
    assistantReplies: [
      'नमस्ते। आपके बताए गए लक्षणों से यह सामान्य वायरल बुखार या मौसमी संक्रमण हो सकता है।',
      'कृपया पर्याप्त मात्रा में उबला हुआ पानी पिएं, ओआरएस लें और पूरा आराम करें।',
      'यदि बुखार 3 दिन से ज्यादा रहे या सांस लेने में तकलीफ हो, तो रामपुर प्राथमिक स्वास्थ्य केंद्र (PHC) में डॉक्टर को दिखाएं।'
    ],
    sampleSymptoms: ['बुखार (Fever)', 'बदन दर्द (Body Ache)', 'कमजोरी (Fatigue)'],
    conditions: [
      {
        id: 'hi_viral',
        name: 'सामान्य वायरल बुखार (Viral Fever)',
        explanation: 'मौसमी बदलाव से होने वाला आम संक्रमण जो 3-5 दिनों में आराम से ठीक हो जाता है।',
        commonSymptoms: ['बुखार', 'बदन दर्द', 'कमजोरी'],
        whyRelevant: 'आपके 2 दिन के बुखार और दर्द से मेल खाता है।',
        whenToSeeDoctor: '3 दिन से अधिक रहने पर PHC में खून की जांच कराएं।',
        severityLevel: 'low',
        suggestedCareFacility: 'PHC'
      }
    ],
    isRedFlag: false
  },
  {
    id: 'demo_mr_cough',
    title: 'Marathi: ताप आणि खोकला (Fever, Cough & Weakness)',
    languageCode: 'mr',
    languageName: 'मराठी (Marathi)',
    userPrompt: 'Mala kalpasun fever aani khokla aahe, aani angat khoop thakva vatat aahe.',
    assistantReplies: [
      'नमस्कार. तुमच्या लक्षणांवरून हे हवामानातील बदलामुळे झालेला फ्लू सदृश संसर्ग असू शकतो.',
      'कोमट पाणी प्या, मिठाच्या पाण्याच्या गुळण्या करा आणि विश्रांती घ्या.',
      'त्रास कमी न झाल्यास तुमच्या गावाजवळील प्राथमिक आरोग्य केंद्रातील डॉक्टरांशी किंवा आशा ताईंशी संपर्क साधा.'
    ],
    sampleSymptoms: ['ताप (Fever)', 'खोकला (Cough)', 'थकवा (Weakness)'],
    conditions: [
      {
        id: 'mr_flu',
        name: 'फ्लू सदृश आजार (Flu-like Upper Respiratory Infection)',
        explanation: 'हवामानातील बदलामुळे श्वसनसंस्थेचा होणारा संसर्ग.',
        commonSymptoms: ['ताप', 'खोकला', 'घसा खवखवणे', 'अशक्तपणा'],
        whyRelevant: 'कालपासून सुरू झालेला ताप आणि खोकला या लक्षणांशी सुसंगत आहे.',
        whenToSeeDoctor: 'श्वास घेण्यास अडचण आल्यास तात्काळ जवळच्या आरोग्य केंद्रात जा.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      }
    ],
    isRedFlag: false
  },
  {
    id: 'demo_en_stomach',
    title: 'English: Stomach Cramps & Dehydration',
    languageCode: 'en',
    languageName: 'English (Indian Context)',
    userPrompt: 'I have had loose motion and stomach pain since yesterday morning.',
    assistantReplies: [
      'Hello. These symptoms commonly indicate mild gastroenteritis or a stomach bug.',
      'The most critical step is staying hydrated: sip Oral Rehydration Solution (ORS) or boiled water frequently.',
      'If you notice severe weakness, blood in stool, or inability to keep fluids down, visit your nearest Community Health Centre.'
    ],
    sampleSymptoms: ['Loose motion', 'Stomach pain', 'Dehydration risk'],
    conditions: [
      {
        id: 'en_gastro',
        name: 'Acute Gastroenteritis',
        explanation: 'Digestive tract irritation often linked to unboiled water or food intake.',
        commonSymptoms: ['Stomach cramps', 'Loose stools', 'Dehydration'],
        whyRelevant: 'Directly reflects your digestive discomfort and fluid loss.',
        whenToSeeDoctor: 'Consult a clinic if symptoms persist over 48 hours or urine output drops.',
        severityLevel: 'moderate',
        suggestedCareFacility: 'PHC'
      }
    ],
    isRedFlag: false
  },
  {
    id: 'demo_emergency',
    title: 'Emergency: Severe Shortness of Breath (Red-Flag)',
    languageCode: 'hi',
    languageName: 'आपातकालीन सूचना (Emergency Override)',
    userPrompt: 'मरीज को सांस लेने में बहुत ज्यादा तकलीफ हो रही है और छाती में भारी दबाव है।',
    assistantReplies: [
      '⚠️ अत्यंत जरूरी चेतावनी: यह एक आपातकालीन स्थिति (Medical Emergency) हो सकती है।',
      'कृपया तुरंत 108 नंबर पर फोन करके एम्बुलेंस बुलाएं।',
      'खुद से कोई दवा न दें। मरीज को सीधा बैठाएं और नजदीकी 24x7 अस्पताल ले जाएं।'
    ],
    sampleSymptoms: ['सांस लेने में भारी तकलीफ', 'छाती में तेज दबाव'],
    conditions: [],
    isRedFlag: true
  }
];

// ---------------------------------------------------------------------------
// 6. Speech Synthesis (Text-to-Speech) Helper
// ---------------------------------------------------------------------------

export class VoiceSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public speak(
    text: string, 
    langCode: SupportedLanguageCode, 
    onStart?: () => void, 
    onEnd?: () => void, 
    onError?: (err: any) => void
  ) {
    if (this.isMuted || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#+/g, '')
      .replace(/⚠️/g, 'चेतावनी')
      .replace(/🚨/g, 'अलर्ट')
      .replace(/🩺|💧|💊|📍|🎙️/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const langOption = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    const speechCode = langOption ? langOption.speechCode : 'hi-IN';

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechCode;
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang === speechCode || v.lang.startsWith(speechCode.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }
}

// ---------------------------------------------------------------------------
// 7. Speech Recognition (Speech-to-Text) Wrapper
// ---------------------------------------------------------------------------

export type SpeechRecCallback = {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (errorMsg: string) => void;
  onEnd: () => void;
  onStart: () => void;
};

export class VoiceRecognitionManager {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(langCode: SupportedLanguageCode, callbacks: SpeechRecCallback) {
    if (!this.recognition) {
      callbacks.onError('Voice recognition is not supported in this browser. You can type instead.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    const langOption = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    this.recognition.lang = (langOption && langOption.code !== 'auto') ? langOption.speechCode : 'hi-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) {
        callbacks.onResult(final.trim(), true);
      } else if (interim) {
        callbacks.onResult(interim.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let msg = 'Could not understand speech. Please try speaking again or type.';
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        msg = 'Microphone permission denied. Please allow microphone access or type your symptoms.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech detected. Tap the microphone and speak clearly.';
      } else if (event.error === 'network') {
        msg = 'Network issue with voice recognition. You can type your symptoms instead.';
      }
      callbacks.onError(msg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd();
    };

    try {
      this.recognition.start();
    } catch {
      this.isListening = false;
      callbacks.onError('Voice recognition encountered an issue. You can type instead.');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop race conditions
      }
      this.isListening = false;
    }
  }
}
