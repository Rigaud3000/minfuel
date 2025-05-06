// Language translations for the MindFuel app

// Define supported languages
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

// Define translation keys structure
export interface Translations {
  general: {
    appName: string;
    loading: string;
    error: string;
    settings: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    search: string;
    success: string;
    great: string;
    good: string;
    okay: string;
    rough: string;
    none: string;
    mild: string;
    strong: string;
    intense: string;
    howAreYouFeeling: string;
    selectMood: string;
    checkinSaved: string;
    saving: string;
    saveCheckin: string;
    of: string;
    complete: string;
    viewDetails: string;
    noResults: string;
  };
  navigation: {
    home: string;
    challenges: string;
    foodScanner: string;
    aiCoach: string;
    progress: string;
    profile: string;
    settings: string;
    subscription: string;
  };
  auth: {
    login: string;
    logout: string;
    register: string;
    email: string;
    password: string;
    name: string;
    forgotPassword: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    createAccount: string;
  };
  home: {
    welcome: string;
    todaysTasks: string;
    currentChallenge: string;
    healthTip: string;
    leaderboard: string;
    progress: string;
    streak: string;
    points: string;
    rank: string;
    viewAll: string;
    readMore: string;
    markComplete: string;
    completed: string;
    day: string;
    days: string;
  };
  challenges: {
    title: string;
    active: string;
    completed: string;
    available: string;
    startChallenge: string;
    continueChallenge: string;
    completeChallenge: string;
    duration: string;
    currentChallenge: string;
    noAvailable: string;
  };
  progress: {
    title: string;
    weekly: string;
    monthly: string;
    total: string;
    sugarFreeDays: string;
    cravingScore: string;
    tasksCompleted: string;
    dailyProgress: string;
  };
  profile: {
    title: string;
    editProfile: string;
    preferences: string;
    achievements: string;
    stats: string;
    completedChallenges: string;
    cleanEatingJourney: string;
    tasksCompleted: string;
    sugarFreeDays: string;
    cravingScore: string;
    unlocked: string;
    streak: string;
    signOut: string;
  };
  aiCoach: {
    title: string;
    newChat: string;
    typeMessage: string;
    send: string;
    startConversation: string;
    conversationPlaceholder: string;
  };
  foodScanner: {
    title: string;
    scanFood: string;
    camera: string;
    history: string;
    enableCamera: string;
    scanningTips: string;
    alternatives: string;
    scanComplete: string;
    nutritionInfo: string;
    ingredients: string;
    additives: string;
    highSugar: string;
    mediumSugar: string;
    lowSugar: string;
    sugarRating: string;
    calories: string;
    sugars: string;
    carbs: string;
    protein: string;
    noHistory: string;
    scanAgain: string;
  };
  subscription: {
    title: string;
    choosePlan: string;
    monthly: string;
    annual: string;
    savePercent: string;
    free: string;
    pro: string;
    premium: string;
    currentPlan: string;
    subscribe: string;
    subscriptionBenefits: string;
    subscribeToName: string;
    paymentInfo: string;
    cardDetails: string;
    processing: string;
    paymentFailed: string;
    subscriptionActive: string;
    features: {
      challenges: string;
      progress: string;
      leaderboard: string;
      healthTips: string;
      aiCoaching: string;
      foodScanner: string;
      adFree: string;
      premiumChallenges: string;
      mealPlans: string;
      analytics: string;
      unlimitedAI: string;
      unlimitedScanner: string;
    };
  };
  language: {
    language: string;
    english: string;
    spanish: string;
    french: string;
    german: string;
    chinese: string;
  };
}

