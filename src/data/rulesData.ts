import {
  SkillKey,
  CharacteristicKey,
  DifficultyTier,
  ArchetypeKey,
  Privilege,
  WeaponCategory,
  DebtCurrency,
  DegreeResult,
} from '../types';

export interface SkillDefinition {
  key: SkillKey;
  name: string;
  characteristic: CharacteristicKey;
  isPhysical: boolean;
  domain: string;
}

export const CHARACTERISTICS: Record<CharacteristicKey, { name: string; desc: string }> = {
  perception: {
    name: 'Perception',
    desc: 'Acuité sensorielle, sens de l\'observation, intuition du détail.',
  },
  presence: {
    name: 'Présence',
    desc: 'Charisme, autorité naturelle, aisance sociale.',
  },
  vigueur: {
    name: 'Vigueur',
    desc: 'Force physique, endurance, robustesse naturelle.',
  },
  sang_froid: {
    name: 'Sang-froid',
    desc: 'Résistance nerveuse, calme instinctif, contrôle de soi.',
  },
};

export const SKILLS: Record<SkillKey, SkillDefinition> = {
  investigation: {
    key: 'investigation',
    name: 'Investigation',
    characteristic: 'perception',
    isPhysical: false,
    domain: 'Scène de crime, fouille, perquisition, lecture des traces au sol.',
  },
  medecine_legale: {
    key: 'medecine_legale',
    name: 'Médecine légale',
    characteristic: 'perception',
    isPhysical: false,
    domain: 'Corps, blessures, autopsie, poisons, datation de la mort.',
  },
  erudition: {
    key: 'erudition',
    name: 'Érudition',
    characteristic: 'perception',
    isPhysical: false,
    domain: 'Archives, droit, histoire locale, généalogies, codes et chiffres.',
  },
  techniques_modernes: {
    key: 'techniques_modernes',
    name: 'Techniques modernes',
    characteristic: 'perception',
    isPhysical: false,
    domain: 'Photographie, empreintes, portrait parlé, sténographie, télégraphe et TSF.',
  },
  interrogatoire: {
    key: 'interrogatoire',
    name: 'Interrogatoire',
    characteristic: 'presence',
    isPhysical: false,
    domain: 'Faire parler un témoin, un suspect, un enfant, un notable.',
  },
  persuasion: {
    key: 'persuasion',
    name: 'Persuasion / Charme',
    characteristic: 'presence',
    isPhysical: false,
    domain: 'Convaincre, négocier, obtenir un service, désamorcer.',
  },
  reseau: {
    key: 'reseau',
    name: 'Réseau',
    characteristic: 'presence',
    isPhysical: false,
    domain: 'Indicateurs, contacts, journalistes, collègues d\'autres services.',
  },
  langues: {
    key: 'langues',
    name: 'Langues',
    characteristic: 'vigueur',
    isPhysical: false,
    domain: 'Langues étrangères et régionales, argots de métier et du milieu.',
  },
  combat_armes: {
    key: 'combat_armes',
    name: 'Combat et armes',
    characteristic: 'vigueur',
    isPhysical: true,
    domain: 'Rixe, maîtrise d\'un homme, revolver — rare et bruyant.',
  },
  poursuite_athletisme: {
    key: 'poursuite_athletisme',
    name: 'Poursuite / Athlétisme',
    characteristic: 'vigueur',
    isPhysical: true,
    domain: 'Courir, grimper, forcer, tenir un effort.',
  },
  conduite_mecanique: {
    key: 'conduite_mecanique',
    name: 'Conduite et mécanique',
    characteristic: 'vigueur',
    isPhysical: true,
    domain: 'Automobile, motocyclette, bicyclette, pannes et réparations de fortune.',
  },
  filature_discretion: {
    key: 'filature_discretion',
    name: 'Filature / Discrétion',
    characteristic: 'sang_froid',
    isPhysical: false,
    domain: 'Suivre, se poster, ne pas être vu, tenir une planque.',
  },
  couverture: {
    key: 'couverture',
    name: 'Couverture',
    characteristic: 'sang_froid',
    isPhysical: false,
    domain: 'Composer une apparence, tenir un rôle, mentir longtemps.',
  },
  bureaucratie: {
    key: 'bureaucratie',
    name: 'Bureaucratie',
    characteristic: 'sang_froid',
    isPhysical: false,
    domain: 'Rapports, réquisitions, procédure, frais de mission, magistrature.',
  },
  intuition: {
    key: 'intuition',
    name: 'Intuition',
    characteristic: 'sang_froid',
    isPhysical: false,
    domain: 'Sentir le mensonge, repérer l\'anomalie, flairer la fausse note.',
  },
};

