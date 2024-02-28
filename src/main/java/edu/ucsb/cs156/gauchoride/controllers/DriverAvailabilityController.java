package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.errors.EntityNotFoundException;
import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import java.lang.Iterable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder.SecretKeyReactiveJwtDecoderBuilder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;


@Tag(name = "DriverAvailability Request")
@RequestMapping("/api/driverAvailability")
@RestController

public class DriverAvailabilityController extends ApiController {

    @Autowired
    DriverAvailabilityRepository driverAvailabilityRepository;

    @Operation(summary = "List all availabilities if admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("admin/all")
    public Iterable<DriverAvailability> allDriverAvailabilitys() {
        return driverAvailabilityRepository.findAll();
    }

    @Operation(summary = "Get a single availability by id, if user is an admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("admin")
    public DriverAvailability getByIdAdmin(
            @Parameter(name="id", description = "long, Id of the DriverAvailability to get", 
            required = true)  
            @RequestParam Long id) {
        DriverAvailability driverAvailability;
        driverAvailability = driverAvailabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));;
        return driverAvailability;
    }

    @Operation(summary = "Create a new Driver Availability")
    @PreAuthorize("hasRole('ROLE_DRIVER') || hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER')")
    @PostMapping("/new")
    public DriverAvailability postDriverAvailability(
        // @Parameter(name="driverId", description="Long, driver id")
        // @RequestParam long driverId,

        @Parameter(name="day", description="String, Day of the week ride is requested (Monday - Sunday) and allows Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday", 
                    example="Tuesday", required = true) 
        @RequestParam String day,

        @Parameter(name="startTime", description="String, Time the ride starts HH:MM(A/P)M", example="12:30AM", required = true)
        @RequestParam String startTime,

        @Parameter(name="endTime", description="String, Time the ride ends HH:MM(A/P)M", example="12:30AM", required = true)
        @RequestParam String endTime,

        @Parameter(name="notes", description="String, Extra information", example="We have two people riding", required = true)
        @RequestParam String notes
        )
        {

        DriverAvailability driverAvailability = new DriverAvailability();
        
        driverAvailability.setDriverId(getCurrentUser().getUser().getId());
        driverAvailability.setDay(day);
        driverAvailability.setStartTime(startTime);
        driverAvailability.setEndTime(endTime);
        driverAvailability.setNotes(notes);

        DriverAvailability savedDriverAvailability = driverAvailabilityRepository.save(driverAvailability);

        return savedDriverAvailability;
    }

    @Operation(summary = "List all availabilities of current user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Iterable<DriverAvailability> allUserDriverAvailabilities() {
        Iterable<DriverAvailability> availabilities;
        availabilities = driverAvailabilityRepository.findAllByDriverId(getCurrentUser().getUser().getId());
        return availabilities;
    }

    @Operation(summary = "Get a single availability by id, if user owns it")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/id")
    public DriverAvailability getById(
            @Parameter(name="id", description = "long, Id of the DriverAvailability to get", 
            required = true)  
            @RequestParam Long id) {
        DriverAvailability driverAvailability;
        driverAvailability = driverAvailabilityRepository.findByIdAndDriverId(id, getCurrentUser().getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));;
        return driverAvailability;
    }


    @Operation(summary = "Delete a ride, only user's if not admin/driver")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER') || hasRole('ROLE_USER')")
    @DeleteMapping("")
    public Object deleteDriverAvailability(
        @Parameter(name="id", description="long, Id of the DriverAvailability to be deleted", 
        required = true)
        @RequestParam Long id) {

        DriverAvailability ride;

        ride = driverAvailabilityRepository.findByIdAndDriverId(id, getCurrentUser().getUser().getId())
            .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
        driverAvailabilityRepository.delete(ride);
        return genericMessage("DriverAvailability with id %s deleted".formatted(id));
    }


    @Operation(summary = "Update a driver Availability, if oned by Driver")
    @PreAuthorize("hasRole('ROLE_DRIVER') || hasRole('ROLE_USER')")
    @PutMapping("")
    public DriverAvailability updateDriverAvailability(
            @Parameter(name="id", description="long, Id of the DriverAvailability to be edited", 
            required = true)
            @RequestParam Long id,
            @RequestBody @Valid DriverAvailability incoming) {

        DriverAvailability ride;
        ride = driverAvailabilityRepository.findByIdAndDriverId(id, getCurrentUser().getUser().getId())
            .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
    
        // ride.setDriverId(getCurrentUser().getU);
        ride.setDay(incoming.getDay());
        ride.setStartTime(incoming.getStartTime());
        ride.setEndTime(incoming.getEndTime());
        ride.setNotes(incoming.getNotes());

        driverAvailabilityRepository.save(ride);
        return ride;
    }
}
