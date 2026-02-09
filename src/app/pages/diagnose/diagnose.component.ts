import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

const LANG_OPTIONS = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'mr', label: 'मराठी' },
  { id: 'gu', label: 'ગુજરાતી' },
  { id: 'te', label: 'తెలుగు' },
  { id: 'ta', label: 'தமிழ்' },
  { id: 'kn', label: 'ಕನ್ನಡ' }
];

type Lang = 'en' | 'hi' | 'mr' | 'gu' | 'te' | 'ta' | 'kn';

type UiStrings = {
  title: string;
  subtitle: string;
  disclaimer: string;
  language: string;
  upload: string;
  diagnose: string;
  analyzing: string;
  preview: string;
  result: string;
  issue: string;
  category: string;
  confidence: string;
  symptoms: string;
  actions: string;
  escalation: string;
  support: string;
};

@Component({
  selector: 'app-diagnose',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diagnose.component.html',
  styleUrls: ['./diagnose.component.css']
})
export class DiagnoseComponent {
  languages = LANG_OPTIONS;
  selectedLanguage: Lang = 'en';
  imagePreview: string | null = null;
  imageData: string | null = null;
  loading = false;
  error = '';
  result: any = null;
  severityText: Record<Lang, Record<string, string>> = {
    en: { low: 'Mild', medium: 'Moderate', high: 'Severe' },
    hi: { low: 'हल्का', medium: 'मध्यम', high: 'गंभीर' },
    mr: { low: 'सौम्य', medium: 'मध्यम', high: 'गंभीर' },
    gu: { low: 'હળવું', medium: 'મધ્યમ', high: 'ગંભીર' },
    te: { low: 'తేలిక', medium: 'మధ్యమ', high: 'తీవ్రమైన' },
    ta: { low: 'மிதமான', medium: 'நடுத்தர', high: 'கடுமையான' },
    kn: { low: 'ಸ್ವಲ್ಪ', medium: 'ಮಧ್ಯಮ', high: 'ತೀವ್ರ' }
  };
  uiText: Record<Lang, UiStrings> = {
    en: {
      title: 'Crop Health Diagnosis',
      subtitle: 'Upload a crop leaf or plant photo to identify likely issues and safe next steps.',
      disclaimer: 'This tool does not recommend pesticides. Please consult local agronomists for chemical guidance.',
      language: 'Language',
      upload: 'Upload crop image',
      diagnose: 'Diagnose',
      analyzing: 'Analyzing...',
      preview: 'Image preview',
      result: 'Diagnosis result',
      issue: 'Likely issue',
      category: 'Category',
      confidence: 'Confidence',
      symptoms: 'Symptoms noticed',
      actions: 'Safe next steps',
      escalation: 'Escalation note',
      support: 'Supported images: JPG/PNG/WEBP/GIF, up to 5MB.'
    },
    hi: {
      title: 'फसल स्वास्थ्य निदान',
      subtitle: 'फसल/पत्ती की फोटो अपलोड करें ताकि समस्या और सुरक्षित कदम बताए जा सकें।',
      disclaimer: 'यह टूल कीटनाशक की सलाह नहीं देता। रसायन के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।',
      language: 'भाषा',
      upload: 'फसल की छवि अपलोड करें',
      diagnose: 'जांच करें',
      analyzing: 'जांच जारी है...',
      preview: 'छवि पूर्वावलोकन',
      result: 'निदान परिणाम',
      issue: 'संभावित समस्या',
      category: 'श्रेणी',
      confidence: 'विश्वास स्तर',
      symptoms: 'लक्षण',
      actions: 'सुरक्षित अगले कदम',
      escalation: 'विशेषज्ञ सलाह',
      support: 'समर्थित चित्र: JPG/PNG/WEBP/GIF, 5MB तक।'
    },
    mr: {
      title: 'पिक आरोग्य निदान',
      subtitle: 'पान/पिकाचा फोटो अपलोड करून संभाव्य समस्या ओळखा.',
      disclaimer: 'हे साधन कीटकनाशक सुचवत नाही. रसायनांसाठी स्थानिक कृषी तज्ज्ञांना विचारा.',
      language: 'भाषा',
      upload: 'पिकाची प्रतिमा अपलोड करा',
      diagnose: 'निदान करा',
      analyzing: 'निदान सुरू आहे...',
      preview: 'प्रतिमा पूर्वावलोकन',
      result: 'निदान निकाल',
      issue: 'संभाव्य समस्या',
      category: 'वर्ग',
      confidence: 'विश्वास पातळी',
      symptoms: 'लक्षणे',
      actions: 'सुरक्षित पुढील पावले',
      escalation: 'तज्ज्ञ सल्ला',
      support: 'समर्थित प्रतिमा: JPG/PNG/WEBP/GIF, 5MB पर्यंत.'
    },
    gu: {
      title: 'પાક આરોગ્ય નિદાન',
      subtitle: 'પાન/પાકની તસવીર અપલોડ કરીને સંભવિત સમસ્યા જાણો.',
      disclaimer: 'આ સાધન કીટનાશક ભલામણ આપતું નથી. રસાયણ માટે સ્થાનિક નિષ્ણાતથી સલાહ લો.',
      language: 'ભાષા',
      upload: 'પાકની છબી અપલોડ કરો',
      diagnose: 'નિદાન કરો',
      analyzing: 'વિશ્લેષણ થઈ રહ્યું છે...',
      preview: 'છબી પૂર્વદર્શન',
      result: 'નિદાન પરિણામ',
      issue: 'સંભવિત સમસ્યા',
      category: 'વર્ગ',
      confidence: 'વિશ્વાસ સ્તર',
      symptoms: 'લક્ષણો',
      actions: 'સુરક્ષિત પગલાં',
      escalation: 'નિષ્ણાત સલાહ',
      support: 'સમર્થિત ફાઇલ: JPG/PNG/WEBP/GIF, 5MB સુધી.'
    },
    te: {
      title: 'పంట ఆరోగ్య నిర్ధారణ',
      subtitle: 'ఆకుపచ్చ/పంట ఫోటో అప్లోడ్ చేసి సమస్యను గుర్తించండి.',
      disclaimer: 'ఈ టూల్ pesticideలు సూచించదు. రసాయనాల కోసం స్థానిక నిపుణులను సంప్రదించండి.',
      language: 'భాష',
      upload: 'పంట చిత్రం అప్లోడ్ చేయండి',
      diagnose: 'నిర్ధారణ',
      analyzing: 'విశ్లేషణ జరుగుతోంది...',
      preview: 'చిత్రం ప్రివ్యూ',
      result: 'నిర్ధారణ ఫలితం',
      issue: 'సంభావ్య సమస్య',
      category: 'వర్గం',
      confidence: 'నమ్మకం స్థాయి',
      symptoms: 'లక్షణాలు',
      actions: 'సురక్షిత చర్యలు',
      escalation: 'నిపుణుల సలహా',
      support: 'సపోర్ట్ ఫైళ్లు: JPG/PNG/WEBP/GIF, 5MB లోపు.'
    },
    ta: {
      title: 'பயிர் ஆரோக்கியக் கண்டறிதல்',
      subtitle: 'இலை/பயிர் படத்தை பதிவேற்றி சிக்கலை கண்டறியுங்கள்.',
      disclaimer: 'இந்த கருவி பூச்சிக்கொல்லி பரிந்துரைகள் வழங்காது. ரசாயனத்திற்கு உள்ளூர் நிபுணரை அணுகவும்.',
      language: 'மொழி',
      upload: 'பயிர் படத்தை பதிவேற்றவும்',
      diagnose: 'கண்டறி',
      analyzing: 'பகுப்பாய்வு நடக்கிறது...',
      preview: 'பட முன்னோட்டம்',
      result: 'கண்டறிதல் முடிவு',
      issue: 'சாத்தியமான சிக்கல்',
      category: 'வகை',
      confidence: 'நம்பிக்கை அளவு',
      symptoms: 'அறிகுறிகள்',
      actions: 'பாதுகாப்பான நடவடிக்கைகள்',
      escalation: 'நிபுணர் ஆலோசனை',
      support: 'ஆதரிக்கும் கோப்புகள்: JPG/PNG/WEBP/GIF, 5MB வரை.'
    },
    kn: {
      title: 'ಬೆಳೆ ಆರೋಗ್ಯ ನಿರ್ಣಯ',
      subtitle: 'ಇಲೆ/ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಸಮಸ್ಯೆಯನ್ನು ಗುರುತಿಸಿ.',
      disclaimer: 'ಈ ಸಾಧನ ಕೀಟನಾಶಕ ಶಿಫಾರಸು ಮಾಡುವುದಿಲ್ಲ. ರಸಾಯನಕ್ಕಾಗಿ ಸ್ಥಳೀಯ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      language: 'ಭಾಷೆ',
      upload: 'ಬೆಳೆ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      diagnose: 'ನಿರ್ಣಯ',
      analyzing: 'ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...',
      preview: 'ಚಿತ್ರ ಪೂರ್ವಾವಲೋಕನ',
      result: 'ನಿರ್ಣಯ ಫಲಿತಾಂಶ',
      issue: 'ಸಂಭಾವ್ಯ ಸಮಸ್ಯೆ',
      category: 'ವರ್ಗ',
      confidence: 'ಆತ್ಮವಿಶ್ವಾಸ ಮಟ್ಟ',
      symptoms: 'ಲಕ್ಷಣಗಳು',
      actions: 'ಸುರಕ್ಷಿತ ಮುಂದಿನ ಕ್ರಮಗಳು',
      escalation: 'ತಜ್ಞ ಸಲಹೆ',
      support: 'ಸಹಾಯಕ ಫೈಲ್‌ಗಳು: JPG/PNG/WEBP/GIF, 5MB ಒಳಗೆ.'
    }
  };

