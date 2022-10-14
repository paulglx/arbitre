import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetExerciseQuery } from "../features/courses/exerciseApiSlice";

import { Container } from "react-bootstrap";

const Exercise = () => {

    const { id }:any = useParams();
    const {
        data: exercise,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExerciseQuery({id});

    console.log(exercise)

    return (
        <Container>
            <Navbar></Navbar>
        </Container>
    )
}

export default Exercise