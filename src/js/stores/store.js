/**
 * 🇮🇳 BHARAT SAFE YATRA — APPLICATION STATE STORE
 * Lightweight Reactive State Management (Zustand-style pattern for vanilla ES6)
 */

import { DESTINATIONS } from '../data/destinations.js';
import { TERRITORIES } from '../data/territories.js';
import { FESTIVALS } from '../data/festivals.js';
import { EMERGENCY_FACILITIES, EMERGENCY_NATIONAL_CONTACTS, ACTIVE_TRAVEL_ADVISORIES } from '../data/safety.js';
import { BOOKABLE_EXPERIENCES } from '../data/bookings.js';

class AppStore {
  constructor() {
    this.listeners = new Set();
    
    // Load initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('bsy_theme') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Load saved bookmarks
    const savedBookmarks = JSON.parse(localStorage.getItem('bsy_saved_places') || '["pangong-tso", "cellular-jail"]');

    // Initial Itinerary State (Ladakh 5-Day Default Itinerary)
    const initialItinerary = {
      id: "trip-ladakh-adventure-2026",
      title: "Trans-Himalayan Ladakh Adventure",
      territoryId: "LADAKH",
      territoryName: "Ladakh",
      durationDays: 5,
      travellers: 2,
      startDate: "2026-09-10",
      endDate: "2026-09-14",
      travelStyle: "ADVENTURE",
      estimatedBudget: 48000,
      days: [
        {
          dayNumber: 1,
          title: "Acclimatization & Leh Heritage Walk",
          date: "10 Sep 2026",
          summary: "Mandatory rest in Leh followed by evening stroll around Leh Main Bazaar & Shanti Stupa.",
          items: [
            { id: "item-1-1", time: "09:30 AM", title: "Arrival at Leh Airport (3,256m)", type: "TRANSPORT", notes: "Immediate check-in & 48-hour acclimatization protocol" },
            { id: "item-1-2", time: "05:00 PM", title: "Shanti Stupa Sunset Viewpoint", type: "ATTRACTION", destinationId: "leh", notes: "Panoramic view over Indus Valley" },
            { id: "item-1-3", time: "07:30 PM", title: "Tibetan Kitchen Dinner (Thukpa & Momos)", type: "RESTAURANT", notes: "Light meal with herbal ginger tea" }
          ]
        },
        {
          dayNumber: 2,
          title: "Leh to Nubra Valley via Khardung La",
          date: "11 Sep 2026",
          summary: "Cross one of the highest motorable passes in the world and descend into the dunes of Hunder.",
          items: [
            { id: "item-2-1", time: "08:00 AM", title: "Scenic Ascent to Khardung La Pass (5,359m)", type: "TRANSPORT", notes: "Limit pass stop to 20 mins to prevent altitude sickness" },
            { id: "item-2-2", time: "01:30 PM", title: "Diskit Monastery & Giant Maitreya Buddha", type: "ATTRACTION", notes: "Oldest Gompa in Nubra Valley" },
            { id: "item-2-3", time: "05:00 PM", title: "Hunder Sand Dunes & Bactrian Camel Safari", type: "EXPERIENCE", notes: "Double-humped camel ride along cold desert dunes" }
          ]
        },
        {
          dayNumber: 3,
          title: "Nubra Valley to Majestic Pangong Tso",
          date: "12 Sep 2026",
          summary: "Drive along the wild Shyok River route to the turquoise expanse of Pangong Tso.",
          items: [
            { id: "item-3-1", time: "08:30 AM", title: "Scenic Drive via Shyok River Canyon", type: "TRANSPORT", notes: "Dramatic river canyons and high desert terrain" },
            { id: "item-3-2", time: "02:00 PM", title: "First Glimpse of Pangong Tso (Spangmik)", type: "DESTINATION", destinationId: "pangong-tso", notes: "Check-in to eco-dome camp" },
            { id: "item-3-3", time: "08:30 PM", title: "Milky Way Stargazing Session", type: "EXPERIENCE", notes: "Unmatched Bortle-1 dark sky photography" }
          ]
        },
        {
          dayNumber: 4,
          title: "Pangong Tso Sunrise & Return to Leh via Chang La",
          date: "13 Sep 2026",
          summary: "Dawn photography at the lake before returning to Leh across Chang La Pass and visiting Thiksey.",
          items: [
            { id: "item-4-1", time: "06:00 AM", title: "Pangong Dawn Water Reflection Walk", type: "EXPERIENCE", notes: "Witness radiant turquoise color transitions" },
            { id: "item-4-2", time: "11:30 AM", title: "Crossing Chang La Pass (5,360m)", type: "TRANSPORT", notes: "Brief stop at Chang La Temple" },
            { id: "item-4-3", time: "03:30 PM", title: "Thiksey Monastery (Mini Potala)", type: "ATTRACTION", notes: "12-story monastery with 15m Buddha statue" }
          ]
        },
        {
          dayNumber: 5,
          title: "Hemis Spiritual Heritage & Departure",
          date: "14 Sep 2026",
          summary: "Visit Ladakh's wealthiest monastery at Hemis before evening flight preparation.",
          items: [
            { id: "item-5-1", time: "09:00 AM", title: "Hemis Monastery Museum & Sacred Relics", type: "ATTRACTION", notes: "Historic birthplace of Hemis Tsechu festival" },
            { id: "item-5-2", time: "01:00 PM", title: "Leh Market Pashmina & Apricot Shopping", type: "EXPERIENCE", notes: "Support local women artisan cooperatives" }
          ]
        }
      ]
    };

    this.state = {
      theme: savedTheme,
      currentRoute: '#/',
      routeParams: {},
      searchQuery: '',
      selectedTerritoryFilter: 'ALL',
      selectedCategoryFilter: 'ALL',
      savedPlaces: savedBookmarks,
      itinerary: initialItinerary,
      itineraryHistory: [],
      
      // Map State
      map: {
        activeTab: 'explore',
        selectedDestinationId: 'pangong-tso',
        filterType: 'ALL',
        is3D: false,
        zoom: 4.5,
        center: { lat: 22.5937, lng: 78.9629 }, // Center of India
        activeRouteDay: 1
      },

      // Yatra AI State
      ai: {
        isOpen: false,
        isThinking: false,
        messages: [
          {
            id: "msg-welcome",
            role: "assistant",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: "Namaste! I am **Yatra AI**, your context-aware travel companion grounded in verified tourism and safety intelligence for India's 8 Union Territories.\n\nHow may I assist your journey today? You can ask me to tailor your itinerary, check permit rules, explore festivals, or inspect weather conditions.",
            citations: [
              { title: "Official UT Tourism Departments", url: "https://tourism.ladakh.gov.in" }
            ],
            actionProposal: null
          }
        ]
      },

      // Safety & SOS State
      sos: {
        isOpen: false,
        isSimulatingGPS: false,
        userLocation: { lat: 34.1526, lng: 77.5771, label: "Leh, Ladakh (Current Simulated GPS)" },
        nearestHospital: EMERGENCY_FACILITIES[0]
      },

      // Booking State
      bookings: {
        activeFilter: 'ALL',
        searchQuery: '',
        userBookings: [
          {
            id: "BK-2026-8891",
            title: "Cellular Jail Sound & Light Show E-Ticket",
            date: "18 Sep 2026 • 05:30 PM",
            status: "CONFIRMED",
            amount: "₹150 per person",
            provider: "Andaman E-Tourist Portal",
            reference: "AN-ET-99201"
          }
        ]
      },

      // User Preferences
      preferences: {
        name: "Bharat Yatri",
        travelStyles: ["Adventure", "Heritage", "Nature", "Photography"],
        budgetTier: "Moderate",
        emergencyContact: { name: "Aditi Sharma", relation: "Family", phone: "+91 98765 43210" }
      }
    };

    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  // --- ACTIONS ---

  toggleTheme() {
    const nextTheme = this.state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('bsy_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    this.setState({ theme: nextTheme });
  }

  setRoute(route, params = {}) {
    this.setState({ currentRoute: route, routeParams: params });
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSavePlace(destinationId) {
    const saved = new Set(this.state.savedPlaces);
    if (saved.has(destinationId)) {
      saved.delete(destinationId);
    } else {
      saved.add(destinationId);
    }
    const newSaved = Array.from(saved);
    localStorage.setItem('bsy_saved_places', JSON.stringify(newSaved));
    this.setState({ savedPlaces: newSaved });
  }

  // Itinerary Actions
  resizeItineraryDuration(newDays) {
    if (newDays < 3 || newDays > 14) return;
    const current = this.state.itinerary;
    const updatedDays = [...current.days];

    if (newDays > current.durationDays) {
      // Add days
      for (let i = current.durationDays + 1; i <= newDays; i++) {
        updatedDays.push({
          dayNumber: i,
          title: `Day ${i} — Extended Exploration`,
          date: `Day ${i}`,
          summary: "Curated additional day for leisure, local market discovery, and photography.",
          items: [
            { id: `item-${i}-1`, time: "10:00 AM", title: "Local Handicraft & Cultural Exploration", type: "EXPERIENCE", notes: "Interact with local weavers and artisan communities" },
            { id: `item-${i}-2`, time: "04:00 PM", title: "Sunset Leisure & Scenic Cafe Experience", type: "RESTAURANT", notes: "Enjoy regional organic delicacies" }
          ]
        });
      }
    } else if (newDays < current.durationDays) {
      // Trim days
      updatedDays.length = newDays;
    }

    const updatedItinerary = {
      ...current,
      durationDays: newDays,
      days: updatedDays,
      estimatedBudget: Math.round(current.estimatedBudget * (newDays / current.durationDays))
    };

    this.setState({ itinerary: updatedItinerary });
  }

  addItineraryItem(dayNumber, item) {
    const updatedDays = this.state.itinerary.days.map(d => {
      if (d.dayNumber === dayNumber) {
        return { ...d, items: [...d.items, { ...item, id: `item-${Date.now()}` }] };
      }
      return d;
    });
    this.setState({ itinerary: { ...this.state.itinerary, days: updatedDays } });
  }

  removeItineraryItem(dayNumber, itemId) {
    const updatedDays = this.state.itinerary.days.map(d => {
      if (d.dayNumber === dayNumber) {
        return { ...d, items: d.items.filter(i => i.id !== itemId) };
      }
      return d;
    });
    this.setState({ itinerary: { ...this.state.itinerary, days: updatedDays } });
  }

  // AI Assistant Actions
  toggleAI(isOpen) {
    this.setState({
      ai: { ...this.state.ai, isOpen: typeof isOpen === 'boolean' ? isOpen : !this.state.ai.isOpen }
    });
  }

  sendAIMessage(userText) {
    if (!userText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: userText,
      citations: []
    };

    const newMessages = [...this.state.ai.messages, userMsg];
    this.setState({
      ai: { ...this.state.ai, messages: newMessages, isThinking: true }
    });

    // Simulate verified RAG knowledge generation with citation & action proposal
    setTimeout(() => {
      let assistantReply = "";
      let citations = [];
      let proposal = null;

      const lower = userText.toLowerCase();

      if (lower.includes("pangong") || lower.includes("ladakh") || lower.includes("itinerary")) {
        assistantReply = "Based on official Ladakh Tourism data, Pangong Tso sits at **4,350m**. Travelling there requires crossing **Chang La Pass (5,360m)**.\n\nI recommend scheduling Pangong on **Day 3 or Day 4** after minimum 48 hours of acclimatization in Leh. Would you like me to optimize your current 5-day itinerary with an evening stargazing session at Spangmik?";
        citations = [
          { title: "Official Ladakh Tourism — Pangong Tso Record", url: "https://tourism.ladakh.gov.in" },
          { title: "UT Administration Health Advisory (Acclimatization)", url: "https://ladakh.gov.in" }
        ];
        proposal = {
          type: "OPTIMIZE_ITINERARY",
          title: "Add Stargazing Session at Spangmik to Day 3",
          day: 3,
          item: { time: "09:00 PM", title: "Milky Way Astrophotography at Spangmik", type: "EXPERIENCE", notes: "Guided Bortle-1 dark sky viewing" }
        };
      } else if (lower.includes("permit") || lower.includes("lakshadweep") || lower.includes("epermit")) {
        assistantReply = "Under official Lakshadweep Administration regulations, **all non-native visitors must hold an official ePermit** prior to boarding flights or ships at Kochi.\n\n• Tourist sponsorship is **no longer required**.\n• Police Clearance Certificate (PCC) upload is **no longer mandatory** for tourist category.\n• Applications can be filed directly at `epermit.utl.gov.in`.";
        citations = [
          { title: "Lakshadweep ePermit Portal Regulations", url: "https://epermit.utl.gov.in" }
        ];
      } else if (lower.includes("emergency") || lower.includes("hospital") || lower.includes("sos") || lower.includes("doctor")) {
        assistantReply = "In any emergency, dial **112** (Unified All-India Response) or **108** (Medical Ambulance). For tourist support, call the **24x7 National Tourist Helpline at 1363**.\n\nI can also trigger the high-priority **SOS Emergency Panel** to locate the closest trauma center to your location.";
        citations = [
          { title: "Ministry of Tourism Emergency Directory", url: "https://tourism.gov.in" }
        ];
      } else {
        assistantReply = `I have verified your request across the Phase 5 knowledge base covering all 8 Union Territories (Andaman, Chandigarh, DNH & DD, Delhi, J&K, Ladakh, Lakshadweep, Puducherry). How would you like me to assist your trip planning?`;
        citations = [
          { title: "Bharat Safe Yatra Verified Knowledge Engine", url: "https://bharatsafeyatra.gov.in" }
        ];
      }

      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: assistantReply,
        citations: citations,
        actionProposal: proposal
      };

      this.setState({
        ai: { ...this.state.ai, messages: [...newMessages, assistantMsg], isThinking: false }
      });
    }, 900);
  }

  applyAIProposal(proposal) {
    if (!proposal) return;
    if (proposal.type === "OPTIMIZE_ITINERARY") {
      this.addItineraryItem(proposal.day, proposal.item);
    }
  }

  // SOS Emergency Trigger
  toggleSOS(isOpen) {
    this.setState({
      sos: { ...this.state.sos, isOpen: typeof isOpen === 'boolean' ? isOpen : !this.state.sos.isOpen }
    });
  }
}

export const store = new AppStore();
