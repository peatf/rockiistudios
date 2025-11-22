// --- ASSETS & DATA ---

export const IMAGES = {
    logo: "https://www.dropbox.com/scl/fi/x07b12jdqjz5apg8n1r73/rs_logo.png?rlkey=hkw7g00okr293mbfo75r9fiqw&st=wr9q3x0b&raw=1",
    workshop_interior: "https://www.dropbox.com/scl/fi/nppbq38u217ph2qz1wogd/pretty-photo-workshop-interior.jpg?rlkey=0ybqcjrsj3iss5cpb34f55ivh&st=ajyzo1py&raw=1",
    workshop_exterior: "https://www.dropbox.com/scl/fi/b4ef45uf82ocbkcd8l6cr/pretty-photo-workshop-exterior.jpg?rlkey=sqbbh4e5kkaqcbogufu6g3gva&st=hnulpojq&raw=1",
    people_working: "https://www.dropbox.com/scl/fi/jr7wpjkuzrgq90bdmww9j/people-in-workshop.jpg?rlkey=rfxd0v2y0jlvmzuw0gsh7kt7u&st=qf1p509l&raw=1"
};

export const BEAD_IMAGES = {
    gold_blue_star: "https://dl.dropboxusercontent.com/scl/fi/xveixnp31uat0lhgog1qf/rs_Gold-Beads-Blue-Gem-Star-Background-Removed.png?rlkey=wfsytz3qh1v5lqnw2dwxyfkjd&raw=1",
    gold_green_rock: "https://dl.dropboxusercontent.com/scl/fi/01xzaipnq4nc38l5che7r/rs_Gold-Beads-Green-Gem-Rock-Background-Removed.png?rlkey=br54jstjfkxka54hctncbwr5l&raw=1",
    gold_spiral: "https://dl.dropboxusercontent.com/scl/fi/h76yd6vns76uqrcc10dus/rs_Gold-Beads-Spiral-Background-Removed.png?rlkey=fmlwrzmo184d9u5vht8fxk39g&raw=1",
    gold_white_rock: "https://dl.dropboxusercontent.com/scl/fi/tvtlzdlv0tgcvu81hs4vk/rs_Gold-Beads-White-Gem-Rock-Background-Removed.png?rlkey=l35ypd6y7skorncxxd0lfbidu&raw=1",
    gold_white_star: "https://dl.dropboxusercontent.com/scl/fi/8vwd7bt4m2igf2wupx2jo/rs_Gold-Beads-White-Gem-Star-Background-Removed.png?rlkey=aktkr7q6xelailnfljlqtl9h1&raw=1",

    silver_blue_rock: "https://dl.dropboxusercontent.com/scl/fi/ih02h59i0int84fhc7z8v/rs_Silver-Beads-Blue-Gem-Rock-Background-Removed.png?rlkey=24kpe3254cznu7sr363ln4m6s&raw=1",
    silver_blue_star: "https://dl.dropboxusercontent.com/scl/fi/q1acb12b8stn9dfyqdysf/rs_Silver-Beads-Blue-Gem-Star-Background-Removed.png?rlkey=bb9mxb1pu3mxlhs1mdthyi2aw&raw=1",
    silver_citrine_rock: "https://dl.dropboxusercontent.com/scl/fi/7zksfja0jjqnctxpeusnw/rs_Silver-Beads-Citrine-Gem-Rock-Background-Removed.png?rlkey=qtne69rydpes4silfw2qx7qke&raw=1",
    silver_citrine_star: "https://dl.dropboxusercontent.com/scl/fi/0yzvqhiemajdth5egvffw/rs_Silver-Beads-Citrine-Gem-Star-Background-Removed.png?rlkey=4t9lysuw2mdqp7s6w4kp4dokr&raw=1",
    silver_green_star: "https://dl.dropboxusercontent.com/scl/fi/inqho7zeeny1ukl17oy7v/rs_Silver-Beads-Green-Gem-Star-Background-Removed.png?rlkey=1wv3ksfvzufzqmpg6o3gzt0kb&raw=1",
    silver_spiral: "https://dl.dropboxusercontent.com/scl/fi/jsj3t803f2xts1swwqwfm/rs_Silver-Beads-Spiral-Background-Removed.png?rlkey=vj8j6ll1btx4ifbsmau2v889s&raw=1"
};

