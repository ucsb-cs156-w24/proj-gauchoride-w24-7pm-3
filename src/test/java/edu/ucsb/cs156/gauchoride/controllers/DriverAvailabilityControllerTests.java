package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;

import edu.ucsb.cs156.gauchoride.entities.Ride;
import edu.ucsb.cs156.gauchoride.entities.RiderApplication;
import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;

import edu.ucsb.cs156.gauchoride.entities.User;
import edu.ucsb.cs156.gauchoride.models.CurrentUser;

import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import java.util.*;

import javax.swing.text.html.Option;

import java.lang.*;

import org.checkerframework.checker.nullness.Opt;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.services.CurrentUserService;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import java.sql.Date;
import java.time.LocalDate;



@WebMvcTest(controllers = DriverAvailabilityController.class)
@Import(TestConfig.class)
public class DriverAvailabilityControllerTests extends ControllerTestCase {

    @MockBean
    private DriverAvailabilityRepository driverAvailabilityRepository;

    @MockBean
    private UserRepository UserRepository;

//     @MockBean
//     private CurrentUserService currentUserService;

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
        // Arrange: Mock the repository to return an empty Optional when findById is
        // called
        when(driverAvailabilityRepository.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/driverAvailability/admin?id=1"))
                .andExpect(status().isNotFound()).andReturn();
    }

    // Tests for DELETE /api/driverAvailability?id=...