// English translations (default)
export const en: Translations = {
  general: {
    appName: 'MindFuel',
    loading: 'Loading...',
    error: 'Something went wrong',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    success: 'Success',
    great: 'Great',
    good: 'Good',
    okay: 'Okay',
    rough: 'Rough',
    none: 'None',
    mild: 'Mild',
    strong: 'Strong',
    intense: 'Intense',
    howAreYouFeeling: 'How are you feeling today?',
    selectMood: 'Please select your mood',
    checkinSaved: 'Your daily check-in has been recorded',
    saving: 'Saving...',
    saveCheckin: 'Save Today\'s Check-in',
    of: 'of',
    complete: 'Complete',
    viewDetails: 'View Details',
    noResults: 'No results found',
  },
  navigation: {
    home: 'Home',
    challenges: 'Challenges',
    foodScanner: 'Food Scanner',
    aiCoach: 'AI Coach',
    progress: 'Progress',
    profile: 'Profile',
    settings: 'Settings',
    subscription: 'Premium',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    forgotPassword: 'Forgot password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    createAccount: 'Create account',
  },
  home: {
    welcome: 'Welcome',
    todaysTasks: "Today's Tasks",
    currentChallenge: 'Current Challenge',
    healthTip: 'Health Tip',
    leaderboard: 'Leaderboard',
    progress: 'Progress',
    streak: 'Streak',
    points: 'Points',
    rank: 'Rank',
    viewAll: 'View All',
    readMore: 'Read More',
    markComplete: 'Mark Complete',
    completed: 'Completed',
    day: 'Day',
    days: 'Days',
  },
  challenges: {
    title: 'Challenges',
    active: 'Active',
    completed: 'Completed',
    available: 'Available',
    startChallenge: 'Start Challenge',
    continueChallenge: 'Continue',
    completeChallenge: 'Complete',
    duration: 'Duration',
    currentChallenge: 'Current Challenge',
    noAvailable: 'No available challenges found',
  },
  progress: {
    title: 'Progress',
    weekly: 'Weekly',
    monthly: 'Monthly',
    total: 'Total',
    sugarFreeDays: 'Sugar-Free Days',
    cravingScore: 'Craving Score',
    tasksCompleted: 'Tasks Completed',
    dailyProgress: 'Daily Progress',
  },
  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    preferences: 'Preferences',
    achievements: 'Achievements',
    stats: 'Your Stats',
    completedChallenges: 'Completed Challenges',
    cleanEatingJourney: 'Clean Eating Journey',
    tasksCompleted: 'Tasks Completed',
    sugarFreeDays: 'Sugar-Free Days',
    cravingScore: 'Avg. Craving Score',
    unlocked: 'Unlocked',
    streak: 'Streak',
    signOut: 'Sign Out',
  },
  aiCoach: {
    title: 'AI Coach',
    newChat: 'New Chat',
    typeMessage: 'Type a message...',
    send: 'Send',
    startConversation: 'Start a conversation',
    conversationPlaceholder: 'Ask about nutrition, cravings, or healthy eating habits',
  },
  foodScanner: {
    title: 'Food Scanner',
    scanFood: 'Scan Food',
    camera: 'Camera',
    history: 'Scan History',
    enableCamera: 'Enable Camera',
    scanningTips: 'Scanning Tips',
    alternatives: 'Healthier Alternatives',
    scanComplete: 'Scan Complete',
    nutritionInfo: 'Nutrition Information',
    ingredients: 'Ingredients',
    additives: 'Additives',
    highSugar: 'High Sugar',
    mediumSugar: 'Moderate Sugar',
    lowSugar: 'Low Sugar',
    sugarRating: 'Sugar Content Analysis',
    calories: 'Calories',
    sugars: 'Sugars',
    carbs: 'Carbs',
    protein: 'Protein',
    noHistory: 'No scan history yet',
    scanAgain: 'Scan Again',
  },
  subscription: {
    title: 'Premium Subscription',
    choosePlan: 'Choose the plan that fits your needs',
    monthly: 'Monthly',
    annual: 'Annual',
    savePercent: 'Save up to',
    free: 'Free',
    pro: 'Pro',
    premium: 'Premium',
    currentPlan: 'Current Plan',
    subscribe: 'Subscribe',
    subscriptionBenefits: 'Subscription Benefits',
    subscribeToName: 'Subscribe to',
    paymentInfo: 'Payment Information',
    cardDetails: 'Card Details',
    processing: 'Processing...',
    paymentFailed: 'Payment Failed',
    subscriptionActive: 'Subscription Active',
    features: {
      challenges: 'Daily challenges',
      progress: 'Progress tracking',
      leaderboard: 'Community leaderboard',
      healthTips: 'Basic health tips',
      aiCoaching: 'AI coaching',
      foodScanner: 'Food scanner',
      adFree: 'Ad-free experience',
      premiumChallenges: 'Premium challenges',
      mealPlans: 'Personalized meal plans',
      analytics: 'Advanced analytics',
      unlimitedAI: 'Unlimited AI coaching',
      unlimitedScanner: 'Unlimited food scanning',
    },
  },
  language: {
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    chinese: 'Chinese',
  },
};

