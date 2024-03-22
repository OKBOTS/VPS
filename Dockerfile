FROM debian

# Install necessary packages
RUN dpkg --add-architecture i386 && \
    apt update && \
    DEBIAN_FRONTEND=noninteractive apt install -y \
    wine \
    qemu-kvm \
    fonts-arphic-uming \
    xz-utils \
    dbus-x11 \
    curl \
    firefox-esr \
    gnome-system-monitor \
    mate-system-monitor \
    git \
    xfce4 \
    xfce4-terminal \
    tightvncserver \
    wget \
    apache2-utils

# Download noVNC
RUN wget https://github.com/novnc/noVNC/archive/refs/tags/v1.2.0.tar.gz && \
    tar -xvf v1.2.0.tar.gz

# Set up noVNC
RUN mkdir -p /etc/nginx/.vnc && \
    echo "luo:`openssl passwd -apr1 YourPassword`" > /etc/nginx/.vnc/.htpasswd

# Expose ports
EXPOSE 80

# Configure and start noVNC with basic authentication
CMD ["bash", "-c", "cd /noVNC-1.2.0 && ./utils/launch.sh --vnc localhost:5901 --listen 80 --web /noVNC-1.2.0 --http-auth /etc/nginx/.vnc/.htpasswd"]
