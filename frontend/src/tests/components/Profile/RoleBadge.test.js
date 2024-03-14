import { render, waitFor } from "@testing-library/react";
import {currentUserFixtures} from "fixtures/currentUserFixtures";
import RoleBadge from "main/components/Profile/RoleBadge"

describe("RoleBadge tests", () => {

    test("renders without crashing for ROLE_USER when user has ROLE_USER", async () => {
        const {getByTestId} = render(
            <RoleBadge currentUser={currentUserFixtures.userOnly} role={"ROLE_USER"} />
        );
        await waitFor( ()=> expect(getByTestId("role-badge-user")).toBeInTheDocument() );

        // Check if the badge has the correct margin style
        const badge = getByTestId("role-badge-user");
        await waitFor(() => expect(badge).toBeInTheDocument());
        const badgeStyle = getComputedStyle(badge);
        expect(badgeStyle.margin).toBe("0px 5px");
    });

    test("renders without crashing for ROLE_DRIVER when user has ROLE_DRIVER", async () => {
        const {getByTestId} = render(
            <RoleBadge currentUser={currentUserFixtures.driverOnly} role={"ROLE_DRIVER"} />
        );
        await waitFor( ()=> expect(getByTestId("role-badge-driver")).toBeInTheDocument() );
    });

    test("renders without crashing for ROLE_DRIVER when user does NOT have ROLE_DRIVER", async () => {
        const {getByTestId } = render(
            <RoleBadge currentUser={currentUserFixtures.userOnly} role={"ROLE_DRIVER"} />
        );
        await waitFor( ()=> expect(getByTestId("role-missing-driver")).toBeInTheDocument() );
    });

    test("renders without crashing for ROLE_ADMIN when user has ROLE_ADMIN", async () => {
        const {getByTestId} = render(
            <RoleBadge currentUser={currentUserFixtures.adminUser} role={"ROLE_ADMIN"} />
        );
        await waitFor( ()=> expect(getByTestId("role-badge-admin")).toBeInTheDocument() );
    });

    test("renders without crashing for ROLE_ADMIN when user does NOT have ROLE_ADMIN", async () => {
        const {getByTestId } = render(
            <RoleBadge currentUser={currentUserFixtures.userOnly} role={"ROLE_ADMIN"} />
        );
        await waitFor( ()=> expect(getByTestId("role-missing-admin")).toBeInTheDocument() );
    });

    test("renders without crashing for no role", async () => {
        const {getByTestId } = render(
            <RoleBadge currentUser={currentUserFixtures.driverOnly} role={""} />
        );
        await waitFor( ()=> expect(getByTestId("role-missing-")).toBeInTheDocument() );
    });



    // Additional test cases for roles
    test("renders without crashing for ROLE_USER when user does NOT have ROLE_USER", async () => {
        const { getByTestId } = render(
            <RoleBadge currentUser={currentUserFixtures.driverOnly} role={"ROLE_USER"} />
        );
        await waitFor(() => expect(getByTestId("role-missing-user")).toBeInTheDocument());
    });

    test("renders without crashing for ROLE_ADMIN when user has ROLE_ADMIN", async () => {
        const { getByTestId } = render(
            <RoleBadge currentUser={currentUserFixtures.adminUser} role={"ROLE_ADMIN"} />
        );
        await waitFor(() => expect(getByTestId("role-badge-admin")).toBeInTheDocument());
    });

    test("renders without crashing for ROLE_ADMIN when user does NOT have ROLE_ADMIN", async () => {
        const { getByTestId } = render(
            <RoleBadge currentUser={currentUserFixtures.driverOnly} role={"ROLE_ADMIN"} />
        );
        await waitFor(() => expect(getByTestId("role-missing-admin")).toBeInTheDocument());
    });
});