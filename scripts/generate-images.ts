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

  // LEGENDS - Player Portraits
  {
    filename: 'pele.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of legendary Brazilian football player, dramatic lighting, heroic pose, wearing yellow Brazil jersey number 10, dark background, iconic'
  },
  {
    filename: 'maradona.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of legendary Argentine football player with curly hair, dramatic lighting, passionate expression, wearing Argentina blue and white jersey number 10, dark background'
  },
  {
    filename: 'messi.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of modern Argentine football legend with beard, dramatic lighting, wearing Argentina jersey number 10, celebrating pose, dark background'
  },
  {
    filename: 'ronaldo.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of Portuguese football superstar, athletic build, dramatic lighting, powerful pose, wearing Portugal red jersey number 7, dark background'
  },
  {
    filename: 'r9.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of Brazilian striker legend from 2002, dramatic lighting, wearing Brazil yellow jersey number 9, iconic look, dark background'
  },
  {
    filename: 'zidane.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of French football maestro, bald head, dramatic lighting, elegant pose, wearing France blue jersey number 10, dark background'
  },
  {
    filename: 'beckenbauer.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of German football legend defender, classic 1970s look, dramatic lighting, wearing Germany white jersey number 5, dark background'
  },
  {
    filename: 'cruyff.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of Dutch football legend, classic 1970s style with long hair, dramatic lighting, wearing Netherlands orange jersey number 14, dark background'
  },
  {
    filename: 'platini.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of French football playmaker, 1980s style, dramatic lighting, wearing France blue jersey number 10, dark background'
  },
  {
    filename: 'baggio.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of Italian football artist, iconic ponytail hairstyle, dramatic lighting, wearing Italy blue jersey number 10, dark background'
  },
  {
    filename: 'maldini.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of Italian football defender legend, dramatic lighting, wearing Italy blue jersey number 3, dark background'
  },
  {
    filename: 'muller.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of German striker legend, 1970s style, dramatic lighting, wearing Germany white jersey number 13, dark background'
  },
  {
    filename: 'cr7.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of football superstar celebrating goal, dramatic lighting, wearing red jersey number 7, iconic celebration pose, dark background'
  },
  {
    filename: 'ronaldinho.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of Brazilian football magician, big smile showing teeth, long curly hair, dramatic lighting, wearing Brazil yellow jersey number 10, dark background'
  },
  {
    filename: 'henry.png',
    folder: 'legends',
    prompt: 'Artistic digital portrait of French striker legend, dramatic lighting, wearing France blue jersey number 12, dark background'
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
