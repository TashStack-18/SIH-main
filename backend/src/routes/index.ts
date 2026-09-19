import { Router } from 'express';
import { createHandler } from '../adapter';

// Route handlers
import * as healthRoute from '../api/v1/health/route';
import * as destinationsRoute from '../api/v1/destinations/route';
import * as destinationSlugRoute from '../api/v1/destinations/[slug]/route';
import * as territoriesRoute from '../api/v1/territories/route';
import * as territorySlugRoute from '../api/v1/territories/[slug]/route';
import * as statesUtsRoute from '../api/v1/states-and-uts/route';
import * as weatherRoute from '../api/v1/weather/route';
import * as currencyRoute from '../api/v1/currency/route';
import * as festivalsRoute from '../api/v1/festivals/route';
import * as flightsRoute from '../api/v1/flights/route';
import * as hotelsRoute from '../api/v1/hotels/route';
import * as experienceRoute from '../api/v1/experience/route';
import * as experienceIdRoute from '../api/v1/experience/[id]/route';
import * as feedbackRoute from '../api/v1/feedback/route';
import * as authLoginRoute from '../api/v1/auth/login/route';
import * as authRegisterRoute from '../api/v1/auth/register/route';
import * as aiChatRoute from '../api/v1/ai/chat/route';
import * as aiConversationsRoute from '../api/v1/ai/conversations/route';
import * as aiItineraryRoute from '../api/v1/ai/itinerary/route';
import * as itinerariesRoute from '../api/v1/itineraries/route';
import * as itineraryIdRoute from '../api/v1/itineraries/[id]/route';
import * as itineraryJourneyStartRoute from '../api/v1/itineraries/[id]/journey/start/route';
import * as itineraryNearbyRoute from '../api/v1/itineraries/[id]/nearby/route';
import * as itineraryOptimizeRoute from '../api/v1/itineraries/[id]/optimize/route';
import * as itineraryRecRoute from '../api/v1/itineraries/[id]/recommendations/route';
import * as itineraryRouteRoute from '../api/v1/itineraries/[id]/route/route';
import * as itineraryStopRoute from '../api/v1/itineraries/[id]/stops/[stopId]/route';
import * as mapsGeocodingRoute from '../api/v1/maps/geocoding/route';
import * as mapsMarkersRoute from '../api/v1/maps/markers/route';
import * as mapsRouteRoute from '../api/v1/maps/route/route';
import * as paymentsCreateOrderRoute from '../api/v1/payments/create-order/route';
import * as paymentsVerifyRoute from '../api/v1/payments/verify/route';
import * as safetyAdvisoriesRoute from '../api/v1/safety/advisories/route';
import * as safetyContactsRoute from '../api/v1/safety/contacts/route';
import * as safetyLiveRoute from '../api/v1/safety/live/route';
import * as safetyNearbyRoute from '../api/v1/safety/nearby/route';
import * as safetySosRoute from '../api/v1/safety/sos/route';
import * as usersMeRoute from '../api/v1/users/me/route';
import * as usersMeSavedRoute from '../api/v1/users/me/saved/route';

export const apiRouter = Router();

// Health
apiRouter.all('/health', createHandler(healthRoute));

// Destinations
apiRouter.all('/destinations', createHandler(destinationsRoute));
apiRouter.all('/destinations/:slug', createHandler(destinationSlugRoute));

// Territories
apiRouter.all('/territories', createHandler(territoriesRoute));
apiRouter.all('/territories/:slug', createHandler(territorySlugRoute));

// States and UTs
apiRouter.all('/states-and-uts', createHandler(statesUtsRoute));

// Weather & Currency
apiRouter.all('/weather', createHandler(weatherRoute));
apiRouter.all('/currency', createHandler(currencyRoute));

// Travel & Stays
apiRouter.all('/festivals', createHandler(festivalsRoute));
apiRouter.all('/flights', createHandler(flightsRoute));
apiRouter.all('/hotels', createHandler(hotelsRoute));

// Experiences & Feedback
apiRouter.all('/experience', createHandler(experienceRoute));
apiRouter.all('/experience/:id', createHandler(experienceIdRoute));
apiRouter.all('/feedback', createHandler(feedbackRoute));

// Auth
apiRouter.all('/auth/login', createHandler(authLoginRoute));
apiRouter.all('/auth/register', createHandler(authRegisterRoute));

// AI Assistant
apiRouter.all('/ai/chat', createHandler(aiChatRoute));
apiRouter.all('/ai/conversations', createHandler(aiConversationsRoute));
apiRouter.all('/ai/itinerary', createHandler(aiItineraryRoute));

// Itineraries
apiRouter.all('/itineraries', createHandler(itinerariesRoute));
apiRouter.all('/itineraries/:id', createHandler(itineraryIdRoute));
apiRouter.all('/itineraries/:id/journey/start', createHandler(itineraryJourneyStartRoute));
apiRouter.all('/itineraries/:id/nearby', createHandler(itineraryNearbyRoute));
apiRouter.all('/itineraries/:id/optimize', createHandler(itineraryOptimizeRoute));
apiRouter.all('/itineraries/:id/recommendations', createHandler(itineraryRecRoute));
apiRouter.all('/itineraries/:id/route', createHandler(itineraryRouteRoute));
apiRouter.all('/itineraries/:id/stops/:stopId', createHandler(itineraryStopRoute));

// Maps
apiRouter.all('/maps/geocoding', createHandler(mapsGeocodingRoute));
apiRouter.all('/maps/markers', createHandler(mapsMarkersRoute));
apiRouter.all('/maps/route', createHandler(mapsRouteRoute));

// Payments
apiRouter.all('/payments/create-order', createHandler(paymentsCreateOrderRoute));
apiRouter.all('/payments/verify', createHandler(paymentsVerifyRoute));

// Safety & Emergency
apiRouter.all('/safety/advisories', createHandler(safetyAdvisoriesRoute));
apiRouter.all('/safety/contacts', createHandler(safetyContactsRoute));
apiRouter.all('/safety/live', createHandler(safetyLiveRoute));
apiRouter.all('/safety/nearby', createHandler(safetyNearbyRoute));
apiRouter.all('/safety/sos', createHandler(safetySosRoute));

// Users
apiRouter.all('/users/me', createHandler(usersMeRoute));
apiRouter.all('/users/me/saved', createHandler(usersMeSavedRoute));
