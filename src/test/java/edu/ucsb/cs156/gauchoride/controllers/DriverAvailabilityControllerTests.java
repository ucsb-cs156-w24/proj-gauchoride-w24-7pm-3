package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(controllers = DriverAvailabilityController.class)
@Import(TestConfig.class)
public class DriverAvailabilityControllerTests extends ControllerTestCase {

    @MockBean
    private DriverAvailabilityRepository driverAvailabilityRepository;

    @WithMockUser(roles = {"ADMIN"})
    @Test
    public void admin_can_get_all_driver_availabilities() throws Exception {
        List<DriverAvailability> expectedAvailabilities = List.of(
            new DriverAvailability(0, 1L, "Monday", "09:00AM", "05:00PM", "Available all day"),
            new DriverAvailability(1L, 1L, "Monday", "09:00AM", "05:00PM", "Available all day")
        );

        when(driverAvailabilityRepository.findAll()).thenReturn(expectedAvailabilities);

        mockMvc.perform(get("/api/driverAvailability/admin/all"))
            .andExpect(status().isOk())
            .andExpect(content().json(mapper.writeValueAsString(expectedAvailabilities)));

        verify(driverAvailabilityRepository, times(1)).findAll();
    }

    @Test
    public void unauthorized_access_denied_for_admin_endpoint() throws Exception {
        mockMvc.perform(get("/api/driverAvailability/admin/all"))
            .andExpect(status().isForbidden());
    }

    @WithMockUser(roles = {"DRIVER"})
@Test
public void driver_can_create_availability() throws Exception {
    DriverAvailability newAvailability = new DriverAvailability(0, 1L, "Monday", "09:00AM", "05:00PM", "Available all day");
    DriverAvailability savedAvailability = new DriverAvailability(1L, 1L, "Monday", "09:00AM", "05:00PM", "Available all day");

    when(driverAvailabilityRepository.save(any(DriverAvailability.class))).thenReturn(savedAvailability);

    mockMvc.perform(post("/api/driverAvailability/new")
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(newAvailability))
            .with(csrf()))
        .andExpect(status().isOk())
        .andExpect(content().json(mapper.writeValueAsString(savedAvailability)));

    verify(driverAvailabilityRepository, times(1)).save(any(DriverAvailability.class));
}

    @WithMockUser(roles = {"USER"})
    @Test
    public void user_can_get_their_availabilities() throws Exception {
        List<DriverAvailability> userAvailabilities = List.of(
            new DriverAvailability(0, 1L, "Monday", "09:00AM", "05:00PM", "Available all day"),
            new DriverAvailability(1L, 1L, "Monday", "09:00AM", "05:00PM", "Available all day")
        );

        when(driverAvailabilityRepository.findAllByDriverId(eq(1L))).thenReturn(userAvailabilities); // Assuming 1L is the mocked user's ID

        mockMvc.perform(get("/api/driverAvailability"))
            .andExpect(status().isOk())
            .andExpect(content().json(mapper.writeValueAsString(userAvailabilities)));

        verify(driverAvailabilityRepository, times(1)).findAllByDriverId(eq(1L));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void user_can_delete_their_availability() throws Exception {
        Long availabilityId = 1L; // Example ID
        DriverAvailability availability = new DriverAvailability(0, 1L, "Monday", "09:00AM", "05:00PM", "Available all day");
        when(driverAvailabilityRepository.findByIdAndDriverId(eq(availabilityId), eq(1L))).thenReturn(Optional.of(availability));

        mockMvc.perform(delete("/api/driverAvailability")
                .param("id", availabilityId.toString())
                .with(csrf()))
            .andExpect(status().isOk());

        verify(driverAvailabilityRepository, times(1)).delete(availability);
    }

    @WithMockUser(roles = {"DRIVER"})
    @Test
    public void driver_can_update_their_availability() throws Exception {
        Long availabilityId = 1L;
        DriverAvailability existingAvailability = new DriverAvailability(availabilityId, 1L, "Monday", "09:00AM", "05:00PM", "Available all day");
        DriverAvailability updatedAvailability = new DriverAvailability(availabilityId, 1L, "Tuesday", "10:00AM", "04:00PM", "Changed availability");

        when(driverAvailabilityRepository.findByIdAndDriverId(eq(availabilityId), eq(1L))).thenReturn(Optional.of(existingAvailability));
        when(driverAvailabilityRepository.save(any(DriverAvailability.class))).thenReturn(updatedAvailability);

        mockMvc.perform(put("/api/driverAvailability")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(updatedAvailability))
                .with(csrf()))
            .andExpect(status().isOk())
            .andExpect(content().json(mapper.writeValueAsString(updatedAvailability)));

        verify(driverAvailabilityRepository, times(1)).save(any(DriverAvailability.class));
    }


}