// Spanish translations
export const es: Translations = {
  general: {
    appName: 'MindFuel',
    loading: 'Cargando...',
    error: 'Algo salió mal',
    settings: 'Configuración',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    success: 'Éxito',
    great: 'Excelente',
    good: 'Bueno',
    okay: 'Regular',
    rough: 'Difícil',
    none: 'Ninguno',
    mild: 'Leve',
    strong: 'Fuerte',
    intense: 'Intenso',
    howAreYouFeeling: '¿Cómo te sientes hoy?',
    selectMood: 'Por favor selecciona tu estado de ánimo',
    checkinSaved: 'Tu registro diario ha sido guardado',
    saving: 'Guardando...',
    saveCheckin: 'Guardar registro de hoy',
    of: 'de',
    complete: 'Completo',
    viewDetails: 'Ver detalles',
    noResults: 'No se encontraron resultados',
  },
  navigation: {
    home: 'Inicio',
    challenges: 'Desafíos',
    foodScanner: 'Escáner de Alimentos',
    aiCoach: 'Coach AI',
    progress: 'Progreso',
    profile: 'Perfil',
    settings: 'Configuración',
    subscription: 'Premium',
  },
  auth: {
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    register: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    name: 'Nombre',
    forgotPassword: '¿Olvidaste tu contraseña?',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    createAccount: 'Crear cuenta',
  },
  home: {
    welcome: 'Bienvenido',
    todaysTasks: 'Tareas de hoy',
    currentChallenge: 'Desafío actual',
    healthTip: 'Consejo de salud',
    leaderboard: 'Tabla de clasificación',
    progress: 'Progreso',
    streak: 'Racha',
    points: 'Puntos',
    rank: 'Rango',
    viewAll: 'Ver todo',
    readMore: 'Leer más',
    markComplete: 'Marcar como completado',
    completed: 'Completado',
    day: 'Día',
    days: 'Días',
  },
  challenges: {
    title: 'Desafíos',
    active: 'Activo',
    completed: 'Completado',
    available: 'Disponible',
    startChallenge: 'Comenzar desafío',
    continueChallenge: 'Continuar',
    completeChallenge: 'Completar',
    duration: 'Duración',
    currentChallenge: 'Desafío actual',
    noAvailable: 'No hay desafíos disponibles',
  },
  progress: {
    title: 'Progreso',
    weekly: 'Semanal',
    monthly: 'Mensual',
    total: 'Total',
    sugarFreeDays: 'Días sin azúcar',
    cravingScore: 'Puntuación de antojo',
    tasksCompleted: 'Tareas completadas',
    dailyProgress: 'Progreso diario',
  },
  profile: {
    title: 'Perfil',
    editProfile: 'Editar perfil',
    preferences: 'Preferencias',
    achievements: 'Logros',
    stats: 'Tus estadísticas',
    completedChallenges: 'Desafíos completados',
    cleanEatingJourney: 'Viaje de alimentación limpia',
    tasksCompleted: 'Tareas completadas',
    sugarFreeDays: 'Días sin azúcar',
    cravingScore: 'Puntuación promedio de antojo',
    unlocked: 'Desbloqueado',
    streak: 'Racha',
    signOut: 'Cerrar sesión',
  },
  aiCoach: {
    title: 'Coach AI',
    newChat: 'Nuevo chat',
    typeMessage: 'Escribe un mensaje...',
    send: 'Enviar',
    startConversation: 'Iniciar una conversación',
    conversationPlaceholder: 'Pregunta sobre nutrición, antojos o hábitos de alimentación saludable',
  },
  foodScanner: {
    title: 'Escáner de Alimentos',
    scanFood: 'Escanear Alimento',
    camera: 'Cámara',
    history: 'Historial de Escaneos',
    enableCamera: 'Activar Cámara',
    scanningTips: 'Consejos de Escaneo',
    alternatives: 'Alternativas más Saludables',
    scanComplete: 'Escaneo Completo',
    nutritionInfo: 'Información Nutricional',
    ingredients: 'Ingredientes',
    additives: 'Aditivos',
    highSugar: 'Alto en Azúcar',
    mediumSugar: 'Azúcar Moderado',
    lowSugar: 'Bajo en Azúcar',
    sugarRating: 'Análisis de Contenido de Azúcar',
    calories: 'Calorías',
    sugars: 'Azúcares',
    carbs: 'Carbohidratos',
    protein: 'Proteínas',
    noHistory: 'Aún no hay historial de escaneos',
    scanAgain: 'Escanear de Nuevo',
  },
  subscription: {
    title: 'Suscripción Premium',
    choosePlan: 'Elige el plan que se adapte a tus necesidades',
    monthly: 'Mensual',
    annual: 'Anual',
    savePercent: 'Ahorra hasta',
    free: 'Gratis',
    pro: 'Pro',
    premium: 'Premium',
    currentPlan: 'Plan Actual',
    subscribe: 'Suscribirse',
    subscriptionBenefits: 'Beneficios de la Suscripción',
    subscribeToName: 'Suscribirse a',
    paymentInfo: 'Información de Pago',
    cardDetails: 'Detalles de la Tarjeta',
    processing: 'Procesando...',
    paymentFailed: 'Pago Fallido',
    subscriptionActive: 'Suscripción Activa',
    features: {
      challenges: 'Desafíos diarios',
      progress: 'Seguimiento de progreso',
      leaderboard: 'Tabla de clasificación comunitaria',
      healthTips: 'Consejos básicos de salud',
      aiCoaching: 'Entrenamiento con IA',
      foodScanner: 'Escáner de alimentos',
      adFree: 'Experiencia sin anuncios',
      premiumChallenges: 'Desafíos premium',
      mealPlans: 'Planes de comida personalizados',
      analytics: 'Análisis avanzado',
      unlimitedAI: 'Entrenamiento con IA ilimitado',
      unlimitedScanner: 'Escaneo de alimentos ilimitado',
    },
  },
  language: {
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
    german: 'Alemán',
    chinese: 'Chino',
  },
};