  safePlan: Record<Lang, string[]> = {
    en: [
      'Remove and destroy infected leaves; do not compost.',
      'Improve spacing and airflow to reduce humidity.',
      'Avoid overhead irrigation; water early morning.',
      'Sanitize tools and avoid moving from infected to healthy plots.',
      'Scout weekly and isolate affected plants.',
      'Use crop rotation and resistant varieties in the next season.',
      'Consider approved biological options only after expert advice.'
    ],
    hi: [
      'संक्रमित पत्तियों को हटाकर नष्ट करें; कम्पोस्ट न करें।',
      'हवा का प्रवाह बढ़ाने के लिए उचित दूरी रखें।',
      'ऊपर से सिंचाई से बचें; सुबह पानी दें।',
      'औज़ार साफ रखें और स्वस्थ खेत में संक्रमण न फैलाएँ।',
      'हर सप्ताह निगरानी करें और प्रभावित पौधों को अलग रखें।',
      'अगले मौसम में फसल चक्र व प्रतिरोधी किस्में अपनाएँ।',
      'जैविक विकल्प केवल विशेषज्ञ सलाह के बाद ही अपनाएँ।'
    ],
    mr: [
      'संक्रमित पाने काढून नष्ट करा; कंपोस्ट करू नका.',
      'हवेशीर अंतर ठेवून वातानुकूलन वाढवा.',
      'वरून पाणी देणे टाळा; सकाळी सिंचन करा.',
      'औजारे स्वच्छ ठेवा आणि संसर्ग पसरू देऊ नका.',
      'साप्ताहिक पाहणी करा आणि प्रभावित रोपे वेगळी ठेवा.',
      'पुढील हंगामात पीक फेरपालट व प्रतिरोधक वाण वापरा.',
      'जैविक पर्याय तज्ज्ञ सल्ल्यानंतरच वापरा.'
    ],
    gu: [
      'સંક્રમિત પાંદડાં દૂર કરી નષ્ટ કરો; કમ્પોસ્ટ ન કરો.',
      'હવા ફરતી રહે તે માટે યોગ્ય અંતર રાખો.',
      'ઉપરથી સિંચાઈ ટાળો; સવારે પાણી આપો.',
      'ઉપકરણો સાફ રાખો અને ચેપ ફેલાતો રોકો.',
      'નિયમિત દેખરેખ કરો અને અસરગ્રસ્ત છોડ અલગ કરો.',
      'આવતા સીઝનમાં પાક ફેરબદલી અને પ્રતિરોધક જાત પસંદ કરો.',
      'જીવાણુ આધારિત વિકલ્પો માટે નિષ્ણાત સલાહ લો.'
    ],
    te: [
      'సంక్రామిత ఆకులను తొలగించి నాశనం చేయండి; కంపోస్ట్ చేయవద్దు.',
      'గాలి చలనం కోసం సరైన అంతరం ఉంచండి.',
      'పై నుంచి నీరు పోసే విధానాన్ని తప్పించండి; ఉదయాన్నే నీరు ఇవ్వండి.',
      'పరికరాలు శుభ్రంగా ఉంచండి; వ్యాధి వ్యాప్తిని అడ్డుకోండి.',
      'వారానికి ఒకసారి పరిశీలించి ప్రభావిత మొక్కలను వేరు చేయండి.',
      'తదుపరి సీజన్‌లో పంట మార్పిడి మరియు ప్రతిఘటక రకాలు వాడండి.',
      'జీవ శాస్త్రీయ పరిష్కారాలకు నిపుణుల సలహా తీసుకోండి.'
    ],
    ta: [
      'பாதிக்கப்பட்ட இலைகளை அகற்றி அழிக்கவும்; கம்போஸ்ட் செய்ய வேண்டாம்.',
      'காற்றோட்டம் அதிகரிக்க சரியான இடைவெளி வைக்கவும்.',
      'மேலிருந்து நீர் தெளிப்பதை தவிர்க்கவும்; காலை நேரத்தில் நீர் விடவும்.',
      'கருவிகளை சுத்தமாக வைத்திருந்து பரவலைத் தடுக்கவும்.',
      'வாராந்திர கண்காணிப்பு செய்து பாதிக்கப்பட்ட செடிகளை தனிமைப்படுத்தவும்.',
      'அடுத்த பருவத்தில் பயிர் சுழற்சி மற்றும் எதிர்ப்பு வகைகளை பயன்படுத்தவும்.',
      'உயிரி அடிப்படையிலான தீர்வுகளுக்கு நிபுணர் ஆலோசனை பெறவும்.'
    ],
    kn: [
      'ಸಂಕ್ರಮಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ನಾಶಮಾಡಿ; ಕಂಪೋಸ್ಟ್ ಮಾಡಬೇಡಿ.',
      'ಹವಾ ಚಲನೆಯಿಗಾಗಿ ಸರಿಯಾದ ಅಂತರ ಕಾಯ್ದಿರಿಸಿ.',
      'ಮೇಲಿಂದ ನೀರಾವರಿ ತಪ್ಪಿಸಿ; ಬೆಳಿಗ್ಗೆ ನೀರು ನೀಡಿ.',
      'ಉಪಕರಣಗಳನ್ನು ಸ್ವಚ್ಚವಾಗಿಟ್ಟು ಸೋಂಕು ಹರಡುವುದನ್ನು ತಡೆಯಿರಿ.',
      'ಸಾಪ್ತಾಹಿಕ ಪರಿಶೀಲನೆ ಮಾಡಿ ಪ್ರಭಾವಿತ ಗಿಡಗಳನ್ನು ಬೇರ್ಪಡಿಸಿ.',
      'ಮುಂದಿನ ಹಂಗಾಮಿನಲ್ಲಿ ಬೆಳೆ ಪರಿವರ್ತನೆ ಹಾಗೂ ಪ್ರತಿರೋಧಕ ಜಾತಿಗಳನ್ನು ಬಳಸಿ.',
      'ಜೈವಿಕ ಆಯ್ಕೆಗಳಿಗೆ ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ.'
    ]
  };

