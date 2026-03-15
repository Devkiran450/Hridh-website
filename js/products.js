const products = [
  {
    id: 1,
    name: "Blue Yellow Whirlpool Contemporary Art",
    code: "Code: Hridh-2601",
    price: 2999,
    originalPrice: 4999,
    story:"Inspired by the fluid motion of water currents, this hand-painted design blends deep blues with warm yellow tones to create a striking whirlpool effect.",
    description:
      "• Dynamic blue & yellow whirlpool artwork\n• Size: 48cm x 218cm\n• Fabric: Soft cotton\n• Durable acrylic & pigment colors\n• Bold modern statement piece\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product1_4.jpeg",
      "images/product1_1.jpeg",
      "images/product1_2.jpeg",
      "images/product1_3.jpeg"
    ]
  },
  {
    id: 2,
    name: "Brush Stroke Modern Abstract Linen Art",
    code: "Code: Hridh-2602",
    price: 2999,
    originalPrice: 4999,
    story:"Bold brush strokes flow across natural linen, creating a modern abstract composition that captures the spontaneity and energy of hand-painted art.",
    description:
      "• Contemporary brush stroke artwork\n• Size: 44cm x 210cm\n• Fabric: Linen flax\n• Premium natural texture\n• Long-lasting acrylic & pigment colors\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product2_4.jpeg",
      "images/product2_1.jpeg",
      "images/product2_2.jpeg",
      "images/product2_3.jpeg"
    ]
  },
  {
    id: 3,
    name: "Black Gold Leaf Luxe Textile Art",
    code: "Code: Hridh-2603",
    price: 3999,
    originalPrice: 4999,
    story:"A dramatic contrast of deep black and luminous gold leaf creates a refined artistic composition that brings a sense of elegance and modern luxury.",
    description:
      "• Black & gold leaf artistic design\n• Size: 46cm x 220cm\n• Fabric: Rayon & viscose blend\n• Smooth drape with premium finish\n• Durable acrylic & pigment colors\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product3_4.jpeg",
      "images/product3_1.jpeg",
      "images/product3_2.jpeg",
      "images/product3_3.jpeg"
    ]
  },
  {
    id: 4,
    name: "Black Pink Rose Artistic Floral Design",
    code: "Code: Hridh-2604",
    price: 3999,
    originalPrice: 4999,
    story:"Hand-painted pink roses bloom against a rich black backdrop, blending classic floral beauty with a contemporary artistic expression.",
    description:
      "Black pelican painting Size- 41cm x 222cm Fabric- Rayon and Viscose blend Fast acrylic/pigment fabric colour Care instruction : Cold wash, shade dry and light iron from the back side of painting.",
    images: [
      "images/product4_4.jpeg",
      "images/product4_1.jpeg",
      "images/product4_2.jpeg",
      "images/product4_3.jpeg"
    ]
  },
  {
    id: 5,
    name: "Guitar Linen Flax Artistic Textile",
    code: "Code: Hridh-2605",
    price: 3999,
    originalPrice: 4999,
    story:"Inspired by the rhythm and form of a guitar, this artistic design transforms musical expression into a vibrant hand-painted textile composition.",
    description:
      "• Guitar-themed artistic design\n• Size: 47cm x 216cm\n• Fabric: Linen flax\n• Natural woven texture\n• Durable acrylic & pigment fabric colors\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product5_4.jpeg",
      "images/product5_1.jpeg",
      "images/product5_2.jpeg",
      "images/product5_3.jpeg"
    ]
  },
  {
    id: 6,
    name: "Black Pelican Minimal Wildlife Art",
    code: "Code: Hridh-2606",
    price: 3999,
    originalPrice: 4999,
    story:"A minimalist pelican silhouette emerges from bold black strokes, creating a striking wildlife-inspired design with modern artistic simplicity.",
    description:
      "• Minimalist black pelican design\n• Size: 41cm x 222cm\n• Fabric: Rayon & viscose blend\n• Durable acrylic & pigment fabric colors\n• Modern artistic appeal\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product6_4.jpeg",
      "images/product6_1.jpeg",
      "images/product6_2.jpeg",
      "images/product6_3.jpeg"
    ]
  },
  {
    id: 7,
    name: "Yellow Pink Bubble Abstract Art",
    code: "Code: Hridh-2607",
    price: 2999,
    originalPrice: 4999,
    story:"Vibrant yellow and pink tones form playful bubble-like patterns, creating a lively abstract composition full of color and movement.",
    description:
      "• Vibrant yellow & pink bubble design\n• Size: 47cm x 214cm\n• Fabric: Soft cotton\n• Fast acrylic & pigment fabric colors\n• Contemporary abstract styling\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product7_4.jpeg",
      "images/product7_1.jpeg",
      "images/product7_2.jpeg",
      "images/product7_3.jpeg"
    ]
  },
  {
    id: 8,
    name: "Yellow House – Hand-Painted Textile Art",
    code: "Code: Hridh-2608",
    price: 3999,
    originalPrice: 4999,
    story:"A charming yellow house motif brings warmth and character to this hand-painted design, blending architectural inspiration with textile artistry.",
    description:
      "• Hand-painted yellow house artwork\n• Size: 53cm x 220cm\n• Fabric: Soft cotton / muslin\n• Fast acrylic & pigment fabric colors\n• Suitable for wall decor or textile styling\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product8_4.jpeg",
      "images/product8_1.jpeg",
      "images/product8_2.jpeg",
      "images/product8_3.jpeg"
    ]
  },
  {
    id: 9,
    name: "Black Castle Statement Textile Art",
    code: "Code: Hridh-2609",
    price: 3999,
    originalPrice: 4999,
    story:"Inspired by the bold silhouette of a castle, this dramatic design creates a powerful statement through strong forms and striking contrasts.",
    description:
      "• Bold black castle-inspired design\n• Size: 54cm x 220cm\n• Fabric: Soft cotton\n• Durable acrylic & pigment colors\n• Modern artistic styling\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product9_4.jpeg",
      "images/product9_1.jpeg",
      "images/product9_2.jpeg",
      "images/product9_3.jpeg"
    ]
  },
  {
    id: 10,
    name: "Tomato Black Leaf Botanical Art",
    code: "Code: Hridh-2610",
    price: 2999,
    originalPrice: 4999,
    story:"Rich tomato red tones meet deep black botanical leaves, creating a nature-inspired design that balances bold color with organic elegance.",
    description:
      "• Tomato red & black leaf botanical design\n• Size: 50cm x 216cm\n• Fabric: Soft cotton\n• Fast acrylic & pigment fabric colors\n• Elegant nature-inspired styling\n• Care: Cold wash separately, shade dry, iron on reverse only",
    images: [
      "images/product10_4.jpeg",
      "images/product10_1.jpeg",
      "images/product10_2.jpeg",
      "images/product10_3.jpeg"
    ]
  }
  // {
  //   id: 11,
  //   name: "Hridh Modern Shirt",
  //   price: 2099,
  //   description:
  //     "Modern slim-fit shirt designed for versatility across work and casual settings.",
  //   images: [
  //     "images/product11_1.jfif",
  //     "images/product11_2.jpg",
  //     "images/product11_3.jpg"
  //   ]
  // },
  // {
  //   id: 12,
  //   name: "Hridh Signature Kurta",
  //   price: 2599,
  //   description:
  //     "Signature kurta with premium fabric, refined stitching, and timeless appeal.",
  //   images: [
  //     "images/product12_1.jfif",
  //     "images/product12_2.jpg",
  //     "images/product12_3.jpg"
  //   ]
  // }
];
