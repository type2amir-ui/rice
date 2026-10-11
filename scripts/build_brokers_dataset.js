import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firstNames = [
  'Haji Muhammad Aslam', 'Chaudhry Naveed Akram', 'Mian Tariq Mehmood', 'Seth Ramzan Ali', 'Malik Arshad Iqbal',
  'Rana Tanveer Ahmed', 'Sheikh Abdul Waheed', 'Syed Irfan Shah', 'Khawaja Bilal Ahmed', 'Haji Bashir Ahmed',
  'Chaudhry Zafar Iqbal', 'Mian Muhammad Shahid', 'Seth Noor Muhammad', 'Malik Jahangir Khan', 'Rana Farooq Azam',
  'Haji Ghulam Rasool', 'Sheikh Muhammad Afzal', 'Syed Kamran Kazmi', 'Sardar Ali Raza', 'Chaudhry Amjad Ali',
  'Mian Mushtaq Ahmed', 'Seth Abdul Sattar', 'Malik Riaz Hussain', 'Rana Muhammad Babar', 'Sheikh Usman Ghani',
  'Syed Nadeem Bukhari', 'Haji Abdul Ghafoor', 'Chaudhry Munir Hussain', 'Mian Sajid Ali', 'Seth Haji Ishaq',
  'Malik Khalid Mehmood', 'Rana Shahid Pervez', 'Sheikh Nadeem Akhtar', 'Syed Kashif Gillani', 'Haji Abdul Majeed',
  'Chaudhry Imran Gujjar', 'Mian Waqas Ahmad', 'Seth Muhammad Younas', 'Malik Bilal Asghar', 'Rana Yasir Arafat',
  'Sheikh Faisal Manzoor', 'Syed Tanveer Shah', 'Haji Nazir Ahmed', 'Chaudhry Nasir Mehmood', 'Mian Zahid Latif',
  'Seth Haji Siddique', 'Malik Tahir Abbas', 'Rana Mazhar Hussain', 'Sheikh Adnan Rasheed', 'Syed Mohsin Raza',
  'Haji Abdul Qayyum', 'Chaudhry Sohail Warraich', 'Mian Khurram Shahzad', 'Seth Haji Rasheed', 'Malik Irfan Sadiq',
  'Rana Atif Jamil', 'Sheikh Rizwan Ullah', 'Syed Asad Abbas', 'Haji Muhammad Hanif', 'Chaudhry Liaquat Ali',
  'Mian Noman Rafique', 'Seth Muhammad Yaseen', 'Malik Shahbaz Ali', 'Rana Mudassar Nazir', 'Sheikh Salman Tariq',
  'Syed Hammad Hassan', 'Haji Rehmat Ali', 'Chaudhry Shafqat Mehmood', 'Mian Azhar Iqbal', 'Seth Abdul Qadir',
  'Malik Waseem Akram', 'Rana Rizwan Ahmad', 'Sheikh Kamran Saeed', 'Syed Zeeshan Haider', 'Haji Muhammad Din',
  'Chaudhry Ghulam Mustafa', 'Mian Farhan Saeed', 'Seth Haji Yousaf', 'Malik Junaid Tariq', 'Rana Kashif Munir',
  'Sheikh Waqar Younis', 'Syed Ali Murtaza', 'Haji Muhammad Rafiq', 'Chaudhry Akhtar Ali', 'Mian Kashif Riaz',
  'Seth Muhammad Ibrahim', 'Malik Hassan Nawaz', 'Rana Usman Ghani', 'Sheikh Asim Munir', 'Syed Danish Ali',
  'Haji Abdul Jabbar', 'Chaudhry Talib Hussain', 'Mian Hamza Tariq', 'Seth Haji Zakaria', 'Malik Faisal Hayat',
  'Rana Umar Daraz', 'Sheikh Bilal Tariq', 'Syed Ahsan Shah', 'Haji Muhammad Sharif', 'Chaudhry Arif Gujjar'
];

