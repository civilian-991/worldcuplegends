export interface Legend {
  id: number;
  name: string;
  shortName: string;
  country: string;
  countryCode: string;
  position: string;
  era: string;
  goals: number;
  assists: number;
  appearances: number;
  worldCups: number;
  image: string;
  team: string;
  jerseyNumber: number;
  rating: number;
}

export const legends: Legend[] = [
  {
    id: 1,
    name: "Pelé",
    shortName: "PEL",
    country: "Brazil",
    countryCode: "BR",
    position: "Forward",
    era: "60s-70s",
    goals: 77,
    assists: 36,
    appearances: 92,
    worldCups: 3,
    image: "/legends/pele.png",
    team: "Brazil",
    jerseyNumber: 10,
    rating: 98
  },
  {
    id: 2,
    name: "Diego Maradona",
    shortName: "MAR",
    country: "Argentina",
    countryCode: "AR",
    position: "Attacking Midfielder",
    era: "80s",
    goals: 34,
    assists: 16,
    appearances: 91,
    worldCups: 1,
    image: "/legends/maradona.png",
    team: "Argentina",
    jerseyNumber: 10,
    rating: 97
  },
  {
    id: 3,
    name: "Zinedine Zidane",
    shortName: "ZID",
    country: "France",
    countryCode: "FR",
    position: "Attacking Midfielder",
    era: "90s-00s",
    goals: 31,
    assists: 25,
    appearances: 108,
    worldCups: 1,
    image: "/legends/zidane.png",
    team: "France",
    jerseyNumber: 10,
    rating: 96
  },
  {
    id: 4,
    name: "Ronaldo Nazário",
    shortName: "R9",
    country: "Brazil",
    countryCode: "BR",
    position: "Striker",
    era: "90s-00s",
    goals: 62,
    assists: 12,
    appearances: 98,
    worldCups: 2,
    image: "/legends/ronaldo.png",
    team: "Brazil",
    jerseyNumber: 9,
    rating: 96
  },
  {
    id: 5,
    name: "Johan Cruyff",
    shortName: "CRU",
    country: "Netherlands",
    countryCode: "NL",
    position: "Forward",
    era: "70s",
    goals: 33,
    assists: 21,
    appearances: 48,
    worldCups: 0,
    image: "/legends/cruyff.png",
    team: "Netherlands",
    jerseyNumber: 14,
    rating: 95
  },
  {
    id: 6,
    name: "Franz Beckenbauer",
    shortName: "BEC",
    country: "Germany",
    countryCode: "DE",
    position: "Sweeper",
    era: "70s",
    goals: 14,
    assists: 18,
    appearances: 103,
    worldCups: 1,
    image: "/legends/beckenbauer.png",
    team: "Germany",
    jerseyNumber: 5,
    rating: 95
  },
  {
    id: 7,
    name: "Lionel Messi",
    shortName: "MES",
    country: "Argentina",
    countryCode: "AR",
    position: "Forward",
    era: "2010s-20s",
    goals: 109,
    assists: 58,
    appearances: 187,
    worldCups: 1,
    image: "/legends/messi.png",
    team: "Argentina",
    jerseyNumber: 10,
    rating: 99
  },
  {
    id: 8,
    name: "Cristiano Ronaldo",
    shortName: "CR7",
    country: "Portugal",
    countryCode: "PT",
    position: "Forward",
    era: "2000s-20s",
    goals: 135,
    assists: 45,
    appearances: 217,
    worldCups: 0,
    image: "/legends/cr7.png",
    team: "Portugal",
    jerseyNumber: 7,
    rating: 98
  },
  {
    id: 9,
    name: "Ronaldinho",
    shortName: "R10",
    country: "Brazil",
    countryCode: "BR",
    position: "Attacking Midfielder",
    era: "2000s",
    goals: 33,
    assists: 27,
    appearances: 97,
    worldCups: 1,
    image: "/legends/ronaldinho.png",
    team: "Brazil",
    jerseyNumber: 10,
    rating: 94
  },
  {
    id: 10,
    name: "Paolo Maldini",
    shortName: "MAL",
    country: "Italy",
    countryCode: "IT",
    position: "Defender",
    era: "90s-00s",
    goals: 7,
    assists: 14,
    appearances: 126,
    worldCups: 0,
    image: "/legends/maldini.png",
    team: "Italy",
    jerseyNumber: 3,
    rating: 94
  },
  {
    id: 11,
    name: "Gerd Müller",
    shortName: "MUL",
    country: "Germany",
    countryCode: "DE",
    position: "Striker",
    era: "70s",
    goals: 68,
    assists: 8,
    appearances: 62,
    worldCups: 1,
    image: "/legends/muller.png",
    team: "Germany",
    jerseyNumber: 13,
    rating: 94
  },
  {
    id: 12,
    name: "Thierry Henry",
    shortName: "HEN",
    country: "France",
    countryCode: "FR",
    position: "Striker",
    era: "2000s",
    goals: 51,
    assists: 24,
    appearances: 123,
    worldCups: 1,
    image: "/legends/henry.png",
    team: "France",
    jerseyNumber: 12,
    rating: 93
  }
];

