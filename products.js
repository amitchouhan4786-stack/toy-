// Wonderland Toys - Product Catalog Data
const PRODUCTS_DATA = [
  {
    id: "toy-1",
    name: "RoboExplorer STEM Coding Robot",
    category: "stem",
    categoryLabel: "STEM & Robotics",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviewCount: 142,
    age: "6-12",
    ageGroup: "6-8",
    badge: "Best Seller",
    badgeType: "bestseller",
    inStock: true,
    stockCount: 8,
    images: [
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "An interactive programmable robot that teaches kids visual drag-and-drop coding, obstacle avoidance, voice commands, and musical dance routines. Includes 50+ built-in coding challenges!",
    specs: {
      "Recommended Age": "6 - 12 Years",
      "Power Source": "Rechargeable USB-C Battery (included)",
      "Play Time": "Approx. 4 hours per charge",
      "Connectivity": "Bluetooth 5.0 with iOS & Android companion app",
      "Safety Certification": "ASTM F963 & EN71 Non-Toxic Certified"
    },
    reviews: [
      { author: "Sarah M.", rating: 5, date: "2 days ago", comment: "My 7-year-old hasn't stopped coding obstacle courses since his birthday! Incredible educational toy." },
      { author: "David K.", rating: 5, date: "1 week ago", comment: "Sturdy, super easy to get started, and genuinely teaches logic and loops." }
    ],
    tags: ["robot", "coding", "stem", "tech", "educational"]
  },
  {
    id: "toy-2",
    name: "Galactic Star Cruiser Building Set (1,250 Pcs)",
    category: "building",
    categoryLabel: "Building & Construction",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 98,
    age: "8+",
    ageGroup: "9+",
    badge: "Sale 20% Off",
    badgeType: "sale",
    inStock: true,
    stockCount: 14,
    images: [
      "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Embark on cosmic adventures with this detailed flagship cruiser featuring opening cockpit, twin spring-loaded photon blasters, crew quarters, and 5 astronaut mini-figures.",
    specs: {
      "Recommended Age": "8 Years and up",
      "Piece Count": "1,250 Interlocking precision bricks",
      "Compatibility": "100% compatible with all major brick brands",
      "Dimensions": "18.5\" L x 11.2\" W x 6.5\" H",
      "Material": "High-grade BPA-free ABS plastic"
    },
    reviews: [
      { author: "Mark T.", rating: 5, date: "3 days ago", comment: "Incredible build quality and instructions were crystal clear. Looks awesome on display!" },
      { author: "Elena R.", rating: 4, date: "2 weeks ago", comment: "Kept my daughter engaged for 3 whole afternoons. Great detail." }
    ],
    tags: ["lego", "building", "space", "blocks", "creative"]
  },
  {
    id: "toy-3",
    name: "CuddleBuddy Giant Soft Plush Bear (36-inch)",
    category: "plush",
    categoryLabel: "Stuffed Animals & Plush",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.9,
    reviewCount: 312,
    age: "0+",
    ageGroup: "0-2",
    badge: "Top Rated",
    badgeType: "bestseller",
    inStock: true,
    stockCount: 22,
    images: [
      "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
    ],
    description: "The ultimate huggable friend! Ultra-dense silky soft plush fur, embroidered safety eyes, and recycled cloud-fill stuffing make this giant teddy the perfect cuddle companion.",
    specs: {
      "Recommended Age": "Safe for all ages from newborn up",
      "Height": "36 inches (91 cm) head to toe",
      "Care Instructions": "Machine washable on gentle cycle; air dry",
      "Stuffing": "100% Recycled hypoallergenic poly-fill",
      "Safety": "No loose buttons, choke-proof stitched details"
    },
    reviews: [
      { author: "Jessica W.", rating: 5, date: "Yesterday", comment: "So unimaginably soft! My toddler sleeps with it every single night." },
      { author: "Tom B.", rating: 5, date: "5 days ago", comment: "High quality and didn't shed at all. Great baby shower present." }
    ],
    tags: ["teddy", "bear", "plush", "soft", "toddler", "baby"]
  },
  {
    id: "toy-4",
    name: "SpeedDemon 4x4 High-Speed Off-Road RC Buggy",
    category: "rc",
    categoryLabel: "RC & Vehicles",
    price: 49.99,
    originalPrice: 65.00,
    rating: 4.7,
    reviewCount: 89,
    age: "6+",
    ageGroup: "6-8",
    badge: "New Arrival",
    badgeType: "new",
    inStock: true,
    stockCount: 11,
    images: [
      "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516116211227-bbc804f0515c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tear through grass, dirt, sand, and gravel at speeds up to 25 km/h! Features 4-wheel independent shock absorbers, rugged rubber tread tires, and a 2.4GHz anti-interference controller.",
    specs: {
      "Recommended Age": "6 Years and up",
      "Top Speed": "25 km/h (15.5 mph)",
      "Control Range": "Up to 60 meters (200 ft)",
      "Batteries": "2x 7.4V Rechargeable Li-ion packs included",
      "Run Time": "30 mins total (15 mins per battery pack)"
    },
    reviews: [
      { author: "Carlos D.", rating: 5, date: "4 days ago", comment: "Fast, tough, took multiple bumps off ramps and kept flying!" },
      { author: "Rachel H.", rating: 4, date: "1 week ago", comment: "Controller is comfortable for small hands and the extra battery is awesome." }
    ],
    tags: ["rc", "car", "remote control", "outdoor", "speed"]
  },
  {
    id: "toy-5",
    name: "Enchanted Fairytale Wooden Castle Playset",
    category: "dolls",
    categoryLabel: "Dolls & Playsets",
    price: 84.99,
    originalPrice: 109.99,
    rating: 4.8,
    reviewCount: 115,
    age: "3-8",
    ageGroup: "3-5",
    badge: "Staff Pick",
    badgeType: "bestseller",
    inStock: true,
    stockCount: 6,
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A gorgeous multi-level wooden doll castle featuring open-plan rooms, working drawbridge, royal furniture pieces, 4 wooden royal figures, and a magical light-up chandelier.",
    specs: {
      "Recommended Age": "3 - 8 Years",
      "Material": "FSC-Certified sustainably sourced solid wood & non-toxic paint",
      "Accessories": "18 wooden furniture pieces and 4 figurines",
      "Assembly": "Easy slot-and-screw assembly with tool included",
      "Dimensions": "26\" H x 22\" W x 14\" D"
    },
    reviews: [
      { author: "Emily C.", rating: 5, date: "6 days ago", comment: "So much more durable than plastic dollhouses. The detailing is gorgeous!" }
    ],
    tags: ["dollhouse", "castle", "wood", "pretend", "figures"]
  },
  {
    id: "toy-6",
    name: "Junior Discovery Microscope & Science Lab Kit",
    category: "stem",
    categoryLabel: "STEM & Robotics",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.7,
    reviewCount: 76,
    age: "8+",
    ageGroup: "9+",
    badge: "Educational",
    badgeType: "new",
    inStock: true,
    stockCount: 19,
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Spark a lifelong love of biology! Features 100x, 400x, and 1200x magnification lenses, LED illumination, prepared specimen slides, blank slides, pipettes, and phone camera adapter.",
    specs: {
      "Recommended Age": "8 - 14 Years",
      "Magnification": "100x, 400x, 1200x optical glass lenses",
      "Includes": "30+ accessories, specimen vials, slides, full-color discovery booklet",
      "Lighting": "Adjustable dual LED top and bottom lighting (requires 2x AA)"
    },
    reviews: [
      { author: "Liam P.", rating: 5, date: "1 week ago", comment: "The phone mount lets us take photos of onion skin and insect wings. Unbelievable value!" }
    ],
    tags: ["microscope", "science", "stem", "lab", "biology"]
  },
  {
    id: "toy-7",
    name: "Classic Wooden Pastel Express Train Set (80 Pcs)",
    category: "wooden",
    categoryLabel: "Wooden Classics",
    price: 49.99,
    originalPrice: 62.99,
    rating: 4.9,
    reviewCount: 168,
    age: "2-6",
    ageGroup: "3-5",
    badge: "Eco-Friendly",
    badgeType: "bestseller",
    inStock: true,
    stockCount: 15,
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Handcrafted natural beechwood track set complete with suspension bridge, magnetic train wagons, passenger terminal, trees, and friendly village figurines.",
    specs: {
      "Recommended Age": "2 - 6 Years",
      "Material": "100% Solid European Beech Wood & water-based non-toxic paints",
      "Compatibility": "Universal track joints compatible with Brio, Thomas, Melissa & Doug",
      "Pieces": "80 interlocking tracks & accessories"
    },
    reviews: [
      { author: "Hannah G.", rating: 5, date: "3 days ago", comment: "Smooth edges, no splinters, beautiful soothing colors instead of harsh neon plastic." }
    ],
    tags: ["train", "wood", "classic", "toddler", "montessori"]
  },
  {
    id: "toy-8",
    name: "Rainbow Sparkle DIY Friendship Jewelry Studio",
    category: "arts",
    categoryLabel: "Arts & Crafts",
    price: 24.99,
    originalPrice: 32.00,
    rating: 4.8,
    reviewCount: 94,
    age: "5+",
    ageGroup: "6-8",
    badge: "Sale 22% Off",
    badgeType: "sale",
    inStock: true,
    stockCount: 25,
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Make over 50 custom bracelets, necklaces, and charms! Features spinning bead organizer, 3,000+ clay beads, metallic charms, alphabet letter beads, and elastic cords.",
    specs: {
      "Recommended Age": "5 - 12 Years",
      "Contains": "3,000+ Heishi polymer clay beads, 200 alphabet beads, 50 alloy charms",
      "Tools": "Safety scissors, tweezers, 4 rolls of crystal elastic string"
    },
    reviews: [
      { author: "Maria S.", rating: 5, date: "Just now", comment: "My daughter and her best friend spent hours making matching named bracelets!" }
    ],
    tags: ["crafts", "jewelry", "beads", "art", "creative"]
  },
  {
    id: "toy-9",
    name: "Mystic Forest 3D Family Board Game",
    category: "games",
    categoryLabel: "Board Games & Puzzles",
    price: 32.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviewCount: 130,
    age: "6+",
    ageGroup: "6-8",
    badge: "Award Winner",
    badgeType: "bestseller",
    inStock: true,
    stockCount: 18,
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A cooperative 3D fantasy board game where players team up to rescue magical creatures before the sundown! Features pop-up canopy trees, dice-rolling river rapids, and easy rules.",
    specs: {
      "Recommended Age": "6 Years to Adult",
      "Players": "2 to 4 Players",
      "Play Time": "25 - 40 Minutes per game",
      "Includes": "3D Pop-up gameboard, 4 sculpted animal tokens, 60 quest cards, custom wooden dice"
    },
    reviews: [
      { author: "Brian L.", rating: 5, date: "4 days ago", comment: "Finally a game that doesn't cause siblings to argue! Since it's cooperative, they work together." }
    ],
    tags: ["boardgame", "family", "puzzle", "fun", "games"]
  },
  {
    id: "toy-10",
    name: "AquaGlow Bath Duck & Bubble Submarine",
    category: "baby",
    categoryLabel: "Baby & Toddler",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.8,
    reviewCount: 154,
    age: "0-3",
    ageGroup: "0-2",
    badge: "Popular",
    badgeType: "bestseller",
    inStock: true,
    stockCount: 30,
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Turns every bath time into a bubbly sensory adventure! Waterproof motorized submarine with rotating water fountain, soft LED underwater lights, and suction cup mount.",
    specs: {
      "Recommended Age": "6 Months to 4 Years",
      "Waterproof Level": "IPX7 Full immersion waterproof seal",
      "Material": "100% Mould-resistant, BPA/Phthalate free silicone & ABS",
      "Power": "3x AAA Batteries with sealed screw compartment"
    },
    reviews: [
      { author: "Chloe N.", rating: 5, date: "1 week ago", comment: "My toddler used to cry during hair washing; now he begs for bath time to play with this!" }
    ],
    tags: ["bath", "baby", "toddler", "water", "sensory"]
  },
  {
    id: "toy-11",
    name: "PixelPro Kids Rugged Action Camera with Games",
    category: "tech",
    categoryLabel: "Tech Toys",
    price: 36.99,
    originalPrice: 48.00,
    rating: 4.7,
    reviewCount: 112,
    age: "4-10",
    ageGroup: "3-5",
    badge: "Kids Favorite",
    badgeType: "sale",
    inStock: true,
    stockCount: 16,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Real 1080P HD photos and video with shockproof silicone bumper case! Features 2.0-inch color screen, funny selfie stickers and filters, 4 retro mini-games, and 32GB SD card included.",
    specs: {
      "Recommended Age": "4 - 10 Years",
      "Video Resolution": "Full HD 1080P / 720P",
      "Storage": "32GB MicroSD card included (holds 10,000+ photos)",
      "Battery": "1000mAh rechargeable lithium battery (3-4 hours continuous use)",
      "Drop Protection": "Food-grade soft shockproof silicone armor"
    },
    reviews: [
      { author: "Arthur V.", rating: 5, date: "3 days ago", comment: "Surprisingly clear photos and very durable. My 5-year-old takes it everywhere on our hikes." }
    ],
    tags: ["camera", "kids", "tech", "photo", "gift"]
  },
  {
    id: "toy-12",
    name: "Cosmic Glow-in-the-Dark Pop-Up Fort Tent",
    category: "outdoor",
    categoryLabel: "Outdoor & Active",
    price: 38.99,
    originalPrice: 52.00,
    rating: 4.8,
    reviewCount: 88,
    age: "3+",
    ageGroup: "3-5",
    badge: "Sale 25% Off",
    badgeType: "sale",
    inStock: true,
    stockCount: 12,
    images: [
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Spacious play tent illuminated with glowing constellations, stars, and planets when the lights go down! Pops up in 10 seconds with breathable mesh windows and rollup doorway.",
    specs: {
      "Recommended Age": "3 Years and up",
      "Capacity": "Fits up to 3 kids comfortably",
      "Dimensions": "48\" diameter x 52\" height",
      "Foldable": "Folds flat into portable round zipper carry bag"
    },
    reviews: [
      { author: "Samantha K.", rating: 5, date: "5 days ago", comment: "The glow at night is magical. It's our cozy reading nook every evening." }
    ],
    tags: ["tent", "fort", "glow", "outdoor", "indoor", "pretend"]
  }
];

// Available coupon codes
const PROMO_CODES = {
  "MAGIC20": { discountPercent: 20, description: "20% off your entire order" },
  "TOY10": { discountAmount: 10, description: "$10 off orders over $40", minSpend: 40 },
  "FREESHIP": { freeShipping: true, description: "Free standard shipping" }
};
