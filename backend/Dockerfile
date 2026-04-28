# Build stage
FROM maven:3.9.6-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/target/icms-backend-1.0.0.jar .

EXPOSE 8080

CMD ["java", "-jar", "icms-backend-1.0.0.jar"]