export interface Team {
  id: number;
  name: string;
  countryCode: string;
  flag: string;
  worldCups: number;
  worldCupYears: string[];
  confederation: string;
  rating: number;
  color: string;
  legends: string[];
}

export const teams: Team[] = [
  {
    id: 1,
    name: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    worldCups: 5,
    worldCupYears: ["1958", "1962", "1970", "1994", "2002"],
    confederation: "CONMEBOL",
    rating: 98,
    color: "#009739",
    legends: ["Pelé", "Ronaldo Nazário", "Ronaldinho", "Cafu", "Roberto Carlos"]
  },
  {
    id: 2,
    name: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    worldCups: 4,
    worldCupYears: ["1954", "1974", "1990", "2014"],
    confederation: "UEFA",
    rating: 96,
    color: "#000000",
    legends: ["Franz Beckenbauer", "Gerd Müller", "Lothar Matthäus", "Miroslav Klose"]
  },
  {
    id: 3,
    name: "Argentina",
    countryCode: "AR",
    flag: "🇦🇷",
    worldCups: 3,
    worldCupYears: ["1978", "1986", "2022"],
    confederation: "CONMEBOL",
    rating: 97,
    color: "#75AADB",
    legends: ["Diego Maradona", "Lionel Messi", "Gabriel Batistuta", "Daniel Passarella"]
  },
  {
    id: 4,
    name: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    worldCups: 2,
    worldCupYears: ["1998", "2018"],
    confederation: "UEFA",
    rating: 95,
    color: "#002654",
    legends: ["Zinedine Zidane", "Thierry Henry", "Michel Platini", "Kylian Mbappé"]
  },
  {
    id: 5,
    name: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    worldCups: 4,
    worldCupYears: ["1934", "1938", "1982", "2006"],
    confederation: "UEFA",
    rating: 94,
    color: "#008C45",
    legends: ["Paolo Maldini", "Roberto Baggio", "Franco Baresi", "Fabio Cannavaro"]
  },
  {
    id: 6,
    name: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    worldCups: 0,
    worldCupYears: [],
    confederation: "UEFA",
    rating: 92,
    color: "#FF6600",
    legends: ["Johan Cruyff", "Marco van Basten", "Ruud Gullit", "Dennis Bergkamp"]
  },
  {
    id: 7,
    name: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    worldCups: 1,
    worldCupYears: ["2010"],
    confederation: "UEFA",
    rating: 93,
    color: "#C60B1E",
    legends: ["Xavi Hernández", "Andrés Iniesta", "Iker Casillas", "Sergio Ramos"]
  },
  {
    id: 8,
    name: "England",
    countryCode: "GB",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    worldCups: 1,
    worldCupYears: ["1966"],
    confederation: "UEFA",
    rating: 91,
    color: "#FFFFFF",
    legends: ["Bobby Moore", "Bobby Charlton", "Gary Lineker", "David Beckham"]
  }
];

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  homeCountryCode: string;
  awayCountryCode: string;
  date: string;
  time: string;
  venue: string;
  stage: string;
  homeScore?: number;
  awayScore?: number;
  isLive?: boolean;
}

