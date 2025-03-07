# Build stage
FROM golang:1.23 as builder

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum first for dependency resolution
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Install Air for hot reloading
RUN go install github.com/air-verse/air@latest

# Expose the application port
EXPOSE 8080

# Command to run the application using Air
CMD ["air"]