import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../src/data/churches.csv');
const OUTPUT_PATH = path.join(__dirname, '../src/data/locations.json');

// Delay to respect API rate limits (1 second per request for Nominatim)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocodeAddress(address) {
  try {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CareportalMapApp/1.0' // Required by Nominatim
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error(`Error geocoding ${address}:`, error);
    return null;
  }
}

async function processData() {
  console.log('Reading CSV...');
  const csvFile = fs.readFileSync(CSV_PATH, 'utf8');
  
  const results = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true
  });

  const locations = [];
  
  console.log(`Found ${results.data.length} records. Starting geocoding...`);

  for (const [index, row] of results.data.entries()) {
    const address = `${row['Street Address']}, ${row['City']}, ${row['ZIP']}`;
    const name = row['Church Name'];
    const careportal = row['Careportal'] ? true : false; // Assume non-empty means Yes

    console.log(`[${index + 1}/${results.data.length}] Processing: ${name}`);

    // Check if we already have coordinates (mock check, in real app we might cache)
    // For now, we always fetch.
    
    const coords = await geocodeAddress(address);
    
    if (coords) {
      locations.push({
        id: index.toString(),
        name,
        type: 'Church', // Default for now
        address,
        lat: coords.lat,
        lng: coords.lng,
        careportal,
        radius: 5, // Default radius
        website: row['Website'],
        phone: row['Phone']
      });
      console.log(`  -> Found: ${coords.lat}, ${coords.lng}`);
    } else {
      console.log(`  -> Not found`);
    }

    // Respect rate limit
    await delay(1100);
  }

  console.log(`Writing ${locations.length} locations to ${OUTPUT_PATH}`);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(locations, null, 2));
  console.log('Done!');
}

processData();
