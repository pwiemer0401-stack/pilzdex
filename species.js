// Pilzdex – Artendaten
// Reihenfolge = Dex-Nummer. Neue Arten einfach am Ende einer Gruppe einfügen.
// edible: essbar | gegart | ungeniessbar | giftig | toedlich
// shape (Silhouette für leere Kästen): roehrling | lamelle | leiste | ball | phallus | porling | koralle | ohr | morchel
// doppelganger: id = andere Art im Dex (wird verlinkt), text = woran man sie unterscheidet

window.EDIBLE = {
  essbar:       { label: "Essbar",                 short: "essbar" },
  gegart:       { label: "Essbar nur gut gegart",  short: "nur gegart" },
  ungeniessbar: { label: "Ungenießbar",            short: "ungenießbar" },
  giftig:       { label: "Giftig",                 short: "giftig" },
  toedlich:     { label: "Tödlich giftig",         short: "tödlich" },
};

window.GROUPS = [
  "Röhrlinge",
  "Leistlinge",
  "Wulstlinge",
  "Schirmlinge, Champignons & Tintlinge",
  "Büschelig an Holz",
  "Ritterlinge, Trichterlinge & Verwandte",
  "Täublinge & Milchlinge",
  "Bauchpilze",
  "Porlinge & Sonderformen",
  "Morcheln & Lorcheln",
];

