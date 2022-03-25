import { useState } from "react";
import { Button, Details, FormContainer, Input, Inputs, Label } from "../styles/emotion";

export default function UserDetails() {
    const [ submittedform, setSubmittedForm ] = useState(false);
    return (
        <Details>
            <FormContainer>
                <Inputs>
                    <Label>Name</Label>
                    <Input
                        id="name"
                        placeholder="Full Name"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <Label>Company / Business Name</Label>
                    <Input
                        id="brandname"
                        placeholder="company / breand /name"
                        onChange={(e) => {
                            setBrand(e.target.value);
                        }}
                    />
                    <Label>Phone Number</Label>
                    <Input
                        id="phonenumber"
                        placeholder="070000000"
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                        }}
                    />
                    <Label>Email</Label>
                    <Input
                        id="email"
                        placeholder="example@test.com"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <Label >Location</Label>
                    <Input
                        id="location"
                        type="location"
                        placeholder="location"
                        onChange={(e) => {
                            setLocation(e.target.value);
                        }}
                    />
                    <Label >Website</Label>
                    <Input
                        id="website"
                        type="website"
                        placeholder="website"
                        onChange={(e) => {
                            setWebsite(e.target.value);
                        }}
                    />
                    <Button
                        onClick={() => {
                            setSubmittedForm(true);
                        }}
                    >
                        Submit
                    </Button>
                </Inputs>
            </FormContainer>
        </Details>
    )
}