// French translations
export const fr: Translations = {
  general: {
    appName: 'MindFuel',
    loading: 'Chargement...',
    error: "Quelque chose s'est mal passé",
    settings: 'Paramètres',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher',
    success: 'Succès',
    great: 'Excellent',
    good: 'Bien',
    okay: 'Correct',
    rough: 'Difficile',
    none: 'Aucun',
    mild: 'Léger',
    strong: 'Fort',
    intense: 'Intense',
    howAreYouFeeling: 'Comment vous sentez-vous aujourd\'hui?',
    selectMood: 'Veuillez sélectionner votre humeur',
    checkinSaved: 'Votre enregistrement quotidien a été sauvegardé',
    saving: 'Enregistrement...',
    saveCheckin: 'Enregistrer le check-in d\'aujourd\'hui',
    of: 'de',
    complete: 'Complet',
    viewDetails: 'Voir détails',
    noResults: 'Aucun résultat trouvé',
  },
  navigation: {
    home: 'Accueil',
    challenges: 'Défis',
    foodScanner: 'Scanner d\'Aliments',
    aiCoach: 'Coach AI',
    progress: 'Progrès',
    profile: 'Profil',
    settings: 'Paramètres',
    subscription: 'Premium',
  },
  auth: {
    login: 'Connexion',
    logout: 'Déconnexion',
    register: "S'inscrire",
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    forgotPassword: 'Mot de passe oublié?',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: "Vous n'avez pas de compte?",
    createAccount: 'Créer un compte',
  },
  home: {
    welcome: 'Bienvenue',
    todaysTasks: "Tâches d'aujourd'hui",
    currentChallenge: 'Défi actuel',
    healthTip: 'Conseil santé',
    leaderboard: 'Classement',
    progress: 'Progrès',
    streak: 'Série',
    points: 'Points',
    rank: 'Rang',
    viewAll: 'Voir tout',
    readMore: 'Lire plus',
    markComplete: 'Marquer comme terminé',
    completed: 'Terminé',
    day: 'Jour',
    days: 'Jours',
  },
  challenges: {
    title: 'Défis',
    active: 'Actif',
    completed: 'Terminé',
    available: 'Disponible',
    startChallenge: 'Commencer le défi',
    continueChallenge: 'Continuer',
    completeChallenge: 'Terminer',
    duration: 'Durée',
    currentChallenge: 'Défi actuel',
    noAvailable: 'Aucun défi disponible',
  },
  progress: {
    title: 'Progrès',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    total: 'Total',
    sugarFreeDays: 'Jours sans sucre',
    cravingScore: 'Score de désir',
    tasksCompleted: 'Tâches terminées',
    dailyProgress: 'Progrès quotidien',
  },
  profile: {
    title: 'Profil',
    editProfile: 'Modifier le profil',
    preferences: 'Préférences',
    achievements: 'Réalisations',
    stats: 'Vos statistiques',
    completedChallenges: 'Défis terminés',
    cleanEatingJourney: 'Parcours d\'alimentation saine',
    tasksCompleted: 'Tâches terminées',
    sugarFreeDays: 'Jours sans sucre',
    cravingScore: 'Score moyen de désir',
    unlocked: 'Débloqué',
    streak: 'Série',
    signOut: 'Déconnexion',
  },
  aiCoach: {
    title: 'Coach AI',
    newChat: 'Nouvelle conversation',
    typeMessage: 'Tapez un message...',
    send: 'Envoyer',
    startConversation: 'Commencer une conversation',
    conversationPlaceholder: 'Posez des questions sur la nutrition, les envies ou les habitudes alimentaires saines',
  },
  foodScanner: {
    title: 'Scanner d\'Aliments',
    scanFood: 'Scanner un Aliment',
    camera: 'Caméra',
    history: 'Historique des Scans',
    enableCamera: 'Activer la Caméra',
    scanningTips: 'Conseils de Scan',
    alternatives: 'Alternatives plus Saines',
    scanComplete: 'Scan Terminé',
    nutritionInfo: 'Information Nutritionnelle',
    ingredients: 'Ingrédients',
    additives: 'Additifs',
    highSugar: 'Sucre Élevé',
    mediumSugar: 'Sucre Modéré',
    lowSugar: 'Sucre Faible',
    sugarRating: 'Analyse de la Teneur en Sucre',
    calories: 'Calories',
    sugars: 'Sucres',
    carbs: 'Glucides',
    protein: 'Protéines',
    noHistory: 'Pas encore d\'historique de scan',
    scanAgain: 'Scanner à Nouveau',
  },
  subscription: {
    title: 'Abonnement Premium',
    choosePlan: 'Choisissez le forfait qui vous convient',
    monthly: 'Mensuel',
    annual: 'Annuel',
    savePercent: 'Économisez jusqu\'à',
    free: 'Gratuit',
    pro: 'Pro',
    premium: 'Premium',
    currentPlan: 'Forfait Actuel',
    subscribe: 'S\'abonner',
    subscriptionBenefits: 'Avantages de l\'Abonnement',
    subscribeToName: 'S\'abonner à',
    paymentInfo: 'Informations de Paiement',
    cardDetails: 'Détails de la Carte',
    processing: 'Traitement en cours...',
    paymentFailed: 'Paiement Échoué',
    subscriptionActive: 'Abonnement Actif',
    features: {
      challenges: 'Défis quotidiens',
      progress: 'Suivi de progrès',
      leaderboard: 'Classement communautaire',
      healthTips: 'Conseils de santé de base',
      aiCoaching: 'Coaching IA',
      foodScanner: 'Scanner d\'aliments',
      adFree: 'Expérience sans publicité',
      premiumChallenges: 'Défis premium',
      mealPlans: 'Plans de repas personnalisés',
      analytics: 'Analyses avancées',
      unlimitedAI: 'Coaching IA illimité',
      unlimitedScanner: 'Scanner d\'aliments illimité',
    },
  },
  language: {
    language: 'Langue',
    english: 'Anglais',
    spanish: 'Espagnol',
    french: 'Français',
    german: 'Allemand',
    chinese: 'Chinois',
  },
};

