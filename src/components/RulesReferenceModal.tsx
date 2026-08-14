import React, { useState } from 'react';
import {
  DEGREE_DESCRIPTIONS,
  DIFFICULTIES,
  WEAPONS,
  DEBT_CURRENCIES,
  PURSUIT_COMPLICATIONS,
  TIME_COST_ACTIONS,
  ARCHETYPES,
} from '../data/rulesData';
import { BookOpen, X, ChevronDown, ChevronRight, Shield, Award, Sparkles } from 'lucide-react';

interface RulesReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesReferenceModal({ isOpen, onClose }: RulesReferenceModalProps) {
  const [activeTab, setActiveTab] = useState<'degres' | 'planchers' | 'social' | 'combat' | 'poursuite' | 'couts' | 'archetypes'>('degres');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FDFCF0] dark:bg-stone-900 border-4 border-[#78350f] dark:border-amber-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-stone-900 dark:text-stone-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-300 dark:border-stone-700 pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-amber-800 dark:text-amber-400" />
            <div>
              <h2 className="text-2xl font-cinzel font-bold text-[#78350f] dark:text-amber-400">
                Aide-Mémoire des Règles — Brigades Mobiles 1910
              </h2>
              <p className="text-xs font-serif text-stone-600 dark:text-stone-400 italic">
                Toutes les tables officielles et principes du Système D8
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 border-b border-stone-300 dark:border-stone-700 pb-2">
          {[
            { key: 'degres', label: '1. Table des Degrés' },
            { key: 'planchers', label: '2. Planchers Garantis' },
            { key: 'social', label: '3. Scène Sociale & Liens' },
            { key: 'combat', label: '4. Physique, Armes & Soin' },
            { key: 'poursuite', label: '5. Poursuites D8' },
            { key: 'couts', label: '6. Coûts & Dettes' },
            { key: 'archetypes', label: '7. Archétypes & Privilèges' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-amber-900 text-white dark:bg-amber-700 shadow-sm'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="text-xs space-y-4">
          
          {/* TAB 1: TABLE DES DEGRES */}
          {activeTab === 'degres' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-100/70 dark:bg-stone-800 rounded-lg border border-amber-300 dark:border-stone-700 font-serif">
                <strong>Formule Universelle :</strong> <code>1D8 + Rang de compétence + Difficulté + Avantage net − Désavantage net</code>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border border-stone-300 dark:border-stone-700">
                  <thead className="bg-stone-200 dark:bg-stone-800 font-cinzel font-bold">
                    <tr>
                      <th className="p-2 border">Résultat</th>
                      <th className="p-2 border">Degré</th>
                      <th className="p-2 border">Enquête</th>
                      <th className="p-2 border">Social</th>
                      <th className="p-2 border">Physique</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-serif">
                    <tr>
                      <td className="p-2 border font-mono font-bold">1 ou moins</td>
                      <td className="p-2 border font-bold text-red-700">Échec critique</td>
                      <td className="p-2 border">Mauvaise piste, indice abîmé ou alerte</td>
                      <td className="p-2 border">Rupture, trace négative forte (Lien -1, Att -1)</td>
                      <td className="p-2 border">Dégâts adverses doublés</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-mono font-bold">2 à 3</td>
                      <td className="p-2 border font-bold text-amber-700">Échec</td>
                      <td className="p-2 border">Obtenue tardivement ou incomplète</td>
                      <td className="p-2 border">Refus, mais reste accessible plus tard</td>
                      <td className="p-2 border">Dégâts adverses normaux</td>
                    </tr>
                    <tr className="bg-blue-50/50 dark:bg-blue-950/20">
                      <td className="p-2 border font-mono font-bold text-blue-900 dark:text-blue-300">4 à 6</td>
                      <td className="p-2 border font-bold text-blue-800">Ambivalent (Cœur du jeu)</td>
                      <td className="p-2 border">Obtenue avec un petit coût annexe (« Vous l'obtenez, mais... »)</td>
                      <td className="p-2 border">Atteint au prix d'une dette ou compromission</td>
                      <td className="p-2 border">Zone neutre : ni dégât infligé ni subi</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-mono font-bold">7 à 8</td>
                      <td className="p-2 border font-bold text-emerald-700">Réussite</td>
                      <td className="p-2 border">Obtenue proprement</td>
                      <td className="p-2 border">Coopère sans complication notable</td>
                      <td className="p-2 border">Dégâts infligés normaux</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-mono font-bold">9 ou plus</td>
                      <td className="p-2 border font-bold text-purple-700">Réussite majeure</td>
                      <td className="p-2 border">Obtenue avec un bonus (détail, gain de temps)</td>
                      <td className="p-2 border">Coopère pleinement, devient un contact durable</td>
                      <td className="p-2 border">Dégâts de votre arme doublés</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PLANCHERS GARANTIS */}
          {activeTab === 'planchers' && (
            <div className="space-y-4">
              <p className="font-serif italic text-stone-700 dark:text-stone-300">
                « Dire à voix haute : "au pire, tu obtiens un Ambivalent" avant chaque jet change la nature de la partie : les joueurs cessent de craindre le dé et négocient le prix. » (Chapitre 8)
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-center border border-stone-300 dark:border-stone-700">
                  <thead className="bg-stone-200 dark:bg-stone-800 font-cinzel font-bold text-[11px]">
                    <tr>
                      <th className="p-2 border text-left">Rang</th>
                      <th className="p-2 border">Triviale (+2)</th>
                      <th className="p-2 border">Facile (+1)</th>
                      <th className="p-2 border">Modérée (0)</th>
                      <th className="p-2 border">Difficile (-1)</th>
                      <th className="p-2 border">Extrême (-2)</th>
                      <th className="p-2 border">Cauchemar (-3)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-serif">
                    <tr>
                      <td className="p-2 border font-bold text-left">0 — Non formé</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-bold text-left">1 — Novice</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-bold text-left">2 — Correct</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-bold text-left">3 — Spécialiste</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border text-red-700">Éc. critique</td>
                    </tr>
                    <tr className="bg-emerald-50/50 dark:bg-emerald-950/20">
                      <td className="p-2 border font-bold text-left text-emerald-800 dark:text-emerald-300">4 — Maître</td>
                      <td className="p-2 border text-emerald-700 font-bold">Réussite (Confort)</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border text-blue-700 font-semibold">Ambivalent</td>
                      <td className="p-2 border">Échec</td>
                      <td className="p-2 border">Échec</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-stone-800 rounded border border-amber-300 text-xs">
                <strong>⚖️ Règle de la moitié (Chapitre 9.1) :</strong> Sur Difficultés <em>Extrême (-2)</em> et <em>Cauchemardesque (-3)</em>, les avantages comptent pour moitié arrondie à l'inférieur (+2 devient +1, +1 devient 0). Les désavantages comptent toujours en entier.
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-stone-800 rounded border border-blue-200">
                <strong>Formule Sociale en un jet :</strong> <code>1D8 + Rang + Attitude envers la police (-1/0/+1) + Lien personnel (-3 à +3)</code>
                <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-400">
                  Aucune circonstance n'est évaluée : le Lien personnel en tient lieu. Demande particulièrement lourde = -1 supplémentaire ; anodine = +1.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-stone-900 border rounded space-y-1">
                  <span className="font-cinzel font-bold text-stone-900 dark:text-stone-100 block">
                    Échelle des Liens (-3 à +3)
                  </span>
                  <p><strong>+3</strong> : Fidélité absolue. Il ment pour vous.</p>
                  <p><strong>+2</strong> : Quelqu'un qui vous doit quelque chose.</p>
                  <p><strong>+1</strong> : Connaissance qui vous estime.</p>
                  <p><strong>0</strong> : Aucun lien particulier.</p>
                  <p><strong>-1</strong> : Mauvais souvenir, froideur.</p>
                  <p><strong>-2</strong> : Rancune installée.</p>
                  <p><strong>-3</strong> : Inimitié déclarée. Nuira s'il le peut.</p>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 border rounded space-y-1">
                  <span className="font-cinzel font-bold text-stone-900 dark:text-stone-100 block">
                    Brûler un Lien (Chapitre 12.4)
                  </span>
                  <p>
                    Un joueur peut <strong>sacrifier 1 point de Lien positif</strong> pour obtenir <strong>sans aucun jet</strong> ce que cette personne peut donner, même contre son propre intérêt. Une fois par scène.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMBAT & ARMES */}
          {activeTab === 'combat' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-stone-300 dark:border-stone-700">
                  <thead className="bg-stone-200 dark:bg-stone-800 font-cinzel font-bold">
                    <tr>
                      <th className="p-2 border">Catégorie</th>
                      <th className="p-2 border">Exemples</th>
                      <th className="p-2 border">Gradation infligée</th>
                      <th className="p-2 border">Doublée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-mono">
                    <tr>
                      <td className="p-2 border font-sans font-bold">Légère</td>
                      <td className="p-2 border font-sans">Poing, matraque, surin, canne plombée</td>
                      <td className="p-2 border">1</td>
                      <td className="p-2 border">2</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-sans font-bold">Moyenne</td>
                      <td className="p-2 border font-sans">Sabre, revolver d'ordonnance, browning</td>
                      <td className="p-2 border">2</td>
                      <td className="p-2 border">4</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-sans font-bold">Lourde</td>
                      <td className="p-2 border font-sans">Fusil, explosif, chute grave, voiture lancée</td>
                      <td className="p-2 border">3</td>
                      <td className="p-2 border">6</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-red-50 dark:bg-stone-800 rounded border border-red-200 space-y-1">
                <span className="font-cinzel font-bold text-red-900 dark:text-red-300 block">
                  Gradation de blessure PJ (1 à 5) :
                </span>
                <p><strong>1 — Indemne</strong> : Aucun effet.</p>
                <p><strong>2 — Éprouvé</strong> : Désavantage mineur (-1) sur actions physiques uniquement.</p>
                <p><strong>3 — Blessé</strong> : Désavantage mineur (-1) sur toutes les actions.</p>
                <p><strong>4 — Grièvement blessé</strong> : Désavantage majeur (-2) sur toutes les actions.</p>
                <p><strong>5 — Hors de combat</strong> : Scène de mise en danger de mort (stabilisation difficile).</p>
              </div>
            </div>
          )}

          {/* TAB 5: POURSUITES */}
          {activeTab === 'poursuite' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-stone-800 rounded border border-emerald-300 space-y-1">
                <span className="font-cinzel font-bold text-emerald-900 dark:text-emerald-300 block">
                  Structure en 3 temps (Chapitre 14) :
                </span>
                <p><strong>1. Engagement</strong> : Test contre l'Indice Physique du fuyard. Réussite = +1 sur tout le parcours ; Échec = -1.</p>
                <p><strong>2. Parcours</strong> : 2 ou 3 obstacles résolus avec la compétence choisie par le joueur. On compte les réussites.</p>
                <p><strong>3. Résolution</strong> : 2+ réussites = Rattrapé en position favorable ; 1 réussite = Le 3e résultat ; 0 = Échappé.</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-cinzel font-bold block text-stone-800 dark:text-stone-200">
                  Table D8 des Complications de Poursuite :
                </span>
                {PURSUIT_COMPLICATIONS.map(c => (
                  <div key={c.d8} className="p-2 bg-white dark:bg-stone-900 border rounded flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-800 dark:text-amber-400">D8={c.d8}</span>
                    <div>
                      <strong>{c.title} :</strong> {c.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COUTS & DETTES */}
          {activeTab === 'couts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50 dark:bg-stone-800 rounded border border-amber-300">
                  <span className="font-cinzel font-bold text-amber-900 dark:text-amber-200 block mb-1">
                    Payer maintenant (Les 5 prix)
                  </span>
                  <p><strong>Une journée</strong> : L'affaire perd un jour de délai.</p>
                  <p><strong>Une trace</strong> : Lien déplace ou attitude glisse.</p>
                  <p><strong>Une marque</strong> : Seuil de blessure ou entorse.</p>
                  <p><strong>Une pièce</strong> : Scellé perdu ou témoin égaré.</p>
                  <p><strong>Du bruit</strong> : Quelqu'un a remarqué, on est vu.</p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-stone-800 rounded border border-amber-300">
                  <span className="font-cinzel font-bold text-amber-900 dark:text-amber-200 block mb-1">
                    Prendre un jeton de dette
                  </span>
                  <p>• Max 3 jetons par personnage.</p>
                  <p>• Le Meneur le dépense pour <strong>abaisser d'un degré</strong> un résultat futur ou <strong>introduire une complication</strong>.</p>
                  <p>• Jamais deux jetons sur le même jet, jamais dans la même scène.</p>
                  <p>• En fin d'affaire, chaque dette non dépensée devient une trace durable.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ARCHETYPES */}
          {activeTab === 'archetypes' && (
            <div className="space-y-3">
              {Object.values(ARCHETYPES).map(arch => (
                <div key={arch.key} className="p-3 bg-white dark:bg-stone-900 border rounded space-y-2">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-cinzel font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {arch.name}
                    </span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 italic text-[11px]">
                    {arch.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {arch.privileges.map(p => (
                      <div key={p.id} className="p-2 bg-stone-50 dark:bg-stone-800 rounded border text-[11px]">
                        <div className="font-bold text-amber-800 dark:text-amber-400">
                          {p.name} (+{p.bonus} {p.type === 'metier' ? 'Métier' : 'Appui'})
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 mt-0.5">{p.trigger}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
