FROM openjdk:17-jdk-slim

COPY target/demo-0.0.1-SNAPSHOT.jar /app-admin/admin.jar

WORKDIR /app-admin

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "admin.jar"]