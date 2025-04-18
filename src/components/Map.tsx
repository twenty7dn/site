import { default as MapBox } from 'react-map-gl/mapbox';

const Map = ({ lat, lng, zoom, width, height }: any) => {
    return (
        <MapBox
            // https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            initialViewState={{
                longitude: lng,
                latitude: lat,
                zoom: zoom || 3.5,
                padding: {
                    top: (height / 2),
                    left: (width * 0.7),
                    right: (width * 0.3),
                    bottom: (height / 2),
                },
            }}
            interactive={false}
            style={{position: "absolute", inset: '0'}}
            mapStyle="mapbox://styles/crossrambles/cm94qm60b008l01qtfmzn9v2l"
        />
    );
};

export default Map;
