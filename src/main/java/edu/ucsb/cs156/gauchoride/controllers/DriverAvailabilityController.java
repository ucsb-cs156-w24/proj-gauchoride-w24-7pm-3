package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.entities.Ride;
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

    @Operation(summary = "Update a driver Availability, only user's if not Driver/Admin")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasRole('ROLE_DRIVER') || hasRole('ROLE_USER')")
    @PutMapping("")
    public DriverAvailability updateDriverAvailability(
            @Parameter(name="id", description="long, Id of the DriverAvailability to be edited", 
            required = true)
            @RequestParam Long id,
            @RequestBody @Valid DriverAvailability incoming) {

        DriverAvailability driverAvailability;

        if (getCurrentUser().getRoles().contains(new SimpleGrantedAuthority("ROLE_ADMIN")) ||
        getCurrentUser().getRoles().contains(new SimpleGrantedAuthority("ROLE_DRIVER"))) {
            driverAvailability = driverAvailabilityRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));}
        else{
            driverAvailability = driverAvailabilityRepository.findByIdAndDriverId(id, getCurrentUser().getUser().getId())
            .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
        }
    
    

        driverAvailability.setDay(incoming.getDay());
        driverAvailability.setStartTime(incoming.getStartTime());
        driverAvailability.setEndTime(incoming.getEndTime());
        driverAvailability.setNotes(incoming.getNotes());

        driverAvailabilityRepository.save(driverAvailability);
        return driverAvailability;
    }
}