export const SKILL_RANKS = [
  { rank: 0, label: 'Non formé', bonus: 0 },
  { rank: 1, label: 'Novice', bonus: 1 },
  { rank: 2, label: 'Correct', bonus: 2 },
  { rank: 3, label: 'Spécialiste', bonus: 3 },
  { rank: 4, label: 'Maître', bonus: 4 },
];

export const DIFFICULTIES: Record<
  DifficultyTier,
  {
    tier: DifficultyTier;
    label: string;
    modifier: number;
    indice: number;
    feel: string;
    typicalOpponent: string;
  }
> = {
  triviale: {
    tier: 'triviale',
    label: 'Triviale',
    modifier: +2,
    indice: 0,
    feel: 'Geste presque automatique pour un professionnel.',
    typicalOpponent: 'Figurant (foule, badaud, garçon de salle)',
  },
  facile: {
    tier: 'facile',
    label: 'Facile',
    modifier: +1,
    indice: 1,
    feel: 'Action attendue, sans grande tension.',
    typicalOpponent: 'Figurant / Sbire',
  },
  moderee: {
    tier: 'moderee',
    label: 'Modérée',
    modifier: 0,
    indice: 2,
    feel: 'Difficulté de référence pour une scène normale.',
    typicalOpponent: 'Sbire ordinaire (homme de main, complice)',
  },
  difficile: {
    tier: 'difficile',
    label: 'Difficile',
    modifier: -1,
    indice: 3,
    feel: 'Forte opposition, pression, enjeu réel.',
    typicalOpponent: 'Sbire endurci / Boss',
  },
  extreme: {
    tier: 'extreme',
    label: 'Extrême',
    modifier: -2,
    indice: 4,
    feel: 'Exploit, pari dangereux, scène mémorable.',
    typicalOpponent: 'Boss (Antagoniste principal dangereux)',
  },
  cauchemardesque: {
    tier: 'cauchemardesque',
    label: 'Cauchemardesque',
    modifier: -3,
    indice: 5,
    feel: 'Hors norme. Réservé aux Opposants d\'exception.',
    typicalOpponent: 'Boss exceptionnel',
  },
};

export const ARCHETYPES: Record<
  ArchetypeKey,
  {
    key: ArchetypeKey;
    name: string;
    description: string;
    privileges: Privilege[];
  }
