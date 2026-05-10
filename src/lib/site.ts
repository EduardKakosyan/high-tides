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
  tagline: "A waterfront retreat where the day moves with the tide",
  description:
    "High Tides is a private waterfront cottage available to rent — open horizons, slow mornings, and quiet evenings on the water. Browse the gallery and get in touch to plan your stay.",
  url: "https://hightides.example.com",
  email: "stay@hightides.example.com",
  phone: "+1-902-555-0123",
  address: {
    line1: "Address available on request",
    city: "Halifax Region",
    region: "Nova Scotia",
    country: "Canada",
    postal: "",
  },
  socials: {
    instagram: undefined,
  },
  amenities: [
    {
      title: "The setting",
      items: [
        "Private waterfront with dock access",
        "Wraparound deck and outdoor dining",
        "Wood-fired hot tub overlooking the cove",
        "Fire pit and stargazing chairs",
      ],
    },
    {
      title: "Inside",
      items: [
        "Three bedrooms, sleeps up to six",
        "Open-plan kitchen with full appliances",
        "Cast-iron wood stove for cool evenings",
        "High-speed Wi-Fi and dedicated workspace",
      ],
    },
    {
      title: "On the water",
      items: [
        "Two paddleboards and a kayak",
        "Fishing gear and a small rowboat",
        "Sea-level swimming at low tide",
        "Sunrise yoga deck",
      ],
    },
  ],
  inquirySubject: "High Tides — enquiry",
};
