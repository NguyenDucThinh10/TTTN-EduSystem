package com.edulms.service;

public class UnauthorizedClassAccessException extends RuntimeException {
    public UnauthorizedClassAccessException(String message) {
        super(message);
    }
}