> = {
  inspecteur_principal: {
    key: 'inspecteur_principal',
    name: 'Inspecteur principal',
    description: 'Vingt à trente ans de service. Dirige l\'équipe, porte la responsabilité hiérarchique et connaît les ficelles administratives.',
    privileges: [
      {
        id: 'poids_du_grade',
        name: 'Le poids du grade',
        archetype: 'inspecteur_principal',
        type: 'metier',
        bonus: 1,
        targetSkills: ['interrogatoire', 'persuasion', 'bureaucratie', 'reseau'],
        trigger: 'Tout échange avec une administration, une police locale ou une autorité officielle.',
        description: 'Métier (+1) : Échange officiel avec administration ou autorité.',
      },
      {
        id: 'autorite_de_facade',
        name: 'Autorité de façade',
        archetype: 'inspecteur_principal',
        type: 'appui',
        bonus: 2,
        targetSkills: ['interrogatoire', 'persuasion'],
        trigger: 'Face à un notable ou une autorité externe qui vous croit son égal.',
        description: 'Appui (+2) : Face à un notable qui vous croit son égal.',
      },
      {
        id: 'vieux_dossiers',
        name: 'Vieux dossiers',
        archetype: 'inspecteur_principal',
        type: 'appui',
        bonus: 2,
        targetSkills: ['erudition', 'bureaucratie'],
        trigger: 'Retrouver un précédent administratif ou judiciaire grâce à l\'ancienneté.',
        description: 'Appui (+2) : Retrouver un précédent administratif ou judiciaire.',
      },
    ],
  },
  sous_inspecteur: {
    key: 'sous_inspecteur',
    name: 'Sous-inspecteur',
    description: 'Sorti dans les premiers de sa promotion, convaincu que la loi est le meilleur outil de justice sociale.',
    privileges: [
      {
        id: 'jambes_et_souffle',
        name: 'Jambes et souffle',
        archetype: 'sous_inspecteur',
        type: 'metier',
        bonus: 1,
        targetSkills: ['poursuite_athletisme', 'combat_armes', 'filature_discretion'],
        trigger: 'Toute scène d\'effort physique, de terrain ou d\'urgence soudaine.',
        description: 'Métier (+1) : Scène d\'effort physique, de terrain ou d\'urgence.',
      },
      {
        id: 'fougue_premier_assaut',
        name: 'Fougue du premier assaut',
        archetype: 'sous_inspecteur',
        type: 'appui',
        bonus: 2,
        targetSkills: ['combat_armes', 'poursuite_athletisme'],
        trigger: 'Au tout premier échange d\'une confrontation déclenchée par surprise.',
        description: 'Appui (+2) : Premier échange d\'une confrontation par surprise.',
      },
      {
        id: 'endurance_jeune_chien',
        name: 'L\'endurance du jeune chien',
        archetype: 'sous_inspecteur',
        type: 'appui',
        bonus: 2,
        targetSkills: ['filature_discretion', 'poursuite_athletisme'],
        trigger: 'Quand une surveillance ou une poursuite s\'étire au-delà du raisonnable.',
        description: 'Appui (+2) : Surveillance ou poursuite qui s\'étire.',
      },
    ],
  },
  medecin_legiste: {
    key: 'medecin_legiste',
    name: 'Médecin légiste',
    description: 'Formé aux nouvelles méthodes scientifiques. Croit que les morts ne mentent jamais.',
    privileges: [
      {
        id: 'oeil_clinique',
        name: 'Œil clinique',
        archetype: 'medecin_legiste',
        type: 'metier',
        bonus: 1,
        targetSkills: ['medecine_legale', 'investigation', 'techniques_modernes'],
        trigger: 'Tout examen d\'un corps, d\'une blessure ou d\'une preuve matérielle.',
        description: 'Métier (+1) : Examen d\'un corps, blessure ou preuve matérielle.',
      },
      {
        id: 'diagnostic_de_terrain',
        name: 'Diagnostic de terrain',
        archetype: 'medecin_legiste',
        type: 'appui',
        bonus: 2,
        targetSkills: ['medecine_legale'],
        trigger: 'En conditions dégradées, hors laboratoire, sans le matériel qu\'il faudrait.',
        description: 'Appui (+2) : En conditions dégradées, hors laboratoire.',
      },
      {
        id: 'autorite_scientifique',
        name: 'Autorité scientifique',
        archetype: 'medecin_legiste',
        type: 'appui',
        bonus: 2,
        targetSkills: ['persuasion', 'interrogatoire'],
        trigger: 'Faire accepter une conclusion médicale à un sceptique (juge, confrère, hiérarchie).',
        description: 'Appui (+2) : Faire accepter une conclusion médicale à un sceptique.',
      },
    ],
  },
  secretaire_auxiliaire: {
    key: 'secretaire_auxiliaire',
    name: 'Secrétaire auxiliaire',
    description: 'Poste administratif discret. Accède par son statut moins intimidant à des informations inaccessibles aux inspecteurs en uniforme.',
    privileges: [
      {
        id: 'ce_qu_on_dit_devant_elle',
        name: 'Ce qu\'on dit devant elle',
        archetype: 'secretaire_auxiliaire',
        type: 'metier',
        bonus: 1,
        targetSkills: ['interrogatoire', 'persuasion', 'intuition'],
        trigger: 'Toute conversation où l\'interlocuteur ne vous prend pas pour un policier.',
        description: 'Métier (+1) : Conversation où on ne vous prend pas pour la police.',
      },
      {
        id: 'passe_partout_discret',
        name: 'Passe-partout discret',
        archetype: 'secretaire_auxiliaire',
        type: 'appui',
        bonus: 2,
        targetSkills: ['filature_discretion', 'bureaucratie'],
        trigger: 'Accéder à un lieu privé ou à un document confidentiel sans forcer.',
        description: 'Appui (+2) : Accéder à un lieu privé ou document sans forcer.',
      },
      {
        id: 'memoire_des_habitudes',
        name: 'Mémoire des habitudes',
        archetype: 'secretaire_auxiliaire',
        type: 'appui',
        bonus: 2,
        targetSkills: ['intuition', 'erudition'],
        trigger: 'Repérer l\'anomalie dans la routine d\'un foyer, d\'un bureau ou d\'un registre.',
        description: 'Appui (+2) : Repérer l\'anomalie dans une routine ou registre.',
      },
    ],
  },
  auxiliaire_terrain: {
    key: 'auxiliaire_terrain',
    name: 'Auxiliaire de terrain',
    description: 'Issu des milieux populaires et interlopes que la Brigade surveille. Statut fragile mais entrées indispensables.',
    privileges: [
      {
        id: 'connait_les_codes',
        name: 'Connaît les codes',
        archetype: 'auxiliaire_terrain',
        type: 'metier',
        bonus: 1,
        targetSkills: ['filature_discretion', 'couverture', 'intuition', 'langues'],
        trigger: 'En terrain familier : quartiers populaires, milieux ouvriers ou interlopes.',
        description: 'Métier (+1) : Milieux populaires, quartiers ouvriers ou pègre.',
      },
      {
        id: 'contact_en_coulisses',
        name: 'Contact en coulisses',
        archetype: 'auxiliaire_terrain',
        type: 'appui',
        bonus: 2,
        targetSkills: ['reseau', 'persuasion'],
        trigger: 'Obtenir une information ou un service d\'un contact du milieu.',
        description: 'Appui (+2) : Information ou service d\'un contact du milieu.',
      },
      {
        id: 'ancienne_complicite',
        name: 'Ancienne complicité',
        archetype: 'auxiliaire_terrain',
        type: 'appui',
        bonus: 2,
        targetSkills: ['interrogatoire', 'persuasion'],
        trigger: 'Face à une personne qui a partagé son passé — et qui ne l\'a pas oublié.',
        description: 'Appui (+2) : Face à un proche qui partage son passé.',
      },
    ],
  },
};