export const matches: Match[] = [
  {
    id: 1,
    homeTeam: "Brazil",
    awayTeam: "Germany",
    homeFlag: "🇧🇷",
    awayFlag: "🇩🇪",
    homeCountryCode: "BR",
    awayCountryCode: "DE",
    date: "2026-06-15",
    time: "20:00",
    venue: "MetLife Stadium, New Jersey",
    stage: "Group A",
    isLive: true,
    homeScore: 2,
    awayScore: 1
  },
  {
    id: 2,
    homeTeam: "Argentina",
    awayTeam: "France",
    homeFlag: "🇦🇷",
    awayFlag: "🇫🇷",
    homeCountryCode: "AR",
    awayCountryCode: "FR",
    date: "2026-06-16",
    time: "18:00",
    venue: "SoFi Stadium, Los Angeles",
    stage: "Group B"
  },
  {
    id: 3,
    homeTeam: "Italy",
    awayTeam: "Spain",
    homeFlag: "🇮🇹",
    awayFlag: "🇪🇸",
    homeCountryCode: "IT",
    awayCountryCode: "ES",
    date: "2026-06-17",
    time: "21:00",
    venue: "AT&T Stadium, Dallas",
    stage: "Group C"
  },
  {
    id: 4,
    homeTeam: "Netherlands",
    awayTeam: "England",
    homeFlag: "🇳🇱",
    awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    homeCountryCode: "NL",
    awayCountryCode: "GB",
    date: "2026-06-18",
    time: "19:00",
    venue: "Hard Rock Stadium, Miami",
    stage: "Group D"
  },
  {
    id: 5,
    homeTeam: "Brazil",
    awayTeam: "Argentina",
    homeFlag: "🇧🇷",
    awayFlag: "🇦🇷",
    homeCountryCode: "BR",
    awayCountryCode: "AR",
    date: "2026-07-01",
    time: "20:00",
    venue: "MetLife Stadium, New Jersey",
    stage: "Semi-Final"
  },
  {
    id: 6,
    homeTeam: "Germany",
    awayTeam: "France",
    homeFlag: "🇩🇪",
    awayFlag: "🇫🇷",
    homeCountryCode: "DE",
    awayCountryCode: "FR",
    date: "2026-07-02",
    time: "20:00",
    venue: "Rose Bowl, Pasadena",
    stage: "Semi-Final"
  },
  {
    id: 7,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeFlag: "🏆",
    awayFlag: "🏆",
    homeCountryCode: "TBD",
    awayCountryCode: "TBD",
    date: "2026-07-19",
    time: "19:00",
    venue: "MetLife Stadium, New Jersey",
    stage: "Final"
  }
];

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

export const news: NewsArticle[] = [
  {
    id: 1,
    title: "The Greatest World Cup Goals: A Journey Through Time",
    excerpt: "From Maradona's solo run to Zidane's header, we revisit the moments that defined football history.",
    image: "/news/goals.jpg",
    category: "History",
    date: "2026-01-08",
    author: "Carlos Silva",
    readTime: "8 min"
  },
  {
    id: 2,
    title: "Legends Unite: Brazil vs Argentina Exhibition Announced",
    excerpt: "Football's greatest rivalry returns as legendary players prepare for a historic exhibition match.",
    image: "/news/exhibition.jpg",
    category: "Events",
    date: "2026-01-07",
    author: "Maria Santos",
    readTime: "5 min"
  },
  {
    id: 3,
    title: "Exclusive Interview: Zinedine Zidane on Leadership",
    excerpt: "The French maestro shares insights on what it takes to lead a national team to World Cup glory.",
    image: "/news/zidane-interview.jpg",
    category: "Interview",
    date: "2026-01-06",
    author: "Jean-Pierre Dubois",
    readTime: "12 min"
  },
  {
    id: 4,
    title: "World Legends Cup 2026: What We Know So Far",
    excerpt: "Full breakdown of the tournament format, participating legends, and host venues across three nations.",
    image: "/news/tournament.jpg",
    category: "Tournament",
    date: "2026-01-05",
    author: "Jake Wetton",
    readTime: "10 min"
  },
  {
    id: 5,
    title: "The Art of the Number 10: Football's Most Iconic Position",
    excerpt: "Exploring the legacy of the playmaker role and the legends who defined it across generations.",
    image: "/news/number10.jpg",
    category: "Analysis",
    date: "2026-01-04",
    author: "Alessandro Romano",
    readTime: "7 min"
  },
  {
    id: 6,
    title: "Behind the Scenes: Training with the Legends",
    excerpt: "Exclusive access to how football's greatest prepare for the ultimate exhibition tournament.",
    image: "/news/training.jpg",
    category: "Exclusive",
    date: "2026-01-03",
    author: "Sophie Mueller",
    readTime: "6 min"
  }
];
