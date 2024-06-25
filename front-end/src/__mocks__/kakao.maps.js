const kakao = {
  maps: {
    LatLng: jest.fn(() => ({
      getLat: jest.fn(() => 37.5662952),
      getLng: jest.fn(() => 126.9779451),
    })),
    Map: jest.fn(() => ({
      setCenter: jest.fn(),
      getCenter: jest.fn(() => ({
        getLat: jest.fn(() => 37.5662952),
        getLng: jest.fn(() => 126.9779451),
      })),
      addOverlayMapTypeId: jest.fn(),
      removeOverlayMapTypeId: jest.fn(),
      setMapTypeId: jest.fn(),
    })),
    Marker: jest.fn(() => ({
      setMap: jest.fn(),
    })),
    Polyline: jest.fn(() => ({
      setMap: jest.fn(),
    })),
    event: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    services: {
      Places: jest.fn(() => ({
        keywordSearch: jest.fn(),
      })),
      Geocoder: jest.fn(() => ({
        addressSearch: jest.fn(),
      })),
      Status: {
        OK: "OK",
      },
    },
  },
};

global.window.kakao = kakao;

export default kakao;
