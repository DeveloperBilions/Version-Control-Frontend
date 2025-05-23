import React, { useEffect, useState } from "react";
import {
    useRedirect,
    useGetRecordId,
} from "react-admin";
import {
    Form,
    Input,
    FormGroup,
    Label,
    Button,
    Row,
    Col,
    Card,
    CardBody,
} from "reactstrap";
import { Parse } from "parse";
// Initialize Parse
Parse.initialize(
    process.env.REACT_APP_APPID,
    process.env.REACT_APP_MASTER_KEY
);
Parse.serverURL = process.env.REACT_APP_URL;

export const EditUser = () => {
    const redirect = useRedirect();
    const recordId = useGetRecordId();

    const [user, setUser] = useState(null);
    // State for form fields (initially empty)
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState("");

    const fetchUserById = async (id) => {
        try {
            const response = await Parse.Cloud.run("getUserById", { userId: id });
            setUser(response);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        if (recordId) {
            fetchUserById(recordId);
        }
    }, [recordId]);

    // Update form fields when data is loaded
    useEffect(() => {
        if (user) {
            setUserName(user.username || "");
            setName(user.name || "");
            setEmail(user.email || "");
            setBalance(user.balance || "");
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await Parse.Cloud.run("updateUser", {
                userId: recordId,
                username: userName,
                name,
                email,
                balance,
            });

            redirect("list", "users");
        } catch (error) {
            console.error("Error creating game details:", error);
        }
    };

    return (
        <React.Fragment>
            <Card className="mt-3">
                <Form onSubmit={handleSubmit}>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="userName">User Name</Label>
                                    <Input
                                        id="userName"
                                        name="userName"
                                        type="text"
                                        autoComplete="off"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="off"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="off"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="balance">Balance</Label>
                                    <Input
                                        id="balance"
                                        name="balance"
                                        type="number"
                                        autoComplete="off"
                                        value={balance}
                                        onChange={(e) => setBalance(e.target.value)}
                                        required
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={12}>
                                <Button type="submit" color="success" className="mt-2">
                                    Update User
                                </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Form>
            </Card>
        </React.Fragment>
    );
};