// German translations
export const de: Translations = {
  general: {
    appName: 'MindFuel',
    loading: 'Wird geladen...',
    error: 'Etwas ist schief gelaufen',
    settings: 'Einstellungen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    search: 'Suchen',
    success: 'Erfolg',
    great: 'Ausgezeichnet',
    good: 'Gut',
    okay: 'In Ordnung',
    rough: 'Schwierig',
    none: 'Keine',
    mild: 'Mild',
    strong: 'Stark',
    intense: 'Intensiv',
    howAreYouFeeling: 'Wie fühlst du dich heute?',
    selectMood: 'Bitte wähle deine Stimmung',
    checkinSaved: 'Dein täglicher Check-in wurde gespeichert',
    saving: 'Speichern...',
    saveCheckin: 'Heutigen Check-in speichern',
    of: 'von',
    complete: 'Vollständig',
    viewDetails: 'Details anzeigen',
    noResults: 'Keine Ergebnisse gefunden',
  },
  navigation: {
    home: 'Startseite',
    challenges: 'Herausforderungen',
    foodScanner: 'Lebensmittelscanner',
    aiCoach: 'KI-Coach',
    progress: 'Fortschritt',
    profile: 'Profil',
    settings: 'Einstellungen',
    subscription: 'Premium',
  },
  auth: {
    login: 'Anmelden',
    logout: 'Abmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    name: 'Name',
    forgotPassword: 'Passwort vergessen?',
    alreadyHaveAccount: 'Bereits ein Konto?',
    dontHaveAccount: 'Kein Konto?',
    createAccount: 'Konto erstellen',
  },
  home: {
    welcome: 'Willkommen',
    todaysTasks: 'Heutige Aufgaben',
    currentChallenge: 'Aktuelle Herausforderung',
    healthTip: 'Gesundheitstipp',
    leaderboard: 'Bestenliste',
    progress: 'Fortschritt',
    streak: 'Serie',
    points: 'Punkte',
    rank: 'Rang',
    viewAll: 'Alle anzeigen',
    readMore: 'Mehr lesen',
    markComplete: 'Als erledigt markieren',
    completed: 'Erledigt',
    day: 'Tag',
    days: 'Tage',
  },
  challenges: {
    title: 'Herausforderungen',
    active: 'Aktiv',
    completed: 'Abgeschlossen',
    available: 'Verfügbar',
    startChallenge: 'Herausforderung starten',
    continueChallenge: 'Fortsetzen',
    completeChallenge: 'Abschließen',
    duration: 'Dauer',
    currentChallenge: 'Aktuelle Herausforderung',
    noAvailable: 'Keine verfügbaren Herausforderungen gefunden',
  },
  progress: {
    title: 'Fortschritt',
    weekly: 'Wöchentlich',
    monthly: 'Monatlich',
    total: 'Gesamt',
    sugarFreeDays: 'Zuckerfreie Tage',
    cravingScore: 'Verlangen-Wert',
    tasksCompleted: 'Erledigte Aufgaben',
    dailyProgress: 'Täglicher Fortschritt',
  },
  profile: {
    title: 'Profil',
    editProfile: 'Profil bearbeiten',
    preferences: 'Einstellungen',
    achievements: 'Erfolge',
    stats: 'Deine Statistiken',
    completedChallenges: 'Abgeschlossene Herausforderungen',
    cleanEatingJourney: 'Clean Eating Reise',
    tasksCompleted: 'Erledigte Aufgaben',
    sugarFreeDays: 'Zuckerfreie Tage',
    cravingScore: 'Durchschnittlicher Verlangen-Wert',
    unlocked: 'Freigeschaltet',
    streak: 'Serie',
    signOut: 'Abmelden',
  },
  aiCoach: {
    title: 'KI-Coach',
    newChat: 'Neuer Chat',
    typeMessage: 'Nachricht eingeben...',
    send: 'Senden',
    startConversation: 'Konversation starten',
    conversationPlaceholder: 'Fragen zu Ernährung, Verlangen oder gesunden Essgewohnheiten',
  },
  foodScanner: {
    title: 'Lebensmittelscanner',
    scanFood: 'Lebensmittel scannen',
    camera: 'Kamera',
    history: 'Scan-Verlauf',
    enableCamera: 'Kamera aktivieren',
    scanningTips: 'Scan-Tipps',
    alternatives: 'Gesündere Alternativen',
    scanComplete: 'Scan abgeschlossen',
    nutritionInfo: 'Nährwertinformationen',
    ingredients: 'Zutaten',
    additives: 'Zusatzstoffe',
    highSugar: 'Hoher Zuckergehalt',
    mediumSugar: 'Mittlerer Zuckergehalt',
    lowSugar: 'Niedriger Zuckergehalt',
    sugarRating: 'Zuckergehalt-Analyse',
    calories: 'Kalorien',
    sugars: 'Zucker',
    carbs: 'Kohlenhydrate',
    protein: 'Protein',
    noHistory: 'Noch kein Scan-Verlauf',
    scanAgain: 'Erneut scannen',
  },
  subscription: {
    title: 'Premium-Abonnement',
    choosePlan: 'Wähle den Tarif, der zu dir passt',
    monthly: 'Monatlich',
    annual: 'Jährlich',
    savePercent: 'Spare bis zu',
    free: 'Kostenlos',
    pro: 'Pro',
    premium: 'Premium',
    currentPlan: 'Aktueller Tarif',
    subscribe: 'Abonnieren',
    subscriptionBenefits: 'Abo-Vorteile',
    subscribeToName: 'Abonnieren von',
    paymentInfo: 'Zahlungsinformationen',
    cardDetails: 'Kartendetails',
    processing: 'Verarbeitung...',
    paymentFailed: 'Zahlung fehlgeschlagen',
    subscriptionActive: 'Abonnement aktiv',
    features: {
      challenges: 'Tägliche Herausforderungen',
      progress: 'Fortschrittsverfolgung',
      leaderboard: 'Community-Bestenliste',
      healthTips: 'Grundlegende Gesundheitstipps',
      aiCoaching: 'KI-Coaching',
      foodScanner: 'Lebensmittelscanner',
      adFree: 'Werbefreie Erfahrung',
      premiumChallenges: 'Premium-Herausforderungen',
      mealPlans: 'Personalisierte Mahlzeitenpläne',
      analytics: 'Erweiterte Analysen',
      unlimitedAI: 'Unbegrenztes KI-Coaching',
      unlimitedScanner: 'Unbegrenzter Lebensmittelscanner',
    },
  },
  language: {
    language: 'Sprache',
    english: 'Englisch',
    spanish: 'Spanisch',
    french: 'Französisch',
    german: 'Deutsch',
    chinese: 'Chinesisch',
  },
};

