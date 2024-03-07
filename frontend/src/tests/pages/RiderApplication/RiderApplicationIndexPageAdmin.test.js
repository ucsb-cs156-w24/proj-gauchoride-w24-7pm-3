import { screen, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RiderApplicationIndexPageAdmin from "main/pages/RiderApplication/RiderApplicationIndexPageAdmin";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("RiderApplicationIndexPageAdmin tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    };

    const queryClient = new QueryClient();
    
    test("Renders expected content", () => {
        // Arrange
        setupUserOnly();

        // Act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RiderApplicationIndexPageAdmin />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // Assert
        expect(screen.getByText("Rider Application Index Page")).toBeInTheDocument();
        expect(screen.getByText("This page is under construction. Check back later for updates!")).toBeInTheDocument();
    });
});
