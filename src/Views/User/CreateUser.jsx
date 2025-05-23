import React, { useState } from "react";
import { useRedirect } from "react-admin";
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

export const CreateUser = () => {
  const redirect = useRedirect();

  // State for form fields (initially empty)
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsInvalid(!validateEmail(value));
  };

  // Function to create a new user in Parse
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await Parse.Cloud.run("createUser", {
        username: userName,
        name,
        email,
        password,
        balance: parseFloat(balance),
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
                    onChange={handleChange}
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

              <Col md={6}>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="off"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <Button type="submit" color="success" className="mt-2">
                  Create User
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Form>
      </Card>
    </React.Fragment>
  );
};