  get t(): UiStrings {
    return this.uiText[this.selectedLanguage] || this.uiText['en'];
  }

  get issueText(): string {
    if (!this.result) return '';
    return typeof this.result.issue === 'string' ? this.result.issue : '—';
  }

  get categoryText(): string {
    if (!this.result) return '';
    return typeof this.result.category === 'string' ? this.result.category : '—';
  }

  get confidenceText(): string {
    if (!this.result) return '';
    return typeof this.result.confidence === 'string' ? this.result.confidence : 'low';
  }

  get symptomsList(): string[] {
    if (!this.result?.symptoms) return [];
    return Array.isArray(this.result.symptoms) ? this.result.symptoms : [];
  }

  get actionsList(): string[] {
    if (!this.result?.safe_actions) return [];
    return Array.isArray(this.result.safe_actions) ? this.result.safe_actions : [];
  }

  get escalationText(): string {
    if (!this.result) return '';
    return typeof this.result.escalation_note === 'string' ? this.result.escalation_note : '';
  }

  get confidencePercent(): number {
    const value = (this.confidenceText || 'low').toLowerCase();
    if (value === 'high') return 85;
    if (value === 'medium') return 55;
    return 30;
  }

  get categoryIcon(): string {
    const value = (this.categoryText || '').toLowerCase();
    if (value.includes('disease')) return '🧫';
    if (value.includes('pest') || value.includes('insect')) return '🐛';
    if (value.includes('nutrient') || value.includes('deficien')) return '🧪';
    if (value.includes('water') || value.includes('stress')) return '💧';
    return '🌿';
  }

