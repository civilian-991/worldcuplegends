import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`;

interface ImageSpec {
  filename: string;
  folder: string;
  prompt: string;
}

// All images to generate
const images: ImageSpec[] = [
  // PRODUCTS - Jerseys
  {
    filename: 'jersey-home.png',
    folder: 'products',
    prompt: 'Professional product photo of a premium black football jersey with gold accents and "WLC 2026" badge, on dark background, e-commerce style, high quality, centered'
  },
  {
    filename: 'brazil-retro.png',
    folder: 'products',
    prompt: 'Professional product photo of a classic Brazil yellow football jersey with green trim, retro 1970s style, on dark background, e-commerce style, high quality, centered'
  },
  {
    filename: 'argentina-retro.png',
    folder: 'products',
    prompt: 'Professional product photo of Argentina national team jersey with sky blue and white vertical stripes, retro style, on dark background, e-commerce style, centered'
  },
  {
    filename: 'germany-retro.png',
    folder: 'products',
    prompt: 'Professional product photo of Germany national team white jersey with black details, classic retro style, on dark background, e-commerce style, centered'
  },
  {
    filename: 'italy-retro.png',
    folder: 'products',
    prompt: 'Professional product photo of Italy Azzurri blue football jersey, classic retro style, on dark background, e-commerce style, centered'
  },
  {
    filename: 'france-retro.png',
    folder: 'products',
    prompt: 'Professional product photo of France national team blue jersey with red and white accents, retro style, on dark background, e-commerce style, centered'
  },

  // PRODUCTS - Outerwear
  {
    filename: 'training-jacket.png',
    folder: 'products',
    prompt: 'Professional product photo of premium black sports training jacket with gold zipper and subtle gold logo, athletic wear, on dark background, e-commerce style, centered'
  },
  {
    filename: 'windbreaker.png',
    folder: 'products',
    prompt: 'Professional product photo of lightweight black windbreaker jacket with gold accents, sports style, on dark background, e-commerce style, centered'
  },
  {
    filename: 'hoodie.png',
    folder: 'products',
    prompt: 'Professional product photo of premium black hoodie with small gold logo on chest, athletic streetwear, on dark background, e-commerce style, centered'
  },

  // PRODUCTS - T-Shirts
  {
    filename: 'pele-tee.png',
    folder: 'products',
    prompt: 'Professional product photo of black t-shirt with artistic gold number 10 design tribute to Pele Brazil, on dark background, e-commerce style, centered'
  },
  {
    filename: 'maradona-tee.png',
    folder: 'products',
    prompt: 'Professional product photo of navy blue t-shirt with artistic tribute design to Maradona number 10 Argentina, on dark background, e-commerce style, centered'
  },
  {
    filename: 'messi-tee.png',
    folder: 'products',
    prompt: 'Professional product photo of white t-shirt with artistic GOAT design tribute to Messi Argentina, on dark background, e-commerce style, centered'
  },
  {
    filename: 'logo-tee.png',
    folder: 'products',
    prompt: 'Professional product photo of simple black t-shirt with small gold WLC logo on chest, minimal design, on dark background, e-commerce style, centered'
  },

  // PRODUCTS - Shorts & Accessories
  {
    filename: 'training-shorts.png',
    folder: 'products',
    prompt: 'Professional product photo of black athletic training shorts with gold side stripe, sports wear, on dark background, e-commerce style, centered'
  },
  {
    filename: 'shorts.png',
    folder: 'products',
    prompt: 'Professional product photo of navy blue athletic shorts, sports wear, on dark background, e-commerce style, centered'
  },
  {
    filename: 'cap.png',
    folder: 'products',
    prompt: 'Professional product photo of black snapback cap with gold embroidered logo, on dark background, e-commerce style, front view, centered'
  },
  {
    filename: 'scarf.png',
    folder: 'products',
    prompt: 'Professional product photo of black and gold knitted football scarf, on dark background, e-commerce style, centered'
  },
  {
    filename: 'match-ball.png',
    folder: 'products',
    prompt: 'Professional product photo of premium football soccer ball with black and gold design, official match ball style, on dark background, e-commerce style, centered'
  },
  {
    filename: 'armband.png',
    folder: 'products',
    prompt: 'Professional product photo of black captain armband with gold C embroidery, football captain armband, on dark background, e-commerce style, centered'
  },
  {
    filename: 'trophy-replica.png',
    folder: 'products',
    prompt: 'Professional product photo of golden trophy replica, World Cup style trophy miniature, elegant gold finish, on dark background, e-commerce style, centered'
  },
  {
    filename: 'photo-book.png',
    folder: 'products',
    prompt: 'Professional product photo of hardcover coffee table book about football legends, black cover with gold text, on dark background, e-commerce style, centered'
  },
  {
    filename: 'football.png',
    folder: 'products',
    prompt: 'Professional product photo of training football soccer ball, black and white classic design, on dark background, e-commerce style, centered'
  },
  {
    filename: 'backpack.png',
    folder: 'products',
    prompt: 'Professional product photo of black sports backpack with gold accents and logo, athletic style, on dark background, e-commerce style, centered'
  },

  // LEGENDS - F1-Style Player Portraits (upper body, professional sports photography)
  {
    filename: 'pele.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Brazilian football legend, upper body shot from chest up, wearing yellow Brazil national team jersey, confident expression looking slightly to the side, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'maradona.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Argentine football legend with curly dark hair, upper body shot from chest up, wearing Argentina blue and white striped jersey, intense passionate expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'messi.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, modern Argentine football star with short beard, upper body shot from chest up, wearing Argentina light blue and white jersey, calm focused expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'ronaldo.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Portuguese football superstar with athletic build and short dark hair, upper body shot from chest up, wearing Portugal red jersey, confident determined expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'r9.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Brazilian striker legend from early 2000s, upper body shot from chest up, wearing Brazil yellow jersey number 9, confident smile, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'zidane.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, French football maestro with bald head, upper body shot from chest up, wearing France blue jersey, calm elegant expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'beckenbauer.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, German football legend defender with classic 1970s hairstyle, upper body shot from chest up, wearing Germany white jersey, composed authoritative expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'cruyff.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Dutch football total football pioneer with 1970s long hair, upper body shot from chest up, wearing Netherlands orange jersey, intelligent thoughtful expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'platini.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, French football playmaker from 1980s with wavy hair, upper body shot from chest up, wearing France blue jersey, sophisticated elegant expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'baggio.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Italian football artist with iconic ponytail hairstyle, upper body shot from chest up, wearing Italy azzurri blue jersey, artistic soulful expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'maldini.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Italian football defender legend with classic good looks, upper body shot from chest up, wearing Italy blue jersey, strong dignified expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'muller.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, German striker legend from 1970s, upper body shot from chest up, wearing Germany white jersey, sharp focused expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'cr7.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Portuguese football superstar with chiseled features and styled hair, upper body shot from chest up, wearing red jersey number 7, confident powerful expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'ronaldinho.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, Brazilian football magician with long curly hair and iconic big smile, upper body shot from chest up, wearing Brazil yellow jersey, joyful charismatic expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },
  {
    filename: 'henry.png',
    folder: 'legends',
    prompt: 'Professional sports portrait photo, French striker legend with athletic build, upper body shot from chest up, wearing France blue jersey, cool composed expression, clean dark gradient studio background, dramatic rim lighting, high-end sports photography style like F1 driver portraits, 4k quality'
  },

  // BANNERS
  {
    filename: 'hero-home.png',
    folder: 'banners',
    prompt: 'Epic cinematic wide shot of football stadium at night with golden lights, dramatic atmosphere, dark sky with gold lighting effects, panoramic view'
  },
  {
    filename: 'hero-shop.png',
    folder: 'banners',
    prompt: 'Premium sports merchandise display with football jerseys and accessories, dark luxurious background with gold accent lighting, e-commerce banner style, wide format'
  },
  {
    filename: 'hero-legends.png',
    folder: 'banners',
    prompt: 'Epic cinematic scene of legendary footballers silhouettes on stadium field, dramatic golden hour lighting, heroic atmosphere, wide banner format'
  },
  {
    filename: 'hero-teams.png',
    folder: 'banners',
    prompt: 'National football team flags waving in stadium, international tournament atmosphere, dramatic lighting, dark background with gold accents, wide banner'
  },
  {
    filename: 'hero-schedule.png',
    folder: 'banners',
    prompt: 'Football stadium aerial view at night with bright lights, tournament match day atmosphere, dramatic wide shot, dark with golden lighting'
  },
  {
    filename: 'hero-tickets.png',
    folder: 'banners',
    prompt: 'Premium golden VIP tickets and stadium seats, luxury football experience, dark background with gold accents, wide banner format'
  },
  {
    filename: 'promo-banner.png',
    folder: 'banners',
    prompt: 'Premium football merchandise promotional banner, black and gold color scheme, luxury sports brand style, wide format'
  },
  {
    filename: 'newsletter-bg.png',
    folder: 'banners',
    prompt: 'Abstract dark background with subtle golden particles and football pattern, elegant newsletter background, dark with gold accents'
  },

  // TEAM BADGES
  {
    filename: 'brazil.png',
    folder: 'teams',
    prompt: 'Brazil national football team badge logo, yellow and green colors, clean design, transparent style background'
  },
  {
    filename: 'argentina.png',
    folder: 'teams',
    prompt: 'Argentina national football team badge logo, sky blue and white colors, clean design, transparent style background'
  },
  {
    filename: 'germany.png',
    folder: 'teams',
    prompt: 'Germany national football team badge logo with eagle, black white and gold colors, clean design, transparent style background'
  },
  {
    filename: 'france.png',
    folder: 'teams',
    prompt: 'France national football team badge logo with rooster, blue white and red colors, clean design, transparent style background'
  },
  {
    filename: 'italy.png',
    folder: 'teams',
    prompt: 'Italy national football team badge logo, azzurri blue color, clean design, transparent style background'
  },
  {
    filename: 'netherlands.png',
    folder: 'teams',
    prompt: 'Netherlands national football team badge logo with lion, orange color, clean design, transparent style background'
  },
  {
    filename: 'spain.png',
    folder: 'teams',
    prompt: 'Spain national football team badge logo, red and yellow colors, clean design, transparent style background'
  },
  {
    filename: 'england.png',
    folder: 'teams',
    prompt: 'England national football team badge logo with three lions, blue and white colors, clean design, transparent style background'
  },
  {
    filename: 'portugal.png',
    folder: 'teams',
    prompt: 'Portugal national football team badge logo, red and green colors, clean design, transparent style background'
  },

  // NEWS ARTICLE IMAGES
  {
    filename: 'goals.jpg',
    folder: 'news',
    prompt: 'Epic football moment, striker celebrating goal with arms raised, stadium crowd cheering, dramatic golden hour lighting, cinematic sports photography, black and gold color grading'
  },
  {
    filename: 'exhibition.jpg',
    folder: 'news',
    prompt: 'Brazil vs Argentina football rivalry, two teams facing each other on pitch, stadium atmosphere, dramatic lighting, blue and yellow vs white and sky blue jerseys, epic sports photography'
  },
  {
    filename: 'zidane-interview.jpg',
    folder: 'news',
    prompt: 'Professional sports interview setting, elegant man in suit, dark studio background with dramatic lighting, gold accent lighting, cinematic portrait style'
  },
  {
    filename: 'tournament.jpg',
    folder: 'news',
    prompt: 'World Cup trophy on podium with stadium background, golden trophy gleaming, confetti falling, dramatic celebration atmosphere, cinematic sports photography'
  },
  {
    filename: 'number10.jpg',
    folder: 'news',
    prompt: 'Football jersey with number 10, artistic shot of classic playmaker jersey, dramatic lighting, black background with gold accents, premium sports photography'
  },
  {
    filename: 'training.jpg',
    folder: 'news',
    prompt: 'Professional football training session, players practicing on green pitch, morning light, premium sports facility, dynamic action shot, cinematic sports photography'
  },

  // VENUE IMAGES
  {
    filename: 'metlife.jpg',
    folder: 'venues',
    prompt: 'MetLife Stadium aerial view at night, NFL stadium with lights on, New Jersey, dramatic night sky, wide angle sports venue photography'
  },
  {
    filename: 'sofi.jpg',
    folder: 'venues',
    prompt: 'SoFi Stadium Los Angeles exterior at sunset, modern architecture with curved roof, dramatic sky, premium sports venue photography'
  },
  {
    filename: 'rosebowl.jpg',
    folder: 'venues',
    prompt: 'Rose Bowl Stadium Pasadena aerial view, historic football stadium surrounded by mountains, golden hour lighting, iconic sports venue'
  },
  {
    filename: 'azteca.jpg',
    folder: 'venues',
    prompt: 'Estadio Azteca Mexico City, legendary football stadium packed with fans, dramatic atmosphere, iconic Mexican venue, sports photography'
  },
  {
    filename: 'att.jpg',
    folder: 'venues',
    prompt: 'AT&T Stadium Arlington Texas interior, massive video screen, retractable roof open, modern NFL stadium, dramatic sports venue photography'
  },
  {
    filename: 'hardrock.jpg',
    folder: 'venues',
    prompt: 'Hard Rock Stadium Miami aerial view, NFL stadium with unique canopy design, Florida sunset, premium sports venue photography'
  },
  {
    filename: 'lumen.jpg',
    folder: 'venues',
    prompt: 'Lumen Field Seattle at night, NFL stadium with city skyline, dramatic lighting, Pacific Northwest atmosphere, sports venue photography'
  },
  {
    filename: 'bmo.jpg',
    folder: 'venues',
    prompt: 'BMO Field Toronto soccer stadium, Canadian venue with Toronto skyline, sunset lighting, MLS stadium, sports venue photography'
  },
];

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

async function generateImage(spec: ImageSpec): Promise<boolean> {
  const outputPath = path.join('public', spec.folder, spec.filename);

  // Skip if file already exists
  if (existsSync(outputPath)) {
    console.log(`Skipping ${outputPath} - already exists`);
    return true;
  }

  console.log(`\nGenerating: ${spec.folder}/${spec.filename}`);
  console.log(`Prompt: ${spec.prompt.substring(0, 60)}...`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: spec.prompt }]
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT']
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`API error: ${response.status} - ${error}`);
      return false;
    }

    const data = await response.json();

    // Find the image part in the response
    const parts = data.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          await writeFile(outputPath, buffer);
          console.log(`Saved: ${outputPath} (${Math.round(buffer.length / 1024)}KB)`);
          return true;
        }
      }
    }

    console.log(`No image in response for ${spec.filename}`);
    return false;
  } catch (error) {
    console.error(`Error generating ${spec.filename}:`, error);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('World Legends Cup 2026 - Image Generator');
  console.log('='.repeat(60));
  console.log(`Total images to generate: ${images.length}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);

  // Create directories
  await ensureDir('public/products');
  await ensureDir('public/legends');
  await ensureDir('public/teams');
  await ensureDir('public/banners');
  await ensureDir('public/news');
  await ensureDir('public/venues');

  let success = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    console.log(`\n[${i + 1}/${images.length}]`);
    const result = await generateImage(images[i]);
    if (result) {
      success++;
    } else {
      failed++;
    }

    // Rate limiting - wait 3 seconds between requests
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Complete! Success: ${success}, Failed: ${failed}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
