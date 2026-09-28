import { db } from './mongoStore.js';
import { UserModel } from '../models/User.js';
import { CompetitionModel } from '../models/Competition.js';
import { RegistrationModel } from '../models/Registration.js';
import { SubmissionModel } from '../models/Submission.js';

export async function seedDatabase(force = false) {
  const existingComps = await CompetitionModel.find();
  if (existingComps.length > 0 && !force) {
    return;
  }

  await db.users.clear();
  await db.competitions.clear();
  await db.registrations.clear();
  await db.submissions.clear();

  console.log('[Seed] Seeding database with Feedants Classical Dance data...');

  // 1. Create Seed Users
  const userRiya = await UserModel.create({
    _id: 'user_riya_001',
    name: 'Riya Shah',
    email: 'riya.shah@example.com',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    phone: '+91 98201 12345',
    city: 'Mumbai',
  });

  const userArjun = await UserModel.create({
    _id: 'user_arjun_002',
    name: 'Arjun Verma',
    email: 'arjun.verma@example.com',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    phone: '+91 98112 54321',
    city: 'New Delhi',
  });

  const userPriya = await UserModel.create({
    _id: 'user_priya_003',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    phone: '+91 97400 98765',
    city: 'Bengaluru',
  });

  const userEvaluator = await UserModel.create({
    _id: 'user_evaluator_004',
    name: 'Technical Evaluator',
    email: 'evaluator@feedants.com',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    phone: '+91 99999 88888',
    city: 'Bangalore',
  });

  // Calculate realistic reference dates matching the screenshot
  const now = new Date();
  // Registration ends in 1 day 6 hours 28 mins 32 sec
  const registrationEndDate = new Date(now.getTime() + (1 * 24 * 3600 + 6 * 3600 + 28 * 60 + 32) * 1000);
  const registrationStartDate = new Date(now.getTime() - 4 * 24 * 3600 * 1000); // 4 days ago
  const submissionStartDate = new Date(now.getTime() - 2 * 24 * 3600 * 1000);   // Started 2 days ago
  const submissionEndDate = new Date(now.getTime() + 12 * 24 * 3600 * 1000);     // Ends in 12 days
  const resultDate = new Date(now.getTime() + 18 * 24 * 3600 * 1000);            // Results in 18 days

  // 2. Create the Classical Dance Competition
  const competition = await CompetitionModel.create({
    _id: 'comp_classical_dance_001',
    title: 'Feedants Classical Dance',
    description: 'An online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
    category: 'Dance',
    competitionType: 'Multi-Win',
    hasCertificate: true,
    prizePool: 1500,
    entryFee: 99,
    maxParticipants: 20,
    participantCount: 1, // Matches design: 1/20 Booked, 19 spots left
    registrationStartDate: registrationStartDate.toISOString(),
    registrationEndDate: registrationEndDate.toISOString(),
    submissionStartDate: submissionStartDate.toISOString(),
    submissionEndDate: submissionEndDate.toISOString(),
    resultDate: resultDate.toISOString(),
    judge: {
      name: 'Manju Dubey',
      role: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      bio: 'Manju Dubey is an accomplished Kathak exponent of the Lucknow Gharana with over 12 years of performance, judging, and choreography acclaim. She has mentored over 500 classical dancers across India.'
    },
    introVideo: {
      title: 'Competition Overview & Choreography Tips by Manju Dubey',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '03:45',
      thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80'
    },
    previousWinners: [
      {
        id: 'w1',
        name: 'Riya Shah',
        rank: '1st Winner',
        rankNumber: 1,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        performanceTitle: 'Shiva Stuti Kathak Recital',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        quote: 'Feedants provided an incredible stage and constructive feedback that helped me refine my footwork.'
      },
      {
        id: 'w2',
        name: 'Aarav Mehta',
        rank: '1st Winner',
        rankNumber: 1,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        performanceTitle: 'Teental Drut Laya Footwork',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        quote: 'Seamless registration, prompt rewards, and esteemed judges!'
      },
      {
        id: 'w3',
        name: 'Neha Verma',
        rank: '2nd Winner',
        rankNumber: 2,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        performanceTitle: 'Madhurashtakam Classical Abhinaya',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        quote: 'The certificate and peer recognition motivated me to take my dance practice seriously.'
      },
      {
        id: 'w4',
        name: 'Ishita Choi',
        rank: '3rd Winner',
        rankNumber: 3,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        performanceTitle: 'Tarangam Brass Plate Dance',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        quote: 'Honored to be judged by classical veterans. 10/10 recommended.'
      }
    ],
    aboutCompetition: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance. Whether you specialize in Kathak, Bharatanatyam, Odissi, Kuchipudi, Kathakali, Mohiniyattam, Manipuri, or Sattriya, this competition offers a prestigious platform evaluated by accredited masters. Receive detailed scorecards, verifiable digital certificates, and cash rewards transferred directly to your bank account.',
    judgingParameters: [
      {
        title: 'Rhythm & Timing (Taal & Laya)',
        weightage: 30,
        description: 'Adherence to beats, precision in footwork (Tatkar), and clarity of rhythmic patterns.'
      },
      {
        title: 'Expressions & Storytelling (Bhava & Abhinaya)',
        weightage: 30,
        description: 'Facial expressions, emotive depth, depiction of Navarasas, and narrative delivery.'
      },
      {
        title: 'Technique & Posture (Anga Shuddhi)',
        weightage: 25,
        description: 'Purity of lines, mudras, body geometry, grace, and execution of complex pirouettes (Chakkars).'
      },
      {
        title: 'Costume & Stage Presence',
        weightage: 15,
        description: 'Authenticity of classical attire, ghungroo resonance, makeup, and overall visual harmony.'
      }
    ],
    rules: [
      'Performance video duration must be between 2 to 5 minutes.',
      'Video must be recorded in a single continuous take without cuts, editing transitions, or video effects.',
      'Audio must be clearly audible (live accompaniment or pre-recorded classical track).',
      'Classical attire and traditional ghungroos/anklets are required.',
      'Submissions must be uploaded prior to the submission deadline.',
      'Plagiarism or uploading performances by other artists will result in immediate disqualification without refund.'
    ],
    eligibility: [
      'Open to solo dancers of all age groups (Junior: 6-14, Senior: 15-25, Open: 26+).',
      'Open to participants from India and international dancers of Indian classical forms.',
      'Beginner, intermediate, and advanced practitioners are all welcomed.'
    ],
    rewards: [
      { rank: 1, title: '1st Winner', amount: 550, iconType: 'trophy_gold' },
      { rank: 2, title: '2nd Winner', amount: 300, iconType: 'trophy_silver' },
      { rank: 3, title: '3rd Winner', amount: 240, iconType: 'trophy_bronze' },
      { rank: 4, title: '4th Winner', amount: 200, iconType: 'star' },
      { rank: 5, title: '5th Winner', amount: 130, iconType: 'star' },
      { rank: 6, title: '6th Winner', amount: 80, iconType: 'star' }
    ],
    disclaimer: 'Only contributions from paid participants will be considered for judging.',
    refundPolicy: 'Full refund is supported if cancellation request is initiated before registration closing date. No refunds after judging begins.',
    paymentInformation: {
      provider: 'Razorpay',
      poweredBy: 'Razorpay 256-bit Encrypted Payments',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      description: 'Prize money will be transferred directly via UPI / NEFT within 48 hours of result announcement to the verified bank account or UPI ID registered by the winner.'
    },
    referralInformation: {
      code: 'referral123',
      url: 'https://feedants.com/r/referral123',
      rewardAmount: 10,
      description: 'You earn ₹10 for every signup'
    },
    reviews: [
      {
        id: 'rev1',
        name: 'Ananya Deshmukh',
        rating: 5,
        comment: 'Super organized! The feedback from Judge Manju was so detailed and helped me prepare for my Gandharva exams.',
        city: 'Pune',
        date: '2 weeks ago',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'rev2',
        name: 'Karthik Raman',
        rating: 5,
        comment: 'Received my ₹550 prize directly into my Google Pay within 24 hours of results. Very transparent and fair judging.',
        city: 'Chennai',
        date: '1 month ago',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 'rev3',
        name: 'Sunita Sen',
        rating: 5,
        comment: 'Wonderful initiative by Feedants for nurturing traditional performing arts in the digital era.',
        city: 'Kolkata',
        date: '1 month ago',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
      }
    ]
  });

  // 3. User Riya is ALREADY registered (participant 1)
  const riyaReg = await RegistrationModel.create({
    _id: 'reg_riya_001',
    userId: userRiya._id,
    competitionId: competition._id,
    registrationStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentReference: 'PAY_RZP_RIA99824',
    amountPaid: 99,
    registeredAt: new Date(now.getTime() - 24 * 3600 * 1000),
    submissionStatus: 'NOT_SUBMITTED',
  });

  // 4. User Priya is registered AND has a submission
  // Note: we can also create another registration for Priya if needed, or leave spots at 1/20 for exact screen match!
  // To keep 1/20 Booked and 19 spots left exactly as in the design reference image, only Riya is pre-booked!

  console.log(`[Seed] Seeded competition: ${competition.title} (_id: ${competition._id})`);
  console.log(`[Seed] Seeded 4 users. Active default user: Riya Shah (Registered)`);
}