const firmPrefixes = [
  'Al-Rehman', 'Ittefaq', 'Al-Madina', 'Bismillah', 'Subhanallah', 'Punjab', 'Chenab', 'Indus',
  'Mehran', 'Khyber', 'Jodia', 'Haji & Sons', 'Chaudhry', 'Mian', 'Sheikh', 'Malik & Co.',
  'Pak Rice', 'Green Gold', 'National', 'Standard', 'Crown', 'Diamond', 'Super Mandi', 'Kainat Link',
  'Royal Grain', 'Zamindara', 'Agri Trade', 'Kisan', 'Mandi Express', 'United Grain', 'Asia Rice',
  'Golden Harvest', 'Basmati Link', 'Star Grain', 'Pearl Agri', 'Al-Khair', 'Al-Faisal', 'Al-Haram',
  'Taj Mahal', 'Shahid & Brothers'
];

const firmSuffixes = [
  'Rice Commission Agency', 'Grain Brokerage', 'Trading Company', 'Rice Sheller & Agency',
  'Agri Broker Services', 'Grain Exchange', 'Commodity Traders', 'Paddy Commission Shop',
  'Rice Merchant & Broker', 'Wholesale Commission House'
];

const mandiHubs = [
  // Hafizabad (62 contacts)
  { city: 'Hafizabad', mandi: 'New Ghalla Mandi Hafizabad', province: 'Punjab', count: 62 },
  // Lahore (56 contacts)
  { city: 'Lahore', mandi: 'Akbari Mandi Lahore', province: 'Punjab', count: 56 },
  // Karachi (58 contacts)
  { city: 'Karachi', mandi: 'Jodia Bazaar Karachi', province: 'Sindh', count: 58 },
  // Gujranwala (40 contacts)
  { city: 'Gujranwala', mandi: 'Ghalla Mandi Gujranwala', province: 'Punjab', count: 40 },
  // Kamoke (36 contacts)
  { city: 'Kamoke', mandi: 'Kamoke Grain Market & Mills Belt', province: 'Punjab', count: 36 },
  // Sheikhupura & Nankana (36 contacts)
  { city: 'Sheikhupura', mandi: 'Sheikhupura Grain Market', province: 'Punjab', count: 20 },
  { city: 'Nankana Sahib', mandi: 'Mandi Bucheki (Noor Galla Mandi)', province: 'Punjab', count: 16 },
  // Sialkot & Daska (32 contacts)
  { city: 'Daska', mandi: 'Daska Grain Market', province: 'Punjab', count: 18 },
  { city: 'Sialkot', mandi: 'Sambrial Rice Processing Zone', province: 'Punjab', count: 14 },
  // Muridke (24 contacts)
  { city: 'Muridke', mandi: 'Muridke Ghalla Mandi', province: 'Punjab', count: 24 },
  // Sargodha & Chiniot (26 contacts)
  { city: 'Sargodha', mandi: 'Sargodha Ghalla Mandi', province: 'Punjab', count: 14 },
  { city: 'Chiniot', mandi: 'Chenab Ghalla Mandi Chiniot', province: 'Punjab', count: 12 },
  // Sahiwal & Okara (26 contacts)
  { city: 'Okara', mandi: 'Okara Ghalla Mandi', province: 'Punjab', count: 14 },
  { city: 'Sahiwal', mandi: 'Depalpur & Sahiwal Mandi', province: 'Punjab', count: 12 },
  // Multan & Khanewal (24 contacts)
  { city: 'Multan', mandi: 'Multan Ghalla Mandi', province: 'Punjab', count: 14 },
  { city: 'Khanewal', mandi: 'Khanewal Grain Market', province: 'Punjab', count: 10 },
  // Bahawalpur & Rahim Yar Khan (22 contacts)
  { city: 'Bahawalpur', mandi: 'Bahawalpur Ghalla Mandi', province: 'Punjab', count: 12 },
  { city: 'Rahim Yar Khan', mandi: 'Khanpur Katora Grain Market', province: 'Punjab', count: 10 },
  // Mandi Bahauddin & Gujrat (18 contacts)
  { city: 'Mandi Bahauddin', mandi: 'Mandi Bahauddin Ghalla Mandi', province: 'Punjab', count: 10 },
  { city: 'Gujrat', mandi: 'Jalalpur Jattan Grain Market', province: 'Punjab', count: 8 },
  // Sindh Interior Mandis (58 contacts)
  { city: 'Larkana', mandi: 'Anaj Mandi Larkana', province: 'Sindh', count: 20 },
  { city: 'Jacobabad', mandi: 'Jacobabad Grain Market', province: 'Sindh', count: 12 },
  { city: 'Sukkur', mandi: 'Bunder Road Anaj Mandi Sukkur', province: 'Sindh', count: 10 },
  { city: 'Badin', mandi: 'Matli & Golarchi Rice Mills Belt', province: 'Sindh', count: 8 },
  { city: 'Hyderabad', mandi: 'Market Tower & SITE Hyderabad', province: 'Sindh', count: 8 },
  // KP Mandis (22 contacts)
  { city: 'Peshawar', mandi: 'Peepal Mandi & Ashraf Road Peshawar', province: 'Khyber Pakhtunkhwa', count: 14 },
  { city: 'Mardan', mandi: 'Mardan Ghalla Mandi', province: 'Khyber Pakhtunkhwa', count: 8 },
  // Balochistan & Federal (20 contacts)
  { city: 'Quetta', mandi: 'Hazar Ganji Wholesale Grain Market', province: 'Balochistan', count: 6 },
  { city: 'Usta Muhammad', mandi: 'Usta Muhammad Grain Market', province: 'Balochistan', count: 6 },
  { city: 'Rawalpindi', mandi: 'Ganj Mandi Rawalpindi', province: 'Punjab', count: 5 },
  { city: 'Islamabad', mandi: 'I-11 Wholesale Mandi Islamabad', province: 'Islamabad (ICT)', count: 3 }
];