// Chinese translations
export const zh: Translations = {
  general: {
    appName: 'MindFuel',
    loading: '加载中...',
    error: '出错了',
    settings: '设置',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    success: '成功',
    great: '很好',
    good: '良好',
    okay: '一般',
    rough: '困难',
    none: '无',
    mild: '轻微',
    strong: '强烈',
    intense: '剧烈',
    howAreYouFeeling: '今天感觉如何？',
    selectMood: '请选择您的情绪',
    checkinSaved: '您的每日打卡已记录',
    saving: '保存中...',
    saveCheckin: '保存今日打卡',
    of: '的',
    complete: '完成',
    viewDetails: '查看详情',
    noResults: '未找到结果',
  },
  navigation: {
    home: '首页',
    challenges: '挑战',
    foodScanner: '食品扫描',
    aiCoach: 'AI教练',
    progress: '进度',
    profile: '个人资料',
    settings: '设置',
    subscription: '高级版',
  },
  auth: {
    login: '登录',
    logout: '退出',
    register: '注册',
    email: '邮箱',
    password: '密码',
    name: '姓名',
    forgotPassword: '忘记密码？',
    alreadyHaveAccount: '已有账号？',
    dontHaveAccount: '没有账号？',
    createAccount: '创建账号',
  },
  home: {
    welcome: '欢迎',
    todaysTasks: '今日任务',
    currentChallenge: '当前挑战',
    healthTip: '健康小贴士',
    leaderboard: '排行榜',
    progress: '进度',
    streak: '连续',
    points: '积分',
    rank: '排名',
    viewAll: '查看全部',
    readMore: '阅读更多',
    markComplete: '标记完成',
    completed: '已完成',
    day: '天',
    days: '天',
  },
  challenges: {
    title: '挑战',
    active: '进行中',
    completed: '已完成',
    available: '可用',
    startChallenge: '开始挑战',
    continueChallenge: '继续',
    completeChallenge: '完成',
    duration: '持续时间',
    currentChallenge: '当前挑战',
    noAvailable: '没有可用的挑战',
  },
  progress: {
    title: '进度',
    weekly: '每周',
    monthly: '每月',
    total: '总计',
    sugarFreeDays: '无糖天数',
    cravingScore: '渴望指数',
    tasksCompleted: '已完成任务',
    dailyProgress: '每日进度',
  },
  profile: {
    title: '个人资料',
    editProfile: '编辑资料',
    preferences: '偏好设置',
    achievements: '成就',
    stats: '你的统计',
    completedChallenges: '已完成挑战',
    cleanEatingJourney: '健康饮食之旅',
    tasksCompleted: '已完成任务',
    sugarFreeDays: '无糖天数',
    cravingScore: '平均渴望指数',
    unlocked: '已解锁',
    streak: '连续',
    signOut: '退出登录',
  },
  aiCoach: {
    title: 'AI教练',
    newChat: '新对话',
    typeMessage: '输入消息...',
    send: '发送',
    startConversation: '开始对话',
    conversationPlaceholder: '询问有关营养、渴望或健康饮食习惯的问题',
  },
  foodScanner: {
    title: '食品扫描',
    scanFood: '扫描食品',
    camera: '相机',
    history: '扫描历史',
    enableCamera: '启用相机',
    scanningTips: '扫描提示',
    alternatives: '更健康的替代品',
    scanComplete: '扫描完成',
    nutritionInfo: '营养信息',
    ingredients: '成分',
    additives: '添加剂',
    highSugar: '高糖',
    mediumSugar: '中等糖',
    lowSugar: '低糖',
    sugarRating: '糖含量分析',
    calories: '卡路里',
    sugars: '糖',
    carbs: '碳水化合物',
    protein: '蛋白质',
    noHistory: '暂无扫描历史',
    scanAgain: '再次扫描',
  },
  subscription: {
    title: '高级订阅',
    choosePlan: '选择适合您需求的计划',
    monthly: '每月',
    annual: '每年',
    savePercent: '节省高达',
    free: '免费',
    pro: '专业版',
    premium: '高级版',
    currentPlan: '当前计划',
    subscribe: '订阅',
    subscriptionBenefits: '订阅福利',
    subscribeToName: '订阅',
    paymentInfo: '支付信息',
    cardDetails: '卡片详情',
    processing: '处理中...',
    paymentFailed: '支付失败',
    subscriptionActive: '订阅已激活',
    features: {
      challenges: '每日挑战',
      progress: '进度跟踪',
      leaderboard: '社区排行榜',
      healthTips: '基础健康提示',
      aiCoaching: 'AI教练',
      foodScanner: '食品扫描',
      adFree: '无广告体验',
      premiumChallenges: '高级挑战',
      mealPlans: '个性化餐饮计划',
      analytics: '高级分析',
      unlimitedAI: '无限AI教练',
      unlimitedScanner: '无限食品扫描',
    },
  },
  language: {
    language: '语言',
    english: '英语',
    spanish: '西班牙语',
    french: '法语',
    german: '德语',
    chinese: '中文',
  },
};

// Export all translations
export const translations = {
  en,
  es,
  fr,
  de,
  zh,
};