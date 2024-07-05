// Bookmark 관련 타입
export interface Bookmark {
  _id: string;
  bookmark_name: string;
  bookmark_address: string;
}

// Bookmark 상태 타입
export interface BookmarksState {
  items: Bookmark[];
}

// Auth 상태 타입
export interface AuthState {
  token: boolean;
  user: string | null;
  email: string | null;
  isLoggedIn: boolean;
  picture: string | null;
}

// Search 상태 타입
export interface SearchResult {
  id: string;
  place_name: string;
  address_name: string;
  road_address?: {
    address_name: string;
    zone_no: string;
  };
  phone?: string;
  y: string;
  x: string;
}

export interface SearchState {
  searchWord: string;
  searchCount: number;
  searchResult: SearchResult[];
  searchDetailInfo: any; // 상세 정보 타입을 구체적으로 정의할 수 있다면 정의해주세요
  detailPageState: boolean;
  currentDetailId: string;
  currentTargetPlaceX: number | null;
  currentTargetPlaceY: number | null;
  currentDepartPlaceX: number | null;
  currentDepartPlaceY: number | null;
  currentArrivePlaceX: number | null;
  currentArrivePlaceY: number | null;
  isAddress: boolean;
  routeCount: number;
}

// Mobility 상태 타입
export interface MobilityState {
  arrive: string | null;
  depart: string | null;
  searchRouteMode: boolean;
  routeCount: number;
}

// RootState 타입
export interface RootState {
  bookmarks: BookmarksState;
  auth: AuthState;
  search: SearchState;
  mobility: MobilityState;
  route: { route: { x: number; y: number }[] };
}