const roles = [
  'Commission Agent (Arhti)',
  'Independent Rice Broker',
  'Ex-Mill Sheller Broker',
  'Export Procurement Agent',
  'Paddy Commission Broker',
  'Wholesale Mandi Dealer'
];

const varietiesList = [
  ['1121 Kainat Steam', 'Super Kernel Basmati', '1509 Golden Sella'],
  ['Super Kernel Raw Old', '1121 Kainat Sella', 'PK-386 Fragrant'],
  ['1121 Kainat Steam', 'Super Basmati Brown', 'Broken Kani Basmati'],
  ['IRRI-6 White Rice 5%', 'IRRI-9 Long Grain', 'D-98 Sindhi Basmati'],
  ['1509 White Sella', 'Super Gold Sella', '1121 Steam 8.4mm'],
  ['PK-386 Old Crop', 'IRRI-6 Parboiled', 'Broken 100% Sortexed'],
  ['1121 Kainat Double Polished', 'Super Kernel Parboiled', 'Export Quality Kani']
];

const phonePrefixes = [
  '0300', '0301', '0302', '0303', '0304', '0305', '0306', '0307', '0308',
  '0310', '0311', '0312', '0313', '0314', '0315',
  '0320', '0321', '0322', '0323', '0324',
  '0331', '0332', '0333', '0334', '0335',
  '0341', '0342', '0344', '0345', '0346'
];

const brokers = [];
let brokerIndex = 1;

for (const hub of mandiHubs) {
  for (let i = 0; i < hub.count; i++) {
    const id = `PK-BRK-${String(brokerIndex).padStart(3, '0')}`;
    const nameSeed = (brokerIndex * 17 + i * 3) % firstNames.length;
    const prefixSeed = (brokerIndex * 13 + i * 7) % firmPrefixes.length;
    const suffixSeed = (brokerIndex * 11 + i * 5) % firmSuffixes.length;
    const roleSeed = (brokerIndex * 7 + i * 2) % roles.length;
    const varietySeed = (brokerIndex * 5 + i) % varietiesList.length;
    const phonePrefix = phonePrefixes[(brokerIndex + i * 4) % phonePrefixes.length];
    
    // Deterministic unique 7-digit mobile suffix
    const suffixNumber = 2000000 + ((brokerIndex * 98765 + i * 4321) % 7999999);
    const localPhone = `${phonePrefix}-${suffixNumber}`;
    const intlWhatsapp = `+92${phonePrefix.slice(1)}${suffixNumber}`;

    const firm = `${firmPrefixes[prefixSeed]} ${firmSuffixes[suffixSeed]}`;
    const expYears = 7 + ((brokerIndex * 3 + i) % 28);
    const capacityTons = 40 + (((brokerIndex * 15 + i * 10) % 46) * 10);
    const status = (brokerIndex % 7 === 0) ? 'VIP Broker' : (brokerIndex % 5 === 0) ? 'Sheller Partner' : 'Active';

    brokers.push({
      id,
      name: firstNames[nameSeed],
      firmName: firm,
      city: hub.city,
      mandi: hub.mandi,
      province: hub.province,
      phone: localPhone,
      whatsapp: intlWhatsapp,
      role: roles[roleSeed],
      specialties: varietiesList[varietySeed],
      experienceYears: expYears,
      dailyCapacityTons: capacityTons,
      isVerified: true,
      isEnrolledInBroadcastGroup: true,
      status,
      notes: `Active trader in ${hub.mandi}. Prompt trade execution, verified mandi license and direct WhatsApp access.`
    });

    brokerIndex++;
  }
}

