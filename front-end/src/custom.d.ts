declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Map {
    constructor(container: HTMLElement | null, options: any);
    getCenter(): LatLng;
    setCenter(latlng: LatLng): void;
    getBounds(): any;
  }

  class Marker {
    constructor(options: any);
    setMap(map: Map | null): void;
  }

  class InfoWindow {
    constructor(options: any);
    open(map: Map, marker: Marker): void;
    close(): void;
  }

  class Polyline {
    constructor(options: any);
    setMap(map: Map | null): void;
  }

  namespace services {
    class Places {
      keywordSearch(
        keyword: string,
        callback: (result: any, status: any, pagination: any) => void,
        options?: any
      ): void;
    }

    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: any, status: any) => void
      ): void;
    }

    const Status: {
      OK: number;
      ZERO_RESULT: number;
      ERROR: number;
    };
  }

  namespace event {
    function addListener(target: any, type: string, handler: () => void): void;
    function removeListener(
      target: any,
      type: string,
      handler: () => void
    ): void;
  }
}

interface Window {
  kakao: {
    maps: typeof kakao.maps;
  };
}
