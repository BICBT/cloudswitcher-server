FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractives

# Install build tools
RUN apt-get update && \
    apt-get install -y \
        libssl-dev \
        git \
        cmake \
        build-essential \
        checkinstall

# Build srt
RUN mkdir ~/ffmpeg_sources && \
    cd ~/ffmpeg_sources  && \
    git clone --depth 1 -b v1.4.0 https://github.com/Haivision/srt.git && \
    mkdir srt/build && \
    cd ~/ffmpeg_sources/srt/build && \
    cmake -DENABLE_C_DEPS=ON -DENABLE_SHARED=ON -DENABLE_STATIC=OFF -fPIC .. && \
    make && \
    make install

# Install ffmpeg build dependencies
RUN apt-get -y install \
        autoconf \
        automake \
        openssl \
        libass-dev \
        libfreetype6-dev \
        libgnutls28-dev \
        libsdl2-dev \
        libtool \
        libva-dev \
        libvdpau-dev \
        libvorbis-dev \
        libxcb1-dev \
        libxcb-shm0-dev \
        libxcb-xfixes0-dev \
        pkg-config \
        texinfo \
        wget \
        yasm \
        zlib1g-dev \
        libx264-dev \
        libx265-dev \
        libnuma-dev \
        libfdk-aac-dev \
        libmp3lame-dev

# Build shared ffmpeg with srt support
RUN cd ~/ffmpeg_sources && \
    wget -O ffmpeg-4.2.2.tar.bz2 https://ffmpeg.org/releases/ffmpeg-4.2.2.tar.bz2 && \
    tar xjvf ffmpeg-4.2.2.tar.bz2 && \
    cd ~/ffmpeg_sources/ffmpeg-4.2.2 && \
    PATH="$HOME/bin:$PATH" PKG_CONFIG_PATH="$HOME/ffmpeg_build/lib/pkgconfig" ./configure --prefix=/usr \
        --enable-openssl     \
        --enable-gpl         \
        --enable-version3    \
        --enable-nonfree     \
        --disable-static     \
        --enable-shared      \
        --disable-debug      \
        --enable-avresample  \
        --enable-libfdk-aac  \
        --enable-libfreetype \
        --enable-libx264     \
        --enable-libx265     \
        --enable-protocol=libsrt \
        --enable-libsrt && \
    make && \
    make install && \
    checkinstall -y --deldoc=yes  && \
    ldconfig

# Obs dependencies
RUN apt-get update && \
    apt-get install -y \
    libmbedtls12 \
    libasound2 \
    libcurl4 \
    openssl \
    libfdk-aac1 \
    libfontconfig1 \
    libfreetype6 \
    libgl1-mesa-glx \
    libjack-jackd2-0 \
    libjansson4 \
    libluajit-5.1-2 \
    libpulse0 \
    libqt5x11extras5 \
    libspeexdsp1 \
    libswresample3 \
    libswscale5 \
    libudev1 \
    libv4l-0 \
    libvlc5 \
    libx11-6  \
    libx264-155 \
    libxcb-shm0 \
    libxcb-xinerama0 \
    libxcomposite1 \
    libxinerama1 \
    pkg-config \
    python3 \
    libqt5core5a \
    libqt5svg5 \
    swig \
    libxcb-randr0 \
    libxcb-xfixes0 \
    libx11-xcb1 \
    libxcb1

# Setting local time
RUN apt-get install -y tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo Asia/Shanghai > /etc/timezone

# Git, Node
RUN apt-get install -y git nodejs npm

# Xorg dummy input/driver
RUN apt-get install -y xserver-xorg-input-void xserver-xorg-video-dummy
COPY xorg.conf /etc/xorg.conf
ENV DISPLAY :99

# Add Font
RUN mkdir -p /usr/share/fonts/truetype/{SimSun,SimHei,'Microsoft Yahei',Kaiti}
COPY fonts/SimSun.ttf /usr/share/fonts/truetype/SimSun.ttf
COPY fonts/SimHei.ttf /usr/share/fonts/truetype/SimHei.ttf
COPY fonts/Kaiti.ttf /usr/share/fonts/truetype/Kaiti.ttf
COPY fonts/'Microsoft Yahei.ttf' '/usr/share/fonts/truetype/Microsoft Yahei.ttf'

# Copy code
WORKDIR /node-app
COPY package.json package-lock.json tsconfig.json ./
COPY src src

# Install dependencies
RUN npm i -g typescript
RUN npm config set unsafe-perm true && \
    npm ci && \
    npm config set unsafe-perm false

# Build
RUN npm run build

ADD entrypoint.sh ./

ENTRYPOINT ["bash", "entrypoint.sh"]
CMD [ "npm", "start" ]
