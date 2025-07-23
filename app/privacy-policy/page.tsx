import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Globe,
  Info,
  Lock,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Politique de confidentialité | PO-UX-UI-DATA",
  description:
    "Politique de confidentialité et protection des données de l'application PO-UX-UI-DATA",
  robots: "index, follow",
};
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;accueil
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
            <p className="text-muted-foreground">
              Dernière mise à jour : 23 juillet 2025
            </p>
          </div>
        </div>

        <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Bonne nouvelle :</strong> Cette application ne collecte
            aucune donnée personnelle. Cette politique détaille notre engagement
            envers la protection de votre vie privée.
          </AlertDescription>
        </Alert>
      </div>{" "}
      {/* Table des matières */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Table des matières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <a
                href="#overview"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                1. Vue d&apos;ensemble
              </a>
              <a
                href="#data-collection"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                2. Données collectées
              </a>
              <a
                href="#data-usage"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                3. Utilisation des données
              </a>
              <a
                href="#data-security"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                4. Sécurité des données
              </a>
            </div>
            <div className="space-y-2">
              <a
                href="#user-rights"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                5. Vos droits
              </a>
              <a
                href="#gdpr-compliance"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                6. Conformité RGPD
              </a>
              <a
                href="#contact"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                7. Contact
              </a>
              <a
                href="#updates"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                8. Mises à jour
              </a>
            </div>
          </div>
        </CardContent>
      </Card>{" "}
      {/* 1. Vue d'ensemble */}
      <section id="overview" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              1. Vue d&apos;ensemble
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-400 p-4 rounded-r">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Application de démonstration
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    PO-UX-UI-DATA est une application de démonstration créée
                    pour illustrer les compétences en Product Ownership, UX/UI
                    et développement frontend. Elle ne constitue pas un service
                    commercial.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <Database className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  Données anonymes
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Aucune donnée personnelle
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  Sécurité
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Architecture sécurisée
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                <Globe className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                  RGPD
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Conformité exemplaire
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Responsable du traitement</h4>
              <div className="bg-muted p-4 rounded border">
                <p>
                  <strong>Florence Martin</strong> - Product Owner
                </p>
                <p>Portfolio professionnel et démonstration de compétences</p>
                <p>Contact : Via LinkedIn ou GitHub (liens en bas de page)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>{" "}
      {/* 2. Données collectées */}
      <section id="data-collection" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              2. Données collectées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Aucune donnée personnelle n&apos;est collectée</strong>{" "}
                par cette application.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Données NON collectées
                </h4>
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Nom, prénom, adresse
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Adresse email, téléphone
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Adresse IP, géolocalisation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Cookies de tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Historique de navigation
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Données métier (anonymes)
                </h4>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      User Stories (contenu métier)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Sprints et planification
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Tâches et backlog
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Personas fictifs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Données de démonstration
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded border">
              <h4 className="font-semibold mb-2">
                Données techniques (Firebase)
              </h4>
              <p className="text-sm text-muted-foreground">
                Firebase peut collecter des métadonnées techniques (logs
                d&apos;accès, timestamps) pour le fonctionnement du service. Ces
                données sont anonymisées et gérées selon la politique de Google
                Cloud.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>{" "}
      {/* 3. Utilisation des données */}
      <section id="data-usage" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              3. Utilisation des données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Finalité unique :</strong> Démonstration
                  professionnelle des compétences Product Owner dans le cadre
                  d&apos;un portfolio de recherche d&apos;emploi.
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Base légale RGPD
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Article 6.1.f) - Intérêt légitime : Présentation
                  professionnelle et démonstration de compétences techniques.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      {/* 4. Sécurité et protection */}
      <section id="data-security" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              4. Sécurité et protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 border rounded bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <Shield className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <p className="text-xs font-semibold">HTTPS/TLS</p>
              </div>
              <div className="p-3 border rounded bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <Database className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-semibold">Firebase sécurisé</p>
              </div>
              <div className="p-3 border rounded bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                <p className="text-xs font-semibold">Validation entrées</p>
              </div>
              <div className="p-3 border rounded bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                <Globe className="w-6 h-6 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                <p className="text-xs font-semibold">Conformité RGPD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>{" "}
      {/* 5. Vos droits RGPD */}
      <section id="user-rights" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              5. Vos droits RGPD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Aucune donnée personnelle</strong> = Droits RGPD
                  naturellement respectés
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                    Droits applicables
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>✅ Droit d&apos;information</strong> - Cette page
                      vous informe
                    </p>
                    <p>
                      <strong>✅ Droit d&apos;opposition</strong> - Cessez
                      d&apos;utiliser l&apos;app
                    </p>
                    <p>
                      <strong>✅ Droit de réclamation</strong> - Contactez-nous
                      ou la CNIL
                    </p>
                  </div>
                </div>
                <div className="bg-muted border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Droits non applicables</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>⚪ Droit d&apos;accès</strong> - Pas de données
                      personnelles
                    </p>
                    <p>
                      <strong>⚪ Droit de rectification</strong> - Rien à
                      corriger
                    </p>
                    <p>
                      <strong>⚪ Droit à la portabilité</strong> - Rien à
                      exporter
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>{" "}
      {/* 6. Conformité RGPD */}
      <section id="gdpr-compliance" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              6. Conformité RGPD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                Score de conformité : 85/100
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Principes RGPD respectés</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Minimisation :</strong>
                      <span className="text-sm block text-muted-foreground">
                        Aucune collecte excessive
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Finalité :</strong>
                      <span className="text-sm block text-muted-foreground">
                        Objectifs clairement définis
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Licéité :</strong>
                      <span className="text-sm block text-muted-foreground">
                        Base légale identifiée
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <strong>Sécurité :</strong>
                      <span className="text-sm block text-muted-foreground">
                        Mesures techniques appropriées
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">
                  Protection dès la conception
                </h4>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    <strong>Privacy by Design :</strong> L&apos;application a
                    été conçue dès le départ pour ne pas collecter de données
                    personnelles.
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Architecture NoSQL sans données sensibles</li>
                    <li>• Formulaires anonymes uniquement</li>
                    <li>
                      • Pas de système d&apos;authentification personnelle
                    </li>
                    <li>• Validation et sanitisation systématiques</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>{" "}
      {/* 7. Contact */}
      <section id="contact" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              7. Contact et informations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">
                  Responsable du traitement
                </h4>
                <div className="bg-muted p-4 rounded border text-sm">
                  <p>
                    <strong>Florence Martin</strong>
                  </p>
                  <p>Product Owner / UX-UI Developer</p>
                  <p className="mt-2">
                    <strong>Contact :</strong>
                    <br />
                    LinkedIn : florence-martin-922b3861
                    <br />
                    GitHub : Florence-Martin/PO-UX-UI-DATA
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Conformité RGPD</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm">
                      Score de conformité : 85/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm">
                      Aucune donnée personnelle collectée
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm">
                      Architecture sécurisée par design
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm">
                      Documentation complète disponible
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>{" "}
      {/* 8. Mises à jour */}
      <section id="updates" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              8. Mises à jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Cette politique peut être mise à jour pour refléter les
                évolutions de l&apos;application ou les changements
                réglementaires.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">
                    Historique des versions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                      <Badge
                        variant="outline"
                        className="text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                      >
                        v1.0
                      </Badge>
                      <span className="text-sm">
                        23 juillet 2025 - Création initiale
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">
                    Notification des changements
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Modifications importantes :</strong> Les
                      changements significatifs seront signalés par une bannière
                      sur l&apos;&apos;application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      {/* Footer */}
      <Separator className="my-8" />
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">
            Application conforme RGPD - Aucune donnée personnelle collectée
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Document généré dans le cadre du portfolio professionnel de Florence
          Martin
          <br />
          Conformément aux exigences du RGPD et aux bonnes pratiques de
          protection des données
        </p>
      </div>
    </div>
  );
}