export const WEAPONS: Record<
  WeaponCategory,
  { name: string; damage: number; damageDoubled: number; examples: string }
> = {
  legere: {
    name: 'Légère',
    damage: 1,
    damageDoubled: 2,
    examples: 'Poing, matraque, nerf de bœuf, surin, canne plombée',
  },
  moyenne: {
    name: 'Moyenne',
    damage: 2,
    damageDoubled: 4,
    examples: 'Sabre, revolver d\'ordonnance, browning, coup de crosse',
  },
  lourde: {
    name: 'Lourde',
    damage: 3,
    damageDoubled: 6,
    examples: 'Fusil, explosif, chute grave, voiture lancée',
  },
};

export const DEBT_CURRENCIES: Record<
  DebtCurrency,
  { name: string; desc: string; example: string }
> = {
  journee: {
    name: 'Une journée',
    desc: 'L\'affaire perd un jour.',
    example: 'Le registre arrivera par courrier, le laboratoire est débordé, le témoin n\'est pas là avant demain.',
  },
  trace: {
    name: 'Une trace',
    desc: 'Un Lien se déplace d\'un point, ou l\'Attitude glisse d\'un cran.',
    example: 'Monnaie fréquente en Social. Le témoin se braque ou s\'en souvient.',
  },
  marque: {
    name: 'Une marque',
    desc: 'Un seuil de blessure, une entorse, un vêtement déchiré.',
    example: 'Une nuit blanche qui pèsera demain ou un coup reçu au passage.',
  },
  piece: {
    name: 'Une pièce',
    desc: 'Ce qui manquera au dossier.',
    example: 'Un scellé perdu, une plaque voilée, un document égaré, un témoin disparu.',
  },
  bruit: {
    name: 'Du bruit',
    desc: 'Quelqu\'un a remarqué. On est vu.',
    example: 'Le suspect, un confrère jaloux, un journaliste, la hiérarchie est alertée.',
  },
};

