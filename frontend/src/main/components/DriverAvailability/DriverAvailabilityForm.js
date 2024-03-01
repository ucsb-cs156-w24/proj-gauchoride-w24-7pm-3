import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function DriverAvailabilityForm({ initialContents, submitAction, buttonLabel = "Enter Info"}) {
    const navigate = useNavigate();
    
    // Stryker disable next-line Regex
    const day_regex = /((Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday))$/i;
    // Stryker disable next-line Regex
    const time_regex = /^(0?[1-9]|11|12):([0-5][0-9])(A|P)M$/i;

    // Stryker disable all
    const {
        register,
        formState: {errors},
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents }
    );
    // Stryker enable all
   
    const testIdPrefix = "DriverAvailabilityForm";


    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Application Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        defaultValue={initialContents?.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="driverId">Driver Id</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-userId"}
                    id="driverId"
                    type="text"
                    {...register("driverId")}
                    defaultValue={initialContents?.userId}
                    disabled
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="day">Day of the Week</Form.Label>
                <Form.Select
                    data-testid={testIdPrefix + "-status"}
                    id="day"
                    isInvalid={Boolean(errors.day)}
                    {...register("day",{
                        required: "Day of the Week is required.",
                    })}
                    
                >
                <option value="">Select a Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.day?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="startTime">Start Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-startTime"}
                    id="startTime"
                    type="text"
                    isInvalid={Boolean(errors.startTime)}
                    {...register("startTime",{
                        required: true,
                        pattern: time_regex
                    })}
                    placeholder = "Please enter time in the format HH:MM AM/PM (e.g., 1:37AM)."
                    defaultValue={initialContents?.startTime}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.startTime?.type === 'required' && 'Start Time is required.'}
                    {errors.startTime?.type === 'pattern' && 'Enter a day in the form of HH:MM(A/P)M (Ex. 1:37AM).'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="endTime">End Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-endTime"}
                    id="endTime"
                    type="text"
                    isInvalid={Boolean(errors.endTime)}
                    {...register("endTime",{
                        required: true,
                        pattern: time_regex,
                    })}
                    placeholder = "Please enter time in the format HH:MM AM/PM (e.g., 1:37AM)."
                    defaultValue={initialContents?.endTime}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.endTime?.type === 'required' && 'End Time is required.'}
                    {errors.endTime?.type === 'pattern' && 'Enter a day in the form of HH:MM(A/P)M (Ex. 1:37AM).'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="notes">Notes</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-notes"}
                    id="notes"
                    type="text"
                    isInvalid={Boolean(errors.notes)}
                    {...register("notes",{
                        required: "Notes are required."
                    })}
                    defaultValue={initialContents?.notes}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.notes?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default DriverAvailabilityForm;