    @WithMockUser(roles = { "USER" })
    @Test
    public void user_can_delete_availability() throws Exception {
        // arrange
        long userId = currentUserService.getCurrentUser().getUser().getId();
        
        DriverAvailability driverAvailability = DriverAvailability.builder()
                .driverId(userId)
                .day("Monday")
                .startTime("11:00AM")
                .endTime("11:30AM")
                .notes("Available all day")
                .build();

        when(driverAvailabilityRepository.findByIdAndDriverId(eq(12L), eq(userId))).thenReturn(Optional.of(driverAvailability));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/driverAvailability?id=12")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(12L), eq(userId));
        verify(driverAvailabilityRepository, times(1)).delete(driverAvailability);

        Map<String, Object> json = responseToJson(response);
        assertEquals("DriverAvailability with id 12 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void user_cannot_delete_availbility_not_owned()
            throws Exception {
        long userId = currentUserService.getCurrentUser().getUser().getId();
        long otherUserId = userId + 1;
        // arrange
        DriverAvailability driverAvailability = DriverAvailability.builder()
                .driverId(userId)
                .day("Monday")
                .startTime("11:00AM")
                .endTime("11:30AM")
                .notes("Available all day")
                .build();

        when(driverAvailabilityRepository.findByIdAndDriverId(eq(12L), eq(otherUserId))).thenReturn(Optional.of(driverAvailability));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/driverAvailability?id=12")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(12L), eq(userId));
        verify(driverAvailabilityRepository, times(0)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("DriverAvailability with id 12 not found", json.get("message"));
    }




     // Authorization tests for put /api/DriverAvailability/
     @Test
         public void logged_out_users_cannot_edit() throws Exception {
                 mockMvc.perform(put("/api/DriverAvailability?id=9"))
                                 .andExpect(status().is(403));
     }

     @WithMockUser(roles = { "ADMIN" })
     @Test
     public void logged_in_admin_cannot_edit() throws Exception {
             mockMvc.perform(put("/api/DriverAvailability?id=9"))
                             .andExpect(status().is(403));
     }


    // PUT (UPDATE)
    @WithMockUser(roles = { "DRIVER" })
    @Test
    public void test_that_logged_in_driver_can_update_when_the_availability_exists() throws Exception
    {
        long userId = currentUserService.getCurrentUser().getUser().getId();

        DriverAvailability availability_original = DriverAvailability.builder()
                        .driverId(userId)
                        .day("Monday")
                        .startTime("9:00AM")
                        .endTime("5:00PM")
                        .notes("Available all day")
                        .build();
        
        DriverAvailability availability_edited = DriverAvailability.builder()
                        .driverId(userId)
                        .day("Tuesday")
                        .startTime("10:00AM")
                        .endTime("6:00PM")
                        .notes("Not available all day")
                        .build();
                        
        String requestBody = mapper.writeValueAsString(availability_edited);

        when(driverAvailabilityRepository.findById(eq(67L))).thenReturn(Optional.of(availability_original));

        MvcResult response = mockMvc.perform(
                        put("/api/driverAvailability?id=67")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .characterEncoding("utf-8")
                                        .content(requestBody)
                                        .with(csrf()))
                        .andExpect(status().isOk()).andReturn();

        verify(driverAvailabilityRepository, times(1)).findById(67L);
        verify(driverAvailabilityRepository, times(1)).save(availability_edited); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);  
    }

    @WithMockUser(roles = { "DRIVER" })
    @Test
    public void driver_cannot_edit_availability_that_does_not_exist() throws Exception {
            // arrange

            long userId = currentUserService.getCurrentUser().getUser().getId();
            
            DriverAvailability availability_edited = DriverAvailability.builder()
                            .driverId(userId)
                            .day("Tuesday")
                            .startTime("10:00AM")
                            .endTime("6:00PM")
                            .notes("Not available all day")
                            .build();

            String requestBody = mapper.writeValueAsString(availability_edited);

            when(driverAvailabilityRepository.findById(eq(67L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/driverAvailability?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(driverAvailabilityRepository, times(1)).findById(67L);
            Map<String, Object> json = responseToJson(response);
            assertEquals("DriverAvailability with id 67 not found", json.get("message"));
    }
    
    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_update_their_own_when_the_availability_exists() throws Exception {
            // arrange
            long userId = currentUserService.getCurrentUser().getUser().getId();

            DriverAvailability availability_original = DriverAvailability.builder()
                        .driverId(1L)
                        .day("Monday")
                        .startTime("9:00AM")
                        .endTime("5:00PM")
                        .notes("Available all day")
                        .build();

            DriverAvailability availability_edited = DriverAvailability.builder()
                        .driverId(userId)
                        .day("Tuesday")
                        .startTime("10:00AM")
                        .endTime("6:00PM")
                        .notes("Not available all day")
                        .build();

            String requestBody = mapper.writeValueAsString(availability_edited);

            when(driverAvailabilityRepository.findByIdAndDriverId(eq(67L), eq(userId))).thenReturn(Optional.of(availability_original));

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/driverAvailability?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(67L), eq(userId));
            verify(driverAvailabilityRepository, times(1)).save(availability_edited); // should be saved with correct user
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
    }


    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_cannot_update_others() throws Exception {
            // arrange

            long userId = currentUserService.getCurrentUser().getUser().getId();
            long otherUserId = userId + 1;

            DriverAvailability availability_original = DriverAvailability.builder()
                        .driverId(otherUserId)
                        .day("Monday")
                        .startTime("9:00AM")
                        .endTime("5:00PM")
                        .notes("Available all day")
                        .build();

            DriverAvailability availability_edited = DriverAvailability.builder()
                        .driverId(otherUserId)
                        .day("Tuesday")
                        .startTime("10:00AM")
                        .endTime("6:00PM")
                        .notes("Not available all day")
                        .build();

            String requestBody = mapper.writeValueAsString(availability_edited);

            when(driverAvailabilityRepository.findByIdAndDriverId(eq(67L), eq(otherUserId))).thenReturn(Optional.of(availability_original));

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/driverAvailability?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(67L), eq(userId));
            Map<String, Object> json = responseToJson(response);
            assertEquals("DriverAvailability with id 67 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void user_cannot_edit_ride_that_does_not_exist() throws Exception {
            // arrange

            long userId = currentUserService.getCurrentUser().getUser().getId();

            DriverAvailability availability_edited = DriverAvailability.builder()
                        .driverId(userId)
                        .day("Tuesday")
                        .startTime("10:00AM")
                        .endTime("6:00PM")
                        .notes("Not available all day")
                        .build();


            String requestBody = mapper.writeValueAsString(availability_edited);

            when(driverAvailabilityRepository.findByIdAndDriverId(eq(67L), eq(userId))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/driverAvailability?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(67L), eq(userId));
            Map<String, Object> json = responseToJson(response);
            assertEquals("DriverAvailability with id 67 not found", json.get("message"));

    }
    

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_availability() throws Exception {
            // arrange

            long userId = currentUserService.getCurrentUser().getUser().getId();
            long otherUserId = userId + 1;

            DriverAvailability availability_original = DriverAvailability.builder()
                        .driverId(otherUserId)
                        .day("Monday")
                        .startTime("9:00AM")
                        .endTime("5:00PM")
                        .notes("Available all day")
                        .build();

            DriverAvailability availability_edited = DriverAvailability.builder()
                        .driverId(otherUserId)
                        .day("Tuesday")
                        .startTime("10:00AM")
                        .endTime("6:00PM")
                        .notes("Not available all day")
                        .build();

            String requestBody = mapper.writeValueAsString(availability_edited);

            when(driverAvailabilityRepository.findById(eq(67L))).thenReturn(Optional.of(availability_original));

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/driverAvailability?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(driverAvailabilityRepository, times(1)).findById(67L);
            verify(driverAvailabilityRepository, times(1)).save(availability_edited); // should be saved with correct user
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_availability_that_does_not_exist() throws Exception {
            // arrange

            long userId = currentUserService.getCurrentUser().getUser().getId();

            DriverAvailability availability_edited = DriverAvailability.builder()
                        .driverId(userId)
                        .day("Tuesday")
                        .startTime("10:00AM")
                        .endTime("6:00PM")
                        .notes("Not available all day")
                        .build();

            String requestBody = mapper.writeValueAsString(availability_edited);

            when(driverAvailabilityRepository.findById(eq(67L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/driverAvailability?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(driverAvailabilityRepository, times(1)).findById(67L);
            Map<String, Object> json = responseToJson(response);
            assertEquals("DriverAvailability with id 67 not found", json.get("message"));
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
        long userId = currentUserService.getCurrentUser().getUser().getId();

        // arrange
        DriverAvailability availability = new DriverAvailability();
        availability.setId(0L); // Assuming the ID is set after save operation
        availability.setDriverId(userId);
        availability.setDay("Monday");
        availability.setStartTime("9:00AM");
        availability.setEndTime("5:00PM");
        availability.setNotes("haha");

        // User testUser = User.builder()
        //         .id(11L)
        //         .email("capo@gmail.com")
        //         .admin(true)
        //         .driver(true)
        //         .build();
        // CurrentUser currentUser = CurrentUser.builder()
        //         .user(testUser)
        //         .build();

        // when(currentUserService.getCurrentUser()).thenReturn(currentUser);
        when(driverAvailabilityRepository.save(availability)).thenReturn(availability);

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