  get severity(): string {
    const level = (this.confidenceText || 'low').toLowerCase();
    const map = this.severityText[this.selectedLanguage] || this.severityText['en'];
    return map[level] || map['low'];
  }

  get safePlanList(): string[] {
    return this.safePlan[this.selectedLanguage] || this.safePlan.en;
  }

  downloadReport(): void {
    if (!this.result) return;
    const html = `
      <html>
        <head>
          <title>Crop Diagnosis Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2a1f; }
            h1 { margin-bottom: 8px; }
            .meta { color: #5c6659; margin-bottom: 16px; }
            .card { border: 1px solid #ddd; border-radius: 10px; padding: 10px 12px; margin-bottom: 10px; }
            ul { margin: 0; padding-left: 18px; }
          </style>
        </head>
        <body>
          <h1>Crop Diagnosis Report</h1>
          <div class="meta">Issue: ${this.issueText}</div>
          <div class="card"><strong>Category:</strong> ${this.categoryText}</div>
          <div class="card"><strong>Confidence:</strong> ${this.confidenceText}</div>
          <div class="card"><strong>Severity:</strong> ${this.severity}</div>
          <div class="card">
            <strong>Symptoms:</strong>
            <ul>${this.symptomsList.map((s) => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="card">
            <strong>Safe next steps:</strong>
            <ul>${this.actionsList.map((s) => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="card"><strong>Escalation note:</strong> ${this.escalationText}</div>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  constructor(private api: ApiService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.error = 'Please upload an image file.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'Image too large. Please upload under 5MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imageData = reader.result as string;
      this.error = '';
      this.result = null;
    };
    reader.readAsDataURL(file);
  }

  diagnose(): void {
    if (!this.imageData) {
      this.error = 'Please upload a crop image first.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.result = null;

    this.api.diagnoseCrop({ imageData: this.imageData, language: this.selectedLanguage }).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.error || 'Diagnosis failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
