package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import java.util.*;
import java.lang.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(controllers = DriverAvailabilityController.class)
@Import(TestConfig.class)
public class DriverAvailabilityControllerTests extends ControllerTestCase {

    @MockBean
    private DriverAvailabilityRepository driverAvailabilityRepository;

    @MockBean
    private UserRepository UserRepository;

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/driverAvailability/admin/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/driverAvailability/admin/all"))
                            .andExpect(status().is(200)); // logged
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void getByIdAdminFailsWhenThingDoesntExist() {

    }
    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void logged_in_admin_can_get_all_driver_availability() throws Exception {
        // arrange
        DriverAvailability availability1 = new DriverAvailability();
        availability1.setId(1L);
        availability1.setDriverId(1L);
        availability1.setDay("Monday");
        availability1.setStartTime("9:00AM");
        availability1.setEndTime("5:00PM");
        availability1.setNotes("Available all day");

        DriverAvailability availability2 = new DriverAvailability();
        availability2.setId(2L);
        availability2.setDriverId(2L);
        availability2.setDay("Tuesday");
        availability2.setStartTime("10:00AM");
        availability2.setEndTime("4:00PM");
        availability2.setNotes("Prefer short trips");

        ArrayList<DriverAvailability> expectedAvailabilities = new ArrayList<>();
        expectedAvailabilities.addAll(Arrays.asList(availability1, availability2));

        when(driverAvailabilityRepository.findAll()).thenReturn(expectedAvailabilities);

        // act
        MvcResult response = mockMvc.perform(get("/api/driverAvailability/admin/all"))
                        .andExpect(status().isOk()).andReturn();

        // assert
        verify(driverAvailabilityRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedAvailabilities);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admingetbyidworks() throws Exception {
        // arrange
        DriverAvailability availability1 = new DriverAvailability();
        availability1.setId(1L);
        availability1.setDriverId(1L);
        availability1.setDay("Monday");
        availability1.setStartTime("9:00AM");
        availability1.setEndTime("5:00PM");
        availability1.setNotes("Available all day");
        
        long xd = 1;
        when(driverAvailabilityRepository.findById(xd)).thenReturn(Optional.of(availability1));

        // act
        MvcResult response = mockMvc.perform(get("/api/driverAvailability/admin?id=1"))
                        .andExpect(status().isOk()).andReturn();

        // assert
        verify(driverAvailabilityRepository, times(1)).findById(xd);
        String expectedJson = mapper.writeValueAsString(availability1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }


    @Test
    @WithMockUser(roles = "ADMIN") // Mock an admin user
    public void getByIdAdmin_ShouldReturnNotFoundIfItemDoesNotExist() throws Exception {
        // Arrange: Mock the repository to return an empty Optional when findById is called
        when(driverAvailabilityRepository.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/driverAvailability/admin?id=1")) 
                .andExpect(status().isNotFound()).andReturn();
    }

    @Test
    public void logged_out_users_cannot_create_new() throws Exception {
            mockMvc.perform(post("/api/driverAvailability/post"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER", "ADMIN", "DRIVER" })
    @Test
    public void logged_in_drivers_cant_post() throws Exception {
            mockMvc.perform(post("/api/driverAvailability/post"))
                            .andExpect(status().is(403)); // logged
    }

    @WithMockUser(roles = { "DRIVER" })
    @Test
    public void a_driver_user_can_post_a_new_driver_availability() throws Exception {
        // arrange
        DriverAvailability availability = new DriverAvailability();
        availability.setId(0L); // Assuming the ID is set after save operation
        availability.setDriverId(currentUserService.getCurrentUser().getUser().getId());
        availability.setDay("Monday");
        availability.setStartTime("9:00AM");
        availability.setEndTime("5:00PM");
        availability.setNotes("haha");

        when(driverAvailabilityRepository.save(availability)).thenReturn(availability);

        // // act
        // MvcResult response = mockMvc.perform(
        //                 post("/api/driverAvailability/post")
        //                 .param("driverId", "1")
        //                 .param("day", "Monday")
        //                 .param("startTime", "9:00AM")
        //                 .param("endTime", "5:00PM")
        //                 .param("notes", "haha")
        //                 .with(csrf()))
        //         .andExpect(status().isOk()).andReturn();
        MvcResult response = mockMvc.perform(
                                post("/api/driverAvailability/post?day=Monday&startTime=9:00AM&endTime=5:00PM&notes=haha")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

        // assert
        verify(driverAvailabilityRepository, times(1)).save(availability);
        String expectedJson = mapper.writeValueAsString(availability);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
}