window.SPECIES = [
  // ───────────── Röhrlinge ─────────────
  {
    id: "steinpilz", name: "Steinpilz", latin: "Boletus edulis", group: "Röhrlinge",
    edible: "essbar", shape: "roehrling", season: "Juni – November",
    habitat: "Nadel- und Laubwald, besonders bei Fichten, Buchen und Kiefern.",
    merkmale: {
      Hut: "8–25 cm, hell- bis dunkelbraun, Rand oft heller, trocken bis leicht fettig.",
      Unterseite: "Röhren jung weiß, dann gelb bis olivgrün. Färben sich auf Druck nicht blau.",
      Stiel: "Dick, oft bauchig, hell mit feinem weißem Netz, vor allem im oberen Teil.",
      Fleisch: "Weiß, verfärbt sich nicht, riecht und schmeckt mild nussig.",
    },
    hinweis: "Der Klassiker unter den Speisepilzen. Das helle Stielnetz und die nicht blauenden Röhren sind die wichtigsten Merkmale.",
    doppelganger: [
      { id: "gallenroehrling", text: "Röhren werden rosa, Stielnetz grob und dunkelbraun, Fleisch gallebitter." },
      { id: "satansroehrling", text: "Ähnlich heller Hut, aber rote Poren, roter Stiel mit rotem Netz und blauendes Fleisch." },
    ],
  },
  {
    id: "marone", name: "Maronenröhrling", latin: "Imleria badia", group: "Röhrlinge",
    edible: "essbar", shape: "roehrling", season: "Juli – November",
    habitat: "Nadelwald, besonders Fichte und Kiefer, saure Böden.",
    merkmale: {
      Hut: "4–15 cm, kastanienbraun, bei Feuchtigkeit schmierig.",
      Unterseite: "Röhren gelb bis olivgrün, laufen auf Druck blau an.",
      Stiel: "Bräunlich, längsfaserig, ohne Netz.",
      Fleisch: "Weißlich bis gelblich, blaut im Anschnitt leicht.",
    },
    hinweis: "Einer der häufigsten Speisepilze. Das Blauen ist hier harmlos, es ist kein Giftmerkmal.",
    doppelganger: [
      { id: "gallenroehrling", text: "Röhren rosa statt gelb, kein Blauen, dunkles Netz am Stiel, bitter." },
    ],
  },
  {
    id: "hexenroehrling", name: "Flockenstieliger Hexenröhrling", latin: "Neoboletus erythropus", group: "Röhrlinge",
    edible: "gegart", shape: "roehrling", season: "Mai – November",
    habitat: "Nadel- und Laubwald auf sauren Böden.",
    merkmale: {
      Hut: "5–20 cm, dunkelbraun, samtig.",
      Unterseite: "Poren orangerot bis blutrot, blauen bei Berührung sofort stark.",
      Stiel: "Gelb mit feinen roten Flocken, kein Netz.",
      Fleisch: "Gelb, wird im Anschnitt sofort tief dunkelblau.",
    },
    hinweis: "Roh giftig. Wegen der roten Poren leicht mit dem Satansröhrling zu verwechseln.",
    doppelganger: [
      { id: "satansroehrling", text: "Hut hellgrau statt dunkelbraun, Stiel mit rotem Netz statt Flocken, Kalkboden." },
    ],
  },
  {
    id: "satansroehrling", name: "Satansröhrling", latin: "Rubroboletus satanas", group: "Röhrlinge",
    edible: "giftig", shape: "roehrling", season: "Juli – September",
    habitat: "Warme Laubwälder auf Kalk, bei Buchen und Eichen. Selten.",
    merkmale: {
      Hut: "8–30 cm, weißgrau bis hell olivgrau, dickfleischig.",
      Unterseite: "Poren erst gelb, dann blutrot.",
      Stiel: "Bauchig, oben gelb, darunter rot mit rotem Netz.",
      Fleisch: "Weißlich-gelb, blaut schwach. Alte Exemplare riechen nach Aas.",
    },
    hinweis: "Verursacht heftige Magen-Darm-Vergiftungen. Selten und schützenswert, also stehen lassen.",
    doppelganger: [
      { id: "steinpilz", text: "Ähnlich heller Hut, aber weiße bis olivgelbe Röhren und weißes Netz am Stiel." },
      { id: "hexenroehrling", text: "Dunkelbrauner Hut, rote Flocken statt Netz am Stiel." },
    ],
  },
  {
    id: "gallenroehrling", name: "Gallenröhrling", latin: "Tylopilus felleus", group: "Röhrlinge",
    edible: "ungeniessbar", shape: "roehrling", season: "Juni – Oktober",
    habitat: "Nadelwald auf sauren Böden, oft an Baumstümpfen.",
    merkmale: {
      Hut: "5–15 cm, hell- bis olivbraun.",
      Unterseite: "Röhren weiß, mit dem Alter deutlich rosa.",
      Stiel: "Mit grobem, dunkelbraunem Netz.",
      Fleisch: "Weiß, verfärbt sich nicht, extrem bitter.",
    },
    hinweis: "Nicht giftig, aber ein einziges Exemplar macht ein ganzes Pilzgericht ungenießbar.",
    doppelganger: [
      { id: "steinpilz", text: "Weißes, feines Stielnetz und Röhren ohne Rosaton." },
      { id: "marone", text: "Gelbe, blauende Röhren und Stiel ohne Netz." },
      { id: "birkenpilz", text: "Stiel mit schwarzen Schüppchen statt Netz, wächst bei Birken." },
    ],
  },
  {
    id: "birkenpilz", name: "Birkenpilz", latin: "Leccinum scabrum", group: "Röhrlinge",
    edible: "gegart", shape: "roehrling", season: "Juni – Oktober",
    habitat: "Immer in der Nähe von Birken.",
    merkmale: {
      Hut: "5–15 cm, grau- bis mittelbraun.",
      Unterseite: "Röhren weißlich bis grau.",
      Stiel: "Schlank, weißlich mit schwarzgrauen Schüppchen.",
      Fleisch: "Weiß, weich, verfärbt sich kaum.",
    },
    hinweis: "Wie alle Raustielröhrlinge gut durchgaren.",
    doppelganger: [
      { id: "gallenroehrling", text: "Dunkles Netz statt Schüppchen am Stiel, rosa Röhren, bitter." },
      { id: "rotkappe", text: "Naher, ebenfalls essbarer Verwandter mit orangem Hut." },
    ],
  },
  {
    id: "rotkappe", name: "Rotkappe", latin: "Leccinum aurantiacum (Sammelart)", group: "Röhrlinge",
    edible: "gegart", shape: "roehrling", season: "Juli – Oktober",
    habitat: "Bei Espen, Birken oder Eichen, je nach Art.",
    merkmale: {
      Hut: "5–20 cm, orange bis rotbraun, Huthaut am Rand überstehend.",
      Unterseite: "Röhren weißlich bis grau.",
      Stiel: "Weiß mit zunächst weißen, später rötlichbraunen bis schwarzen Schüppchen.",
      Fleisch: "Weiß, verfärbt sich grauviolett bis schwarz. Beim Kochen schwarz.",
    },
    hinweis: "Ungenügend gegart kann sie Magen-Darm-Beschwerden auslösen.",
    doppelganger: [
      { id: "birkenpilz", text: "Harmloser Verwandter mit braunem Hut." },
    ],
  },
  {
    id: "butterpilz", name: "Butterpilz", latin: "Suillus luteus", group: "Röhrlinge",
    edible: "essbar", shape: "roehrling", season: "September – November",
    habitat: "Bei Kiefern, oft an Wegrändern und auf sandigem Boden.",
    merkmale: {
      Hut: "4–12 cm, kastanienbraun, stark schleimig und glänzend.",
      Unterseite: "Röhren gelb.",
      Stiel: "Mit deutlichem häutigem Ring, oberhalb gelb gekörnt.",
      Fleisch: "Weißlich-gelb, weich.",
    },
    hinweis: "Die schleimige Huthaut wird vor dem Zubereiten abgezogen. Kann bei manchen abführend wirken.",
    doppelganger: [
      { id: "goldroehrling", text: "Goldgelber Hut und nur bei Lärchen." },
    ],
  },
  {
    id: "goldroehrling", name: "Goldröhrling", latin: "Suillus grevillei", group: "Röhrlinge",
    edible: "essbar", shape: "roehrling", season: "Juni – Oktober",
    habitat: "Ausschließlich bei Lärchen.",
    merkmale: {
      Hut: "4–12 cm, goldgelb bis orange, schleimig.",
      Unterseite: "Röhren gelb, auf Druck bräunlich.",
      Stiel: "Gelb mit weißlichem Ring.",
      Fleisch: "Gelblich, weich.",
    },
    hinweis: "Wo Lärchen stehen, findet man ihn oft in großer Zahl.",
    doppelganger: [
      { id: "butterpilz", text: "Brauner Hut und wächst bei Kiefern." },
    ],
  },

  // ───────────── Leistlinge ─────────────
  {
    id: "pfifferling", name: "Pfifferling", latin: "Cantharellus cibarius", group: "Leistlinge",
    edible: "essbar", shape: "leiste", season: "Juni – Oktober",
    habitat: "Nadel- und Laubwald, oft in Moos bei Fichten, Buchen und Eichen.",
    merkmale: {
      Hut: "2–10 cm, eigelb, trichterförmig mit welligem Rand.",
      Unterseite: "Leisten statt Lamellen: dicke, gegabelte Adern, die am Stiel herablaufen und sich nicht ablösen lassen.",
      Stiel: "Gleichfarbig, voll, nach unten verjüngt.",
      Fleisch: "Weiß, faserig wie Hühnerfleisch, Geruch fruchtig nach Aprikose.",
    },
    hinweis: "Das wichtigste Merkmal sind die Leisten. Sind es echte, dünne Lamellen, ist es kein Pfifferling.",
    doppelganger: [
      { id: "falscher-pfifferling", text: "Echte, dünne Lamellen, kräftiger orange, weiches Fleisch." },
      { id: "raukopf", text: "Rostbraun, echte Lamellen und Schleierreste am Stiel. Tödlich." },
    ],
  },
  {
    id: "falscher-pfifferling", name: "Falscher Pfifferling", latin: "Hygrophoropsis aurantiaca", group: "Leistlinge",
    edible: "ungeniessbar", shape: "leiste", season: "August – November",
    habitat: "Nadelwald, auf Nadelstreu und morschem Holz.",
    merkmale: {
      Hut: "2–8 cm, orange, filzig, trichterig.",
      Unterseite: "Echte, dichte, mehrfach gegabelte Lamellen, kräftig orange.",
      Stiel: "Oft etwas seitlich, weich.",
      Fleisch: "Weich, ohne typischen Geruch.",
    },
    hinweis: "Kein Speisepilz, kann Magen-Darm-Beschwerden auslösen.",
    doppelganger: [
      { id: "pfifferling", text: "Leisten statt Lamellen, festes, faseriges Fleisch, Aprikosenduft." },
    ],
  },
  {
    id: "trompetenpfifferling", name: "Trompetenpfifferling", latin: "Craterellus tubaeformis", group: "Leistlinge",
    edible: "essbar", shape: "leiste", season: "September – Dezember",
    habitat: "Saure, feuchte Nadelwälder, oft zu Hunderten im Moos.",
    merkmale: {
      Hut: "1–5 cm, graubraun, trichterförmig, in der Mitte durchbohrt.",
      Unterseite: "Gelbgraue, aderige Leisten.",
      Stiel: "Gelb, hohl.",
      Fleisch: "Dünn, elastisch.",
    },
    hinweis: "Ein typischer Spätherbstpilz, der auch nach dem ersten Frost noch zu finden ist.",
    doppelganger: [],
  },
  {
    id: "herbsttrompete", name: "Herbsttrompete", latin: "Craterellus cornucopioides", group: "Leistlinge",
    edible: "essbar", shape: "leiste", season: "August – November",
    habitat: "Laubwald, vor allem bei Buchen.",
    merkmale: {
      Hut: "Trompetenförmig, 3–8 cm breit, innen schwarzbraun.",
      Unterseite: "Außen glatt bis runzelig, aschgrau.",
      Stiel: "Geht in den Hut über, durchgehend hohl.",
      Fleisch: "Dünn, ledrig, würzig.",
    },
    hinweis: "Im Laub schwer zu sehen. Wo eine steht, stehen meist viele.",
    doppelganger: [],
  },

  // ───────────── Wulstlinge ─────────────
  {
    id: "gruener-knollenblaetterpilz", name: "Grüner Knollenblätterpilz", latin: "Amanita phalloides", group: "Wulstlinge",
    edible: "toedlich", shape: "lamelle", season: "Juli – Oktober",
    habitat: "Laubwald, besonders bei Eichen und Buchen.",
    merkmale: {
      Hut: "5–15 cm, olivgrün bis gelbgrün, selten fast weiß, radial gefasert, ohne Flocken.",
      Unterseite: "Lamellen weiß und frei. Werden nie rosa oder braun.",
      Stiel: "Weiß, grünlich genattert, mit häutigem Ring.",
      Knolle: "Knollige Basis mit häutiger, lappiger Scheide (Volva), oft im Boden verborgen.",
      Geruch: "Im Alter süßlich-widerlich nach Kunsthonig.",
    },
    hinweis: "Verursacht die meisten tödlichen Pilzvergiftungen. Symptome erst 6–24 Stunden später, dann Leberversagen. Pilze zum Bestimmen immer komplett mit Knolle aus dem Boden drehen.",
    doppelganger: [
      { id: "wiesenchampignon", text: "Lamellen rosa bis schokobraun, keine Knolle mit Scheide." },
      { id: "gruenling", text: "Gelbe Lamellen statt weißer, kein Ring, keine Knolle." },
      { id: "frauentaeubling", text: "Grüne Täublinge: Fleisch bricht wie Kreide, kein Ring, keine Knolle." },
      { id: "riesenbovist", text: "Junge Knollenblätterpilze stecken in einer eiförmigen Hülle. Längs aufgeschnitten zeigt sich der Umriss von Hut und Stiel." },
    ],
  },
  {
    id: "kegelhuetiger-knollenblaetterpilz", name: "Kegelhütiger Knollenblätterpilz", latin: "Amanita virosa", group: "Wulstlinge",
    edible: "toedlich", shape: "lamelle", season: "Juli – Oktober",
    habitat: "Saure Nadel- und Mischwälder.",
    merkmale: {
      Hut: "4–10 cm, reinweiß, jung deutlich kegelig.",
      Unterseite: "Lamellen weiß und frei.",
      Stiel: "Weiß, faserig-flockig, zerrissener Ring.",
      Knolle: "Knollige Basis mit häutiger Scheide.",
    },
    hinweis: "Genauso tödlich wie der Grüne Knollenblätterpilz. Ganz weiße Lamellenpilze mit Knolle nie sammeln.",
    doppelganger: [
      { id: "wiesenchampignon", text: "Rosa bis braune Lamellen, keine Knolle." },
      { id: "gruener-knollenblaetterpilz", text: "Grüner Bruder, genauso tödlich." },
    ],
  },
  {
    id: "fliegenpilz", name: "Fliegenpilz", latin: "Amanita muscaria", group: "Wulstlinge",
    edible: "giftig", shape: "lamelle", season: "Juli – November",
    habitat: "Bei Birken und Fichten.",
    merkmale: {
      Hut: "8–20 cm, leuchtend rot mit weißen Flocken. Regen kann die Flocken abwaschen.",
      Unterseite: "Lamellen weiß, frei.",
      Stiel: "Weiß mit hängendem Ring.",
      Knolle: "Knollige Basis mit mehreren Warzengürteln.",
    },
    hinweis: "Der bekannteste Giftpilz. Enthält Ibotensäure und Muscimol, die Rausch, Verwirrung und Krämpfe auslösen.",
    doppelganger: [
      { id: "pantherpilz", text: "Naher Verwandter mit braunem Hut, ebenfalls stark giftig." },
      { id: "speitaeubling", text: "Rot, aber ohne Flocken, Ring und Knolle. Fleisch brennend scharf." },
    ],
  },
  {
    id: "pantherpilz", name: "Pantherpilz", latin: "Amanita pantherina", group: "Wulstlinge",
    edible: "giftig", shape: "lamelle", season: "Juni – Oktober",
    habitat: "Laub- und Nadelwald.",
    merkmale: {
      Hut: "5–12 cm, braun mit reinweißen Flocken, Rand gerieft.",
      Unterseite: "Lamellen weiß.",
      Stiel: "Weiß, Ring glatt, ohne Riefen.",
      Knolle: "Mit scharf abgesetztem Rand wie ein Söckchen.",
      Fleisch: "Weiß, verfärbt sich nie rötlich.",
    },
    hinweis: "Stärker giftig als der Fliegenpilz.",
    doppelganger: [
      { id: "perlpilz", text: "Fleisch und Fraßstellen röten, Ring oben gerieft, Knolle ohne Söckchenrand." },
      { id: "fliegenpilz", text: "Roter Hut, gleiche Giftstoffe." },
    ],
  },
  {
    id: "perlpilz", name: "Perlpilz", latin: "Amanita rubescens", group: "Wulstlinge",
    edible: "gegart", shape: "lamelle", season: "Juni – Oktober",
    habitat: "Laub- und Nadelwald, sehr häufig.",
    merkmale: {
      Hut: "5–15 cm, fleischbraun mit grauweißen bis rosa Flocken.",
      Unterseite: "Lamellen weiß.",
      Stiel: "Ring auf der Oberseite gerieft.",
      Fleisch: "Rötet: Schnittstellen und Fraßspuren werden weinrot. Das ist das Hauptmerkmal.",
    },
    hinweis: "Roh giftig. Wegen der Verwechslungsgefahr mit dem Pantherpilz für Anfänger tabu.",
    doppelganger: [
      { id: "pantherpilz", text: "Rötet nie, Ring glatt, Knolle mit Söckchenrand." },
    ],
  },

  // ───────────── Schirmlinge, Champignons & Tintlinge ─────────────
  {
    id: "parasol", name: "Parasol", latin: "Macrolepiota procera", group: "Schirmlinge, Champignons & Tintlinge",
    edible: "essbar", shape: "lamelle", season: "Juli – Oktober",
    habitat: "Waldränder, Lichtungen, Wiesen.",
    merkmale: {
      Hut: "10–30 cm, heller Grund mit braunen Schuppen und dunklem Buckel in der Mitte.",
      Unterseite: "Lamellen weiß, frei.",
      Stiel: "Hoch, braun genattert (schlangenhautartig), mit doppeltem, verschiebbarem Ring.",
      Fleisch: "Weiß, rötet nicht.",
    },
    hinweis: "Nur große Exemplare mit genattertem Stiel. Gegessen wird nur der Hut.",
    doppelganger: [
      { id: "stinkschirmling", text: "Kleine Schirmlinge unter 10 cm, darunter tödliche Arten." },
      { id: "gruener-knollenblaetterpilz", text: "Junge Parasole können ähneln. Knolle mit Scheide ist das Warnzeichen." },
    ],
  },
  {
    id: "stinkschirmling", name: "Stinkschirmling", latin: "Lepiota cristata", group: "Schirmlinge, Champignons & Tintlinge",
    edible: "giftig", shape: "lamelle", season: "Juli – November",
    habitat: "Wegränder, Gärten, Parks, Laubstreu.",
    merkmale: {
      Hut: "2–5 cm, weiß mit braunen Schuppen und brauner Mitte.",
      Unterseite: "Lamellen weiß, frei.",
      Stiel: "Dünn, mit vergänglichem Ring.",
      Geruch: "Unangenehm, gasartig.",
    },
    hinweis: "Steht stellvertretend für die kleinen Schirmlinge. Einige davon enthalten dasselbe Gift wie der Knollenblätterpilz.",
    doppelganger: [
      { id: "parasol", text: "Viel größer (über 10 cm), genatterter Stiel, verschiebbarer Ring." },
    ],
  },
  {
    id: "wiesenchampignon", name: "Wiesenchampignon", latin: "Agaricus campestris", group: "Schirmlinge, Champignons & Tintlinge",
    edible: "essbar", shape: "lamelle", season: "Juli – Oktober",
    habitat: "Wiesen und Weiden, gern auf Pferdeweiden.",
    merkmale: {
      Hut: "4–10 cm, weiß, seidig.",
      Unterseite: "Lamellen jung rosa, dann schokobraun bis schwarzbraun.",
      Stiel: "Kurz, mit dünnem, vergänglichem Ring. Keine Knolle.",
      Fleisch: "Weiß, leicht rötlich anlaufend, angenehmer Geruch.",
    },
    hinweis: "Champignons haben nie rein weiße Lamellen. Weiße Lamellen plus Knolle bedeutet Knollenblätterpilz.",
    doppelganger: [
      { id: "gruener-knollenblaetterpilz", text: "Lamellen bleiben weiß, Knolle mit Scheide. Tödlich." },
      { id: "kegelhuetiger-knollenblaetterpilz", text: "Ganz weiß, weiße Lamellen, Knolle. Tödlich." },
      { id: "karbolchampignon", text: "Gilbt an der Stielbasis sofort chromgelb, riecht nach Tinte." },
    ],
  },
  {
    id: "karbolchampignon", name: "Karbolchampignon", latin: "Agaricus xanthodermus", group: "Schirmlinge, Champignons & Tintlinge",
    edible: "giftig", shape: "lamelle", season: "Juni – Oktober",
    habitat: "Parks, Gärten, Waldränder.",
    merkmale: {
      Hut: "5–15 cm, weiß, oft grau angehaucht.",
      Unterseite: "Lamellen grau-rosa, später braun.",
      Stiel: "Mit kräftigem Ring. Die Stielbasis gilbt beim Anschneiden sofort chromgelb.",
      Geruch: "Nach Tinte oder Karbol, beim Erhitzen stärker.",
    },
    hinweis: "Verursacht Magen-Darm-Vergiftungen. Den Stielfuß anzuschneiden verrät ihn sofort.",
    doppelganger: [
      { id: "wiesenchampignon", text: "Gilbt nicht, riecht angenehm." },
    ],
  },
  {
    id: "schopftintling", name: "Schopftintling", latin: "Coprinus comatus", group: "Schirmlinge, Champignons & Tintlinge",
    edible: "essbar", shape: "lamelle", season: "April – November",
    habitat: "Wiesen, Wegränder, frisch aufgeschüttete Erde.",
    merkmale: {
      Hut: "Walzenförmig, 5–15 cm hoch, weiß mit abstehenden Schuppen.",
      Unterseite: "Lamellen weiß, dann rosa, dann schwarz zu Tinte zerfließend.",
      Stiel: "Weiß, hohl, mit losem Ring.",
      Fleisch: "Weiß, zart.",
    },
    hinweis: "Nur jung essen, solange die Lamellen weiß sind, und schnell verarbeiten.",
    doppelganger: [
      { id: "faltentintling", text: "Grauer, gefalteter Hut ohne Schuppen. Giftig zusammen mit Alkohol." },
    ],
  },
  {
    id: "faltentintling", name: "Faltentintling", latin: "Coprinopsis atramentaria", group: "Schirmlinge, Champignons & Tintlinge",
    edible: "giftig", shape: "lamelle", season: "Mai – November",
    habitat: "Büschelig an vergrabenem Holz, in Gärten und Parks.",
    merkmale: {
      Hut: "3–7 cm, grau, eiförmig, radial gefaltet, ohne Schuppen.",
      Unterseite: "Lamellen zerfließen schwarz.",
      Stiel: "Weiß, hohl.",
    },
    hinweis: "Enthält Coprin: In Kombination mit Alkohol kommt es zu Herzrasen, Hautrötung und Übelkeit, noch bis zu drei Tage nach dem Essen.",
    doppelganger: [
      { id: "schopftintling", text: "Weißer, geschuppter Hut, walzenförmig." },
    ],
  },

  // ───────────── Büschelig an Holz ─────────────
  {
    id: "hallimasch", name: "Hallimasch", latin: "Armillaria spp.", group: "Büschelig an Holz",
    edible: "gegart", shape: "lamelle", season: "September – November",
    habitat: "Büschelig an Baumstümpfen, Wurzeln und lebenden Bäumen.",
    merkmale: {
      Hut: "3–10 cm, honiggelb bis braun mit dunklen Schüppchen.",
      Unterseite: "Lamellen weißlich bis cremefarben, später bräunlich gefleckt.",
      Stiel: "Mit wattigem Ring, am Grund verwachsen.",
      Sporenpulver: "Weiß, bestäubt oft die darunterliegenden Hüte.",
    },
    hinweis: "Roh giftig. Auch gut gegart vertragen ihn nicht alle Menschen.",
    doppelganger: [
      { id: "gifthaeubling", text: "Rostbraunes Sporenpulver, kleiner, glatter Hut. Tödlich." },
      { id: "schwefelkopf", text: "Schwefelgelb, grünliche Lamellen, bitter." },
      { id: "stockschwaemmchen", text: "Zweifarbiger Hut, zimtbraunes Sporenpulver." },
    ],
  },
  {
    id: "stockschwaemmchen", name: "Stockschwämmchen", latin: "Kuehneromyces mutabilis", group: "Büschelig an Holz",
    edible: "essbar", shape: "lamelle", season: "April – November",
    habitat: "Büschelig an Laubholzstümpfen.",
    merkmale: {
      Hut: "2–6 cm, zimtbraun und zweifarbig: trocknet von der Mitte her hell aus.",
      Unterseite: "Lamellen hell, dann zimtbraun.",
      Stiel: "Mit Ring, darunter dunkel und sparrig geschuppt.",
    },
    hinweis: "Essbar, aber die Verwechslung mit dem tödlichen Gifthäubling ist leicht. Für Anfänger tabu.",
    doppelganger: [
      { id: "gifthaeubling", text: "Stiel unter dem Ring silbrig längsfaserig statt geschuppt. Tödlich." },
      { id: "hallimasch", text: "Weißes Sporenpulver, Schüppchen auf dem Hut." },
    ],
  },
  {
    id: "gifthaeubling", name: "Gifthäubling", latin: "Galerina marginata", group: "Büschelig an Holz",
    edible: "toedlich", shape: "lamelle", season: "Ganzjährig, v. a. Herbst",
    habitat: "Einzeln oder büschelig an Nadel- und Laubholz.",
    merkmale: {
      Hut: "1–5 cm, honigbraun, trocknet hell aus.",
      Unterseite: "Lamellen ocker bis rostbraun.",
      Stiel: "Vergänglicher Ring, darunter silbrig längsfaserig, nicht geschuppt.",
      Geruch: "Mehlartig.",
    },
    hinweis: "Enthält dieselben Amatoxine wie der Knollenblätterpilz.",
    doppelganger: [
      { id: "stockschwaemmchen", text: "Stiel unterhalb des Rings geschuppt." },
      { id: "hallimasch", text: "Weißes Sporenpulver, größer, Schüppchen auf dem Hut." },
    ],
  },
  {
    id: "schwefelkopf", name: "Grünblättriger Schwefelkopf", latin: "Hypholoma fasciculare", group: "Büschelig an Holz",
    edible: "giftig", shape: "lamelle", season: "Ganzjährig",
    habitat: "Dichte Büschel an Laub- und Nadelholz, sehr häufig.",
    merkmale: {
      Hut: "2–7 cm, schwefelgelb mit orangefarbener Mitte.",
      Unterseite: "Lamellen schwefelgelb, dann grünlich bis olivschwarz.",
      Stiel: "Gelb, mit faserigen Schleierresten.",
      Fleisch: "Gelb, sehr bitter.",
    },
    hinweis: "Einer der häufigsten Pilze überhaupt, fast das ganze Jahr zu finden.",
    doppelganger: [
      { id: "hallimasch", text: "Weißliche Lamellen, wattiger Ring." },
      { id: "stockschwaemmchen", text: "Zimtbraune Lamellen, geschuppter Stiel." },
    ],
  },
  {
    id: "austernseitling", name: "Austernseitling", latin: "Pleurotus ostreatus", group: "Büschelig an Holz",
    edible: "essbar", shape: "porling", season: "Oktober – März",
    habitat: "Dachziegelartig an totem Laubholz, besonders an Buchen.",
    merkmale: {
      Hut: "5–15 cm, muschelförmig, grau-blau bis braun.",
      Unterseite: "Lamellen weiß, am Stiel herablaufend.",
      Stiel: "Kurz und seitlich oder fehlend.",
      Fleisch: "Weiß, fest.",
    },
    hinweis: "Ein Winterpilz, der oft erst nach dem ersten Frost erscheint.",
    doppelganger: [],
  },

  // ───────────── Ritterlinge, Trichterlinge & Verwandte ─────────────
  {
    id: "mairitterling", name: "Mairitterling", latin: "Calocybe gambosa", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "essbar", shape: "lamelle", season: "April – Juni",
    habitat: "Wiesen, Waldränder, Gärten, oft in Hexenringen.",
    merkmale: {
      Hut: "5–12 cm, weiß bis cremefarben, fleischig.",
      Unterseite: "Lamellen weiß, sehr eng.",
      Stiel: "Kräftig, weiß.",
      Geruch: "Stark nach frischem Mehl oder Gurke.",
    },
    hinweis: "Einer der wenigen Frühjahrspilze. Zur gleichen Zeit wächst der tödliche Ziegelrote Risspilz.",
    doppelganger: [
      { id: "risspilz", text: "Kegeliger, radial rissiger Hut, rötet, Lamellen werden braun. Tödlich." },
      { id: "riesenroetling", text: "Lamellen werden lachsrosa, erscheint erst ab August." },
    ],
  },
  {
    id: "risspilz", name: "Ziegelroter Risspilz", latin: "Inocybe erubescens", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "toedlich", shape: "lamelle", season: "Mai – Juli",
    habitat: "Laubwald, Parks, auf Kalk.",
    merkmale: {
      Hut: "3–8 cm, kegelig-glockig, weiß, dann ziegelrot fleckend, radial rissig.",
      Unterseite: "Lamellen weißlich, dann olivbraun.",
      Stiel: "Weiß, rötet.",
    },
    hinweis: "Enthält sehr viel Muskarin, das tödlich sein kann.",
    doppelganger: [
      { id: "mairitterling", text: "Fleischiger, glatter Hut, rötet nie, Mehlgeruch." },
      { id: "wiesenchampignon", text: "Rosa bis braune Lamellen, Ring am Stiel." },
    ],
  },
  {
    id: "gruenling", name: "Grünling", latin: "Tricholoma equestre", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "giftig", shape: "lamelle", season: "September – November",
    habitat: "Sandige Kiefernwälder.",
    merkmale: {
      Hut: "5–10 cm, gelb-olivgrün mit bräunlicher Mitte, klebrig.",
      Unterseite: "Lamellen leuchtend schwefelgelb.",
      Stiel: "Gelb, ohne Ring und Knolle.",
    },
    hinweis: "Galt früher als Speisepilz. Wiederholter Verzehr kann Muskelzerfall auslösen, es gab Todesfälle.",
    doppelganger: [
      { id: "gruener-knollenblaetterpilz", text: "Weiße Lamellen, Ring und Knolle mit Scheide. Tödlich." },
    ],
  },
  {
    id: "nebelkappe", name: "Nebelkappe", latin: "Clitocybe nebularis", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "giftig", shape: "lamelle", season: "September – November",
    habitat: "Laubstreu, oft in Reihen oder Ringen.",
    merkmale: {
      Hut: "8–20 cm, grau, wie bereift.",
      Unterseite: "Lamellen weiß bis cremefarben, leicht herablaufend.",
      Stiel: "Keulig verdickt.",
      Geruch: "Stark, süßlich-aromatisch.",
    },
    hinweis: "Früher gegessen, heute wegen häufiger Unverträglichkeit als giftig eingestuft.",
    doppelganger: [
      { id: "riesenroetling", text: "Lamellen werden lachsrosa, Mehlgeruch." },
    ],
  },
  {
    id: "riesenroetling", name: "Riesenrötling", latin: "Entoloma sinuatum", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "giftig", shape: "lamelle", season: "August – Oktober",
    habitat: "Laubwald auf Kalk, bei Eichen und Buchen.",
    merkmale: {
      Hut: "8–20 cm, elfenbein bis hellgrau, seidig glänzend.",
      Unterseite: "Lamellen jung gelblich, später lachsrosa.",
      Stiel: "Weiß, kräftig.",
      Geruch: "Mehlartig bis ranzig.",
    },
    hinweis: "Verursacht schwere Magen-Darm-Vergiftungen.",
    doppelganger: [
      { id: "nebelkappe", text: "Graue Kappe, cremeweiße Lamellen, süßlicher Geruch." },
      { id: "mairitterling", text: "Weiße Lamellen, wächst im Frühjahr." },
    ],
  },
  {
    id: "roetelritterling", name: "Violetter Rötelritterling", latin: "Lepista nuda", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "gegart", shape: "lamelle", season: "September – Dezember",
    habitat: "Laubstreu, Nadelstreu, Kompost.",
    merkmale: {
      Hut: "5–15 cm, violett bis braunviolett, glatt.",
      Unterseite: "Lamellen violett, leicht vom Hut ablösbar.",
      Stiel: "Violett, ohne Schleier.",
      Fleisch: "Violettlich, parfümiert. Sporenpulver blassrosa.",
    },
    hinweis: "Violette Schleierlinge sehen ähnlich aus: Sie haben einen Spinnwebschleier und rostbraunes Sporenpulver.",
    doppelganger: [
      { id: "raukopf", text: "Gattung Schleierlinge: rostbraunes Sporenpulver, Spinnwebschleier. Teils tödlich." },
      { id: "lacktrichterling", text: "Viel kleiner, mit dicken, weit stehenden Lamellen." },
    ],
  },
  {
    id: "lacktrichterling", name: "Amethystblauer Lacktrichterling", latin: "Laccaria amethystina", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "essbar", shape: "lamelle", season: "Juli – November",
    habitat: "Laub- und Nadelwald, sehr häufig.",
    merkmale: {
      Hut: "1–5 cm, kräftig violett, trocknet heller aus.",
      Unterseite: "Lamellen dick, weit stehend, violett.",
      Stiel: "Dünn, faserig, violett.",
    },
    hinweis: "Reichert Arsen aus dem Boden an, daher nur in kleinen Mengen. Der giftige Rettich-Helmling sieht ähnlich aus und riecht deutlich nach Rettich.",
    doppelganger: [
      { id: "roetelritterling", text: "Deutlich größer und fleischiger." },
    ],
  },
  {
    id: "raukopf", name: "Orangefuchsiger Raukopf", latin: "Cortinarius orellanus", group: "Ritterlinge, Trichterlinge & Verwandte",
    edible: "toedlich", shape: "lamelle", season: "August – Oktober",
    habitat: "Laubwald auf sauren Böden, oft bei Eichen.",
    merkmale: {
      Hut: "3–8 cm, orangefuchsig bis rostbraun, trocken-filzig.",
      Unterseite: "Lamellen orange bis rostbraun, dick, weit stehend.",
      Stiel: "Gelblich, faserig, mit rostgelben Schleierresten.",
      Geruch: "Rettichartig.",
    },
    hinweis: "Enthält Orellanin. Symptome treten erst 2 bis 20 Tage später auf, dann drohen bleibende Nierenschäden.",
    doppelganger: [
      { id: "pfifferling", text: "Leisten statt Lamellen, eigelb, fester Stiel." },
    ],
  },

  // ───────────── Täublinge & Milchlinge ─────────────
  {
    id: "frauentaeubling", name: "Frauentäubling", latin: "Russula cyanoxantha", group: "Täublinge & Milchlinge",
    edible: "essbar", shape: "lamelle", season: "Juni – Oktober",
    habitat: "Laubwald, besonders bei Buchen.",
    merkmale: {
      Hut: "5–15 cm, violett, grün und blaugrau gemischt.",
      Unterseite: "Lamellen weiß, biegsam und speckig. Splittern nicht, anders als bei den meisten Täublingen.",
      Stiel: "Weiß, ohne Ring und Knolle.",
      Fleisch: "Bricht wie Kreide, mild.",
    },
    hinweis: "Grüne Täublinge sind ein Klassiker für tödliche Verwechslungen mit dem Knollenblätterpilz.",
    doppelganger: [
      { id: "gruener-knollenblaetterpilz", text: "Ring am Stiel und Knolle mit Scheide. Tödlich." },
      { id: "speitaeubling", text: "Roter Hut, brennend scharf." },
    ],
  },
  {
    id: "speitaeubling", name: "Speitäubling", latin: "Russula emetica", group: "Täublinge & Milchlinge",
    edible: "giftig", shape: "lamelle", season: "Juli – Oktober",
    habitat: "Feuchte Nadelwälder, oft im Moos.",
    merkmale: {
      Hut: "3–10 cm, leuchtend rot, Huthaut abziehbar, darunter rosa.",
      Unterseite: "Lamellen weiß, brüchig.",
      Stiel: "Weiß, zerbrechlich.",
      Fleisch: "Extrem scharf.",
    },
    hinweis: "Verursacht Magen-Darm-Beschwerden.",
    doppelganger: [
      { id: "fliegenpilz", text: "Weiße Flocken, Ring und Knolle." },
      { id: "frauentaeubling", text: "Bunt violett-grün, mild, biegsame Lamellen." },
    ],
  },
  {
    id: "edelreizker", name: "Edelreizker", latin: "Lactarius deliciosus", group: "Täublinge & Milchlinge",
    edible: "essbar", shape: "lamelle", season: "August – Oktober",
    habitat: "Bei Kiefern, oft auf Kalk.",
    merkmale: {
      Hut: "5–12 cm, orange mit konzentrischen Ringzonen, grünspanfleckig.",
      Unterseite: "Lamellen orange.",
      Stiel: "Mit kleinen Grübchen, hohl.",
      Milch: "Karottenorange, verfärbt sich kaum.",
    },
    hinweis: "Verletzt man ihn, tritt orangefarbene Milch aus. Das unterscheidet ihn sicher vom Birkenreizker.",
    doppelganger: [
      { id: "birkenreizker", text: "Weiße, brennend scharfe Milch, zottiger Hutrand." },
    ],
  },
  {
    id: "birkenreizker", name: "Birkenreizker", latin: "Lactarius torminosus", group: "Täublinge & Milchlinge",
    edible: "giftig", shape: "lamelle", season: "Juli – Oktober",
    habitat: "Immer bei Birken.",
    merkmale: {
      Hut: "4–10 cm, rosa-fleischfarben, gezont, Rand zottig-wollig eingerollt.",
      Unterseite: "Lamellen cremefarben.",
      Milch: "Weiß, brennend scharf.",
    },
    hinweis: "Verursacht Magen-Darm-Beschwerden.",
    doppelganger: [
      { id: "edelreizker", text: "Orange Milch, glatter Hutrand, bei Kiefern." },
    ],
  },

  // ───────────── Bauchpilze ─────────────
  {
    id: "riesenbovist", name: "Riesenbovist", latin: "Calvatia gigantea", group: "Bauchpilze",
    edible: "essbar", shape: "ball", season: "Juni – Oktober",
    habitat: "Wiesen, Gärten, nährstoffreiche Böden.",
    merkmale: {
      Form: "Kugelig, 10–50 cm, weiß, glatt bis ledrig.",
      Innen: "Jung rein weiß und fest wie Tofu, später gelb-oliv und pulvrig.",
    },
    hinweis: "Nur essen, solange er innen durchgehend weiß ist. Kleine Boviste immer längs aufschneiden.",
    doppelganger: [
      { id: "kartoffelbovist", text: "Kleiner, dicke gelbliche Schale, innen schwarzviolett." },
      { id: "gruener-knollenblaetterpilz", text: "Junges Knollenblätterpilz-Ei: Im Längsschnitt sieht man Hut und Stiel." },
    ],
  },
  {
    id: "kartoffelbovist", name: "Dickschaliger Kartoffelbovist", latin: "Scleroderma citrinum", group: "Bauchpilze",
    edible: "giftig", shape: "ball", season: "Juli – November",
    habitat: "Saure Böden, Wegränder, Laub- und Nadelwald.",
    merkmale: {
      Form: "Knollig, 3–10 cm, ockergelb, grob schuppig-rissig, dicke Schale.",
      Innen: "Früh schwarzviolett mit weißen Adern.",
      Geruch: "Unangenehm, metallisch.",
    },
    hinweis: "Wird manchmal als falsche Trüffel verkauft. Verursacht Magen-Darm-Beschwerden.",
    doppelganger: [
      { id: "riesenbovist", text: "Glatt, weiß, innen jung rein weiß." },
    ],
  },
  {
    id: "stinkmorchel", name: "Stinkmorchel", latin: "Phallus impudicus", group: "Bauchpilze",
    edible: "ungeniessbar", shape: "phallus", season: "Juni – Oktober",
    habitat: "Laub- und Nadelwald, Gärten.",
    merkmale: {
      Jung: "Weißes, gallertiges Hexenei, halb im Boden.",
      Ausgewachsen: "Weißer, schwammiger Stiel mit glockigem Kopf voller olivgrünem Sporenschleim.",
      Geruch: "Starker Aasgeruch, oft schon von Weitem zu riechen. Lockt Fliegen an.",
    },
    hinweis: "Man riecht sie meist, bevor man sie sieht.",
    doppelganger: [
      { id: "gruener-knollenblaetterpilz", text: "Auch Knollenblätterpilze wachsen aus einem Ei. Längsschnitt zeigt Lamellen und Hut." },
    ],
  },

  // ───────────── Porlinge & Sonderformen ─────────────
  {
    id: "schwefelporling", name: "Schwefelporling", latin: "Laetiporus sulphureus", group: "Porlinge & Sonderformen",
    edible: "gegart", shape: "porling", season: "Mai – September",
    habitat: "An Laubbäumen wie Eiche, Weide oder Kirsche.",
    merkmale: {
      Form: "Dachziegelartige Konsolen, schwefelgelb bis orange, wellig.",
      Unterseite: "Feine, schwefelgelbe Poren.",
      Fleisch: "Jung saftig und weich, alt kreidig-brüchig.",
    },
    hinweis: "Nur jung und gut gegart. Nicht von Robinie, Eibe oder Nadelbäumen sammeln. Manche Menschen vertragen ihn nicht.",
    doppelganger: [],
  },
  {
    id: "zunderschwamm", name: "Zunderschwamm", latin: "Fomes fomentarius", group: "Porlinge & Sonderformen",
    edible: "ungeniessbar", shape: "porling", season: "Ganzjährig",
    habitat: "An Buchen und Birken, mehrjährig.",
    merkmale: {
      Form: "Hufförmig, grau, sehr hart, mit konzentrischen Zuwachszonen.",
      Unterseite: "Braungraue Poren.",
    },
    hinweis: "Holzig und nicht essbar. Früher Feuerstarter: Auch Ötzi hatte Zunderschwamm dabei.",
    doppelganger: [],
  },
  {
    id: "krause-glucke", name: "Krause Glucke", latin: "Sparassis crispa", group: "Porlinge & Sonderformen",
    edible: "essbar", shape: "koralle", season: "August – November",
    habitat: "Am Stammfuß von Kiefern.",
    merkmale: {
      Form: "Badeschwammartig, 10–40 cm, aus krausen, cremefarbenen Lappen.",
      Fleisch: "Elastisch, würziger Geruch.",
    },
    hinweis: "Kehrt oft jahrelang an denselben Baum zurück. Ein Fall für die Karte.",
    doppelganger: [],
  },
  {
    id: "judasohr", name: "Judasohr", latin: "Auricularia auricula-judae", group: "Porlinge & Sonderformen",
    edible: "gegart", shape: "ohr", season: "Ganzjährig, v. a. Winter",
    habitat: "Fast immer an Schwarzem Holunder.",
    merkmale: {
      Form: "Ohrförmig, 3–8 cm, gallertig-elastisch, rotbraun.",
      Außenseite: "Fein samtig.",
    },
    hinweis: "Verwandt mit dem Mu-Err aus der asiatischen Küche.",
    doppelganger: [],
  },

  // ───────────── Morcheln & Lorcheln ─────────────
  {
    id: "speisemorchel", name: "Speisemorchel", latin: "Morchella esculenta", group: "Morcheln & Lorcheln",
    edible: "gegart", shape: "morchel", season: "März – Mai",
    habitat: "Auwälder, unter Eschen, in Obstgärten.",
    merkmale: {
      Hut: "Wabenartig mit Gruben und Rippen, gelb- bis graubraun.",
      Innen: "Hut und Stiel bilden einen einzigen, durchgehenden Hohlraum.",
      Stiel: "Weiß, körnig.",
    },
    hinweis: "Roh giftig. Längs aufschneiden: Ein einziger Hohlraum ist das Erkennungszeichen.",
    doppelganger: [
      { id: "fruehjahrslorchel", text: "Hirnartig gewunden statt wabig, innen gekammert. Tödlich." },
    ],
  },
  {
    id: "fruehjahrslorchel", name: "Frühjahrslorchel", latin: "Gyromitra esculenta", group: "Morcheln & Lorcheln",
    edible: "toedlich", shape: "morchel", season: "März – Mai",
    habitat: "Sandige Kiefernwälder.",
    merkmale: {
      Hut: "Hirnartig gewunden, rot- bis kastanienbraun.",
      Innen: "Gekammert, mehrere Hohlräume.",
      Stiel: "Kurz, weißlich.",
    },
    hinweis: "Enthält Gyromitrin. Selbst die Dämpfe beim Kochen können vergiften.",
    doppelganger: [
      { id: "speisemorchel", text: "Wabenartiger Hut, ein durchgehender Hohlraum." },
    ],
  },
];

window.SPECIES.forEach((s, i) => { s.nr = i + 1; });
window.SPECIES_BY_ID = Object.fromEntries(window.SPECIES.map(s => [s.id, s]));
