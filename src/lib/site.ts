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
  name: "HiTides",
  tagline: "A cottage by the Atlantic, kept for a few guests each summer.",
  description:
    "A renovated cottage on the South Shore — three bedrooms, a wood stove, a kayak in the shed, and a path down to the water through the spruce. Enquiries by email.",
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
      title: "Outside",
      items: [
        "Screened porch facing the spruce",
        "Small back deck with a kettle barbecue",
        "Outdoor shower for after the beach",
        "Fire pit and a stack of dry hardwood",
      ],
    },
    {
      title: "Inside",
      items: [
        "Three bedrooms, sleeps up to six",
        "Cast-iron wood stove for the cool evenings",
        "Open kitchen with full appliances and a French press",
        "A shelf of paperbacks and a turntable that mostly works",
        "Wi-Fi if you need to take a call",
      ],
    },
    {
      title: "Gear in the shed",
      items: [
        "A kayak and two paddleboards you can carry down",
        "Beach chairs, towels, and a cooler ready by the door",
        "Bikes for the back roads, helmets in the bin",
        "Tide chart on the fridge, bird book on the windowsill",
      ],
    },
  ],
  inquirySubject: "HiTides — enquiry",
};
