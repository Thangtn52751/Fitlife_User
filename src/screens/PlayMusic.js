import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { API_SONG_URL } from '../redux/config';
const { width } = Dimensions.get('window');

export default function PlayerScreen({ route, navigation }) {
  const { song } = route.params;
  const audioUrl = API_SONG_URL + song.audio;
  const webviewRef = useRef(null);

  // State quản lý play/pause
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  // Lệnh JS gửi sang WebView control audio
  const playAudio = `audio.play(); true;`;
  const pauseAudio = `audio.pause(); true;`;
  const seekAudio = (time) => `audio.currentTime = ${time}; true;`;

  // Gửi lệnh sang WebView
  const onPlayPause = () => {
    if (isPlaying) {
      webviewRef.current.injectJavaScript(pauseAudio);
      setIsPlaying(false);
    } else {
      webviewRef.current.injectJavaScript(playAudio);
      setIsPlaying(true);
    }
  };

  // Khi WebView gửi event về RN (currentTime, duration)
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.duration !== undefined) setDuration(data.duration);
      if (data.current !== undefined) setCurrent(data.current);
    } catch { }
  };

  // Kéo thanh progress
  const handleSeek = (percent) => {
    const seekTime = duration * percent;
    webviewRef.current.injectJavaScript(seekAudio(seekTime));
    setCurrent(seekTime);
  };

  // Format mm:ss
  const formatTime = (sec) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // HTML cho WebView (ẩn controls, autoplay, gửi info ra ngoài)
  const html = `
    <html>
    <body style="margin:0;padding:0;">
      <audio id="audio" src="${audioUrl}" autoplay></audio>
      <script>
        var audio = document.getElementById('audio');
        function sendInfo() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            duration: audio.duration || 0, 
            current: audio.currentTime || 0
          }));
        }
        audio.ontimeupdate = sendInfo;
        audio.onloadedmetadata = sendInfo;
        true;
      </script>
    </body>
    </html>
  `;

  // Render lyric, mỗi dòng 1 Text
  const renderLyric = () => {
    if (!song.lyric) return <Text style={styles.lyricNone}>Không có lyric</Text>;
    return song.lyric.split('\n').map((line, i) => (
      <Text style={styles.lyricText} key={i}>{line}</Text>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
        <Text style={{ fontSize: 26 }}>←</Text>
      </TouchableOpacity>
      <Image source={{ uri: song.image }} style={styles.cover} />
      <Text style={styles.title}>{song.name}</Text>
      <Text style={styles.artist}>{song.singer}</Text>

      {/* Progress Bar */}
      <View style={styles.progressBox}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: (current / duration) * (width - 64) || 0 }]} />
        </View>
        <View style={styles.progressTextBox}>
          <Text style={styles.timeText}>{formatTime(current)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        {/* Seek by tap */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={(e) => {
            const percent = e.nativeEvent.locationX / (width - 64);
            handleSeek(percent);
          }}
        />
      </View>

      {/* Control buttons */}
      <View style={styles.iconWrapper}>
        <TouchableOpacity>
          <Image style={styles.controlImg} source={require('../assets/StepBack.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlayPause}>
          <View style={styles.playBtnBg}>
            <Image
              source={isPlaying ? require('../assets/Play.png') : require('../assets/Pause.png')}
              style={styles.playIcon}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={styles.controlImg} source={require('../assets/StepForward.png')} />
        </TouchableOpacity>
      </View>

      {/* Lyric */}
      <ScrollView style={styles.lyricScroll} contentContainerStyle={{ paddingBottom: 60 }}>
        {renderLyric()}
      </ScrollView>

      {/* WebView ẩn dùng để phát nhạc */}
      <WebView
        ref={webviewRef}
        source={{ html }}
        style={{ width: 0, height: 0, position: 'absolute' }}
        onMessage={handleMessage}
        javaScriptEnabled
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#191c24', alignItems: 'center', paddingTop: 36,
  },
  backBtn: {
    position: 'absolute', left: 12, top: 24, zIndex: 1,
  },
  cover: {
    width: 220, height: 220, borderRadius: 16, marginTop: 18, marginBottom: 18,
  },
  title: {
    color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 10,
  },
  artist: {
    color: '#aaa', fontSize: 16, marginBottom: 26,
  },
  progressBox: {
    width: width - 64, alignSelf: 'center', marginBottom: 14,
  },
  progressBarBg: {
    height: 4, backgroundColor: '#444', borderRadius: 2,
  },
  progressBar: {
    height: 4, backgroundColor: '#fff', borderRadius: 2,
    position: 'absolute', left: 0, top: 0,
  },
  progressTextBox: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 2,
  },
  timeText: {
    color: '#ccc', fontSize: 12,
  },
  controlBox: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 38,
  },
  controlIcon: {
    fontSize: 42, color: '#fff',
  },
  lyricScroll: {
    flex: 1, width: width - 40, marginTop: 28, marginBottom: 16, alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 8,
    maxHeight: 240,
  },
  lyricText: {
    color: '#fffa', fontSize: 16, lineHeight: 24, textAlign: 'center', marginVertical: 1,
  },
  lyricNone: {
    color: '#aaa', fontSize: 16, textAlign: 'center', marginVertical: 12,
  },
  iconWrapper: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 38,
  },
  controlImg: {
    width: 35, height: 35, tintColor: '#fff',
  },
  playBtnBg: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#fff', // Nền trắng
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, // Android shadow
    shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 2, height: 2 }, shadowRadius: 8,
  },
  playIcon: {
    width: 40, height: 40, tintColor: '#191c24',  // Play/Pause màu đậm nổi bật
  },
});
