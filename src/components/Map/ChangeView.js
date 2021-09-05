import { useMap } from 'react-leaflet';

function ChangeView({center, zoom}) {
    const map = useMap();
    map.flyTo(center, zoom, {
      animate: 'true',
      duration: 2.5,
    });
    return null;
}

export default ChangeView