export const BEAD_LIBRARY = {
    silver: [
        { id: 'silver-blue-rock', name: 'Blue Gem Rock', code: 'S-BGR-01', img: BEAD_IMAGES.silver_blue_rock },
        { id: 'silver-blue-star', name: 'Blue Gem Star', code: 'S-BGS-02', img: BEAD_IMAGES.silver_blue_star },
        { id: 'silver-citrine-rock', name: 'Citrine Rock', code: 'S-CTR-03', img: BEAD_IMAGES.silver_citrine_rock },
        { id: 'silver-citrine-star', name: 'Citrine Star', code: 'S-CTS-04', img: BEAD_IMAGES.silver_citrine_star },
        { id: 'silver-green-star', name: 'Green Star', code: 'S-GRS-05', img: BEAD_IMAGES.silver_green_star },
        { id: 'silver-spiral', name: 'Spiral', code: 'S-SPR-06', img: BEAD_IMAGES.silver_spiral },
    ],
    gold: [
        { id: 'gold-blue-star', name: 'Blue Gem Star', code: 'G-BGS-01', img: BEAD_IMAGES.gold_blue_star },
        { id: 'gold-green-rock', name: 'Green Gem Rock', code: 'G-GGR-02', img: BEAD_IMAGES.gold_green_rock },
        { id: 'gold-spiral', name: 'Spiral', code: 'G-SPR-03', img: BEAD_IMAGES.gold_spiral },
        { id: 'gold-white-rock', name: 'White Gem Rock', code: 'G-WGR-04', img: BEAD_IMAGES.gold_white_rock },
        { id: 'gold-white-star', name: 'White Gem Star', code: 'G-WGS-05', img: BEAD_IMAGES.gold_white_star }
    ]
};

// Custom Pricing Logic
export const CUSTOM_PRICING = {
    1: 65,
    2: 105,
    3: 145,
    4: 185,
    5: 225,
    6: 245,
    7: 285,
    8: 325
};

export const PRODUCTS = [
  {
    id: '001',
    ref: 'PDT-SLC-X1',
    name: "Silver Clay Cross",
    type: "Pendant",
    material: "925 Sterling Silver Clay",
    price: 177.00,
    desc: "One-of-a-kind handmade piece featuring cubic zirconia stones. 18-inch chain with extender.",
    color: "#E0E0E0",
    image: "https://www.dropbox.com/scl/fi/if0noi798h252bl8z5ars/rs_Silver-Clay-Cross.png?rlkey=b2sk6kt0i6nmz081721z1s6sk&st=g0c4mg5l&raw=1"
  },
  {
    id: '002',
    ref: 'CST-RCK-B2',
    name: "Rockii Beads",
    type: "Custom System",
    material: "Mixed Metals & Glass",
    price: 105.00, // Base price display, actual calculation happens in builder
    desc: "Custom piece with 1-8 beads on 925 silver or gold-filled chain. 18-inch standard.",
    color: "#D4AF37",
    image: "https://www.dropbox.com/scl/fi/dz7uryqec1j5nxeh8pnrq/rs_Rockii-Beads.png?rlkey=y8i4suxukemmlal7ypxcrs61q&st=on9xryoo&raw=1",
    isCustomizable: true
  },
  {
    id: '003',
    ref: 'PDT-SLC-F3',
    name: "Silver Clay Flower",
    type: "Pendant",
    material: "925 Silver Clay",
    price: 150.00,
    desc: "Handmade in Los Angeles. Water resistant. 15-inch chain with 1-inch extender.",
    color: "#F5F5F5",
    image: "https://www.dropbox.com/scl/fi/n2g352no3ckth33ryosxo/rs_Silver-Clay-Flower.png?rlkey=vy8johemz5chqzwfrd22kjkv6&st=05nwxrnz&raw=1"
  },
  {
    id: '004',
    ref: 'DGT-GFT-C4',
    name: "Gift Card",
    type: "Digital",
    material: "Digital Asset",
    price: 100.00,
    desc: "Delivered by email with instructions to redeem. No additional processing fees.",
    color: "#2A2A2A",
    image: IMAGES.logo
  },
  {
    id: '005',
    ref: 'EXP-WKS-T5',
    name: "Workshop Ticket",
    type: "Experience",
    material: "Live Event",
    price: 100.00,
    desc: "Join us at The Greenhouse Studio in Silver Lake. Create your own unique piece.",
    color: "#8FBC8F",
    image: "https://www.dropbox.com/scl/fi/t59mh39tnbe92ftrj3gv1/admit-one.png?rlkey=qi0dpr4blxkdlvpcwchzfb5bh&st=7ehvpmaq&raw=1"
  }
];

export const WORKSHOPS = [
  { date: "NOV 22", day: "Saturday", time: "12:00 — 14:00", seats: 4 },
  { date: "NOV 29", day: "Saturday", time: "12:00 — 14:00", seats: 2 },
  { date: "NOV 30", day: "Sunday", time: "12:00 — 14:00", seats: 0 } // Sold out
];

export const NAV_LINKS = [
  { key: 'catalogue', label: 'Catalogue', target: 'home' },
  { key: 'workshops', label: 'Workshops', target: 'workshops' },
  { key: 'journal', label: 'Journal', target: 'journal' },
];
