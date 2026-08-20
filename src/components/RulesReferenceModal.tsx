import React, { useState } from 'react';
import {
  PURSUIT_COMPLICATIONS,
  ARCHETYPES,
} from '../data/rulesData';
import { BookOpen, X } from 'lucide-react';

interface RulesReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesReferenceModal({ isOpen, onClose }: RulesReferenceModalProps) {
  const [activeTab, setActiveTab] = useState<'degres' | 'planchers' | 'social' | 'combat' | 'poursuite' | 'couts' | 'archetypes'>('degres');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-serif animate-in fade-in duration-200">
      <div className="bg-[#121820] artdeco-frame border-2 border-[#c5a059] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6 text-[#f4ecd8] relative">
        
        {/* CORNERS */}
        <div className="artdeco-corner-tl" />
        <div className="artdeco-corner-tr" />
        <div className="artdeco-corner-bl" />
        <div className="artdeco-corner-br" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c5a059]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1a232f] border border-[#dfba73] text-[#dfba73] shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-cinzel-deco font-bold text-gold-gradient">
                Aide-Mémoire des Règles D8
              </h2>
              <p className="text-xs font-marcellus text-[#a69d8d] italic">
                Tables officielles & principes d'arbitrage — Brigades Mobiles 1910
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1a232f] text-[#dfba73] border border-transparent hover:border-[#c5a059]/50 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 border-b border-[#c5a059]/30 pb-3">
          {[
            { key: 'degres', label: '1. Table des Degrés' },
            { key: 'planchers', label: '2. Planchers Garantis' },
            { key: 'social', label: '3. Scène Sociale & Liens' },
            { key: 'combat', label: '4. Physique & Armes' },
            { key: 'poursuite', label: '5. Poursuites D8' },
            { key: 'couts', label: '6. Coûts & Dettes' },
            { key: 'archetypes', label: '7. Archétypes & Privilèges' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 text-xs font-cinzel font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#997323] via-[#c5a059] to-[#997323] text-[#0d1117] border border-[#f3e5ab] shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                  : 'bg-[#161d26] text-[#d1c7b7] border border-[#c5a059]/30 hover:border-[#c5a059] hover:text-[#dfba73]'
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
              <div className="p-3 bg-[#0d1117] border border-[#c5a059]/40 text-[#dfba73] font-marcellus">
                <strong className="text-[#f4ecd8] font-cinzel">Formule Universelle :</strong> <code className="text-[#dfba73] font-mono font-bold">1D8 + Rang de compétence + Difficulté + Avantage net − Désavantage net</code>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border border-[#c5a059]/40">
                  <thead className="bg-[#161d26] font-cinzel font-bold text-[#dfba73] tracking-wider uppercase">
                    <tr>
                      <th className="p-2 border border-[#c5a059]/30">Résultat</th>
                      <th className="p-2 border border-[#c5a059]/30">Degré</th>
                      <th className="p-2 border border-[#c5a059]/30">Enquête</th>
                      <th className="p-2 border border-[#c5a059]/30">Social</th>
                      <th className="p-2 border border-[#c5a059]/30">Physique</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a059]/20 font-marcellus text-[#e6decb]">
                    <tr className="bg-[#1a1215]/50">
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-red-400">1 ou moins</td>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-red-400 font-cinzel">Échec critique</td>
                      <td className="p-2 border border-[#c5a059]/20">Mauvaise piste, indice abîmé ou alerte</td>
                      <td className="p-2 border border-[#c5a059]/20">Rupture, trace négative forte (Lien -1, Att -1)</td>
                      <td className="p-2 border border-[#c5a059]/20">Dégâts adverses doublés</td>
                    </tr>
                    <tr className="bg-[#1c1613]/50">
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-orange-400">2 à 3</td>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-orange-400 font-cinzel">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20">Obtenue tardivement ou incomplète</td>
                      <td className="p-2 border border-[#c5a059]/20">Refus, mais reste accessible plus tard</td>
                      <td className="p-2 border border-[#c5a059]/20">Dégâts adverses normaux</td>
                    </tr>
                    <tr className="bg-[#1e1c12]/70">
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-amber-300">4 à 6</td>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-amber-300 font-cinzel">Ambivalent (Cœur)</td>
                      <td className="p-2 border border-[#c5a059]/20">Obtenue avec un petit coût annexe (« Vous l'obtenez, mais... »)</td>
                      <td className="p-2 border border-[#c5a059]/20">Atteint au prix d'une dette ou compromission</td>
                      <td className="p-2 border border-[#c5a059]/20">Zone neutre : ni dégât infligé ni subi</td>
                    </tr>
                    <tr className="bg-[#121f18]/50">
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-emerald-400">7 à 8</td>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-emerald-400 font-cinzel">Réussite</td>
                      <td className="p-2 border border-[#c5a059]/20">Obtenue proprement</td>
                      <td className="p-2 border border-[#c5a059]/20">Coopère sans complication notable</td>
                      <td className="p-2 border border-[#c5a059]/20">Dégâts infligés normaux</td>
                    </tr>
                    <tr className="bg-[#1b1226]/50">
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-purple-300">9 ou plus</td>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-purple-300 font-cinzel">Réussite majeure</td>
                      <td className="p-2 border border-[#c5a059]/20">Obtenue avec un bonus (détail, gain de temps)</td>
                      <td className="p-2 border border-[#c5a059]/20">Coopère pleinement, devient un contact durable</td>
                      <td className="p-2 border border-[#c5a059]/20">Dégâts de votre arme doublés</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PLANCHERS GARANTIS */}
          {activeTab === 'planchers' && (
            <div className="space-y-4">
              <p className="font-marcellus italic text-[#d1c7b7]">
                « Dire à voix haute : "au pire, tu obtiens un Ambivalent" avant chaque jet change la nature de la partie : les joueurs cessent de craindre le dé et négocient le prix. » (Chapitre 8)
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-center border border-[#c5a059]/40">
                  <thead className="bg-[#161d26] font-cinzel font-bold text-[11px] text-[#dfba73] tracking-wider uppercase">
                    <tr>
                      <th className="p-2 border border-[#c5a059]/30 text-left">Rang</th>
                      <th className="p-2 border border-[#c5a059]/30">Triviale (+2)</th>
                      <th className="p-2 border border-[#c5a059]/30">Facile (+1)</th>
                      <th className="p-2 border border-[#c5a059]/30">Modérée (0)</th>
                      <th className="p-2 border border-[#c5a059]/30">Difficile (-1)</th>
                      <th className="p-2 border border-[#c5a059]/30">Extrême (-2)</th>
                      <th className="p-2 border border-[#c5a059]/30">Cauchemar (-3)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a059]/20 font-marcellus">
                    <tr>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-left text-[#dfba73]">0 — Non formé</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-left text-[#dfba73]">1 — Novice</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-left text-[#dfba73]">2 — Correct</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-left text-[#dfba73]">3 — Spécialiste</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-red-400 font-bold">Éc. critique</td>
                    </tr>
                    <tr className="bg-[#121f18]/60">
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-left text-emerald-400">4 — Maître</td>
                      <td className="p-2 border border-[#c5a059]/20 text-emerald-400 font-bold">Réussite (Confort)</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-amber-300 font-bold">Ambivalent</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                      <td className="p-2 border border-[#c5a059]/20 text-orange-400">Échec</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#0d1117] border border-[#c5a059]/40 text-xs text-[#d1c7b7] font-marcellus">
                <strong className="text-[#dfba73] font-cinzel">⚖️ Règle de la moitié (Chapitre 9.1) :</strong> Sur Difficultés <em>Extrême (-2)</em> et <em>Cauchemardesque (-3)</em>, les avantages comptent pour moitié arrondie à l'inférieur (+2 devient +1, +1 devient 0). Les désavantages comptent toujours en entier.
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#0d1117] border border-[#c5a059]/40 text-[#dfba73]">
                <strong className="text-[#f4ecd8] font-cinzel">Formule Sociale en un jet :</strong> <code className="text-[#dfba73] font-mono font-bold">1D8 + Rang + Attitude (-1/0/+1) + Lien personnel (-3 à +3)</code>
                <p className="mt-1 text-[11px] text-[#a69d8d] font-marcellus">
                  Aucune circonstance n'est évaluée : le Lien personnel en tient lieu. Demande particulièrement lourde = -1 supplémentaire ; anodine = +1.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#161d26] border border-[#c5a059]/30 space-y-1 font-marcellus">
                  <span className="font-cinzel font-bold text-[#dfba73] uppercase tracking-wider block mb-1">
                    Échelle des Liens (-3 à +3)
                  </span>
                  <p><strong className="text-[#dfba73]">+3</strong> : Fidélité absolue. Il ment pour vous.</p>
                  <p><strong className="text-[#dfba73]">+2</strong> : Quelqu'un qui vous doit quelque chose.</p>
                  <p><strong className="text-[#dfba73]">+1</strong> : Connaissance qui vous estime.</p>
                  <p><strong className="text-[#a69d8d]">0</strong> : Aucun lien particulier.</p>
                  <p><strong className="text-orange-400">-1</strong> : Mauvais souvenir, froideur.</p>
                  <p><strong className="text-orange-400">-2</strong> : Rancune installée.</p>
                  <p><strong className="text-red-400">-3</strong> : Inimitié déclarée. Nuira s'il le peut.</p>
                </div>

                <div className="p-3 bg-[#161d26] border border-[#c5a059]/30 space-y-1 font-marcellus">
                  <span className="font-cinzel font-bold text-[#dfba73] uppercase tracking-wider block mb-1">
                    Brûler un Lien (Chapitre 12.4)
                  </span>
                  <p className="text-[#d1c7b7] leading-relaxed">
                    Un joueur peut <strong className="text-[#dfba73]">sacrifier 1 point de Lien positif</strong> pour obtenir <strong className="text-[#dfba73]">sans aucun jet</strong> ce que cette personne peut donner, même contre son propre intérêt. Une fois par scène.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMBAT & ARMES */}
          {activeTab === 'combat' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-[#c5a059]/40">
                  <thead className="bg-[#161d26] font-cinzel font-bold text-[#dfba73] tracking-wider uppercase">
                    <tr>
                      <th className="p-2 border border-[#c5a059]/30">Catégorie</th>
                      <th className="p-2 border border-[#c5a059]/30">Exemples</th>
                      <th className="p-2 border border-[#c5a059]/30">Gradation infligée</th>
                      <th className="p-2 border border-[#c5a059]/30">Doublée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a059]/20 font-marcellus">
                    <tr>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-[#dfba73]">Légère</td>
                      <td className="p-2 border border-[#c5a059]/20">Poing, matraque, surin, canne plombée</td>
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold">1</td>
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-amber-300">2</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-[#dfba73]">Moyenne</td>
                      <td className="p-2 border border-[#c5a059]/20">Sabre, revolver d'ordonnance, browning</td>
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold">2</td>
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-amber-300">4</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#c5a059]/20 font-bold text-[#dfba73]">Lourde</td>
                      <td className="p-2 border border-[#c5a059]/20">Fusil, explosif, chute grave, voiture lancée</td>
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold">3</td>
                      <td className="p-2 border border-[#c5a059]/20 font-mono font-bold text-amber-300">6</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#1a1215] border border-red-500/40 space-y-1 font-marcellus text-[#fed7aa]">
                <span className="font-cinzel font-bold text-red-400 block uppercase tracking-wider">
                  Gradation de blessure PJ (1 à 5) :
                </span>
                <p><strong className="text-emerald-400">1 — Indemne</strong> : Aucun effet.</p>
                <p><strong className="text-amber-300">2 — Éprouvé</strong> : Désavantage mineur (-1) sur actions physiques uniquement.</p>
                <p><strong className="text-orange-400">3 — Blessé</strong> : Désavantage mineur (-1) sur toutes les actions.</p>
                <p><strong className="text-red-400">4 — Grièvement blessé</strong> : Désavantage majeur (-2) sur toutes les actions.</p>
                <p><strong className="text-red-500">5 — Hors de combat</strong> : Scène de mise en danger de mort (stabilisation difficile).</p>
              </div>
            </div>
          )}

          {/* TAB 5: POURSUITES */}
          {activeTab === 'poursuite' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#0d1117] border border-[#c5a059]/40 space-y-1 font-marcellus">
                <span className="font-cinzel font-bold text-[#dfba73] block uppercase tracking-wider">
                  Structure en 3 temps (Chapitre 14) :
                </span>
                <p><strong className="text-[#dfba73]">1. Engagement</strong> : Test contre l'Indice Physique du fuyard. Réussite = +1 sur tout le parcours ; Échec = -1.</p>
                <p><strong className="text-[#dfba73]">2. Parcours</strong> : 2 ou 3 obstacles résolus avec la compétence choisie par le joueur. On compte les réussites.</p>
                <p><strong className="text-[#dfba73]">3. Résolution</strong> : 2+ réussites = Rattrapé en position favorable ; 1 réussite = Le 3e résultat ; 0 = Échappé.</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-cinzel font-bold block text-[#dfba73] uppercase tracking-wider">
                  Table D8 des Complications de Poursuite :
                </span>
                {PURSUIT_COMPLICATIONS.map(c => (
                  <div key={c.d8} className="p-2.5 bg-[#161d26] border border-[#c5a059]/30 flex items-start gap-2.5 font-marcellus">
                    <span className="font-mono font-bold text-[#dfba73] whitespace-nowrap">D8={c.d8}</span>
                    <div>
                      <strong className="text-[#f4ecd8]">{c.title} :</strong> <span className="text-[#d1c7b7]">{c.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COUTS & DETTES */}
          {activeTab === 'couts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-marcellus">
                <div className="p-3.5 bg-[#161d26] border border-[#c5a059]/40">
                  <span className="font-cinzel font-bold text-[#dfba73] block mb-1 uppercase tracking-wider">
                    Payer maintenant (Les 5 prix)
                  </span>
                  <p><strong className="text-[#dfba73]">Une journée</strong> : L'affaire perd un jour de délai.</p>
                  <p><strong className="text-[#dfba73]">Une trace</strong> : Lien déplace ou attitude glisse.</p>
                  <p><strong className="text-[#dfba73]">Une marque</strong> : Seuil de blessure ou entorse.</p>
                  <p><strong className="text-[#dfba73]">Une pièce</strong> : Scellé perdu ou témoin égaré.</p>
                  <p><strong className="text-[#dfba73]">Du bruit</strong> : Quelqu'un a remarqué, on est vu.</p>
                </div>

                <div className="p-3.5 bg-[#161d26] border border-[#c5a059]/40">
                  <span className="font-cinzel font-bold text-[#dfba73] block mb-1 uppercase tracking-wider">
                    Prendre un jeton de dette
                  </span>
                  <p>• Max 3 jetons par personnage.</p>
                  <p>• Le Meneur le dépense pour <strong className="text-[#dfba73]">abaisser d'un degré</strong> un résultat futur ou <strong className="text-[#dfba73]">introduire une complication</strong>.</p>
                  <p>• Jamais deux jetons sur le même jet, jamais dans la même scène.</p>
                  <p>• En fin d'affaire, chaque dette non dépensée devient une trace durable.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ARCHETYPES */}
          {activeTab === 'archetypes' && (
            <div className="space-y-3 font-marcellus">
              {Object.values(ARCHETYPES).map(arch => (
                <div key={arch.key} className="p-3.5 bg-[#161d26] border border-[#c5a059]/40 space-y-2">
                  <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-1">
                    <span className="font-cinzel font-bold text-[#dfba73] text-sm uppercase tracking-wider">
                      {arch.name}
                    </span>
                  </div>
                  <p className="text-[#a69d8d] italic text-[11px]">
                    {arch.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {arch.privileges.map(p => (
                      <div key={p.id} className="p-2 bg-[#0d1117] border border-[#c5a059]/30 text-[11px]">
                        <div className="font-bold text-[#dfba73] font-cinzel">
                          {p.name} (+{p.bonus} {p.type === 'metier' ? 'Métier' : 'Appui'})
                        </div>
                        <p className="text-[#d1c7b7] mt-0.5">{p.trigger}</p>
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
