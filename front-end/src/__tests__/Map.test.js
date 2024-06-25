import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Map from "../components/Map"; // 실제 컴포넌트 파일 경로로 변경

const mockStore = configureStore([]);

describe("Map 컴포넌트", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      route: { route: [] },
      search: {
        currentDepartPlaceY: 37.5662952,
        currentDepartPlaceX: 126.9779451,
        currentArrivePlaceY: 37.5662952,
        currentArrivePlaceX: 126.9779451,
        currentTargetPlaceX: null,
        currentTargetPlaceY: null,
        searchWord: "",
        searchCount: 0,
        isAddress: false,
        searchResult: [],
        routeCount: 0,
      },
    });

    // Mock the global navigator.geolocation
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 37.5662952,
            longitude: 126.9779451,
          },
        })
      ),
    };
  });

  test("지도 컴포넌트가 렌더링된다", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Map />
        </MemoryRouter>
      </Provider>
    );

    const mapElement = screen.getByRole("region");
    expect(mapElement).toBeInTheDocument();
  });

  test("검색 버튼을 클릭하면 검색어가 설정된다", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Map />
        </MemoryRouter>
      </Provider>
    );

    const searchButton = screen.getByText("#편의점");
    fireEvent.click(searchButton);

    const actions = store.getActions();
    expect(actions).toEqual([
      { type: "search/setSearchWord", payload: "편의점" },
      { type: "search/incrementSearchCount" },
    ]);
  });

  // 추가 테스트 작성...
});
