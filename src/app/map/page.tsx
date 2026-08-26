import GoogleMapView from "../components/GoogleMapView";

export const metadata = {
  title: "Geospatial 3D Map & Navigation | Bharat Safe Yatra",
  description: "Explore India's 8 Union Territories with PostGIS-grounded coordinates, Google Maps 3D terrain, multi-stop routes, and verified emergency facilities."
};

export default function MapPage() {
  return <GoogleMapView />;
}
