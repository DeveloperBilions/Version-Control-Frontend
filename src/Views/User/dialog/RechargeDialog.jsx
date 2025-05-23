import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Col,
    FormGroup,
    Label,
    Form,
    Input,
} from "reactstrap";
import { Parse } from "parse";
// Initialize Parse
Parse.initialize(process.env.REACT_APP_APPID, process.env.REACT_APP_MASTER_KEY);
Parse.serverURL = process.env.REACT_APP_URL;

const RechargeDialog = ({ open, onClose, record, fetchAllUsers }) => {
    const [userName, setUserName] = useState("");
    const [balance, setBalance] = useState("");
    const [rechargeAmount, setRechargeAmount] = useState();
    const [remark, setRemark] = useState();

    const resetFields = () => {
        setUserName("");
        setBalance("");
        setRechargeAmount("");
        setRemark("");
    };

    useEffect(() => {
        if (record && open) {
            // Populate fields when modal opens
            setUserName(record.username || "");
            setBalance(record.balance || "");
        } else {
            // Reset fields when modal closes
            resetFields();
        }
    }, [record, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const rawData = {
            ...record,
            transactionAmount: rechargeAmount,
            remark,
            type: "recharge",
        };

        try {
            await Parse.Cloud.run("userTransaction", rawData);
            onClose();
            fetchAllUsers();
            setRechargeAmount("");
            setRemark("");
        } catch (error) {
            console.error("Error creating game details:", error);
        }
    };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     try {
    //         await Parse.Cloud.run("updateRecharge", {
    //             userId: record.id,
    //             balance: balance + parseFloat(rechargeAmount),
    //             remark,
    //         });
    //         onClose();
    //         fetchAllUsers();
    //         setRechargeAmount("");
    //         setRemark("");
    //     } catch (error) {
    //         console.error("Error creating game details:", error);
    //     }
    // };
    return (
        <Modal isOpen={open} toggle={onClose} size="lg" centered>
            <ModalHeader toggle={onClose}>Recharge User</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup row>
                        <Label for="userName" sm={3}>
                            Account
                        </Label>
                        <Col sm={9}>
                            <Input
                                id="userName"
                                name="userName"
                                type="text"
                                value={userName}
                                required
                                disabled
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="gameId" sm={3}>
                            Game ID
                        </Label>
                        <Col sm={9}>
                            <Input
                                id="gameId"
                                name="gameId"
                                type="text"
                                value={786}
                                required
                                disabled
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="balance" sm={3}>
                            Balance
                        </Label>
                        <Col sm={9}>
                            <Input
                                id="balance"
                                name="balance"
                                type="number"
                                value={balance}
                                required
                                disabled
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="rechargeAmount" sm={3}>
                            Recharge Amount
                        </Label>
                        <Col sm={9}>
                            <Input
                                id="rechargeAmount"
                                name="rechargeAmount"
                                type="number"
                                autoComplete="off"
                                onChange={(e) => setRechargeAmount(e.target.value)}
                                required
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="remark" sm={3}>
                            Remark
                        </Label>
                        <Col sm={9}>
                            <Input
                                id="remark"
                                name="remark"
                                type="textarea"
                                autoComplete="off"
                                onChange={(e) => setRemark(e.target.value)}
                                required
                            />
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="success" type="submit" onClick={handleSubmit}>
                    Confirm
                </Button>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default RechargeDialog;
