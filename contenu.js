/*
  CONTENU DU PORTFOLIO
  --------------------
  Un objet par projet, dans l'ordre d'affichage sur le site
  (page_pdf = numéro d'origine du projet, utilisé dans les noms d'images).
  - masque : true = projet caché sur le site (rien n'est supprimé) ; false = visible.
  - texte_fr / texte_en : un élément de la liste = un paragraphe.
  - categories_* : 3 maximum, utilisées pour les filtres du site.
  - vignette : image affichée sur la page d'accueil (recadrée au format 10:7).
    Si le fichier est absent, la première image du projet est utilisée.
  - images : images de la fenêtre projet, dans l'ordre d'affichage.
    Déposez vos fichiers dans le dossier images/ avec exactement ces noms
    (attention à l'extension .jpg ou .png).
    Le champ "format" indique le cadrage utilisé dans le PDF (il ne sert qu'à vous guider).
  - lien (facultatif) : bouton affiché sous le texte.
*/
const PORTFOLIO = [
  {
    "id": "livrets-age-du-bronze",
    "page_pdf": 1,
    "masque": false,
    "titre_fr": "Livrets de découverte âge du Bronze",
    "titre_en": "The bronze age trails",
    "categories_fr": [
      "DESIGN",
      "ILLUSTRATION",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "ILLUSTRATION",
      "LAYOUT"
    ],
    "texte_fr": [
      "Les deux livrets jeux enfants ont été conçus en partenariat avec le service de médiation culturelle du musée d’Archéologie nationale pour faciliter le parcours des familles dans l’espace d’exposition. Ils proposent des activités illustrées et mettent en valeur les objets présents en vitrine."
    ],
    "texte_en": [
      "The two children’s activity trails were designed in partnership with the learning department at the National Archaeology Museum to help families navigate the temporary exhibition space. They feature illustrated activities and highlight the objects on display."
    ],
    "vignette": "images/01-livrets-age-du-bronze-vignette.jpg",
    "images": [
      {
        "fichier": "images/01-livrets-age-du-bronze-1.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/01-livrets-age-du-bronze-2.jpg",
        "format": "paysage 16:10"
      },
      {
        "fichier": "images/01-livrets-age-du-bronze-3.jpg",
        "format": "carré"
      }
    ]
  },
  {
    "id": "archeomuse",
    "page_pdf": 2,
    "masque": false,
    "titre_fr": "10 ans d’Archéomuse",
    "titre_en": "10 years of Archéomuse",
    "categories_fr": [
      "DESIGN",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT"
    ],
    "texte_fr": [
      "Communication autour des 10e journées de rencontres ArchéoMuse mettant en valeur à la fois la date anniversaire, la thématique annuelle et l’esprit du musée Dobrée, qui accueille cet événement, au travers de ses objets incontournables.",
      "L’identité graphique est déclinée sur l’affiche, le programme, le tote bag et les badges."
    ],
    "texte_en": [
      "Communication material for the 10th ArchéoMuse conference, highlighting the anniversary, the annual theme and the spirit of the Dobrée Museum, which is hosting the event, through its must-see exhibits.",
      "The graphic identity is featured on the poster, the programme, the tote bag and the badges."
    ],
    "vignette": "images/02-archeomuse-vignette.jpg",
    "images": [
      {
        "fichier": "images/02-archeomuse-1.png",
        "format": "portrait (affiche) (fond transparent)"
      },
      {
        "fichier": "images/02-archeomuse-2.jpg",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "marvellous-moons",
    "page_pdf": 3,
    "masque": false,
    "titre_fr": "Exposition Marvellous Moons",
    "titre_en": "Marvellous Moons exhibition",
    "categories_fr": [
      "GRAPHISME",
      "EXPOSITION",
      "SIGNALÉTIQUE"
    ],
    "categories_en": [
      "GRAPHICS",
      "EXHIBITION",
      "WAYFINDING"
    ],
    "texte_fr": [
      "L’exposition propose de découvrir les lunes à travers le prisme de 31 photographies et graphiques rétro-éclairés, des panneaux interactifs, ainsi que trois films.",
      "Les réalisations graphiques incluent aussi des panneaux d’introduction, une signalétique complète, une bannière grand format et un mur d’accueil à l’entrée de la galerie."
    ],
    "texte_en": [
      "This new temporary exhibition explores the moons and their characteristics through the prism of 31 backlit photographs and graphics, interactive panels, and three films.",
      "The boxes are fixed at different depths, to recreate a lunar dimension and evoke gravity. This system allows the panels to be reconfigured to suit future exhibitions."
    ],
    "vignette": "images/03-marvellous-moons-vignette.jpg",
    "images": [
      {
        "fichier": "images/03-marvellous-moons-1.jpg",
        "format": "carré"
      },
      {
        "fichier": "images/03-marvellous-moons-2.jpg",
        "format": "carré"
      },
      {
        "fichier": "images/03-marvellous-moons-3.jpg",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "port-epic",
    "page_pdf": 25,
    "masque": false,
    "titre_fr": "Roadbook Antwerp Port Epic",
    "titre_en": "Antwerp Port Epic Roadbook",
    "categories_fr": [
      "CARTOGRAPHIE",
      "MISE EN PAGE",
      "IDENTITÉ"
    ],
    "categories_en": [
      "CARTOGRAPHY",
      "LAYOUT",
      "IDENTITY"
    ],
    "texte_fr": [
      "Création graphique, mise en page et cartographie pour le roadbook de l’édition 2026 d’Antwerp Port Epic, pour Procyclingmaps.",
      "Cette brochure A4 a été imprimée et diffusée sur le web.",
      "Contenu : itinéraire des épreuves avec POI et profils altimétriques, plan des derniers kilomètres, plans d’accès et plans de situation, illustration des directions routières."
    ],
    "texte_en": [
      "Graphic design, layout and cartography for the roadbook of the 2026 edition of Antwerp Port Epic, for Procyclingmaps.",
      "This A4 brochure was printed and also published online.",
      "Contents: race routes with points of interest and elevation profiles, final-kilometre maps, access and location maps, and illustrated road directions."
    ],
    "vignette": "images/25-port-epic-vignette.jpg",
    "images": [
      {
        "fichier": "images/25-port-epic-1.jpg",
        "format": ""
      },
      {
        "fichier": "images/25-port-epic-2.jpg",
        "format": ""
      },
      {
        "fichier": "images/25-port-epic-3.jpg",
        "format": ""
      },
      {
        "fichier": "images/25-port-epic-4.jpg",
        "format": ""
      },
      {
        "fichier": "images/25-port-epic-5.jpg",
        "format": ""
      },
      {
        "fichier": "images/25-port-epic-6.jpg",
        "format": ""
      },
      {
        "fichier": "images/25-port-epic-7.jpg",
        "format": ""
      }
    ]
  },
  {
    "id": "identite-maitres-du-feu",
    "page_pdf": 7,
    "masque": false,
    "titre_fr": "Identité Les Maîtres du Feu",
    "titre_en": "Bronze age exhibition’s visual identity",
    "categories_fr": [
      "DIRECTION ARTISTIQUE",
      "GRAPHISME",
      "IDENTITÉ"
    ],
    "categories_en": [
      "ART DIRECTION",
      "GRAPHICS",
      "IDENTITY"
    ],
    "texte_fr": [
      "L’identité visuelle s’attache à replacer dans notre histoire la période de l’âge du Bronze. Par l’empreinte, elle met en avant ses objets iconiques, qui ont marqué leur époque et qui se distinguent par leur forme.",
      "L’identité se décline sur des bâches et affiches, des objets promotionnels (tote bag, stylo, ...), des contremarques et invitations, des supports presse et réseaux sociaux."
    ],
    "texte_en": [
      "The aim of the identity is to place the Bronze Age period back in our history by highlighting its iconic objects, those that marked their era and stand out because of their shape.",
      "It is displayed on tarpaulins and posters, promotional items (tote bags, pens, etc.), countermarks and invitations, press advertising and social networks."
    ],
    "vignette": "images/07-identite-maitres-du-feu-vignette.jpg",
    "images": [
      {
        "fichier": "images/07-identite-maitres-du-feu-1.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/07-identite-maitres-du-feu-2.jpg",
        "format": "carré"
      },
      {
        "fichier": "images/07-identite-maitres-du-feu-3.jpg",
        "format": "paysage 16:10"
      }
    ]
  },
  {
    "id": "balades-narratives",
    "page_pdf": 4,
    "masque": false,
    "titre_fr": "Balades narratives avec Mathieu Simonet",
    "titre_en": "Mathieu Simonet’s workshops",
    "categories_fr": [
      "GRAPHISME",
      "WEB",
      "CARTOGRAPHIE"
    ],
    "categories_en": [
      "GRAPHICS",
      "WEB",
      "CARTOGRAPHY"
    ],
    "texte_fr": [
      "Le musée d’Archéologie nationale accueille l’écrivain Mathieu Simonet dans le cadre d’ateliers d’écriture.",
      "Deux brochures et une affiche ont été développées pour communiquer autour de cette résidence. Et les textes recueillis sont présentés en ligne sur une cartographie interactive."
    ],
    "texte_en": [
      "The musée d’Archéologie nationale is hosting writer Mathieu Simonet for a series of writing workshops.",
      "Two brochures and a poster have been developed to highlight the events surrounding this residency. The texts gathered are presented in an interactive map display."
    ],
    "vignette": "images/04-balades-narratives-vignette.jpg",
    "images": [
      {
        "fichier": "images/04-balades-narratives-1.png",
        "format": "paysage (capture écran ordinateur)"
      },
      {
        "fichier": "images/04-balades-narratives-2-3.png",
        "format": "composition (fond transparent)"
      }
    ]
  },
  {
    "id": "objet-du-mois",
    "page_pdf": 8,
    "masque": false,
    "titre_fr": "L’Objet du Mois",
    "titre_en": "The Object of the Month",
    "categories_fr": [
      "GRAPHISME",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT"
    ],
    "texte_fr": [
      "L’objet du mois est une exposition temporaire mensuelle mettant en lumière un objet choisi par les conservateurs du musée d’Archéologie nationale.",
      "Le graphisme comprend deux kakémonos grand format présentés autour de l’objet, une affiche et des visuels pour supports numériques."
    ],
    "texte_en": [
      "The object of the Month is a temporary monthly exhibition highlighting an object chosen by the curators of the Musée d’Archéologie Nationale.",
      "The graphics includes two large-format kakemonos displayed around the object, a poster and additional visuals for digital use."
    ],
    "vignette": "images/08-objet-du-mois-vignette.jpg",
    "images": [
      {
        "fichier": "images/08-objet-du-mois-1.png",
        "format": "paysage (grille de 6 affiches — en partie vectorielle, à exporter en une image) (fond transparent)"
      },
      {
        "fichier": "images/08-objet-du-mois-2.jpg",
        "format": "portrait 3:4"
      }
    ]
  },
  {
    "id": "livret-falc",
    "page_pdf": 5,
    "masque": false,
    "titre_fr": "Livret de visite FALC",
    "titre_en": "Easy to Read and Understand brochure",
    "categories_fr": [
      "DESIGN",
      "ILLUSTRATION",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "ILLUSTRATION",
      "LAYOUT"
    ],
    "texte_fr": [
      "Le musée d’Archéologie nationale propose tout au long de l’année différents parcours de visites et ateliers aux publics en situation de handicap. Le livret en FALC (Facile à lire et à comprendre) permet de mener une visite en toute autonomie, avec ou sans accompagnateur de groupe."
    ],
    "texte_en": [
      "Throughout the year, the National Archaeology Museum offers a variety of tours and workshops for visitors with disabilities. The FALC (Easy to Read and Understand) booklet allows visitors to enjoy a tour independently, with or without a group leader."
    ],
    "vignette": "images/05-livret-falc-vignette.jpg",
    "images": [
      {
        "fichier": "images/05-livret-falc-1.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/05-livret-falc-2.jpg",
        "format": "carré"
      },
      {
        "fichier": "images/05-livret-falc-3.jpg",
        "format": "paysage 16:10"
      }
    ]
  },
  {
    "id": "plan-du-domaine",
    "page_pdf": 21,
    "masque": false,
    "titre_fr": "Dépliant et plan du domaine",
    "titre_en": "Domain’s map and brochure",
    "categories_fr": [
      "GRAPHISME",
      "CARTOGRAPHIE",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "CARTOGRAPHY",
      "LAYOUT"
    ],
    "texte_fr": [
      "Création du plan du domaine national de Saint-Germain-en-Laye.",
      "Mise en page d’un dépliant présentant l’histoire du lieu, et conception et installation de panneaux dans le domaine."
    ],
    "texte_en": [
      "Design of the map of the national domain of Saint-Germain-en-Laye.",
      "Layout of a leaflet presenting the history of the site, and design and installation of information panels on the estate."
    ],
    "vignette": "images/21-plan-du-domaine-vignette.jpg",
    "images": [
      {
        "fichier": "images/21-plan-du-domaine-1.jpg",
        "format": "paysage 3:2"
      },
      {
        "fichier": "images/21-plan-du-domaine-2.jpg",
        "format": "paysage 5:4"
      },
      {
        "fichier": "images/21-plan-du-domaine-3.jpg",
        "format": "portrait (panneau)"
      }
    ]
  },
  {
    "id": "gaule-romaine",
    "page_pdf": 19,
    "masque": false,
    "titre_fr": "Journée d’actualité sur la Gaule Romaine",
    "titre_en": "Roman Gaul annual conference",
    "categories_fr": [
      "DESIGN",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT"
    ],
    "texte_fr": [
      "Création et déploiement d’une identité graphique pour la rencontre annuelle consacrée à l’actualité de la recherche sur la Gaule romaine. Le design est décliné sur l’affiche, le programme, le site internet et les badges."
    ],
    "texte_en": [
      "Creation and roll-out of a visual identity for the annual conference focusing on the latest research into Roman Gaul. The design is featured on the poster, the programme, the website and the badges."
    ],
    "vignette": "images/19-gaule-romaine-vignette.jpg",
    "images": [
      {
        "fichier": "images/19-gaule-romaine-1.png",
        "format": "portrait (affiche) (fond transparent)"
      },
      {
        "fichier": "images/19-gaule-romaine-2.jpg",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "dalle-saint-belec",
    "page_pdf": 18,
    "masque": false,
    "titre_fr": "La dalle de Saint-Belec",
    "titre_en": "The Saint-Belec slab",
    "categories_fr": [
      "DESIGN",
      "CARTOGRAPHIE"
    ],
    "categories_en": [
      "GRAPHICS",
      "CARTOGRAPHY"
    ],
    "texte_fr": [
      "Installées sur une tablette numérique à proximité de la dalle de Saint-Belec, les cartographies thématiques permettent de replacer l’objet au sein de son territoire et de présenter au public une lecture possible de cette carte gravée dans la pierre."
    ],
    "texte_en": [
      "Displayed on a digital tablet near the slab in Saint-Belec, the thematic maps replace the object within its territory and offer the public a possible interpretation of this map engraved in stone."
    ],
    "vignette": "images/18-dalle-saint-belec-vignette.jpg",
    "images": [
      {
        "fichier": "images/18-dalle-saint-belec-1.jpg",
        "format": "paysage 16:9"
      },
      {
        "fichier": "images/18-dalle-saint-belec-2.jpg",
        "format": "paysage 16:9"
      },
      {
        "fichier": "images/18-dalle-saint-belec-3.jpg",
        "format": "paysage 16:9"
      },
      {
        "fichier": "images/18-dalle-saint-belec-4.png",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "catalogue-scolaire",
    "page_pdf": 23,
    "masque": false,
    "titre_fr": "Catalogue d’activités scolaires",
    "titre_en": "School workshops’ brochure",
    "categories_fr": [
      "GRAPHISME",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT"
    ],
    "texte_fr": [
      "Le musée d’Archéologie nationale accueille classes et groupes d’enfants de la maternelle au lycée, et propose des activités variées. Ce programme met en avant les ateliers proposés, et permet, grâce à un jeu de couleurs et de pictogrammes, de repérer facilement les activités adaptées, par tranche d’âge ou par thématique."
    ],
    "texte_en": [
      "The National Archaeology Museum welcomes school classes and groups of children from nursery school to sixth form, and offers a variety of activities. This brochure highlights the workshops on offer and, through the use of a colour-coded system and pictograms, makes it easy to identify suitable activities, either by age group or by theme."
    ],
    "vignette": "images/23-catalogue-scolaire-vignette.jpg",
    "images": [
      {
        "fichier": "images/23-catalogue-scolaire-1.jpg",
        "format": "paysage 3:2"
      },
      {
        "fichier": "images/23-catalogue-scolaire-2.jpg",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "cahiers-du-man",
    "page_pdf": 24,
    "masque": false,
    "titre_fr": "Série de publications scientifiques",
    "titre_en": "Series of scientific publications",
    "categories_fr": [
      "IDENTITÉ",
      "DESIGN",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "IDENTITY",
      "GRAPHICS",
      "LAYOUT"
    ],
    "texte_fr": [
      "Re-design de l’identité de la publication des Cahiers du musée d’Archéologie nationale qui constitue une contribution active à la diffusion des recherches en archéologie et à l’histoire de la discipline. Le design se démarque des autres séries publiées par la MAN, tout en reprenant les codes graphiques de l’institution."
    ],
    "texte_en": [
      "Redesign of the visual identity for the publication series Cahiers du musée d’Archéologie nationale, which makes an active contribution to the dissemination of archaeological research and the history of the discipline. The design stands out from the other series published by the MAN, whilst retaining the institution’s graphic style."
    ],
    "vignette": "images/24-cahiers-du-man-vignette.jpg",
    "images": [
      {
        "fichier": "images/24-cahiers-du-man-1.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/24-cahiers-du-man-2.jpg",
        "format": "paysage 16:10"
      },
      {
        "fichier": "images/24-cahiers-du-man-3.jpg",
        "format": "paysage 16:10"
      }
    ]
  },
  {
    "id": "expo-maitres-du-feu",
    "page_pdf": 6,
    "masque": false,
    "titre_fr": "Exposition Les Maîtres du Feu",
    "titre_en": "The Bronze age exhibition",
    "categories_fr": [
      "GRAPHISME",
      "CARTOGRAPHIE",
      "ILLUSTRATION"
    ],
    "categories_en": [
      "GRAPHICS",
      "CARTOGRAPHY",
      "ILLUSTRATION"
    ],
    "texte_fr": [
      "La conception graphique de cette exposition comprend des images grand format sur drop paper et toiles rétro-éclairées, des cartels en forex peints et imprimés, des formes découpées et du lettrage adhésif, des dispositifs numériques et cartographiques.",
      "Une partie du travail repose sur la gestion de projet, le suivi de production et la pose."
    ],
    "texte_en": [
      "The graphics for this exhibition includes large format images on drop paper and backlit fabric, painted and printed forex labels, cut-out shapes and adhesive lettering, digital and cartographic displays.",
      "Part of the work also involves project management, monitoring the production and installation of the graphic elements."
    ],
    "vignette": "images/06-expo-maitres-du-feu-vignette.jpg",
    "images": [
      {
        "fichier": "images/06-expo-maitres-du-feu-1.png",
        "format": "carré (fond transparent)"
      },
      {
        "fichier": "images/06-expo-maitres-du-feu-2.png",
        "format": "paysage 4:3 (fond transparent)"
      },
      {
        "fichier": "images/06-expo-maitres-du-feu-3.jpg",
        "format": "paysage 16:10"
      },
      {
        "fichier": "images/06-expo-maitres-du-feu-4.png",
        "format": "fond transparent"
      },
      {
        "fichier": "images/06-expo-maitres-du-feu-5.png",
        "format": "fond transparent"
      },
      {
        "fichier": "images/06-expo-maitres-du-feu-6.png",
        "format": "fond transparent"
      }
    ]
  },
  {
    "id": "family-trails-nmm",
    "page_pdf": 11,
    "masque": false,
    "titre_fr": "Livrets de découverte NMM",
    "titre_en": "NMM family trails",
    "categories_fr": [
      "DESIGN",
      "ILLUSTRATION",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "ILLUSTRATION",
      "LAYOUT"
    ],
    "texte_fr": [
      "Design et illustration de 6 dépliants éducatifs Family Trails pour le National Maritime Museum. Ils retranscrivent de manière ludique l’esprit de chaque galerie et accommodent un groupe d’âge distinct.",
      "L’objectif est de faciliter la découverte des collections du musée et d’offrir une nouvelle expérience de visite aux groupes intergénérationnels."
    ],
    "texte_en": [
      "Design and illustration of six educational Family Trails leaflets for the National Maritime Museum. They convey the spirit of each gallery in a fun way and cater to a specific age group.",
      "The aim is to facilitate the discovery of the museum’s collections and offer a new visitor experience for intergenerational groups."
    ],
    "vignette": "images/11-family-trails-nmm-vignette.jpg",
    "images": [
      {
        "fichier": "images/11-family-trails-nmm-1.png",
        "format": "portrait (couverture + bandeau)"
      },
      {
        "fichier": "images/11-family-trails-nmm-2.png",
        "format": "portrait (couverture + bandeau)"
      },
      {
        "fichier": "images/11-family-trails-nmm-3.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/11-family-trails-nmm-4.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/11-family-trails-nmm-5.jpg",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "observatoire-greenwich",
    "page_pdf": 10,
    "masque": false,
    "titre_fr": "Rénovation de l’observatoire royal",
    "titre_en": "Refurbishment of the observatory",
    "categories_fr": [
      "GRAPHISME",
      "EXPOSITION",
      "SIGNALÉTIQUE"
    ],
    "categories_en": [
      "GRAPHICS",
      "EXHIBITION",
      "WAYFINDING"
    ],
    "texte_fr": [
      "Le re-design scénographique de l’observatoire a fait partie d’une série de travaux de réfection du bâtiment.",
      "Le projet consiste en la création et la mise en espace du design graphique d’interprétation pour orienter les visiteurs dans l’espace de l’observatoire Meridian. Cela inclut une série de panneaux muraux en aluminium Dibond et PVC expansé Forex."
    ],
    "texte_en": [
      "The graphic redesign of the observatory was part of a series of renovation works on the building.",
      "The project consists of creating and installing graphic design elements to guide visitors around the Meridian observatory. This includes a series of wall panels made of Dibond aluminium and Forex expanded PVC."
    ],
    "vignette": "images/10-observatoire-greenwich-vignette.jpg",
    "images": [
      {
        "fichier": "images/10-observatoire-greenwich-1-3.jpg",
        "format": "portrait (panneau + 2 photos)"
      },
      {
        "fichier": "images/10-observatoire-greenwich-4.jpg",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "baltic-exchange",
    "page_pdf": 9,
    "masque": false,
    "titre_fr": "Baltic Exchange Memorial Glass",
    "titre_en": "Baltic Exchange Memorial Glass",
    "categories_fr": [
      "IDENTITÉ",
      "GRAPHISME",
      "EXPOSITION"
    ],
    "categories_en": [
      "IDENTITY",
      "GRAPHICS",
      "EXHIBITION"
    ],
    "texte_fr": [
      "Pour la rénovation de l’espace du Baltic Exchange Memorial Glass le travail en design graphique comprend la création d’une nouvelle identité visuelle, de panneaux et d’encarts descriptifs, ainsi que leur mise en espace.",
      "Une sérigraphie murale a été réalisée pour l’identité. Les textes et les images sont imprimés sur une surface MDF vernis."
    ],
    "texte_en": [
      "For the refurbishment of the Baltic Exchange Memorial Glass space, the graphic work includes the creation of a new visual identity, descriptive panels and labels, as well as the overall set design.",
      "The gallery’s identity was screenprinted on the wall. The text and images are printed on a varnished MDF surface."
    ],
    "vignette": "images/09-baltic-exchange-vignette.jpg",
    "images": [
      {
        "fichier": "images/09-baltic-exchange-1.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/09-baltic-exchange-2.jpg",
        "format": "carré"
      },
      {
        "fichier": "images/09-baltic-exchange-3.jpg",
        "format": "paysage légèrement"
      }
    ]
  },
  {
    "id": "packaging-askul",
    "page_pdf": 12,
    "masque": false,
    "titre_fr": "Gamme packaging Askul",
    "titre_en": "Askul packaging series",
    "categories_fr": [
      "GRAPHISME",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT"
    ],
    "texte_fr": [
      "Développement d’une gamme de packaging pour les produits du groupe Askul (Japon). Présentation de concept et de développement projet, conception et finalisation du design. Préparation des fichiers pour l’impression."
    ],
    "texte_en": [
      "Development of a range of packaging for Askul Group products (Japan). Presentation of concept and project development, conception and finalisation of design. Artworks for printing."
    ],
    "vignette": "images/12-packaging-askul-vignette.jpg",
    "images": [
      {
        "fichier": "images/12-packaging-askul-1.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/12-packaging-askul-2-4.png",
        "format": "composition (fond transparent)"
      }
    ]
  },
  {
    "id": "world-of-whisky",
    "page_pdf": 13,
    "masque": false,
    "titre_fr": "Dispositif World of Whisky",
    "titre_en": "World of Whisky display",
    "categories_fr": [
      "GRAPHISME",
      "MISE EN PAGE",
      "OBJET MODULAIRE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT",
      "MODULAR DISPLAY"
    ],
    "texte_fr": [
      "Le livre des Whisky WOW est un support de communication développé par le studio Autobahn. Il met en avant les détails qui pourront être utilisés pour définir la palette de goûts du client. Pour chaque produit, un profil gustatif a été développé. L’objet est modulable grâce à ses anneaux afin que la gamme changeante puisse être mise à jour rapidement et efficacement."
    ],
    "texte_en": [
      "The WOW Whisky book is a communication tool developed by the Autobahn studio. The book highlights the details that can be used to define the customer’s palette of tastes. For each product, a taste profile has been developed that clearly explains the different tasting notes. The object is modular thanks to its rings, so that the changing range can be updated quickly and efficiently."
    ],
    "vignette": "images/13-world-of-whisky-vignette.jpg",
    "images": [
      {
        "fichier": "images/13-world-of-whisky-1.jpg",
        "format": "paysage 3:2"
      },
      {
        "fichier": "images/13-world-of-whisky-2.jpg",
        "format": "paysage 3:2"
      },
      {
        "fichier": "images/13-world-of-whisky-3.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/13-world-of-whisky-4.jpg",
        "format": "paysage 4:3"
      }
    ]
  },
  {
    "id": "you-are-here",
    "page_pdf": 14,
    "masque": false,
    "titre_fr": "You are here, un dispositif itinérant",
    "titre_en": "Community project touring South London",
    "categories_fr": [
      "GRAPHISME",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT"
    ],
    "texte_fr": [
      "The World in your Neighbourhood est un projet communautaire itinérant qui parcourt les quartiers au sud de la Tamise.",
      "Habillage graphique de l’extérieur du véhicule et conception d’outils graphiques magnétiques qui serviront comme supports d’expression aux habitants. Travail sur plan, supervision de la pose."
    ],
    "texte_en": [
      "The World in your Neighbourhood is a travelling community project that visits neighbourhoods south of the Thames.",
      "Graphic design for the exterior of the vehicle and design of magnetic graphic tools that will serve as tools for the participants. Work on plans, supervision of installation."
    ],
    "vignette": "images/14-you-are-here-vignette.jpg",
    "images": [
      {
        "fichier": "images/14-you-are-here-1.jpg",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/14-you-are-here-2.jpg",
        "format": "paysage (plans techniques + logo — vectoriel, à exporter)"
      },
      {
        "fichier": "images/14-you-are-here-3.png",
        "format": "paysage"
      }
    ]
  },
  {
    "id": "livre-autobahn",
    "page_pdf": 16,
    "masque": false,
    "titre_fr": "Le livre du studio Autobahn",
    "titre_en": "Autobahn Studio Book",
    "categories_fr": [
      "GRAPHISME",
      "MISE EN PAGE",
      "DIRECTION ARTISTIQUE"
    ],
    "categories_en": [
      "GRAPHICS",
      "LAYOUT",
      "ART DIRECTION"
    ],
    "texte_fr": [
      "Design éditorial, mise en page et conception d’un objet éditorial pour le studio Autobahn, commandité par Choi’s Gallery (CN/USA) pour intégrer la publication We Love Graphic.",
      "La mise en page finale s’étend sur trois dimensions : une mise en page digitale, une photographie des pages imprimées avec un ajout d’objets, et une seconde mise en page de ces photos sur ordinateur."
    ],
    "texte_en": [
      "Editorial design, layout and conception of an editorial object for the Autobahn studio. The project was commissioned by Choi’s Gallery (CN/USA) to form part of the We Love Graphic series of publications.",
      "The final layout is three-dimensional: a digital layout, a photograph of the printed pages with objects added, and a second layout of these photos on the computer."
    ],
    "vignette": "images/16-livre-autobahn-vignette.jpg",
    "images": [
      {
        "fichier": "images/16-livre-autobahn-1.png",
        "format": "paysage 4:3"
      },
      {
        "fichier": "images/16-livre-autobahn-2.png",
        "format": "paysage 3:2"
      },
      {
        "fichier": "images/16-livre-autobahn-3.png",
        "format": "paysage 3:2"
      }
    ]
  },
  {
    "id": "plateforme-biodiversite",
    "page_pdf": 15,
    "masque": false,
    "titre_fr": "Plateforme biodiversité",
    "titre_en": "Biodiversity online platform",
    "categories_fr": [
      "WEB",
      "CARTOGRAPHIE"
    ],
    "categories_en": [
      "WEB",
      "CARTOGRAPHY"
    ],
    "texte_fr": [
      "Pour découvrir mon projet de refonte et de valorisation des données de biodiversité pour le SIG de la Direction Territoriale de Paris chez HAROPA PORT. Avec la présentation de mon outil cartographique destiné à l’utilisation des salariés du port."
    ],
    "texte_en": [
      "Click here to discover my project to redesign and enhance biodiversity data for the GIS platform of the Paris Regional Office at HAROPA PORT, with a presentation of my cartographic tool intended for use by port employees."
    ],
    "lien": {
      "url": "https://www.dropbox.com/scl/fi/hb26iuu0e7e7j0flk2iz9/Rapport_biodiversite_DT.pdf?rlkey=owxctvhfuxa8568evsiawzbn8&st=1ztdnzj2&dl=1",
      "libelle_fr": "Télécharger le rapport (PDF)",
      "libelle_en": "Download the report (PDF)"
    },
    "vignette": "images/15-plateforme-biodiversite-vignette.jpg",
    "images": [
      {
        "fichier": "images/15-plateforme-biodiversite-1.png",
        "format": "paysage ~2:1 (interface annotée — composite, à exporter en une image)"
      }
    ]
  },
  {
    "id": "cartes-age-du-bronze",
    "page_pdf": 20,
    "masque": false,
    "titre_fr": "Ressources à l’âge du Bronze",
    "titre_en": "Trade during the Bronze age",
    "categories_fr": [
      "GRAPHISME",
      "CARTOGRAPHIE"
    ],
    "categories_en": [
      "GRAPHICS",
      "CARTOGRAPHY"
    ],
    "texte_fr": [
      "Cartographies thématiques publiées dans un ouvrage d’archéologie aux éditions Faton."
    ],
    "texte_en": [
      "Thematic maps published by Faton publishing in a book dedicated to archaeology."
    ],
    "vignette": "images/20-cartes-age-du-bronze-vignette.jpg",
    "images": [
      {
        "fichier": "images/20-cartes-age-du-bronze-1.jpg",
        "format": "paysage (carte — vectorielle, à exporter)"
      },
      {
        "fichier": "images/20-cartes-age-du-bronze-2.jpg",
        "format": "paysage (carte — vectorielle, à exporter)"
      }
    ]
  },
  {
    "id": "carte-de-voeux",
    "page_pdf": 17,
    "masque": true,
    "titre_fr": "Carte de voeux animée",
    "titre_en": "Animated greeting card",
    "categories_fr": [
      "GRAPHISME",
      "INTERACTION"
    ],
    "categories_en": [
      "GRAPHICS",
      "INTERACTION"
    ],
    "texte_fr": [
      "Carte de voeux mettant en avant l’union du domaine national (vert) et du musée d’Archéologie (orange), sous l’égide du pot à feu, trait d’union architectural, visible depuis les deux lieux.",
      "La carte est dessinée sur illustrator et développée en HTML/CSS/Javascript avec GSAP pour l’animation qui démarre au scrolling du visiteur."
    ],
    "texte_en": [
      "A greeting card highlighting the union of the National Estate (green) and the Museum of Archaeology (orange), under the banner of the fire pot, an architectural link visible from both sites.",
      "The card was designed in Illustrator and built in HTML/CSS/JavaScript, with GSAP powering an animation that starts as the visitor scrolls."
    ],
    "vignette": "images/17-carte-de-voeux-vignette.jpg",
    "images": [
      {
        "fichier": "images/17-carte-de-voeux-1.jpg",
        "format": "portrait (affiche)"
      },
      {
        "fichier": "images/17-carte-de-voeux-2.png",
        "format": "paysage 2:1"
      },
      {
        "fichier": "images/17-carte-de-voeux-3.png",
        "format": "paysage 2:1"
      },
      {
        "fichier": "images/17-carte-de-voeux-4.png",
        "format": "paysage 2:1"
      },
      {
        "fichier": "images/17-carte-de-voeux-5.png",
        "format": "paysage 2:1"
      }
    ]
  },
  {
    "id": "guide-promenades-man",
    "page_pdf": 22,
    "masque": true,
    "titre_fr": "Redesign d’un guide de visite",
    "titre_en": "Museum visit guide redesign",
    "categories_fr": [
      "DESIGN",
      "IDENTITÉ",
      "MISE EN PAGE"
    ],
    "categories_en": [
      "GRAPHICS",
      "IDENTITY",
      "LAYOUT"
    ],
    "texte_fr": [
      "Redesign pour la seconde édition du guide Promenades au MAN. Son identité s’appuie sur l’hybridation de deux objets, similaires dans leur apparence et leur typologie (lame) mais qui s’opposent dans leur usage, pour créer une icône. La mise en forme graphique et typographique reflète la diversité des collections, la temporalité extensive (temps long), la pluralité des objets et leurs provenances."
    ],
    "texte_en": [
      "Redesign of the second edition of the guide Promenades au MAN. Its identity is built on the hybridization of two objects that are similar in appearance and typology (blades) but opposite in their use, combined to create an icon. The graphic and typographic design reflects the diversity of the collections, their extended timescale (deep time), and the plurality of the objects and their origins."
    ],
    "vignette": "images/22-guide-promenades-man-vignette.jpg",
    "images": [
      {
        "fichier": "images/22-guide-promenades-man-1.jpg",
        "format": "portrait 5:6"
      },
      {
        "fichier": "images/22-guide-promenades-man-2.jpg",
        "format": "paysage légèrement"
      },
      {
        "fichier": "images/22-guide-promenades-man-3.jpg",
        "format": "paysage 16:10"
      }
    ]
  }
];
