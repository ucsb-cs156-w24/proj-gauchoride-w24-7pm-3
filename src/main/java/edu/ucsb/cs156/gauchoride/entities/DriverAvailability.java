package edu.ucsb.cs156.gauchoride.entities;

import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.persistence.GeneratedValue;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "driverAvailability")
public class DriverAvailability {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private long driverId;

  @Schema(allowableValues = "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday")
  private String day;
  
  private String startTime; // format: HH:MM(A/P)M e.g. "11:00AM" or "1:37PM"
  private String endTime; // format: HH:MM(A/P)M e.g. "11:00AM" or "1:37PM"
  private String notes;
}