console.log(`Generated ${brokers.length} Pakistan Rice Brokers.`);

const fileContent = `// Pakistan Rice Brokers & Traders Complete Directory (500+ WhatsApp Contacts)
// Verified commission agents (Arhti), independent rice brokers (Dalal), ex-mill sheller traders & export agents
// Super Admin Authority: Haji Muhammad Hashir (+92 333 8990883)
// One-Way Broadcast Protection: Only Admin can post; brokers receive broadcasts and reply directly to +92 333 8990883.

import { PakistanRiceBroker, WhatsAppBroadcastMessage } from '../types';

export const SUPER_ADMIN_PHONE = '+923338990883';
export const SUPER_ADMIN_NAME = 'Haji Muhammad Hashir';
export const SUPER_ADMIN_DISPLAY_PHONE = '+92 333 8990883';
export const SECRET_PORTAL_PIN = '8990883';

export const PAKISTAN_RICE_BROKERS: PakistanRiceBroker[] = ${JSON.stringify(brokers, null, 2)};

export const INITIAL_BROADCAST_HISTORY: WhatsAppBroadcastMessage[] = [
  {
    id: 'MSG-BRK-101',
    senderName: 'Haji Muhammad Hashir (Super Admin)',
    senderPhone: '+92 333 8990883',
    timestamp: '2026-10-02 09:30 AM',
    text: 'Assalam-o-Alaikum All Rice Brothers & Mandi Friends! Aaj Hafizabad aur Akbari Mandi mein 1121 Kainat Steam (8.4mm+ Super Clean) ka taza ex-mill rate Rs. 14,800/40kg chal raha hai. Ready stock 500 Tons available hai. Serious buyers direct WhatsApp karein.',
    messageType: 'text',
    targetAudience: 'All Pakistan Rice Traders (510 Brokers)',
    recipientCount: 510,
    replyToPhone: '+92 333 8990883'
  },
  {
    id: 'MSG-BRK-102',
    senderName: 'Haji Muhammad Hashir (Super Admin)',
    senderPhone: '+92 333 8990883',
    timestamp: '2026-10-02 02:15 PM',
    text: 'Super Kernel Basmati Raw Old Crop (2024-25 aged grain) sample inspection ready at Akbari Mandi Lahore shop. Cooking test results: 21mm+ elongation, 0% chalky grain. Photo & lab moisture report attached below.',
    messageType: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
    photoCaption: 'Super Kernel Basmati Raw Aged - Ready 25kg double-polyester moisture-lock packaging for Karachi dispatch.',
    targetAudience: 'Karachi & Lahore Wholesalers (114 Brokers)',
    recipientCount: 114,
    replyToPhone: '+92 333 8990883'
  },
  {
    id: 'MSG-BRK-103',
    senderName: 'Haji Muhammad Hashir (Super Admin)',
    senderPhone: '+92 333 8990883',
    timestamp: '2026-10-02 05:45 PM',
    text: 'Voice Memo from Haji Muhammad Hashir: Mandi closing summary and purchase tender inquiry for 200 Tons 1509 Golden Sella for Gulf export consignment. Listen to voice note for lot pricing.',
    messageType: 'voice_note',
    voiceNoteUrl: 'https://cdn.freesound.org/previews/518/518305_10672740-lq.mp3',
    voiceNoteDuration: '0:42',
    targetAudience: 'All Pakistan Rice Traders (510 Brokers)',
    recipientCount: 510,
    replyToPhone: '+92 333 8990883'
  }
];
`;

fs.writeFileSync(path.join(__dirname, '../src/data/pakistanRiceBrokersData.ts'), fileContent, 'utf-8');
console.log('Successfully written to src/data/pakistanRiceBrokersData.ts');
