FROM openjdk:11

COPY target/main-0.0.1-SNAPSHOT.jar /app/main.jar

WORKDIR /app

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "main.jar"]