export const PURSUIT_COMPLICATIONS = [
  {
    d8: 1,
    title: 'Porte cochère',
    desc: 'Un attelage débouche d\'une porte cochère — sauter, rouler, ou perdre trois secondes.',
  },
  {
    d8: 2,
    title: 'Étal renversé',
    desc: 'Le fuyard renverse un étal ou une échelle derrière lui ; la rue entière prend parti, pas forcément pour la police.',
  },
  {
    d8: 3,
    title: 'Sergent de ville zélé',
    desc: 'Un sergent de ville surgit et s\'en prend… au poursuivant en civil. Les papiers, vite.',
  },
  {
    d8: 4,
    title: 'Tramway en marche',
    desc: 'Le fuyard saute dans un tramway en marche. Le suivre, ou couper par la rue parallèle ?',
  },
  {
    d8: 5,
    title: 'Marché ou sortie d\'église',
    desc: 'Passage dans un marché, une sortie d\'usine ou d\'église : la foule avale tout le monde.',
  },
  {
    d8: 6,
    title: 'Escalier et toitures',
    desc: 'Escalier de service, toits, palissade de chantier — le terrain avantage le plus léger, pas le plus rapide.',
  },
  {
    d8: 7,
    title: 'Objet jeté',
    desc: 'Le fuyard jette quelque chose dans une bouche d\'égout, une charrette, la rivière. Continuer, ou marquer l\'endroit ?',
  },
  {
    d8: 8,
    title: 'Complice en embuscade',
    desc: 'Il ne fuyait pas au hasard : au coin suivant, un complice attend. La poursuite change de nature.',
  },
];

export const TIME_COST_ACTIONS = [
  { label: 'Scène ordinaire, conversation, test réussi', days: 0 },
  { label: 'Télégramme à l\'identité judiciaire (réponse dans la journée)', days: 0 },
  { label: 'Dossier complet, sommiers, casier, bureau de recrutement', days: 1 },
  { label: 'Analyse courante : empreintes, taches de sang, encres', days: 1 },
  { label: 'Analyse lourde : toxicologie, balistique, expertises', days: 2 },
  { label: 'Expertise de traces : poussières, fibres, boue (majeur)', days: 3 },
  { label: 'Déplacement vers un autre ressort, exhumation, planque > 1j', days: 1 },
  { label: 'Coût immédiat payé en « une journée »', days: 1 },
];

export const DEGREE_DESCRIPTIONS: Record<
  DegreeResult,
  {
    label: string;
    colorBadge: string;
    bgBadge: string;
    borderBadge: string;
    enquete: string;
    social: string;
    physique: string;
    general: string;
  }
