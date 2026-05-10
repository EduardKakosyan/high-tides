export interface AmenityGroup {
  title: string;
  items: string[];
}

export interface SiteData {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    region: string;
    country: string;
    postal: string;
  };
  socials: {
    instagram?: string;
  };
  amenities: AmenityGroup[];
  inquirySubject: string;
}

export const site: SiteData = {
  name: "High Tides",
  tagline: "A quiet cottage in Port Mouton, a short walk from the Atlantic",
  description:
    "High Tides is a renovated cottage in Port Mouton, on Nova Scotia's South Shore. A four-minute walk takes you to a private stretch of beach. Browse the place and get in touch to plan your stay.",
  url: "https://hightides.example.com",
  email: "stay@hightides.example.com",
  phone: "+1-902-555-0123",
  address: {
    line1: "Address available on request",
    city: "Port Mouton",
    region: "Nova Scotia",
    country: "Canada",
    postal: "B0T",
  },
  socials: {
    instagram: undefined,
  },
  amenities: [
    {
      title: "The setting",
      items: [
        "Four-minute walk to a private stretch of beach",
        "Carters Beach and the Kejimkujik Seaside Adjunct a short drive away",
        "Lobster boats at the wharf in the morning",
        "Quiet road, stars overhead, surf within earshot",
      ],
    },
    {
      title: "The cottage",
      items: [
        "Three bedrooms, sleeps up to six",
        "Open-plan kitchen with full appliances",
        "Cast-iron wood stove for the cool evenings",
        "Screened porch and a small back deck",
        "High-speed Wi-Fi if you have to keep one foot at work",
      ],
    },
    {
      title: "On the water and in the woods",
      items: [
        "Paddleboards and a kayak you can carry to the beach",
        "Beach towels, chairs, and a cooler always packed",
        "Walking trails into the spruce and along the shore",
        "Lobster pound and farm stand a short drive away",
      ],
    },
  ],
  inquirySubject: "High Tides Port Mouton — enquiry",
};
