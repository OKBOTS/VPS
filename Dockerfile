# Use the official Ubuntu base image
FROM ubuntu:latest

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get install -y \
    xvfb \
    fluxbox \
    x11vnc \
    novnc \
    websockify \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Expose ports
EXPOSE 8080

# Set the entry point to launch NoVNC server
CMD ["bash", "-c", "Xvfb :1 -screen 0 1024x768x16 & \
    sleep 5 && \
    fluxbox & \
    x11vnc -display :1 -nopw -listen localhost -xkb -forever & \
    websockify --web /usr/share/novnc/ 8080 localhost:5900"]