> = {
  echec_critique: {
    label: 'Échec critique',
    colorBadge: 'text-red-700 dark:text-red-400',
    bgBadge: 'bg-red-100 dark:bg-red-950/70',
    borderBadge: 'border-red-600',
    general: 'L\'action échoue et la situation s\'aggrave nettement.',
    enquete: 'Une mauvaise piste est suivie, un indice est abîmé, ou une alerte est déclenchée.',
    social: 'La scène tourne à l\'humiliation ou à la rupture. Il ne dit rien et agit (alerte, avocat). Son attitude descend d\'un cran et le Lien perd 1.',
    physique: 'Le personnage encaisse les dégâts de l\'arme adverse doublés.',
  },
  echec: {
    label: 'Échec',
    colorBadge: 'text-amber-800 dark:text-amber-400',
    bgBadge: 'bg-amber-100 dark:bg-amber-950/70',
    borderBadge: 'border-amber-600',
    general: 'L\'action échoue, sans conséquence supplémentaire grave.',
    enquete: 'L\'information est obtenue, mais tardivement ou de façon incomplète.',
    social: 'Il refuse, mais reste accessible plus tard par un autre chemin. Le Lien perd 1 ou trace narrative.',
    physique: 'L\'attaque échoue et le personnage encaisse les dégâts normaux de l\'arme adverse.',
  },
  ambivalent: {
    label: 'Ambivalent',
    colorBadge: 'text-blue-800 dark:text-blue-300',
    bgBadge: 'bg-blue-100 dark:bg-blue-950/70',
    borderBadge: 'border-blue-600',
    general: 'Résultat mitigé : on obtient, mais on paie un prix (« Vous l\'obtenez, mais... »).',
    enquete: 'L\'information utile est obtenue, avec un petit coût annexe (temps, discrétion, faveur).',
    social: 'L\'objectif est atteint, mais au prix d\'une dette, d\'une promesse ou d\'une petite compromission.',
    physique: 'Zone neutre : ni dégât infligé, ni dégât subi. La position change (on gagne un pas, on perd un appui).',
  },
  reussite: {
    label: 'Réussite',
    colorBadge: 'text-emerald-800 dark:text-emerald-400',
    bgBadge: 'bg-emerald-100 dark:bg-emerald-950/70',
    borderBadge: 'border-emerald-600',
    general: 'L\'objectif est atteint proprement.',
    enquete: 'L\'information est obtenue proprement.',
    social: 'Il coopère sans complication notable. Le Lien gagne 1 ou rien du tout.',
    physique: 'Le personnage inflige à son adversaire les dégâts normaux de son arme.',
  },
  reussite_majeure: {
    label: 'Réussite majeure',
    colorBadge: 'text-purple-800 dark:text-purple-300',
    bgBadge: 'bg-purple-100 dark:bg-purple-950/70',
    borderBadge: 'border-purple-600',
    general: 'L\'objectif est dépassé, avec un bénéfice supplémentaire.',
    enquete: 'L\'information est obtenue avec un bonus : détail supplémentaire, gain de temps ou piste bonus.',
    social: 'Il coopère pleinement et devient un contact durable et favorable. L\'attitude monte d\'un cran et le Lien gagne 1.',
    physique: 'Le personnage inflige les dégâts de son arme doublés.',
  },
};

export const XP_CHECKLIST = [
  { id: 'participe', label: 'A participé au scénario — le personnage était là et a joué.', xp: 1 },
  { id: 'resolue', label: 'Affaire résolue — la Brigade a abouti, même imparfaitement (pour tous).', xp: 1 },
  { id: 'avance', label: 'A fait avancer l\'enquête — recoupement, question décisive, déblocage.', xp: 1 },
  { id: 'personnage', label: 'A joué son personnage — archétype, accroc, décision non avantageuse.', xp: 1 },
  { id: 'trace', label: 'A laissé une trace — Lien déplacé, Attitude glissée, conséquence durable.', xp: 1 },
];

export const SKILL_XP_COSTS: Record<number, Record<number, number>> = {
  // Carac level: { 0->1: cost, 1->2: cost, 2->3: cost, 3->4: cost }
  1: { 1: 3, 2: 4, 3: 6, 4: 12 },
  2: { 1: 2, 2: 3, 3: 5, 4: 11 },
  3: { 1: 1, 2: 2, 3: 4, 4: 10 },
  4: { 1: 1, 2: 1, 3: 3, 4: 8 },
};
