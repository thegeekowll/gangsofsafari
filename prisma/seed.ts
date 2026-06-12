import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.contact.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.blog.deleteMany()
  await prisma.itineraryDay.deleteMany()
  await prisma.tourDestination.deleteMany()
  await prisma.tour.deleteMany()
  await prisma.accommodation.deleteMany()
  await prisma.destination.deleteMany()

  // ─── Destinations ───────────────────────────────────────────────────────────

  const ranthambore = await prisma.destination.create({
    data: {
      name: 'Ranthambore',
      slug: 'ranthambore',
      description:
        'Ranthambore National Park in Rajasthan is one of the best places in India to spot wild tigers. The landscape of dramatic ravines, dry deciduous forest, and ancient ruins of Ranthambore Fort makes this a spectacular drive in your Tata Safari.',
      image:
        'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=80',
      state: 'Rajasthan',
      highlights: JSON.stringify([
        'Tiger spotting in the wild',
        'Ranthambore Fort (UNESCO heritage)',
        'Scenic drives through Aravalli hills',
        'Crocodile watching at Raj Bagh Lake',
        'Village culture and folk music',
      ]),
    },
  })

  const corbett = await prisma.destination.create({
    data: {
      name: 'Jim Corbett',
      slug: 'jim-corbett',
      description:
        "Jim Corbett National Park is India's oldest and most prestigious wildlife reserve, nestled in the foothills of the Himalayas in Uttarakhand. The drive through Kumaon hills with your Tata Safari is an experience in itself — winding mountain roads, dense sal forests, and the roaring Ramganga river.",
      image:
        'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1200&q=80',
      state: 'Uttarakhand',
      highlights: JSON.stringify([
        'Bengal tiger and elephant sightings',
        'Dhikala Zone jeep safari',
        'Ramganga river fishing',
        'Himalayan foothills drive',
        'Bird watching — over 600 species',
      ]),
    },
  })

  // ─── Accommodations ──────────────────────────────────────────────────────────

  const ranthamboreResort = await prisma.accommodation.create({
    data: {
      name: 'Tiger Haven Resort',
      type: 'Resort',
      description:
        'A luxury eco-resort on the edge of Ranthambore National Park, with wildlife-themed cottages and a stunning pool overlooking the jungle.',
      image:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      destinationId: ranthambore.id,
    },
  })

  const ranthamboreGuesthouse = await prisma.accommodation.create({
    data: {
      name: 'Jungle Camp Ranthambore',
      type: 'Camp',
      description:
        'Authentic glamping experience with luxury tents, bonfire dinners, and guided nature walks just outside the park buffer zone.',
      image:
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
      destinationId: ranthambore.id,
    },
  })

  const corbettResort = await prisma.accommodation.create({
    data: {
      name: 'Himalayan Hideaway',
      type: 'Resort',
      description:
        'A boutique mountain resort overlooking the Ramganga river, with stunning Himalayan views, outdoor fire pits, and naturalist-guided activities.',
      image:
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      destinationId: corbett.id,
    },
  })

  const corbettCamp = await prisma.accommodation.create({
    data: {
      name: 'Corbett Wilderness Camp',
      type: 'Camp',
      description:
        'Deep inside the buffer zone, this camp offers the most immersive jungle experience with luxury safari tents, chef-prepared meals, and night safaris.',
      image:
        'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=800&q=80',
      destinationId: corbett.id,
    },
  })

  // ─── Tours ────────────────────────────────────────────────────────────────────

  const ranthambhoreTour = await prisma.tour.create({
    data: {
      title: 'Ranthambore Wildlife Safari',
      slug: 'ranthambore-wildlife-safari',
      description:
        'The ultimate Tata Safari road trip to Ranthambore — convoy through Rajasthan, spot wild tigers, explore a UNESCO fortress, and camp under the stars. This 5-day adventure is designed exclusively for Tata Safari owners who want the full jungle experience.',
      coverImage:
        'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1400&q=80',
      duration: 5,
      price: 25000,
      difficulty: 'Moderate',
      maxGroupSize: 20,
      featured: true,
      published: true,
      highlights: JSON.stringify([
        'Convoy drive from Delhi to Ranthambore',
        'Two full-day jeep safaris inside the core zone',
        'Visit to the 10th-century Ranthambore Fort',
        'Bonfire night with folk music and Rajasthani cuisine',
        'Professional wildlife photographer accompanies the group',
        'Exclusive gang photography session with all Safaris lined up',
      ]),
      included: JSON.stringify([
        'Fuel cost sharing calculator provided',
        '4 nights accommodation (resort/camp mix)',
        'All park entry and jeep safari fees',
        'All meals from dinner Day 1 to lunch Day 5',
        'Professional naturalist guide throughout',
        'Group merchandise — bandana and stickers',
        'Emergency breakdown support on route',
      ]),
      excluded: JSON.stringify([
        'Personal fuel costs (your own vehicle)',
        'Alcoholic beverages',
        'Tips and gratuities',
        'Travel insurance',
        'Any medical expenses',
        'Personal purchases and souvenirs',
      ]),
    },
  })

  // Itinerary for Ranthambore tour
  await prisma.itineraryDay.createMany({
    data: [
      {
        day: 1,
        title: 'Convoy Assembly & Drive to Sawai Madhopur',
        description:
          'Meet the gang at our designated assembly point in Delhi at 6 AM. After a briefing, vehicle inspection, and the ritual Safari gang photo, we hit the road in convoy formation. The ~320 km drive takes you through Agra bypass and into the heart of Rajasthan. Check in to Tiger Haven Resort by evening.',
        activities: JSON.stringify([
          'Group convoy assembly in Delhi',
          'Vehicle safety check and briefing',
          'Drive through Agra bypass',
          'Arrival and check-in',
          'Welcome dinner with introductions',
        ]),
        accommodationId: ranthamboreResort.id,
        tourId: ranthambhoreTour.id,
      },
      {
        day: 2,
        title: 'Core Zone Safari — Zone 3 & 4',
        description:
          'Early morning (5:30 AM) jeep safari in Zones 3 and 4, famous for tiger sightings at Raj Bagh Lake and Padam Lake. Return for brunch, rest through afternoon heat, then evening safari in Zone 1 near the fort. Night bonfire with naturalist talk on tiger conservation.',
        activities: JSON.stringify([
          'Early morning jeep safari — Zones 3 & 4',
          'Tiger tracking with naturalist',
          'Crocodile and deer watching at Raj Bagh Lake',
          'Afternoon rest/photography session at resort',
          'Evening safari — Zone 1',
          'Bonfire dinner and wildlife talk',
        ]),
        accommodationId: ranthamboreResort.id,
        tourId: ranthambhoreTour.id,
      },
      {
        day: 3,
        title: 'Ranthambore Fort & Village Exploration',
        description:
          "Morning visit to the magnificent Ranthambore Fort, a UNESCO World Heritage Site that dates to the 10th century. Drive your Safari up the approach road for unmatched views. Afternoon village safari — drive through rural Rajasthan, interact with locals, and experience the true culture of the region. Evening's folk music performance.",
        activities: JSON.stringify([
          'Drive to Ranthambore Fort (10th-century UNESCO site)',
          'Exploration of fort ruins and wildlife within',
          'Panoramic photography session',
          'Rural village drive and cultural interaction',
          'Rajasthani folk music and dance performance',
          'Traditional dal-baati-churma dinner',
        ]),
        accommodationId: ranthamboreGuesthouse.id,
        tourId: ranthambhoreTour.id,
      },
      {
        day: 4,
        title: 'Sunrise Safari & Gang Photo Shoot',
        description:
          'The most anticipated day — a sunrise safari at the prime photography zone, followed by the signature Gangs of Safari photo shoot with all vehicles lined up at a scenic location near the park boundary. Afternoon free for personal exploration, shopping in Sawai Madhopur market.',
        activities: JSON.stringify([
          'Sunrise jeep safari — photography zone',
          'Gangs of Safari convoy photo shoot',
          'Free afternoon — market visit and shopping',
          'Rajasthani handicraft shopping',
          'Farewell gala dinner under stars',
          'Campfire stories and trip highlights reel',
        ]),
        accommodationId: ranthamboreGuesthouse.id,
        tourId: ranthambhoreTour.id,
      },
      {
        day: 5,
        title: 'Return Convoy to Delhi',
        description:
          'After a hearty breakfast, begin the return convoy to Delhi. A well-organized departure with fuel stops at designated points. Arrive Delhi by early evening. Group debrief and certificate distribution. Until the next adventure!',
        activities: JSON.stringify([
          'Group breakfast and final check-out',
          'Return convoy formation',
          'Fuel and chai stops en route',
          'Arrival in Delhi',
          'Certificate and souvenir distribution',
          'Next trip announcement',
        ]),
        tourId: ranthambhoreTour.id,
      },
    ],
  })

  // Link Ranthambore tour to destination
  await prisma.tourDestination.create({
    data: {
      tourId: ranthambhoreTour.id,
      destinationId: ranthambore.id,
    },
  })

  // ─── Jim Corbett Tour ─────────────────────────────────────────────────────────

  const corbettTour = await prisma.tour.create({
    data: {
      title: 'Jim Corbett Adventure',
      slug: 'jim-corbett-adventure',
      description:
        "Four days of pure Himalayan wilderness — convoy through the scenic Kumaon foothills, explore India's oldest national park, watch elephants bathe in the Ramganga, and push your Tata Safari on mountain roads that were made for it. An unforgettable gang adventure.",
      coverImage:
        'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1400&q=80',
      duration: 4,
      price: 20000,
      difficulty: 'Easy',
      maxGroupSize: 15,
      featured: true,
      published: true,
      highlights: JSON.stringify([
        'Convoy drive through Kumaon hills',
        'Dhikala zone safari — best zone in Corbett',
        'Elephant and tiger sightings',
        'Ramganga river experience',
        'Mountain road driving on Kalagarh route',
        'Exclusive gang photo at Corbett viewpoint',
      ]),
      included: JSON.stringify([
        '3 nights accommodation (resort/camp)',
        'All park entry and safari permits',
        'All meals from dinner Day 1 to lunch Day 4',
        'Expert naturalist guide',
        'Group photography sessions',
        'Emergency vehicle support',
        'Group merchandise',
      ]),
      excluded: JSON.stringify([
        'Personal fuel costs',
        'Alcoholic beverages',
        'Personal expenses',
        'Tips and gratuities',
        'Travel insurance',
        'Medical expenses',
      ]),
    },
  })

  // Itinerary for Corbett tour
  await prisma.itineraryDay.createMany({
    data: [
      {
        day: 1,
        title: 'Delhi to Ramnagar — Kumaon Foothills Drive',
        description:
          "Assemble at the designated meetup point in Delhi/NCR at 5:30 AM. The ~260 km convoy drive takes you through Moradabad, Rampur, and into the stunning Kumaon foothills. The final stretch on NH109 is where your Tata Safari truly comes alive — mountain curves, river crossings, dense forests. Check-in at Himalayan Hideaway.",
        activities: JSON.stringify([
          'Convoy assembly and briefing',
          'Drive through Moradabad and Rampur',
          'Mountain foothills approach drive',
          'Kosi river crossing',
          'Check-in and resort orientation',
          'Welcome barbecue dinner',
        ]),
        accommodationId: corbettResort.id,
        tourId: corbettTour.id,
      },
      {
        day: 2,
        title: 'Dhikala Zone — Full Day Safari',
        description:
          "The crown jewel of Jim Corbett — Dhikala zone is only accessible with day permits and is the most prolific zone for wildlife. We enter at first light and spend the full day inside. Packed breakfast and lunch are arranged. The grasslands (chaurs) of Dhikala are where you're most likely to spot tigers, elephants, and leopards.",
        activities: JSON.stringify([
          'Early morning departure for Dhikala gate',
          'Full-day safari in Dhikala zone',
          'Tiger and elephant tracking',
          'Ramganga reservoir viewpoint',
          'Packed meals inside the park',
          'Evening naturalist debrief',
          'Bonfire and star gazing',
        ]),
        accommodationId: corbettResort.id,
        tourId: corbettTour.id,
      },
      {
        day: 3,
        title: 'Bijrani Zone Safari & Kalagarh Drive',
        description:
          'Morning safari in Bijrani zone, known for its dense forests and high leopard density. Post-safari, drive your Safari through the iconic Kalagarh forest road — a narrow mountain track where you may encounter elephants crossing. Afternoon at leisure near the resort for swimming, relaxing, or a nature walk.',
        activities: JSON.stringify([
          'Bijrani zone morning safari',
          'Leopard and sloth bear tracking',
          'Kalagarh forest road drive',
          'Wild elephant encounter chances',
          'Afternoon leisure at resort',
          'Gang photo shoot at viewpoint',
          'Farewell bonfire dinner',
        ]),
        accommodationId: corbettCamp.id,
        tourId: corbettTour.id,
      },
      {
        day: 4,
        title: 'Dawn Nature Walk & Return Convoy',
        description:
          "Start the final day with a guided dawn nature walk along the Ramganga river banks — a beautiful way to absorb the forest one last time. After a full breakfast, form the return convoy and head back to Delhi, arriving by evening. Trip certificates, memories shared, and next adventure announced!",
        activities: JSON.stringify([
          'Dawn riverside nature walk',
          'Bird watching along Ramganga',
          'Group breakfast and check-out',
          'Return convoy formation',
          'Lunch stop en route',
          'Arrival in Delhi and certificate distribution',
        ]),
        tourId: corbettTour.id,
      },
    ],
  })

  // Link Corbett tour to destination
  await prisma.tourDestination.create({
    data: {
      tourId: corbettTour.id,
      destinationId: corbett.id,
    },
  })

  // ─── Blog Posts ───────────────────────────────────────────────────────────────

  await prisma.blog.createMany({
    data: [
      {
        title: 'Why the Tata Safari is the Perfect Road Trip Machine',
        slug: 'why-tata-safari-perfect-road-trip-machine',
        excerpt:
          'From the Himalayan passes to the desert highways of Rajasthan, we break down why the Tata Safari has become the go-to adventure vehicle for India\'s most passionate road trippers.',
        content: `# Why the Tata Safari is the Perfect Road Trip Machine

When we founded Gangs of Safari, we were asked one question more than any other: "Why specifically the Tata Safari?"

After tens of thousands of kilometres across India's most demanding terrain, the answer has become crystal clear.

## Power When You Need It Most

The 2.0-litre Kryotec turbocharged diesel engine produces 170 PS and a massive 350 Nm of torque. But raw numbers don't tell the whole story. It's how that torque is delivered — available from just 1,750 rpm — that makes the Safari so incredibly capable on mountain roads and off-road trails.

We've driven the Safari through the high-altitude passes of Ladakh, the muddy jungle tracks of Corbett, and the sandy desert roads of Rajasthan. Not once did the engine feel stressed.

## Ground Clearance That Actually Matters

At 200mm of ground clearance, the Safari can tackle terrain that would leave most urban SUVs stranded. The approach and departure angles are generous enough to handle steep forest tracks without constant second-guessing.

## Built for Indian Roads

This might sound obvious, but it matters enormously — the Safari's suspension is tuned for Indian conditions. The Frequency-Responsive Damping (FRD) system handles everything from smooth highways to broken village roads with remarkable composure. Your back will thank you after 400 km.

## The Space to Carry Everything

Road trips require gear. Camping equipment, cooking supplies, photography gear, spare parts, recovery equipment. The Safari's 447-litre boot (expandable to 1,604 litres with rear seats folded) means you never have to choose what to leave behind.

## The Community It Creates

Perhaps the biggest surprise has been how the Safari has created a genuine community. There's something about this vehicle that attracts a certain kind of person — adventurous, outdoorsy, passionate about India's wild places. Gangs of Safari exists because of this shared identity.

When you join one of our convoys, you're not just going on a road trip. You're joining a tribe.

## Conclusion

The Tata Safari isn't just a vehicle. For us, it's a statement of intent. It says you care about where you're going as much as how you get there. And that's exactly the spirit that drives every Gangs of Safari adventure.

Ready to put your Safari through its paces? [Explore our upcoming tours](/tours) and join the gang.`,
        coverImage:
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80',
        author: 'Rohit Sharma',
        tags: JSON.stringify(['Tata Safari', 'Road Trip', 'SUV', 'Review']),
        featured: true,
        published: true,
        publishedAt: new Date('2024-03-15'),
      },
      {
        title: '10 Must-Do Road Trips for Tata Safari Owners in 2024',
        slug: '10-must-do-road-trips-tata-safari-owners-2024',
        excerpt:
          'From the frozen passes of Ladakh to the jungle highways of central India, we\'ve curated the ten most epic road trips that will make your Tata Safari — and you — truly legendary.',
        content: `# 10 Must-Do Road Trips for Tata Safari Owners in 2024

Your Tata Safari was built for more than just weekend errands. Here are the ten road trips that will truly unlock what this machine can do.

## 1. Leh-Ladakh via Manali Highway

The crown jewel of Indian road trips. The Manali-Leh highway crosses five high-altitude passes including the legendary Tanglang La (5,328m). The Safari's diesel engine and high ground clearance make it more capable here than most purpose-built overlanders.

**Best time:** June–September | **Distance:** ~500 km | **Duration:** 3–5 days

## 2. Ranthambore Wildlife Circuit

Follow the route our Gangs of Safari convoy takes — Delhi to Sawai Madhopur through the Aravalli hills. The final approach through the forest buffer zone is jaw-dropping, especially at dawn when wildlife is most active.

**Best time:** October–March | **Distance:** ~320 km | **Duration:** 2–5 days

## 3. Jim Corbett & Nainital Loop

Drive from Delhi through Moradabad to Ramnagar, do the Corbett safaris, then loop up to the Kumaon lakes — Nainital, Bhimtal, Sattal. The mountain roads above Nainital are among the most scenic in all of India.

**Best time:** November–June | **Distance:** ~600 km | **Duration:** 4–6 days

## 4. Spiti Valley Circuit

The road less travelled — and for good reason. Spiti Valley's roads are rough, the altitude is extreme, and the terrain is unforgiving. But the landscapes are unlike anything else on earth. Pin Valley, Key Monastery, Chandratal Lake.

**Best time:** July–September | **Distance:** ~1,200 km loop | **Duration:** 7–10 days

## 5. Sundarbans & Eastern Delta

Drive from Kolkata into the Sundarbans delta — the world's largest mangrove forest. The Safari handles the causeway roads and ferry loading with ease. Combine with a boat safari for Royal Bengal tiger sightings.

**Best time:** November–February | **Distance:** ~200 km from Kolkata | **Duration:** 2–3 days

## 6. Coorg Coffee Country Circuit

Karnataka's Coorg district is a misty, coffee-scented paradise accessible via spectacular ghat roads from Mysore or Mangalore. The elevation changes are dramatic and the roads reward a capable SUV.

**Best time:** October–March | **Distance:** ~265 km from Bangalore | **Duration:** 3–4 days

## 7. Pench & Kanha Loop

The central Indian jungle circuit — Nagpur to Pench, then Kanha Tiger Reserve. The roads through Madhya Pradesh's forest districts are your reward for venturing off the tourist trail.

**Best time:** October–June | **Distance:** ~350 km loop | **Duration:** 5–6 days

## 8. Kaziranga & Majuli Island, Assam

Drive from Guwahati through the tea gardens of upper Assam to Kaziranga — home to the one-horned rhinoceros. Then cross the Brahmaputra by ferry to Majuli, the world's largest river island.

**Best time:** November–April | **Distance:** ~400 km from Guwahati | **Duration:** 4–5 days

## 9. Satpura Tiger Reserve & Pachmarhi

Madhya Pradesh's Pachmarhi hill station combined with the remote Satpura Tiger Reserve. The forest roads require genuine 4WD capability — your Safari will handle it brilliantly.

**Best time:** October–March | **Distance:** ~290 km from Bhopal | **Duration:** 3–4 days

## 10. Rann of Kutch

Drive from Ahmedabad into the surreal white salt desert of the Rann. The GST Road into the Rann and the tracks through the Wild Ass Sanctuary are best explored in a capable SUV. Combine with Dholavira's archaeological site.

**Best time:** October–February | **Distance:** ~450 km from Ahmedabad | **Duration:** 3–4 days

---

Want to tackle any of these with the gang? [Join an upcoming tour](/tours) or [get in touch](/contact) to suggest a new route.`,
        coverImage:
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
        author: 'Priya Menon',
        tags: JSON.stringify(['Road Trip', 'Itinerary', 'India', 'Wildlife', 'Mountains']),
        featured: true,
        published: true,
        publishedAt: new Date('2024-04-02'),
      },
      {
        title: 'Convoy Driving 101: How to Drive in a Group Safely',
        slug: 'convoy-driving-101-group-driving-safety',
        excerpt:
          'Convoy driving is an art. Whether you\'re leading 5 vehicles or following in the middle of a 20-car gang, these rules will keep everyone safe, together, and having the time of their life.',
        content: `# Convoy Driving 101: How to Drive in a Group Safely

One of the most common questions we get from first-time members is: "I've never driven in a convoy before — is it complicated?"

The honest answer: it requires discipline, communication, and trust. Here's everything you need to know.

## The Golden Rules of Convoy Driving

### 1. Know Your Position

Every vehicle in a convoy has a number. You know who's ahead of you and behind you at all times. If you lose sight of the vehicle ahead, you slow down or stop — never try to catch up at speed.

### 2. Maintain Consistent Spacing

In our convoys, we follow the 3-second rule on highways — maintain at least 3 seconds of following distance from the vehicle ahead. On mountain roads or rough terrain, this increases to 5-8 seconds to allow reaction time.

### 3. The Radio Protocol

Every Gangs of Safari convoy uses Walkie-Talkies (or a WhatsApp call when signal permits). Our protocol is simple:

- **"Eyes on"** — I can see the vehicle ahead of me
- **"Eyes off"** — I've lost sight of the vehicle ahead (stop immediately if you hear this from behind)
- **"Pull over"** — someone needs a stop
- **"Breakdown"** — vehicle needs assistance

### 4. Speed Is Set by the Slowest Vehicle

This cannot be overemphasised. A convoy moves at the pace of its slowest member. There are no exceptions. If you're uncomfortable with a section of road, say so on the radio — the entire convoy waits.

### 5. Never Overtake Within the Convoy

Overtaking another convoy member (other than for a breakdown) disrupts the sequence and can cause confusion. If you need to change positions, it happens at a designated stop, not on the move.

## Roles in a Gangs of Safari Convoy

### The Lead Vehicle (Punto Uno)

Driven by an experienced Gangs of Safari leader who knows the route intimately. Sets the pace, communicates road conditions ahead, and is the navigation authority.

### The Tail Vehicle (Sweep)

The most critical role — driven by our most experienced member. The tail vehicle never moves forward until every other vehicle is accounted for. If someone has a breakdown, the tail stays with them.

### The Middle

Your job is simple: keep the vehicle ahead in sight, maintain spacing, and communicate anything unusual on the radio.

## What to Keep in Your Safari for a Convoy

- Tow rope (minimum 4-tonne rated)
- Jumper cables or jump starter pack
- Basic tool kit
- First aid kit
- At least 5 litres of water
- Walkie-talkie or phone with WhatsApp
- Physical map (for when there's no signal)
- Emergency contact list for all convoy members

## The Most Important Rule

Look out for each other. A convoy is only as strong as the care its members show for one another. If you see someone struggling — whether with their vehicle, their driving, or just fatigue — speak up.

That's the Gangs of Safari way.

Ready to experience convoy driving firsthand? [Book a tour](/tours) and we'll have you a convoy pro by the end of Day 1.`,
        coverImage:
          'https://images.unsplash.com/photo-1543158266-0066955047b1?w=1200&q=80',
        author: 'Vikram Nair',
        tags: JSON.stringify(['Safety', 'Convoy', 'Tips', 'Beginners']),
        featured: false,
        published: true,
        publishedAt: new Date('2024-04-18'),
      },
    ],
  })

  // ─── Gallery Images ───────────────────────────────────────────────────────────

  await prisma.galleryImage.createMany({
    data: [
      {
        url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
        caption: 'Tiger spotted at Ranthambore — Zone 4',
        tourTag: 'ranthambore-wildlife-safari',
      },
      {
        url: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800&q=80',
        caption: 'Convoy approaching Jim Corbett National Park',
        tourTag: 'jim-corbett-adventure',
      },
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        caption: 'Safari gang lined up at the Ranthambore Fort entrance',
        tourTag: 'ranthambore-wildlife-safari',
      },
      {
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
        caption: 'The convoy on the Kumaon mountain roads',
        tourTag: 'jim-corbett-adventure',
      },
      {
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        caption: 'Camp setup at Tiger Haven Resort',
        tourTag: 'ranthambore-wildlife-safari',
      },
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        caption: 'Bonfire night at the Jungle Camp',
        tourTag: 'ranthambore-wildlife-safari',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
