import { useCurrentUser } from 'main/utils/currentUser';
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

/**
 * 
 * @param {initialContents} initialContents - prepopulates the form with values 
 * @param {submitAction} submitAction - form will go into show mode if submitAction field is **null** (all fields are uneditable)
 * @param {buttonLabel} buttonLabel - label of submit button
 * @param {email} email - email of user who owns application
 * @returns 
 */
function RiderApplicationReviewForm({ initialContents, submitAction, email}) {
    const navigate = useNavigate();

    // Stryker disable all
    const {
        register,
        formState: { errors },
        setValue,
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents }
    );
    // Stryker enable all

    const testIdPrefix = "RiderApplicationReviewForm";

    const { data: currentUser } = useCurrentUser();
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        setAdmin(currentUser.root?.user?.admin);
    }, [currentUser]);


    return (

        <Form data-testid={`${testIdPrefix + '-form'}`} onSubmit={handleSubmit(submitAction)}>

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

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="status">Status</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-status"}
                        id="status"
                        type="text"
                        {...register("status")}
                        defaultValue={initialContents?.status}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-email"}
                    id="email"
                    type="text"
                    {...register("email")}
                    defaultValue={email}
                    disabled
                />
            </Form.Group>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="created_date">Date Applied</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-created_date"}
                        id="created_date"
                        type="text"
                        {...register("created_date")}
                        defaultValue={initialContents?.created_date}
                        disabled
                    />
                </Form.Group>
            )}

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="updated_date">Date Updated</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-updated_date"}
                        id="updated_date"
                        type="text"
                        {...register("updated_date")}
                        defaultValue={initialContents?.updated_date}
                        disabled
                    />
                </Form.Group>
            )}

            {initialContents?.cancelled_date && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="cancelled_date">Date Cancelled</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-cancelled_date"}
                        id="cancelled_date"
                        type="text"
                        {...register("cancelled_date")}
                        defaultValue={initialContents?.cancelled_date}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="perm_number">Perm Number</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-perm_number"}
                    id="perm_number"
                    type="text"
                    isInvalid={Boolean(errors.perm_number)}
                    {...register("perm_number", {
                        required: "Perm Number is required.",
                        minLength: {
                            value: 7,
                            message: "Perm Number must be exactly 7 characters long."
                        },
                        maxLength: {
                            value: 7,
                            message: "Perm Number must be exactly 7 characters long."
                        }
                    })}
                    placeholder="e.g. 0000000"
                    defaultValue={initialContents?.perm_number}
                    disabled={true}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.perm_number?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Label style={{ display: 'block', fontSize: '80%', fontStyle: 'italic', color: '#888' }}>Please describe the mobility limitations that cause you to need to use the Gauchoride service.</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-description"}
                    id="description"
                    as="textarea"
                    isInvalid={Boolean(errors.description)}
                    {...register("description", {
                        
                    })}
                    placeholder="e.g. My legs are broken."
                    defaultValue={initialContents?.description}
                    style={{ width: '100%', minHeight: '10rem', resize: 'vertical', verticalAlign: 'top' }}
                    disabled={true}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            {(initialContents?.notes || isAdmin) && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="notes">Notes</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-notes"}
                        id="notes"
                        type="text"
                        {...register("notes")}
                        placeholder="e.g. Your application is in review."
                        defaultValue={initialContents?.notes}
                        disabled={!isAdmin || !submitAction}
                    />
                </Form.Group>
            )}

            {submitAction && (
                <>
                    {initialContents?.status === "pending" && (
                        <>
                            <Button
                                type="submit"
                                onClick={() => setValue("status", "accepted")}
                                data-testid={testIdPrefix + "-approve"}
                                className="btn btn-success m-1"
                            >
                                Approve
                            </Button>

                            <Button
                                type="submit"
                                onClick={() => setValue("status", "declined")}
                                data-testid={testIdPrefix + "-deny"}
                                className="btn btn-danger m-1"
                            >
                                Deny
                            </Button>

                            <Button
                                type="button"
                                data-testid={testIdPrefix + "-return-without-save"}
                                className="btn m-1"
                                onClick={() => {navigate(-1)}}
                            >
                                Return without Saving
                            </Button>
                        </>
                    )}
                    {initialContents?.status === "accepted" && (
                        <>
                            <Button
                                type="submit"
                                onClick={() => setValue("status", "expired")}
                                data-testid={testIdPrefix + "-set-expired"}
                                className="btn btn-success m-1"
                            >
                                Set Status to Expired
                            </Button>

                            <Button
                                type="submit"
                                data-testid={testIdPrefix + "-return-without-save"}
                                className="btn m-1"
                                onClick={() => {navigate(-1)}}
                            >
                                Return without Saving
                            </Button>
                        </>
                    )}
                </>
            )}


        </Form>

    )
}

export default RiderApplicationReviewForm;