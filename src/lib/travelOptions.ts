export type TravelKind = "international-flight" | "local-flight" | "bus";

export type TravelOption = {
  id: string;
  kind: TravelKind;
  title: string;
  operator: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;
  seatsLeft: string;
  description: string;
};

export const localFlights: TravelOption[] = [
  {
    id: "lf-1",
    kind: "local-flight",
    title: "Brussels Shuttle Morning Hop",
    operator: "PXL Air Connect",
    origin: "Brussels (BRU)",
    destination: "Antwerp (ANR)",
    date: "2026-05-08",
    departureTime: "07:10",
    arrivalTime: "07:40",
    duration: "30m",
    price: "€58",
    seatsLeft: "12 seats left",
    description: "A quick weekday hop for business travelers and day trips.",
  },
  {
    id: "lf-2",
    kind: "local-flight",
    title: "Coastal Express",
    operator: "North Sea Wings",
    origin: "Brussels (BRU)",
    destination: "Ostend (OST)",
    date: "2026-05-09",
    departureTime: "09:25",
    arrivalTime: "10:00",
    duration: "35m",
    price: "€64",
    seatsLeft: "8 seats left",
    description: "Fast access to the coast with a comfortable regional aircraft.",
  },
  {
    id: "lf-3",
    kind: "local-flight",
    title: "Campus Connector",
    operator: "Belgian Regional Air",
    origin: "Brussels (BRU)",
    destination: "Liège (LGG)",
    date: "2026-05-10",
    departureTime: "13:15",
    arrivalTime: "13:55",
    duration: "40m",
    price: "€61",
    seatsLeft: "10 seats left",
    description: "A practical route for quick intercity travel within Belgium.",
  },
  {
    id: "lf-4",
    kind: "local-flight",
    title: "Weekend City Link",
    operator: "PXL Air Connect",
    origin: "Brussels (BRU)",
    destination: "Charleroi (CRL)",
    date: "2026-05-11",
    departureTime: "18:30",
    arrivalTime: "19:05",
    duration: "35m",
    price: "€49",
    seatsLeft: "15 seats left",
    description: "An easy route for weekend city breaks and airport transfers.",
  },
];

export const busTrips: TravelOption[] = [
  {
    id: "bus-1",
    kind: "bus",
    title: "City Center Loop",
    operator: "PXL City Bus",
    origin: "PXL Campus",
    destination: "Downtown Hasselt",
    date: "2026-05-08",
    departureTime: "08:00",
    arrivalTime: "08:20",
    duration: "20m",
    price: "€4",
    seatsLeft: "22 seats left",
    description: "A direct city bus for daily campus and downtown travel.",
  },
  {
    id: "bus-2",
    kind: "bus",
    title: "Campus to Rail Hub",
    operator: "Urban Mobility Line",
    origin: "PXL Campus",
    destination: "Hasselt Station",
    date: "2026-05-08",
    departureTime: "09:15",
    arrivalTime: "09:32",
    duration: "17m",
    price: "€3",
    seatsLeft: "18 seats left",
    description: "Frequent departures for commuters and students.",
  },
  {
    id: "bus-3",
    kind: "bus",
    title: "Evening District Shuttle",
    operator: "PXL City Bus",
    origin: "Hasselt Station",
    destination: "Kuringen",
    date: "2026-05-09",
    departureTime: "17:40",
    arrivalTime: "18:05",
    duration: "25m",
    price: "€4",
    seatsLeft: "14 seats left",
    description: "A reliable evening shuttle for neighborhood connections.",
  },
  {
    id: "bus-4",
    kind: "bus",
    title: "Weekend Festival Bus",
    operator: "Urban Mobility Line",
    origin: "PXL Campus",
    destination: "City Festival Park",
    date: "2026-05-10",
    departureTime: "11:00",
    arrivalTime: "11:28",
    duration: "28m",
    price: "€5",
    seatsLeft: "11 seats left",
    description: "Special bus service for large local events and weekends.",
  },
];

export const internationalSearchHint =
  "Search flights";